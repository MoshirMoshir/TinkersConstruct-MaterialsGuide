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
  'Katana': .875,
  'Hammer': 2.5,
  'Excavator': 1.75,
  'Lumberaxe': 2,
  'Broadsword': 1.1,
  'Longsword': 1.05,
  'Rapier': 0.8,
  'Cleaver': 2.26,
  'Scythe': 2.2,
};

// Attack multiplier based on tool
const attackMultiplierMap: Record<string, number> = {
  'Katana': 0.77,
  'Shovel': 0.9,
  'Hatchet': 1.1,
  'Mattock': 0.9,
  'Hammer': 1.2,
  'Excavator': 1.25,
  'Lumberaxe': 1.2,
  'Longsword': 1.1,
  'Rapier': 0.55,
  'Battlesign': 0.86,
  'Cleaver': 1.56,
  'Shuriken': 0.7,
  'Scythe': 0.75,
};

// Attack base bonus based on tool
const attackBonusMap: Record<string, number> = {
  'Katana': .77,
  'Hatchet': .55,
  'Mattock': 2.7,
  'Lumberaxe': 2.4,
  'Broadsword': 1,
  'Longsword': .55,
  'Cleaver': 3.6,
  'Shuriken': .7,
};

// Speed modifier based on tool
const miningSpeedMap: Record<string, number> = {
  'Mattock': 0.95,
  'Hammer': 0.4,
  'Excavator': 0.28,
  'Lumberaxe': 0.35,
};

// Attack speed based on tool
const attackSpeedMap: Record<string, number> = {
  'Katana': 2.55,
  'Pickaxe': 1.2,
  'Hatchet': 1.1,
  'Mattock': 0.9,
  'Kama': 1.3,
  'Hammer': 0.8,
  'Excavator': 0.7,
  'Lumberaxe': 0.8,
  'Broadsword': 1.6,
  'Longsword': 1.4,
  'Rapier': 3,
  'Frypan': 1.4,
  'Battlesign': 1.2,
  'Cleaver': 0.7,
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
    const headDurabilityAvg = (heads.reduce((total, head) => total + (head?.durability || 0), 0) / heads.length) || 0;
    const extraDurabilityAvg = (extras.reduce((total, extra) => total + (extra?.durability || 0), 0) / extras.length) || 0;
    const handleModifier = handles.reduce((mod, handle) => mod * (handle?.modifier || 1), 1);
    const handleDurabilityAvg = (handles.reduce((total, handle) => total + (handle?.durability || 0), 0) / handles.length) || 0;

    console.log("headDurabilityAvg: " + headDurabilityAvg);
    console.log("extraDurabilityAvg: " + extraDurabilityAvg);
    console.log("handleModifier: " + handleModifier);
    console.log("handleDurabilityAvg: " + handleDurabilityAvg);
    let durability = (headDurabilityAvg + extraDurabilityAvg) * handleModifier + handleDurabilityAvg;
    durability *= durabilityModMap[toolName] || 1;

    if (hasModifier(calculateModifiers(), 'Cheapskate II')) durability *= 0.6;
    else if (hasModifier(calculateModifiers(), 'Cheapskate')) durability *= 0.8;

    console.log("durability: " + durability);
    return durability;
  };

  const calculateMiningLevel = () => {
    const miningLevels = heads.map((head) => miningLevelMap[head?.miningLevel || ''] || 0);
    const highestMiningLevel = Math.max(...miningLevels);

    console.log("highestMiningLevel: " + Object.keys(miningLevelMap).find((key) => miningLevelMap[key] === highestMiningLevel));
    return Object.keys(miningLevelMap).find((key) => miningLevelMap[key] === highestMiningLevel);
  };

  const calculateMiningSpeed = () => {
    const headSpeedAvg = heads.reduce((total, head) => total + (head?.miningSpeed || 0), 0) / heads.length;

    console.log("headSpeedAvg: " + headSpeedAvg * (miningSpeedMap[toolName] || 1));
    return headSpeedAvg * (miningSpeedMap[toolName] || 1);
  };

  const calculateAttack = () => {
    const headAttackAvg = heads.reduce((total, head) => total + (head?.attack || 0), 0) / heads.length;
    let attackMultiplier = attackMultiplierMap[toolName] || 1;
    let attackBonus = attackBonusMap[toolName] || 0;

    // May be wrong, might be flat increase instead of multiplier
    if (hasModifier(calculateModifiers(), 'Fractured II')) attackMultiplier *= 1.8;
    else if (hasModifier(calculateModifiers(), 'Fractured')) attackMultiplier *= 1.5;

    console.log("attack: " + ((headAttackAvg * attackMultiplier) + attackBonus + 1));
    return (headAttackAvg * attackMultiplier) + attackBonus + 1;
  };

  const calculateAttackSpeed = () => {
    let attackSpeed = attackSpeedMap[toolName] || 1;

    if (hasModifier(calculateModifiers(), 'Lightweight')) {
      attackSpeed *= 1.1;
    }

    console.log("attackSpeed: " + attackSpeed);
    return attackSpeed;
  };

  const calculateDPS = () => {

    console.log("DPS: " + calculateAttack() * calculateAttackSpeed());
    return calculateAttack() * calculateAttackSpeed();
  };

  const calculateModifiers = () => {
    const allModifiers = [
      ...heads.flatMap((head) => head?.modifiers || []),
      ...handles.flatMap((handle) => handle?.modifiers || []),
      ...extras.flatMap((extra) => extra?.modifiers || []),
    ];

    // Add Beheading II if Cleaver
    if (toolName === 'Cleaver') {
      allModifiers.push('Beheading II');
    }

    return Array.from(new Set(allModifiers)); // Filter duplicates
  };

  // Helper to calculate ammo for Shuriken
  const calculateAmmo = () => {
    const headDurabilitySum = heads.reduce((total, head) => total + (head?.durability || 0), 0);
    const extraDurabilitySum = extras.reduce((total, extra) => total + (extra?.durability || 0), 0);
    let totalDurability = headDurabilitySum + extraDurabilitySum;

    // Apply modifiers if present
    if (hasModifier(calculateModifiers(), 'Cheapskate II')) {
      totalDurability *= 0.6;
    } else if (hasModifier(calculateModifiers(), 'Cheapskate')) {
      totalDurability *= 0.8;
    }

    // Divide by 40 to calculate final ammo
    return Math.floor(totalDurability / 40);
  };

  // Helper function to format the number, showing decimals only if needed and rounding very small values
  const formatNumber = (num: number) => {
    // Round to 2 decimal places remove trailing zeroes
    return Number.parseFloat(num.toFixed(2));
  };

  // returns Shuriken stats if toolName is Shuriken
  if (toolName === 'Shuriken') {
    const stats = {
      ammo: calculateAmmo(),
      attack: calculateAttack(),
      modifiers: calculateModifiers(),
    };
    return stats;
  }

  // returns stats for all other tools
  const stats = {
    durability: calculateDurability().toFixed(0),
    miningLevel: calculateMiningLevel(),
    miningSpeed: formatNumber(calculateMiningSpeed()),
    attack: formatNumber(calculateAttack()),
    attackSpeed: formatNumber(calculateAttackSpeed()),
    DPS: formatNumber(calculateDPS()),
    modifiers: calculateModifiers(),
  };

  return stats;
};

export default Builder1_12_2;
