import ReactPlayer from 'react-player'
import { useState, useContext } from 'react'
import { IonSpinner, IonFab, IonFabButton, IonIcon } from '@ionic/react'
import { MediaFavorites } from '../context'
import { heartOutline, heart } from 'ionicons/icons'

function VideoPlayer(props) {
 const video = props.video
 const i = props.i
 const setVideos = props.setVideos
 const [loaded, setLoaded] = useState(false)
 const [mediaFavoritesMap, setMediaFavoritesMap] = useContext(MediaFavorites)

 return (
  <div
   className={props.className}
   style={{
    width: '100%',
    height: '100%',
    position: 'relative',
    scrollSnapAlign: 'start',
   }}
  >
   {!loaded ? (
    <div
     style={{
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      zIndex: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
     }}
    >
     <IonSpinner style={{ zIndex: 11 }} />
    </div>
   ) : null}
   <ReactPlayer
    url={video.url}
    playing={video.isPlaying}
    onPlay={() => {
     setVideos((prev) => {
      let dum = [...prev]
      dum[i].isPlaying = true
      return dum
     })
    }}
    onReady={() => {
     setLoaded(true)
    }}
    controls
    loop
    width="100%"
    height="100%"
    style={{
     zIndex: 5,
    }}
   />
   <IonFab
    style={{
     position: 'absolute',
     bottom: '10%',
     right: '2%',
     zIndex: 100,
    }}
   >
    <IonFabButton
     onClick={() => {
      if (mediaFavoritesMap[video.url]) {
       setMediaFavoritesMap((prev) => {
        let dum = {
         ...prev,
        }
        delete dum[video.url]
        return dum
       })
      } else {
       setMediaFavoritesMap((prev) => {
        let dum = {
         ...prev,
        }
        dum[video.url] = 'audio'
        return dum
       })
      }
     }}
     style={{
      opacity: '0.6',
      zIndex: 100,
     }}
    >
     <IonIcon icon={mediaFavoritesMap[video.url] ? heart : heartOutline} />
    </IonFabButton>
   </IonFab>
  </div>
 )
}

export default VideoPlayer
