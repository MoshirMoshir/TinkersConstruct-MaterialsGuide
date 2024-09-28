// src/pages/versions/1.12.2.tsx
import React, { useState } from 'react';
import Navbar from '@components/navbar/Navbar';
import './1.12.2.css';

const Version1_12_2: React.FC = () => {
  const [activeTab, setActiveTab] = useState('materials');

  return (
    <div className="version-page">
      <Navbar />
      <div className="tabs">
        <button className={activeTab === 'materials' ? 'active' : ''} onClick={() => setActiveTab('materials')}>Materials</button>
        <button className={activeTab === 'tool-builder' ? 'active' : ''} onClick={() => setActiveTab('tool-builder')}>Tool Builder</button>
      </div>
      <div className="tab-content">
        {activeTab === 'materials' && <div>Materials List (Placeholder)</div>}
        {activeTab === 'tool-builder' && <div>Tool Builder (Placeholder)</div>}
      </div>
    </div>
  );
};

export default Version1_12_2;
