import { useState, useEffect, useContext } from 'react'
import AudioPlayer from '../components/AudioPlayer'
import {
 IonPage,
 IonHeader,
 IonToolbar,
 IonSegment,
 IonSegmentButton,
 IonLabel,
 IonContent,
 IonButton,
 IonIcon,
 isPlatform,
 IonButtons,
 IonMenuButton,
 IonFab,
 IonFabButton,
} from '@ionic/react'

import VideoPlayer from '../components/VideoPlayer'
import { useLocal } from '../lshooks'
import { MediaFavorites } from '../context'
import { heartOutline, heart } from 'ionicons/icons'
import Image from '../components/Image'

function VaniMedia(props) {
 const [videos, setVideos] = useState([])
 const [videosFavs, setVideosFavs] = useState([])
 const [imageQuotes, setImageQuotes] = useState([])
 const [imageQuotesFavs, setImageQuotesFavs] = useState([])
 const [images, setImages] = useState([])
 const [imagesFavs, setImagesFavs] = useState([])
 const [audios, setAudios] = useState([])
 const [audiosFavs, setAudiosFavs] = useState([])

 const [currentMode, setCurrentMode] = useLocal('media-mode', 'shorts')
 const [isFavourites, setIsFavourites] = useState(false)
 const [mediaFavoritesMap, setMediaFavoritesMap] = useContext(MediaFavorites)
 const [currentIndex, setCurrentIndex] = useState(0)

 function filterFavourites(list) {
  const map = {}
  const favouriteList = []
  for (let i = 0; i < list.length; i++) {
   map[list[i].url] = list[i]
  }
  for (let key of Object.keys(mediaFavoritesMap)) {
   if (map[key]) {
    favouriteList.push(map[key])
   }
  }
  return favouriteList
 }

 useEffect(() => {
  if (isFavourites) {
   setVideosFavs(filterFavourites(props.videos))
   setImageQuotesFavs(filterFavourites(props.imageQuotes))
   setAudiosFavs(filterFavourites(props.audios))
   setImagesFavs(filterFavourites(props.images))
  }
 }, [isFavourites])

 useEffect(() => {
  if(videos.length==0) generateItems(videos, setVideos, props.videos)
  if(audios.length==0) generateItems(audios, setAudios, props.audios)
  if(images.length==0) generateItems(images, setImages, props.images)
  if(imageQuotes.length==0) generateItems(imageQuotes, setImageQuotes, props.imageQuotes)
 }, [props])

 const stopPlayingOnScroll = (container, setItems) => {
  const scrollTop = container.scrollTop
  const elementHeight = container.clientHeight
  const index = Math.round(scrollTop / elementHeight)
  setCurrentIndex(index)
  setItems((prev) => {
   let dum = [...prev]
   for (let i = 0; i < prev.length; i++) {
    if (i != index) dum[i].isPlaying = false
   }
   return dum
  })
 }

 const generateItems = (items, setItems, list) => {
  if (isFavourites) return
  const newItems = []
  for (let i = 0; i < 5; i++) {
   if (items.length + i == list.length) break
   newItems.push(list[items.length + i])
  }
  setItems([...items, ...newItems])
 }

 function scrollGenerate(container, childClasss, item, setItems, list) {
  if (childClasss == 'video' || childClasss == 'audio')
   stopPlayingOnScroll(container, setItems)
  var items = document.querySelectorAll('.' + childClasss)
  var lastItem = items[items.length - 1]
  var scrollTop = container.scrollTop || container.scrollTop
  var clientHeight =
   document.documentElement.clientHeight || document.body.clientHeight
  if (
   lastItem &&
   scrollTop + clientHeight >= lastItem.offsetTop + lastItem.clientHeight
  ) {
   generateItems(item, setItems, list)
  }
 }

 const scrollListener = (parentClass, childClasss, item, setItems, list) => {
  const container = document.querySelector('.' + parentClass)
  const listenerFunction = scrollGenerate.bind(
   null,
   container,
   childClasss,
   item,
   setItems,
   list
  )
  if (container) {
   container.removeEventListener('scroll', listenerFunction)
   container.addEventListener('scroll', listenerFunction)
  }
 }

 useEffect(() => {
  scrollListener('images', 'image', images, setImages, props.images)
 }, [images, currentMode, isFavourites])
 useEffect(() => {
  scrollListener('videos', 'video', videos, setVideos, props.videos)
 }, [videos, currentMode, isFavourites])
 useEffect(() => {
  scrollListener('videosfavs', 'video', videosFavs, setVideosFavs, props.videos)
 }, [videosFavs, currentMode, isFavourites])
 useEffect(() => {
  scrollListener('audios', 'audio', audios, setAudios, props.audios)
 }, [audios, currentMode, isFavourites])
 useEffect(() => {
  scrollListener('audiosfavs', 'audio', audiosFavs, setAudiosFavs, props.audios)
 }, [audios, currentMode, isFavourites])
 useEffect(() => {
  scrollListener(
   'imagequotes',
   'imagequote',
   imageQuotes,
   setImageQuotes,
   props.imageQuotes
  )
 }, [imageQuotes, currentMode, isFavourites])

 useEffect(()=>{
  setCurrentIndex(0)
 },[currentMode, isFavourites])


 let noFavsPageHtml = (
  <div
   style={{
    height: '100%',
    width: '100%',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
   }}
  >
   <div>
    No favorites found! Please favorite a media by clicking on{' '}
    <IonIcon icon={heartOutline} /> icon at the bottom left of the screen
   </div>
  </div>
 )

 return (
  <IonPage id="main-content">
   <IonHeader>
    <IonToolbar>
     <IonButtons slot="start">
      <IonMenuButton></IonMenuButton>
     </IonButtons>
     <IonSegment
      onIonChange={(e) => {
       setCurrentMode(e.detail.value)
      }}
      value={currentMode}
     >
      <IonSegmentButton value="shorts">
       <IonLabel style={{ fontSize: '1.4vh' }}>Shorts</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="quotes">
       <IonLabel style={{ fontSize: '1.4vh' }}>Quotes</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="audios">
       <IonLabel style={{ fontSize: '1.4vh' }}>Audio</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="darshans">
       <IonLabel style={{ fontSize: '1.4vh' }}>Darshan</IonLabel>
      </IonSegmentButton>
     </IonSegment>
     <IonButtons slot="end">
      <IonButton
       onClick={() => {
        setIsFavourites(!isFavourites)
       }}
      >
       <IonIcon icon={isFavourites ? heart : heartOutline}></IonIcon>
      </IonButton>
     </IonButtons>
    </IonToolbar>
   </IonHeader>
   <IonContent style={{ height: '100%' }}>
    <div
     style={
      isPlatform('desktop')
       ? {
          display: 'flex',
          justifyContent: 'center',
          height: '100%',
         }
       : { height: '100%' }
     }
    >
     <div
      style={
       isPlatform('desktop')
        ? { width: '400px', height: '100%' }
        : { height: '100%' }
      }
     >
      <div style={{ height: '100%' }}>
       {currentMode == 'shorts' && !isFavourites ? (
        <div
         className="videos"
         style={{
          height: '100%',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
         }}
        >
         {videos.map((video, i) => {
          return (
           <VideoPlayer
            className="video"
            video={video}
            i={i}
            setVideos={setVideos}
           />
          )
         })}
        </div>
       ) : null}
       {currentMode == 'shorts' && isFavourites ? (
        <div
        className="videosfavs"
         style={{
          height: '100%',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
         }}
        >
         <>
          {videosFavs.length > 0 ? (
           <>
            {videosFavs.map((video, i) => {
             return <VideoPlayer className="video" video={video} i={i} setVideos={setVideosFavs} />
            })}
           </>
          ) : (
           noFavsPageHtml
          )}
         </>
        </div>
       ) : null}
       {currentMode == 'quotes' && !isFavourites ? (
        <div
         className="imagequotes"
         style={{
          height: '100%',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
         }}
        >
         {imageQuotes.map((image, i) => {
          return <Image className="imagequote" image={image} />
         })}
        </div>
       ) : null}
       {currentMode == 'quotes' && isFavourites ? (
        <div
         style={{
          height: '100%',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
         }}
        >
         <>
          {imageQuotesFavs.length > 0 ? (
           <>
            {imageQuotesFavs.map((image, i) => {
             return <Image image={image} />
            })}
           </>
          ) : (
           noFavsPageHtml
          )}
         </>
        </div>
       ) : null}
       {currentMode == 'audios' && !isFavourites ? (
        <div
         className="audios"
         style={{
          height: '100%',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
         }}
        >
         {audios.map((audio, i) => {
          return (
           <AudioPlayer
            className="audio"
            audio={audio}
            i={i}
            audios={audios}
            setAudios={setAudios}
           />
          )
         })}
        </div>
       ) : null}
       {currentMode == 'audios' && isFavourites ? (
        <div
        className="audiosfavs"
         style={{
          height: '100%',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
         }}
        >
         <>
          {audiosFavs.length > 0 ? (
           <>
            {audiosFavs.map((audio, i) => {
             return (
              <AudioPlayer
              className="audio"
               audio={audio}
               i={i}
               audios={audiosFavs}
               setAudios={setAudiosFavs}
              />
             )
            })}
           </>
          ) : (
           noFavsPageHtml
          )}
         </>
        </div>
       ) : null}
       {currentMode == 'darshans' && !isFavourites ? (
        <div
         className="images"
         style={{
          height: '100%',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
         }}
        >
         {images.map((image, i) => {
          return <Image className="image" image={image} />
         })}
        </div>
       ) : null}
       {currentMode == 'darshans' && isFavourites ? (
        <div
         style={{
          height: '100%',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
         }}
        >
         <>
          {imageQuotesFavs.length > 0 ? (
           <>
            {imagesFavs.map((image, i) => {
             return <Image image={image} />
            })}
           </>
          ) : (
           noFavsPageHtml
          )}
         </>
        </div>
       ) : null}

       {isPlatform("ios") && currentMode=="shorts" && !isFavourites && currentIndex <5 ?  <IonFab
    style={{
     position: 'absolute',
     bottom: '10%',
     right: '2%',
     zIndex: 100,
    }}
   >
    <IonFabButton
     onClick={() => {
      if (mediaFavoritesMap[videos[currentIndex].url]) {
       setMediaFavoritesMap((prev) => {
        let dum = {
         ...prev,
        }
        delete dum[videos[currentIndex].url]
        return dum
       })
      } else {
       setMediaFavoritesMap((prev) => {
        let dum = {
         ...prev,
        }
        dum[videos[currentIndex].url] = 'audio'
        return dum
       })
      }
     }}
     style={{
      opacity: '0.6',
      zIndex: 100,
     }}
    >
     <IonIcon icon={videos[currentIndex] && mediaFavoritesMap[videos[currentIndex].url] ? heart : heartOutline} />
    </IonFabButton>
   </IonFab> : null}

   { isPlatform("ios") && currentMode=="shorts" && isFavourites && currentIndex <5  ?  <IonFab
    style={{
     position: 'absolute',
     bottom: '10%',
     right: '2%',
     zIndex: 100,
    }}
   >
    <IonFabButton
     onClick={() => {
      if (mediaFavoritesMap[videosFavs[currentIndex].url]) {
       setMediaFavoritesMap((prev) => {
        let dum = {
         ...prev,
        }
        delete dum[videosFavs[currentIndex].url]
        return dum
       })
      } else {
       setMediaFavoritesMap((prev) => {
        let dum = {
         ...prev,
        }
        dum[videosFavs[currentIndex].url] = 'audio'
        return dum
       })
      }
     }}
     style={{
      opacity: '0.6',
      zIndex: 100,
     }}
    >
     <IonIcon icon={videosFavs[currentIndex] && mediaFavoritesMap[videosFavs[currentIndex].url] ? heart : heartOutline} />
    </IonFabButton>
   </IonFab> : null}
   
      </div>
     </div>
    </div>
   </IonContent>
  </IonPage>
 )
}

export default VaniMedia
