import { useContext, useEffect, useState } from "react";
import { Books, Lectures, LecturesTime, Settings, VaniTime, WordsPerMin } from "../context";
import { IonPage, IonHeader, IonToolbar, IonLabel, IonContent, IonCard, IonCardHeader, IonCardContent,
 IonRouterOutlet, isPlatform, IonCardTitle, IonSearchbar} from "@ionic/react";
import { useHistory, Switch, Route, useLocation, useRouteMatch, useParams } from 'react-router-dom';
import Book from "./BookPage";
import Lecture from "./LecturePage";
import minutesToMinutes, {formatMinutes} from '../scripts/durationToMinutes';


function Vanibase() {
    const [booksMap, setBooksMap] = useContext(Books)
    let history = useHistory();
    let { path, url } = useRouteMatch();
    const [wordsPerMin, setWordsPerMin] = useContext(WordsPerMin)
    const [lecturesTime, setLecturesTime] = useContext(LecturesTime)
    const [lecturesMap, setLecturesMap] = useContext(Lectures)
    const [settings, setSettings] = useContext(Settings)
    useEffect(()=>{
     
        let wc1 = 0
        let wc2 = 0
        let wc3 = 0
        let rwc1 = 0
        let rwc2 = 0
        let rwc3 = 0
        setBooksMap(prev=>{
            let dum ={...prev}
            for (let key1 of Object.keys(booksMap)) {
                wc1 = 0
                rwc1 = 0
                for (let key2 of Object.keys(booksMap[key1]['parts'])) {
                    wc2 = 0
                    rwc2 = 0
                    if(Object.keys(booksMap[key1]['parts'][key2]['parts'])[0].startsWith("_")){
                        for (let key3 of Object.keys(booksMap[key1]['parts'][key2]['parts'])) {
                            wc2+=(Math.round(booksMap[key1]['parts'][key2]['parts'][key3]["wc"]))
                            if (booksMap[key1]['parts'][key2]['parts'][key3]["read"]) rwc2+=(Math.round(booksMap[key1]['parts'][key2]['parts'][key3]["wc"]))
                        }
                    }else{
                        for (let key3 of Object.keys(booksMap[key1]['parts'][key2]['parts'])) {
                            wc3=0
                            rwc3=0
                            for (let key4 of Object.keys(booksMap[key1]['parts'][key2]['parts'][key3]['parts'])) {
                                wc3+=(Math.round(booksMap[key1]['parts'][key2]['parts'][key3]['parts'][key4]["wc"]))
                                if(booksMap[key1]['parts'][key2]['parts'][key3]['parts'][key4]["read"]) rwc3+=(Math.round(booksMap[key1]['parts'][key2]['parts'][key3]['parts'][key4]["wc"]))
                            }
                            dum[key1]["parts"][key2]["parts"][key3]["wc"] = wc3
                            dum[key1]["parts"][key2]["parts"][key3]["read_wc"] = rwc3
                            wc2+=wc3
                            rwc2+=rwc3
                        }
                    }
                    dum[key1]["parts"][key2]["wc"] = wc2
                    dum[key1]["parts"][key2]["read_wc"] = rwc2
                    wc1+=wc2
                    rwc1+=rwc2
                }
                dum[key1]["wc"] = wc1
                dum[key1]["read_wc"] = rwc1
            }
            return dum
        })
    
    
        let time1 = 0;
        let time2 = 0;
        let rtime1 = 0;
        let rtime2 = 0;
        
        let dum = {...lecturesMap}
        for (let key1 of Object.keys(lecturesMap)) {
          time2 = 0
          rtime2 = 0
          for (let key2 of Object.keys(lecturesMap[key1]['parts'])) {
            time2+= minutesToMinutes(lecturesMap[key1]['parts'][key2]['duration'])
            if(lecturesMap[key1]['parts'][key2]['read']) rtime2+=minutesToMinutes(lecturesMap[key1]['parts'][key2]['duration'])
          }
          dum[key1]["heard_time"]=rtime2
          dum[key1]["time"]=time2
          time1+=time2
          rtime1+=rtime2
        }
        setLecturesTime({"heard":rtime1, "total": time1})
        setLecturesMap(dum)
      
    },[])
    return (
       <IonPage>
        <IonHeader>
           
            <IonToolbar >
            <IonSearchbar color={settings.theme == "light" ? "light" : "dark"} placeholder="Search (coming soon...)" style={{"paddingBottom":"0px"}}></IonSearchbar>
            </IonToolbar>
        </IonHeader>
        <IonContent>
                <div style={isPlatform("desktop") ? {display:"flex", justifyContent:"center"} : {}}>
                <div style={isPlatform("desktop") ? {minWidth:"420px"} : {}}>
            {Object.entries(booksMap).map(([bookKey, bookValue]) => {
                console.log(bookValue.wc, wordsPerMin)
                return (
                <IonCard onClick={()=>{
                    history.push(`/bookindex/${bookKey}`)
                }}>
                    <IonCardContent style={{"textAlign": "center", paddingTop: "20px", paddingBottom:"5px"}}>
                    
                    <IonCardTitle style={{"textAlign": "center"}}>{bookValue.name}</IonCardTitle>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                    <IonLabel>{formatMinutes(Math.round(bookValue.read_wc/wordsPerMin))} ({Math.floor((bookValue.read_wc/bookValue.wc)*100)}%)</IonLabel>
                    <IonLabel>{formatMinutes(Math.round(bookValue.wc/wordsPerMin))}</IonLabel>
                   
                    </div>
                    </IonCardContent>
                </IonCard>
                )
            })}

            <IonCard onClick={()=>{
                history.push(`/lectureindex/year`)
            }}>
                <IonCardContent style={{"textAlign": "center", paddingTop: "20px", paddingBottom:"5px"}}>
                    <IonCardTitle style={{"textAlign": "center"}}><IonLabel>Lectures by Year</IonLabel></IonCardTitle>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                    <IonLabel>{formatMinutes(lecturesTime.heard)} ({Math.floor((lecturesTime.heard/lecturesTime.total)*100)}%)</IonLabel>
                    <IonLabel>{formatMinutes(lecturesTime.total)}</IonLabel>
                    </div>
                </IonCardContent>
            </IonCard>

            <IonCard onClick={()=>{
                history.push(`/lectureindex/type`)
            }}>
                <IonCardContent style={{"textAlign": "center", paddingTop: "25px", paddingBottom:"25px"}}>
                <IonCardTitle><IonLabel style={{"textAlign": "center"}}>Lectures by Type</IonLabel></IonCardTitle>
                
                </IonCardContent>
            </IonCard>
            <IonCard onClick={()=>{
                history.push(`/lectureindex/place`)
            }}>
                <IonCardContent style={{"textAlign": "center", paddingTop: "25px", paddingBottom:"25px"}}>
                <IonCardTitle><IonLabel style={{"textAlign": "center"}}>Lectures by Place</IonLabel></IonCardTitle>
               
                </IonCardContent>
            </IonCard>
           
            </div>
    </div>
        </IonContent>
       </IonPage>
       
    )
}

export default Vanibase;