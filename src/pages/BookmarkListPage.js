import React, { useContext, useState } from 'react'
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
 IonIcon,
 IonReorderGroup,
 IonReorder,
 IonSegment,
 IonSegmentButton,
 IonCard,
 IonCardContent,
 IonFab,
 IonFabButton,
 IonFabList,
} from '@ionic/react'
import { useHistory, useParams } from 'react-router-dom'
import { Bookmarks, Settings } from '../context'
import {
 bookmarkOutline,
 removeCircleOutline,
 reorderThreeOutline,
 timeOutline,
 brushOutline,
 documentTextOutline,
 colorPaletteOutline,
 chevronBackOutline,
} from 'ionicons/icons'

function BookmarkList() {
 let { key } = useParams()
 const [bookmarksMap, setBookmarksMap] = useContext(Bookmarks)
 const [changedIndexes, setChangedIndexes] = useState([])
 const [select, setSelect] = useState(false)
 const [reo, setReo] = useState(false)
 let history = useHistory()
 const [settings, setSettings] = useContext(Settings)
 const [highlightColor, setHighlightColor] = useState('all')
 console.log(bookmarksMap[key].children.length)

 return (
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
       if (e.target.value != 'Read-Later') history.push('/bookmarks')
       else history.push('/bookmarks/Read-Later')
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
     {settings.bookmark_type != 'Read-Later' ? (
      <IonButtons slot="start">
       <IonButton
        onClick={() => {
         if (history.length > 1) {
          history.goBack()
         } else {
          history.push('/bookmarks')
         }
        }}
       >
        <IonIcon icon={chevronBackOutline}></IonIcon>
       </IonButton>
      </IonButtons>
     ) : null}
     <IonButtons slot="start">
      <IonLabel style={{ marginLeft: '10px' }}>
       {settings.bookmark_type == 'Read-Later'
        ? key
        : key.slice(0, key.lastIndexOf('-'))}
      </IonLabel>
     </IonButtons>

     {!select && !reo ? (
      <IonButtons
       slot="end"
       onClick={() => {
        setReo(true)
       }}
      >
       <IonButton>
        <IonIcon icon={reorderThreeOutline}></IonIcon>
       </IonButton>
      </IonButtons>
     ) : null}

     {reo ? (
      <IonButtons
       style={{ marginRight: '15px' }}
       onClick={() => {
        setReo(false)
        // setBookmarksMap({})
        setChangedIndexes([])
        setTimeout(() => {
         setBookmarksMap({ ...bookmarksMap })
        }, 1)
       }}
       slot="end"
      >
       <IonLabel>Cancel</IonLabel>
      </IonButtons>
     ) : null}

     {reo ? (
      <IonButtons
       style={{ marginRight: '8px' }}
       onClick={() => {
        console.log(bookmarksMap)
        setReo(false)
        setChangedIndexes([])
        let dum = JSON.parse(JSON.stringify(bookmarksMap))
        console.log(bookmarksMap, dum[key])
        for (let index of changedIndexes) {
         let curr = dum[key]['children'][index.from]
         dum[key]['children'].splice(index.from, 1)
         dum[key]['children'].splice(index.to, 0, curr)
        }
        setTimeout(() => {
         setBookmarksMap({ ...dum })
        }, 1)
       }}
       slot="end"
      >
       <IonLabel>Reorder</IonLabel>
      </IonButtons>
     ) : null}

     {select ? (
      <IonButtons
       style={{ marginRight: '15px' }}
       onClick={() => {
        bookmarksMap[key]['children'].map((value) => {
         value.isChecked = false
        })

        setSelect(false)
       }}
       slot="end"
      >
       <IonLabel>Cancel</IonLabel>
      </IonButtons>
     ) : (
      <p></p>
     )}

     {select ? (
      <IonButtons
       style={{ marginRight: '8px' }}
       slot="end"
       onClick={() => {
        setSelect(false)
        setBookmarksMap((prev) => {
         let dum = { ...prev }
         for (let i = 0; i < dum[key]['children'].length; i++) {
          if (dum[key]['children'][i].isChecked) {
           dum[key]['children'].splice(i, 1)
           i--
          }
         }
         return dum
        })
       }}
      >
       <IonLabel>Remove</IonLabel>
      </IonButtons>
     ) : (
      <p></p>
     )}

     {!select && !reo ? (
      <IonButtons
       onClick={() => {
        setSelect(true)
       }}
       slot="end"
      >
       <IonButton style={{ marginRight: '8px' }}>
        <IonIcon icon={removeCircleOutline}></IonIcon>
       </IonButton>
      </IonButtons>
     ) : (
      <p></p>
     )}
    </IonToolbar>
   </IonHeader>
   <IonContent>
    <IonReorderGroup
     disabled={!reo}
     onIonItemReorder={(e) => {
      console.log(e.detail.from, e.detail.to)

      e.detail.complete()

      setChangedIndexes((prev) => {
       let dum = [...prev]
       dum.push({ from: e.detail.from, to: e.detail.to })
       return dum
      })
      console.log(bookmarksMap)
     }}
    >
     {bookmarksMap[key]
      ? bookmarksMap[key]['children'].map((child, i) => {
         let childName =
          child['type'] == 'verse'
           ? child['name'].split(',')[0].replace(/_/g, ' ') +
             (child['name'].split(',').length > 1
              ? ' to ' +
                child['name']
                 .split(',')
                 [child['name'].split(',').length - 1].replace(/_/g, ' ')
              : '')
           : child['name'].replace(/_/g, ' ')
         if (
          !child['color'] ||
          highlightColor == 'all' ||
          child['color'] == highlightColor
         )
          return (
           <>
            {reo ? (
             <IonReorder>
              <IonItem>
               {settings.bookmark_type == 'highlights' ||
               settings.bookmark_type == 'notes' ? (
                <IonCard
                 style={{
                  width: '90%',
                 }}
                >
                 <IonCardContent
                  style={{
                   textAlign: 'justify',
                  }}
                 >
                  {settings.bookmark_type == 'highlights'
                   ? child.text
                   : child.notes}
                  <IonLabel
                   style={{
                    textAlign: 'right',
                    marginTop: '10px',
                   }}
                  >
                   {childName}
                  </IonLabel>
                 </IonCardContent>
                </IonCard>
               ) : (
                <IonLabel>{childName}</IonLabel>
               )}
               <IonIcon icon={reorderThreeOutline} />
              </IonItem>
             </IonReorder>
            ) : (
             <IonItem
              onClick={() => {
               if (!select) {
                let focusElement =
                 settings.bookmark_type == 'highlights' ||
                 settings.bookmark_type == 'notes'
                  ? '@' +
                    (settings.bookmark_type == 'notes'
                     ? child.end_id + '*' + child.end_index
                     : child.start_id + '*' + child.start_index)
                  : ''
                if (child.type == 'lecture')
                 history.push('/lecture/' + child.name + focusElement)
                if (child.type == 'verse')
                 history.push('/purports/' + child.name + focusElement)
               }
              }}
             >
              {settings.bookmark_type == 'highlights' ||
              settings.bookmark_type == 'notes' ? (
               <IonCard
                style={{
                 width: select ? '90%' : '100%',
                }}
               >
                <IonCardContent
                 style={{
                  textAlign: 'justify',
                 }}
                >
                 {settings.bookmark_type == 'highlights'
                  ? child.text
                  : child.notes}
                 <IonLabel
                  style={{
                   textAlign: 'right',
                   marginTop: '10px',
                  }}
                 >
                  {childName}
                 </IonLabel>
                </IonCardContent>
               </IonCard>
              ) : (
               <IonLabel>{childName}</IonLabel>
              )}
              {select ? (
               <IonCheckbox
                checked={child.isChecked}
                onIonChange={(e) => {
                 child.isChecked = e.detail.checked
                }}
               />
              ) : null}
             </IonItem>
            )}
           </>
          )
        })
      : null}
    </IonReorderGroup>
    {settings.bookmark_type == 'highlights' ? (
     <IonFab slot="fixed" vertical="bottom" horizontal="end">
      <IonFabButton>
       <div
        style={{
         backgroundColor:
          highlightColor != 'all'
           ? highlightColor
           : settings.theme == 'light'
           ? '#1e90ff'
           : '#3498db',
         borderRadius: '50%',
         height: '100%',
         width: '100%',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
        }}
       >
        <IonIcon
         style={{ fontSize: '30px' }}
         icon={colorPaletteOutline}
        ></IonIcon>
       </div>
      </IonFabButton>
      <IonFabList side="start">
       <IonFabButton
        onClick={() => {
         setHighlightColor('#66B2FF')
        }}
       >
        <div
         style={{
          backgroundColor: '#66B2FF',
          height: '100%',
          width: '100%',
         }}
        ></div>
       </IonFabButton>
       <IonFabButton
        onClick={() => {
         setHighlightColor('#EFD610')
        }}
       >
        <div
         style={{
          backgroundColor: '#EFD610',
          height: '100%',
          width: '100%',
         }}
        ></div>
       </IonFabButton>
       <IonFabButton
        onClick={() => {
         setHighlightColor('#2ECC71')
        }}
       >
        <div
         style={{
          backgroundColor: '#2ECC71',
          height: '100%',
          width: '100%',
         }}
        ></div>
       </IonFabButton>
       <IonFabButton
        onClick={() => {
         setHighlightColor('all')
        }}
       >
        All
       </IonFabButton>
      </IonFabList>
     </IonFab>
    ) : null}

    {settings.bookmark_type == 'Read-Later' &&
    bookmarksMap[key].children.length == 0 ? (
     <p style={{ textAlign: 'center', margin: '10px' }}>
      You can add lectures/purports to Read-Later by clicking{' '}
      <IonIcon icon={timeOutline}></IonIcon> Icon on the heading toolbar in
      their page
     </p>
    ) : null}
    {settings.bookmark_type == 'bookmarks' &&
    bookmarksMap[key].children.length == 0 ? (
     <div
      style={{
       height: '100%',
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'center',
      }}
     >
      No bookmarks found!
     </div>
    ) : null}
    {settings.bookmark_type == 'highlights' &&
    bookmarksMap[key].children.length == 0 ? (
     <div
      style={{
       height: '100%',
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'center',
      }}
     >
      No highlights found!
     </div>
    ) : null}
    {settings.bookmark_type == 'notes' &&
    bookmarksMap[key].children.length == 0 ? (
     <div
      style={{
       height: '100%',
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'center',
      }}
     >
      No notes found!
     </div>
    ) : null}
   </IonContent>
  </IonPage>
 )
}

export default BookmarkList
