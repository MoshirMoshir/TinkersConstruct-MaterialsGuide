import { Material } from '@components/builder/ToolBuilder.tsx'; // Import Material type from ToolBuilder

const Builder1_12_2 = (_toolName: string, head: Material['head'] | null, handle: Material['handle'] | null, extra: Material['extra'] | null) => {
  const calculateDurability = () => {
    const headDurability = head?.durability || 0;
    const handleDurability = handle?.durability || 0;
    const handleModifier = handle?.modifier || 1;
    const extraDurability = extra?.durability || 0;

    return (headDurability + extraDurability) * handleModifier + handleDurability;
  };

  const calculateSpeed = () => {
    const headSpeed = head?.speed || 0;

    return headSpeed;
  };

  const calculateAttack = () => {
    return head?.attack || 0; // Only head affects attack in 1.12.2
  };

  const calculateModifiers = () => {
    const allModifiers = [];

    if (head?.modifiers) allModifiers.push(...head.modifiers);
    if (handle?.modifiers) allModifiers.push(...handle.modifiers);
    if (extra?.modifiers) allModifiers.push(...extra.modifiers);

    // Filter out duplicate modifiers
    const uniqueModifiers = Array.from(new Set(allModifiers));
    
    return uniqueModifiers;
  };

  const stats = {
    durability: calculateDurability(),
    speed: calculateSpeed(),
    attack: calculateAttack(),
    modifiers: calculateModifiers(),
  };

  return stats;
};

export default Builder1_12_2;
