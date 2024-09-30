import { Material } from '@components/builder/ToolBuilder.tsx';

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

// Durability modifier based on tool
const durabilityModMap: Record<string, number> = {
  'Pickaxe': 1,
  'Shovel': 1,
  'Hatchet': 1,
  'Mattock': 1,
  'Hammer': 2.5,
  'Excavator': 1.75,
  'Lumberaxe': 2,
  'Broadsword': 1.1,
  'Longsword': 1.05,
  'Rapier': 0.8,
  'Frypan': 1,
  'Battlesign': 1,
  'Cleaver': 2,
  'Shuriken': 1,
  'Scythe': 2.2,
};

// Attack potential based on tool
const attackPotentialMap: Record<string, number> = {
  'Pickaxe': 1,
  'Shovel': 0.9,
  'Hatchet': 1.1,
  'Mattock': 0.9,
  'Hammer': 1.2,
  'Excavator': 1.25,
  'Lumberaxe': 1.2,
  'Broadsword': 1,
  'Longsword': 1.1,
  'Rapier': 0.55,
  'Frypan': 1,
  'Battlesign': 0.86,
  'Cleaver': 1.2,
  'Shuriken': 0.7,
  'Scythe': 0.75,
};

// Speed modifier based on tool
const speedModMap: Record<string, number> = {
  'Mattock': 0.95,
  'Hammer': 0.4,
  'Excavator': 0.28,
  'Lumberaxe': 0.35,
};

// Attack speed based on tool
const attackSpeedMap: Record<string, number> = {
  'Pickaxe': 1.2,
  'Shovel': 1,
  'Hatchet': 1.1,
  'Mattock': 0.9,
  'Hammer': 0.8,
  'Excavator': 0.7,
  'Lumberaxe': 0.8,
  'Broadsword': 1.6,
  'Longsword': 1.4,
  'Rapier': 3,
  'Frypan': 1.4,
  'Battlesign': 1.2,
  'Cleaver': 0.7,
  'Shuriken': 1,
  'Scythe': 0.9,
};

interface ToolParts {
  heads: Array<Material['head']>;
  handles: Array<Material['handle']>;
  extras: Array<Material['extra']>;
}

// Helper function to check if a modifier is present
const hasModifier = (modifiers: string[], target: string) => {
  return modifiers.some((modifier) => modifier.includes(target));
};

const Builder1_12_2 = (toolName: string, parts: ToolParts) => {
  const { heads, handles, extras } = parts;

  const calculateDurability = () => {
    const headDurabilityAvg = heads.reduce((total, head) => total + (head?.durability || 0), 0) / heads.length;
    const extraDurabilityAvg = extras.reduce((total, extra) => total + (extra?.durability || 0), 0) / extras.length;
    const handleModifier = handles.reduce((mod, handle) => mod * (handle?.modifier || 1), 1);
    const handleDurability = handles.reduce((total, handle) => total + (handle?.durability || 0), 0);

    let durability = (headDurabilityAvg + extraDurabilityAvg) * handleModifier + handleDurability;
    durability *= durabilityModMap[toolName] || 1;

    if (hasModifier(calculateModifiers(), 'Cheapskate II')) durability *= 0.6;
    else if (hasModifier(calculateModifiers(), 'Cheapskate')) durability *= 0.8;

    return durability;
  };

  const calculateMiningLevel = () => {
    const miningLevels = heads.map((head) => miningLevelMap[head?.miningLevel || ''] || 0);
    const highestMiningLevel = Math.max(...miningLevels);
    return Object.keys(miningLevelMap).find((key) => miningLevelMap[key] === highestMiningLevel);
  };

  const calculateSpeed = () => {
    const headSpeedAvg = heads.reduce((total, head) => total + (head?.miningSpeed || 0), 0) / heads.length;
    return headSpeedAvg * (speedModMap[toolName] || 1);
  };

  const calculateAttack = () => {
    const headAttackAvg = heads.reduce((total, head) => total + (head?.attack || 0), 0) / heads.length;
    let attackPotential = attackPotentialMap[toolName] || 1;

    if (hasModifier(calculateModifiers(), 'Fractured II')) attackPotential *= 1.8;
    else if (hasModifier(calculateModifiers(), 'Fractured')) attackPotential *= 1.5;

    return (headAttackAvg * attackPotential) + 1;
  };

  const calculateAttackSpeed = () => {
    let attackSpeed = attackSpeedMap[toolName] || 1;

    if (hasModifier(calculateModifiers(), 'Lightweight')) {
      attackSpeed *= 1.1;
    }

    return attackSpeed;
  };

  const calculateDPS = () => {
    return calculateAttack() * calculateAttackSpeed();
  };

  const calculateModifiers = () => {
    const allModifiers = [
      ...heads.flatMap((head) => head?.modifiers || []),
      ...handles.flatMap((handle) => handle?.modifiers || []),
      ...extras.flatMap((extra) => extra?.modifiers || []),
    ];
    return Array.from(new Set(allModifiers)); // Filter duplicates
  };

  // Helper function to format the number, showing decimals only if needed and rounding very small values
  const formatNumber = (num: number) => {
    // Round to 2 decimal places and check if the fractional part is effectively zero
    const rounded = Math.round(num * 100) / 100;
    return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(2);
  };

  // In the stats object, make sure it uses the formatNumber function:
  const stats = {
    durability: formatNumber(calculateDurability()),
    miningLevel: calculateMiningLevel(), // No need for decimal precision here
    miningSpeed: formatNumber(calculateSpeed()),
    attack: formatNumber(calculateAttack()),
    attackSpeed: formatNumber(calculateAttackSpeed()),
    DPS: formatNumber(calculateDPS()),
    modifiers: calculateModifiers(),
  };



  return stats;
};

export default Builder1_12_2;
