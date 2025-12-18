import { useState } from 'react';
import { Button } from "@heroui/button";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Profile, HeaderRule, UrlFilter } from '../utils/types';
import { CustomInput } from './CustomInput';
import { RuleListCard } from './RuleListCard';
import { ImportDialog } from './ImportDialog';
import { ExportDialog } from './ExportDialog';
import { TopBar } from './TopBar';

interface HeaderEditorProps {
    profile: Profile;
    profiles: Profile[];
    currentProfileIndex: number;
    onUpdateProfile: (profile: Profile) => void;
    onImportProfiles: (profiles: Profile[]) => void;
}

export const HeaderEditor = ({ profile, profiles, currentProfileIndex, onUpdateProfile, onImportProfiles }: HeaderEditorProps) => {
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);

    const updateReqHeaders = (newHeaders: HeaderRule[]) => {
        onUpdateProfile({ ...profile, reqHeaders: newHeaders });
    };

    const updateRespHeaders = (newHeaders: HeaderRule[]) => {
        onUpdateProfile({ ...profile, respHeaders: newHeaders });
    };

    const updateUrlFilters = (newFilters: UrlFilter[]) => {
        onUpdateProfile({ ...profile, urlFilters: newFilters });
    };

    const handleImport = (data: Partial<Profile>) => {
        // Merge imported data with current profile
        const updatedProfile = { ...profile };

        if (data.reqHeaders) updatedProfile.reqHeaders = data.reqHeaders;
        if (data.respHeaders) updatedProfile.respHeaders = data.respHeaders;
        if (data.urlFilters) updatedProfile.urlFilters = data.urlFilters;
        if (data.title) updatedProfile.title = data.title;
        if (data.shortTitle) updatedProfile.shortTitle = data.shortTitle;
        if (data.color) updatedProfile.color = data.color;

        onUpdateProfile(updatedProfile);
    };

    const handleAddReqHeader = () => {
        const newHeader: HeaderRule = { enabled: true, name: '', value: '' };
        updateReqHeaders([...profile.reqHeaders, newHeader]);
    };

    const handleAddRespHeader = () => {
        const newHeader: HeaderRule = { enabled: true, name: '', value: '' };
        updateRespHeaders([...profile.respHeaders, newHeader]);
    };

    const handleAddUrlFilter = () => {
        const newFilter: UrlFilter = { enabled: true, urlRegex: '' };
        updateUrlFilters([...profile.urlFilters, newFilter]);
    };

    return (
        <div className="flex flex-col h-full bg-content2/30">
            <TopBar
                title={profile.title}
                color={profile.color}
                profileNumber={currentProfileIndex + 1}
                onAddReqHeader={handleAddReqHeader}
                onAddRespHeader={handleAddRespHeader}
                onAddUrlFilter={handleAddUrlFilter}
                onImportClick={() => setIsImportOpen(true)}
                onExportClick={() => setIsExportOpen(true)}
            />

            {/* Scroll Area */}
            <ScrollShadow className="flex-1 px-4 py-2 pb-20">
                <div className="flex flex-col gap-2 max-w-3xl mx-auto">
                    {profile.reqHeaders.length > 0 && (
                        <RuleListCard
                            title="Request Headers"
                            items={profile.reqHeaders}
                            onItemsChange={updateReqHeaders}
                            createItem={() => ({ enabled: true, name: '', value: '' })}
                            colorClass="bg-cyan-500"
                            renderItemContent={(item, index, onChange) => (
                                <div className="grid grid-cols-[1fr_1.5fr] gap-3">
                                    <CustomInput
                                        value={item.name}
                                        onValueChange={(v) => onChange({ ...item, name: v })}
                                        placeholder="Name"
                                        isInvalid={item.name.includes(' ')}
                                    />
                                    <CustomInput
                                        value={item.value}
                                        onValueChange={(v) => onChange({ ...item, value: v })}
                                        placeholder="Value"
                                    />
                                </div>
                            )}
                        />
                    )}

                    {profile.respHeaders.length > 0 && (
                        <RuleListCard
                            title="Response Headers"
                            items={profile.respHeaders}
                            onItemsChange={updateRespHeaders}
                            createItem={() => ({ enabled: true, name: '', value: '' })}
                            colorClass="bg-orange-500"
                            renderItemContent={(item, index, onChange) => (
                                <div className="grid grid-cols-[1fr_1.5fr] gap-3">
                                    <CustomInput
                                        value={item.name}
                                        onValueChange={(v) => onChange({ ...item, name: v })}
                                        placeholder="Name"
                                        isInvalid={item.name.includes(' ')}
                                    />
                                    <CustomInput
                                        value={item.value}
                                        onValueChange={(v) => onChange({ ...item, value: v })}
                                        placeholder="Value"
                                    />
                                </div>
                            )}
                        />
                    )}

                    {profile.urlFilters.length > 0 && (
                        <RuleListCard
                            title="URL Filters"
                            items={profile.urlFilters}
                            onItemsChange={updateUrlFilters}
                            createItem={() => ({ enabled: true, urlRegex: '' })}
                            colorClass="bg-purple-500"
                            renderItemContent={(item, index, onChange) => (
                                <CustomInput
                                    value={item.urlRegex}
                                    onValueChange={(v) => onChange({ ...item, urlRegex: v })}
                                    placeholder="URL Regex Filter"
                                />
                            )}
                        />
                    )}
                </div>
            </ScrollShadow>

            <ImportDialog
                isOpen={isImportOpen}
                onClose={() => setIsImportOpen(false)}
                onImport={handleImport}
                onImportProfiles={onImportProfiles}
            />

            <ExportDialog
                isOpen={isExportOpen}
                onClose={() => setIsExportOpen(false)}
                profiles={profiles}
                currentProfileIndex={currentProfileIndex}
            />
        </div>
    );
};
