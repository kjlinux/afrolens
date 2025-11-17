import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Configurer l'API au démarrage
import { configureAPI } from './config/apiConfig';

// Initialiser la configuration API
configureAPI();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
