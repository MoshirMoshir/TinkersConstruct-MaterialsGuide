// src/components/navbar/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">Tinkers Tool Builder</Link>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/versions/1.12.2">Version 1.12.2</Link></li>
          {/* Add more links as needed */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
