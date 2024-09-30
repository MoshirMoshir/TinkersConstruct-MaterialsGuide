import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter as Router} from 'react-router-dom';  // Import HashRouter
import 'bootstrap/dist/css/bootstrap.min.css';
import '@assets/styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
)
