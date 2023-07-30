import React from 'react';
import ReactDOM from 'react-dom/client';
import { Redirect, Route, useHistory, BrowserRouter, Switch } from 'react-router-dom';
import App from './App';
import { IonReactRouter } from '@ionic/react-router';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <IonReactRouter>
  
    <App />

    </IonReactRouter>
);
