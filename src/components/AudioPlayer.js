import { checkboxOutline, chevronBackOutline, bookmarkOutline, playCircleOutline, playBackOutline, playForwardOutline
    ,speedometerOutline, arrowDownCircleOutline, pauseCircleOutline, documentTextOutline, brushOutline, colorPaletteOutline,
    removeCircleOutline, folderOpenOutline, timeOutline, openOutline } from 'ionicons/icons';
import { IonButton, IonIcon, IonRange, IonToast, IonList, IonItem, IonLabel } from '@ionic/react';
import { useState, useRef, useEffect, useContext } from 'react';
import Modal from 'react-modal';
import { Settings } from '../context';

function AudioPlayer(props) {
    const audi = useRef();
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0)
    const [play, setPlay] = useState(false);
    const i = props.i
    const audios = props.audios
    const setAudios = props.setAudios
    const [settings, setSettings] = useContext(Settings)
    const [alertsMap, setAlertsMap] = useState({
      "speed": false
  })
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
    function formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return [h, m > 9 ? m : h ? "0" + m : m || "0", s > 9 ? s : "0" + s].filter((a) => a).join(":");
       }
       const [toast, setToast] = useState("false")
       const [toastMessageMap, setToastMessageMap] = useState({
           "bookmark_input": "Please select a boomark folder/input a new boomark folder name",
           "loading_audio": "loading, please wait or check your internet connection or else try again later",
           "added_read_later": "Added to Read Later"
       })
       useEffect(() => {
        if (audi.current) {
        audi.current.onloadedmetadata = () => {
          if (audi.current) {
           setDuration(audi.current.duration);
          }}
         };
       }, [audi.current]);
       useEffect(()=>{
        if(!audios[i].isPlaying && audi.current) {
          audi.current.pause();
          setPlay(false);
        }
       },[audios])
    return(
        <div onFocus={(e)=>{
          console.log(e)
        }} style={{height: "100%", width:"100%", display:"flex", flexDirection:"column", "justifyContent": "space-between", alignItems:"center", scrollSnapAlign: "start"}}>
        <audio
   
    onTimeUpdate={() => {
     setCurrentTime(audi.current.currentTime);
    }}
    ref={audi}
    src={props.audio.url}
    loop
   >
    Your browser does not support the audio element.
   </audio>
   <div style={{fontSize:"20px", textAlign:"center", padding:"10px 0 0 0"}}>{props.audio.src}</div>
   <div style={{fontSize:"20px", textAlign:"justify", padding:"0 20px 0 20px", height:"75%", display:'flex', alignItems:"center", overflowY:"scroll"}} >{props.audio.txt}</div>
   
   <div style={{ "width":"100%"}}>
        <IonRange value={currentTime} onIonChange={(e)=>{
            if (audi.current) {
              audi.current.currentTime = e.detail.value;
              setCurrentTime(e.detail.value)
             } 
          }} min={0} max={duration} style={{paddingLeft:"5px", paddingRight:"5px", marginTop:"-10px", marginBottom:"-10px", "zIndex": "100"}}></IonRange>
          <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
           <div style={{marginRight:"5px"}}>{formatTime(currentTime.toFixed(0))}</div>
           
           <IonButton size='small' style={{"height": "36px", width:"48px"}} onClick={()=>{
            setAlertsMap(prev=>{
              let dum = {...prev}
              dum["speed"] = true
              return dum
            })
           }} >
              <IonIcon icon={speedometerOutline}></IonIcon>
            </IonButton>
           <IonButton size='small' style={{"height": "36px", width:"48px"}}  onClick={()=>{
            if (audi.current) audi.current.currentTime -= 15;
           }} >
              <IonIcon icon={playBackOutline}></IonIcon>
            </IonButton>
            <IonButton size='small' style={{"height": "36px", width:"48px"}}  onClick={()=>{
                  if (!play) {
                    if (audi.current.duration) {
                     audi.current.play();
                     setPlay(!play);
                     setAudios(prev=>{
                        let dum = [...prev]
                        dum[i].isPlaying = true
                        return dum
                     })
                    } else {
                     setToast("loading_audio")
                    }
                   }
                   else if (play) {
                    audi.current.pause();
                    setPlay(!play);
                   }
            }}>
              <IonIcon icon={!play ? playCircleOutline : pauseCircleOutline }></IonIcon>
            </IonButton>
            <IonButton size='small' style={{"height": "36px", width:"48px"}}  onClick={()=>{
            if (audi.current) audi.current.currentTime += 15;
           }}> 
              <IonIcon icon={playForwardOutline}></IonIcon>
            </IonButton>
            <IonButton size='small' style={{"height": "36px", width:"48px"}}  onClick={()=>{
              window.location.assign(props.audio.url)
            }} >
              <IonIcon icon={openOutline}></IonIcon>
            </IonButton>
           
            <div style={{marginLeft:"5px"}}>{audi.current ? ((audi.current.duration && audi.current.duration!="Infinity") ? formatTime(audi.current.duration.toFixed(0)) : "0:00") : "0:00"}</div>
            </div>
            </div>
          
            <IonToast isOpen={toast != "false"} onDidDismiss={()=>{
                setToast("false")
                }} message={toastMessageMap[toast]} duration={2000}></IonToast>

    <Modal isOpen={alertsMap["speed"]}
      onRequestClose={()=>{
        setAlertsMap(prev => {
          let dum = {...prev}
          dum["speed"] = false
          return dum
        })
      }}
      style={customStyles}
      closeTimeoutMS={200}>
        <div>
          <div style={{"textAlign":"center", "marginTop":"10px"}}>Audio Speed Rate {audi.current ? `(${audi.current.playbackRate}x)`  : null}</div>
          <IonList>
        {[...["0.5", "0.75", "1", "1.25", "1.5", "1.75", "2"].map(speed=>{
          return(
            <IonItem onClick={()=>{
              if (audi.current) audi.current.playbackRate = speed;
              setAlertsMap(prev => {
                let dum = {...prev}
                dum["speed"] = false
                return dum
              })
            }} style={{"textAlign":"center"}}>
              <IonLabel>{speed}x</IonLabel>
            </IonItem>
          )
        })
      ]}
      </IonList>
      <div style={{textAlign:"center", marginTop:"10px"}}>
        <IonButton onClick={()=>{
          setAlertsMap(prev => {
            let dum = {...prev}
            dum["speed"] = false
            return dum
          })
        }}>
          Cancel
        </IonButton>
      </div>
        </div>

    </Modal>
            </div>
            
    )
}

export default AudioPlayer