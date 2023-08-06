import { IonLabel, IonPage, IonHeader, IonToolbar, IonContent, IonList, IonItem, IonNote } from '@ionic/react';
import { useContext, useEffect, useState } from 'react';
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { UserHistory } from '../context';

function History() {
    let { key } = useParams();
    const [userHistory, setUserHistory] = useContext(UserHistory)
    const [entryList, setEntryList] = useState([])
    let history = useHistory();

    useEffect(()=>{
        const entryList = []
        if(userHistory[key]){
            for (let entry of Object.entries(userHistory[key])) {
                for (let sub_entry of entry[1]) {
                    entryList.push({"name": entry[0], "time": sub_entry["time"]})
                }
            }
        }

        entryList.sort((a, b) => a.time - b.time);
        console.log(entryList)
        setEntryList(entryList)
        
        
    },[])
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <div style={{textAlign:"center"}}>
                   <IonLabel>{key}</IonLabel>
                   </div>
                </IonToolbar>
                </IonHeader>
                <IonContent>

                    <IonList>
                  
                        {entryList.map(entry=>{
                            console.log(entry)
                            return (
                                <IonItem onClick={()=>{
                                    if(entry.name.indexOf("_-_") != -1){
                                        history.push("/time/lecture/"+entry.name)
                                    }else{
                                        history.push("/time/purports/"+entry.name)
                                    }
                                }}>
                                    <IonLabel>{entry.name}</IonLabel>
                                    <IonNote>{entry.time}</IonNote>
                                </IonItem>
                            )
                        })}
                            
                    </IonList>

                </IonContent>
        </IonPage>
    )
}

export default History