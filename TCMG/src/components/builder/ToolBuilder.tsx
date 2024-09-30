import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Builder1_12_2 from '@components/builder/Builder1_12_2'; // Import the updated calculation logic
import './ToolBuilder.css';

export interface Material {
  name: string;
  head?: {
    durability: number;
    speed: number;
    attack: number;
    modifiers: string[];
  };
  handle?: {
    durability: number;
    modifier: number;
    modifiers: string[];
  };
  extra?: {
    durability: number;
    modifiers: string[];
  };
}

interface Modifier {
  name: string;
  description: string;
}

interface ToolBuilderProps {
  version: string;
}

type ToolPart = 'Pick Head' | 'Sword Blade' | 'Hammer Head' | 'Binding' | 'Wide Guard' | 'Plate' | 'Tool Rod' | 'Tough Tool Rod';

const ToolBuilder: React.FC<ToolBuilderProps> = ({ version }) => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<{ [key: string]: Material | null }>({
    head: null,
    handle: null,
    extra: null,
  });
  const [toolStats, setToolStats] = useState<any>(null);
  const [materials, setMaterials] = useState<Material[]>([]); // Materials state
  const [isFocused, setIsFocused] = useState<number | null>(null); // Track which dropdown is focused
  const [modifiers, setModifiers] = useState<Modifier[]>([]); // State to store the modifier descriptions

  const tools = [
    { name: 'Pickaxe', parts: ['Pick Head', 'Binding', 'Tool Rod'] },
    { name: 'Broadsword', parts: ['Sword Blade', 'Wide Guard', 'Tool Rod'] },
    { name: 'Hammer', parts: ['Hammer Head', 'Plate', 'Plate', 'Tough Tool Rod'] },
  ];

  // Map tool parts to material categories
  const partToCategory: Record<ToolPart, 'head' | 'extra' | 'handle'> = {
    'Pick Head': 'head',
    'Sword Blade': 'head',
    'Hammer Head': 'head',
    'Binding': 'extra',
    'Wide Guard': 'extra',
    'Plate': 'extra',
    'Tool Rod': 'handle',
    'Tough Tool Rod': 'handle',
  };

  // Fetch materials for the specific version
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch(`/assets/${version}.json`);
        if (response.ok) {
          const data = await response.json();
          setMaterials(data); // Store fetched materials
        } else {
          console.error('Error fetching materials');
        }
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };
    fetchMaterials();
  }, [version]);

  // Fetch modifiers data from modifiers.json
  useEffect(() => {
    const fetchModifiers = async () => {
      try {
        const response = await fetch('/assets/modifiers.json');
        if (response.ok) {
          const data = await response.json();
          setModifiers(data);
        } else {
          console.error('Error fetching modifiers');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchModifiers();
  }, []);

  // Helper function to find the description for a modifier
  const findModifierDescription = (modifierName: string) => {
    const modifier = modifiers.find((mod) => mod.name === modifierName);
    return modifier ? modifier.description : 'No description available';
  };

  // Handle tool selection
  const handleToolSelection = (toolName: string) => {
    console.log(`Tool selected: ${toolName}`);
    setSelectedTool(toolName);
    setToolStats(null); // Reset stats
  };

  // Handle material selection for a part
  const handleMaterialSelection = (material: Material, partIndex: number, partName: ToolPart) => {
    console.log(`Material selected for part ${partName}:`, material);
    const category = partToCategory[partName]; // Get the material category (head/handle/extra)
    
    setSelectedMaterials((prev) => ({
      ...prev,
      [category]: material,
    }));

    calculateToolStats({
      ...selectedMaterials,
      [category]: material,
    });
  };

  // Dynamically calculate tool stats for the selected materials
  const calculateToolStats = (materials: { [key: string]: Material | null }) => {
    const { head, handle, extra } = materials;
    if (!selectedTool) return;

    const stats = Builder1_12_2(selectedTool, head?.head || null, handle?.handle || null, extra?.extra || null);
    console.log('Calculated stats:', stats);
    setToolStats(stats);
  };

  // Prepare material options for the dropdown (react-select)
  const materialOptions = materials.map((material) => ({
    value: material,
    label: material.name,
  }));

  const customStyles = {
    control: (styles: any) => ({
      ...styles,
      backgroundColor: 'var(--background2-color)',
      borderColor: 'var(--card-border-color)',
      color: 'var(--text-color)',
      minWidth: '75px',
      maxWidth: '100%',
      width: '100%',
      boxSizing: 'border-box',
    }),
    menu: (styles: any) => ({
      ...styles,
      backgroundColor: 'var(--background2-color)',
    }),
    option: (styles: any, { isFocused }: any) => ({
      ...styles,
      backgroundColor: isFocused ? 'var(--primary-color)' : 'var(--background2-color)',
      color: isFocused ? '#fff' : 'var(--text-color)',
    }),
    singleValue: (styles: any) => ({
      ...styles,
      color: 'var(--text-color)',
    }),
    placeholder: (styles: any) => ({
      ...styles,
      color: 'var(--text-color)',
    }),
    input: (styles: any) => ({
      ...styles,
      color: 'var(--text-color)',
    }),
  };

  return (
    <div className="tool-builder">
      <div className="tool-selection">
        <h2>Select a Tool</h2>
        {tools.map((tool, index) => (
          <button
            key={index}
            className={`tool-button ${selectedTool === tool.name ? 'selected' : ''}`}
            onClick={() => handleToolSelection(tool.name)}
          >
            {tool.name}
          </button>
        ))}
      </div>

      {selectedTool && (
        <div className="tool-configuration">
          <h2>{selectedTool}</h2>
          <div className="material-selection">
            {tools
              .find((tool) => tool.name === selectedTool)
              ?.parts.map((part, index) => (
                <div key={index} className="material-dropdown">
                  <label>{part}</label>
                  <Select
                    options={materialOptions}
                    onChange={(selectedOption) => handleMaterialSelection(selectedOption!.value, index, part as ToolPart)}
                    placeholder={isFocused === index ? '' : `Select Material for ${part}`}
                    onFocus={() => setIsFocused(index)}
                    onBlur={() => setIsFocused(null)}
                    isSearchable
                    styles={customStyles}
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      {toolStats && (
        <div className="tool-stats">
          <h3>Tool Stats</h3>
          <p>Durability: {toolStats.durability}</p>
          <p>Mining Speed: {toolStats.speed}</p>
          <p>Attack Damage: {toolStats.attack}</p>
          <p>Modifiers: </p>
          <ul>
            {toolStats.modifiers.length > 0
              ? toolStats.modifiers.map((modifier: string, index: number) => (
                  <OverlayTrigger
                    key={index}
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-${index}`}>
                        {findModifierDescription(modifier)}
                      </Tooltip>
                    }
                  >
                    <li className="modifier" style={{ cursor: 'pointer' }}>
                      {modifier}
                    </li>
                  </OverlayTrigger>
                ))
              : 'None'}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ToolBuilder;
