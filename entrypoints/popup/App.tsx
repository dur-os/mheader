import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Sidebar } from '@/components/Sidebar';
import { HeaderEditor } from '@/components/HeaderEditor';
import { Profile, HeaderRule } from '../../utils/types';
import { getProfiles, getSettings, saveProfiles, saveSettings, initStorage, createProfile, PROFILE_COLORS } from '../../utils/storage';
import { useTheme } from "next-themes";

function App() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState<number>(0);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const init = async () => {
      await initStorage();
      const loadedProfiles = await getProfiles();
      const loadedSettings = await getSettings();

      setProfiles(loadedProfiles);
      if (loadedSettings.activeProfileIndex !== undefined && loadedSettings.activeProfileIndex >= 0 && loadedSettings.activeProfileIndex < loadedProfiles.length) {
        setCurrentProfileIndex(loadedSettings.activeProfileIndex);
      } else if (loadedProfiles.length > 0) {
        setCurrentProfileIndex(0);
      }
      setDisabled(!!loadedSettings.disabled);

      // Load saved theme
      if (loadedSettings.theme) {
        setTheme(loadedSettings.theme);
      } else {
        setTheme('light'); // Default
      }

      setLoading(false);
    };
    init();
  }, []);

  // Save settings when active profile, disabled state, or theme changes
  useEffect(() => {
    if (!loading) {
      getSettings().then(settings => {
        saveSettings({
          ...settings,
          activeProfileIndex: currentProfileIndex,
          disabled: disabled,
          theme: theme as 'light' | 'dark'
        });
      });
    }
  }, [currentProfileIndex, disabled, theme, loading]);

  const currentProfile = profiles[currentProfileIndex] || profiles[0];

  const handleUpdateProfile = (updatedProfile: Profile) => {
    const updatedProfiles = profiles.map((p, index) =>
      index === currentProfileIndex
        ? updatedProfile
        : p
    );
    setProfiles(updatedProfiles);
    saveProfiles(updatedProfiles);
  };

  const handleAddProfile = () => {
    // Generate new profile title based on count + 1 so it increases
    const newProfile = createProfile(profiles.length);
    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    saveProfiles(updatedProfiles);
    setCurrentProfileIndex(updatedProfiles.length - 1);
  };

  const handleImportProfiles = (newProfiles: Profile[]) => {
    // Append imported profiles to existing profiles
    const updatedProfiles = [...profiles, ...newProfiles];
    setProfiles(updatedProfiles);
    saveProfiles(updatedProfiles);
    // Switch to first imported profile
    if (newProfiles.length > 0) {
      setCurrentProfileIndex(profiles.length);
    }
  };

  const handleDeleteProfile = (index: number) => {
    if (profiles.length <= 1) {
      // Prevent deleting the last profile
      return;
    }

    // Deleting profile at index
    const newProfiles = profiles.filter((_, i) => i !== index);
    setProfiles(newProfiles);
    saveProfiles(newProfiles);

    // Update selection if needed
    // If we deleted the current profile, or a profile BEFORE it, we need to adjust index
    if (index === currentProfileIndex) {
      // If deleted current, try to stay on same index (which is now next item), 
      // unless it was last item, then go to previous
      if (index >= newProfiles.length) {
        setCurrentProfileIndex(newProfiles.length - 1);
      }
    } else if (index < currentProfileIndex) {
      // Deleted something before current, shift back one
      setCurrentProfileIndex(currentProfileIndex - 1);
    }
  };

  if (loading || !currentProfile) {
    return <div className="h-full w-full flex items-center justify-center">Loading...</div>;
  }

  return (
    <Layout
      isDisabled={disabled}
      onEnable={() => setDisabled(false)}
      sidebar={
        <Sidebar
          profiles={profiles}
          currentProfileIndex={currentProfileIndex}
          onSelectProfile={setCurrentProfileIndex}
          disabled={disabled}
          onToggleDisabled={() => setDisabled(!disabled)}
          onAddProfile={handleAddProfile}
          onDeleteProfile={handleDeleteProfile}
          onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        />
      }
    >
      <HeaderEditor
        profile={currentProfile}
        profiles={profiles}
        currentProfileIndex={currentProfileIndex}
        onUpdateProfile={handleUpdateProfile}
        onImportProfiles={handleImportProfiles}
      />
    </Layout>
  );
}

export default App;
