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

  return (
    <Accordion activeKey={activeKey}>
      {modifiers.map((modifier, index) => (
        <Accordion.Item
          eventKey={String(index)}
          key={index}
          onMouseEnter={() => handleMouseEnter(String(index))}
          onMouseLeave={handleMouseLeave}
        >
          <Accordion.Header>{modifier.name}</Accordion.Header>
          <Accordion.Body>{modifier.description}</Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default ModifierAccordion;
