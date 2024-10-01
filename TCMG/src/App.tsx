import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '@pages/home/Home';
import Version1_12_2 from '@pages/versions/1.12.2';
import Donate from '@pages/donate/Donate';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/versions/1.12.2" element={<Version1_12_2 />} />
      <Route path="/donate" element={<Donate />} />
    </Routes>
  );
};

export default App;
