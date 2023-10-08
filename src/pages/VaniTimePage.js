import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonDatetime, IonButton,
IonRadioGroup, IonRadio, IonLabel, IonItem, IonCheckbox, IonAlert, IonAccordion, 
IonAccordionGroup, IonRouterOutlet, IonModal, IonToast, IonSegment, IonSegmentButton, IonIcon,
 IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonNote, isPlatform, IonButtons, IonInput } from '@ionic/react';
import { useState, useRef } from 'react';
import {  settingsOutline, menuOutline } from 'ionicons/icons';
import { useHistory, Switch, Route, useLocation, useRouteMatch } from 'react-router-dom';
import {Accordion, AccordionBody, AccordionHeader, AccordionItem} from "react-headless-accordion";
import Text from './TextPage';
import Audio from './AudioPage';
import '../styles.css';
import Modal from 'react-modal';

import findRandomLecture from '../scripts/findRandomLecture';
import findRandomPurports from '../scripts/findRandomPurports';
import findNextPurports from '../scripts/findNextPurports';
import { formatVaniTime } from "../scripts/durationToMinutes";
import { useContext } from 'react';
import { Books, ContentMode, CurrentBook, Lectures, Settings, VaniTime, WordsPerMin } from '../context';
import { chevronDownSharp } from 'ionicons/icons';
import { color } from 'highcharts';

  
function VaniTimePage(){
	
    const [contentMode, setContentMode] = useContext(ContentMode)
    const [contentModesMap, setContentModesMap] = useState({
        "random_audio": {
            "name": "Lecture",
            "button": "Get a Lecture"
        },
        "random_text": {
            "name": "Purports",
            "button": "Get Random Purports"
        },
        "book_text": {
            "name": "Book",
            "button": "Get Purports"
        }
    });
    
    const [booksMap, setBooksMap] = useContext(Books)
    const [lecturesMap, setLecturesMap] = useContext(Lectures)
	
    const [alertsMap, setAlertsMap] = useState({
        "books": false,
        "parts": false,
        "sub_parts": false,
        "audio": false,
        "text": false
    })
    const [toast, setToast] = useState("false")
    const [toastMessageMap, setToastMessageMap] = useState({
        "select_book": "Please select a book"
    })
    const [tempCurrentBook, setTempCurrentBook] = useState({
        "name": "",
        "part": "",
        "sub_part": "",
        "verse": ""
    })
    let [currentBook, setCurrentBook] = useContext(CurrentBook)
    const [vaniTime, setVaniTime] = useContext(VaniTime)
    const [currentContent, setCurrentContent] = useState([])
    let history = useHistory();
    let { path, url } = useRouteMatch();
    let location = useLocation();
    const modal = useRef(null);
    function modalDismiss() {
        modal.current?.dismiss();
    }
    const [wordsPerMin, setWordsPerMin] = useContext(WordsPerMin)
    const [settings, setSettings] = useContext(Settings)
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
      }
    function getContent() {
        if (contentMode == "random_audio") {
            setCurrentContent(findRandomLecture(lecturesMap,vaniTime));
            setAlertsMap(prev => {
                let dum = {...prev}
                dum["audio"] = true
                return dum
            })
        } else if (contentMode == "random_text") {
            setCurrentContent(findRandomPurports(booksMap,vaniTime,wordsPerMin));
            setAlertsMap(prev => {
                let dum = {...prev}
                dum["text"] = true
                return dum
            })
        } else if (contentMode == "book_text") {
            if(currentBook["verse"] === "") setToast("select_book")
            else{
            setCurrentContent(findNextPurports(booksMap,currentBook,vaniTime,wordsPerMin));
            setAlertsMap(prev => {
                let dum = {...prev}
                dum["text"] = true
                return dum
            })
        }
        }
    }

    console.log(alertsMap)


  return (
     <IonPage>
      <IonHeader>
        <IonToolbar>
        <IonButtons slot='start'>
                <IonButton>
                    <IonIcon icon={menuOutline}></IonIcon>
                </IonButton>
            </IonButtons>
            <IonSegment  onIonChange={(e)=>{
                setContentMode(e.detail.value);
            }} value={contentMode}>

            {Object.entries(contentModesMap).map(([modeKey, modeValue])=>{
                return(
                    <IonSegmentButton value={modeKey}>
                        <IonLabel>{modeValue.name}</IonLabel>
                </IonSegmentButton>
                );
            })}
            </IonSegment>
            <IonButtons slot='end'>
                <IonButton onClick={()=>history.push("/setting")}>
                    <IonIcon icon={settingsOutline}></IonIcon>
                </IonButton>
            </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent >
                <div style={isPlatform("desktop") ? {display:"flex", justifyContent:"center"} : {}}>
                <div style={isPlatform("desktop") ? {minWidth:"420px"} : {}}>
       
        <div style={{marginTop:"10px", marginLeft:"15px", fontSize:"20px"}}>Scroll Vani Time: {formatVaniTime(vaniTime)}</div>
    
      <IonDatetime color={"primary"} style={{display:"flex", justifyContent: "center"}} size='cover' value={vaniTime} presentation="time" hourCycle="h23" hourValues="0,1,2,3" minuteValues="5,10,15,20,25,30,35,40,45,50,55" onIonChange={(e)=>{
       setVaniTime(e.detail.value);
      }}>
      </IonDatetime>
   
   <div style={{ textAlign: "center", marginTop:"0px", marginBottom:"30px" }}>
      <IonButton onClick={getContent}>{contentModesMap[contentMode]["button"]}</IonButton>
   </div>

   {contentMode == "random_audio" ? <>      
    {Object.entries(lecturesMap).map(([parentKey, parentValue]) => {
        return(
            <IonItem>
            <IonLabel>{parentValue.name}</IonLabel>
            <IonCheckbox checked={parentValue.checked} onIonChange={(e) => {
                setLecturesMap(prev => {
                    let dum = {...prev}
                    dum[parentKey]["checked"] = e.detail.checked ? "true" : "false"
                    return dum
                })
            }} />
            </IonItem>
        )
    })
    }
    </> : null}
    {contentMode == "random_text" ? <>
    <Accordion style={{"display": "block", "width": "100%", "textAlign": "center"}}>
    
    {Object.entries(booksMap).map(([bookKey, bookValue]) => {
        return(
            
            <AccordionItem>
               
            <AccordionHeader as={"div"}>
              <div style={{"width": "100%", "display": "flex", "justifyContent": "space-between", "marginBottom": "20px"}}>
                <IonLabel style={{"marginLeft": "20px"}}><IonIcon icon={chevronDownSharp}></IonIcon> {bookValue.name} </IonLabel>
                
                <IonCheckbox indeterminate={bookValue.checked === "partial"} style={{"marginRight": "20px"}} checked={bookValue.checked === "true"} onIonChange={(e) => {
                    setBooksMap(prev=>{
                        let dum = {...prev}
                        dum[bookKey]["checked"] = e.detail.checked ? "true" : "false"
                        for (let part of Object.entries(dum[bookKey]["parts"])) {
                            part[1]["checked"] = e.detail.checked ? "true" : "false"
                            if (part[1]["parts"]){
                                for (let sub_part of Object.entries(part[1]["parts"])) {
                                    sub_part[1]["checked"] = e.detail.checked ? "true" : "false"
                                }
                            }
                        }
                        return dum   
                    })
                }} />
                </div>
                
            </AccordionHeader>
           
            <AccordionBody>
            
        
        {Object.entries(bookValue.parts).map(([partsKey, partsValue]) => {
                return(
                <>{Object.entries(partsValue.parts)[0][1]["parts"] ?  <AccordionItem>
                     <AccordionHeader as={"div"}>
                     <div style={{"width": "100%", "display": "flex", "justifyContent": "space-between", "marginBottom": "20px"}}>
                    <IonLabel style={{"marginLeft": "40px"}}><IonIcon icon={chevronDownSharp}></IonIcon>{partsValue.name}</IonLabel>
                    <IonCheckbox indeterminate={partsValue.checked === "partial"} style={{"marginRight": "40px"}} checked={partsValue.checked === "true"} onIonChange={(e) => {
                        setBooksMap(prev=>{
                            let dum = {...prev}
                            dum[bookKey]["parts"][partsKey]["checked"] = e.detail.checked ? "true" : "false"
                            for (let part of Object.entries(dum[bookKey]["parts"][partsKey]["parts"])) {
                                part[1]["checked"] = e.detail.checked ? "true" : "false"
                            }
                            let count = 0;
                            for (let part of Object.entries(dum[bookKey]["parts"])){
                                if (part[1]["checked"] === "true") count++
                            }
                            if(count === Object.entries(dum[bookKey]["parts"]).length) dum[bookKey]["checked"] = "true"
                            else if (count === 0) dum[bookKey]["checked"] = "false"
                            else dum[bookKey]["checked"] = "partial"
                            return dum   
                        })
                    }} />
                    </div>
                        </AccordionHeader>
                        <AccordionBody>
                    {Object.entries(partsValue.parts).map(([subPartsKey, subPartsValue]) => {
                        return (
                            <div style={{"width": "100%", "display": "flex", "justifyContent": "space-between", "marginBottom": "20px"}}>
                                <IonLabel style={{"marginLeft": "60px"}}>{subPartsValue.name}</IonLabel>
                                <IonCheckbox style={{"marginRight": "60px"}} checked={subPartsValue.checked === "true"} onIonChange={(e) => {
                                    setBooksMap(prev=>{
                                        let dum = {...prev}
                                        dum[bookKey]["parts"][partsKey]["parts"][subPartsKey]["checked"] = e.detail.checked ? "true" : "false"
                                        let count = 0;
                                        for (let part of Object.entries(dum[bookKey]["parts"][partsKey]["parts"])){
                                            if (part[1]["checked"] === "true") count++
                                        }
                                        if(count === Object.entries(dum[bookKey]["parts"][partsKey]["parts"]).length) dum[bookKey]["parts"][partsKey]["checked"] = "true"
                                        else if (count === 0) dum[bookKey]["parts"][partsKey]["checked"] = "false"
                                        else dum[bookKey]["parts"][partsKey]["checked"] = "partial"
                                        count = 0;
                                        for (let part of Object.entries(dum[bookKey]["parts"])){
                                            if (part[1]["checked"] === "true") count++
                                        }
                                        if(count === Object.entries(dum[bookKey]["parts"]).length) dum[bookKey]["checked"] = "true"
                                        else if (count === 0) dum[bookKey]["checked"] = "false"
                                        else dum[bookKey]["checked"] = "partial"
                                        return dum   
                                    })
                                }} />
                            </div>
                        )
                    })}
                    </AccordionBody>
                </AccordionItem>
                    : <div style={{"width": "100%", "display": "flex", "justifyContent": "space-between", "marginBottom": "20px"}}>
                    <IonLabel style={{"marginLeft": "40px"}}>{partsValue.name}</IonLabel>
                    <IonCheckbox style={{"marginRight": "40px"}} checked={partsValue.checked === "true"} onIonChange={(e) => {
                        setBooksMap(prev=>{
                            let dum = {...prev}
                            dum[bookKey]["parts"][partsKey]["checked"] = e.detail.checked ? "true" : "false"
                            let count = 0;
                            for (let part of Object.entries(dum[bookKey]["parts"])){
                                if (part[1]["checked"] === "true") count++
                            }
                            if(count === Object.entries(dum[bookKey]["parts"]).length) dum[bookKey]["checked"] = "true"
                            else if (count === 0) dum[bookKey]["checked"] = "false"
                            else dum[bookKey]["checked"] = "partial"
                            return dum   
                        })
                    }} />
                    </div>}</>
                )
            })
        }
            
            </AccordionBody>
            </AccordionItem>
        )
    })
    }
    </Accordion>
    </> : null}

    {contentMode == "book_text" ? <>
        {currentBook.verse ? <IonCard onClick={()=>{setAlertsMap(prev => {
            let dum = {...prev}
            dum["books"] = true
            return dum
        })
        }}>
            <IonCardHeader>
                <IonCardTitle>{currentBook.name=="OB" ? booksMap[currentBook.name]["parts"][currentBook.part]["name"] : booksMap[currentBook.name]["name"]}</IonCardTitle>
                <IonCardSubtitle>Current Book</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
                <div style = {{textAlign:"center"}}>
                {currentBook.name=="BG" ? <>Chapter: {currentBook.part} | Verse: {currentBook.verse}</> : null}
                {currentBook.name=="SB" ? <>Canto: {currentBook.part} | Chapter: {currentBook.sub_part} | Verse: {currentBook.verse}</> : null}
                {currentBook.name=="CC" ? <>Lila: {currentBook.part} | Chapter: {currentBook.sub_part} | Verse: {currentBook.verse}</> : null}
                {currentBook.name=="OB" ? <>Chapter: {currentBook.verse.replace(/_/g, " ")}</> : null}
                </div>
            </IonCardContent>
        </IonCard> : <IonCard>
            <IonCardContent style={{textAlign:"center"}}>
                <IonButton onClick={()=>{setAlertsMap(prev => {
                        let dum = {...prev}
                        dum["books"] = true
                        return dum
                    })
                }}>Select Book</IonButton>
            </IonCardContent>
        </IonCard> }
    </> : null}

    </div>
    </div>



    <Modal
      isOpen={alertsMap["books"] || alertsMap["parts"] || alertsMap["sub_parts"]}
      onRequestClose={()=>{
        setTempCurrentBook({
            "name": "",
            "part": "",
            "sub_part": "",
            "verse": ""
        })
        setAlertsMap(prev => {
            let dum = {...prev}
            dum["sub_parts"] = false
            dum["parts"] = false
            dum["books"] = false
            return dum
        })
      }}
      style={customStyles}
      closeTimeoutMS={200}
    >
     <p style={{textAlign:"center"}}>Select the Book</p>
        <div className="wrapper">
           

            {(alertsMap["sub_parts"] && booksMap[tempCurrentBook["name"]] && booksMap[tempCurrentBook["name"]]['parts'][tempCurrentBook["part"]] && Object.entries(booksMap[tempCurrentBook["name"]]['parts'][tempCurrentBook["part"]]["parts"])[0][1]["parts"]) ? <IonRadioGroup
                value={tempCurrentBook["sub_part"]}
                onIonChange={(e) => {
                    setTempCurrentBook(prev => {
                        let dum = {...prev}
                        dum["sub_part"] = e.detail.value
                        return dum
                    });
                }}
            >
                {Object.entries(booksMap[tempCurrentBook["name"]]["parts"][tempCurrentBook["part"]]["parts"]).map(([subPartKey, subPartValue])=> {
                    return(
                        <IonItem>
                        <IonLabel>{subPartValue.name}</IonLabel>
                        <IonRadio slot="end" value={subPartKey} />
                    </IonItem>
                    );
                })} </IonRadioGroup> : <>{(alertsMap["parts"] && tempCurrentBook["name"]) ? <IonRadioGroup
                value={tempCurrentBook["part"]}
                onIonChange={(e) => {
                    setTempCurrentBook(prev => {
                        let dum = {...prev}
                        dum["part"] = e.detail.value
                        return dum
                    });
                }}
            >
                {Object.entries(booksMap[tempCurrentBook["name"]]["parts"]).map(([partKey, partValue])=> {
                    return(
                        <IonItem>
                        <IonLabel>{partValue.name}</IonLabel>
                        <IonRadio slot="end" value={partKey} />
                    </IonItem>
                    );
                })}
            </IonRadioGroup> : <>{alertsMap["books"] ? <IonRadioGroup
                value={tempCurrentBook["name"]}
                onIonChange={(e) => {
                    setTempCurrentBook(prev => {
                        let dum = {...prev}
                        dum["name"] = e.detail.value
                        return dum
                    });
                }}
            >
                {Object.entries(booksMap).map(([bookKey, bookValue])=> {
                    return(
                        <IonItem>
                        <IonLabel>{bookValue.name}</IonLabel>
                        <IonRadio slot="end" value={bookKey} />
                    </IonItem>
                    );
                })}
            </IonRadioGroup>: null}</>}</>}
            </div>
            <div style={{display:"flex", justifyContent:"space-evenly", marginTop:"10px"}}>
            <IonButton onClick={()=>{
                if(alertsMap["sub_parts"]) {
                    setAlertsMap(prev => {
                        let dum = {...prev}
                        dum["sub_parts"] = false
                        return dum
                    })
                }
                else if(alertsMap["parts"]) {
                    setAlertsMap(prev => {
                        let dum = {...prev}
                        dum["parts"] = false
                        return dum
                    })
                }
                else if(alertsMap["books"]) {
                    setTempCurrentBook({
                        "name": "",
                        "part": "",
                        "sub_part": "",
                        "verse": ""
                    })
                    setAlertsMap(prev => {
                        let dum = {...prev}
                        dum["books"] = false
                        return dum
                    })
                }
            }}>Back</IonButton>
            <IonButton onClick={()=>{
                if(alertsMap['sub_parts']) {
                    if(tempCurrentBook["sub_part"] === "") {
                        setToast("select_book")
                    }else {
                        setCurrentBook(prev => {
                            let dum = {...tempCurrentBook}
                            dum["verse"] = Object.keys(booksMap[dum["name"]]["parts"][dum["part"]]["parts"][dum["sub_part"]]["parts"])[0].replace("_", "")
                            return dum
                        });
                        setTempCurrentBook(prev => {
                            let dum = {...prev}
                            dum["verse"] = Object.keys(booksMap[dum["name"]]["parts"][dum["part"]]["parts"][dum["sub_part"]]["parts"])[0].replace("_", "")
                            return dum
                        });
                        setAlertsMap(prev => {
                            let dum = {...prev}
                            dum["sub_parts"] = false
                            dum["parts"] = false
                            dum["books"] = false
                            return dum
                        })
                    }
                } else if(alertsMap['parts']){
                    if(tempCurrentBook["part"] === ""){
                        setToast("select_book")
                    } else {
                        if(Object.entries(booksMap[tempCurrentBook["name"]]["parts"][tempCurrentBook["part"]]["parts"])[0][1]["parts"]){
                            setAlertsMap(prev => {
                                let dum = {...prev}
                                dum["sub_parts"] = true
                                return dum
                            })
                        }else{
                            setCurrentBook(prev => {
                                let dum = {...tempCurrentBook}
                                dum["sub_part"] = ""
                                dum["verse"] = Object.keys(booksMap[dum["name"]]["parts"][dum["part"]]["parts"])[0].replace("_", "")
                                return dum
                            });

                            setTempCurrentBook(prev => {
                                let dum = {...prev}
                                dum["sub_part"] = ""
                                dum["verse"] = Object.keys(booksMap[dum["name"]]["parts"][dum["part"]]["parts"])[0].replace("_", "")
                                return dum
                            });
                            
                            setAlertsMap(prev => {
                                let dum = {...prev}
                                dum["parts"] = false
                                dum["books"] = false
                                return dum
                            })
                        }
                    }
                }
                else if(alertsMap['books']){
                    if(tempCurrentBook["name"] === ""){
                        setToast("select_book")
                    } else {
                        setAlertsMap(prev => {
                            let dum = {...prev}
                            dum["parts"] = true
                            return dum
                        })
                    }
                }
                
            }}>Next</IonButton>
            </div>
        </Modal>


      <Modal
        isOpen={alertsMap["audio"]}
        onRequestClose={()=>{
            setAlertsMap(prev => {
                let dum = {...prev}
                dum["audio"] = false
                return dum
            })
        }}
        style={customStyles}
        closeTimeoutMS={200}
      >
        
        <div style={{textAlign:"center", marginTop:"10px", marginBottom:"10px"}}>Proceed with the below Lecture?</div>
            <div className="wrapper">
            <div style={{marginBottom:"10px"}}>
                <IonLabel>Title: {currentContent[1]}</IonLabel>
              </div>
              <div style={{marginBottom:"10px"}}>
                <IonLabel>Duration: {currentContent[2]} Minutes</IonLabel>
              </div>
              <div style={{marginBottom:"10px"}}>
                <IonLabel>Details: {`${currentContent[0]}`.replace(/_/g, " ")}</IonLabel>
              </div>
              </div>
            <div style={{display:"flex", justifyContent:"space-evenly"}}>
            <IonButton onClick={()=>{
                setCurrentContent(findRandomLecture(lecturesMap,vaniTime))
            }}>Try again</IonButton>
            <IonButton onClick={()=>{
                 setAlertsMap(prev => {
                    let dum = {...prev}
                    dum["audio"] = false
                    return dum
                })
                setTimeout(()=>{
                    history.push("/lecture/"+ currentContent[0])
                },200)
               
            }}>Proceed</IonButton>
            </div>
         
        </Modal>

        <Modal
      isOpen={alertsMap["text"]}
      onRequestClose={()=>{
        setAlertsMap(prev => {
            let dum = {...prev}
            dum["text"] = false
            return dum
        })
      }}
      style={customStyles}
      closeTimeoutMS={200}
    >
        <div style={{textAlign:"center", margin:"10px"}}>Proceed with the below Purports?</div>
            <div className="wrapper">
              {currentContent.map(verse => {
                return (
                    <IonItem>
                        <IonLabel>{`${verse[0]}`.replace(/_/g, " ")} </IonLabel>
                        <IonNote>{Math.ceil(verse[2]/wordsPerMin)} Min</IonNote>
                    </IonItem>
                )
              })}
              <IonItem style={{textAlign:"center"}} lines='none'>
                    <IonLabel>Total time: {(()=>{
                        let totalTime = 0
                        for (let verse of currentContent) {
                            totalTime += Math.round(verse[2]/wordsPerMin)
                        }
                        return totalTime
                    })()} Minutes</IonLabel>
                </IonItem>
                </div>
            <div style={{display:"flex", justifyContent:"space-evenly", marginTop:"10px"}}>
            {contentMode === "random_text" ? <IonButton onClick={()=>{
                setCurrentContent(findRandomPurports(booksMap,vaniTime,wordsPerMin))
            }}>Try again</IonButton> : null}
            <IonButton onClick={()=>{
                 setAlertsMap(prev => {
                    let dum = {...prev}
                    dum["text"] = false
                    return dum
                })
                let verses=currentContent[0][0]
                for (let i=1; i<currentContent.length; i++) {
                    verses+=","+currentContent[i][0]
                }
                setTimeout(()=>{
                    history.push("/purports/"+ verses)
                },200)
               
            }}>Proceed</IonButton>
            </div>
            <div style={{margin:"5px 5px 0 5px", fontSize:"10px"}}>*You can change your reading speed in settings</div>
        </Modal>
        <IonToast onDidDismiss={()=>{setToast("false")}} isOpen={toast != "false"} message={toastMessageMap[toast]} duration={2000}></IonToast>

      </IonContent>
    </IonPage>



  );
};

export default VaniTimePage;
