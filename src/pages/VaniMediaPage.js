import { useState, useRef, useEffect, useContext } from 'react';
import AudioPlayer from '../components/AudioPlayer';
import { IonPage, IonHeader, IonToolbar, IonSegment, IonSegmentButton, IonLabel, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon,
     IonPopover, IonList, IonItem, IonDatetime, IonRouterOutlet, IonRange, IonModal, IonInput,
    IonToast, isPlatform, IonButtons, IonFab, IonFabButton, IonInfiniteScroll, IonInfiniteScrollContent, IonMenuButton } from '@ionic/react';

    

import VideoPlayer from '../components/VideoPlayer';
import { useLocal } from '../lshooks';
import { Bookmarks, MediaFavorites } from '../context';
import { menuOutline, heartOutline, heart } from 'ionicons/icons';
import Image from '../components/Image';


function VaniMedia(props){
    const [bookmarksMap, setBookmarksMap] = useContext(Bookmarks)
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

    const [videos, setVideos] = useState([])
    const [videosFavs, setVideosFavs] = useState([])
    const [imageQuotes, setImageQuotes] = useState([])
    const [imageQuotesFavs, setImageQuotesFavs] = useState([])
    const [images, setImages] = useState([])
    const [imagesFavs, setImagesFavs] = useState([])
    const [audios, setAudios] = useState([])
    const [audiosFavs, setAudiosFavs] = useState([])
    
    const [currentAudio, setCurrentAudio] = useState(null)
    const [currentPlaySetter, setCurrentPlaySetter] = useState(null)
    const [currentMode, setCurrentMode] = useLocal("media-mode","shorts")
    const [isFavourites, setIsFavourites] = useState(false)
    const [mediaFavoritesMap, setMediaFavoritesMap] = useContext(MediaFavorites)
    const [favClicked, setFavClicked] = useState(false)

    function filterFavourites(list) {
        const map = {}
        const favouriteList = []
        for (let i = 0; i < list.length; i++) {
            map[list[i].url] = list[i]
        }
        console.log(map)
        for (let key of Object.keys(mediaFavoritesMap)) {
            if (map[key]) {
                favouriteList.push(map[key])
            }
        }
        return favouriteList
    }

    useEffect(()=>{ 
        if(isFavourites) {
            setVideosFavs(filterFavourites(props.videos))
            setImageQuotesFavs(filterFavourites(props.imageQuotes))
            setAudiosFavs(filterFavourites(props.audios))
            setImagesFavs(filterFavourites(props.images))
        }else if(favClicked) {
            setVideosFavs([])
            setImageQuotesFavs([])
            setAudiosFavs([])
            setImagesFavs([])
            setTimeout(()=>{
                setVideos([])
                setImageQuotes([])
                setAudios([])
                setImages([])
            }, 1)
            setTimeout(()=>{
                setVideos(props.videos)
                setImageQuotes(props.imageQuotes)
                setAudios(props.audios)
                setImages(props.images)
            }, 1000)
        }
        
    },[isFavourites, favClicked])

    useEffect(() => {
        const container = document.querySelector('.videos');
        if(container){
        const handleScroll = () => {
         
          const scrollTop = container.scrollTop;
          const elementHeight = container.clientHeight;
          const index = Math.round(scrollTop / elementHeight);
            setVideos(prev=>{
                let dum = [...prev]
                for(let i=0; i<prev.length; i++){
                    if(i!=index)
                    dum[i].isPlaying = false
                }
                return dum
            })
        };
        container.addEventListener('scroll', handleScroll);
    }
      }, [currentMode, videos]);
      useEffect(() => {
        const container = document.querySelector('.audios');
        if(container){
        const handleScroll = () => {
          const scrollTop = container.scrollTop;
          const elementHeight = container.clientHeight;
          const index = Math.round(scrollTop / elementHeight);
            setAudios(prev=>{
                let dum = [...prev]
                for(let i=0; i<prev.length; i++){
                    if(i!=index)
                    dum[i].isPlaying = false
                }
                return dum
            })
        };
        container.addEventListener('scroll', handleScroll);
    }
      }, [currentMode, audios]);

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


      const generateItems = (items, setItems, list) => {
        console.log(isFavourites)
        if(isFavourites) return
        const newItems = [];
        for (let i = 0; i < 5; i++) {
          if(items.length + i == list.length) break
          newItems.push(list[items.length+i]);
        }
        setItems([...items, ...newItems]);
      };

      function scrollGenerate(container, childClasss, item, setItems, list) {
        console.log(isFavourites)
        var items = document.querySelectorAll('.'+childClasss);
        var lastItem = items[items.length - 1];
        var scrollTop = container.scrollTop || container.scrollTop;
        var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        if (lastItem && scrollTop + clientHeight >= lastItem.offsetTop + lastItem.clientHeight) {
            console.log("generating")
            generateItems(item, setItems, list);
        }
      }

      const scrollListener = (parentClass, childClasss, item, setItems, list) => {
        const container = document.querySelector('.'+parentClass);
        console.log(container, parentClass)
        console.log("callser", isFavourites)
        const listenerFunction = scrollGenerate.bind(null, container, childClasss, item, setItems, list);
        if(container) {
            container.removeEventListener("scroll", listenerFunction);
            container.addEventListener("scroll", listenerFunction);
        }
      };

      
      const removeScrollListener = (parentClass, childClasss, item, setItems, list) => {
        console.log("callrem", isFavourites)
        const container = document.querySelector('.'+parentClass);
        const listenerFunction = scrollGenerate.bind(null, container, childClasss, item, setItems, list);
        if(container) container.removeEventListener("scroll", listenerFunction)
      }

      useEffect(()=>{
        generateItems(videos, setVideos, props.videos)
        generateItems(audios, setAudios, props.audios)
        generateItems(images, setImages, props.images)
        generateItems(imageQuotes, setImageQuotes, props.imageQuotes)
      },[props])

      useEffect(()=>{
        scrollListener("images", "image", images, setImages, props.images)
     },[images, isFavourites])
     useEffect(()=>{
        scrollListener("videos", "video", videos, setVideos, props.videos)
     },[videos, isFavourites])
     useEffect(()=>{
        scrollListener("audios", "audio", audios, setAudios, props.audios)
     },[audios, isFavourites])
     useEffect(()=>{
        scrollListener("imagequotes", "imagequote", imageQuotes, setImageQuotes, props.imageQuotes)
     },[imageQuotes, isFavourites])
      

      

    return(
    <IonPage id="main-content">
        <IonHeader>
                <IonToolbar>
                <IonButtons slot='start'>
        <IonMenuButton></IonMenuButton>
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
                    setFavClicked(true)
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
    
    <>{!isFavourites ? <div className='videos' style={{
        "height": "100%",
        "overflowY": "scroll",
        "scrollSnapType": "y mandatory"
    }}>{videos.map((video,i)=>{
        return(
            
            <div className='video' style={{height:"100%", "position":"relative"}}>
            <VideoPlayer video={video} i={i} currentAudio={currentAudio} currentVideoIndex={currentVideoIndex} currentPlaySetter={currentPlaySetter} setVideos={setVideos} setCurrentVideoIndex={setCurrentVideoIndex} />
            <IonFab style={{position:"absolute", bottom:"10%", right:"2%"}} >
            <IonFabButton onClick={()=>{
                if(mediaFavoritesMap[video.url]) {
                    setMediaFavoritesMap(prev=>{
                        let dum = {...prev}
                        delete dum[video.url]
                        return dum
                    })
                } else {
                    setMediaFavoritesMap(prev=>{
                        let dum = {...prev}
                        dum[video.url] = "audio"
                        return dum
                    })
                }
            }} style={{"opacity":"0.6"}}>
        <IonIcon icon={mediaFavoritesMap[video.url] ? heart : heartOutline} />
        </IonFabButton>
        </IonFab>
    </div>
        )
    })}</div> : <div style={{
        "height": "100%",
        "overflowY": "scroll",
        "scrollSnapType": "y mandatory"
    }}>{videosFavs.map((video,i)=>{
        return(
            
            <div className='video' style={{height:"100%", "position":"relative"}}>
            <VideoPlayer video={video} i={i} currentAudio={currentAudio} currentVideoIndex={currentVideoIndex} currentPlaySetter={currentPlaySetter} setVideos={setVideos} setCurrentVideoIndex={setCurrentVideoIndex} />
            <IonFab style={{position:"absolute", bottom:"10%", right:"2%"}} >
            <IonFabButton onClick={()=>{
                if(mediaFavoritesMap[video.url]) {
                    setMediaFavoritesMap(prev=>{
                        let dum = {...prev}
                        delete dum[video.url]
                        return dum
                    })
                } else {
                    setMediaFavoritesMap(prev=>{
                        let dum = {...prev}
                        dum[video.url] = "audio"
                        return dum
                    })
                }
            }} style={{"opacity":"0.6"}}>
        <IonIcon icon={mediaFavoritesMap[video.url] ? heart : heartOutline} />
        </IonFabButton>
        </IonFab>
    </div>
        )
    })}</div>}</>: null}
   
    {currentMode == "quotes" ? <>{!isFavourites ? <div className= 'imagequotes' style={{
        "height": "100%",
        "overflowY": "scroll",
        "scrollSnapType": "y mandatory"
    }}> {imageQuotes.map((image, i) => {
        return (
            <div className='imagequote' style={{position: "relative", width: "100%", height: "100%", scrollSnapAlign: "start", "display":"flex", "flexDirection": "column", "justifyContent":"center"}}>
            <Image image={image} />
            <IonFab style={{position:"absolute", bottom:"10%", right:"2%"}}>
            <IonFabButton onClick={()=>{
                if(mediaFavoritesMap[image.url]) {
                    setMediaFavoritesMap(prev=>{
                        let dum = {...prev}
                        delete dum[image.url]
                        return dum
                    })
                } else {
                    setMediaFavoritesMap(prev=>{
                        let dum = {...prev}
                        dum[image.url] = "quote"
                        return dum
                    })
                }
            }} style={{"opacity":"0.6"}}>
        <IonIcon icon={mediaFavoritesMap[image.url] ? heart : heartOutline} />
    </IonFabButton>
    </IonFab>
            </div>
        )
    })} </div> : <div style={{
        "height": "100%",
        "overflowY": "scroll",
        "scrollSnapType": "y mandatory"
    }}> {imageQuotesFavs.map((image, i) => {
        return (
            <div className='imagequote' style={{position: "relative", width: "100%", height: "100%", scrollSnapAlign: "start", "display":"flex", "flexDirection": "column", "justifyContent":"center"}}>
            <Image image={image} />
            <IonFab style={{position:"absolute", bottom:"10%", right:"2%"}}>
            <IonFabButton onClick={()=>{
                if(mediaFavoritesMap[image.url]) {
                    setMediaFavoritesMap(prev=>{
                        let dum = {...prev}
                        delete dum[image.url]
                        return dum
                    })
                } else {
                    setMediaFavoritesMap(prev=>{
                        let dum = {...prev}
                        dum[image.url] = "quote"
                        return dum
                    })
                }
            }} style={{"opacity":"0.6"}}>
        <IonIcon icon={mediaFavoritesMap[image.url] ? heart : heartOutline} />
    </IonFabButton>
    </IonFab>
            </div>
        )
    })} </div>} </>: null}
    {currentMode == "audios" && props.audios ?
     <>{!isFavourites ? <div className='audios' style={{
        "height": "100%",
        "overflowY": "scroll",
        "scrollSnapType": "y mandatory"
    }}>
     {audios.map((audio, i) => {
        return (
        <div className='audio' style={{height:"100%", position:"relative"}}>
           <AudioPlayer audio={audio} i={i} audios={audios} setAudios={setAudios}  />
           <IonFab style={{position:"absolute", bottom:"10%", right:"2%"}} >
            <IonFabButton onClick={()=>{
                if(mediaFavoritesMap[audio.url]) {
                    setMediaFavoritesMap(prev=>{
                        let dum = {...prev}
                        delete dum[audio.url]
                        return dum
                    })
                } else {
                    setMediaFavoritesMap(prev=>{
                        let dum = {...prev}
                        dum[audio.url] = "audio"
                        return dum
                    })
                }
            }} style={{"opacity":"0.6"}}>
        <IonIcon icon={mediaFavoritesMap[audio.url] ? heart : heartOutline} />
        </IonFabButton>
    </IonFab>
    </div>
           
        )
    })}</div> : <div style={{
        "height": "100%",
        "overflowY": "scroll",
        "scrollSnapType": "y mandatory"
    }}>
     {audiosFavs.map((audio, i) => {
        return (
        <div className='audio' style={{height:"100%", position:"relative"}}>
           <AudioPlayer audio={audio} i={i} audios={audios} setAudios={setAudios}  />
           <IonFab style={{position:"absolute", bottom:"10%", right:"2%"}} >
            <IonFabButton onClick={()=>{
                if(mediaFavoritesMap[audio.url]) {
                    setMediaFavoritesMap(prev=>{
                        let dum = {...prev}
                        delete dum[audio.url]
                        return dum
                    })
                } else {
                    setMediaFavoritesMap(prev=>{
                        let dum = {...prev}
                        dum[audio.url] = "audio"
                        return dum
                    })
                }
            }} style={{"opacity":"0.6"}}>
        <IonIcon icon={mediaFavoritesMap[audio.url] ? heart : heartOutline} />
        </IonFabButton>
    </IonFab>
    </div>
           
        )
    })}</div>}</>: null}
    {currentMode == "darshans" ? <>{!isFavourites ? <div
    className='images' style={{
        "height": "100%",
        "overflowY": "scroll",
        "scrollSnapType": "y mandatory"
    }}> {images.map((image, i) => {
        return (
            <div className='image' style={{position:"relative", width: "100%", height: "100%", scrollSnapAlign: "start", "display":"flex", "flexDirection": "column", "justifyContent":"center"}}>
            <Image image={image} />
            <IonFab style={{position:"absolute", bottom:"10%", right:"2%"}}>
            <IonFabButton onClick={()=>{
                if(mediaFavoritesMap[image.url]) {
                    setMediaFavoritesMap(prev=>{
                        let dum = {...prev}
                        delete dum[image.url]
                        return dum
                    })
                } else {
                    setMediaFavoritesMap(prev=>{
                        let dum = {...prev}
                        dum[image.url] = "quote"
                        return dum
                    })
                }
            }} style={{"opacity":"0.6"}}>
        <IonIcon icon={mediaFavoritesMap[image.url] ? heart : heartOutline} />
    </IonFabButton>
    </IonFab>
            </div>
        )
    })} </div> : <div
     style={{
        "height": "100%",
        "overflowY": "scroll",
        "scrollSnapType": "y mandatory"
    }}> {imagesFavs.map((image, i) => {
        return (
            <div className='image' style={{position:"relative", width: "100%", height: "100%", scrollSnapAlign: "start", "display":"flex", "flexDirection": "column", "justifyContent":"center"}}>
            <Image image={image} />
            <IonFab style={{position:"absolute", bottom:"10%", right:"2%"}}>
            <IonFabButton onClick={()=>{
                if(mediaFavoritesMap[image.url]) {
                    setMediaFavoritesMap(prev=>{
                        let dum = {...prev}
                        delete dum[image.url]
                        return dum
                    })
                } else {
                    setMediaFavoritesMap(prev=>{
                        let dum = {...prev}
                        dum[image.url] = "quote"
                        return dum
                    })
                }
            }} style={{"opacity":"0.6"}}>
        <IonIcon icon={mediaFavoritesMap[image.url] ? heart : heartOutline} />
    </IonFabButton>
    </IonFab>
            </div>
        )
    })} </div>  }</>: null}
    
    </div>
    </div>
    </div>
   
    </IonContent>
    </IonPage>
    )
}

export default VaniMedia;