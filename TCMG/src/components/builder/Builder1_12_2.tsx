// Import the Material type from ToolBuilder
import { Material } from '@components/builder/ToolBuilder.tsx';

// Define the structure for ToolParts, expecting arrays of heads, handles, and extras
interface ToolParts {
  heads: Array<Material['head']>;
  handles: Array<Material['handle']>;
  extras: Array<Material['extra']>;
}

const Builder1_12_2 = (_toolName: string, parts: ToolParts) => {
  const { heads, handles, extras } = parts;

  const calculateDurability = () => {
    // Combine the durability of all selected parts
    const headDurability = heads.reduce((total, head) => total + (head?.durability || 0), 0);
    const handleDurability = handles.reduce((total, handle) => total + (handle?.durability || 0), 0);
    const handleModifier = handles.reduce((modifier, handle) => modifier * (handle?.modifier || 1), 1);
    const extraDurability = extras.reduce((total, extra) => total + (extra?.durability || 0), 0);

    return (headDurability + extraDurability) * handleModifier + handleDurability;
  };

  // Define the mining level map
  const miningLevelMap: Record<string, number> = {
    'Stone': 1,
    'Iron': 2,
    'Diamond': 3,
    'Obsidian': 4,
    'Cobalt': 5,
    'Manyullyn': 6,
    'Titanite': 7,
    'Meteorite': 8,
    'Vibranium': 9,
    'Adamantite': 10
  };

  const calculateMiningLevel = () => {
    // Find the highest mining level from all heads
    const miningLevels = heads.map((head) => miningLevelMap[head?.miningLevel || ''] || 0);
    const highestMiningLevel = Math.max(...miningLevels);
    return Object.keys(miningLevelMap).find(key => miningLevelMap[key as keyof typeof miningLevelMap] === highestMiningLevel);
  };

  const calculateSpeed = () => {
    // Combine the mining speed of all heads
    return heads.reduce((total, head) => total + (head?.miningSpeed || 0), 0);
  };

  const calculateAttack = () => {
    // Combine the attack of all heads
    return heads.reduce((total, head) => total + (head?.attack || 0), 0);
  };

  const calculateModifiers = () => {
    // Collect unique modifiers from all parts
    const allModifiers = [
      ...heads.flatMap((head) => head?.modifiers || []),
      ...handles.flatMap((handle) => handle?.modifiers || []),
      ...extras.flatMap((extra) => extra?.modifiers || []),
    ];

    return Array.from(new Set(allModifiers)); // Remove duplicates
  };

  const stats = {
    durability: calculateDurability(),
    miningLevel: calculateMiningLevel(),
    speed: calculateSpeed(),
    attack: calculateAttack(),
    modifiers: calculateModifiers(),
  };

  return stats;
};

export default Builder1_12_2;
