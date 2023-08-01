import { Redirect, Route, useHistory } from 'react-router-dom';
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
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle, settingsSharp } from 'ionicons/icons';
import YouTube from 'react-youtube';
import Tab1 from './pages/HomePage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';



setupIonicReact({
  mode: "ios",
  });

function App() {
  let history = useHistory();
  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };
  return (
    <IonApp>
   
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/tab1">
            <Tab1 />
          </Route>
          <Route path="/tab2">
          <YouTube videoId="2g811Eo7K8U" opts={opts} />
          </Route>
          <Route exact path="/">
            <Redirect to="/tab1" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/tab1">
            <IonIcon aria-hidden="true" icon={triangle} />
            <IonLabel>VaniTime</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/tab2">
            <IonIcon aria-hidden="true" icon={ellipse} />
            <IonLabel>History</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/tab1">
            <IonIcon aria-hidden="true" icon={square} />
            <IonLabel>Stats</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab4" href="/tab1">
            <IonIcon aria-hidden="true" icon={settingsSharp} />
            <IonLabel>Settings</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
  </IonApp>
  );
}

export default App;
