import { useState, useRef, useEffect, useContext } from 'react';
import AudioPlayer from '../components/AudioPlayer';
import { IonPage, IonHeader, IonToolbar, IonSegment, IonSegmentButton, IonLabel, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon,
     IonPopover, IonList, IonItem, IonDatetime, IonRouterOutlet, IonRange, IonModal, IonInput,
    IonToast, isPlatform, IonButtons, IonFab, IonFabButton } from '@ionic/react';

    

import VideoPlayer from '../components/VideoPlayer';
import { useLocal } from '../lshooks';
import { Bookmarks } from '../context';
import { menuOutline, heartOutline, heart } from 'ionicons/icons';

function Shorts(){
    const [bookmarksMap, setBookmarksMap] = useContext(Bookmarks)
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
    const [videosT, setVideosT] = useState([
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
    const [imageQuotesT, setImageQuotesT] = useState([
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
    const [imagesT, setImagesT] = useState([
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
            "txt": 'Prabhupāda: Perfect knowledge is that what you say, that is correct forever. That is perfect. Just like man dies. If somebody says: "Man dies," it is perfect knowledge. It is correct forever. Guest (5): Suppose he is reincarnated? Prabhupāda: No, no, "dies" means the body dies. The soul does not die. Na hanyate hanyamāne śarīre (BG 2.20). When the body annihilates . . . body becomes old. Just like this cloth. I am using it, but when it will be old, no more useful, then I throw it away. I get another dress. This body is like that. Soul is eternal. Na jāyate na mriyate vā kadācit. It does not die, it does not take birth. But because he is in material condition, therefore he has to change the material body, because no material thing is permanent.',
            "src": "660904 - Lecture BG 06.04-12 - New York"

        },
        {
            "url": "https://s3.amazonaws.com/vanipedia/Nectar+Drops/660904BG-NEW_YORK_ND_01.mp3",
            "isPlaying": false,
            "txt": "So long I have got my bodily conception, when I say 'my self', I think of my body. When I transcend the bodily conception of life, then I think 'I am mind'. But actually, when I am in the real spiritual platform, then my self means 'I am pure spirit'.",
            "src": "660904 - Lecture BG 06.04-12 - New York"
        }
    ])
    const [audiosT, setAudiosT] = useState([
        {
            "url": "https://s3.amazonaws.com/vanipedia/Nectar+Drops/660904BG-NEW_YORK_ND_01.mp3",
            "isPlaying": false,
            "txt": 'Prabhupāda: Perfect knowledge is that what you say, that is correct forever. That is perfect. Just like man dies. If somebody says: "Man dies," it is perfect knowledge. It is correct forever. Guest (5): Suppose he is reincarnated? Prabhupāda: No, no, "dies" means the body dies. The soul does not die. Na hanyate hanyamāne śarīre (BG 2.20). When the body annihilates . . . body becomes old. Just like this cloth. I am using it, but when it will be old, no more useful, then I throw it away. I get another dress. This body is like that. Soul is eternal. Na jāyate na mriyate vā kadācit. It does not die, it does not take birth. But because he is in material condition, therefore he has to change the material body, because no material thing is permanent.',
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
    const [isFavourites, setIsFavourites] = useState(false)

    function filterFavourites(list) {
        const map = {}
        const favouriteList = []
        for (let i = 0; i < list.length; i++) {
            map[list[i].url] = list[i]
        }
        for (let key of Object.keys(bookmarksMap["media"])) {
            console.log(key)
            if (map[key]) {
                favouriteList.push(map[key])
            }
        }
        return favouriteList
    }

    useEffect(()=>{
        console.log(isFavourites)
        if(isFavourites) {
            setVideos(filterFavourites(videos))
            setImageQuotes(filterFavourites(imageQuotes))
            setAudios(filterFavourites(audios))
            setImages(filterFavourites(images))
        }else{
            setVideos(videosT)
            setImageQuotes(imageQuotesT)
            setAudios(audiosT)
            setImages(imagesT)
        }
    },[isFavourites])

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
                <IonButtons slot='start'>
                <IonButton>
                    <IonIcon icon={menuOutline}></IonIcon>
                </IonButton>
            </IonButtons>
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
                    <IonButtons slot='end'>
                <IonButton onClick={()=>{
                    setIsFavourites(!isFavourites)
                }}>
                    <IonIcon icon={isFavourites ? heart : heartOutline}></IonIcon>
                </IonButton>
            </IonButtons>
                </IonToolbar>
                </IonHeader>
        <IonContent style={{height:"100%" }}>
        <div style={isPlatform("desktop") ? {display:"flex", justifyContent:"center", height:"100%"} : {height:"100%"}}>
                <div style={isPlatform("desktop") ? {width:"420px", height:"100%"} : {height:"100%"}}>
    <div style={{height:"100%" }} >

       
   
       
  
    {currentMode == "shorts" ? 
    
    <div className='containerv' style={{
        "height": "100%",
        "overflowY": "scroll",
        "scrollSnapType": "y mandatory"
    }}>{videos.map((video,i)=>{
        return(
            <div style={{height:"100%", "position":"relative"}}>
            <VideoPlayer video={video} i={i} currentAudio={currentAudio} currentVideoIndex={currentVideoIndex} currentPlaySetter={currentPlaySetter} setVideos={setVideos} setCurrentVideoIndex={setCurrentVideoIndex} />
            <IonFab style={{position:"absolute", bottom:"2%", right:"2%"}} >
            <IonFabButton onClick={()=>{
                if(bookmarksMap["media"][video.url]) {
                    setBookmarksMap(prev=>{
                        let dum = {...prev}
                        delete dum["media"][video.url]
                        return dum
                    })
                } else {
                    setBookmarksMap(prev=>{
                        let dum = {...prev}
                        dum["media"][video.url] = "audio"
                        return dum
                    })
                }
            }} style={{"opacity":"0.6"}}>
        <IonIcon icon={bookmarksMap["media"][video.url] ? heart : heartOutline} />
        </IonFabButton>
        </IonFab>
    </div>
        )
    })}</div>: null}
   
    {currentMode == "quotes" ? <div style={{
        "height": "100%",
        "overflowY": "scroll",
        "scrollSnapType": "y mandatory"
    }}> {imageQuotes.map((image, i) => {
        return (
            <div style={{position: "relative", width: "100%", height: "100%", scrollSnapAlign: "start", "display":"flex", "flexDirection": "column", "justifyContent":"center"}}>
            <img width="100%" src={image.url}></img>
            <IonFab style={{position:"absolute", bottom:"2%", right:"2%"}}>
            <IonFabButton onClick={()=>{
                if(bookmarksMap["media"][image.url]) {
                    setBookmarksMap(prev=>{
                        let dum = {...prev}
                        delete dum["media"][image.url]
                        return dum
                    })
                } else {
                    setBookmarksMap(prev=>{
                        let dum = {...prev}
                        dum["media"][image.url] = "quote"
                        return dum
                    })
                }
            }} style={{"opacity":"0.6"}}>
        <IonIcon icon={bookmarksMap["media"][image.url] ? heart : heartOutline} />
    </IonFabButton>
    </IonFab>
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
            <div style={{height:"100%", position:"relative"}}>
           <AudioPlayer audio={audio} i={i} audios={audios} setAudios={setAudios}  />
           <IonFab style={{position:"absolute", bottom:"10%", right:"2%"}} >
            <IonFabButton onClick={()=>{
                console.log(audio.txt)
                if(bookmarksMap["media"][audio.url]) {
                    setBookmarksMap(prev=>{
                        let dum = {...prev}
                        delete dum["media"][audio.url]
                        return dum
                    })
                } else {
                    setBookmarksMap(prev=>{
                        let dum = {...prev}
                        dum["media"][audio.url] = "audio"
                        return dum
                    })
                }
            }} style={{"opacity":"0.6"}}>
        <IonIcon icon={bookmarksMap["media"][audio.url] ? heart : heartOutline} />
        </IonFabButton>
    </IonFab>
    </div>
           
        )
    })}</div>: null}
    {currentMode == "darshans" ? <div style={{
        "height": "100%",
        "overflowY": "scroll",
        "scrollSnapType": "y mandatory"
    }}> {images.map((image, i) => {
        return (
            <div style={{position:"relative", width: "100%", height: "100%", scrollSnapAlign: "start", "display":"flex", "flexDirection": "column", "justifyContent":"center"}}>
            <img width="100%" src={image.url}></img>
            <IonFab style={{position:"absolute", bottom:"2%", right:"2%"}}>
            <IonFabButton onClick={()=>{
                if(bookmarksMap["media"][image.url]) {
                    setBookmarksMap(prev=>{
                        let dum = {...prev}
                        delete dum["media"][image.url]
                        return dum
                    })
                } else {
                    setBookmarksMap(prev=>{
                        let dum = {...prev}
                        dum["media"][image.url] = "quote"
                        return dum
                    })
                }
            }} style={{"opacity":"0.6"}}>
        <IonIcon icon={bookmarksMap["media"][image.url] ? heart : heartOutline} />
    </IonFabButton>
    </IonFab>
            </div>
        )
    })} </div>: null}
    
    </div>
    </div>
    </div>
    </IonContent>
    </IonPage>
    )
}

export default Shorts;