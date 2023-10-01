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
    return(
        <>
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
   <div>
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
                    if( props.currentVideoIndex != -1){
                        props.setVideos(prev=>{
                            let dum = [...prev]
                            dum[props.currentVideoIndex].isPlaying = false
                            return dum
                        })
                    }
                    if (audi.current.duration) {
                    if(props.currentAudio && props.currentAudio.current && props.currentAudio.current != audi.current){
                        props.currentAudio.current.pause()
                        props.currentPlaySetter(false)
                    }
                     audi.current.play();
                     setPlay(!play);
                     props.setCurrentAudio(audi)
                     props.setCurrentPlaySetter(() => setPlay)
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
            <p>{props.audio.txt}</p>
            <p>{props.audio.src}</p>
            </div>
            <IonToast isOpen={toast != "false"} onDidDismiss={()=>{
                setToast("false")
                }} message={toastMessageMap[toast]} duration={2000}></IonToast>
            </>
    )
}

export default AudioPlayer