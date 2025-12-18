import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import { useState, useEffect } from "react";
import { Profile } from '../utils/types';

interface ExportDialogProps {
    isOpen: boolean;
    onClose: () => void;
    profiles: Profile[];
    currentProfileIndex: number;
}

export const ExportDialog = ({ isOpen, onClose, profiles, currentProfileIndex }: ExportDialogProps) => {
    const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set([currentProfileIndex]));
    const [jsonOutput, setJsonOutput] = useState('');

    // Update selection when dialog opens
    useEffect(() => {
        if (isOpen) {
            setSelectedIndices(new Set([currentProfileIndex]));
        }
    }, [isOpen, currentProfileIndex]);

    // Generate JSON output when selection changes
    useEffect(() => {
        const selectedProfiles = profiles.filter((_, index) => selectedIndices.has(index));
        if (selectedProfiles.length === 0) {
            setJsonOutput('');
        } else if (selectedProfiles.length === 1) {
            setJsonOutput(JSON.stringify(selectedProfiles[0], null, 2));
        } else {
            setJsonOutput(JSON.stringify(selectedProfiles, null, 2));
        }
    }, [selectedIndices, profiles]);

    const toggleProfile = (index: number) => {
        const newSet = new Set(selectedIndices);
        if (newSet.has(index)) {
            newSet.delete(index);
        } else {
            newSet.add(index);
        }
        setSelectedIndices(newSet);
    };

    const selectAll = () => {
        setSelectedIndices(new Set(profiles.map((_, i) => i)));
    };

    const selectNone = () => {
        setSelectedIndices(new Set());
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(jsonOutput);
        } catch (e) {
            console.error('Failed to copy:', e);
        }
    };

    const handleClose = () => {
        setSelectedIndices(new Set([currentProfileIndex]));
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="2xl"
            scrollBehavior="inside"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    Export Profiles
                </ModalHeader>
                <ModalBody>
                    <div className="flex gap-4 min-h-[300px]">
                        {/* Left: Profile Selection */}
                        <div className="flex flex-col gap-3 w-1/3 shrink-0">
                            <Checkbox
                                isSelected={selectedIndices.size === profiles.length}
                                isIndeterminate={selectedIndices.size > 0 && selectedIndices.size < profiles.length}
                                onValueChange={(checked) => checked ? selectAll() : selectNone()}
                                classNames={{
                                    base: "inline-flex w-full bg-content1 m-0 hover:bg-content2 items-center justify-start cursor-pointer rounded-lg gap-2 p-2 border-2 border-transparent",
                                    label: "w-full"
                                }}
                            >
                                <span className="text-sm font-medium">Profiles</span>
                            </Checkbox>
                            <div className="flex flex-col gap-2 overflow-y-auto flex-1">
                                {profiles.map((profile, index) => (
                                    <Checkbox
                                        key={index}
                                        isSelected={selectedIndices.has(index)}
                                        onValueChange={() => toggleProfile(index)}
                                        classNames={{
                                            base: "inline-flex w-full bg-content1 m-0 hover:bg-content2 items-center justify-start cursor-pointer rounded-lg gap-2 p-2 border-2 border-transparent",
                                            label: "w-full"
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-4 h-4 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: profile.color }}
                                            />
                                            <span className="text-sm truncate">{profile.title}</span>
                                        </div>
                                    </Checkbox>
                                ))}
                            </div>
                        </div>
                        {/* Right: JSON Output */}
                        <div className="flex-1 flex flex-col">
                            <Textarea
                                label="JSON Output"
                                isReadOnly
                                value={jsonOutput}
                                minRows={15}
                                maxRows={15}
                                classNames={{
                                    base: "h-full",
                                    inputWrapper: "h-full",
                                    input: "font-mono text-sm"
                                }}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="danger"
                        variant="light"
                        onPress={handleClose}
                    >
                        Close
                    </Button>
                    <Button
                        color="primary"
                        onPress={handleCopy}
                        isDisabled={!jsonOutput}
                    >
                        Copy to Clipboard
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
