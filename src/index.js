import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import './global.css';
import { ThemeProviderWrapper } from './ThemeContext';
import  { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(


  <React.StrictMode>
    <ThemeProviderWrapper>
    <App />
    </ThemeProviderWrapper>
  </React.StrictMode>


);


reportWebVitals();
