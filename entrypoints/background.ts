import { updateDynamicRules } from '../utils/storage';

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  browser.runtime.onInstalled.addListener(() => {
    updateDynamicRules();
    console.log('Extension installed.');
  });

  browser.runtime.onStartup.addListener(() => {
    updateDynamicRules();
    console.log('Extension started.');
  });

  // Listen for storage changes to update rules dynamically
  browser.storage.onChanged.addListener((changes, areaName) => {
    console.log("storage.onChanged", changes, areaName);

    if (areaName === 'sync' && changes.profiles) {
      updateDynamicRules();
    }

    if (areaName === 'local' && changes.settings) {
      const newSettings = changes.settings.newValue;
      const oldSettings = changes.settings.oldValue;

      if (!oldSettings || newSettings.disabled !== oldSettings.disabled || newSettings.activeProfileIndex !== oldSettings.activeProfileIndex) {
        updateDynamicRules();
      }
    }
  });
});
