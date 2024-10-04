import React, { useEffect, useState } from 'react';
import MaterialCard from '@components/materials/MaterialCard';
import { Settings as SettingsType } from '@components/settings/Settings';
import './Materials.css';

interface Material {
  name: string;
  mod: string;
  image: string;
  head: {
    durability: number;
    miningLevel: string;
    miningSpeed: number;
    attack: number;
    modifiers: string[];
  };
  handle?: {  // Make handle optional
    modifier: number;
    durability: number;
    modifiers: string[];
  };
  extra?: {  // Make extra optional
    durability: number;
    modifiers: string[];
  };
}

interface MaterialsProps {
  version: string;
  settings: SettingsType;
}

const Materials: React.FC<MaterialsProps> = ({ version, settings }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [sortField, setSortField] = useState<string>('name'); // State for sorting
  const [sortDirection, setSortDirection] = useState<string>('asc'); // State for sort direction
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term
  const [searchField, setSearchField] = useState<string>('name'); // State for search by name or modifiers

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const baseResponse = await fetch(`/assets/${version}.json`);
        let baseMaterials = [];
        if (baseResponse.ok) {
          baseMaterials = await baseResponse.json();
        } else {
          console.error('Error fetching base materials');
        }
  
        if (settings.modpack && settings.modpack !== 'None') {
          const modpackResponse = await fetch(`/assets/modpacks/${settings.modpack}.json`);
          if (modpackResponse.ok) {
            const modpackMaterials = await modpackResponse.json();
            // Merge baseMaterials and modpackMaterials
            const mergedMaterials = mergeMaterials(baseMaterials, modpackMaterials);
            setMaterials(mergedMaterials);
          } else {
            console.error('Error fetching modpack materials');
            setMaterials(baseMaterials);
          }
        } else {
          setMaterials(baseMaterials);
        }
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };
    fetchMaterials();
  }, [version, settings.modpack]);

  // Function to merge materials
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

  // Filter materials based on selected mods
  const filteredByMods = materials.filter((material) => {
    if (settings.selectedMods) {
      return settings.selectedMods.includes(material.mod);
    }
    return true;
  });

  // Sorting function based on the selected field and direction
  const sortMaterials = (materials: Material[]) => {
    return [...materials].sort((a, b) => {
      let fieldA, fieldB;
      switch (sortField) {
        case 'durability':
          fieldA = a.head.durability;
          fieldB = b.head.durability;
          break;
        case 'miningSpeed':
          fieldA = a.head.miningSpeed;
          fieldB = b.head.miningSpeed;
          break;
        case 'attack':
          fieldA = a.head.attack;
          fieldB = b.head.attack;
          break;
        case 'modifier':
          fieldA = a.handle?.modifier ?? 0; // Handle optional modifier
          fieldB = b.handle?.modifier ?? 0; // Handle optional modifier
          break;
        case 'mod':
          fieldA = a.mod.toLowerCase();
          fieldB = b.mod.toLowerCase();
          break;
        case 'name':
        default:
          fieldA = a.name.toLowerCase();
          fieldB = b.name.toLowerCase();
          break;
      }

      if (sortDirection === 'asc') {
        return fieldA > fieldB ? 1 : -1;
      } else {
        return fieldA < fieldB ? 1 : -1;
      }
    });
  };

  // Filter materials based on search term and search field (name or modifiers)
  const filteredMaterials = filteredByMods.filter((material) => {
    if (searchField === 'name') {
      return material.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchField === 'modifiers') {
      const allModifiers = [
        ...material.head.modifiers,
        ...(material.handle?.modifiers || []),
        ...(material.extra?.modifiers || []),
      ];
      return allModifiers.some(modifier =>
        modifier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (searchField === 'mod') {
      return material.mod.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="materials-page">
      <h1>{version} Materials</h1>

      {/* Search and Sort Controls */}
      <div className="controls">
        <div className="search-controls">
          <label>Search by:</label>
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="search-field-dropdown"
          >
            <option value="name">Name</option>
            <option value="modifiers">Modifiers</option>
            <option value="mod">Mod</option>
          </select>

          <input
            type="text"
            placeholder={`Search by ${searchField}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
        </div>

        <div className="sort-controls">
          <label>Sort by:</label>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="mod">Mod</option>
            <option value="durability">Durability</option>
            <option value="miningSpeed">Mining Speed</option>
            <option value="attack">Attack</option>
            <option value="modifier">Modifier</option>
          </select>

          <button onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}>
            {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
      </div>

      <div className="materials-grid">
        {sortMaterials(filteredMaterials).map((material, index) => (
          <MaterialCard
            key={index}
            name={material.name}
            mod={material.mod}
            image={material.image}
            head={material.head}
            handle={material.handle}
            extra={material.extra}
          />
        ))}
      </div>
    </div>
  );
};

export default Materials;