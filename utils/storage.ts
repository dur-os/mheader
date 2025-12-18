import { number } from 'framer-motion';
import { Profile, Settings, HeaderRule } from './types';

// 10 distinct colors for profiles
export const PROFILE_COLORS = [
    '#8B5CF6', // Violet
    '#EF4444', // Red
    '#10B981', // Emerald
    '#3B82F6', // Blue
    '#F59E0B', // Amber
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#84CC16', // Lime
    '#F97316', // Orange
];


// Helper to create a new profile
export const createProfile = (index: number): Profile => {
    const id = index + 1;
    return {
        title: `Profile ${id}`,
        shortTitle: `${id}`,
        color: PROFILE_COLORS[index % PROFILE_COLORS.length],
        version: 1,
        reqHeaders: [{ enabled: true, name: '', value: '' }],
        respHeaders: [],
        urlFilters: []
    };
};

const DEFAULT_PROFILES: Profile[] = [
    createProfile(0)
];

const DEFAULT_SETTINGS: Settings = {
    activeProfileIndex: 0,
    theme: 'light',
    disabled: false
};

export const getProfiles = async (): Promise<Profile[]> => {
    const data = await browser.storage.sync.get('profiles');
    return (data.profiles as Profile[]) || DEFAULT_PROFILES;
};

export const saveProfiles = async (profiles: Profile[]) => {
    console.log("saveProfiles", profiles);
    await browser.storage.sync.set({ profiles });
};

export const getSettings = async (): Promise<Settings> => {
    const data = await browser.storage.local.get('settings');
    return (data.settings as Settings) || DEFAULT_SETTINGS;
};

export const saveSettings = async (settings: Settings) => {
    await browser.storage.local.set({ settings });
};

export const updateDynamicRules = async () => {
    try {
        const settings = await getSettings();
        const profiles = await getProfiles();

        if (settings.disabled || settings.activeProfileIndex < 0 || settings.activeProfileIndex >= profiles.length) {
            // Remove all rules if disabled or invalid profile
            const currentRules = await browser.declarativeNetRequest.getDynamicRules();
            const ruleIds = currentRules.map(rule => rule.id);
            await browser.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: ruleIds
            });
            browser.action.setIcon({ path: "icons/128w.png" });
            browser.action.setBadgeText({ text: undefined });
            return;
        }

        const activeProfile = profiles[settings.activeProfileIndex];
        let ruleId = 1;
        const addRules: any[] = [];

        // Aggregate Request Headers
        const requestHeaders = activeProfile.reqHeaders
            .filter(h => h.enabled && h.name && !h.name.includes(' '))
            .map(h => ({ header: h.name, operation: 'set', value: h.value || '' }));

        // Aggregate Response Headers
        const responseHeaders = activeProfile.respHeaders
            .filter(h => h.enabled && h.name && !h.name.includes(' '))
            .map(h => ({ header: h.name, operation: 'set', value: h.value || '' }));

        let enabledFiltersCount = 0;
        if (requestHeaders.length > 0 || responseHeaders.length > 0) {
            const action = {
                type: 'modifyHeaders',
                requestHeaders: requestHeaders.length > 0 ? requestHeaders : undefined,
                responseHeaders: responseHeaders.length > 0 ? responseHeaders : undefined
            };

            const hasEnabledFilters = activeProfile.urlFilters.some(f => f.enabled);
            if (!hasEnabledFilters) {
                // No filters active, apply globally
                addRules.push({
                    id: ruleId++,
                    priority: 1,
                    action: action,
                    condition: {
                        urlFilter: "|http*://*/*",
                        resourceTypes: ['main_frame', 'sub_frame', 'stylesheet', 'script', 'image', 'font', 'object', 'xmlhttprequest', 'ping', 'csp_report', 'media', 'websocket', 'other']
                    }
                });
            } else {
                // Apply only for valid filters (non-empty)
                const validUrlFilters = activeProfile.urlFilters.filter(f => f.enabled && f.urlRegex);
                enabledFiltersCount = validUrlFilters.length;
                validUrlFilters.forEach(filter => {
                    addRules.push({
                        id: ruleId++,
                        priority: 1,
                        action: action,
                        condition: {
                            regexFilter: filter.urlRegex,
                            resourceTypes: ['main_frame', 'sub_frame', 'stylesheet', 'script', 'image', 'font', 'object', 'xmlhttprequest', 'ping', 'csp_report', 'media', 'websocket', 'other']
                        }
                    });
                });
            }
        }
        const currentRules = await browser.declarativeNetRequest.getDynamicRules();
        const removeRuleIds = currentRules.map(rule => rule.id);

        await browser.declarativeNetRequest.updateDynamicRules({
            removeRuleIds,
            addRules
        });
        browser.action.setIcon({ path: "icons/128.png" });
        const count = requestHeaders.length + responseHeaders.length + enabledFiltersCount;
        if (count > 0) {
            browser.action.setBadgeText({ text: count.toString() });
            browser.action.setBadgeBackgroundColor({ color: "#e306060f" });
        } else {
            browser.action.setBadgeText({ text: undefined });
        }
        console.log("updateDynamicRules", addRules, browser.runtime.lastError);
    } catch (e) {
        console.error("Failed to update dynamic rules:", e);
    }
};

export const initStorage = async () => {
    const profiles = await browser.storage.sync.get('profiles');
    if (!profiles.profiles) {
        await browser.storage.sync.set({ profiles: DEFAULT_PROFILES });
    }

    const settings = await browser.storage.local.get('settings');
    if (!settings.settings) {
        await browser.storage.local.set({ settings: DEFAULT_SETTINGS });
    }

    await updateDynamicRules();
};
