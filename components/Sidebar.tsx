import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Settings, FileJson, Info, Sun, Moon, Power, Plus, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";

interface SidebarProps {
    profiles: Array<{ title: string; color: string }>;
    currentProfileIndex: number;
    onSelectProfile: (index: number) => void;
    disabled: boolean;
    onToggleDisabled: () => void;
    onAddProfile: () => void;
    onDeleteProfile: (index: number) => void;
    onToggleTheme: () => void;
}

export const Sidebar = ({ profiles, currentProfileIndex, onSelectProfile, disabled, onToggleDisabled, onAddProfile, onDeleteProfile, onToggleTheme }: SidebarProps) => {
    const { theme } = useTheme();

    return (
        <div className="flex flex-col h-full w-full items-center justify-between py-2">
            <ScrollShadow className="flex-1 w-full" hideScrollBar>
                <div className="flex flex-col gap-3 w-full items-center px-1 pb-2 pt-2">
                    {profiles.map((profile, index) => (
                        <Dropdown key={index}>
                            <DropdownTrigger>
                                <div className="relative pointer-events-none">
                                    <Tooltip content={profile.title} placement="right">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelectProfile(index);
                                            }}
                                            onContextMenu={(e) => {
                                                e.preventDefault();
                                                // Programmatically trigger the dropdown (which listens on parent div)
                                                e.currentTarget.parentElement?.click();
                                            }}
                                            className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium transition-transform duration-200 pointer-events-auto
                        ${currentProfileIndex === index ? "ring-2 ring-offset-1 ring-primary scale-105" : "hover:scale-105 opacity-80 hover:opacity-100"}
                      `}
                                            style={{ backgroundColor: profile.color, color: "#fff" }}
                                        >
                                            {index + 1}
                                        </button>
                                    </Tooltip>
                                </div>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Profile Actions">
                                <DropdownItem
                                    key="delete"
                                    className="text-danger"
                                    color="danger"
                                    startContent={<Trash2 className="w-4 h-4" />}
                                    onPress={() => onDeleteProfile(index)}
                                >
                                    Delete Profile
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    ))}
                    <Tooltip content="Create New Profile" placement="right">
                        <button
                            onClick={onAddProfile}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-default-500 hover:text-default-900 dark:hover:text-default-100 hover:bg-default-100 dark:hover:bg-default-800 transition-all border-2 border-dashed border-default-300"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </Tooltip>
                </div>
            </ScrollShadow>

            <div className="flex flex-col gap-2 w-full items-center mb-2 mt-2 shrink-0">
                <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    radius="full"
                    onPress={onToggleTheme}
                >
                    {theme === "dark" ? (
                        <Sun className="w-5 h-5 text-default-500" />
                    ) : (
                        <Moon className="w-5 h-5 text-default-500" />
                    )}
                </Button>
                <Tooltip content={disabled ? "Enable Extension" : "Disable Extension"} placement="right">
                    <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        radius="full"
                        onPress={onToggleDisabled}
                    >
                        <Power className={`w-5 h-5 ${disabled ? 'text-default-500' : 'text-success'}`} />
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
};
