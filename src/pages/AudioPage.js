import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton,
 IonItem, IonLabel, IonIcon, IonModal, IonSpinner, IonToast, IonRadio, IonRadioGroup, 
 IonInput, IonFooter, IonRange, IonActionSheet, IonList, IonPopover, IonFab,
IonFabButton, IonFabList, IonTextarea} from '@ionic/react';
import { useEffect, useState, useContext, useRef } from 'react';
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import axios from 'axios';
import { checkboxOutline, chevronBackOutline, bookmarkOutline, playCircleOutline, playBackOutline, playForwardOutline
,speedometerOutline, arrowDownCircleOutline, pauseCircleOutline, documentTextOutline, brushOutline, colorPaletteOutline,
removeCircleOutline, folderOpenOutline, timeOutline } from 'ionicons/icons';
import { Bookmarks, CurrentLecture, IncompleteUserHistory, Lectures, Settings, UserHistory } from '../context';
import minutesToMinutes from '../scripts/durationToMinutes';
import Modal from 'react-modal';
import MaxPriorityDataStructure from '../scripts/priorityQueue';


function Audio(){
    let { path, url } = useRouteMatch();
    let { key } = useParams();
    const [focusElement, setFocusElement] = useState(key.lastIndexOf("@") != -1 ? key.slice(key.lastIndexOf("@")+1) : "")
    key = key.lastIndexOf("@") != -1 ? key.slice(0,  key.lastIndexOf("@")) : key
    let history = useHistory();
    const [htmlContent, setHtmlContent] = useState('');
    const [incompleteUserHistory, setIncompleteUserHistory] = useContext(IncompleteUserHistory)
    const [alertsMap, setAlertsMap] = useState({
        "user_history": false,
        "bookmark_input": false,
        "speed": false
    })
    const [userHistory, setUserHistory] = useContext(UserHistory)
    const [lectureListened, setLectureListend] = useState(false)
    const [lectureMap, setLecturesMap] = useContext(Lectures)
    const [tempLectureMap, setTempLecturesMap] = useState({})
    const [bookmarksMap, setBookmarksMap] = useContext(Bookmarks)
    const [bookmarkInput, setBookmarkInput] = useState({"radio": "", "text": ""})
    const [toast, setToast] = useState("false")
    const [toastMessageMap, setToastMessageMap] = useState({
        "bookmark_input": "Please select a boomark folder/input a new boomark folder name",
        "loading_audio": "loading, please wait or check your internet connection or else try again later",
        "added_read_later": "Added to Read Later"
    })
    const [currentLecture, setCurrentLecture] = useContext(CurrentLecture)
    const [settings, setSettings] = useContext(Settings)
    const audi = useRef();
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0)
    const [play, setPlay] = useState(false);
    const [audioLink, setAudioLink] = useState("")
    const [showHighlightButton, setShowHighlightButton] = useState(false)
    const [textBookmark, setTextBookmark] = useState({})
    const [bookmarkType, setBookmarkType] = useState("bookmarks")
    const [contentLoaded, setContentLoaded] = useState(0)
    const [tempHtmlContent, setTempHtmlContent] = useState("")
    const [editHighlightButton, setEditHighlightButton] = useState(false)
    const [selectedHighlight, setSelectedHighlight] = useState({})
    const [editNotes, setEditNotes] = useState(false)
    const [fabButtonActivated, setFabButtonActivated] = useState(false)
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
    

    const parseXmlToHtml = (xmlData) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, 'text/xml');
       
        let textContent = xmlDoc.querySelector('text').textContent;
        textContent = textContent.slice(textContent.indexOf("<div class=\"code\">"))
        textContent = textContent.slice(0, textContent.indexOf("<!--"))
        const match = textContent.match(/<audio[^>]*><source[^>]*src="([^"]+)".*?<\/audio>/);
        const regex = new RegExp("<audio", 'g');
        const matches = textContent.match(regex);
        if (match && match[1] && matches.length == 1) {
          setAudioLink(match[1])
          textContent = textContent.replace(/<p><br \/>\s*<audio[^>]*><source[^>]*src="([^"]+)".*?<\/audio>\s*<\/p>/,'')
        }
        if(matches.length != 1) setAudioLink("none")
        textContent = textContent.replace(/<a\s+href="\/(?!wiki\/(BG|SB|CC))[^"][^>]*>/g, "")
        textContent = textContent.replace(/<b*>/g, "")
        textContent = textContent.replace(/<br \/>/g, "")
        textContent = textContent.replace(/\/wiki/g, "/purports")
        textContent = textContent.replace(/_\(1972\)/g, "")
        textContent = textContent.replace(/h4/g, 'dl');
        textContent = textContent.replace(/<i.*?>/g, "").replace(/<\/i>/g, "");
        textContent = textContent.replace(/<p[^>]*>(.*?)<a[^>]*>(.*?)<\/a>(.*?)<\/p>/g, '')
        let parsedDocument = parser.parseFromString(textContent, 'text/html');
        let elements = parsedDocument.querySelectorAll('*');
  
        elements.forEach((element, index) => {
          if(element.tagName == "P") {
            element.innerHTML = "<span>"+element.innerHTML.replace(/<a/g, "</span><a").replace(/<\/a>/g, "</a><span>") + "</span>"
          }
        });
  
        textContent = parsedDocument.documentElement.outerHTML;
  
        parsedDocument = parser.parseFromString(textContent, 'text/html');
        elements = parsedDocument.querySelectorAll('*');
  
  
        elements.forEach((element, index) => {
          if (element.hasAttribute('class')) {
            element.removeAttribute('class');
          }
          if (element.hasAttribute('id')) {
            element.removeAttribute('id');
          }
          element.setAttribute('id', `${key}!${index + 1}`);
        });
  
        textContent = parsedDocument.documentElement.outerHTML;

        const htmlData = textContent.replace(/"/g, '');
        return htmlData;
    }

    
    useEffect(()=>{
    const fetchData = async () => {
        try {
            const response = await axios.get("https://vanisource.org/w/api.php?action=parse&prop=text&format=xml&page="+key);
            const xmlData = response.data;
            const htmlContent = parseXmlToHtml(xmlData);
            setHtmlContent(htmlContent);
            setTempHtmlContent(htmlContent);
            setContentLoaded(contentLoaded+1)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
        fetchData();
        if(settings.check_alerts != "never") setIncompleteUserHistory("lecture")
        setTempLecturesMap(JSON.parse(JSON.stringify(lectureMap)))
        setCurrentLecture(key)
    },[])


    useEffect(()=>{
  
      const containerDiv = document.getElementsByClassName('content-container')[0];
      if(containerDiv){
      function onSelect() {
        const selection = window.getSelection();
        const selectedText = selection.toString();
        if(selectedText){
          setShowHighlightButton(true)
          let anchorId = selection.anchorNode.parentElement.id;
          let focusId = selection.focusNode.parentElement.id;
          let anchorOffset = selection.anchorOffset
          let focusOffset = selection.focusOffset
          if(selection.anchorNode.parentElement.className.startsWith("highlight") || selection.anchorNode.parentElement.className == "non-highlight") {
            anchorOffset+=parseInt(anchorId.slice(anchorId.indexOf("*")+1, anchorId.indexOf("^") != -1 ? anchorId.indexOf("^") : anchorId.length))
            anchorId=anchorId.slice(0,anchorId.indexOf("*"))
          }
          if(selection.focusNode.parentElement.className.startsWith("highlight") || selection.focusNode.parentElement.className == "non-highlight") {
            focusOffset+=parseInt(focusId.slice(focusId.indexOf("*")+1, focusId.indexOf("^") != -1 ? focusId.indexOf("^") : focusId.length))
            focusId=focusId.slice(0,focusId.indexOf("*"))
          }
          setTimeout(()=>{
            setTextBookmark({
              "name": key,
              "type": "lecture",
              "text": selectedText,
              "start_id": anchorId,
              "end_id": focusId,
              "start_index": anchorOffset,
              "end_index": focusOffset,
              "color": settings.highlights_color,
              "timestamp": new Date().toISOString()
            })
          },1)
          setTimeout(()=>{
            if(!window.getSelection().toString()) setShowHighlightButton(false)
          },1)
        }else {
          setShowHighlightButton(false)
        }
      }
      containerDiv.addEventListener("mouseup", () => {
        onSelect()
       });
       containerDiv.addEventListener("touchend", () => {
         onSelect()
       });
  
      containerDiv.addEventListener("click", (event) => {
        const clickedElement = event.target;
        if(clickedElement.id.includes("@notes")){
          for (let bookmark of Object.entries(bookmarksMap)){
            for (let i=0; i<bookmark[1]['children'].length; i++) {
              if(bookmark[1]['children'][i].timestamp == clickedElement.id.slice(clickedElement.id.indexOf("^")+1, clickedElement.id.indexOf("@"))) {
                setTextBookmark(bookmark[1]['children'][i])
                setBookmarkType("notes")
                setBookmarkInput(prev=>{
                  let dum = {...prev}
                  dum["radio"] = bookmark[0]
                  return dum
                })
                setAlertsMap(prev=>{
                  let dum = {...prev}
                  dum["bookmark_input"] = true
                  return dum
                })
                setEditHighlightButton(false)
                setEditNotes(true)
                break
              }
            }
          }
        }
        else if(!clickedElement.id.includes("@notes") && clickedElement.className.startsWith("highlight")){
          setEditHighlightButton(false)
          setTimeout(()=>{ setEditHighlightButton(true)},100)
          let elementId = clickedElement.id
          for (let bookmark of Object.entries(bookmarksMap)){
            for (let i=0; i<bookmark[1]['children'].length; i++) {
              if(bookmark[1]['children'][i].timestamp == clickedElement.id.slice(clickedElement.id.indexOf("^")+1)) {
                setSelectedHighlight({"color": "#"+clickedElement.className.slice(9), "folder":  bookmark[0], "timestamp": elementId.slice(elementId.lastIndexOf("^")+1)})
                setTextBookmark(bookmark[1]['children'][i])
                break
              }
            }
          }
        }else{
          setEditHighlightButton(false)
          setSelectedHighlight({})
        }
        setFabButtonActivated(false)
      })
    }

    if(focusElement){
      setTimeout(()=>{
        const parser = new DOMParser();
      const parsedDocument = parser.parseFromString(htmlContent, 'text/html');
      const elements = parsedDocument.querySelectorAll('*');
      for (let element of elements){
        if(element.getAttribute('id') && element.getAttribute('id').startsWith(focusElement)) {
          let focusedElement = document.getElementById(element.getAttribute("id"));
          if(focusedElement) {
            focusedElement.scrollIntoView({ behavior: 'smooth' });
            setFocusElement("")
            break
          }
        }
      }
      },1)
    }
  
    },[htmlContent])

    useEffect(()=>{
      if(contentLoaded >= 1){
      
      let highlights = {}

      function colorHtml() {
        const parser = new DOMParser();
        const parsedDocument = parser.parseFromString(tempHtmlContent, 'text/html');
        const elements = parsedDocument.querySelectorAll('*');
        for (let element of elements){
          let elementId = element.getAttribute('id')
          if(highlights[elementId]) {
            const originalHTML = element.innerHTML;
            let modifiedHTML = highlights[elementId][0][0] != 0 ? `<span id=${elementId}*0 class="non-highlight">${originalHTML.substring(0, highlights[elementId][0][0])}</span>` : ""
            for (let i = 0; i<highlights[elementId].length; i++) {
              if(!highlights[elementId][i][4]) modifiedHTML += `<span id=${elementId}*${highlights[elementId][i][0]}^${highlights[elementId][i][3]} class=${highlights[elementId][i][2] ? "highlight"+highlights[elementId][i][2].slice(1) : "non-highlight"}>${originalHTML.substring(highlights[elementId][i][0], highlights[elementId][i][1])}</span>`
              else modifiedHTML+=`<svg id=${elementId}*${highlights[elementId][i][1]}^${highlights[elementId][i][4]}@notes style="user-select=none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="15" height="15">
              <path id=${elementId}*${highlights[elementId][i][1]}^${highlights[elementId][i][4]}@notes style="user-select=none" d="M352 0H80C53.49 0 32 21.49 32 48v416c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V160L352 0zM192 64h160c8.837 0 16 7.163 16 16s-7.163 16-16 16H192c-8.837 0-16-7.163-16-16s7.163-16 16-16zm-64 64h224c8.837 0 16 7.163 16 16s-7.163 16-16 16H128c-8.837 0-16-7.163-16-16s7.163-16 16-16zm0 64h224c8.837 0 16 7.163 16 16s-7.163 16-16 16H128c-8.837 0-16-7.163-16-16s7.163-16 16-16zm0 64h160c8.837 0 16 7.163 16 16s-7.163 16-16 16H128c-8.837 0-16-7.163-16-16s7.163-16 16-16z" fill="#FFD700"/>
            </svg>`
              if(i<highlights[elementId].length-1 && highlights[elementId][i][1] < highlights[elementId][i+1][0]) modifiedHTML += `<span id=${elementId}*${highlights[elementId][i][1]} class="non-highlight">${originalHTML.substring(highlights[elementId][i][1], highlights[elementId][i+1][0])}</span>`
            }
            modifiedHTML += highlights[elementId][highlights[elementId].length - 1][1] != originalHTML.length ?  `<span id=${elementId}*${highlights[elementId][highlights[elementId].length - 1][1]} class="non-highlight">${originalHTML.substring(highlights[elementId][highlights[elementId].length - 1][1], originalHTML.length)}</span>` : ""  
            element.innerHTML = modifiedHTML;
          }
        }
        setHtmlContent(parsedDocument.documentElement.outerHTML);
      }

      function makehighlights(text, start_id, end_id, start_index, end_index, color, timestamp){
        let startColoring = false
        if(!htmlContent.includes(start_id)) startColoring = true
        const parser = new DOMParser();
        const parsedDocument = parser.parseFromString(tempHtmlContent, 'text/html');
        const elements = parsedDocument.querySelectorAll('*');
        for (let element of elements){
          let elementId = element.getAttribute('id')
          if(element.childElementCount > 0) continue
          if(element.getAttribute('id') == start_id && color!="notes"){
            if(start_id == end_id){
              console.log(highlights[elementId])
              if(highlights[elementId]){
                console.log([start_index, end_index])
                highlights[elementId].push([start_index, end_index, color, timestamp])
              }else{
                highlights[elementId] = [[start_index, end_index, color, timestamp]]
              }
              console.log(highlights[elementId])
              break
            }else{
              if(highlights[elementId]){
                highlights[elementId].push([start_index, element.textContent.length, color, timestamp])
              }else{
                highlights[elementId] = [[start_index, element.textContent.length, color, timestamp]]
              }
            }
            startColoring = true
            continue
          }
          if(element.getAttribute('id') == end_id){
            if(highlights[elementId]){
              highlights[elementId].push([0, end_index, color, timestamp])
            }else{
              highlights[elementId] = [[0, end_index, color, timestamp]]
            }
            break
          }
          if(startColoring && color != "notes"){
            if(highlights[elementId]){
              highlights[elementId].push([0, element.textContent.length, color, timestamp])
            }else{
              highlights[elementId] = [[0, element.textContent.length, color, timestamp]]
            }
          }
        };
      }
     
      for(let folder of Object.keys(bookmarksMap)) {
        for (let bookmark of bookmarksMap[folder]['children']) {
          if(bookmark["text"]){
            if(bookmark["name"] == key) {
              makehighlights(bookmark["text"], bookmark["start_id"], bookmark["end_id"], bookmark["start_index"], bookmark["end_index"], bookmark["color"] ?? "notes", bookmark["timestamp"])
            }
          }
        }
      }

      for(let highlight of Object.entries(highlights)){
        let element = highlight[1]
        let operateArray = []
        let resultArray = []
        for (let i = 0; i < element.length; i++) {
          if(element[i][2]!="notes"){
            operateArray.push([element[i][0], "s", element[i][2], element[i][3]])
            operateArray.push([element[i][1], "e", element[i][2], element[i][3]])
          }else{
            operateArray.push([element[i][1], "s", element[i][2], element[i][3]])
            operateArray.push([element[i][1], "e", element[i][2], element[i][3]])
          }
        }
        operateArray.sort((a, b) => {
          if(a[0] == b[0]){
            if(a[1]=='s') return -1
            if(b[1] == 's') return 1
            if(a[2] == "notes") return -1
            if(b[2] == "notes") return 1
            return 0
          }
          return a[0] - b[0]
        })
        let priorityQueue = new MaxPriorityDataStructure()

        for (let i=0; i<operateArray.length-1; i++) {
          
          if(operateArray[i][1]=="s" && operateArray[i+1][1]=="s") {
            let color = (priorityQueue.size() && new Date(priorityQueue.getMax()["timestamp"]) > new Date(operateArray[i][3])) ? priorityQueue.getMax()["value"] :  operateArray[i][2];
            let timestamp  = (priorityQueue.size() && new Date(priorityQueue.getMax()["timestamp"]) > new Date(operateArray[i][3])) ? priorityQueue.getMax()["timestamp"] :  operateArray[i][3];
            resultArray.push([operateArray[i][0], operateArray[i+1][0], color, timestamp])
            if(operateArray[i][2] != "notes") priorityQueue.insert({"value": operateArray[i][2], "priority": new Date(operateArray[i][3]), "timestamp": operateArray[i][3]})
          }
          if(operateArray[i][1]=="s" && operateArray[i+1][1]=="e") {
            let color = new Date(operateArray[i][3]) > new Date(operateArray[i+1][3]) ? operateArray[i][2] :  operateArray[i+1][2]
            let timestamp = new Date(operateArray[i][3]) > new Date(operateArray[i+1][3]) ? operateArray[i][3] :  operateArray[i+1][3]
            color = (priorityQueue.size() && new Date(priorityQueue.getMax()["timestamp"]) > new Date(timestamp)) ? priorityQueue.getMax()["value"] : color;
            timestamp  = (priorityQueue.size() && new Date(priorityQueue.getMax()["timestamp"]) > new Date(timestamp)) ? priorityQueue.getMax()["timestamp"] :  timestamp;
            resultArray.push([operateArray[i][0], operateArray[i+1][0], color, timestamp, operateArray[i+1][2] == "notes" ? operateArray[i+1][3] : null ])
            if(operateArray[i][2] != "notes") priorityQueue.insert({"value": operateArray[i][2], "priority": new Date(operateArray[i][3]), "timestamp": operateArray[i][3]})
          }
          if(operateArray[i][1]=="e" && operateArray[i+1][1]=="s") {
            priorityQueue.remove(new Date(operateArray[i][3]))
            let color = priorityQueue.size() ? priorityQueue.getMax()["value"] : ""
            let timestamp = priorityQueue.size() ? priorityQueue.getMax()["timestamp"] : ""
            resultArray.push([operateArray[i][0], operateArray[i+1][0], color, timestamp])
          }
          if(operateArray[i][1]=="e" && operateArray[i+1][1]=="e") {
            priorityQueue.remove(new Date(operateArray[i][3]))
            let color = (priorityQueue.size() && new Date(priorityQueue.getMax()["timestamp"]) > new Date(operateArray[i+1][3])) ? priorityQueue.getMax()["value"] : operateArray[i+1][2]
            let timestamp = (priorityQueue.size() && new Date(priorityQueue.getMax()["timestamp"]) > new Date(operateArray[i+1][3])) ? priorityQueue.getMax()["timestamp"] : operateArray[i+1][3]
            resultArray.push([operateArray[i][0], operateArray[i+1][0], color, timestamp ])
          }
        }
        if (resultArray.length == 0) delete highlights[highlight[0]]
        highlights[highlight[0]] = resultArray
      }

      console.log(highlights)

      colorHtml()
    }
    console.log(contentLoaded)
  }, [contentLoaded, bookmarksMap])

  function setHighlightColor(color){
    setSettings(prev=>{
      let dum = {...prev}
      dum.highlights_color = color
      return dum
    })
  }

  function editHighlightColor(color){
    setBookmarksMap(prev=>{
      let dum = {...prev}
      for (let bookmark of Object.entries(dum)){
        for (let i=0; i<bookmark[1]['children'].length; i++) {
          if(bookmark[1]['children'][i].timestamp == selectedHighlight.timestamp) {
            dum[bookmark[0]]['children'][i].color = color
            break
          }
        }
      }
      return dum
    })
    setSettings(prev=>{
      let dum = {...prev}
      dum.highlights_color = color
      return dum
    })
    setEditHighlightButton(false)
  }

    useEffect(() => {
      if (audi.current) {
      audi.current.onloadedmetadata = () => {
        if (audi.current) {
         setDuration(audi.current.duration);
        }}
       };
     }, [audi.current]);

    function formatTime(seconds) {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      return [h, m > 9 ? m : h ? "0" + m : m || "0", s > 9 ? s : "0" + s].filter((a) => a).join(":");
     }

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
    <IonButtons style={{"width": "70%", margin:"0px", "padding":"0"}} slot="start">
    
    <IonLabel >{key.slice(key.indexOf("-_")+2, key.lastIndexOf("-_")).replace(/_/g, " ")}</IonLabel>
   
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
   
   >
    <IonIcon icon={checkboxOutline}></IonIcon>
   </IonButton>
  </IonButtons>
  <IonButtons slot="end">
   <IonButton
    onClick={() => {
      setBookmarksMap((prev)=>{
        let dum = {...prev}
        dum["Read-Later"]["children"].push({"name": key,  "type": "lecture", "isChecked": false})
        return dum 
      })
      setToast("added_read_later")
    }}
   >
    <IonIcon icon={timeOutline}></IonIcon>
   </IonButton>
  </IonButtons>
  <IonButtons slot="end">
   <IonButton
    onClick={() => {
      setBookmarkType("bookmarks")
      setBookmarkInput(prev=>{
        let dum = {...prev}
        dum["radio"] = settings.bookmarks_folder
        return dum
      })
      setAlertsMap(prev=>{
        let dum = {...prev}
        dum["bookmark_input"] = true
        return dum
      })
    }}
    style={{marginRight:"5px"}}
   >
    <IonIcon icon={bookmarkOutline}></IonIcon>
   </IonButton>
  </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
       
    
      {htmlContent ?
      <div style={{"fontSize":settings.font_size}}><div className='content-container' dangerouslySetInnerHTML={{ __html: htmlContent }} /></div> : <div style={{height:"100%", width:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}><IonSpinner /></div>}

<>{showHighlightButton ?<>
            <div className='noselect' style={{display:"flex", flexDirection:"column", justifyContent: "center", alignItems:"center", position:"fixed", bottom:"80px", left:"10px"}}>
      
            <IonFabButton onTouchStart={()=>{
              setBookmarkType("notes")
              setBookmarkInput(prev=>{
                let dum = {...prev}
                dum["radio"] = settings.notes_folder
                return dum
              })
              setAlertsMap(prev=>{
                let dum = {...prev}
                dum["bookmark_input"] = true
                return dum
              })
              setEditHighlightButton(false)
            }} onClick={()=>{
              setBookmarkType("notes")
              setBookmarkInput(prev=>{
                let dum = {...prev}
                dum["radio"] = settings.notes_folder
                return dum
              })
              setAlertsMap(prev=>{
                let dum = {...prev}
                dum["bookmark_input"] = true
                return dum
              })
              setEditHighlightButton(false)
            }}>
              <IonIcon icon={documentTextOutline}></IonIcon>
            </IonFabButton>
          
          </div>
      <div className='noselect' style={{display:"flex", flexDirection:"column", justifyContent: "center", alignItems:"center", position:"fixed", bottom:"80px", right:"10px"}}>
      
      <IonFabButton style={{marginBottom:"35px"}} onTouchStart={()=>{
        let modidfiedTextBookmark = {...textBookmark}
        modidfiedTextBookmark.color = settings.highlights_color
         setBookmarksMap((prev)=>{
         let dum = {...prev}
         let bookmark_folder_name = settings.highlights_folder
         dum[bookmark_folder_name]["children"].push(modidfiedTextBookmark)
         return dum 
       })
       setShowHighlightButton(false)
       setEditHighlightButton(false)
       const timerInterval = setInterval(() => {
        setEditHighlightButton(false)
      }, 1);
      setTimeout(()=>{
        clearInterval(timerInterval);
      },500)
      }} onClick={()=>{
         let modidfiedTextBookmark = {...textBookmark}
         modidfiedTextBookmark.color = settings.highlights_color
          setBookmarksMap((prev)=>{
          let dum = {...prev}
          let bookmark_folder_name = settings.highlights_folder
          dum[bookmark_folder_name]["children"].push(modidfiedTextBookmark)
          return dum 
        })
        setShowHighlightButton(false)
        setEditHighlightButton(false)
      }}>
        <div style={{backgroundColor:settings.highlights_color, borderRadius:"50%", height:"100%", width:"100%", display:'flex', alignItems:"center", justifyContent:"center"}}>
        <IonIcon style={{fontSize:"30px"}}  icon={brushOutline}></IonIcon>
        </div>
      </IonFabButton>
     
    <IonFab onTouchStart={()=>{
      if(fabButtonActivated) setFabButtonActivated(false)
      else setFabButtonActivated(true)
    }} activated={fabButtonActivated}>
      <IonFabButton >
        <IonIcon icon={colorPaletteOutline}></IonIcon>
      </IonFabButton>
      <IonFabList side="start">
      <IonFabButton onTouchStart={()=>{setHighlightColor("#66B2FF")}}  onClick={()=>{setHighlightColor("#66B2FF")}}>
        <div style={{backgroundColor:"#66B2FF", height:"100%", width:"100%"}}></div>
      </IonFabButton>
      <IonFabButton onTouchStart={()=>{setHighlightColor("#EFD610")}}  onClick={()=>{setHighlightColor("#EFD610")}}>
        <div style={{backgroundColor:"#EFD610", height:"100%", width:"100%"}}></div>
      </IonFabButton>
      <IonFabButton onTouchStart={()=>{setHighlightColor("#2ECC71")}}  onClick={()=>{setHighlightColor("#2ECC71")}}>
        <div style={{backgroundColor:"#2ECC71", height:"100%", width:"100%"}}></div>
      </IonFabButton>
      </IonFabList>
      </IonFab>
     
      <IonFabButton style={{marginTop: "35px"}} onTouchStart={()=>{
        setBookmarkType("highlights")
        setBookmarkInput(prev=>{
          let dum = {...prev}
          dum["radio"] = settings.highlights_folder
          return dum
        })
        setAlertsMap(prev=>{
          let dum = {...prev}
          dum["bookmark_input"] = true
          return dum
        })
        setEditHighlightButton(false)
      }} onClick={()=>{
        setBookmarkType("highlights")
        setBookmarkInput(prev=>{
          let dum = {...prev}
          dum["radio"] = settings.highlights_folder
          return dum
        })
        setAlertsMap(prev=>{
          let dum = {...prev}
          dum["bookmark_input"] = true
          return dum
        })
        setEditHighlightButton(false)
      }}>
        <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
        <IonIcon style={{fontSize:"30px"}} icon={folderOpenOutline}></IonIcon>
        <IonLabel style={{fontSize:"10px"}}>{settings.highlights_folder.slice(0, settings.highlights_folder.lastIndexOf("-"))}</IonLabel>
        </div>
      </IonFabButton>
    
    </div></> : null
       }</>

    <>{editHighlightButton && !showHighlightButton ?
     
     <div style={{display:"flex", flexDirection:"column", justifyContent: "space-evenly", alignItems:"center", position:"fixed", bottom:"80px", right:"10px"}}>
      
      <IonFabButton style={{marginBottom:"35px"}} onClick={()=>{
        setBookmarksMap(prev=>{
          let dum = {...prev}
          for (let bookmark of Object.entries(dum)){
            for (let i=0; i<bookmark[1]['children'].length; i++) {
              if(bookmark[1]['children'][i].timestamp == selectedHighlight.timestamp) {
                console.log(bookmark[1]['children'][i].timestamp,selectedHighlight.timestamp)
                dum[bookmark[0]]['children'].splice(i,1)
                break
              }
            }
          }
          return dum
        })
        setEditHighlightButton(false)
      }}>
        <IonIcon icon={removeCircleOutline}></IonIcon>
      </IonFabButton>
     
    <IonFab >
      <IonFabButton >
        <div style={{backgroundColor:selectedHighlight.color, borderRadius:"50%", height:"100%", width:"100%", display:'flex', alignItems:"center", justifyContent:"center"}}>
        <IonIcon style={{fontSize:"30px"}}  icon={colorPaletteOutline}></IonIcon>
        </div>
      </IonFabButton>
      <IonFabList side="start">
      <IonFabButton  onClick={()=>{editHighlightColor("#66B2FF")}}>
        <div style={{backgroundColor:"#66B2FF", height:"100%", width:"100%"}}></div>
      </IonFabButton>
      <IonFabButton  onClick={()=>{editHighlightColor("#EFD610")}}>
        <div style={{backgroundColor:"#EFD610", height:"100%", width:"100%"}}></div>
      </IonFabButton>
      <IonFabButton  onClick={()=>{editHighlightColor("#2ECC71")}}>
        <div style={{backgroundColor:"#2ECC71", height:"100%", width:"100%"}}></div>
      </IonFabButton>
      </IonFabList>
      </IonFab>

      <IonFabButton style={{marginTop: "35px"}} onClick={()=>{
        setBookmarkType("highlights")
        setBookmarkInput(prev=>{
          let dum = {...prev}
          dum["radio"] = selectedHighlight.folder
          return dum
        })
        setAlertsMap(prev=>{
          let dum = {...prev}
          dum["bookmark_input"] = true
          return dum
        })
        setEditHighlightButton(false)
      }}>
        <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
        <IonIcon style={{fontSize:"30px"}} icon={folderOpenOutline}></IonIcon>
        <IonLabel style={{fontSize:"10px"}}>{selectedHighlight.folder.slice(0, selectedHighlight.folder.lastIndexOf("-"))}</IonLabel>
        </div>
      </IonFabButton>
    
    </div>
    : null
       }</>
      <Modal
      isOpen={alertsMap["user_history"]}
      onRequestClose={()=>{
        setAlertsMap(prev => {
          let dum = {...prev}
          dum["user_history"] = false
          return dum
      })
      }}
      style={customStyles}
      closeTimeoutMS={200}
    >
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

    </Modal>

    <Modal
      isOpen={alertsMap["bookmark_input"]}
      onRequestClose={()=>{
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
        setShowHighlightButton(false)
        setEditNotes(false)
      }}
      style={customStyles}
      closeTimeoutMS={200}
    >
     {bookmarkType == "notes" ?
    <div style={{margin:"10px 10px 30px 10px"}}>
     <p >Your Notes:</p>
      <div className="wrapper">
        <IonItem>
      <IonTextarea
        placeholder="Type your notes here..."
        autoGrow={true}
        value={textBookmark.notes}
        onIonInput={(e)=>{
          setTextBookmark(prev=>{
              let dum = {...prev}
              dum["notes"] =  e.detail.value
              return dum
          })
        }}
      ></IonTextarea>
    </IonItem>
      </div>
      <p>Selected Text:</p>
      <div className="wrapper">
      <p>
        {textBookmark.text}
      </p>
      </div>
      </div>
     : null} 
    <p style={{margin:"10px"}}>Select the {bookmarkType} folder/collection</p>
    <div className='wrapper'>
    <IonItem>
        <IonInput onIonFocus={()=>{
          setBookmarkInput(prev=>{
            let dum = {...prev}
            dum["radio"] = ""
            return dum
        })
        }} onIonInput={(e)=>{
            setBookmarkInput(prev=>{
                let dum = {...prev}
                dum["radio"] = ""
                dum["text"] =  e.detail.value
                return dum
            })
        }} type="text" placeholder={`New ${bookmarkType} folder`} value={bookmarkInput["text"]}></IonInput>
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
          <>{bookmarkFolder.slice(bookmarkFolder.lastIndexOf("-")+1) === bookmarkType ? <IonItem>
          <IonLabel>{bookmarkFolder.slice(0, bookmarkFolder.lastIndexOf("-"))}</IonLabel>
          <IonRadio slot="end" value={bookmarkFolder} />
          </IonItem> : null}</>
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
              setShowHighlightButton(false)
              setEditNotes(false)
            }}>Cancel</IonButton> 
             {editNotes ? <IonButton onClick={()=>{
              setAlertsMap(prev => {
                  let dum = {...prev}
                  dum["bookmark_input"] = false
                  return dum
              })
              setBookmarksMap((prev)=>{
                let dum = {...prev}
                for (let bookmark of Object.entries(dum)){
                  for (let i=0; i<bookmark[1]['children'].length; i++) {
                    if(bookmark[1]['children'][i].timestamp == textBookmark.timestamp) {
                      bookmark[1]['children'].splice(i,1)
                      break
                    }
                  }
                }
                return dum 
              })
              setBookmarkInput(prev=>{
                let dum = {...prev}
                dum["radio"] = ""
                dum["text"] =  ""
                return dum
              }) 
              setEditNotes(false)
            }}>Delete</IonButton> : null}
            <IonButton onClick={()=>{
                if(!bookmarkInput["radio"] && !bookmarkInput["text"]){
                  console.log(toast)
                  setToast("bookmark_input") 
                  return
                } 
                setAlertsMap(prev => {
                    let dum = {...prev}
                    dum["bookmark_input"] = false
                    return dum
                })
                if(bookmarkType == "bookmarks") {
                  setBookmarksMap((prev)=>{
                    let dum = {...prev}
                    let bookmark_folder_name = bookmarkInput["radio"]
                    if(bookmarkInput["text"]) {
                      bookmark_folder_name = bookmarkInput["text"] + "-bookmarks"
                      dum[bookmark_folder_name] = {"children": [], "isChecked": false}
                    }  
                    dum[bookmark_folder_name]["children"].push({"name": key,  "type": "lecture", "isChecked": false})
                    return dum 
                  })
                } else if(bookmarkType == "highlights"){
                  if(selectedHighlight.folder){
                    setBookmarksMap((prev)=>{
                      let dum = {...prev}
                      for (let bookmark of Object.entries(dum)){
                        for (let i=0; i<bookmark[1]['children'].length; i++) {
                          if(bookmark[1]['children'][i].timestamp == selectedHighlight.timestamp) {
                            bookmark[1]['children'].splice(i,1)
                            break
                          }
                        }
                      }
                      let bookmark_folder_name = bookmarkInput["radio"]
                      if(bookmarkInput["text"]) {
                        bookmark_folder_name = bookmarkInput["text"] + "-highlights"
                        dum[bookmark_folder_name] = {"children": [], "isChecked": false}
                      }
                      dum[bookmark_folder_name]["children"].push(textBookmark)
                      return dum 
                    })
                  }else{
                  let modidfiedTextBookmark = {...textBookmark}
                  modidfiedTextBookmark.color = settings.highlights_color
                  setBookmarksMap((prev)=>{
                    let dum = {...prev}
                    let bookmark_folder_name = bookmarkInput["radio"]
                    if(bookmarkInput["text"]) {
                      bookmark_folder_name = bookmarkInput["text"] + "-highlights"
                      dum[bookmark_folder_name] = {"children": [], "isChecked": false}
                    }
                    dum[bookmark_folder_name]["children"].push(modidfiedTextBookmark)
                    return dum 
                  })
                  setSettings(prev=>{
                    let dum = {...prev}
                    dum["highlights_folder"] = bookmarkInput["radio"]!="" ? bookmarkInput["radio"] : bookmarkInput["text"] + "-highlights"
                    return dum
                  })
                  setShowHighlightButton(false)
                }
                }else if(bookmarkType == "notes"){
                  if(editNotes) {
                    setBookmarksMap((prev)=>{
                      let dum = {...prev}
                      for (let bookmark of Object.entries(dum)){
                        for (let i=0; i<bookmark[1]['children'].length; i++) {
                          if(bookmark[1]['children'][i].timestamp == textBookmark.timestamp) {
                            bookmark[1]['children'].splice(i,1)
                            break
                          }
                        }
                      }
                      let bookmark_folder_name = bookmarkInput["radio"]
                      if(bookmarkInput["text"]) {
                        bookmark_folder_name = bookmarkInput["text"] + "-notes"
                        dum[bookmark_folder_name] = {"children": [], "isChecked": false}
                      }
                      delete textBookmark["color"]
                      dum[bookmark_folder_name]["children"].push(textBookmark)
                      return dum 
                    })
                  }else{
                    setBookmarksMap((prev)=>{
                      let dum = {...prev}
                      let bookmark_folder_name = bookmarkInput["radio"]
                      if(bookmarkInput["text"]) {
                        bookmark_folder_name = bookmarkInput["text"] + "-notes"
                        dum[bookmark_folder_name] = {"children": [], "isChecked": false}
                      }
                      delete textBookmark["color"]
                      dum[bookmark_folder_name]["children"].push(textBookmark)
                      return dum 
                    })
                    setSettings(prev=>{
                      let dum = {...prev}
                      dum["notes_folder"] = bookmarkInput["radio"]!="" ? bookmarkInput["radio"] : bookmarkInput["text"] + "-notes"
                      return dum
                    })
                    setShowHighlightButton(false)
                  }
                  
                }
                setEditNotes(false)

                setBookmarkInput(prev=>{
                  let dum = {...prev}
                  dum["radio"] = ""
                  dum["text"] =  ""
                  return dum
                })
                
              }}>{editNotes || selectedHighlight.folder ? "Save" : "Done"}</IonButton>
      </div>

    </Modal>
    <Modal isOpen={alertsMap["speed"]}
      onRequestClose={()=>{
        setAlertsMap(prev => {
          let dum = {...prev}
          dum["speed"] = false
          return dum
        })
      }}
      style={customStyles}
      closeTimeoutMS={200}>
        <div>
          <div style={{"textAlign":"center", "marginTop":"10px"}}>Audio Speed Rate {audi.current ? `(${audi.current.playbackRate}x)`  : null}</div>
          <IonList>
        {[...["0.5", "0.75", "1", "1.25", "1.5", "1.75", "2"].map(speed=>{
          return(
            <IonItem onClick={()=>{
              if (audi.current) audi.current.playbackRate = speed;
              setAlertsMap(prev => {
                let dum = {...prev}
                dum["speed"] = false
                return dum
              })
            }} style={{"textAlign":"center"}}>
              <IonLabel>{speed}x</IonLabel>
            </IonItem>
          )
        })
      ]}
      </IonList>
      <div style={{textAlign:"center", marginTop:"10px"}}>
        <IonButton onClick={()=>{
          setAlertsMap(prev => {
            let dum = {...prev}
            dum["speed"] = false
            return dum
          })
        }}>
          Cancel
        </IonButton>
      </div>
        </div>

    </Modal>
   
    <IonToast isOpen={toast != "false"} onDidDismiss={()=>{
      setToast("false")
    }} message={toastMessageMap[toast]} duration={2000}></IonToast>
          </IonContent>
          {audioLink != "none" ? <IonFooter>
      <IonToolbar color={settings.theme == "light" ? "light" : "dark"} style={{paddingLeft:"10px", paddingRight:"10px", textAlign:"center"}}>
      <IonRange value={currentTime} onIonChange={(e)=>{
        if (audi.current) {
          audi.current.currentTime = e.detail.value;
          setCurrentTime(e.detail.value)
         } 
      }} min={0} max={duration} style={{paddingLeft:"5px", paddingRight:"5px", marginTop:"-10px", marginBottom:"-10px", "zIndex": "100"}}></IonRange>
      <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
       <div style={{marginRight:"5px"}}>{formatTime(currentTime.toFixed(0))}</div>
       
       <IonButton size='small' style={{"height": "36px", width:"48px"}} onClick={()=>{
        setAlertsMap(prev=>{
          let dum = {...prev}
          dum["speed"] = true
          return dum
        })
       }} >
          <IonIcon icon={speedometerOutline}></IonIcon>
        </IonButton>
       <IonButton size='small' style={{"height": "36px", width:"48px"}}  onClick={()=>{
        if (audi.current) audi.current.currentTime -= 15;
       }} >
          <IonIcon icon={playBackOutline}></IonIcon>
        </IonButton>
        <IonButton size='small' style={{"height": "36px", width:"48px"}}  onClick={()=>{
              if (!play) {
                if (audi.current.duration) {
                 audi.current.play();
                 setPlay(!play);
                } else {
                 setToast("loading_audio")
                }
               }
               else if (play) {
                audi.current.pause();
                setPlay(!play);
               }
        }}>
          <IonIcon icon={!play ? playCircleOutline : pauseCircleOutline }></IonIcon>
        </IonButton>
        <IonButton size='small' style={{"height": "36px", width:"48px"}}  onClick={()=>{
        if (audi.current) audi.current.currentTime += 15;
       }}> 
          <IonIcon icon={playForwardOutline}></IonIcon>
        </IonButton>
        <IonButton size='small' style={{"height": "36px", width:"48px"}}  onClick={()=>{
          const downloadLink = document.getElementById('downloadLink');
          downloadLink.click();
        }} >
          <IonIcon icon={arrowDownCircleOutline}></IonIcon>
        </IonButton>
       
        <div style={{marginLeft:"5px"}}>{audi.current ? ((audi.current.duration && audi.current.duration!="Infinity") ? formatTime(audi.current.duration.toFixed(0)) : "0:00") : "0:00"}</div>
        </div>
      </IonToolbar>
    </IonFooter> : null}
    <audio
    onEnded={() => {
      setPlay(false);  
    }}
    onTimeUpdate={() => {
     setCurrentTime(audi.current.currentTime);
    }}
    ref={audi}
    src={audioLink}
   >
    Your browser does not support the audio element.
   </audio>
   <a id="downloadLink" href={audioLink} target="_blank" download style={{display:"none"}} >Download</a>
  </IonPage>   
  );
};

export default Audio;
