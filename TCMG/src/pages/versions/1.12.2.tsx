import React, { useState } from 'react';
import Navbar from '@components/navbar/Navbar';
import Materials from '@components/materials/Materials';
import ModifierAccordion from '@components/modifiers/ModifierAccordion';
import ToolBuilder from '@components/builder/ToolBuilder';
import './1.12.2.css';

// Import types from ToolBuilder or define them here
import { Material, BuiltTool } from '@components/builder/ToolBuilder';

const Version1_12_2: React.FC = () => {
  const [activeTab, setActiveTab] = useState('materials');

  // Add state variables for selectedTool, selectedMaterials, and builtTools
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<Array<Material | null>>([]);
  const [builtTools, setBuiltTools] = useState<BuiltTool[]>([]);

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
      </div>
      <div className="tab-content">
        {activeTab === 'materials' && <Materials version="1.12.2" />}
        {activeTab === 'tool-builder' && (
          <ToolBuilder
            version="1.12.2"
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
            selectedMaterials={selectedMaterials}
            setSelectedMaterials={setSelectedMaterials}
            builtTools={builtTools}
            setBuiltTools={setBuiltTools}
          />
        )}
        {activeTab === 'modifiers' && <ModifierAccordion />}
      </div>
    </div>
  );
};

export default Version1_12_2;
