// src/pages/home/Home.tsx
import React from 'react';
import Navbar from '@components/navbar/Navbar';
import { Link } from 'react-router-dom';
import './Home.css';
const Home = () => {
    return (React.createElement("div", { className: "home" },
        React.createElement(Navbar, null),
        React.createElement("div", { className: "home-content" },
            React.createElement("h1", null, "Welcome to Tinkers Tool Builder"),
            React.createElement("p", null, "This web app allows you to build tools using different materials from Tinkers Construct. Select a version to get started!"),
            React.createElement("div", { className: "version-list" },
                React.createElement(Link, { to: "/versions/1.12.2", className: "version-card" },
                    React.createElement("h2", null, "Version 1.12.2"),
                    React.createElement("p", null, "Build and compare tools with materials available in Tinkers Construct 1.12.2"))))));
};
export default Home;
