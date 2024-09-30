import React, { useState } from 'react';
import Navbar from '@components/navbar/Navbar';
import Materials from '@components/materials/Materials';
import ModifierAccordion from '@components/modifiers/ModifierAccordion';
import './1.12.2.css';

const Version1_12_2: React.FC = () => {
  const [activeTab, setActiveTab] = useState('materials');

  return (
    <div className="version-page">
      <Navbar />
      <div className="tabs">
        <button className={activeTab === 'materials' ? 'active' : ''} onClick={() => setActiveTab('materials')}>Materials</button>
        <button className={activeTab === 'tool-builder' ? 'active' : ''} onClick={() => setActiveTab('tool-builder')}>Tool Builder</button>
        <button className={activeTab === 'modifiers' ? 'active' : ''} onClick={() => setActiveTab('modifiers')}>Modifiers</button>
      </div>
      <div className="tab-content">
        {activeTab === 'materials' && <Materials version="1.12.2" />}
        {activeTab === 'tool-builder' && <div>Tool Builder (Placeholder)</div>}
        {activeTab === 'modifiers' && <ModifierAccordion />}
      </div>
    </div>
  );
};

export default Version1_12_2;
