export interface HeaderRule {
    enabled: boolean;
    name: string;
    value: string;
}

export interface UrlFilter {
    enabled: boolean;
    urlRegex: string;
}

export interface Profile {
    title: string;
    shortTitle: string;
    color: string;
    version: number;
    reqHeaders: HeaderRule[];
    respHeaders: HeaderRule[];
    urlFilters: UrlFilter[];
}

export interface Settings {
    activeProfileIndex: number;
    theme: string;
    disabled: boolean;
}