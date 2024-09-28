// src/pages/versions/1.12.2.tsx
import React, { useState } from 'react';
import Navbar from '@components/navbar/Navbar';
import './1.12.2.css';
const Version1_12_2 = () => {
    const [activeTab, setActiveTab] = useState('materials');
    return (React.createElement("div", { className: "version-page" },
        React.createElement(Navbar, null),
        React.createElement("div", { className: "tabs" },
            React.createElement("button", { className: activeTab === 'materials' ? 'active' : '', onClick: () => setActiveTab('materials') }, "Materials"),
            React.createElement("button", { className: activeTab === 'tool-builder' ? 'active' : '', onClick: () => setActiveTab('tool-builder') }, "Tool Builder")),
        React.createElement("div", { className: "tab-content" },
            activeTab === 'materials' && React.createElement("div", null, "Materials List (Placeholder)"),
            activeTab === 'tool-builder' && React.createElement("div", null, "Tool Builder (Placeholder)"))));
};
export default Version1_12_2;
