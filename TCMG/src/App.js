// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@pages/home/Home';
import Version1_12_2 from '@pages/versions/1.12.2';
const App = () => {
    return (React.createElement(Router, null,
        React.createElement(Routes, null,
            React.createElement(Route, { path: "/", element: React.createElement(Home, null) }),
            React.createElement(Route, { path: "/versions/1.12.2", element: React.createElement(Version1_12_2, null) }))));
};
export default App;
