import React, { useContext, useEffect, useState } from 'react'
import {
 IonItem,
 IonButton,
 IonLabel,
 IonToolbar,
 IonButtons,
 IonCheckbox,
 IonPage,
 IonHeader,
 IonContent,
 IonRouterOutlet,
 IonIcon,
 IonSegment,
 IonSegmentButton,
 IonToast,
} from '@ionic/react'
import { Route, useRouteMatch, useHistory } from 'react-router-dom'
import { Bookmarks, Settings } from '../context'
import {
 bookmarkOutline,
 removeCircleOutline,
 documentTextOutline,
 brushOutline,
 timeOutline,
} from 'ionicons/icons'
import BookmarkList from './BookmarkListPage'

function BookmarkFolders() {
 let { path, url } = useRouteMatch()
 const [bookmarksMap, setBookmarksMap] = useContext(Bookmarks)
 const [select, setSelect] = useState(false)
 let history = useHistory()
 const [settings, setSettings] = useContext(Settings)
 const [toast, setToast] = useState('false')
 const [toastMessageMap, setToastMessageMap] = useState({
  atleast_one_folder: 'You need to have atleast one folder',
 })
 let bookmarks_present = false
 for (let key of Object.keys(bookmarksMap)) {
  if (
   key.endsWith(settings.bookmark_type) &&
   bookmarksMap[key].children.length > 0
  ) {
   bookmarks_present = true
   break
  }
 }

 useEffect(() => {
  if (settings.bookmark_type == 'Read-Later') history.push(`${url}/Read-Later`)
 }, [])

 return (
  <>
   <IonRouterOutlet>
    <Route exact path={path}>
     <IonPage>
      <IonHeader>
       <IonToolbar>
        <IonSegment
         onIonChange={(e) => {
          setSettings((prev) => {
           let dum = { ...prev }
           dum.bookmark_type = e.target.value
           return dum
          })
          if (e.target.value == 'Read-Later') history.push(`${url}/Read-Later`)
         }}
         value={settings.bookmark_type}
        >
         <IonSegmentButton value="Read-Later">
          <IonIcon icon={timeOutline}></IonIcon>
         </IonSegmentButton>
         <IonSegmentButton value="bookmarks">
          <IonIcon icon={bookmarkOutline}></IonIcon>
         </IonSegmentButton>
         <IonSegmentButton value="highlights">
          <IonIcon icon={brushOutline}></IonIcon>
         </IonSegmentButton>
         <IonSegmentButton value="notes">
          <IonIcon icon={documentTextOutline}></IonIcon>
         </IonSegmentButton>
        </IonSegment>
       </IonToolbar>
       <IonToolbar>
        <IonButtons slot="start">
         <IonLabel style={{ marginLeft: '10px' }}>
          {settings.bookmark_type.charAt(0).toUpperCase() +
           settings.bookmark_type.slice(1)}
         </IonLabel>
        </IonButtons>

        {select ? (
         <IonButtons
          style={{ marginRight: '15px' }}
          onClick={() => {
           Object.values(bookmarksMap).map((value) => {
            value.isChecked = false
           })

           setSelect(false)
          }}
          slot="end"
         >
          <IonLabel>Cancel</IonLabel>
         </IonButtons>
        ) : null}

        {select ? (
         <IonButtons
          style={{ marginRight: '8px' }}
          slot="end"
          onClick={() => {
           setSelect(false)
           let count = 0
           for (let key of Object.keys(bookmarksMap)) {
            if (
             key.endsWith(settings.bookmark_type) &&
             !bookmarksMap[key].isChecked
            )
             count++
           }
           if (count < 1) {
            setToast('atleast_one_folder')
            Object.values(bookmarksMap).map((value) => {
             value.isChecked = false
            })
           } else
            setBookmarksMap((prev) => {
             let dum = { ...prev }
             for (let key of Object.keys(dum)) {
              if (key.endsWith(settings.bookmark_type) && dum[key].isChecked)
               delete dum[key]
             }
             return dum
            })
          }}
         >
          <IonLabel>Remove</IonLabel>
         </IonButtons>
        ) : null}

        {!select ? (
         <IonButtons
          onClick={() => {
           setSelect(true)
          }}
          style={{ marginRight: '8px' }}
          slot="end"
         >
          <IonButton>
           <IonIcon icon={removeCircleOutline}></IonIcon>
          </IonButton>
         </IonButtons>
        ) : (
         <p></p>
        )}
       </IonToolbar>
      </IonHeader>
      <IonContent>
       {Object.entries(bookmarksMap).map(([folder, value]) => {
        return (
         <>
          {folder.endsWith(settings.bookmark_type) ? (
           <IonItem
            onClick={() => {
             if (!select) history.push(`${url}/${folder}`)
            }}
           >
            <IonLabel>{folder.slice(0, folder.lastIndexOf('-'))} </IonLabel>

            {select ? (
             <IonCheckbox
              checked={value.isChecked}
              onIonChange={(e) => {
               value.isChecked = e.detail.checked
              }}
             />
            ) : (
             <p></p>
            )}
           </IonItem>
          ) : null}
         </>
        )
       })}
       {!bookmarks_present ? (
        <p
         style={{
          textAlign: 'center',
          margin: '10px',
         }}
        >
         {settings.bookmark_type == 'bookmarks' ? (
          <>
           You can bookmark lectures/purports by clicking{' '}
           <IonIcon icon={bookmarkOutline}></IonIcon> Icon on the heading
           toolbar in their page
          </>
         ) : null}
         {settings.bookmark_type == 'highlights' ? (
          <>
           You can highlight text of lectures/purports by selecting the text and
           clicking <IonIcon icon={brushOutline}></IonIcon> Icon on the bottom
           left in their page
          </>
         ) : null}
         {settings.bookmark_type == 'notes' ? (
          <>
           You can write notes for text of lectures/purports by clicking{' '}
           <IonIcon icon={documentTextOutline}></IonIcon> Icon on the bottom
           right in their page
          </>
         ) : null}
        </p>
       ) : null}
      </IonContent>
      <IonToast
       onDidDismiss={() => {
        setToast('false')
       }}
       isOpen={toast != 'false'}
       message={toastMessageMap[toast]}
       duration={2000}
      ></IonToast>
     </IonPage>
    </Route>
    <Route path={`${path}/:key`}>
     <BookmarkList />
    </Route>
   </IonRouterOutlet>
  </>
 )
}

export default BookmarkFolders
