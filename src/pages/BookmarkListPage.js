import React, { useContext, useEffect, useState } from "react";
import { IonItem, IonButton, IonLabel, IonToolbar, IonButtons, IonCheckbox, IonPage, IonHeader, IonContent,
     IonRouterOutlet, IonIcon, IonReorderGroup, IonReorder } from "@ionic/react";
import { Route, useRouteMatch, useHistory, useParams } from "react-router-dom";
import { Bookmarks } from '../context';
import { bookmarkOutline, removeCircleOutline, reorderThreeOutline } from 'ionicons/icons';

function BookmarkList() {
 let { path, url } = useRouteMatch();
 let { key } = useParams();
 const [bookmarksMap, setBookmarksMap] = useContext(Bookmarks)
 const [changedIndexes, setChangedIndexes] = useState([])
 const [select, setSelect] = useState(false);
 const [reo, setReo] = useState(false)
 let history = useHistory();



 return (
    
     <IonPage>
        <IonHeader>
      <IonToolbar>
       <IonButtons slot="start">
        <IonLabel style={{ marginLeft: "10px" }}>{key}</IonLabel>
       </IonButtons>

       {(!select && !reo) ? (
     <IonButtons slot="end" onClick={() =>{ 
        setReo(true)
        }}>
      <IonButton >
      <IonIcon icon={reorderThreeOutline}></IonIcon>
      </IonButton>
     </IonButtons>
    ) : null}

    {reo ? 
        <IonButtons
        style={{ marginRight: "15px" }}
         onClick={() => {
          setReo(false)
          setBookmarksMap({})
          setChangedIndexes([])
          setTimeout(()=>{
            setBookmarksMap({...bookmarksMap})
          },1)
         }}
         slot="end"
        >
         <IonLabel>Cancel</IonLabel>
        </IonButtons> : null }

        {reo ? 
        <IonButtons
        style={{ marginRight: "8px" }}
         onClick={() => {
          setReo(false)
          setChangedIndexes([])
          let dum = JSON.parse(JSON.stringify(bookmarksMap));
          for (let index of changedIndexes) {
            let curr = dum[key]["children"][index.from]
            dum[key]["children"].splice(index.from, 1);
            dum[key]["children"].splice(index.to, 0, curr)
          }
          setBookmarksMap({})
          setTimeout(()=>{
            setBookmarksMap({...dum})
          },1)
         }}
         slot="end"
        >
         <IonLabel>Reorder</IonLabel>
        </IonButtons> : null }

        {select ? (
        <IonButtons
        style={{ marginRight: "15px" }}
         onClick={() => {
          bookmarksMap[key]["children"].map((value) => {
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
            for (let i=0; i<dum[key]["children"].length; i++) {
                if (dum[key]["children"][i].isChecked) {
                    dum[key]["children"].splice(i, 1)
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

       {(!select && !reo) ? (
        <IonButtons
         onClick={() => {
          setSelect(true);
         }}
         slot="end"
        >
         <IonButton  style={{marginRight:"7px"}}>
         <IonIcon icon={removeCircleOutline}></IonIcon>
         </IonButton>
        </IonButtons>
       ) : (
        <p></p>
       )}

      </IonToolbar>
      </IonHeader>
      <IonContent>
    
      <IonReorderGroup disabled={!reo} onIonItemReorder={(e)=>{
       

        console.log(e.detail.from, e.detail.to)

        e.detail.complete();

         
        setChangedIndexes(prev=>{
            let dum = [...prev]
            dum.push({from: e.detail.from, to: e.detail.to})
            return dum
        })
        console.log(bookmarksMap)
      }}>

      {bookmarksMap[key] ? bookmarksMap[key]["children"].map((child, i) => {
       return (
        <>
        {reo ? <IonReorder>
        <IonItem>
         <IonLabel>{child["name"]}</IonLabel>
         <IonIcon icon={reorderThreeOutline} />
        </IonItem>
        </IonReorder> :  <IonItem
         onClick={() => {
          if (!select){
            if(child.type == "lecture") history.push("/lecture/"+child.name)
            if(child.type == "verse") history.push("/purports/"+child.name)
          }
         }}
        >
         <IonLabel>{child["name"]}</IonLabel>  
         {select ? (
          <IonCheckbox
           checked={child.isChecked}
           onIonChange={(e) => {
            child.isChecked = e.detail.checked
           }}
          />
         ) : (
          <p></p>
         )}
        </IonItem>}
        </>
       );
      }): null}
      </IonReorderGroup>
     </IonContent>
     </IonPage>
 );
}

export default BookmarkList;
