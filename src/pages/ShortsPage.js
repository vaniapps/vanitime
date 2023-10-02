import { useState, useRef, useEffect } from 'react';
import AudioPlayer from '../components/AudioPlayer';
import { IonPage, IonHeader, IonToolbar, IonSegment, IonSegmentButton, IonLabel, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon,
     IonPopover, IonList, IonItem, IonDatetime, IonRouterOutlet, IonRange, IonModal, IonInput,
    IonToast, isPlatform } from '@ionic/react';

import VideoPlayer from '../components/VideoPlayer';
import { useLocal } from '../lshooks';

function Shorts(){
    const [videos, setVideos] = useState([
        {
            "url": 'https://www.youtube.com/shorts/lQuocrpCDK4',
            "isPlaying": false
        },
        {
            "url": 'https://www.youtube.com/shorts/Kk7qeIZStIw',
            "isPlaying": false
        }
    ])
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
    const [imageQuotes, setImageQuotes] = useState([
        {
            "url": "https://vanimedia.org/w/images/b/b7/051672_Image-quote.jpg"
        },
        {
            "url": "https://vanimedia.org/w/images/d/d0/051269_Image-quote.jpg"
        },
        {
            "url": "https://vanimedia.org/w/images/thumb/f/f0/CT07-011.JPG/400px-CT07-011.JPG"
        }
    ])
    const [images, setImages] = useState([
        {
            "url": "https://vanimedia.org/w/images/thumb/f/f0/CT07-011.JPG/400px-CT07-011.JPG"
        },
        {
            "url": "https://vanimedia.org/w/images/thumb/e/e0/CT08-001.JPG/400px-CT08-001.JPG"
        },
        {
            "url": "https://vanimedia.org/w/images/thumb/f/f0/CT07-011.JPG/400px-CT07-011.JPG"
        }
    ])
    const [audios, setAudios] = useState([
        {
            "url": "https://s3.amazonaws.com/vanipedia/Nectar+Drops/660904BG-NEW_YORK_ND_01.mp3",
            "isPlaying": false,
            "txt": "So long I have got my bodily conception, when I say 'my self', I think of my body. When I transcend the bodily conception of life, then I think 'I am mind'. But actually, when I am in the real spiritual platform, then my self means 'I am pure spirit'.",
            "src": "660904 - Lecture BG 06.04-12 - New York"

        },
        {
            "url": "https://s3.amazonaws.com/vanipedia/Nectar+Drops/660904BG-NEW_YORK_ND_01.mp3",
            "isPlaying": false,
            "txt": "So long I have got my bodily conception, when I say 'my self', I think of my body. When I transcend the bodily conception of life, then I think 'I am mind'. But actually, when I am in the real spiritual platform, then my self means 'I am pure spirit'.",
            "src": "660904 - Lecture BG 06.04-12 - New York"
        }
    ])
    const [currentAudio, setCurrentAudio] = useState(null)
    const [currentPlaySetter, setCurrentPlaySetter] = useState(null)
    const [currentMode, setCurrentMode] = useLocal("shorts-mode","shorts")

    useEffect(() => {
        const container = document.querySelector('.containerv');
        let currentIndex = 0
        if(container){
        const handleScroll = () => {
          const scrollTop = container.scrollTop;
          const elementHeight = container.clientHeight;
          const index = Math.round(scrollTop / elementHeight);
          if(currentIndex != index){
            let dindex = currentIndex;
            setVideos(prev=>{
                let dum = [...prev]
                dum[dindex].isPlaying = false
                return dum
            })
          }
          currentIndex = index
        };
    
        container.addEventListener('scrollend', handleScroll);
        return () => {
          container.removeEventListener('scrollend', handleScroll);
        };
    }
      }, [currentMode]);
      useEffect(() => {
        const container = document.querySelector('.containera');
        let currentIndex = 0
        if(container){
        const handleScroll = () => {
          const scrollTop = container.scrollTop;
          const elementHeight = container.clientHeight;
          const index = Math.round(scrollTop / elementHeight);
          if(currentIndex != index){
            let dindex = currentIndex;
            setAudios(prev=>{
                let dum = [...prev]
                dum[dindex].isPlaying = false
                return dum
            })
          }
          currentIndex = index
        };
    
        container.addEventListener('scrollend', handleScroll);
        return () => {
          container.removeEventListener('scrollend', handleScroll);
        };
    }
      }, [currentMode]);

      useEffect(()=>{
        setAudios(prev=>{
            let dum = [...prev]
            for (let i=0; i<dum.length; i++){
                dum[i].isPlaying = false
            }
            return dum
        })
        setVideos(prev=>{
            let dum = [...prev]
            for (let i=0; i<dum.length; i++){
                dum[i].isPlaying = false
            }
            return dum
        })
      },[currentMode])

    return(
    <IonPage>
        <IonHeader>
                <IonToolbar>
                    <IonSegment onIonChange={(e)=>{
                        setCurrentMode(e.detail.value)
                    }} value={currentMode}>
                    <IonSegmentButton value="shorts">
                        <IonLabel>Shorts</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="quotes">
                        <IonLabel>Quotes</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="audios">
                        <IonLabel>Audio</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="darshans">
                        <IonLabel>Darshan</IonLabel>
                    </IonSegmentButton>
                    </IonSegment>
                </IonToolbar>
                </IonHeader>
        <IonContent style={{height:"100%" }}>
    <div style={{height:"100%" }} >

       
   
       
  
    {currentMode == "shorts" ? 
    
    <div className='containerv' style={{
        "height": "100%",
        "overflowY": "scroll",
        "scrollSnapType": "y mandatory"
    }}>{videos.map((video,i)=>{
        return(
            <VideoPlayer video={video} i={i} currentAudio={currentAudio} currentVideoIndex={currentVideoIndex} currentPlaySetter={currentPlaySetter} setVideos={setVideos} setCurrentVideoIndex={setCurrentVideoIndex} />
        )
    })}</div>: null}
   
    {currentMode == "quotes" ? <div style={{
        "height": "100%",
        "overflowY": "scroll",
        "scrollSnapType": "y mandatory"
    }}> {imageQuotes.map((image, i) => {
        return (
            <div style={{width: "100%", height: "100%", scrollSnapAlign: "start", "display":"flex", "flexDirection": "column", "justifyContent":"center"}}>
            <img width="100%" src={image.url}></img>
            </div>
        )
    })} </div>: null}
    {currentMode == "audios" ?
     <div className='containera' style={{
        "height": "100%",
        "overflowY": "scroll",
        "scrollSnapType": "y mandatory"
    }}>
     {audios.map((audio, i) => {
        return (
           <AudioPlayer audio={audio} i={i} audios={audios} setAudios={setAudios}  />
        )
    })}</div>: null}
    {currentMode == "darshans" ? <div style={{
        "height": "100%",
        "overflowY": "scroll",
        "scrollSnapType": "y mandatory"
    }}> {images.map((image, i) => {
        return (
            <div style={{width: "100%", height: "100%", scrollSnapAlign: "start", "display":"flex", "flexDirection": "column", "justifyContent":"center"}}>
            <img width="100%" src={image.url}></img>
            </div>
        )
    })} </div>: null}
    </div>
    </IonContent>
    </IonPage>
    )
}

export default Shorts;