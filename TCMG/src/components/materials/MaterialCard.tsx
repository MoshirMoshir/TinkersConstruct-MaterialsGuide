import React from 'react';
import './MaterialCard.css';

interface MaterialProps {
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

const MaterialCard: React.FC<MaterialProps> = ({ name, image, head, handle, extra }) => {
  return (
    <div className="material-card">
      <div className="scale-wrapper">
        <div className="material-header">
          <img src={image} alt={name} className="material-image" />
          <h2 className="material-name">{name}</h2>
        </div>
        <div className="material-content">
          <div className="material-section">
            <h4>Head</h4>
            <p>Durability: {head.durability}</p>
            <p>Mining Level: {head.miningLevel}</p>
            <p>Mining Speed: {head.miningSpeed}</p>
            <p>Attack: {head.attack}</p>
            <p>Modifiers: {head.modifiers.length > 0 ? head.modifiers.join(', ') : 'None'}</p>
          </div>
          {handle && (
            <div className="material-section">
              <h4>Handle</h4>
              <p>Modifier: {handle.modifier}</p>
              <p>Durability: {handle.durability}</p>
              <p>Modifiers: {handle.modifiers.length > 0 ? handle.modifiers.join(', ') : 'None'}</p>
            </div>
          )}
          {extra && (
            <div className="material-section">
              <h4>Extra</h4>
              <p>Durability: {extra.durability}</p>
              <p>Modifiers: {extra.modifiers.length > 0 ? extra.modifiers.join(', ') : 'None'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialCard;
