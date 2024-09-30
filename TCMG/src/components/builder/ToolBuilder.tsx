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
    miningLevel: string;
    miningSpeed: number;
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

type ToolPart = 'Large Sword Blade' | 'Pickaxe Head' | 'Shovel Head' | 'Axe Head' | 'Kama Head' | 'Hammer Head' | 'Large Plate' | 'Excavator Head' | 'Broad Axe Head' | 'Scythe Head' | 'Sword Blade' | 'Pan' | 'Sign Plate' | 'Knife Blade' | 'Binding' | 'Tough Binding' | 'Wide Guard' | 'Plate' | 'Hand Guard' | 'Cross Guard' | 'Tool Rod' | 'Tough Tool Rod';

const ToolBuilder: React.FC<ToolBuilderProps> = ({ version }) => {
  const [selectedTool, setSelectedTool] = useState<string | null>('Katana'); // Default selected tool
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
    { name: 'Katana', parts: ['Tough Tool Rod', 'Tough Binding', 'Large Sword Blade', 'Large Sword Blade'] },
    { name: 'Pickaxe', parts: ['Tool Rod', 'Binding', 'Pickaxe Head'] },
    { name: 'Shovel', parts: ['Tool Rod', 'Binding', 'Shovel Head'] },
    { name: 'Hatchet', parts: ['Tool Rod', 'Binding', 'Axe Head'] },
    { name: 'Mattock', parts: ['Tool Rod', 'Axe Head', 'Shovel Head'] },
    { name: 'Kama', parts: ['Tool Rod', 'Binding', 'Kama Head'] },
    { name: 'Hammer', parts: ['Tough Tool Rod', 'Large Plate', 'Hammer Head', 'Large Plate'] },
    { name: 'Excavator', parts: ['Tough Tool Rod', 'Tough Binding', 'Large Plate', 'Excavator Head'] },
    { name: 'Lumberaxe', parts: ['Tough Tool Rod', 'Tough Binding', 'Large Plate', 'Broad Axe Head'] },
    { name: 'Scythe', parts: ['Tough Tool Rod', 'Tough Tool Rod', 'Tough Binding', 'Scythe Head'] },
    { name: 'Broadsword', parts: ['Tool Rod', 'Wide Guard', 'Sword Blade'] },
    { name: 'Longsword', parts: ['Tool Rod', 'Hand Guard', 'Sword Blade'] },
    { name: 'Rapier', parts: ['Tool Rod', 'Cross Guard', 'Sword Blade'] },
    { name: 'Frypan', parts: ['Tool Rod', 'Pan'] },
    { name: 'Battlesign', parts: ['Tool Rod', 'Sign Plate'] },
    { name: 'Cleaver', parts: ['Tough Tool Rod', 'Tough Tool Rod', 'Large Plate', 'Large Sword Blade'] },
    { name: 'Shuriken', parts: ['Knife Blade', 'Knife Blade', 'Knife Blade', 'Knife Blade'] },

  ];

  // Map tool parts to material categories
  const partToCategory: Record<ToolPart, 'head' | 'extra' | 'handle'> = {
    'Large Sword Blade': 'head',
    'Pickaxe Head': 'head',
    'Shovel Head': 'head',
    'Axe Head': 'head',
    'Kama Head': 'head',
    'Hammer Head': 'head',
    'Large Plate': 'head',
    'Excavator Head': 'head',
    'Broad Axe Head': 'head',
    'Scythe Head': 'head',
    'Sword Blade': 'head',
    'Pan': 'head',
    'Sign Plate': 'head',
    'Knife Blade': 'head',
    'Binding': 'extra',
    'Tough Binding': 'extra',
    'Wide Guard': 'extra',
    'Plate': 'extra',
    'Hand Guard': 'extra',
    'Cross Guard': 'extra',
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
    
    // Clear the selected materials when switching tools
    setSelectedMaterials({
      head: null,
      handle: null,
      extra: null,
    });

    // Reset stats
    setToolStats(null); 
    setSelectedTool(toolName); // Set the new tool
    setIsFocused(null); // Reset focused dropdown
  };

  // Handle material selection for a part
  const handleMaterialSelection = (selectedOption: { value: Material | null }, _partIndex: number, partName: ToolPart) => {
    // Set to null if 'None' is selected
    const material = selectedOption.value;
    
    // Use partName instead of category to track materials for individual parts
    setSelectedMaterials((prev) => ({
      ...prev,
      [partName]: material, // Store the material by the part name directly
    }));
  
    // Recalculate stats with updated materials
    calculateToolStats({
      ...selectedMaterials,
      [partName]: material, // Pass the updated material selection by part name
    });
  };
  
  // Modify the calculateToolStats function
  const calculateToolStats = (materials: { [key: string]: Material | null }) => {
    if (!selectedTool) {
      console.error('No tool selected');
      return;
    }
  
    const heads = Object.entries(materials)
      .filter(([partName]) => partToCategory[partName as ToolPart] === 'head')
      .map(([, material]) => material?.head)
      .filter(Boolean);
  
    const handles = Object.entries(materials)
      .filter(([partName]) => partToCategory[partName as ToolPart] === 'handle')
      .map(([, material]) => material?.handle)
      .filter(Boolean);
  
    const extras = Object.entries(materials)
      .filter(([partName]) => partToCategory[partName as ToolPart] === 'extra')
      .map(([, material]) => material?.extra)
      .filter(Boolean);
  
    // Ensure selectedTool is non-null before passing
    const stats = Builder1_12_2(selectedTool as string, { heads, handles, extras });
    console.log('Calculated stats:', stats);
    setToolStats(stats);
  };
  
  




  // Prepare material options for the dropdown (react-select) with "None" at the top
  const materialOptions = [
    { value: null, label: 'None' }, // Option to reset the selection
    ...materials.map((material) => ({
      value: material,
      label: material.name,
    })),
  ];


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
                    value={materialOptions.find(
                      (option) => option.value?.name === selectedMaterials[part]?.name || null
                    )} // Ensure selected value is shown
                    onChange={(selectedOption) => handleMaterialSelection(selectedOption!, index, part as ToolPart)} // Explicitly cast part to ToolPart
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

      <div className="tool-stats">
        <h3>Tool Stats</h3>
        <p>Durability: {toolStats?.durability || 'N/A'}</p>
        <p>Mining Level: {toolStats?.miningLevel || 'N/A'}</p>
        <p>Mining Speed: {toolStats?.miningSpeed || 'N/A'}</p> {/* Correct mining speed */}
        <p>Attack Damage: {toolStats?.attack || 'N/A'}</p>
        <p>Attack Speed: {toolStats?.attackSpeed || 'N/A'}</p> {/* Display attack speed */}
        <p>DPS: {toolStats?.DPS || 'N/A'}</p> {/* Display DPS */}
        <p>Modifiers: </p>
        <ul>
          {toolStats?.modifiers?.length > 0
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
    </div>
  );
};

export default ToolBuilder;
