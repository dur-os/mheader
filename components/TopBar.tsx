import { Button } from "@heroui/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import {
    Plus,
    MoreVertical,
    ExternalLink,
    Upload,
} from "lucide-react";

interface TopBarProps {
    title: string;
    color: string;
    profileNumber?: number;
    onAddReqHeader: () => void;
    onAddRespHeader: () => void;
    onAddUrlFilter: () => void;
    onImportClick: () => void;
    onExportClick: () => void;
}

export const TopBar = ({
    title,
    color,
    profileNumber = 1,
    onAddReqHeader,
    onAddRespHeader,
    onAddUrlFilter,
    onImportClick,
    onExportClick,
}: TopBarProps) => {
    return (
        <div
            className="h-14 px-4 flex items-center justify-between shadow-sm z-10 shrink-0 mb-2 relative"
            style={{ backgroundColor: color, color: '#fff' }}
        >
            <div className="flex items-center gap-3">
                <div className="flex flex-col leading-none">
                    <span className="w-6 h-6 rounded-full border border-white/40 flex items-center justify-center text-xs mb-0.5">
                        {profileNumber}
                    </span>
                </div>
                <span className="font-semibold text-lg tracking-wide">{title}</span>
            </div>

            <div className="flex items-center gap-1 relative">
                {/* Add Menu */}
                <Dropdown>
                    <DropdownTrigger>
                        <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            className="text-white/80 hover:text-white hover:bg-white/10"
                            radius="full"
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Add Actions">
                        <DropdownItem key="req" onPress={onAddReqHeader}>Add Request Header</DropdownItem>
                        <DropdownItem key="resp" onPress={onAddRespHeader}>Add Response Header</DropdownItem>
                        <DropdownItem key="url" onPress={onAddUrlFilter}>Add URL Filter</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    className="text-white/80 hover:text-white hover:bg-white/10"
                    radius="full"
                    onPress={onExportClick}
                >
                    <ExternalLink className="w-4 h-4" />
                </Button>
                <Dropdown>
                    <DropdownTrigger>
                        <Button isIconOnly variant="light" size="sm" className="text-white/80 hover:text-white hover:bg-white/10" radius="full">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="More Actions">
                        <DropdownItem key="import" startContent={<Upload className="w-4 h-4" />} onPress={onImportClick}>
                            Import
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
    );
};
