import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@pages/home/Home';
import Version1_12_2 from '@pages/versions/1.12.2';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/versions/1.12.2" element={<Version1_12_2 />} />
      </Routes>
    </Router>
  );
};

export default App;
