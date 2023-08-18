import React, { useContext, useState } from "react";
import { IonItem, IonButton, IonLabel, IonToolbar, IonButtons, IonCheckbox, IonPage, IonHeader, IonContent,
     IonRouterOutlet, IonIcon } from "@ionic/react";
import { Route, useRouteMatch, useHistory } from "react-router-dom";
import { Bookmarks } from '../context';
import { bookmarkOutline, removeCircleOutline } from 'ionicons/icons';
import BookmarkList from "./BookmarkListPage";

function BookmarkFolders() {
 let { path, url } = useRouteMatch();
 const [bookmarksMap, setBookmarksMap] = useContext(Bookmarks)
 const [select, setSelect] = useState(false);
 let history = useHistory();

 return (
    <>
    <IonRouterOutlet>
    <Route exact path={path}>
     <IonPage>
        <IonHeader>
      <IonToolbar>
       <IonButtons slot="start">
        <IonLabel style={{ marginLeft: "10px" }}>Bookmarks</IonLabel>
       </IonButtons>

       {select ? (
        <IonButtons
        style={{ marginRight: "15px" }}
         onClick={() => {
          Object.values(bookmarksMap).map((value) => {
           value.isChecked = false;
          });

          setSelect(false);
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
         style={{ marginRight: "8px" }}
         slot="end"
         onClick={() => {
          setSelect(false)
          setBookmarksMap(prev=>{
            let dum = {...prev}
            for (let key of Object.keys(dum)) {
                if (dum[key].isChecked) delete dum[key]
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

       {!select ? (
        <IonButtons
         onClick={() => {
          setSelect(true);
         }}
         slot="end"
        >
         <IonButton  style={{marginRight:"8px"}}>
         <IonIcon icon={removeCircleOutline}></IonIcon>
         </IonButton>
        </IonButtons>
       ) : (
        <p></p>
       )}

       
      </IonToolbar>
      </IonHeader>
      <IonContent>
        

      {Object.entries(bookmarksMap).length === 0 ? (
        <p style={{ textAlign: "center", margin: "10px" }}>
          You can bookmark a song by clicking <IonIcon icon={bookmarkOutline}></IonIcon> Icon on the heading toolbar of that song
        </p> 
      ) : null}
      {Object.entries(bookmarksMap).map(([folder, value]) => {
       return (
        <IonItem
         onClick={() => {
          if (!select) history.push(`${url}/${folder}`);
         }}
        >
         <IonLabel>{folder} </IonLabel>

         {select ? (
          <IonCheckbox
           checked={value.isChecked}
           onIonChange={(e) => {
            value.isChecked = e.detail.checked;
           }}
          />
         ) : (
          <p></p>
         )}
        </IonItem>
       );
      })}
     </IonContent>
     </IonPage>
    </Route>
    <Route path={`${path}/:key`}>
     <BookmarkList />
    </Route>
    </IonRouterOutlet>
    </>
 );
}

export default BookmarkFolders;
