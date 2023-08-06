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
import { ellipse, square, triangle, settingsSharp, hourglassOutline, statsChartOutline, bookmarksOutline, settingsOutline } from 'ionicons/icons';
import YouTube from 'react-youtube';
import Time from './pages/HomePage';

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
import Stats from './pages/StatsPage';
import History from './pages/HistoryPage';



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
          <Route path="/time">
            <Time />
          </Route>
          <Route path="/stats">
            <Stats />
          </Route>
          <Route path={"/history/:key"}>
            <History />
          </Route>
          <Route path={"/bookmarks"}>
           <h1>Page Under Construction</h1>
          </Route>
          <Route path={"/setting"}>
          <h1>Page Under Construction</h1>
          </Route>
          <Route exact path="/">
            <Redirect to="/time" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/time">
            <IonIcon aria-hidden="true" icon={hourglassOutline} />
            <IonLabel>VaniTime</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/stats">
            <IonIcon aria-hidden="true" icon={statsChartOutline} />
            <IonLabel>Stats</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/bookmarks">
            <IonIcon aria-hidden="true" icon={bookmarksOutline} />
            <IonLabel>BooksMarks</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab4" href="/setting">
            <IonIcon aria-hidden="true" icon={settingsOutline} />
            <IonLabel>Setting</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
  </IonApp>
  );
}

export default App;
