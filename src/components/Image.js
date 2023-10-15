import { IonFab, IonFabButton, IonSpinner, IonIcon } from '@ionic/react'
import { useState, useContext } from 'react'
import { MediaFavorites } from '../context'
import { heartOutline, heart } from 'ionicons/icons'

function Image(props) {
 const [loaded, setLoaded] = useState(false)
 const [mediaFavoritesMap, setMediaFavoritesMap] = useContext(MediaFavorites)

 return (
  <div
   className={props.className}
   style={{
    height: '100%',
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    scrollSnapAlign: 'start',
    position: 'relative',
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
   <img
    onLoad={() => {
     setLoaded(true)
    }}
    width="100%"
    src={props.image.url}
   ></img>
   <IonFab
    style={{
     position: 'absolute',
     bottom: '10%',
     right: '2%',
    }}
   >
    <IonFabButton
     onClick={() => {
      if (mediaFavoritesMap[props.image.url]) {
       setMediaFavoritesMap((prev) => {
        let dum = {
         ...prev,
        }
        delete dum[props.image.url]
        return dum
       })
      } else {
       setMediaFavoritesMap((prev) => {
        let dum = {
         ...prev,
        }
        dum[props.image.url] = 'quote'
        return dum
       })
      }
     }}
     style={{
      opacity: '0.6',
     }}
    >
     <IonIcon
      icon={mediaFavoritesMap[props.image.url] ? heart : heartOutline}
     />
    </IonFabButton>
   </IonFab>
  </div>
 )
}

export default Image
