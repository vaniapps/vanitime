import { IonLabel, IonPage, IonHeader, IonToolbar, IonContent, IonList, IonItem, IonNote, IonButton, IonButtons,
IonIcon, IonCheckbox, IonItemDivider, IonRadioGroup, IonRadio, IonRange, IonToggle } from '@ionic/react';
import { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { Setting, Settings, UserHistory, WordsPerMin } from '../context';
import { bookmarkOutline, removeCircleOutline } from 'ionicons/icons';
import {convertTo12HourFormat, formatMinutes} from "../scripts/durationToMinutes"

function SettingPage() {
    let { key } = useParams();
    const [userHistory, setUserHistory] = useContext(UserHistory)
    const [entryList, setEntryList] = useState([])
    let history = useHistory();
    const [select, setSelect] = useState(false);
    const [wordsPerMin, setWordsPerMin] = useContext(WordsPerMin)
    const [settings, setSettings] = useContext(Settings)
    
    return (
        <IonPage>
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
                   <div style={{marginLeft:"5px", marginRight:"13px"}}>8</div>
                   <IonRange style={{"paddingTop": "25px", paddingBottom:"25px", width: "70%", "zIndex": "100"}} min={8} max={32} value={settings.font_size} onIonChange={(e)=>{
                    setSettings(prev=>{
                        let dum = {...prev}
                        dum.font_size = e.detail.value
                        return dum
                    })
                   }} pin={true} pinFormatter={(value) => `${value}`}></IonRange>
                   <div style={{marginRight:"5px", marginLeft:"13px"}}>32</div>
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
                   <IonItemDivider color={"secondary"}>No of Words per Minute</IonItemDivider>
                   <div style={{"display":"flex", "justifyContent":"space-between", "alignItems":"center"}}>
                   <div style={{marginLeft:"5px", marginRight:"13px"}}>50</div>
                   <IonRange style={{"paddingTop": "25px", paddingBottom:"25px", width: "70%", "zIndex": "100"}} min={50} max={200} value={wordsPerMin} onIonChange={(e)=>{
                    setWordsPerMin(e.detail.value)
                   }} pin={true} pinFormatter={(value) => `${value}`}></IonRange>
                   <div style={{marginRight:"5px", marginLeft:"13px"}}>200</div>
                   </div>

                   <IonItemDivider color={"secondary"}>Mark as Read/Heard Alerts</IonItemDivider>
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

                   <IonItemDivider color={"secondary"}>Other Setings</IonItemDivider>
                   <IonItem>
                   <IonToggle checked={false} disabled={false}>
                        Backup history with Google Drive
                    </IonToggle>
                    </IonItem>
                   <div style={{"textAlign": "center", margin:"20px"}}>
                    <IonButton>
                        Download Content (Offline)
                    </IonButton>
                    </div>
                   

                </IonContent>
        </IonPage>
    )
}

export default SettingPage