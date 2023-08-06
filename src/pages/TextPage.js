import { IonContent, IonHeader, IonModal, IonPage, IonTitle, 
IonToolbar, IonItem, IonLabel, IonCheckbox, IonButtons, IonButton, IonIcon, IonChip, IonSpinner } from '@ionic/react';
import { useContext, useEffect, useState } from 'react';
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import axios from 'axios';
import '../styles.css';
import { Books, CurrentBook, IncompleteUserHistory, UserHistory } from '../context';
import { arrowDownOutline, arrowUpOutline, checkboxOutline, chevronBackOutline } from 'ionicons/icons';
import {findNextPurport, findPreviousPurport} from "../scripts/findNextPurports"

function Text(){
  let { path, url } = useRouteMatch();
  let { key } = useParams();
  let history = useHistory();
  const [htmlContent, setHtmlContent] = useState('');
  const [userHistory, setUserHistory] = useContext(UserHistory)
  const [versesMap, setVersesMap] = useState({});
  const [booksMap, setBooksMap] = useContext(Books)
  const [alertsMap, setAlertsMap] = useState({
    "user_history": false
  })
  const [incompleteUserHistory, setIncompleteUserHistory] = useContext(IncompleteUserHistory)
  const [isGoBack, setIsGoBack] = useState(false)
  const [currentBook, setCurrentBook] = useContext(CurrentBook)
  const [tempCurrentBook, setTempCurrentBook] = useState({})

  const parseXmlToHtml = (xmlData) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlData, 'text/xml');
     
      let textContent = xmlDoc.querySelector('text').textContent;
      textContent = textContent.slice(textContent.indexOf("<h4><span class"))
      textContent = textContent.slice(0, textContent.indexOf("<div style=\"float:right"))
      textContent = textContent.replace(/\/wiki/g, "/time/purports")
      textContent = textContent.replace(/<p><br \/>\n<\/p>/g, "")
      const htmlData = textContent.replace(/"/g, ''); // Remove surrounding quotes
      console.log(htmlData);
      return htmlData;
  }
  
  useEffect(()=>{
    const versesList = key.split(",") // Add your API URLs here
    let dumVersesMap = {}
    for (let verse of versesList) {
      dumVersesMap[verse] = {
        "checked": false
      }
    }
    setVersesMap(dumVersesMap)
      setIncompleteUserHistory(true)
      setTempCurrentBook(currentBook)
  },[])

  useEffect(()=>{
    
    const fetchData = async () => {
      try {
        console.log(versesMap)
        const fetchPromises = Object.keys(versesMap).map(verse => axios.get("https://vanisource.org/w/api.php?action=parse&prop=text&format=xml&page="+verse));
        const responses = await Promise.all(fetchPromises);
  
        const parsedHtmlContents = responses.map(response => {
          const xmlData = response.data;
          return parseXmlToHtml(xmlData);
        });
        setHtmlContent(parsedHtmlContents);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [versesMap])

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
    <IonButton onClick={goback}>
    <IonIcon icon={chevronBackOutline}></IonIcon>
    </IonButton>
    </IonButtons>
    <IonButtons style={{"width": "80%"}} slot="start">
      <IonItem lines='none'> 
    <IonLabel >{key.split(",")[0]}{key.split(",").length > 1 ? " to "+key.split(",")[key.split(",").length - 1] : ""}</IonLabel>
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
    style={{marginRight:"7px"}}
   >
    <IonIcon icon={checkboxOutline}></IonIcon>
   </IonButton>
  </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
    {htmlContent != "" ? <>{Object.entries(versesMap).length > 0 && findPreviousPurport(booksMap,  Object.entries(versesMap)[0][0]) ? <IonChip onClick={()=>{
        setVersesMap(prev=>{
          let prevVerse = {}
          prevVerse[findPreviousPurport(booksMap,  Object.entries(versesMap)[0][0])] = {"checked": false}
          let dum={ ...prevVerse ,...prev}
          return dum
        })
      }}><IonLabel>{Object.entries(versesMap).length > 0 ? findPreviousPurport(booksMap,  Object.entries(versesMap)[0][0]) : ""}</IonLabel>
      <IonIcon icon={arrowUpOutline}></IonIcon>
      </IonChip> : null}
    <div>
     
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} /> 
    </div>
    <div style={{textAlign:"right"}}>
    {Object.entries(versesMap).length > 0 && findNextPurport(booksMap,  Object.entries(versesMap)[Object.entries(versesMap).length - 1][0]) ? <IonChip onClick={()=>{
        setVersesMap(prev=>{
          let nextVerse = {}
          nextVerse[findNextPurport(booksMap,  Object.entries(versesMap)[Object.entries(versesMap).length - 1][0])] = {"checked": false}
          let dum={...prev, ...nextVerse}
          return dum
        })
      }}><IonLabel>{Object.entries(versesMap).length > 0 ? findNextPurport(booksMap,  Object.entries(versesMap)[Object.entries(versesMap).length - 1][0]) : ""}</IonLabel>
      <IonIcon icon={arrowDownOutline}></IonIcon>
      </IonChip> : null}
      </div>
      </> : <div style={{height:"100%", width:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}><IonSpinner /></div>}

    <IonModal id="example-modal" isOpen={alertsMap["user_history"]} onDidDismiss={()=>{
      setAlertsMap(prev => {
        let dum = {...prev}
        dum["user_history"] = false
        return dum
    })
    }}>
    <p style={{margin:"10px"}}>Tick the verse which you have read</p>
    <div className='wrapper'> 
    {Object.entries(versesMap).map(([verseKey, verseValue]) => {
        return (
          <IonItem>
            <IonLabel>{verseKey}</IonLabel>
            <IonCheckbox checked={verseValue.checked} onIonChange={(e) => {
                setVersesMap(prev=>{
                  let dum = {...prev}
                  dum[verseKey]["checked"] = e.detail.checked
                  const now = new Date();
                  const hours = String(now.getHours()).padStart(2, '0');
                  const minutes = String(now.getMinutes()).padStart(2, '0');
                  dum[verseKey]["time"] = `${hours}:${minutes}`
                  let verseKeyParts = verseKey.split(/[_\.]/);
                  let verse = booksMap[verseKeyParts[0]]
                  for (let i=1; i<verseKeyParts.length-1; i++) {
                    verse = verse['parts'][verseKeyParts[i]]
                  }
                  verse = verse['parts']["_"+verseKeyParts[verseKeyParts.length-1]]
                  console.log(verse)
                  dum[verseKey]["words_count"] = verse['words_count']
                  return dum
                })
            }} />
          </IonItem>
        )
    })}
    </div> 
      <div style={{display:"flex", justifyContent:"space-evenly", marginTop:"10px"}}>
            <IonButton onClick={()=>{
                setAlertsMap(prev => {
                  let dum = {...prev}
                  dum["user_history"] = false
                  return dum
              })
            }}>Cancel</IonButton> 
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
                  if(!dum[date]) dum[date]={}
                  for (let verse of Object.entries(versesMap)) {
                    if(verse[1]["checked"] && !verse[1]["done"]) {
                      if(!dum[date][verse[0]]) dum[date][verse[0]]=[]
                      dum[date][verse[0]].push({"time": verse[1]["time"], "words_count": verse[1]["words_count"]})
                    }
                    if(!verse[1]["checked"] && verse[1]["done"]) {
                      dum[date][verse[0]].pop()
                      if(dum[date][verse[0]].length == 0) delete dum[date][verse[0]]
                    }
                  }
                  return dum
                })
                setVersesMap(prev=>{
                  let dum = {...prev}
                  for (let verse of Object.entries(dum)) {
                    if(verse[1]["checked"]) {
                      verse[1]["done"] = true
                    }else{
                      verse[1]["done"] = false
                    }
                  }
                  return dum
                })
                setCurrentBook(prev=>{
                  let dum = {...tempCurrentBook}
                  let finalVerse = ""
                  for (let verse of Object.entries(versesMap)) {
                    if(finalVerse && !verse[1]["checked"]) {
                      break
                    }
                    if(finalVerse && verse[1]["checked"]) {
                      finalVerse = verse[0]
                    }
                    if(!finalVerse && verse[1]["checked"]) {
                      let verseKeyParts = verse[0].split(/[_\.]/);
                      if(verseKeyParts.length == 3 && dum["name"]==verseKeyParts[0] && dum["part"] == verseKeyParts[1] && dum["verse"] == verseKeyParts[2]) finalVerse = verse[0]
                      if(verseKeyParts.length == 4 && dum["name"]==verseKeyParts[0] && dum["part"] == verseKeyParts[1] && dum["sub_part"] == verseKeyParts[2] && dum["verse"] == verseKeyParts[3]) finalVerse = verse[0]
                    }
                  }
                  if(finalVerse) {
                    finalVerse = findNextPurport(booksMap, finalVerse)
                    console.log(finalVerse)
                    if (!finalVerse){
                      dum["name"] = ""
                      dum["part"] = ""
                      dum["sub_part"] = ""
                      dum["verse"] = ""
                    } else {
                      let verseKeyParts = finalVerse.split(/[_\.]/);
                      if(verseKeyParts.length == 3) {
                        dum["name"]=verseKeyParts[0] 
                        dum["part"] = verseKeyParts[1]
                        dum["verse"] = verseKeyParts[2]
                      } 
                      if(verseKeyParts.length == 4){
                        dum["name"]=verseKeyParts[0] 
                        dum["part"] = verseKeyParts[1]
                        dum["sub_part"] = verseKeyParts[2]
                        dum["verse"] = verseKeyParts[3]
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
                setIncompleteUserHistory(false)
            }}>Done</IonButton>
      </div>

    </IonModal>

          </IonContent>
  </IonPage>   
  );
};

export default Text;
