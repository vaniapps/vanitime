import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton,
 IonItem, IonLabel, IonIcon, IonModal, IonSpinner} from '@ionic/react';
import { useEffect, useState, useContext } from 'react';
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import axios from 'axios';
import { checkboxOutline, chevronBackOutline } from 'ionicons/icons';
import { IncompleteUserHistory, Lectures, UserHistory } from '../context';
import minutesToMinutes from '../scripts/durationToMinutes';

function Audio(){
    let { path, url } = useRouteMatch();
    let { key } = useParams();
    let history = useHistory();
    const [htmlContent, setHtmlContent] = useState('');
    const [incompleteUserHistory, setIncompleteUserHistory] = useContext(IncompleteUserHistory)
    const [isGoBack, setIsGoBack] = useState(false)  
    const [alertsMap, setAlertsMap] = useState({
        "user_history": false
    })
    const [userHistory, setUserHistory] = useContext(UserHistory)
    const [lectureListened, setLectureListend] = useState(false)
    const [lectureMap, setLecturesMap] = useContext(Lectures)

    const parseXmlToHtml = (xmlData) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, 'text/xml');
       
        let textContent = xmlDoc.querySelector('text').textContent;
        textContent = textContent.slice(textContent.indexOf("<div class=\"code\">"))
        textContent = textContent.slice(0, textContent.indexOf("<!--"))
        textContent = textContent.replace(/\/wiki/g, "/time/purports")
        console.log(textContent.indexOf("/wiki"))
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
        setIncompleteUserHistory(true)
    },[])

    function goback() {
        if(incompleteUserHistory){
        setIsGoBack(true)
        setAlertsMap(prev=>{
          let dum = {...prev}
          dum["user_history"] = true
          return dum
        })
        }else {
          if(history.length > 1){
            history.goBack()
          }else{
            history.push("/")
          }
        }
       }



  return (
    <IonPage>
    <IonHeader>
    <IonToolbar>
    <IonButtons slot="start">
    <IonButton style={{ fontSize:"20px"}} onClick={goback}>
    <IonIcon icon={chevronBackOutline}></IonIcon>
    </IonButton>
    </IonButtons>
    <IonButtons style={{"width": "80%"}} slot="start">
      <IonItem lines="none">
    <IonLabel >{key}</IonLabel>
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
    style={{marginRight:"7px", fontSize:"20px"}}
   >
    <IonIcon icon={checkboxOutline}></IonIcon>
   </IonButton>
  </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent>
        <br />
    
      {htmlContent ?
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} /> : <div style={{height:"100%", width:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}><IonSpinner /></div>}
    
    <IonModal id="example-modal" isOpen={alertsMap["user_history"]} onDidDismiss={()=>{
      setAlertsMap(prev => {
        let dum = {...prev}
        dum["user_history"] = false
        return dum
    })
    }}>
    <div style={{textAlign:"center", marginTop:"10px"}}>Have heard the Lecture?</div>
    <div className='wrapper'> 
    <p>{key}</p>
    </div> 
      <div style={{display:"flex", justifyContent:"space-evenly", marginTop:"10px"}}>
            <IonButton onClick={()=>{
                setAlertsMap(prev => {
                  let dum = {...prev}
                  dum["user_history"] = false
                  return dum
              })
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
              setLecturesMap(prev=>{
                let dum = {...prev}
                for (let category of Object.entries(dum)) {
                    for (let lecture of Object.entries(category[1]["parts"])) {
                        if(lecture[0] == key) {
                            lecture[1]["read"] = false
                        }
                    }
                }
                return dum
             })
              if(isGoBack) {
                if(history.length > 1){
                  history.goBack()
                }else{
                  history.push("/")
                }
              }
              setLectureListend(false)
              setIncompleteUserHistory(false)
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
                        console.log(category)
                        for (let lecture of Object.entries(category[1]["parts"])) {
                            console.log(lecture)
                            if(lecture[0] == key) {
                                duration = minutesToMinutes(lecture[1]["duration"])
                            }
                        }
                    }
                    dum[date][key].push({"time": `${hours}:${minutes}`, duration})
                    return dum
                    })
                    setLecturesMap(prev=>{
                        let dum = {...prev}
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
                setIncompleteUserHistory(false)
                if(isGoBack) {
                  if(history.length > 1){
                    history.goBack()
                  }else{
                    history.push("/")
                  }
                }
            }}>Listend</IonButton>
      </div>

    </IonModal>
          </IonContent>
  </IonPage>   
  );
};

export default Audio;
