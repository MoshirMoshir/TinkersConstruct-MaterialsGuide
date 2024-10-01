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
        <h1>Welcome to the <br/>Tinker's Construct Material Guide!</h1>
        <p>I created this webapp to help you navigate the hundreds of possible materials this wondrous mod contains!</p>
        <p>
        You can also engineer the tools of your dreams with ease! Whether it's optimizing for the best DPS or combining crazy modifiers for synergies, you'll be able to do it all right here in one place!
        </p>
        <p>Select a version to get started:</p>
        <div className="version-list">
          <Link to="/versions/1.12.2" className="version-card">
            <h2>Version 1.12.2</h2>
            <p>Browse materials and create tools available in Tinker's Construct 1.12.2</p>
          </Link>
          {/* Add more versions here */}
        </div>
      </div>
    </div>
  );
};

export default Home;
