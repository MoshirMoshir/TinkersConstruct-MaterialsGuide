import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './ToolBuilder.css';

// Export the Material interface to be used in other components
export interface Material {
  name: string;
  durability: number;
  speed: number;
  attack: number;
}

interface ToolBuilderProps {
  version: string;
}

const ToolBuilder: React.FC<ToolBuilderProps> = ({ version }) => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<(Material | null)[]>([null, null, null, null]);
  const [toolStats, setToolStats] = useState<any>(null);
  const [materials, setMaterials] = useState<Material[]>([]); // Materials state
  const [isFocused, setIsFocused] = useState<number | null>(null); // Track which dropdown is focused

  const tools = [
    { name: 'Pickaxe', parts: ['Pick Head', 'Binding', 'Tool Rod'] },
    { name: 'Broadsword', parts: ['Sword Blade', 'Wide Guard', 'Tool Rod'] },
    { name: 'Hammer', parts: ['Hammer Head', 'Plate', 'Plate', 'Tough Tool Rod'] },
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

  // Handle tool selection
  const handleToolSelection = (toolName: string) => {
    setSelectedTool(toolName);
    setSelectedMaterials([null, null, null, null]); // Reset materials
    setToolStats(null); // Reset stats
  };

  // Handle material selection for a part
  const handleMaterialSelection = (material: Material, partIndex: number) => {
    const updatedMaterials = [...selectedMaterials];
    updatedMaterials[partIndex] = material;
    setSelectedMaterials(updatedMaterials);
    calculateToolStats(updatedMaterials);
  };

  // Dynamically calculate tool stats for the selected materials
  const calculateToolStats = (materials: (Material | null)[]) => {
    if (!selectedTool || materials.includes(null)) return;
    const durability = materials.reduce((sum, mat) => sum + (mat ? mat.durability : 0), 0) / materials.length;
    const speed = materials.reduce((sum, mat) => sum + (mat ? mat.speed : 0), 0) / materials.length;
    const attack = materials.reduce((sum, mat) => sum + (mat ? mat.attack : 0), 0) / materials.length;
    setToolStats({ durability, speed, attack });
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
      minWidth: '75px',  // Smaller minimum width
      maxWidth: '100%',   // Ensure it doesn't break out of the container
      width: '100%',      // Flexible width to fill the container
      boxSizing: 'border-box',  // Include padding in width calculations
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
      minWidth: '75px',  // Minimum width for selected value
    }),
    placeholder: (styles: any) => ({
      ...styles,
      color: 'var(--text-color)',
      minWidth: '75px',  // Minimum width for placeholder
      width: 'auto',      // Flexible width for the placeholder
    }),
    input: (styles: any) => ({
      ...styles,
      color: 'var(--text-color)',
      minWidth: '75px',  // Prevent input from collapsing too much
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
                    onChange={(selectedOption) => handleMaterialSelection(selectedOption!.value, index)}
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
          <p>Attack: {toolStats.attack}</p>
        </div>
      )}
    </div>
  );
};

export default ToolBuilder;
