import React, { useState, useEffect } from 'react';
import { Settings as SettingsType } from './Settings';
import './SettingsMods.css';

interface SettingsModsProps {
    settings: SettingsType;
    setSettings: React.Dispatch<React.SetStateAction<SettingsType>>;
    version: string;
  }

interface ModOption {
  name: string;
  checked: boolean;
}

const SettingsMods: React.FC<SettingsModsProps> = ({ settings, setSettings, version }) => {
  const [modOptions, setModOptions] = useState<ModOption[]>([]);

  useEffect(() => {
    const fetchMaterialsData = async () => {
      try {
        const response = await fetch(`/assets/${version}.json`);
        if (response.ok) {
          const materialsData = await response.json();
          // Extract unique mods from the materials list
          const uniqueMods = Array.from(new Set(materialsData.map((material: { mod: string }) => material.mod))) as string[];

          if (settings.selectedMods === undefined) {
            const initialModOptions = uniqueMods.map((mod) => ({ name: mod, checked: false }));
            setModOptions(initialModOptions);
          } else {
            const initialModOptions = uniqueMods.map((mod) => ({
              name: mod,
              checked: !settings.selectedMods.includes(mod),
            }));
            setModOptions(initialModOptions);
          }
        } else {
          console.error('Failed to fetch materials data');
        }
      } catch (error) {
        console.error('Error fetching materials data:', error);
      }
    };

      fetchMaterialsData();
  }, [version]);

  const handleCheckboxChange = (index: number) => {
    setModOptions((prevOptions) => {
      const updatedOptions = prevOptions.map((option, i) =>
        i === index ? { ...option, checked: !option.checked } : option
      );
      console.log('Updated mod options:', updatedOptions);
      const selectedMods = updatedOptions.filter((option) => !option.checked).map((option) => option.name);
      setSettings({ ...settings, selectedMods });
      return updatedOptions;
    });
  };

  return (
    <div className="settings-mods">
      <h2>Mods Settings</h2>
      <p>Select the mods you want to exclude:</p>
      <div className="mods-list">
        {modOptions.map((mod, index) => (
          <label key={mod.name} className="mod-option">
            <input
              type="checkbox"
              checked={mod.checked}
              onChange={() => handleCheckboxChange(index)}
            />
            {mod.name}
          </label>
        ))}
      </div>
    </div>
  );
};

export default SettingsMods;