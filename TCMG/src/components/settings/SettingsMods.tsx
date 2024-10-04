import React, { useState, useEffect } from 'react';
import './SettingsMods.css';

interface ModOption {
  name: string;
  checked: boolean;
}

interface SettingsModsProps {
  version: string;
  onModSelectionChange: (selectedMods: string[]) => void;
}

const SettingsMods: React.FC<SettingsModsProps> = ({ version, onModSelectionChange }) => {
  const [modOptions, setModOptions] = useState<ModOption[]>([]);

  useEffect(() => {
    console.log('useEffect triggered');
    let isMounted = true;
    const fetchMaterialsData = async () => {
      try {
        const response = await fetch(`/assets/${version}.json`);
        if (response.ok) {
          const materialsData = await response.json();
          console.log('Received materials data:', materialsData);

          // Extract unique mods from the materials list
          const uniqueMods = Array.from(new Set(materialsData.map((material: { mod: string }) => material.mod))) as string[];
          console.log('Unique mods extracted:', uniqueMods);

          const initialModOptions = uniqueMods.map((mod) => ({ name: mod, checked: false }));
          console.log('Initial mod options:', initialModOptions);

          if (isMounted) {
            setModOptions(initialModOptions);
          }
        } else {
          console.error('Failed to fetch materials data');
        }
      } catch (error) {
        console.error('Error fetching materials data:', error);
      }
    };

    if (version) {
      fetchMaterialsData();
    }
    return () => {
      isMounted = false;
    };
  }, [version]);

  const handleCheckboxChange = (index: number) => {
    setModOptions((prevOptions) => {
      const updatedOptions = prevOptions.map((option, i) =>
        i === index ? { ...option, checked: !option.checked } : option
      );
      console.log('Updated mod options:', updatedOptions);
      const selectedMods = updatedOptions.filter((option) => !option.checked).map((option) => option.name);
      onModSelectionChange(selectedMods);
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