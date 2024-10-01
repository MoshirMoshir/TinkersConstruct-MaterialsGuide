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

const ToolBuilder: React.FC<ToolBuilderProps> = ({ version }) => {
  const [selectedTool, setSelectedTool] = useState<string | null>('Katana'); // Default selected tool
  const [selectedMaterials, setSelectedMaterials] = useState<Array<Material | null>>([]); // Array to hold material selections for each part
  const [toolStats, setToolStats] = useState<any>(null);
  const [materials, setMaterials] = useState<Material[]>([]); // Materials state
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
    setSelectedMaterials(new Array(tools.find(tool => tool.name === toolName)?.parts.length).fill(null));

    // Reset stats
    setToolStats(null); 
    setSelectedTool(toolName); // Set the new tool
  };

  // Handle material selection for a part
  const handleMaterialSelection = (selectedOption: { value: Material | null }, partIndex: number, _part: ToolPart) => {
    const newMaterials = [...selectedMaterials]; // Clone the array
    newMaterials[partIndex] = selectedOption.value; // Update the material at the specific index

    // Update the state with the newly selected material
    setSelectedMaterials(newMaterials);

    // Recalculate stats with updated materials
    calculateToolStats(newMaterials, tools.find(tool => tool.name === selectedTool)?.parts || []);
  };

  // Modify the calculateToolStats function
  const calculateToolStats = (materials: Array<Material | null>, parts: string[]) => {
    if (!selectedTool) return;

    const heads = materials
      .filter((_material, index) => partToCategory[parts[index] as ToolPart] === 'head')
      .map((material) => material?.head);
    const handles = materials
      .filter((_material, index) => partToCategory[parts[index] as ToolPart] === 'handle')
      .map((material) => material?.handle);
    const extras = materials
      .filter((_material, index) => {
        return (partToCategory[parts[index] as ToolPart] === 'extra' || parts[index] === 'Knife Blade');
      })
      .map((material) => material?.extra);

    const stats = Builder1_12_2(selectedTool, { heads, handles, extras });
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

  // Function to create the tooltip content with material stats
  const renderTooltipContent = (material: Material | null, partType: 'head' | 'handle' | 'extra') => {
    if (!material) return 'No material selected';
  
    const { head, handle, extra } = material;
    
    return (
      <div className="material-tooltip">
        {partType === 'head' && head && (
          <>
            <p className="stat-name">Durability:</p> <p>{head.durability}</p>
            <p className="stat-name">Mining Speed:</p> <p>{head.miningSpeed}</p>
            <p className="stat-name">Attack:</p> <p>{head.attack}</p>
            <p className="stat-name">Modifiers:</p> <p>{head.modifiers.join(', ') || 'None'}</p>
          </>
        )}
        {partType === 'handle' && handle && (
          <>
            <p className="stat-name">Durability:</p> <p>{handle.durability}</p>
            <p className="stat-name">Modifier:</p> <p>{handle.modifier}</p>
            <p className="stat-name">Modifiers:</p> <p>{handle.modifiers.join(', ') || 'None'}</p>
          </>
        )}
        {partType === 'extra' && extra && (
          <>
            <p className="stat-name">Durability:</p> <p>{extra.durability}</p>
            <p className="stat-name">Modifiers:</p> <p>{extra.modifiers.join(', ') || 'None'}</p>
          </>
        )}
      </div>
    );
  };
  
  

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
            <img
              src={`/assets/tools/${tool.name}.png`}
              alt={tool.name}
              width="50"
              height="50"
            />
            <span>{tool.name}</span>
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
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-${index}`}>
                        {renderTooltipContent(selectedMaterials[index], partToCategory[part as ToolPart])}
                      </Tooltip>
                    }
                  >
                    <div>
                      <Select
                        options={materialOptions}
                        value={materialOptions.find(
                          (option) => option.value?.name === selectedMaterials[index]?.name || null
                        )} // Ensure selected value is shown
                        onChange={(selectedOption) => handleMaterialSelection(selectedOption!, index, part as ToolPart)} // Pass the part index
                        placeholder={`Select Material for ${part}`}
                        isSearchable
                        styles={customStyles}
                      />
                    </div>
                  </OverlayTrigger>
                </div>
              ))}
          </div>
        </div>
      )}

    <div className="tool-stats">
      <h3>Tool Stats</h3>
      {selectedTool === 'Shuriken' ? (
        <>
          <p>Ammo: {toolStats?.ammo || 'N/A'}</p> {/* Display Ammo for Shuriken */}
          <p>Attack Damage: {toolStats?.attack || 'N/A'}</p>
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
        </>
      ) : (
        <>
          <p>Durability: {toolStats?.durability || 'N/A'}</p>
          <p>Mining Level: {toolStats?.miningLevel || 'N/A'}</p>
          <p>Mining Speed: {toolStats?.miningSpeed || 'N/A'}</p>
          <p>Attack Damage: {toolStats?.attack || 'N/A'}</p>
          <p>Attack Speed: {toolStats?.attackSpeed || 'N/A'}</p>
          <p>DPS: {toolStats?.DPS || 'N/A'}</p>
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
        </>
      )}
    </div>

    </div>
  );
};

export default ToolBuilder;