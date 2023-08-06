import { Redirect, Route, useHistory } from 'react-router-dom';
import {
  IonApp,
  IonContent,
  IonFooter,
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonSegment,
  IonSegmentButton,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle, settingsSharp, hourglassOutline, statsChartOutline, bookmarksOutline, settingsOutline } from 'ionicons/icons';
import YouTube from 'react-youtube';
import Time from './pages/HomePage';
import './styles.css';

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
   
      <IonPage>
        <IonContent>
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
        </IonContent>
        <IonFooter>
        <IonSegment  value="default" >
          <IonSegmentButton style={{ minWidth: 0 }} value="default"  onClick={()=>history.push("/time")}>
            <div style={{display:"flex", flexWrap: "wrap", alignItems:"center"}}>
            <div style={{display:"flex", alignItems:"flex-end", justifyContent:"center", flexBasis:"100%", fontSize:"30px", marginTop:"5px"}}>
            <IonIcon icon={hourglassOutline} />
            </div>
            <div style={{flexBasis:"100%" , fontSize:"10px"}}>
            <IonLabel>VaniTime</IonLabel>
            </div>
            </div>
          </IonSegmentButton>
          <IonSegmentButton style={{ minWidth: 0 }}  onClick={()=>history.push("/stats")}>
            <div style={{display:"flex", flexWrap: "wrap", alignItems:"center"}}>
            <div style={{display:"flex", alignItems:"flex-end", justifyContent:"center", flexBasis:"100%", fontSize:"30px", marginTop:"5px"}}>
            <IonIcon icon={statsChartOutline} />
            </div>
            <div style={{flexBasis:"100%" , fontSize:"10px"}}>
            <IonLabel>Stats</IonLabel>
            </div>
            </div>
          </IonSegmentButton>
          <IonSegmentButton style={{ minWidth: 0 }}  onClick={()=>history.push("/bookmarks")}>
            <div style={{display:"flex", flexWrap: "wrap", alignItems:"center"}}>
            <div style={{display:"flex", alignItems:"flex-end", justifyContent:"center", flexBasis:"100%", fontSize:"30px", marginTop:"5px"}}>
            <IonIcon icon={bookmarksOutline} />
            </div>
            <div style={{flexBasis:"100%" , fontSize:"10px"}}>
            <IonLabel>Bookmarks</IonLabel>
            </div>
            </div>
          </IonSegmentButton>

          <IonSegmentButton style={{ minWidth: 0 }}  onClick={()=>history.push("/setting")}>
            <div style={{display:"flex", flexWrap: "wrap", alignItems:"center"}}>
            <div style={{display:"flex", alignItems:"flex-end", justifyContent:"center", flexBasis:"100%", fontSize:"30px", marginTop:"5px"}}>
            <IonIcon icon={settingsOutline}/>
            </div>
            <div style={{flexBasis:"100%" , fontSize:"10px"}}>
            <IonLabel>Setting</IonLabel>
            </div>
            </div>
          </IonSegmentButton>
        </IonSegment>
        </IonFooter>
        </IonPage>
  </IonApp>
  );
}

export default App;
