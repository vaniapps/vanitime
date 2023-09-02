import { useContext, useEffect, useState } from "react"
import { Books, WordsPerMin } from "../context"
import { useHistory, Switch, Route, useLocation, useRouteMatch, useParams } from 'react-router-dom';
import { IonHeader, IonPage, IonToolbar, IonLabel, IonContent, IonItem, IonNote, IonIcon, IonButton, IonButtons,
IonCheckbox } from "@ionic/react";
import { formatMinutes } from "../scripts/durationToMinutes";
import { removeCircleOutline, checkmarkCircleOutline, checkmarkOutline, chevronBackOutline } from 'ionicons/icons';

function Book() {
    const [booksMap, setBooksMap] = useContext(Books)
    let { key } = useParams();
    let history = useHistory();
    let { path, url } = useRouteMatch();
    let location = useLocation();
    const [currentBook, setCurrentBook] = useState({})
    let keysList = key.split(/[_\.]/);
    const [wordsPerMin, setWordsPerMin] = useContext(WordsPerMin)
    const [markRead, setMarkRead] = useState(false)
    const [markUnread, setMarkUnread] = useState(false)

    function calculateWordsCount(dum) {
        let wc1 = 0
        let wc2 = 0
        let wc3 = 0
        let rwc1 = 0
        let rwc2 = 0
        let rwc3 = 0
            for (let key1 of Object.keys(dum)) {
                wc1 = 0
                rwc1 = 0
                for (let key2 of Object.keys(dum[key1]['parts'])) {
                    wc2 = 0
                    rwc2 = 0
                    if(Object.keys(dum[key1]['parts'][key2]['parts'])[0].startsWith("_")){
                        for (let key3 of Object.keys(dum[key1]['parts'][key2]['parts'])) {
                            wc2+=(Math.round(dum[key1]['parts'][key2]['parts'][key3]["words_count"]))
                            if (dum[key1]['parts'][key2]['parts'][key3]["read"]) rwc2+=(Math.round(dum[key1]['parts'][key2]['parts'][key3]["words_count"]))
                        }
                    }else{
                        for (let key3 of Object.keys(dum[key1]['parts'][key2]['parts'])) {
                            wc3=0
                            rwc3=0
                            for (let key4 of Object.keys(dum[key1]['parts'][key2]['parts'][key3]['parts'])) {
                                wc3+=(Math.round(dum[key1]['parts'][key2]['parts'][key3]['parts'][key4]["words_count"]))
                                if(dum[key1]['parts'][key2]['parts'][key3]['parts'][key4]["read"]) rwc3+=(Math.round(dum[key1]['parts'][key2]['parts'][key3]['parts'][key4]["words_count"]))
                            }
                            dum[key1]["parts"][key2]["parts"][key3]["words_count"] = wc3
                            dum[key1]["parts"][key2]["parts"][key3]["read_words_count"] = rwc3
                            wc2+=wc3
                            rwc2+=rwc3
                        }
                    }
                    dum[key1]["parts"][key2]["words_count"] = wc2
                    dum[key1]["parts"][key2]["read_words_count"] = rwc2
                    wc1+=wc2
                    rwc1+=rwc2
                }
                dum[key1]["words_count"] = wc1
                dum[key1]["read_words_count"] = rwc1
            }
            return dum
    }

    function refreshList() {
        let dumBook = JSON.parse(JSON.stringify(booksMap[keysList[0]]['parts']))
        for (let i=1; i<keysList.length; i++) {
            console.log(keysList[i],dumBook)
            if(i==keysList.length-1 && dumBook["_"+keysList[i]]){
                history.push("/purports/"+key)
            } 
            else dumBook = dumBook[keysList[i]]['parts']
        }
        setCurrentBook(dumBook)
    }

    useEffect(()=>{
        setBooksMap(prev=>{
            let dum = calculateWordsCount(prev)
            return dum
        })
      
    },[])

    useEffect(()=>{
        refreshList()
    },[location])


    

    return (
        <IonPage>
            <IonHeader>
            <IonToolbar>
            <IonButtons slot="start">
        <IonButton onClick={()=>{
            if(history.length > 1){
              history.goBack()
            }else{
              history.push("/vanibase")
            }
        }}>
    <IonIcon icon={chevronBackOutline}></IonIcon>
    </IonButton>
    </IonButtons>
                <IonButtons slot="start">
                    <IonLabel style={{ marginLeft: "10px" }}>{key.replace(/_/g, " ")}</IonLabel>
                </IonButtons>
                {!markRead && !markUnread ? (
                    <IonButtons
                    onClick={() => {
                    setMarkUnread(true);
                    }}
                    slot="end"
                    >
                    <IonButton  style={{marginRight:"3px"}}>
                    <IonIcon icon={removeCircleOutline}></IonIcon>
                    </IonButton>
                    </IonButtons>
                ) : (
                    <p></p>
                )}
                {!markRead && !markUnread ? (
                    <IonButtons
                    onClick={() => {
                    setMarkRead(true);
                    }}
                    slot="end"
                    >
                    <IonButton  style={{marginRight:"8px"}}>
                    <IonIcon icon={checkmarkCircleOutline}></IonIcon>
                    </IonButton>
                    </IonButtons>
                ) : (
                    <p></p>
                )}

            {markRead || markUnread ? (
                <IonButtons
                style={{ marginRight: "15px" }}
                onClick={() => {
                    setMarkRead(false);
                    setMarkUnread(false)
                    Object.entries(currentBook).map(([partKey, partValue]) => {
                        partValue.isChecked = false;
                    });
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
                style={{ marginRight: "8px" }}
                onClick={() => {
                    setMarkRead(false);
                    setMarkUnread(false)
                    setBooksMap(prev=>{
                        let dum ={...prev}
                        let dumBook = dum[keysList[0]]['parts']
                        for (let i=1; i<keysList.length; i++) {
                            console.log(keysList[i],dumBook)
                            if(i==keysList.length-1 && dumBook["_"+keysList[i]]){
                                history.push("/purports/"+key)
                            } 
                            else dumBook = dumBook[keysList[i]]['parts']
                        }

                        for (let part of Object.keys(currentBook)){
                            if(currentBook[part].isChecked) {
                                if (currentBook[part]['parts']) {
                                    for (let part1 of Object.keys(currentBook[part]['parts'])) {
                                        if(currentBook[part]['parts'][part1]['parts']) {
                                            for (let part2 of Object.keys(currentBook[part]['parts'][part1]['parts'])) {
                                                dumBook[part]['parts'][part1]['parts'][part2].read =  markRead ? true : false 
                                            }
                                        } else {
                                            dumBook[part]['parts'][part1].read =  markRead ? true : false 
                                        }
                                    }
                                } else {
                                    dumBook[part].read = markRead ? true : false 
                                }
                            }
                        }
                        return calculateWordsCount(dum)

                    })
                    Object.entries(currentBook).map(([partKey, partValue]) => {
                        partValue.isChecked = false;
                    });
                    
                    refreshList()
                    
                    

                }}
                slot="end"
                >
                <IonLabel>{markRead ? "Mark-Read" : "Mark-Unread"} </IonLabel>
                </IonButtons>
            ) : (
                <p></p>
            )}

            </IonToolbar> 
            </IonHeader>
            <IonContent>
                {currentBook ? Object.entries(currentBook).map(([partKey, partValue])=>{
                    return(
                        <IonItem onClick={()=>{
                            if(!markRead && !markUnread) {
                                if(partKey.startsWith("_")) history.push("/purports/"+key+"."+partKey.replace("_", ""))
                                else if(!isNaN(keysList[keysList.length-1]) && !isNaN(partKey.replace("-", "")))
                                history.push(`${url}.${partKey}`)
                                else history.push(`${url}_${partKey}`)
                            }
                        }}>
                            <IonLabel>
                                {partValue.name ?? partKey.replace("_", "")}
                            </IonLabel>
                            {partValue.read ? <IonIcon color="primary" style={{marginRight:"5px"}} icon={checkmarkOutline}></IonIcon> : ""}
                            {!partKey.startsWith("_") ? <IonNote>{formatMinutes(Math.round(partValue.read_words_count/wordsPerMin))} | {formatMinutes(Math.round(partValue.words_count/wordsPerMin))} ({Math.floor((partValue.read_words_count/partValue.words_count)*100)}%)</IonNote> :
                            <IonNote>{formatMinutes(Math.round(partValue.words_count/wordsPerMin))}</IonNote>}
                            {markRead || markUnread ? (
                                <IonCheckbox
                                style={{marginLeft:"15px"}}
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
                }): null}
            </IonContent>
        </IonPage>
    )
}

export default Book