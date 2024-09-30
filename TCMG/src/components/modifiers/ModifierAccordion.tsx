import React, { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion'; // Assuming you're using React-Bootstrap
import './ModifierAccordion.css';

interface Modifier {
  name: string;
  description: string;
}

const ModifierAccordion: React.FC = () => {
  const [modifiers, setModifiers] = useState<Modifier[]>([]);

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

  return (
    <Accordion defaultActiveKey="0">
      {modifiers.map((modifier, index) => (
        <Accordion.Item eventKey={String(index)} key={index}>
          <Accordion.Header>{modifier.name}</Accordion.Header>
          <Accordion.Body>{modifier.description}</Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default ModifierAccordion;
