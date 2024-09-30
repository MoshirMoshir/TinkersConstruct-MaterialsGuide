import { Material } from '@components/builder/ToolBuilder.tsx'; // Import Material type from ToolBuilder

const Builder1_12_2 = (toolName: string, materials: (Material | null)[]) => {
  const calculateDurability = (materials: (Material | null)[]) => {
    // Example logic: average the durability of the selected materials
    return materials.reduce((sum, mat) => sum + (mat ? mat.durability : 0), 0) / materials.length;
  };

  const calculateSpeed = (materials: (Material | null)[]) => {
    // Example logic: average the mining speed
    return materials.reduce((sum, mat) => sum + (mat ? mat.speed : 0), 0) / materials.length;
  };

  const calculateAttack = (materials: (Material | null)[]) => {
    // Example logic: average the attack values
    return materials.reduce((sum, mat) => sum + (mat ? mat.attack : 0), 0) / materials.length;
  };

  const stats = {
    durability: calculateDurability(materials),
    speed: calculateSpeed(materials),
    attack: calculateAttack(materials),
  };

  return stats;
};

export default Builder1_12_2;
