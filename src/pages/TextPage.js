import { IonContent, IonHeader, IonModal, IonPage, IonTitle, 
IonToolbar, IonItem, IonLabel, IonCheckbox } from '@ionic/react';
import { useContext, useEffect, useState } from 'react';
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import axios from 'axios';
import '../styles.css';
import { UserHistory } from '../context';

function Text(props){
  let { path, url } = useRouteMatch();
  let { key } = useParams();
  let history = useHistory();
  const [htmlContent, setHtmlContent] = useState('');
  const [userHistory, setUserHistory] = useContext(UserHistory)
  const [versesMap, setVersesMap] = useState({});
  const [booksMap, setBooksMap] = props.booksMap
  const [alertsMap, setAlertsMap] = useState({
    "user_history": false
})

  const parseXmlToHtml = (xmlData) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlData, 'text/xml');
     
      let textContent = xmlDoc.querySelector('text').textContent;
      textContent = textContent.slice(textContent.indexOf("<h4><span class"))
      textContent = textContent.slice(0, textContent.indexOf("<div style=\"float:right"))
      textContent = textContent.replace(/\/wiki/g, "/tab1/purports")
      textContent = textContent.replace(/<p><br \/>\n<\/p>/g, "")
      const htmlData = textContent.replace(/"/g, ''); // Remove surrounding quotes
      console.log(htmlData);
      return htmlData;
  }
  
  useEffect(()=>{
  const fetchData = async () => {
    try {
      const versesList = key.split(",") // Add your API URLs here
      let dumVersesMap = {}
      for (let verse of versesList) {
        dumVersesMap[verse] = {
          "checked": false
        }
      }
      setVersesMap(dumVersesMap)
      const fetchPromises = versesList.map(verse => axios.get("https://vanisource.org/w/api.php?action=parse&prop=text&format=xml&page="+verse));
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
  },[])



  return (
    <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>{key}</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
    <div>
      {htmlContent ?
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} /> : <h1>Loading...</h1>}
    </div>
    <IonModal>

    {Object.entries(versesMap).map(([verseKey, verseValue]) => {
        return (
          <IonItem>
            <IonLabel>{verseKey}</IonLabel>
            <IonCheckbox checked={verseValue.checked} onIonChange={(e) => {
                setVersesMap(prev=>{
                  let dum = {...versesMap}
                  dum[verseKey]["checked"] = e.detail.checked
                  const now = new Date();
                  const hours = String(now.getHours()).padStart(2, '0');
                  const minutes = String(now.getMinutes()).padStart(2, '0');
                  dum[verseKey]["time"] = `${hours}:${minutes}`
                })
            }} />
          </IonItem>
        )
    })}

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
                  const hours = String(now.getDay).padStart(2, '0');
                  const minutes = String(now.getMinutes()).padStart(2, '0');
                })
            }}>Select</IonButton>
      </div>

    </IonModal>

          </IonContent>
  </IonPage>   
  );
};

export default Text;
