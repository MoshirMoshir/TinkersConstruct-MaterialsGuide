import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@assets/styles/global.css'; // Import global styles
ReactDOM.render(React.createElement(React.StrictMode, null,
    React.createElement(App, null)), document.getElementById('root'));
