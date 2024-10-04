import SettingsModpack from '@components/settings/SettingsModpack';
import SettingsMods from '@components/settings/SettingsMods';
import './Settings.css';
import { Settings as SettingsType } from './Settings';

interface SettingsProps {
  settings: SettingsType;
  setSettings: React.Dispatch<React.SetStateAction<SettingsType>>;
  version: string;
}

export interface Settings {
  modpack: string;
  selectedMods: string[];
}

const Settings: React.FC<SettingsProps> = ({ settings, setSettings, version }) => {

  return (
    <div className="settings">
      <h1>Settings</h1>
      <br/>
      <SettingsModpack settings={settings} setSettings={setSettings} />
      <SettingsMods settings={settings} setSettings={setSettings} version={version}/>
    </div>
  );
};

export default Settings;