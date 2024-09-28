// src/components/navbar/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
const Navbar = () => {
    return (React.createElement("nav", { className: "navbar" },
        React.createElement("div", { className: "navbar-container" },
            React.createElement(Link, { to: "/", className: "navbar-brand" }, "Tinkers Tool Builder"),
            React.createElement("ul", { className: "navbar-links" },
                React.createElement("li", null,
                    React.createElement(Link, { to: "/" }, "Home")),
                React.createElement("li", null,
                    React.createElement(Link, { to: "/versions/1.12.2" }, "Version 1.12.2"))))));
};
export default Navbar;
