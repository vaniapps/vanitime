import { IonLabel, IonPage, IonHeader, IonToolbar, IonContent, IonList, IonItem, IonNote, IonButton, IonButtons,
IonIcon, IonCheckbox, IonItemDivider, IonRadioGroup, IonRadio, IonRange, IonToggle, IonModal, IonInput, IonToast, IonSpinner, IonBackdrop } from '@ionic/react';
import { useContext, useEffect, useState, useRef } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { Goal, Setting, Settings, UserHistory, WordsPerMin } from '../context';
import { bookmarkOutline, removeCircleOutline } from 'ionicons/icons';
import {convertTo12HourFormat, formatMinutes} from "../scripts/durationToMinutes"
import Modal from 'react-modal';
import Login from '../components/Login';
import Drive from '../components/Drive';
import axios from 'axios';



function SettingPage() {
    let { key } = useParams();
    const [userHistory, setUserHistory] = useContext(UserHistory)
    const [entryList, setEntryList] = useState([])
    let history = useHistory();
    const [select, setSelect] = useState(false);
    const [wordsPerMin, setWordsPerMin] = useContext(WordsPerMin)
    const [settings, setSettings] = useContext(Settings)
    const modal = useRef(null);
    function modalDismiss() {
        modal.current?.dismiss();
    }
    const [goal, setGoal] = useContext(Goal)
    const [tempGoal, setTempGoal] = useState(JSON.parse(JSON.stringify(goal)))
    const [toast, setToast] = useState("false")
    const [toastMessageMap, setToastMessageMap] = useState({
        "input": "Please give valid inputs"
    })
    const [alertsMap, setAlertsMap] = useState({
        "fetching": false,
        "save": false,
        "load": false,
    })
    
    
    
    return (
        <>
       
        <IonPage>
        
        {alertsMap["fetching"] ? <div style={{position:"absolute", top:0, left:0, height:"100vh", width:"100%", zIndex:10,  display:"flex", justifyContent:"center", alignItems:"center", backgroundColor:"black", opacity:"0.5"}}><IonSpinner style={{zIndex:11, color:"white"}} /></div> : null}
            <IonHeader>
            <IonToolbar>
                <div style={{textAlign:"center"}}>
                <IonLabel>Setting</IonLabel>
                </div>
            </IonToolbar>
                </IonHeader>
                <IonContent>
                    <div style={{marginBottom:"1px"}}></div>
                    
                   <IonItemDivider color={"secondary"}>Theme of the App</IonItemDivider>
                   <IonRadioGroup value={settings.theme} onIonChange={(e)=>{
                    setSettings(prev=>{
                        let dum = {...prev}
                        dum.theme = e.detail.value
                        return dum
                    })
                   }}>
                   <IonItem>
                        <IonLabel>Light Theme</IonLabel>
                        <IonRadio slot="end" value="light" />
                    </IonItem>
                    <IonItem>
                        <IonLabel>Dark Theme</IonLabel>
                        <IonRadio slot="end" value="dark" />
                    </IonItem>
                   </IonRadioGroup>
                   <IonItemDivider color={"secondary"}>Font Size of the content</IonItemDivider>
                   <div style={{"display":"flex", "justifyContent":"space-between", "alignItems":"center"}}>
                   <div style={{marginLeft:"10px", marginRight:"13px"}}>8</div>
                   <IonRange style={{"paddingTop": "6px", paddingBottom:"6px", width: "70%", "zIndex": "100"}} min={8} max={32} value={settings.font_size} onIonChange={(e)=>{
                    setSettings(prev=>{
                        let dum = {...prev}
                        dum.font_size = e.detail.value
                        return dum
                    })
                   }} pin={true} pinFormatter={(value) => `${value}`}></IonRange>
                   <div style={{marginRight:"10px", marginLeft:"13px"}}>32</div>
                   </div>
                   <IonItemDivider color={"secondary"}>Font Style</IonItemDivider>
                   <IonRadioGroup value={settings.font_style} onIonChange={(e)=>{
                    setSettings(prev=>{
                        let dum = {...prev}
                        dum.font_style = e.detail.value
                        return dum
                    })
                   }}>
                    <IonItem>
                        <IonLabel style={{fontFamily:"Arial, Helvetica, sans-serif"}}>Sans-Serif font</IonLabel>
                        <IonRadio slot="end" value="Arial, Helvetica, sans-serif" />
                    </IonItem>
                   <IonItem>
                        <IonLabel style={{fontFamily:"Times New Roman, Times, serif"}}>Serif font</IonLabel>
                        <IonRadio slot="end" value="Times New Roman, Times, serif" />
                    </IonItem>
                    <IonItem>
                        <IonLabel style={{fontFamily:"Consolas, monospace"}}>Monospace font</IonLabel>
                        <IonRadio slot="end" value="Consolas, monospace" />
                    </IonItem>
                    <IonItem>
                        <IonLabel style={{fontFamily:"Dancing Script, cursive"}}>Cursive font</IonLabel>
                        <IonRadio slot="end" value="Dancing Script, cursive" />
                    </IonItem>
                    <IonItem>
                        <IonLabel style={{fontFamily:"Papyrus, fantasy", fontWeight: "500"}}>Decarative font</IonLabel>
                        <IonRadio slot="end" value="Papyrus, fantasy" />
                    </IonItem>
                   </IonRadioGroup>
                   <IonItemDivider color={"secondary"}>Reading Speed (words per minute)</IonItemDivider>
                   <div style={{"display":"flex", "justifyContent":"space-between", "alignItems":"center"}}>
                   <div style={{marginLeft:"10px", marginRight:"13px"}}>50</div>
                   <IonRange style={{"paddingTop": "6px", paddingBottom:"6px", width: "70%", "zIndex": "100"}} min={50} max={200} value={wordsPerMin} onIonChange={(e)=>{
                    setWordsPerMin(e.detail.value)
                   }} pin={true} pinFormatter={(value) => `${value}`}></IonRange>
                   <div style={{marginRight:"10px", marginLeft:"13px"}}>200</div>
                   </div>

                   <IonItemDivider color={"secondary"}>Display Read/Heard Alerts</IonItemDivider>
                   <IonRadioGroup value={settings.check_alerts} onIonChange={(e)=>{
                    setSettings(prev=>{
                        let dum = {...prev}
                        dum.check_alerts = e.detail.value
                        return dum
                    })
                   }}>
                   <IonItem>
                        <IonLabel>Only if not done Manually</IonLabel>
                        <IonRadio slot="end" value="manual" />
                    </IonItem>
                    <IonItem>
                        <IonLabel>Always</IonLabel>
                        <IonRadio slot="end" value="always" />
                    </IonItem>
                    <IonItem>
                        <IonLabel>Never</IonLabel>
                        <IonRadio slot="end" value="never" />
                    </IonItem>
                   </IonRadioGroup>

                   <IonItemDivider color={"secondary"}>VaniTime Goals</IonItemDivider>

                   <IonList>
                        <IonItem>
                        <IonLabel style={{width: "150px"}}>Lectures Daily Goal </IonLabel>
                        <IonLabel>:</IonLabel>
                            <IonInput onIonChange={(e)=>{
                                setTempGoal(prev=>{
                                    let dum = {...prev}
                                    dum["lectures"]["day"] = e.detail.value * 1
                                    dum["lectures"]["week"] = e.detail.value * 7
                                    dum["lectures"]["month"] = e.detail.value * 30
                                    return dum
                                })
                            }} type="number" min="0" value={tempGoal["lectures"]["day"]!= -1 ? tempGoal["lectures"]["day"] : null} placeholder="in minutes"></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel style={{width: "150px"}}>Books Daily Goal </IonLabel>
                            <IonLabel>:</IonLabel>
                            <IonInput onIonChange={(e)=>{
                                setTempGoal(prev=>{
                                    let dum = {...prev}
                                    dum["books"]["day"] = e.detail.value * 1 
                                    dum["books"]["week"] = e.detail.value * 7
                                    dum["books"]["month"] = e.detail.value * 30
                                    return dum
                                })
                            }} type="number" min="0" value={tempGoal["books"]["day"] != -1 ? tempGoal["books"]["day"] : null} placeholder="in minutes"></IonInput>
                        </IonItem>
                        </IonList>
                        <div onClick={()=>{
                            if(tempGoal["lectures"]["day"] < 0 || tempGoal["books"]["day"] < 0){
                                setToast("input")
                                return
                            } 
                            else {
                                setGoal(tempGoal)
                            }
                        }} style={{textAlign:"center", margin: "10px"}}>
                        <IonButton>Save Goals</IonButton>
                        </div>

                   <IonItemDivider color={"secondary"}>Backup Stats & Bookamrks</IonItemDivider>
                                     
                    <div style={{margin: "15px 10px 10px 10px"}}>
                    <Drive alertsMap={alertsMap} setAlertsMap={setAlertsMap} />
                    </div>
                   
                    <IonToast onDidDismiss={()=>{setToast("false")}} isOpen={toast != "false"} message={toastMessageMap[toast]} duration={2000}></IonToast>
                   
                        
                </IonContent>
        </IonPage>
        </>
    )
}

export default SettingPage