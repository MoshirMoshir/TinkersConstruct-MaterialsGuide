import React, { useEffect, useState } from 'react';
import MaterialCard from '@components/materials/MaterialCard';
import './Materials.css';

interface Material {
  name: string;
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
}

const Materials: React.FC<MaterialsProps> = ({ version }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [sortField, setSortField] = useState<string>('name'); // State for sorting
  const [sortDirection, setSortDirection] = useState<string>('asc'); // State for sort direction
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch(`/assets/${version}.json`);
        if (response.ok) {
          const data = await response.json();
          setMaterials(data);
        } else {
          console.error(`Error loading materials for version ${version}`);
        }
      } catch (error) {
        console.error(`Error fetching materials: ${error}`);
      }
    };

    fetchMaterials();
  }, [version]);

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

  // Filter materials based on search term
  const filteredMaterials = materials.filter((material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="materials-page">
      <h1>Materials for Version {version}</h1>

      {/* Search and Sort Controls */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        <div className="sort-controls">
          <label>Sort by: </label>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="name">Name</option>
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
            image={material.image}
            head={material.head}
            handle={material.handle}  // Pass only if handle exists
            extra={material.extra}    // Pass only if extra exists
          />
        ))}
      </div>
    </div>
  );
};

export default Materials;
