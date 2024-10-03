import React from 'react';
import SettingsModpack from './SettingsModpack';
import { Settings as SettingsType } from './Settings';
import './Settings.css';

interface SettingsProps {
  settings: SettingsType;
  setSettings: React.Dispatch<React.SetStateAction<SettingsType>>;
}

export interface Settings {
  modpack: string;
}

const Settings: React.FC<SettingsProps> = ({ settings, setSettings }) => {
  return (
    <div className="settings">
      <h2>Settings</h2>
      <SettingsModpack settings={settings} setSettings={setSettings} />
      {/* You can add more settings components here */}
    </div>
  );
};

export default Settings;
