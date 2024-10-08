import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Calculator from '@components/builder/Calculator';
import ModalCard from '@components/builder/ModalCard';
import { Settings as SettingsType } from '@components/settings/Settings';
import './ToolBuilder.css';

export interface Material {
  name: string;
  mod: string;
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

export interface BuiltTool {
  toolName: string;
  materials: Array<Material | null>;
  stats: any;
}

type ToolPart =
  | 'Large Sword Blade'
  | 'Pickaxe Head'
  | 'Shovel Head'
  | 'Axe Head'
  | 'Kama Head'
  | 'Hammer Head'
  | 'Large Plate'
  | 'Excavator Head'
  | 'Broad Axe Head'
  | 'Scythe Head'
  | 'Sword Blade'
  | 'Pan'
  | 'Sign Plate'
  | 'Knife Blade'
  | 'Binding'
  | 'Tough Binding'
  | 'Wide Guard'
  | 'Plate'
  | 'Hand Guard'
  | 'Cross Guard'
  | 'Tool Rod'
  | 'Tough Tool Rod';

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
  Pan: 'head',
  'Sign Plate': 'head',
  'Knife Blade': 'head',
  Binding: 'extra',
  'Tough Binding': 'extra',
  'Wide Guard': 'extra',
  Plate: 'extra',
  'Hand Guard': 'extra',
  'Cross Guard': 'extra',
  'Tool Rod': 'handle',
  'Tough Tool Rod': 'handle',
};

interface Tool {
  name: string;
  parts: ToolPart[];
}

interface ToolBuilderProps {
  version: string;
  selectedTool: string | null;
  setSelectedTool: React.Dispatch<React.SetStateAction<string | null>>;
  selectedMaterials: Array<Material | null>;
  setSelectedMaterials: React.Dispatch<React.SetStateAction<Array<Material | null>>>;
  builtTools: BuiltTool[];
  setBuiltTools: React.Dispatch<React.SetStateAction<BuiltTool[]>>;
  settings: SettingsType;
}

const ToolBuilder: React.FC<ToolBuilderProps> = ({
  version,
  selectedTool,
  setSelectedTool,
  selectedMaterials,
  setSelectedMaterials,
  builtTools,
  setBuiltTools,
  settings,
}) => {
  const tools: Tool[] = [
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

  const [toolStats, setToolStats] = useState<any>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [modifiers, setModifiers] = useState<Modifier[]>([]);

  // Initialize selectedTool if not already set
  useEffect(() => {
    if (!selectedTool) {
      setSelectedTool(tools[0].name);
    }
  }, [selectedTool, setSelectedTool, tools]);

  // Initialize selectedMaterials when selectedTool changes
  useEffect(() => {
    if (selectedTool) {
      const toolParts = tools.find((tool) => tool.name === selectedTool)?.parts || [];
      if (selectedMaterials.length !== toolParts.length) {
        setSelectedMaterials(Array(toolParts.length).fill(null));
        setToolStats(null); // Reset tool stats when selected tool changes
      }
    }
  }, [selectedTool, setSelectedMaterials]);

  // THIS IS BROKEN, NEED TO FIX, so it actually resets selected materials when the modpack changes
  // Add this useEffect to reset selectedMaterials when settings.modpack changes
  // useEffect(() => {
  //   if (selectedTool) {
  //     const toolParts = tools.find((tool) => tool.name === selectedTool)?.parts || [];
  //     setSelectedMaterials(Array(toolParts.length).fill(null));
  //     setToolStats(null); // Reset tool stats
  //   }
  // }, [settings.modpack]);

  // Fetch materials for the specific version
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const baseResponse = await fetch(`/assets/${version}.json`);
        let baseMaterials: Material[] = [];
        if (baseResponse.ok) {
          baseMaterials = await baseResponse.json();
        } else {
          console.error('Error fetching base materials');
        }

        if (settings.modpack && settings.modpack !== 'None') {
          const modpackResponse = await fetch(`/assets/modpacks/${settings.modpack}.json`);
          if (modpackResponse.ok) {
            const modpackMaterials: Material[] = await modpackResponse.json();
            // Merge baseMaterials and modpackMaterials
            const mergedMaterials = mergeMaterials(baseMaterials, modpackMaterials);
            // Filter materials only if selectedMods is defined and not empty
            const filteredMaterials =
              settings.selectedMods && settings.selectedMods.length > 0
                ? mergedMaterials.filter((material: Material) => settings.selectedMods.includes(material.mod))
                : mergedMaterials;
            setMaterials(filteredMaterials);
          } else {
            console.error('Error fetching modpack materials');
            setMaterials(
              settings.selectedMods && settings.selectedMods.length > 0
                ? baseMaterials.filter((material: Material) => settings.selectedMods.includes(material.mod))
                : baseMaterials
            );
          }
        } else {
          setMaterials(
            settings.selectedMods && settings.selectedMods.length > 0
              ? baseMaterials.filter((material: Material) => settings.selectedMods.includes(material.mod))
              : baseMaterials
          );
        }
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };
    fetchMaterials();
  }, [version, settings.modpack, settings.selectedMods]);


  // Function to merge base materials with modpack materials
  const mergeMaterials = (baseMaterials: Material[], modpackMaterials: Material[]) => {
    const materialMap = new Map<string, Material>();
    baseMaterials.forEach((material) => {
      materialMap.set(material.name, material);
    });
    modpackMaterials.forEach((material) => {
      materialMap.set(material.name, material); // Overwrite or add new material
    });
    return Array.from(materialMap.values());
  };

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
        console.error('Error fetching modifiers:', error);
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
    if (selectedTool !== toolName) {
      setSelectedTool(toolName);
    }
  };

  // Handle material selection for a part
  const handleMaterialSelection = (
    selectedOption: { value: Material | null },
    partIndex: number,
    _part: ToolPart
  ) => {
    const newMaterials = [...selectedMaterials]; // Clone the array
    newMaterials[partIndex] = selectedOption.value; // Update the material at the specific index
    // Update the state with the newly selected material
    setSelectedMaterials(newMaterials);
  };

  // Recalculate stats whenever selectedMaterials change
  useEffect(() => {
    if (selectedMaterials.length > 0 && selectedTool) {
      const parts = tools.find((tool) => tool.name === selectedTool)?.parts || [];
      calculateToolStats(selectedMaterials, parts);
    }
  }, [selectedMaterials, selectedTool]);

  // Function to calculate tool stats
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
        return partToCategory[parts[index] as ToolPart] === 'extra' || parts[index] === 'Knife Blade';
      })
      .map((material) => material?.extra);

    const stats = Calculator(version, selectedTool, { heads, handles, extras });
    setToolStats(stats);
  };

  // Check if all materials are selected
  const allMaterialsSelected =
    selectedMaterials.length > 0 && selectedMaterials.every((material) => material !== null);

  // Function to handle building the tool
  const handleBuildTool = () => {
    if (!selectedTool || !toolStats) return;

    // Create a new built tool object
    const newBuiltTool: BuiltTool = {
      toolName: selectedTool,
      materials: selectedMaterials,
      stats: toolStats,
    };

    // Add the new built tool to the list
    setBuiltTools([...builtTools, newBuiltTool]);
  };

  // Prepare material options for the dropdown (react-select) with "None" at the top
  const materialOptions = [
    { value: null, label: 'None' },
    ...materials.map((material) => ({
      value: material,
      label: `${material.name} - ${material.mod}`,
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
            <p className="stat-name">Modifiers:</p>{' '}
            <p>{head.modifiers && head.modifiers.length > 0 ? head.modifiers.join(', ') : 'None'}</p>
          </>
        )}
        {partType === 'handle' && handle && (
          <>
            <p className="stat-name">Durability:</p> <p>{handle.durability}</p>
            <p className="stat-name">Modifier:</p> <p>{handle.modifier}</p>
            <p className="stat-name">Modifiers:</p>{' '}
            <p>{handle.modifiers && handle.modifiers.length > 0 ? handle.modifiers.join(', ') : 'None'}</p>
          </>
        )}
        {partType === 'extra' && extra && (
          <>
            <p className="stat-name">Durability:</p> <p>{extra.durability}</p>
            <p className="stat-name">Modifiers:</p>{' '}
            <p>{extra.modifiers && extra.modifiers.length > 0 ? extra.modifiers.join(', ') : 'None'}</p>
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
      <h1>Tool Builder</h1>
      <br/>
      {/* Main Content */}
      <div className="tool-builder-main">
        {/* Tool Selection Section */}
        <div className="tool-selection">
          <h2>Select a Tool</h2>
          {tools.map((tool, index) => (
            <button
              key={index}
              className={`tool-button ${selectedTool === tool.name ? 'selected' : ''}`}
              onClick={() => handleToolSelection(tool.name)}
            >
              <img src={`/assets/tools/${tool.name}.png`} alt={tool.name} width="75" height="75" />
              <span>{tool.name}</span>
            </button>
          ))}
        </div>

        {/* Tool Configuration and Stats */}
        {selectedTool && (
          <>
            {/* Tool Configuration Section */}
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
                            {renderTooltipContent(
                              selectedMaterials[index],
                              partToCategory[part as ToolPart]
                            )}
                          </Tooltip>
                        }
                      >
                        <div>
                          <Select
                            options={materialOptions}
                            value={materialOptions.find(
                              (option) =>
                                option.value?.name === selectedMaterials[index]?.name || null
                            )}
                            onChange={(selectedOption) =>
                              handleMaterialSelection(selectedOption!, index, part as ToolPart)
                            }
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

            {/* Tool Stats Section */}
            <div className="tool-stats">
              <h3>Tool Stats</h3>
              {selectedTool === 'Shuriken' ? (
                <>
                  <p>Ammo: {toolStats?.ammo || 'N/A'}</p>
                  <p>Attack Damage: {toolStats?.attack || 'N/A'}</p>
                  <p>Modifiers:</p>
                  {toolStats?.modifiers?.length > 0 ? (
                    <ul>
                      {toolStats.modifiers.map((modifier: string, index: number) => (
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
                      ))}
                    </ul>
                  ) : (
                    <p>None</p>
                  )}
                </>
              ) : (
                <>
                  <p>Durability: {toolStats?.durability || 'N/A'}</p>
                  <p>Mining Level: {toolStats?.miningLevel || 'N/A'}</p>
                  <p>Mining Speed: {toolStats?.miningSpeed || 'N/A'}</p>
                  <p>Attack Damage: {toolStats?.attack || 'N/A'}</p>
                  <p>Attack Speed: {toolStats?.attackSpeed || 'N/A'}</p>
                  <p>DPS: {toolStats?.DPS || 'N/A'}</p>
                  <p>Modifiers:</p>
                  {toolStats?.modifiers?.length > 0 ? (
                    <ul>
                      {toolStats.modifiers.map((modifier: string, index: number) => (
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
                      ))}
                    </ul>
                  ) : (
                    <p>None</p>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Build Tool Button */}
      <div className="build-tool-section">
        <button
          className="build-tool-button"
          onClick={handleBuildTool}
          disabled={!allMaterialsSelected}
        >
          Build Tool
        </button>
      </div>

      {/* Built Tools Section */}
      {builtTools.length > 0 && (
        <div className="built-tools">
          <h3>Built Tools</h3>
          <div className="built-tools-grid">
            {builtTools.map((builtTool, index) => (
              <ModalCard
                key={index}
                toolName={builtTool.toolName}
                materials={builtTool.materials}
                stats={builtTool.stats}
                modifiersData={modifiers}
                onRemove={() => {
                  const updatedBuiltTools = [...builtTools];
                  updatedBuiltTools.splice(index, 1);
                  setBuiltTools(updatedBuiltTools);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolBuilder;
