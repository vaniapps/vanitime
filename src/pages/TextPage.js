import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import axios from 'axios';

function Text(){
  let { path, url } = useRouteMatch();
  let { key } = useParams();
  let history = useHistory();
  const [htmlContent, setHtmlContent] = useState('');

  const parseXmlToHtml = (xmlData) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlData, 'text/xml');
     
      const textContent = xmlDoc.querySelector('text').textContent;
      const htmlData = textContent.replace(/"/g, ''); // Remove surrounding quotes
      console.log(htmlData);
      return htmlData;
  }
  
  useEffect(()=>{
  const fetchData = async () => {
    try {
      const apiUrls = key.split(","); // Add your API URLs here
      const fetchPromises = apiUrls.map(url => axios.get("https://vanisource.org/w/api.php?action=parse&prop=text&format=xml&page="+url));
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
          </IonContent>
  </IonPage>   
  );
};

export default Text;
