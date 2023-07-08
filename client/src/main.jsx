import React from 'react'
import { Helmet } from 'react-helmet';
import ReactDOM from 'react-dom/client'
import App from './../App.jsx'
import './assets/styles/global.css';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <Router>
      <Helmet>
        <title>Doin' It</title>
      </Helmet>
      <App />
    </Router>
  //</React.StrictMode>,
)
