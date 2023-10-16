import { useContext, useEffect, useState } from 'react'
import { Lectures } from '../context'
import {
 useHistory,
 useLocation,
 useRouteMatch,
 useParams,
} from 'react-router-dom'
import {
 IonHeader,
 IonPage,
 IonToolbar,
 IonLabel,
 IonContent,
 IonItem,
 IonNote,
 IonButton,
 IonButtons,
 IonIcon,
 IonCheckbox,
} from '@ionic/react'
import minutesToMinutes, { formatMinutes } from '../scripts/durationToMinutes'
import {
 removeCircleOutline,
 checkmarkCircleOutline,
 checkmarkOutline,
 chevronBackOutline,
} from 'ionicons/icons'

function Lecture() {
 const [lecturesMap, setLecturesMap] = useContext(Lectures)
 const [dumLecturesMap, setDumLecturesMap] = useState(null)
 let { key } = useParams()
 let history = useHistory()
 let { path, url } = useRouteMatch()
 let location = useLocation()
 const [currentBook, setCurrentBook] = useState({})
 let keysList = key.split(':')
 const [markRead, setMarkRead] = useState(false)
 const [markUnread, setMarkUnread] = useState(false)

 function formDumLectures() {
  let dumBook = {}
  if (keysList[0] == 'place') {
   let dumLectures = JSON.parse(JSON.stringify(lecturesMap))
   for (let typeKey of Object.keys(dumLectures)) {
    for (let lecture of Object.keys(dumLectures[typeKey]['parts'])) {
     let place = lecture.split('-_')[lecture.split('-_').length - 1]
     if (!dumBook[place]) dumBook[place] = { parts: {} }
     dumBook[place]['parts'][lecture] = dumLectures[typeKey]['parts'][lecture]
    }
   }
  }

  if (keysList[0] == 'year') {
   let dumLectures = JSON.parse(JSON.stringify(lecturesMap))
   for (let typeKey of Object.keys(dumLectures)) {
    for (let lecture of Object.keys(dumLectures[typeKey]['parts'])) {
     let date = lecture.split('_')[0]
     let year = '19' + date.substring(0, 2)
     let month = date.substring(2, 4)
     if (!dumBook[year]) dumBook[year] = { parts: {} }
     if (!dumBook[year]['parts'][month])
      dumBook[year]['parts'][month] = { parts: {} }
     dumBook[year]['parts'][month]['parts'][lecture] =
      dumLectures[typeKey]['parts'][lecture]
    }
   }
  }

  if (keysList[0] == 'type') {
   dumBook = { ...lecturesMap }
  }

  let time1 = 0
  let time2 = 0
  let time3 = 0
  let rtime1 = 0
  let rtime2 = 0
  let rtime3 = 0

  let dum = { ...dumBook }
  for (let key1 of Object.keys(dum)) {
   time2 = 0
   rtime2 = 0
   if (Object.keys(dum[key1]['parts'])[0].includes('-_')) {
    for (let key2 of Object.keys(dum[key1]['parts'])) {
     time2 += minutesToMinutes(dum[key1]['parts'][key2]['duration'])
     if (dum[key1]['parts'][key2]['read'])
      rtime2 += minutesToMinutes(dum[key1]['parts'][key2]['duration'])
    }
   } else {
    for (let key2 of Object.keys(dum[key1]['parts'])) {
     time3 = 0
     rtime3 = 0
     for (let key3 of Object.keys(dum[key1]['parts'][key2]['parts'])) {
      time3 += minutesToMinutes(
       dum[key1]['parts'][key2]['parts'][key3]['duration']
      )
      if (dum[key1]['parts'][key2]['parts'][key3]['read'])
       rtime3 += minutesToMinutes(
        dum[key1]['parts'][key2]['parts'][key3]['duration']
       )
     }
     dum[key1]['parts'][key2]['heard_time'] = rtime3
     dum[key1]['parts'][key2]['time'] = time3
     time2 += time3
     rtime2 += rtime3
    }
   }
   dum[key1]['heard_time'] = rtime2
   dum[key1]['time'] = time2
   time1 += time2
   rtime1 += rtime2
  }
  setDumLecturesMap(dum)
 }

 useEffect(() => {
  formDumLectures()
 }, [])

 useEffect(() => {
  if (dumLecturesMap) {
   let dumBook = JSON.parse(JSON.stringify(dumLecturesMap))
   for (let i = 1; i < keysList.length; i++) {
    dumBook = dumBook[keysList[i]]['parts']
   }

   const sortedKeys = Object.keys(dumBook).sort()
   const sortedObject = {}
   for (const key of sortedKeys) {
    sortedObject['_' + key] = dumBook[key]
   }
   dumBook = { ...sortedObject }

   setCurrentBook(dumBook)
  }
 }, [dumLecturesMap, location])

 return (
  <IonPage>
   <IonHeader>
    <IonToolbar>
     <IonButtons slot="start">
      <IonButton
       onClick={() => {
        if (history.length > 1) {
         history.goBack()
        } else {
         history.push('/vanibase')
        }
       }}
      >
       <IonIcon icon={chevronBackOutline}></IonIcon>
      </IonButton>
     </IonButtons>
     <IonButtons slot="start">
      <IonLabel style={{ marginLeft: '10px' }}>
       {key.replace(/:/g, ' - ')}
      </IonLabel>
     </IonButtons>
     {!markRead && !markUnread ? (
      <IonButtons
       onClick={() => {
        setMarkUnread(true)
       }}
       slot="end"
      >
       <IonButton style={{ marginRight: '3px' }}>
        <IonIcon icon={removeCircleOutline}></IonIcon>
       </IonButton>
      </IonButtons>
     ) : (
      <p></p>
     )}
     {!markRead && !markUnread ? (
      <IonButtons
       onClick={() => {
        setMarkRead(true)
       }}
       slot="end"
      >
       <IonButton style={{ marginRight: '8px' }}>
        <IonIcon icon={checkmarkCircleOutline}></IonIcon>
       </IonButton>
      </IonButtons>
     ) : (
      <p></p>
     )}

     {markRead || markUnread ? (
      <IonButtons
       style={{ marginRight: '15px' }}
       onClick={() => {
        setMarkRead(false)
        setMarkUnread(false)
        Object.entries(currentBook).map(([partKey, partValue]) => {
         partValue.isChecked = false
        })
       }}
       slot="end"
      >
       <IonLabel>Cancel</IonLabel>
      </IonButtons>
     ) : (
      <p></p>
     )}

     {markRead || markUnread ? (
      <IonButtons
       style={{ marginRight: '8px' }}
       onClick={() => {
        setMarkRead(false)
        setMarkUnread(false)

        setLecturesMap((prev) => {
         let dum = { ...prev }

         for (let part of Object.keys(currentBook)) {
          if (currentBook[part].isChecked) {
           if (currentBook[part]['parts']) {
            for (let part1 of Object.keys(currentBook[part]['parts'])) {
             if (currentBook[part]['parts'][part1]['parts']) {
              for (let part2 of Object.keys(
               currentBook[part]['parts'][part1]['parts']
              )) {
               for (let category of Object.entries(dum)) {
                for (let lecture of Object.entries(category[1]['parts'])) {
                 if (lecture[0] == part2) {
                  dum[category[0]]['parts'][part2].read = markRead
                   ? true
                   : false
                 }
                }
               }
              }
             } else {
              for (let category of Object.entries(dum)) {
               for (let lecture of Object.entries(category[1]['parts'])) {
                if (lecture[0] == part1) {
                 dum[category[0]]['parts'][part1].read = markRead ? true : false
                }
               }
              }
             }
            }
           } else {
            for (let category of Object.entries(dum)) {
             for (let lecture of Object.entries(category[1]['parts'])) {
              if (lecture[0] == part.slice(1)) {
               dum[category[0]]['parts'][part.slice(1)].read = markRead
                ? true
                : false
              }
             }
            }
           }
          }
         }
         return dum
        })

        formDumLectures()
       }}
       slot="end"
      >
       <IonLabel>{markRead ? 'Mark-Heard' : 'Mark-Unheard'} </IonLabel>
      </IonButtons>
     ) : (
      <p></p>
     )}
    </IonToolbar>
   </IonHeader>
   <IonContent>
    {currentBook
     ? Object.entries(currentBook).map(([partKey, partValue]) => {
        partKey = partKey.slice(1)
        return (
         <IonItem
          onClick={() => {
           if (!markRead && !markUnread) {
            if (partKey.includes('-_')) history.push('/lecture/' + partKey)
            else history.push(`${url}:${partKey}`)
           }
          }}
         >
          <IonLabel>{partKey.replace(/_/g, ' ')}</IonLabel>

          {partValue.read ? (
           <IonIcon
            color="primary"
            style={{ marginRight: '5px' }}
            icon={checkmarkOutline}
           ></IonIcon>
          ) : (
           ''
          )}
          {!partKey.includes('-_') ? (
           <IonNote>
            {formatMinutes(partValue.heard_time)} |{' '}
            {formatMinutes(partValue.time)} (
            {Math.floor((partValue.heard_time / partValue.time) * 100)}
            %)
           </IonNote>
          ) : (
           <>
            {' '}
            <IonNote>
             {formatMinutes(minutesToMinutes(partValue.duration))}
            </IonNote>
           </>
          )}
          {markRead || markUnread ? (
           <IonCheckbox
            style={{ marginLeft: '15px' }}
            checked={partValue.isChecked}
            onIonChange={(e) => {
             partValue.isChecked = e.detail.checked
            }}
           />
          ) : (
           <p></p>
          )}
         </IonItem>
        )
       })
     : null}
   </IonContent>
  </IonPage>
 )
}

export default Lecture
