import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import LoadingScreen from './pages/LoadingScreen'
import { BrowserRouter } from 'react-router-dom';
import App from './App';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
