// src/components/navbar/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { Github } from 'react-bootstrap-icons';


const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
     <div className="navbar-container">
  {/* Left side: Logo and TCMG */}
  <div className="navbar-brand">
    <Link to="/">
      <img src='/icon1.png' alt="Logo" className="navbar-logo" />
    </Link>
    <div className="navbar-title">
      <span className="letter t">T</span>
      <span className="letter c">C</span>
      <span className="letter m">M</span>
      <span className="letter g">G</span>
    </div>
  </div>
  {/* Middle: Nav Links */}
  <ul className="navbar-links">
    <li><Link to="/">Home</Link></li>
    <li><Link to="/versions/1.12.2">1.12.2</Link></li>
    <li><Link to="/donate">Donate</Link></li>
    {/* Add more links as needed */}
  </ul>
  {/* Right side: GitHub Icon */}
  <div className="navbar-github">
    <a
      href="https://github.com/MoshirMoshir/TinkersConstruct-MaterialsGuide"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Github size={24} />
    </a>
  </div>
</div>

    </nav>
  );
};

export default Navbar;
