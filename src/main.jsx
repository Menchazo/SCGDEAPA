
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  //  NOTE: StrictMode has been temporarily commented out to suppress warnings 
  //  from third-party libraries (like react-leaflet) that use legacy lifecycle methods.
  //  This is a common workaround and does not affect the production build.
  //  It helps keep the development console clean from warnings we cannot fix ourselves.
    <App />
  // </React.StrictMode>
);
