import { Redirect, Route, useHistory, useRouteMatch } from 'react-router-dom';
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
import { hourglassOutline, statsChartOutline, bookmarksOutline, settingsOutline, bookOutline } from 'ionicons/icons';
import { useEffect, useState, useContext } from 'react';
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
import BookmarkFolders from './pages/BookmarkFoldersPage';
import VaniTimePage from './pages/VaniTimePage';
import Vedabase from './pages/VedabasePage';
import Text from './pages/TextPage';
import Audio from './pages/AudioPage';
import Book from './pages/BookPage';
import Lecture from './pages/LecturePage';


setupIonicReact({
  mode: "ios",
  });

function App() {
  let history = useHistory();
  const [currentTab, setCurrentTab] = useState()
  useEffect(()=>{
    let currentPath = window.location.pathname
    if(currentPath.includes("vanitime")) setCurrentTab("vanitime")
    if(currentPath.includes("vedabase")) setCurrentTab("vedabase")
    if(currentPath.includes("stats")) setCurrentTab("stats")
    if(currentPath.includes("setting")) setCurrentTab("setting")
    if(currentPath.includes("bookmarks")) setCurrentTab("bookmarks")

  },[])
  
  return (
    <IonApp>
   
      <IonPage>
        <IonContent>
        <IonRouterOutlet>
        
          <Route path="/vanitime">
            <VaniTimePage />
          </Route>
          <Route path="/vedabase">
            <Vedabase />
          </Route>
          <Route path="/stats">
            <Stats />
          </Route>
          <Route path={"/history/:key"}>
            <History />
          </Route>
          <Route path={"/bookmarks"}>
           <BookmarkFolders />
          </Route>
          <Route path={"/setting"}>
          <h1>Page Under Construction</h1>
          </Route>
          <Route path={"/lecture/:key"}>
            <Audio />
          </Route>
          <Route path={"/purports/:key"}>
          <Text />
          </Route>
          <Route path={"/lectureindex/:key"}>
            <Lecture />
          </Route>
          <Route path={"/bookindex/:key"}>
          <Book />
          </Route>
          <Route path={"/otherbooks"}>
            <h1>Page Under Construction</h1>
          </Route>
          <Route exact path="/">
            <Redirect to="/vanitime" />
          </Route>
        </IonRouterOutlet>
        </IonContent>
        <IonFooter>
        <IonSegment  value={currentTab} >
        <IonSegmentButton style={{ minWidth: 0 }} value="setting"  onClick={()=>history.push("/setting")}>
            <div style={{display:"flex", flexWrap: "wrap", alignItems:"center"}}>
            <div style={{display:"flex", alignItems:"flex-end", justifyContent:"center", flexBasis:"100%", fontSize:"30px", marginTop:"5px"}}>
            <IonIcon icon={settingsOutline}/>
            </div>
            <div style={{flexBasis:"100%" , fontSize:"10px"}}>
            <IonLabel>Setting</IonLabel>
            </div>
            </div>
          </IonSegmentButton>
          <IonSegmentButton style={{ minWidth: 0 }} value="vedabase"  onClick={()=>history.push("/vedabase")}>
            <div style={{display:"flex", flexWrap: "wrap", alignItems:"center"}}>
            <div style={{display:"flex", alignItems:"flex-end", justifyContent:"center", flexBasis:"100%", fontSize:"30px", marginTop:"5px"}}>
            <IonIcon icon={bookOutline}/>
            </div>
            <div style={{flexBasis:"100%" , fontSize:"10px"}}>
            <IonLabel>Vedabase</IonLabel>
            </div>
            </div>
          </IonSegmentButton>
          <IonSegmentButton style={{ minWidth: 0 }} value="vanitime"  onClick={()=>history.push("/vanitime")}>
            <div style={{display:"flex", flexWrap: "wrap", alignItems:"center"}}>
            <div style={{display:"flex", alignItems:"flex-end", justifyContent:"center", flexBasis:"100%", fontSize:"30px", marginTop:"5px"}}>
            <IonIcon icon={hourglassOutline} />
            </div>
            <div style={{flexBasis:"100%" , fontSize:"10px"}}>
            <IonLabel>VaniTime</IonLabel>
            </div>
            </div>
          </IonSegmentButton>
          <IonSegmentButton style={{ minWidth: 0 }} value="stats"  onClick={()=>history.push("/stats")}>
            <div style={{display:"flex", flexWrap: "wrap", alignItems:"center"}}>
            <div style={{display:"flex", alignItems:"flex-end", justifyContent:"center", flexBasis:"100%", fontSize:"30px", marginTop:"5px"}}>
            <IonIcon icon={statsChartOutline} />
            </div>
            <div style={{flexBasis:"100%" , fontSize:"10px"}}>
            <IonLabel>Stats</IonLabel>
            </div>
            </div>
          </IonSegmentButton>
          <IonSegmentButton style={{ minWidth: 0 }} value="bookmarks"  onClick={()=>history.push("/bookmarks")}>
            <div style={{display:"flex", flexWrap: "wrap", alignItems:"center"}}>
            <div style={{display:"flex", alignItems:"flex-end", justifyContent:"center", flexBasis:"100%", fontSize:"30px", marginTop:"5px"}}>
            <IonIcon icon={bookmarksOutline} />
            </div>
            <div style={{flexBasis:"100%" , fontSize:"10px"}}>
            <IonLabel>Bookmarks</IonLabel>
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
