import { Redirect, Route, useHistory, useRouteMatch, useLocation } from 'react-router-dom';
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
  setupIonicReact,
  IonModal,
  IonItem,
  IonCheckbox,
  IonButton,
  IonToolbar,
} from '@ionic/react';
import { hourglassOutline, statsChartOutline, bookmarksOutline, settingsOutline, bookOutline, albumsOutline } from 'ionicons/icons';
import { useEffect, useState, useContext, useRef } from 'react';
import {findNextPurport} from "./scripts/findNextPurports"
import Modal from 'react-modal';
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
import Vanibase from './pages/VanibasePage';
import Text from './pages/TextPage';
import Audio from './pages/AudioPage';
import Book from './pages/BookPage';
import Lecture from './pages/LecturePage';
import { Books, CheckAlerts, CurrentBook, CurrentLecture, CurrentVersesMap, IncompleteUserHistory, Lectures, Setting, Settings, UserHistory } from './context';
import minutesToMinutes from './scripts/durationToMinutes';
import SettingPage from './pages/SettingPage';
import Shorts from './pages/ShortsPage';






setupIonicReact({
  mode: "ios",
  });

function App() {
  let history = useHistory();
  let { path, url } = useRouteMatch();
  const [currentTab, setCurrentTab] = useState()
  const [checkAlerts, setCheckAlerts] = useContext(CheckAlerts)
  const [currentVersesMap, setCurrentVersesMap] = useContext(CurrentVersesMap)
  const [currentLecture, setCurrentLecture] = useContext(CurrentLecture)
  const [booksMap, setBooksMap] = useContext(Books)
  const [userHistory, setUserHistory] = useContext(UserHistory)
  const [currentBook, setCurrentBook] = useContext(CurrentBook)
  const [incompleteUserHistory, setIncompleteUserHistory] = useContext(IncompleteUserHistory)
  const [lectureMap, setLecturesMap] = useContext(Lectures)
  const [settings, setSettings] = useContext(Settings)
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: "90%",
      maxWidth: "400px",
      padding: 0,
      backgroundColor: settings.theme == "light" ? "#ffffff" : "#121212",
      color: settings.theme == "light" ? "black" :  "#ffffff",
      borderColor: settings.theme == "light" ? "#ffffff" : "#121212"
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    }
  };
  let location = useLocation();
  const containerRef = useRef(null);
  const scrollY = useRef(0);

  // useEffect(() => {
  //   const container = containerRef.current;

  //   const handleScroll = () => {
  //     console.log("working")
  //     // Get the current scroll position
  //     const currentScrollY = window.scrollY;

  //     // Calculate the difference in scroll position
  //     const scrollDelta = currentScrollY - scrollY.current;

  //     // Update the scroll position reference
  //     scrollY.current = currentScrollY;

  //     // Find the currently visible video
  //     const videos = container.querySelectorAll('.video');
  //     let visibleVideo = null;

  //     videos.forEach((video) => {
  //       const rect = video.getBoundingClientRect();
  //       console.log(rect, window.innerHeight)
  //       if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
  //         visibleVideo = video;
  //       }
  //     });

  //     // Scroll to the nearest video based on the scroll direction
  //     if (visibleVideo) {
  //       console.log(visibleVideo, scrollDelta)
  //       if ( visibleVideo.nextElementSibling) {
  //         visibleVideo.nextElementSibling.scrollIntoView({ behavior: 'smooth' });
  //       } else if ( visibleVideo.previousElementSibling) {
  //         visibleVideo.previousElementSibling.scrollIntoView({ behavior: 'smooth' });
  //       }
  //     }
  //   };

  //   // Attach the scroll event listener
  //   container.addEventListener('scroll', handleScroll);

  //   // Clean up the event listener when the component unmounts
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);





  useEffect(()=>{
    let backgroundColor;
    let backgroundRGB;
    let textColor;
    let primaryColor;
    let primaryHoverColor;
    let boxShadow;
    let cardTextColor;
    if(settings.theme == "light"){
      backgroundColor = "#ffffff"
      backgroundRGB = "255, 255, 255"
      textColor = "#000000"
      primaryColor = "#1e90ff"
      primaryHoverColor = "#1871b5"
      boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.08)"
      cardTextColor = "black"
    }
    if(settings.theme == "dark"){
      backgroundColor = "#121212"
      backgroundRGB = "18, 18, 18"
      textColor = "#ffffff"
      primaryColor = "#3498db"
      primaryHoverColor = "#2980b9"
      boxShadow = "0 4px 6px rgba(255, 255, 255, 0.06), 0 5px 15px rgba(255, 255, 255, 0.08)"
      cardTextColor = "white"
    }


    document.documentElement.style.setProperty('--ion-background-color', backgroundColor);
    document.documentElement.style.setProperty('--ion-background-rgb', backgroundRGB);
    document.documentElement.style.setProperty('--ion-text-color', textColor);
    document.documentElement.style.setProperty('--ion-color-primary', primaryColor);
    document.documentElement.style.setProperty('--ion-color-primary-shade', primaryHoverColor);
    document.documentElement.style.setProperty('--ion-color-primary-tint', primaryHoverColor);
    document.documentElement.style.setProperty('--ion-toolbar-background', primaryColor);
    document.documentElement.style.setProperty('--ion-toolbar-color', "#ffffff");

    document.documentElement.style.setProperty('--ion-toolbar-segment-color', "#ffffff");
    document.documentElement.style.setProperty('--ion-toolbar-segment-color-checked', primaryColor);
    document.documentElement.style.setProperty('--ion-toolbar-segment-indicator-color', "#ffffff");
    document.documentElement.style.setProperty('--ion-box-shadow', boxShadow);
    document.documentElement.style.setProperty('--ion-border', "1px solid " + (settings.theme == "light" ? "#DDDDDD" : "#444444"));

    document.documentElement.style.setProperty('--ion-font-family', settings.font_style);
    document.documentElement.style.setProperty('font-size', '16px');
    document.documentElement.style.setProperty('font-weight', settings.font_style == "Papyrus, fantasy" ? '500' : "normal");
    document.documentElement.style.setProperty('--ion-card-title-size', settings.font_style.includes('monospace') ? "20px" : "25px");
    document.documentElement.style.setProperty('--ion-card-text-color', cardTextColor);

    
  },[settings])

  useEffect(()=>{
    console.log(location)
    let currentPath = window.location.pathname
    if(currentPath.includes("vanitime")) setCurrentTab("vanitime")
    if(currentPath.includes("vanibase") || currentPath.includes("index")) setCurrentTab("vanibase")
    if(currentPath.includes("stats") || currentPath.includes("history")) setCurrentTab("stats")
    if(currentPath.includes("setting")) setCurrentTab("setting")
    if(currentPath.includes("bookmarks")) setCurrentTab("bookmarks")
    if(currentPath.includes("vanishorts")) setCurrentTab("vanishorts")
    

  },[location])

  useEffect(()=>{
    if(!`${location.pathname}`.includes("/purports/") && !`${location.pathname}`.includes("/lecture/")) {
    if(incompleteUserHistory=="purports") setCheckAlerts(prev => {
      let dum = {...prev}
      dum["purports"] = true
      return dum
    })
    if(incompleteUserHistory == "lecture") setCheckAlerts(prev => {
      let dum = {...prev}
      dum["lecture"] = true
      return dum
    })
  }
  }, [location])
  
  return (
    <IonApp>
   
      <IonPage>
        <IonContent>
        <IonRouterOutlet>
        
          <Route path="/vanitime">
            <VaniTimePage />
          </Route>
          <Route path="/vanibase">
            <Vanibase />
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
          <SettingPage />
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
          <Route path={"/vanishorts"}>
          <Shorts />
          </Route>

          <Route path={"/otherbooks"}>
            <h1 style={{marginLeft:"10px"}}>Coming soon...</h1>
            <div class="container">
    <p id="selectable-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
  </div>
          </Route>
          <Route exact path="/">
            <Redirect to="/vanitime" />
          </Route>
        </IonRouterOutlet>
        </IonContent>
        {!`${location.pathname}`.includes("/lecture/") && !`${location.pathname}`.includes("/purports/") ? <IonFooter style={{zIndex: 0}}>
          <IonToolbar style={{zIndex: 0}}>
        <IonSegment  style={{zIndex: 0}}  value={currentTab} >
        {/* <IonSegmentButton style={{ minWidth: 0 }} value="setting"  onClick={()=>history.push("/setting")}>
            <div style={{display:"flex", flexWrap: "wrap", alignItems:"center"}}>
            <div style={{display:"flex", alignItems:"flex-end", justifyContent:"center", flexBasis:"100%", fontSize:"30px", marginTop:"5px"}}>
            <IonIcon icon={settingsOutline}/>
            </div>
            <div style={{flexBasis:"100%" , fontSize:"10px"}}>
            <IonLabel>Setting</IonLabel>
            </div>
            </div>
          </IonSegmentButton> */}
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
          <IonSegmentButton style={{ minWidth: 0 }} value="vanibase"  onClick={()=>history.push("/vanibase")}>
            <div style={{display:"flex", flexWrap: "wrap", alignItems:"center"}}>
            <div style={{display:"flex", alignItems:"flex-end", justifyContent:"center", flexBasis:"100%", fontSize:"30px", marginTop:"5px"}}>
            <IonIcon icon={bookOutline}/>
            </div>
            <div style={{flexBasis:"100%" , fontSize:"10px"}}>
            <IonLabel>VaniBase</IonLabel>
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
          <IonSegmentButton style={{ minWidth: 0 }} value="vanishorts"  onClick={()=>history.push("/vanishorts")}>
            <div style={{display:"flex", flexWrap: "wrap", alignItems:"center"}}>
            <div style={{display:"flex", alignItems:"flex-end", justifyContent:"center", flexBasis:"100%", fontSize:"30px", marginTop:"5px"}}>
            <IonIcon icon={albumsOutline} />
            </div>
            <div style={{flexBasis:"100%" , fontSize:"10px"}}>
            <IonLabel>VaniShorts</IonLabel>
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
        </IonToolbar>
        </IonFooter> : null}

      <Modal
      isOpen={checkAlerts['purports']}
      onRequestClose={()=>{
        setCheckAlerts(prev => {
          let dum = {...prev}
          dum["purports"] = false
          return dum
      })
      setIncompleteUserHistory("")
      }}
      style={customStyles}
      closeTimeoutMS={200}
    >

    <p style={{margin:"10px"}}>Tick the verse which you have read</p>
    <div className='wrapper'> 
    {Object.entries(currentVersesMap).map(([verseKey, verseValue]) => {
        return (
          <IonItem>
            <IonLabel>{verseKey.replace(/_/g, " ")}</IonLabel>
            <IonCheckbox checked={verseValue.checked} onIonChange={(e) => {
                setCurrentVersesMap(prev=>{
                  let dum = {...prev}
                  dum[verseKey]["checked"] = e.detail.checked
                  const now = new Date();
                  const hours = String(now.getHours()).padStart(2, '0');
                  const minutes = String(now.getMinutes()).padStart(2, '0');
                  dum[verseKey]["time"] = `${hours}:${minutes}`
                  let verseKeyParts = verseKey.split(/[_\.]/);
                  let verse = booksMap[verseKeyParts[0]]
                  for (let i=1; i<verseKeyParts.length-1; i++) {
                    verse = verse['parts'][verseKeyParts[i]]
                  }
                  verse = verse['parts']["_"+verseKeyParts[verseKeyParts.length-1]]
                  dum[verseKey]["words_count"] = verse['words_count']
                  return dum
                })
            }} />
          </IonItem>
        )
    })}
    </div> 
      <div style={{display:"flex", justifyContent:"space-evenly", marginTop:"10px"}}>
            <IonButton onClick={()=>{
                setCheckAlerts(prev => {
                  let dum = {...prev}
                  dum["purports"] = false
                  return dum
              })
              setIncompleteUserHistory("")
            }}>Cancel</IonButton> 
            <IonButton onClick={()=>{
                setCheckAlerts(prev => {
                    let dum = {...prev}
                    dum["purports"] = false
                    return dum
                })
                setUserHistory(prev=>{
                  let dum = {...prev}
                  const now = new Date();
                  const day = String(now.getDate()).padStart(2, '0');
                  const month = String(now.getMonth()+1).padStart(2, '0');
                  const year = String(now.getFullYear())
                  const date = day+"-"+month+"-"+year
                  if(!dum[date]) dum[date]={}
                  for (let verse of Object.entries(currentVersesMap)) {
                    if(verse[1]["checked"] && !verse[1]["done"]) {
                      if(!dum[date][verse[0]]) dum[date][verse[0]]=[]
                      dum[date][verse[0]].push({"time": verse[1]["time"], "words_count": verse[1]["words_count"]})
                    }
                    if(!verse[1]["checked"] && verse[1]["done"]) {
                      dum[date][verse[0]].pop()
                      if(dum[date][verse[0]].length == 0) delete dum[date][verse[0]]
                    }
                  }
                  return dum
                })
                setCurrentVersesMap(prev=>{
                  let dum = {...prev}
                  for (let verse of Object.entries(dum)) {
                    if(verse[1]["checked"]) {
                      verse[1]["done"] = true
                    }else{
                      verse[1]["done"] = false
                    }
                  }
                  return dum
                })
                setBooksMap(prev=>{
                  let dum =  JSON.parse(JSON.stringify(prev))
                  let book = ""
                  let chap = ""
                  let sub_chap = ""
                  let verse = ""
                  for (let verseObj of Object.entries(currentVersesMap)) {
                    let verseKeyParts = verseObj[0].split(/[_\.]/);
                    if(verseKeyParts.length == 3) {
                      book=verseKeyParts[0] 
                      chap = verseKeyParts[1]
                      verse = "_"+verseKeyParts[2]
                      if(!dum[book]['parts'][chap]['parts'][verse]["read"] && verseObj[1]["checked"]) dum[book]['parts'][chap]['parts'][verse]["read"] = true
                      if(!dum[book]['parts'][chap]['parts'][verse]["read"] && !verseObj[1]["checked"]) dum[book]['parts'][chap]['parts'][verse]["read"] = false
                    } 
                    if(verseKeyParts.length == 4){
                      book=verseKeyParts[0] 
                      chap = verseKeyParts[1]
                      sub_chap = verseKeyParts[2]
                      verse = "_"+verseKeyParts[3]
                      if(!dum[book]['parts'][chap]['parts'][sub_chap]['parts'][verse]["read"] && verseObj[1]["checked"]) dum[book]['parts'][chap]['parts'][sub_chap]['parts'][verse]["read"] = true
                      if(!dum[book]['parts'][chap]['parts'][sub_chap]['parts'][verse]["read"] && !verseObj[1]["checked"]) dum[book]['parts'][chap]['parts'][sub_chap]['parts'][verse]["read"] = false
                    }
                  }
                  return dum
                })
                setCurrentBook(prev=>{
                  let dum = {...prev}
                  let finalVerse = ""
                  for (let verse of Object.entries(currentVersesMap)) {
                    if(finalVerse && !verse[1]["checked"]) {
                      break
                    }
                    if(finalVerse && verse[1]["checked"]) {
                      finalVerse = verse[0]
                    }
                    if(!finalVerse && verse[1]["checked"]) {
                      let verseKeyParts = verse[0].split(/[_\.]/);
                      if(verseKeyParts.length == 3 && dum["name"]==verseKeyParts[0] && dum["part"] == verseKeyParts[1] && dum["verse"] == verseKeyParts[2]) finalVerse = verse[0]
                      if(verseKeyParts.length == 4 && dum["name"]==verseKeyParts[0] && dum["part"] == verseKeyParts[1] && dum["sub_part"] == verseKeyParts[2] && dum["verse"] == verseKeyParts[3]) finalVerse = verse[0]
                    }
                  }
                  if(finalVerse) {
                    finalVerse = findNextPurport(booksMap, finalVerse)
                    if (!finalVerse){
                      dum["name"] = ""
                      dum["part"] = ""
                      dum["sub_part"] = ""
                      dum["verse"] = ""
                    } else {
                      let verseKeyParts = finalVerse.split(/[_\.]/);
                      if(verseKeyParts.length == 3) {
                        dum["name"]=verseKeyParts[0] 
                        dum["part"] = verseKeyParts[1]
                        dum["verse"] = verseKeyParts[2]
                      } 
                      if(verseKeyParts.length == 4){
                        dum["name"]=verseKeyParts[0] 
                        dum["part"] = verseKeyParts[1]
                        dum["sub_part"] = verseKeyParts[2]
                        dum["verse"] = verseKeyParts[3]
                      }
                    }
                  }
                  return dum

                })
                setIncompleteUserHistory("")
            }}>Done</IonButton>
      </div>
      <div style={{margin:"5px 5px 0 5px", fontSize:"10px"}}>*You can turn off the alerts in settings</div>
    </Modal>

    
    <Modal
      isOpen={checkAlerts['lecture']}
      onRequestClose={()=>{
        setCheckAlerts(prev => {
          let dum = {...prev}
          dum["lecture"] = false
          return dum
      })
      setIncompleteUserHistory("")
      }}
      style={customStyles}
      closeTimeoutMS={200}
    >
    <div style={{textAlign:"center", marginTop:"10px"}}>Have heard the Lecture?</div>
    <div className='wrapper'> 
    <p>{`${currentLecture}`.replace(/_/g, " ")}</p>
    </div> 
      <div style={{display:"flex", justifyContent:"space-evenly"}}>
            <IonButton onClick={()=>{
                setCheckAlerts(prev => {
                  let dum = {...prev}
                  dum["lecture"] = false
                  return dum
              })
              setIncompleteUserHistory("")
            }}>Not Listend</IonButton> 
            <IonButton onClick={()=>{
                setCheckAlerts(prev => {
                    let dum = {...prev}
                    dum["lecture"] = false
                    return dum
                })
       
                    setUserHistory(prev=>{
                    let dum = {...prev}
                    const now = new Date();
                    const hours = String(now.getHours()).padStart(2, '0');
                    const minutes = String(now.getMinutes()).padStart(2, '0');
                    const day = String(now.getDate()).padStart(2, '0');
                    const month = String(now.getMonth()+1).padStart(2, '0');
                    const year = String(now.getFullYear())
                    const date = day+"-"+month+"-"+year
                    if(!dum[date]) dum[date]={}
                    if(!dum[date][currentLecture]) dum[date][currentLecture]=[]
                    let duration = 0;
                    for (let category of Object.entries(lectureMap)) {
                        for (let lecture of Object.entries(category[1]["parts"])) {
                            if(lecture[0] == currentLecture) {
                                duration = minutesToMinutes(lecture[1]["duration"])
                            }
                        }
                    }
                    dum[date][currentLecture].push({"time": `${hours}:${minutes}`, duration})
                    return dum
                    })
                    setLecturesMap(prev=>{
                        let dum = JSON.parse(JSON.stringify(prev))
                        for (let category of Object.entries(dum)) {
                            for (let lecture of Object.entries(category[1]["parts"])) {
                                if(lecture[0] == currentLecture) {
                                    lecture[1]["read"] = true
                                }
                            }
                        }
                        return dum
                    })
                
                setIncompleteUserHistory("")
      
            }}>Listend</IonButton>
      </div>
      <div style={{margin:"5px 5px 0 5px", fontSize:"12px"}}>*You can turn off the alerts in settings</div>
    </Modal>
        </IonPage>
  </IonApp>
  );
}

export default App;
