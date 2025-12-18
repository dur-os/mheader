import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { RadioGroup, Radio } from "@heroui/radio";
import { useState } from "react";
import { Profile, HeaderRule, UrlFilter } from '../utils/types';
import { PROFILE_COLORS } from '../utils/storage';

type ImportType = 'default' | 'modheader';

interface ImportDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (data: Partial<Profile>) => void;
    onImportProfiles: (profiles: Profile[]) => void;
}

// Convert a single ModHeader profile to our format
const convertModHeaderProfile = (data: any, index: number): Profile => {
    const reqHeaders: HeaderRule[] = [];
    const respHeaders: HeaderRule[] = [];
    const urlFilters: UrlFilter[] = [];

    // ModHeader: headers = request headers
    if (Array.isArray(data.headers)) {
        for (const header of data.headers) {
            reqHeaders.push({
                enabled: header.enabled !== false,
                name: header.name || '',
                value: header.value || ''
            });
        }
    }

    // ModHeader: respHeaders = response headers
    if (Array.isArray(data.respHeaders)) {
        for (const header of data.respHeaders) {
            respHeaders.push({
                enabled: header.enabled !== false,
                name: header.name || '',
                value: header.value || ''
            });
        }
    }

    // ModHeader URL filters
    if (Array.isArray(data.urlFilters)) {
        for (const filter of data.urlFilters) {
            urlFilters.push({
                enabled: filter.enabled !== false,
                urlRegex: filter.urlRegex || filter.url || ''
            });
        }
    }

    return {
        title: data.title || `Imported Profile ${index + 1}`,
        shortTitle: data.shortTitle || `${index + 1}`,
        color: PROFILE_COLORS[index % PROFILE_COLORS.length],
        version: 1,
        reqHeaders,
        respHeaders,
        urlFilters
    };
};

// Convert ModHeader array format to our profiles
const convertModHeaderFormat = (data: any): Profile[] => {
    if (Array.isArray(data)) {
        return data.map((item, index) => convertModHeaderProfile(item, index));
    }
    // If it's a single object, wrap it
    return [convertModHeaderProfile(data, 0)];
};

// Convert default format to profiles (supports array or single object)
const convertDefaultFormat = (data: any): Profile[] => {
    if (Array.isArray(data)) {
        return data.map((item, index) => ({
            title: item.title || `Imported Profile ${index + 1}`,
            shortTitle: item.shortTitle || `${index + 1}`,
            color: item.color || PROFILE_COLORS[index % PROFILE_COLORS.length],
            version: 1,
            reqHeaders: item.reqHeaders || [],
            respHeaders: item.respHeaders || [],
            urlFilters: item.urlFilters || []
        }));
    }
    // Single object
    return [{
        title: data.title || 'Imported Profile',
        shortTitle: data.shortTitle || '1',
        color: data.color || PROFILE_COLORS[0],
        version: 1,
        reqHeaders: data.reqHeaders || [],
        respHeaders: data.respHeaders || [],
        urlFilters: data.urlFilters || []
    }];
};

export const ImportDialog = ({ isOpen, onClose, onImport, onImportProfiles }: ImportDialogProps) => {
    const [jsonText, setJsonText] = useState('');
    const [error, setError] = useState('');
    const [importType, setImportType] = useState<ImportType>('default');

    const handleImport = () => {
        try {
            const parsed = JSON.parse(jsonText);

            // Validate that it's an object or array
            if (typeof parsed !== 'object' || parsed === null) {
                setError('Invalid JSON: Expected an object or array');
                return;
            }

            // Clear any previous errors
            setError('');

            let profiles: Profile[];
            if (importType === 'modheader') {
                // ModHeader format - convert and append as new profiles
                profiles = convertModHeaderFormat(parsed);
            } else {
                // Default format - convert and append as new profiles
                profiles = convertDefaultFormat(parsed);
            }

            onImportProfiles(profiles);

            // Reset and close
            setJsonText('');
            setImportType('default');
            onClose();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Invalid JSON format');
        }
    };

    const handleClose = () => {
        setJsonText('');
        setError('');
        setImportType('default');
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
                    Import Profile Data
                </ModalHeader>
                <ModalBody>
                    <RadioGroup
                        label="Import Format"
                        orientation="horizontal"
                        value={importType}
                        onValueChange={(v) => setImportType(v as ImportType)}
                    >
                        <Radio value="default">Default</Radio>
                        <Radio value="modheader">ModHeader</Radio>
                    </RadioGroup>
                    <Textarea
                        label="JSON Data"
                        placeholder={importType === 'modheader'
                            ? 'Paste ModHeader export JSON here...'
                            : 'Paste your JSON here, e.g. {"reqHeaders": [...], "respHeaders": [...], "urlFilters": [...]}'}
                        value={jsonText}
                        onValueChange={setJsonText}
                        minRows={12}
                        maxRows={12}
                        isInvalid={!!error}
                        errorMessage={error}
                        classNames={{
                            input: "font-mono text-sm"
                        }}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="danger"
                        variant="light"
                        onPress={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        onPress={handleImport}
                        isDisabled={!jsonText.trim()}
                    >
                        Import
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
