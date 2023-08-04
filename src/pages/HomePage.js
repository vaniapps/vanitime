import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonDatetime, IonButton,
IonRadioGroup, IonRadio, IonLabel, IonItem, IonCheckbox, IonAlert, IonAccordion, 
IonAccordionGroup, IonRouterOutlet, IonModal, IonToast } from '@ionic/react';
import { useState, useRef } from 'react';
import { useHistory, Switch, Route, useLocation, useRouteMatch } from 'react-router-dom';
import {Accordion, AccordionBody, AccordionHeader, AccordionItem} from "react-headless-accordion";
import Text from './TextPage';
import Audio from './AudioPage';
import '../styles.css';

import booksMapData from "../data/booksMap.json";
import lecturesMapData from "../data/lecturesMap.json";
import findRandomLecture from './scripts/findRandomLecture';
import findRandomPurports from './scripts/findRandomPurports';
import findNextPurports from './scripts/findNextPurports';
function Tab1(){
	
    const [contentMode, setContentMode] = useState("random_audio");
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
    
    const [booksMap, setBooksMap] = useState(booksMapData);
    const [lecturesMap, setLecturesMap] = useState(lecturesMapData);
	
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
        let [currentBook, setCurrentBook] = useState({
            "name": "",
            "part": "",
            "sub_part": "",
            "verse": ""
        })
    const [vaniTime, setVaniTime] = useState("00:05")
    const [currentContent, setCurrentContent] = useState([])
    let history = useHistory();
    let { path, url } = useRouteMatch();
    let location = useLocation();
    const modal = useRef(null);
    function modalDismiss() {
        modal.current?.dismiss();
    }
    const [wordsPerMin, setWordsPerMin] = useState(50)

    // function findRandomLecture(test) {
    //   return ["761017_-_Lecture_and_Conversation_at_Rotary_Club_-_Chandigarh", "Let Krishna Speak for Himself", 58]
    // }

    // function findRandomPurports() {
		// 	return [["BG_9.27", "Bhagavad Gita 9.27", 10], ["BG_9.28", "Bhagavad Gita 9.28", 5], ["BG_9.28", "Bhagavad Gita 9.29", 15]]
    // }

    // function findNextPurports() {
		// 	return [["BG_9.27", "Bhagavad Gita 9.27", 10], ["BG_9.28", "Bhagavad Gita 9.28", 5], ["BG_9.28", "Bhagavad Gita 9.29", 15]]
    // }

    function getContent() {
        console.log(contentMode)
        if (contentMode == "random_audio") {
            setCurrentContent(findRandomLecture(lecturesMap,vaniTime));
            console.log(findRandomLecture(lecturesMap,vaniTime));
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
    <>
   


     <IonRouterOutlet>
     <Route exact path={path}>
     <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Vani Time</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent >
       
        <h1 textAlign="center">Select Vani Time</h1>
    
      <IonDatetime style={{display:"flex", justifyContent: "center"}} size='cover' value={vaniTime} presentation="time" hourCycle="h23" hourValues="0,1,2,3" minuteValues="5,10,15,20,25,30,35,40,45,50,55" onIonChange={(e)=>{
       setVaniTime(e.detail.value);
      }}></IonDatetime>
   
      <IonRadioGroup
    value={contentMode}
    onIonChange={(e) => {
    setContentMode(e.detail.value);
    }}
   >
    {Object.entries(contentModesMap).map(([modeKey, modeValue])=>{
        return(
            <IonItem>
            <IonLabel>{modeValue.name}</IonLabel>
            <IonRadio slot="end" value={modeKey} />
           </IonItem>
        );
    })}
   </IonRadioGroup>
   <div style={{ textAlign: "center", marginTop:"30px", marginBottom:"30px" }}>
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
                <IonLabel style={{"marginLeft": "20px"}}>{bookValue.name}</IonLabel>
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
                    <IonLabel style={{"marginLeft": "40px"}}>{partsValue.name}</IonLabel>
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
                                        console.log(count, Object.entries(dum[bookKey]["parts"][partsKey]["parts"]).length)
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
        {currentBook["verse"] ? <p>Current Book: {currentBook.name} {currentBook.part} {currentBook.sub_part} {currentBook.verse} </p> : <p>Please select a Book</p>}
        <div style={{ textAlign: "center", marginTop:"30px", marginBottom:"30px" }}><IonButton onClick={e=> setAlertsMap(prev => {
            let dum = {...prev}
            dum["books"] = true
            return dum
        })}>{currentBook["verse"] ? "Change Book": "Select Book"}</IonButton></div>
    </> : null}




<IonModal id="example-modal" ref={modal} isOpen={alertsMap["books"] || alertsMap["parts"] || alertsMap["sub_parts"]} onDidDismiss={()=>{
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
        }}>
             <p style={{textAlign:"center"}}>Selct the Book</p>
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
                            dum["verse"] = "1"
                            return dum
                        });
                        setTempCurrentBook(prev => {
                            let dum = {...prev}
                            dum["verse"] = "1"
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
                                dum["verse"] = "1"
                                return dum
                            });

                            setTempCurrentBook(prev => {
                                let dum = {...prev}
                                dum["sub_part"] = ""
                                dum["verse"] = "1"
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
        </IonModal>



    <IonModal id="example-modal" ref={modal} isOpen={alertsMap["audio"]} onDidDismiss={()=>{
                    setAlertsMap(prev => {
                        let dum = {...prev}
                        dum["audio"] = false
                        return dum
                    })
        }}>
        
            <p style={{marginLeft:"10px"}}>Proceed with the below lecture?</p>
            <div className="wrapper">
            <div style={{marginBottom:"10px"}}>
                <IonLabel>Title: {currentContent[1]}</IonLabel>
              </div>
              <div style={{marginBottom:"10px"}}>
                <IonLabel>Duration: {currentContent[2]} Minutes</IonLabel>
              </div>
              <div style={{marginBottom:"10px"}}>
                <IonLabel>Details: {currentContent[0]}</IonLabel>
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
                history.push(path+"/lecture/"+ currentContent[0])
            }}>Proceed</IonButton>
            </div>
         
        </IonModal>

        <IonModal id="example-modal" ref={modal} isOpen={alertsMap["text"]} onDidDismiss={()=>{
                    setAlertsMap(prev => {
                        let dum = {...prev}
                        dum["text"] = false
                        return dum
                    })
        }}>
        
            <p style={{marginLeft:"10px"}}>Proceed with the below verses?</p>
            <div className="wrapper">
              {currentContent.map(verse => {
                return (
                    <div style={{textAlign:"center"}}>
                        <IonLabel>{verse[0]} ({verse[2]/wordsPerMin} Minutes)</IonLabel>
                    </div>
                )
              })}
              <div style={{textAlign:"center"}}>
                    <IonLabel>Total time: ({(()=>{
                        let totalTime = 0
                        for (let verse of currentContent) {
                            totalTime += verse[2]/wordsPerMin
                        }
                        return totalTime
                    })()} Minutes)</IonLabel>
                </div>
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
                history.push(path+"/purports/"+ verses)
            }}>Proceed</IonButton>
            </div>
         
        </IonModal>
        <IonToast isOpen={toast != "false"} message={toastMessageMap[toast]} duration={5000}></IonToast>

      </IonContent>
    </IonPage>
     </Route>
     <Route path={`${path}/lecture/:key`}>
      <Audio />
     </Route>
     <Route path={`${path}/purports/:key`}>
      <Text />
     </Route>
     </IonRouterOutlet>
    </>


  );
};

export default Tab1;
