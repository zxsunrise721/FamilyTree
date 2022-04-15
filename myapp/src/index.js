import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {FamilyProvider} from './FamilyContext';

ReactDOM.render(  <FamilyProvider><App /></FamilyProvider>, document.getElementById('root') );

