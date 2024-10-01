import React, { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion'; // Assuming you're using React-Bootstrap
import './ModifierAccordion.css';

interface Modifier {
  name: string;
  description: string;
}

const ModifierAccordion: React.FC = () => {
  const [modifiers, setModifiers] = useState<Modifier[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null); // State for active accordion item
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search input

  useEffect(() => {
    const fetchModifiers = async () => {
      try {
        const response = await fetch(`/assets/modifiers.json`);
        if (response.ok) {
          const data = await response.json();
          setModifiers(data);
        } else {
          console.error('Error loading modifiers');
        }
      } catch (error) {
        console.error('Error fetching modifiers:', error);
      }
    };

    fetchModifiers();
  }, []);

  // Handle mouse enter to open accordion item
  const handleMouseEnter = (index: string) => {
    setActiveKey(index); // Set the accordion item to be open
  };

  // Handle mouse leave to close accordion item
  const handleMouseLeave = () => {
    setActiveKey(null); // Reset the accordion to close all items
  };

  // Filter modifiers based on the search term
  const filteredModifiers = modifiers.filter(
    (modifier) =>
      modifier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      modifier.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Split filtered modifiers into two columns
  const middleIndex = Math.ceil(filteredModifiers.length / 2);
  const firstColumn = filteredModifiers.slice(0, middleIndex);
  const secondColumn = filteredModifiers.slice(middleIndex);

  return (
    <div className="modifier-accordion">

      {/* Search bar */}
      <div className='header'>
        <div className="title-container">
          <span className="title">Material Modifiers</span>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search modifiers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
        </div>
      </div>

        {/* Columns for modifiers */}
      <div className="columns-container">
        <div className="column">
          <Accordion activeKey={activeKey}>
            {firstColumn.map((modifier, index) => (
              <Accordion.Item
                eventKey={`first-${index}`}
                key={`first-${index}`}
                onMouseEnter={() => handleMouseEnter(`first-${index}`)}
                onMouseLeave={handleMouseLeave}
              >
                <Accordion.Header>{modifier.name}</Accordion.Header>
                <Accordion.Body>{modifier.description}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>

        <div className="column">
          <Accordion activeKey={activeKey}>
            {secondColumn.map((modifier, index) => (
              <Accordion.Item
                eventKey={`second-${index}`}
                key={`second-${index}`}
                onMouseEnter={() => handleMouseEnter(`second-${index}`)}
                onMouseLeave={handleMouseLeave}
              >
                <Accordion.Header>{modifier.name}</Accordion.Header>
                <Accordion.Body>{modifier.description}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default ModifierAccordion;
