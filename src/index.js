import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App';
import ScrollToTop from './hooks/ScrollToTop';

render(<Router><ScrollToTop><App /></ScrollToTop></Router>, document.getElementById('root'));