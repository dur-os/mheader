import { ReactNode } from "react";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Plus, Trash2 } from "lucide-react";

interface RuleListCardProps<T extends { enabled: boolean }> {
    title: string;
    items: T[];
    onItemsChange: (items: T[]) => void;
    renderItemContent: (item: T, index: number, onChange: (val: T) => void) => ReactNode;
    createItem: () => T;
    colorClass?: string;
    addItemLabel?: string;
}

export const RuleListCard = <T extends { enabled: boolean }>({
    title,
    items,
    onItemsChange,
    renderItemContent,
    createItem,
    colorClass = "bg-default-500",
    addItemLabel
}: RuleListCardProps<T>) => {
    const finalAddItemLabel = addItemLabel || `Add ${title}`;

    const toggleAll = () => {
        const allEnabled = items.length > 0 && items.every(i => i.enabled);
        onItemsChange(items.map(i => ({ ...i, enabled: !allEnabled })));
    };

    const addItem = () => {
        onItemsChange([...items, createItem()]);
    };

    const toggleItem = (index: number) => {
        onItemsChange(items.map((item, i) => i === index ? { ...item, enabled: !item.enabled } : item));
    };

    const updateItem = (index: number, newItem: T) => {
        onItemsChange(items.map((item, i) => i === index ? newItem : item));
    };

    const removeItem = (index: number) => {
        onItemsChange(items.filter((_, i) => i !== index));
    };

    const allEnabled = items.length > 0 && items.every(i => i.enabled);
    const isIndeterminate = items.some(i => i.enabled) && !allEnabled;

    return (
        <div className="mb-4 bg-content1 shadow-sm border border-default-200 rounded-medium overflow-hidden">
            <div className="flex justify-between items-center px-3 py-3 border-b border-divider bg-content2/50">
                <div className="flex items-center gap-3">
                    <Checkbox
                        isSelected={allEnabled}
                        isIndeterminate={isIndeterminate}
                        onValueChange={toggleAll}
                        color="success"
                        size="md"
                        className="mr-1"
                        radius="sm"
                    />
                    <div className="flex items-center gap-2">
                        <div className={`w-1 h-4 rounded-full ${colorClass}`}></div>
                        <span className="font-semibold text-small tracking-wider opacity-80">{title}</span>
                        <span className="bg-default-100 text-default-500 text-tiny px-2 py-0.5 rounded-full font-mono">{items.length}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button isIconOnly size="sm" variant="light" className="text-default-500 hover:text-primary" onPress={addItem}>
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <div className="p-0">
                <div className="flex flex-col">
                    {items.map((item, index) => (
                        <div key={index} className="group flex items-center gap-2 py-2 px-3 hover:bg-content2/30 transition-colors">
                            <Checkbox
                                isSelected={item.enabled}
                                onValueChange={() => toggleItem(index)}
                                color="success"
                                size="md"
                                className="mr-1"
                                radius="sm"
                            />
                            <div className="flex-1">
                                {renderItemContent(item, index, (updatedItem) => updateItem(index, updatedItem))}
                            </div>
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                className="opacity-0 group-hover:opacity-100 text-danger"
                                onPress={() => removeItem(index)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                    <div
                        className="flex items-center gap-2 p-3 hover:bg-content2/30 transition-colors cursor-pointer text-default-400 hover:text-primary active:bg-content2/50 text-sm font-medium"
                        onClick={addItem}
                    >
                        <Plus className="w-4 h-4" />
                        <span>{finalAddItemLabel}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
