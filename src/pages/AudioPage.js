import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton,
 IonItem, IonLabel, IonIcon, IonModal, IonSpinner, IonToast, IonRadio, IonRadioGroup, IonInput} from '@ionic/react';
import { useEffect, useState, useContext } from 'react';
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import axios from 'axios';
import { checkboxOutline, chevronBackOutline, bookmarkOutline } from 'ionicons/icons';
import { Bookmarks, CurrentLecture, IncompleteUserHistory, Lectures, Settings, UserHistory } from '../context';
import minutesToMinutes from '../scripts/durationToMinutes';

function Audio(){
    let { path, url } = useRouteMatch();
    let { key } = useParams();
    let history = useHistory();
    const [htmlContent, setHtmlContent] = useState('');
    const [incompleteUserHistory, setIncompleteUserHistory] = useContext(IncompleteUserHistory)
    const [alertsMap, setAlertsMap] = useState({
        "user_history": false,
        "bookmark_input": false
    })
    const [userHistory, setUserHistory] = useContext(UserHistory)
    const [lectureListened, setLectureListend] = useState(false)
    const [lectureMap, setLecturesMap] = useContext(Lectures)
    const [tempLectureMap, setTempLecturesMap] = useState({})
    const [bookmarksMap, setBookmarksMap] = useContext(Bookmarks)
    const [bookmarkInput, setBookmarkInput] = useState({"radio": "", "text": ""})
    const [toast, setToast] = useState("false")
    const [toastMessageMap, setToastMessageMap] = useState({
        "bookmark_input": "Please select a boomark folder/input a new boomark folder name"
    })
    const [currentLecture, setCurrentLecture] = useContext(CurrentLecture)
    const [settings, setSettings] = useContext(Settings)

    const parseXmlToHtml = (xmlData) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, 'text/xml');
       
        let textContent = xmlDoc.querySelector('text').textContent;
        textContent = textContent.slice(textContent.indexOf("<div class=\"code\">"))
        textContent = textContent.slice(0, textContent.indexOf("<!--"))
        textContent = textContent.replace(/href="\/(?!wiki\/(BG|SB|CC))[^"]+/g, "")
        textContent = textContent.replace(/\/wiki/g, "/purports")
        textContent = textContent.replace(/_\(1972\)/g, "")
        const htmlData = textContent.replace(/"/g, ''); // Remove surrounding quotes
        return htmlData;
    }
    
    useEffect(()=>{
    const fetchData = async () => {
        try {
            const response = await axios.get("https://vanisource.org/w/api.php?action=parse&prop=text&format=xml&page="+key);
            const xmlData = response.data;
            const htmlContent = parseXmlToHtml(xmlData);
            setHtmlContent(htmlContent);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
        fetchData();
        if(settings.check_alerts != "never") setIncompleteUserHistory("lecture")
        setTempLecturesMap(JSON.parse(JSON.stringify(lectureMap)))
        setCurrentLecture(key)
    },[])





  return (
    <IonPage>
    <IonHeader>
    <IonToolbar>
    <IonButtons slot="start">
    <IonButton style={{ fontSize:"20px"}} onClick={()=>{
            if(history.length > 1){
              history.goBack()
            }else{
              history.push("/")
            }
    }}>
    <IonIcon icon={chevronBackOutline}></IonIcon>
    </IonButton>
    </IonButtons>
    <IonButtons style={{"width": "70%"}} slot="start">
      <IonItem style={{color:"#ffffff"}} lines="none">
    <IonLabel >{key.replace(/_/g, " ")}</IonLabel>
    </IonItem>
    </IonButtons>
    <IonButtons slot="end">
   <IonButton
    onClick={() => {
      setAlertsMap(prev=>{
        let dum = {...prev}
        dum["user_history"] = true
        return dum
      })
    }}
    style={{fontSize:"20px"}}
   >
    <IonIcon icon={checkboxOutline}></IonIcon>
   </IonButton>
  </IonButtons>
  <IonButtons slot="end">
   <IonButton
    onClick={() => {
      setAlertsMap(prev=>{
        let dum = {...prev}
        dum["bookmark_input"] = true
        return dum
      })
    }}
    style={{marginRight:"7px"}}
   >
    <IonIcon icon={bookmarkOutline}></IonIcon>
   </IonButton>
  </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
       
    
      {htmlContent ?
      <div style={{"fontSize":settings.font_size}}><div dangerouslySetInnerHTML={{ __html: htmlContent }} /></div> : <div style={{height:"100%", width:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}><IonSpinner /></div>}
    
    <IonModal id="example-modal" isOpen={alertsMap["user_history"]} onDidDismiss={()=>{
      setAlertsMap(prev => {
        let dum = {...prev}
        dum["user_history"] = false
        return dum
    })
    }}>
    <div style={{textAlign:"center", marginTop:"10px"}}>Have heard the Lecture?</div>
    <div className='wrapper'> 
    <p>{key.replace(/_/g, " ")}</p>
    </div> 
      <div style={{display:"flex", justifyContent:"space-evenly", marginTop:"10px"}}>
            <IonButton onClick={()=>{
                setAlertsMap(prev => {
                  let dum = {...prev}
                  dum["user_history"] = false
                  return dum
              })
              if(lectureListened){
              setUserHistory(prev=>{
                let dum = {...prev}
                const now = new Date();
                const day = String(now.getDate()).padStart(2, '0');
                const month = String(now.getMonth()+1).padStart(2, '0');
                const year = String(now.getFullYear())
                const date = day+"-"+month+"-"+year
                if(dum[date] && dum[date][key]) {
                    dum[date][key].pop()
                    if(dum[date][key].length == 0) delete dum[date][key]
                }    
                return dum
              })
            }
            setLecturesMap(prev=>{
              let dum = JSON.parse(JSON.stringify(tempLectureMap))
              return dum
           })
              setLectureListend(false)
              if(settings.check_alerts == "manual") setIncompleteUserHistory("")
            }}>Not Listend</IonButton> 
            <IonButton onClick={()=>{
                setAlertsMap(prev => {
                    let dum = {...prev}
                    dum["user_history"] = false
                    return dum
                })
                if(!lectureListened){
                    setUserHistory(prev=>{
                    let dum = {...prev}
                    const now = new Date();
                    const hours = String(now.getHours()).padStart(2, '0');
                    const minutes = String(now.getMinutes()).padStart(2, '0');
                    const day = String(now.getDate()).padStart(2, '0');
                    const month = String(now.getMonth()+1).padStart(2, '0');
                    const year = String(now.getFullYear())
                    const date = day+"-"+month+"-"+year
                    if(!dum[date]) dum[date]={}
                    if(!dum[date][key]) dum[date][key]=[]
                    let duration = 0;
                    for (let category of Object.entries(lectureMap)) {
                        for (let lecture of Object.entries(category[1]["parts"])) {
                            if(lecture[0] == key) {
                                duration = minutesToMinutes(lecture[1]["duration"])
                            }
                        }
                    }
                    dum[date][key].push({"time": `${hours}:${minutes}`, duration})
                    return dum
                    })
                    setLecturesMap(prev=>{
                        let dum = JSON.parse(JSON.stringify(tempLectureMap))
                        for (let category of Object.entries(dum)) {
                            for (let lecture of Object.entries(category[1]["parts"])) {
                                if(lecture[0] == key) {
                                    lecture[1]["read"] = true
                                }
                            }
                        }
                        return dum
                    })
                }
                setLectureListend(true)
                if(settings.check_alerts == "manual") setIncompleteUserHistory("")
               
            }}>Listend</IonButton>
      </div>

    </IonModal>

    <IonModal id="example-modal" isOpen={alertsMap["bookmark_input"]} onDidDismiss={()=>{
      setAlertsMap(prev => {
        let dum = {...prev}
        dum["bookmark_input"] = false
        return dum
      })
      setBookmarkInput(prev=>{
        let dum = {...prev}
        dum["radio"] = ""
        dum["text"] =  ""
        return dum
      })
    }}>
    <p style={{margin:"10px"}}>Select the bookmark folder/collection</p>
    <div className='wrapper'>
    <IonItem>
        <IonInput onIonFocus={()=>{
          setBookmarkInput(prev=>{
            let dum = {...prev}
            dum["radio"] = ""
            return dum
        })
        }} onIonChange={(e)=>{
            setBookmarkInput(prev=>{
                let dum = {...prev}
                dum["radio"] = ""
                dum["text"] =  e.detail.value
                return dum
            })
        }} type="text" placeholder="New Bookmark" value={bookmarkInput["text"]}></IonInput>
    </IonItem>
    {Object.keys(bookmarksMap).length > 0 ? <IonRadioGroup allowEmptySelection={true}  onIonChange={e=>{
        setBookmarkInput(prev=>{
          let dum = {...prev}
          dum["radio"] = e.detail.value
          dum["text"] =  ""
          return dum
      })   
    }} value = {bookmarkInput["radio"]}>
    {Object.keys(bookmarksMap).map((bookmarkFolder) => {
        return (
          <IonItem>
            <IonLabel>{bookmarkFolder}</IonLabel>
            <IonRadio slot="end" value={bookmarkFolder} />
          </IonItem>
        )
    })}
    </IonRadioGroup> : null}
   
    </div> 
      <div style={{display:"flex", justifyContent:"space-evenly", marginTop:"10px"}}>
            <IonButton onClick={()=>{
                setAlertsMap(prev => {
                  let dum = {...prev}
                  dum["bookmark_input"] = false
                  return dum
              })
              setBookmarkInput(prev=>{
                let dum = {...prev}
                dum["radio"] = ""
                dum["text"] =  ""
                return dum
              })
            }}>Cancel</IonButton> 
            <IonButton onClick={()=>{
                if(!bookmarkInput["radio"] && !bookmarkInput["text"]) setToast("bookmark_input")
                setAlertsMap(prev => {
                    let dum = {...prev}
                    dum["bookmark_input"] = false
                    return dum
                })
                setBookmarksMap((prev)=>{
                  let dum = {...prev}
                  let bookmark_folder_name = bookmarkInput["radio"]
                  if(bookmarkInput["text"]) {
                    bookmark_folder_name = bookmarkInput["text"]
                    dum[bookmark_folder_name] = {"children": [], "isChecked": false}
                  }  
                  dum[bookmark_folder_name]["children"].push({"name": key,  "type": "lecture", "isChecked": false})
                  return dum 
                })

                setBookmarkInput(prev=>{
                  let dum = {...prev}
                  dum["radio"] = ""
                  dum["text"] =  ""
                  return dum
                })
                
            }}>Done</IonButton>
      </div>

    </IonModal>
    <IonToast isOpen={toast != "false"} message={toastMessageMap[toast]} duration={5000}></IonToast>
          </IonContent>
  </IonPage>   
  );
};

export default Audio;
