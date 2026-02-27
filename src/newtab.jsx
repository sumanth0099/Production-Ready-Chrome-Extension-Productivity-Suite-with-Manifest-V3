import React from 'react';
import ReactDOM from 'react-dom/client';
import NewTabApp from './components/NewTabApp';
import './styles/newtab.css';

ReactDOM.createRoot(document.getElementById('newtab-root')).render(
  <React.StrictMode>
    <NewTabApp />
  </React.StrictMode>
);
