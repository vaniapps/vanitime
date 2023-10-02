import { checkboxOutline, chevronBackOutline, bookmarkOutline, playCircleOutline, playBackOutline, playForwardOutline
    ,speedometerOutline, arrowDownCircleOutline, pauseCircleOutline, documentTextOutline, brushOutline, colorPaletteOutline,
    removeCircleOutline, folderOpenOutline, timeOutline } from 'ionicons/icons';
import { IonButton, IonIcon, IonRange, IonToast } from '@ionic/react';
import { useState, useRef, useEffect } from 'react';

function AudioPlayer(props) {
    const audi = useRef();
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0)
    const [play, setPlay] = useState(false);
    const i = props.i
    const audios = props.audios
    const setAudios = props.setAudios
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
   <div style={{fontSize:"20px", textAlign:"center", padding:"10px 0 10px 0"}}>{props.audio.src}</div>
   <div style={{fontSize:"30px", textAlign:"center", padding:"20px"}} >{props.audio.txt}</div>
   
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
              const downloadLink = document.getElementById('downloadLink');
              downloadLink.click();
            }} >
              <IonIcon icon={arrowDownCircleOutline}></IonIcon>
            </IonButton>
           
            <div style={{marginLeft:"5px"}}>{audi.current ? ((audi.current.duration && audi.current.duration!="Infinity") ? formatTime(audi.current.duration.toFixed(0)) : "0:00") : "0:00"}</div>
            </div>
            </div>
          
            <IonToast isOpen={toast != "false"} onDidDismiss={()=>{
                setToast("false")
                }} message={toastMessageMap[toast]} duration={2000}></IonToast>
            </div>
    )
}

export default AudioPlayer