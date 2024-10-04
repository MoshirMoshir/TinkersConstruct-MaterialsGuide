import React, { useState } from 'react';
import Navbar from '@components/navbar/Navbar';
import Materials from '@components/materials/Materials';
import ModifierAccordion from '@components/modifiers/ModifierAccordion';
import ToolBuilder from '@components/builder/ToolBuilder';
import Settings from '@components/settings/Settings';
import { Material, BuiltTool } from '@components/builder/ToolBuilder';
import { Settings as SettingsType } from '@components/settings/Settings';
import { Gear } from 'react-bootstrap-icons';
import './1.12.2.css';

const Version1_12_2: React.FC = () => {
  const [activeTab, setActiveTab] = useState('materials');
  const [selectedTool, setSelectedTool] = useState<string | null>('Katana');
  const [selectedMaterials, setSelectedMaterials] = useState<Array<Material | null>>([]);
  const [builtTools, setBuiltTools] = useState<BuiltTool[]>([]);
  const [settings, setSettings] = useState<SettingsType>({ modpack: 'None' });

  return (
    <div className="version-page">
      <Navbar />
      <div className="tabs">
        <button
          className={activeTab === 'materials' ? 'active' : ''}
          onClick={() => setActiveTab('materials')}
        >
          Materials
        </button>
        <button
          className={activeTab === 'tool-builder' ? 'active' : ''}
          onClick={() => setActiveTab('tool-builder')}
        >
          Tool Builder
        </button>
        <button
          className={activeTab === 'modifiers' ? 'active' : ''}
          onClick={() => setActiveTab('modifiers')}
        >
          Modifiers
        </button>
        <button
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          <Gear />
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 'materials' && <Materials version="1.12.2" settings={settings} />}
        {activeTab === 'tool-builder' && (
          <ToolBuilder
            version="1.12.2"
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
            selectedMaterials={selectedMaterials}
            setSelectedMaterials={setSelectedMaterials}
            builtTools={builtTools}
            setBuiltTools={setBuiltTools}
            settings={settings}
          />
        )}
        {activeTab === 'modifiers' && <ModifierAccordion />}
        {activeTab === 'settings' && <Settings settings={settings} setSettings={setSettings} version="1.12.2"/>}
      </div>
    </div>
  );
};

export default Version1_12_2;
