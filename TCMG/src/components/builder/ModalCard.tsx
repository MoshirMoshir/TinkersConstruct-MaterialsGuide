import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Material } from '@components/builder/ToolBuilder.tsx';
import './ModalCard.css';

interface Modifier {
  name: string;
  description: string;
}

interface ModalCardProps {
  toolName: string;
  materials: Array<Material | null>;
  stats: any;
  onRemove: () => void;
  modifiersData: Modifier[]; // Add this line
}

const ModalCard: React.FC<ModalCardProps> = ({ toolName, stats, onRemove, modifiersData }) => {
  // Function to find the description for a modifier
  const findModifierDescription = (modifierName: string) => {
    const modifier = modifiersData.find((mod) => mod.name === modifierName);
    return modifier ? modifier.description : 'No description available';
  };

  return (
    <div className="modal-card">
      <button className="close-button" onClick={onRemove}>
        &times;
      </button>
      <h3 className="modal-card-title">{toolName}</h3>
      <img
        src={`/assets/tools/${toolName}.png`}
        alt={toolName}
        className="tool-image"
      />
      <div className="tool-stats-card">
        {/* Display the stats similar to how they are displayed in ToolBuilder */}
        <p>Durability: {stats?.durability || 'N/A'}</p>
        <p>Mining Level: {stats?.miningLevel || 'N/A'}</p>
        <p>Mining Speed: {stats?.miningSpeed || 'N/A'}</p>
        <p>Attack Damage: {stats?.attack || 'N/A'}</p>
        <p>Attack Speed: {stats?.attackSpeed || 'N/A'}</p>
        <p>DPS: {stats?.DPS || 'N/A'}</p>
        <p>Modifiers:</p>
          {stats?.modifiers?.length > 0 ? (
            <ul>
              {stats.modifiers.map((modifier: string, index: number) => (
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
      </div>
    </div>
  );
};

export default ModalCard;
