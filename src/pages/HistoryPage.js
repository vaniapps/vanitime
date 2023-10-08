import { IonLabel, IonPage, IonHeader, IonToolbar, IonContent, IonList, IonItem, IonNote, IonButton, IonButtons,
IonIcon, IonCheckbox } from '@ionic/react';
import { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { UserHistory, WordsPerMin } from '../context';
import { bookmarkOutline, removeCircleOutline, chevronBackOutline } from 'ionicons/icons';
import {convertTo12HourFormat, formatMinutes} from "../scripts/durationToMinutes"

function History() {
    let { key } = useParams();
    const [userHistory, setUserHistory] = useContext(UserHistory)
    const [entryList, setEntryList] = useState([])
    let history = useHistory();
    const [select, setSelect] = useState(false);
    const [wordsPerMin, setWordsPerMin] = useContext(WordsPerMin)

    useEffect(()=>{
        const entryList = []
        if(userHistory[key]){
            for (let entry of Object.entries(userHistory[key])) {
                for (let i=0; i< entry[1].length; i++) {
                    entryList.push({"name": entry[0], "time": entry[1][i]["time"], "isChecked": false, "index": i, "duration": entry[1][i]["duration"] ?? Math.round(entry[1][i]["wc"] / wordsPerMin) })
                }
            }
        }

        entryList.sort((a, b) => a.time - b.time);
        setEntryList(entryList)
        
        
    },[])
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
    <IonButtons slot="start">
        <IonButton onClick={()=>{
            if(history.length > 1){
              history.goBack()
            }else{
              history.push("/stats")
            }
        }}>
    <IonIcon icon={chevronBackOutline}></IonIcon>
    </IonButton>
    </IonButtons>
                <IonButtons slot="start">
        <IonLabel style={{ marginLeft: "10px" }}>{key}</IonLabel>
       </IonButtons>
       {select ? (
        <IonButtons
        style={{ marginRight: "15px" }}
         onClick={() => {
          setSelect(false);
            entryList.map((value) => {
            value.isChecked = false;
           });
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
            setSelect(false);
            setUserHistory(prev=>{
                let dum = {...prev}
                for (let i=0; i<entryList.length; i++) {
                    if(entryList[i].isChecked) {
                        dum[key][entryList[i].name].splice(entryList[i].index, 1)
                        if (dum[key][entryList[i].name].length == 0) delete dum[key][entryList[i].name]
                    }
                }
                return dum
            })
            setEntryList(prev=>{
                let dum = [...prev]
                for (let i=0; i<dum.length; i++) {
                    if (dum[i].isChecked) {
                        dum.splice(i, 1)
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

       {!select ? (
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
                    
                    <IonList>
                  
                        {entryList.map(entry=>{
                            return (
                                <IonItem onClick={()=>{
                                    if(!select){
                                        if(entry.name.indexOf("-_") != -1){
                                            history.push("/lecture/"+entry.name)
                                        }else{
                                            history.push("/purports/"+entry.name)
                                        }
                                    }
                                }}>
                                    <IonLabel>{entry.name.replace(/_/g, " ")}</IonLabel>
                                    <IonNote>{formatMinutes(entry.duration)} | {convertTo12HourFormat(entry.time)}</IonNote>
                                    {select ? (
                                        <IonCheckbox
                                        style={{marginLeft:"15px"}}
                                        checked={entry.isChecked}
                                        onIonChange={(e) => {
                                            entry.isChecked = e.detail.checked
                                        }}
                                        />
                                        ) : (
                                        <p></p>
                                    )}
                                    
                                </IonItem>
                            )
                        })}
                            
                    </IonList>

                </IonContent>
        </IonPage>
    )
}

export default History