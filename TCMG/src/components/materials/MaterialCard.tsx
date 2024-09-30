import React, { useEffect, useState } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
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

interface Modifier {
  name: string;
  description: string;
}

const MaterialCard: React.FC<MaterialProps> = ({ name, image, head, handle, extra }) => {
  const [modifiers, setModifiers] = useState<Modifier[]>([]);

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
        console.error('Error:', error);
      }
    };

    fetchModifiers();
  }, []);

  // Helper function to get base name of the modifier (ignores II, III, etc.)
  const getBaseModifierName = (modifier: string) => {
    return modifier.replace(/\s[IVX]+$/, ''); // Remove roman numerals like II, III, IV
  };

  // Helper function to find the description for a modifier
  const findModifierDescription = (modifierName: string) => {
    const baseName = getBaseModifierName(modifierName);
    const modifier = modifiers.find((mod) => mod.name === baseName);
    return modifier ? modifier.description : 'No description available';
  };

  return (
    <div className="material-card">
      <div className="scale-wrapper">
        <div className="material-header">
          <img src={image} alt={name} className="material-image" />
          <h2 className="material-name">{name}</h2>
        </div>
        <div className="material-content">
          {/* Head Section */}
          <div className="material-section material-section-head">
            <h4>Head</h4>
            <p>Durability: {head.durability}</p>
            <p>Mining Level: {head.miningLevel}</p>
            <p>Mining Speed: {head.miningSpeed}</p>
            <p>Attack: {head.attack}</p>
            <p>Modifiers:</p>
            <ul>
              {head.modifiers.length > 0
                ? head.modifiers.map((modifier, index) => (
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
                  ))
                : <li>None</li>}
            </ul>
          </div>

          {/* Handle Section */}
          {handle && (
            <div className="material-section material-section-handle">
              <h4>Handle</h4>
              <p>Modifier: {handle.modifier}</p>
              <p>Durability: {handle.durability}</p>
              <p>Modifiers:</p>
              <ul>
                {handle.modifiers.length > 0
                  ? handle.modifiers.map((modifier, index) => (
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
                    ))
                  : <li>None</li>}
              </ul>
            </div>
          )}

          {/* Extra Section */}
          {extra && (
            <div className="material-section material-section-extra">
              <h4>Extra</h4>
              <p>Durability: {extra.durability}</p>
              <p>Modifiers:</p>
              <ul>
                {extra.modifiers.length > 0
                  ? extra.modifiers.map((modifier, index) => (
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
                    ))
                  : <li>None</li>}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialCard;
