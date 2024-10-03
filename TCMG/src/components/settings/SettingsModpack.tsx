import React, { useState, useEffect } from 'react';
import { Settings as SettingsType } from './Settings';
import './SettingsModpack.css';

interface SettingsModpackProps {
  settings: SettingsType;
  setSettings: React.Dispatch<React.SetStateAction<SettingsType>>;
}

interface ModpackOption {
  label: string;
  value: string;
}

const SettingsModpack: React.FC<SettingsModpackProps> = ({ settings, setSettings }) => {
  const [modpackOptions, setModpackOptions] = useState<ModpackOption[]>([]);

  useEffect(() => {
    const fetchModpacks = async () => {
      try {
        const response = await fetch('/assets/modpacks/modpacks.json');
        if (response.ok) {
          const modpackList = await response.json(); // ['MCEternal.json', 'AnotherModpack.json']
          const options = modpackList.map((filename: string) => ({
            label: filename.replace('.json', ''),
            value: filename.replace('.json', ''),
          }));
          // Add 'None' option at the top
          setModpackOptions([{ label: 'None', value: 'None' }, ...options]);
        } else {
          console.error('Error fetching modpack list');
        }
      } catch (error) {
        console.error('Error fetching modpack list:', error);
      }
    };

    fetchModpacks();
  }, []);

  const handleModpackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, modpack: event.target.value });
  };

  return (
    <div className="settings-modpack">
      <div className="modpack-box">
        <h3>Select Modpack</h3>
        <div className="modpack-options">
          {modpackOptions.map((option) => (
            <div key={option.value} className="modpack-option">
              <input
                type="radio"
                id={`modpack-${option.value}`}
                name="modpack"
                value={option.value}
                checked={settings.modpack === option.value}
                onChange={handleModpackChange}
              />
              <label htmlFor={`modpack-${option.value}`}>{option.label}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsModpack;
