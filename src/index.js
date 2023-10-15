import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { IonReactRouter } from '@ionic/react-router'
import { ContextProvider } from './context'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
 <IonReactRouter>
  <ContextProvider>
   <App />
  </ContextProvider>
 </IonReactRouter>
)
