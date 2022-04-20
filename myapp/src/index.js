import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {FamilyProvider} from './FamilyContext';
import {UserProvider} from './UserContext';

ReactDOM.render(  <UserProvider><FamilyProvider><App /></FamilyProvider></UserProvider>, document.getElementById('root') );

