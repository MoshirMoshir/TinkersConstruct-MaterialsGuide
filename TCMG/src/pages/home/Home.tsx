// src/pages/home/Home.tsx
import React from 'react';
import Navbar from '@components/navbar/Navbar';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
      <Navbar />
      <div className="home-content">
        <h1>Welcome to Tinkers Tool Builder</h1>
        <p>This web app allows you to build tools using different materials from Tinkers Construct. Select a version to get started!</p>
        <div className="version-list">
          <Link to="/versions/1.12.2" className="version-card">
            <h2>Version 1.12.2</h2>
            <p>Build and compare tools with materials available in Tinkers Construct 1.12.2</p>
          </Link>
          {/* Add more versions here */}
        </div>
      </div>
    </div>
  );
};

export default Home;
