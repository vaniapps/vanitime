import { IonLabel, IonPage, IonHeader, IonToolbar, IonContent, IonList, IonItem, IonNote, IonButton, IonButtons,
IonIcon, IonCheckbox, IonItemDivider, IonRadioGroup, IonRadio, IonRange, IonToggle, IonModal, IonInput, IonToast } from '@ionic/react';
import { useContext, useEffect, useState, useRef } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { Goal, Setting, Settings, UserHistory, WordsPerMin } from '../context';
import { bookmarkOutline, removeCircleOutline } from 'ionicons/icons';
import {convertTo12HourFormat, formatMinutes} from "../scripts/durationToMinutes"
import Modal from 'react-modal';
import uploadObject from '../utils/uploadObject';
import downloadObject from '../utils/downloadObject';



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
        "goals": false
    })
    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: "90%",
          maxWidth: "400px",
          padding: 0,
          backgroundColor: settings.theme == "light" ? "#ffffff" : "#121212",
          color: settings.theme == "light" ? "black" :  "#ffffff",
          borderColor: settings.theme == "light" ? "#ffffff" : "#121212"
        },
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)"
        }
      };
    
    
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

                   <IonItemDivider color={"secondary"}>Other Setings</IonItemDivider>
                   <IonItem>
                   <IonToggle checked={false} disabled={false}>
                        Backup history with Google Drive
                    </IonToggle>
                    <IonButton onClick={()=>{
												uploadObject("history", userHistory)
										}} slot="end" fill="outline" style={{marginRight:"10px"}}>Backup
										</IonButton>
										
										<IonButton onClick={()=>{
											  downloadObject().then((res)=>{
													setUserHistory(res)
												})
										}} slot="end" fill="outline" style={{marginRight:"10px"}}>Restore
										</IonButton>

                    </IonItem>
                    <p style={{margin:"0 0 0 11px"}}>(coming soon...)</p>
                    <div style={{"textAlign": "center", margin:"20px"}}>
                    <IonButton onClick={()=>{
                        setAlertsMap(prev => {
                            let dum = {...prev}
                            dum["goals"] = true
                            return dum
                        })
                    }} style={{width:"275px"}}>
                        Edit Goals
                    </IonButton>
                    </div>
                   <div style={{"textAlign": "center", margin:"20px"}}>
                    <IonButton style={{width:"275px"}}>
                        Download Content (Offline)
                    </IonButton>
                    <p style={{textAlign:"center", margin:"0"}}>(coming soon...)</p>
                    
                    </div>
                    <Modal
                    isOpen={alertsMap["goals"]}
                    onRequestClose={()=>{
                        setAlertsMap(prev => {
                        let dum = {...prev}
                        dum["goals"] = false
                        return dum
                    })
                    }}
                    style={customStyles}
                    closeTimeoutMS={200}
                    >
                  
                    <div style={{textAlign:"center", marginTop:"10px"}}>Input the Goals</div>
                    <IonList>
                        <IonItem>
                            <IonInput label="Lectures Daily Goal:" onIonChange={(e)=>{
                                setTempGoal(prev=>{
                                    let dum = {...prev}
                                    dum["lectures"]["day"] = e.detail.value * 1
                                    dum["lectures"]["week"] = e.detail.value * 7
                                    dum["lectures"]["month"] = e.detail.value * 30
                                    return dum
                                })
                            }} type="number" min="0" value={tempGoal["lectures"]["day"]} placeholder="in minutes"></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonInput label="Books Daily Goal:" onIonChange={(e)=>{
                                setTempGoal(prev=>{
                                    let dum = {...prev}
                                    dum["books"]["day"] = e.detail.value * 1 
                                    dum["books"]["week"] = e.detail.value * 7
                                    dum["books"]["month"] = e.detail.value * 30
                                    return dum
                                })
                            }} type="number" min="0" value={tempGoal["books"]["day"]} placeholder="in minutes"></IonInput>
                        </IonItem>
                        </IonList>
                        <div style={{display:"flex", justifyContent:"space-evenly", marginTop:"10px"}}>
                            <IonButton onClick={()=>{
                                setAlertsMap(prev => {
                                    let dum = {...prev}
                                    dum["goals"] = false
                                    return dum
                                })
                            }}>Cancel</IonButton> 
                            <IonButton onClick={()=>{
                                if(tempGoal["lectures"]["day"] < 0 || tempGoal["books"]["day"] < 0){
                                    setToast("input")
                                    return
                                } 
                                else {
                                    setGoal(tempGoal)
                                    setAlertsMap(prev => {
                                        let dum = {...prev}
                                        dum["goals"] = false
                                        return dum
                                    })
                                }
                            }}>Done</IonButton>
                      </div>
                    </Modal>
                    <IonToast onDidDismiss={()=>{setToast("false")}} isOpen={toast != "false"} message={toastMessageMap[toast]} duration={2000}></IonToast>
                   

                </IonContent>
        </IonPage>
    )
}

export default SettingPage