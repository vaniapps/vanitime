import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonDatetime, IonButton,
IonRadioGroup, IonRadio, IonLabel, IonItem, IonCheckbox, IonAlert, IonAccordion, IonAccordionGroup } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory, Switch, Route } from 'react-router-dom';
import {Accordion, AccordionBody, AccordionHeader, AccordionItem} from "react-headless-accordion";
import Tab2 from './ContentPage';
import Tab3 from './Tab3';

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
		
		// useEffect(() => {
		// 	const fetchData = async () => {
		// 		try {
		// 			const booksResponse = await fetch(booksMapPath);
		// 			const lecturesResponse = await fetch(lecturesMapPath);
		// 			const booksData = await booksResponse.json();
		// 			const lecturesData = await lecturesResponse.json();
		// 			console.log("booksData", booksData);
		// 			setBooksMap(booksData);
		// 			setLecturesMap(lecturesData);
		// 		} catch (err) {
		// 			console.log('Error fetching json', err);
		// 		}
		// 	};
		// 	fetchData();
		// }, []);
		// console.log("here", booksMap, lecturesMap);
	
    const [alertsMap, setAlertsMap] = useState({
        "books": false,
        "parts": false,
        "sub_parts": false,
        "audio": false,
        "text": false
    })
    const [bookSelectAlert, setBookSelectAlert] = useState(false)
    const [chapterSelectAlert, setChapterSelectAlert] = useState(false)
    const [currentBook, setCurrentBook] = useState({

        "name": "",
        "part": "",
        "sub_part": "",
        "verse": ""
        
    })

    const [vaniTime, setVaniTime] = useState("00:05")
    const [currentContent, setCurrentContent] = useState([])
    let history = useHistory();

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
        if (contentMode == "random_audio") {
            setCurrentContent(findRandomLecture(lecturesMap,vaniTime));
            console.log(findRandomLecture(lecturesMap,vaniTime));
            setAlertsMap(prev => {
                let dum = {...prev}
                dum["audio"] = true
                return dum
            })
        } else if (contentMode == "random_text") {
            setCurrentContent(findRandomPurports(booksMap,vaniTime));
            setAlertsMap(prev => {
                let dum = {...prev}
                dum["text"] = true
                return dum
            })
        } else if (contentMode == "book_text") {
            setCurrentContent(findNextPurports(booksMap,"SB_9.2.7",vaniTime));
            setAlertsMap(prev => {
                let dum = {...prev}
                dum["text"] = true
                return dum
            })
        }
    }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Vani Time</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent >
        <h1 textAlign="center">Select Vani Time</h1>
    <div style={{textAlign: "center"}}>
      <IonDatetime value={vaniTime} presentation="time" hourCycle="h23" hourValues="0,1,2,3" minuteValues="5,10,15,20,25,30,35,40,45,50,55" onIonChange={(e)=>{
       setVaniTime(e.detail.value);
      }}></IonDatetime>
    </div>
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
            <IonItem color="light">
            <IonLabel>{parentValue.name}</IonLabel>
            <IonCheckbox checked={parentValue.checked} onIonChange={(e) => {
                setLecturesMap(prev => {
                    let dum = {...prev}
                    dum[parentKey]["checked"] = e.detail.checked
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
                <IonCheckbox style={{"marginRight": "20px"}} checked={bookValue.checked} onIonChange={(e) => {
                    setBooksMap(prev=>{
                        let dum = {...prev}
                        dum[bookKey]["checked"] = e.detail.checked
                        for (let part of Object.entries(dum[bookKey]["parts"])) {
                            part[1]["checked"] = e.detail.checked
                            if (part[1]["parts"]){
                                for (let sub_part of Object.entries(part[1]["parts"])) {
                                    sub_part[1]["checked"] = e.detail.checked
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
                    <IonCheckbox style={{"marginRight": "40px"}} checked={partsValue.checked} onIonChange={(e) => {
                        setBooksMap(prev=>{
                            let dum = {...prev}
                            dum[bookKey]["parts"][partsKey]["checked"] = e.detail.checked
                            for (let part of Object.entries(dum[bookKey]["parts"][partsKey]["parts"])) {
                                part[1]["checked"] = e.detail.checked
                            }
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
                                <IonCheckbox style={{"marginRight": "60px"}} checked={subPartsValue.checked} onIonChange={(e) => {
                                    setBooksMap(prev=>{
                                        let dum = {...prev}
                                        dum[bookKey]["parts"][partsKey]["parts"][subPartsKey]["checked"] = e.detail.checked
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
                    <IonCheckbox style={{"marginRight": "40px"}} checked={partsValue.checked} onIonChange={(e) => {
                        setBooksMap(prev=>{
                            let dum = {...prev}
                            dum[bookKey]["parts"][partsKey]["checked"] = e.detail.checked
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


    <IonAlert
    isOpen={alertsMap["sub_parts"]}
    onDidDismiss={() => {
        setAlertsMap(prev => {
            let dum = {...prev}
            dum["sub_parts"] = false
            return dum
        })
    }}
    cssClass="my-custom-class"
    header={"Select a Chapter"}
    inputs={booksMap[currentBook["name"]] && booksMap[currentBook["name"]]['parts'][currentBook["part"]] && Object.entries(booksMap[currentBook["name"]]['parts'][currentBook["part"]]["parts"])[0][1]["parts"] ? Object.entries(booksMap[currentBook["name"]]["parts"][currentBook["part"]]["parts"]).map(([partsKey, partsValue])=> {
        return {
            name: partsValue.name,
            type: "radio",
            label: partsValue.name,
            value: partsKey,
           }
    }): []}
    buttons={[
        {
         text: "Cancel",
         role: "cancel",
         cssClass: "warning",
         handler: () => {},
        },
        {
         text: "Select",
         handler: (res) => {
          setCurrentBook(prev => {
            let dum = {...prev}
            dum["sub_part"] = res
            dum["verse"] = "1"
            return dum
        });

         },
        },
       ]}
   />


    <IonAlert
    isOpen={alertsMap["parts"]}
    onDidDismiss={() => {
        setAlertsMap(prevAlerts => {
            let dumAlerts = {...prevAlerts}
            dumAlerts["parts"] = false
            return dumAlerts
        })
    }}
    cssClass="my-custom-class"
    header={currentBook["name"]}
    inputs={booksMap[currentBook["name"]] ? Object.entries(booksMap[currentBook["name"]]["parts"]).map(([partsKey, partsValue])=> {
        return {
            name: partsValue.name,
            type: "radio",
            label: partsValue.name,
            value: partsKey,
           }
    }): []}
    buttons={[
        {
         text: "Cancel",
         role: "cancel",
         cssClass: "warning",
         handler: () => {},
        },
        {
         text: "Next/Select",
         handler: (res) => {
         console.log(currentBook)

        if(Object.entries(booksMap[currentBook["name"]]["parts"][res]["parts"])[0][1]["parts"]){
            setCurrentBook(prev => {
                let dum = {...prev}
                dum["part"] = res
                console.log(res)
                return dum
            });
            setAlertsMap(prev => {
            let dum = {...prev}
            dum["sub_parts"] = true
            return dum
        })
        }
        else setCurrentBook(prev => {
            let dum = {...prev}
            dum["part"] = res
            dum["sub_part"] = ""
            dum["verse"] = "1"
            return dum
        });
         },
        },
       ]}
   />

<IonAlert
    isOpen={alertsMap["books"]}
    onDidDismiss={() => setAlertsMap(prev => {
        let dum = {...prev}
        dum["books"] = false
        return dum
    })}
    cssClass="my-custom-class"
    header={"Select Book"}
    inputs={Object.entries(booksMap).map(([bookKey, bookValue])=> {
        return {
            name: bookValue.name,
            type: "radio",
            label: bookValue.name,
            value: bookKey,
           }
    })}
    buttons={[
     {
      text: "Cancel",
      role: "cancel",
      cssClass: "warning",
      handler: () => {},
     },
     {
      text: "Next",
      handler: (res) => {
        console.log(res)
        setCurrentBook(prev => {
            let dum = {...prev}
            dum["name"] = res
            return dum
        });
        setAlertsMap(prev => {
            let dum = {...prev}
            dum["parts"] = true
            return dum
        })
      },
     },
    ]}
   />

<IonAlert
    isOpen={alertsMap["books"]}
    onDidDismiss={() => setAlertsMap(prev => {
        let dum = {...prev}
        dum["books"] = false
        return dum
    })}
    cssClass="my-custom-class"
    header={"Select Book"}
    inputs={Object.entries(booksMap).map(([bookKey, bookValue])=> {
        return {
            name: bookValue.name,
            type: "radio",
            label: bookValue.name,
            value: bookKey,
           }
    })}
    buttons={[
     {
      text: "Cancel",
      role: "cancel",
      cssClass: "warning",
      handler: () => {},
     },
     {
      text: "Next",
      handler: (res) => {
        console.log(res)
        setCurrentBook(prev => {
            let dum = {...prev}
            dum["name"] = res
            return dum
        });
        setAlertsMap(prev => {
            let dum = {...prev}
            dum["parts"] = true
            return dum
        })
      },
     },
    ]}
   />

<IonAlert
    isOpen={alertsMap["audio"]}
    onDidDismiss={() => setAlertsMap(prev => {
        let dum = {...prev}
        dum["audio"] = false
        return dum
    })}
    cssClass="my-custom-class"
    header={"Proceed with the below lecture?"}
    message={currentContent[1]}
    buttons={[
     {
      text: "Find a differnt one",
      cssClass: "warning",
      handler: getContent,
     },
     {
      text: "Proceed",
      handler: () => {
        history.push("/lecture/"+ currentContent[0])
      },
     },
    ]}
   />

<IonAlert
    isOpen={alertsMap["text"]}
    onDidDismiss={() => setAlertsMap(prev => {
        let dum = {...prev}
        dum["text"] = false
        return dum
    })}
    cssClass="my-custom-class"
    header={"Proceed with the below purports?"}
    message={currentContent.map(purport => {
        return purport[0]+" "
    })}
    buttons={[
     {
      text: "Find a differnt one",
      cssClass: "warning",
      handler: getContent,
     },
     {
      text: "Proceed",
      handler: (res) => {
        history.push("/purports/"+ currentContent[0])
      },
     },
    ]}
   />

      </IonContent>
    </IonPage>


  );
};

export default Tab1;
