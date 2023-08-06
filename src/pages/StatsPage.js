import { IonPage, IonHeader, IonToolbar, IonSegment, IonSegmentButton, IonLabel, IonContent,
IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon,
 IonPopover, IonList, IonItem, IonDatetime, IonRouterOutlet, IonRange, IonModal, IonInput,
IonToast } from '@ionic/react';
import { chevronBackCircle, chevronDownOutline } from 'ionicons/icons';
import { useContext, useEffect, useState, useRef } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { useHistory, Switch, Route, useLocation, useRouteMatch } from 'react-router-dom';
import { UserHistory, WordsPerMin } from '../context';
import { useLocal } from '../lshooks';
import '../styles.css';

function Stats(){
    const [viewRange, setViewRange] = useState("Today")
    const [userHistory, setUserHistory] = useContext(UserHistory)
    const [dayList, setDayList] = useState([])
    const [weekList, setWeekList] = useState([]);
    const [monthList, setMonthList] = useState([]);
    const [yearList, setYearList] = useState([]);
    const [currentList, setCurrentList] = useState([]);
    const [currentMode, setCurrentMode] = useState("all")
    const [wordsPerMin, setWordsPerMin] = useContext(WordsPerMin)
    const modal = useRef(null);
    function modalDismiss() {
        modal.current?.dismiss();
    }
    const [toast, setToast] = useState("false")
    const [toastMessageMap, setToastMessageMap] = useState({
        "input": "Please give the inputs"
    })
   
    const [goal, setGoal] = useLocal("goal", {
        "books" : {
                    "day": -1,
                    "week": -1,
                    "month": -1
                },
        "lectures": {
            "day": -1,
            "week": -1,
            "month": -1
        }
    })
    const [tempGoal, setTempGoal] = useState({
        "books" : {
            "day": -1,
            "week": -1,
            "month": -1
        },
        "lectures": {
            "day": -1,
            "week": -1,
            "month": -1
        }
    })
    const [currentGoal, setCurrentGoal] = useState({
        "day": 0,
        "week": 0,
        "month": 0,
    })
    let { path, url } = useRouteMatch();
    let history = useHistory();
    
    
   
    function formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${day}-${month}-${year}`;
    }
    useEffect(()=>{
        
        // Find the oldest date
        const dates = Object.keys(userHistory);
        const oldestDate = new Date(Math.min(...dates.map(date => new Date(date.split("-").reverse().join("-")))));
        console.log(oldestDate)
        // Generate dayList, weekList, monthList, and yearList
        const dayList = [];
        const weekList = [];
        const monthList = [];
        const yearList = [];
        
        
        
        const currentDate = new Date(oldestDate);
        const today = new Date();
        console.log(currentDate.getDay(), today.getDay())
        
        while (formatDate(currentDate) <= formatDate(today)) {
            console.log(currentDate)
            const formattedDate = formatDate(currentDate);
            const week = getWeekNumber(currentDate).padStart(2, '0');
            
            let duration = 0;
            let count = 0;

            for(let content of Object.entries(userHistory[formattedDate])) {
                for (let entry of content[1]) {
                    duration+= ((currentMode == "all" || (currentMode == "lectures" ? entry.duration : !entry.duration)) ? (!entry.duration ? Math.round(entry.words_count / wordsPerMin) : entry.duration) : 0)
                    count+= ((currentMode == "all" || (currentMode == "lectures" ? entry.duration : !entry.duration)) ? 1 : 0)                    
                }
            }

            dayList.push({ name: formattedDate, duration, count });
        
            const weekKey = `${week}-${currentDate.getFullYear()}`;
            const weekIndex = weekList.findIndex(item => item.name === weekKey);
            if (weekIndex === -1) {
                weekList.push({ name: weekKey, duration, count });
            } else {
                weekList[weekIndex].duration += duration;
                weekList[weekIndex].count += count;
            }
        
            const monthKey = `${((currentDate.getMonth() + 1)+"").padStart(2, '0')}-${currentDate.getFullYear()}`;
            const monthIndex = monthList.findIndex(item => item.name === monthKey);
            if(monthKey=="07-2023") console.log(duration, currentDate)
            if (monthIndex === -1) {
                monthList.push({ name: monthKey, duration, count });
            } else {
                monthList[monthIndex].duration += duration;
                monthList[monthIndex].count += count;
            }
        
            const yearKey = currentDate.getFullYear().toString();
            const yearIndex = yearList.findIndex(item => item.name === yearKey);
            if (yearIndex === -1) {
                yearList.push({ name: yearKey, duration, count });
            } else {
                yearList[yearIndex].duration += duration;
                yearList[yearIndex].count += count;
            }
        
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // Function to get week number according to year
        function getWeekNumber(date) {
            let startDate = new Date(date.getFullYear(), 0, 1);
            let days = Math.floor((date - startDate) /
                (24 * 60 * 60 * 1000));
            
            let weekNumber = Math.ceil(days / 7);
            return `${weekNumber+1}`
        }
        
        // Sort the lists in ascending order
        dayList.sort((a, b) => a.name.split("-").reverse().join("-") - b.name.split("-").reverse().join("-"));
        weekList.sort((a, b) => a.name.split("-").reverse().join("-") - b.name.split("-").reverse().join("-"));
        monthList.sort((a, b) => a.name.split("-").reverse().join("-") - b.name.split("-").reverse().join("-"));
        yearList.sort((a, b) => a.name - b.name);
        
        setDayList(dayList);
        setWeekList(weekList);
        setMonthList(monthList);
        setYearList(yearList); 
        setCurrentList(dayList);
        setCurrentGoal(prev=>{
            let dum = {...prev}
            if (currentMode == "all") {
                dum.day = goal.books.day + goal.lectures.day
                dum.week = goal.books.week + goal.lectures.week
                dum.month = goal.books.month + goal.lectures.month
            }
            if(currentMode == "lectures")
            dum = goal.lectures
            if(currentMode == "books")
            dum = goal.books
            return dum
        })
    },[currentMode])

    useEffect(()=>{
        setCurrentGoal(prev=>{
            let dum = {...prev}
            if (currentMode == "all") {
                dum.day = goal.books.day + goal.lectures.day
                dum.week = goal.books.week + goal.lectures.week
                dum.month = goal.books.month + goal.lectures.month
            }
            if(currentMode == "lectures")
            dum = goal.lectures
            if(currentMode == "books")
            dum = goal.books
            return dum
        })
    },[goal])

    console.log(dayList)
    function valueToColor(value, maxValue) {
        // Calculate lightness value (ranging from 0 to 100) based on the given value and maxValue
        if(value>=maxValue) {
            return { backgroundColor: "#0088CC", textColor: "#ffffff" };
        }
        if (value > 0) {
            return { backgroundColor: "#CCEEFF", textColor: "#000000" };
        }

        return { backgroundColor: "#ffffff", textColor: "#000000" };
    }

    const Parentdiv = {
        height: 10,
        width: '100%',
        backgroundColor: 'whitesmoke',
        borderRadius: 0,
        margin: 0,
        overflow: "hidden"
      }
      
      
    

    
    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonSegment onIonChange={(e)=>{
                        console.log(currentMode)
                        setCurrentMode(e.detail.value)
                    }} value={currentMode}>
                    <IonSegmentButton value="all">
                        <IonLabel>All</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="lectures">
                        <IonLabel>Lectures</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="books">
                        <IonLabel>Books</IonLabel>
                    </IonSegmentButton>
                    </IonSegment>
                </IonToolbar>
                </IonHeader>
                <IonContent>
                <IonCard>
                    <IonCardContent style={{"textAlign": "center"}}>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                    <IonCardSubtitle>VaniTime</IonCardSubtitle>
                    <IonLabel id="popover-button">{viewRange}<IonIcon icon={chevronDownOutline}></IonIcon></IonLabel>
                   
                    </div>
                    <IonCardTitle>{currentList.length > 0 ? currentList[currentList.length-1]['duration'] : 0} Minutes</IonCardTitle>
                        
                        {currentMode == "all" ? <>No of Lectures/Verses: {currentList.length > 0 ? currentList[currentList.length-1]['count'] : 0}</>: <>No of {currentMode == "lectures" ? "Lectures Listened" : "Verses Read"} : {currentList.length > 0 ? currentList[currentList.length-1]['count'] : 0}</>}
                        </IonCardContent>
                    </IonCard>
                    <IonCard>
                        <IonCardContent>
                    <IonDatetime
                        presentation="date"
                        highlightedDates={(isoString) => {
                            const date = new Date(isoString);
                            const formattedDate = formatDate(date)
                            let duration = 0;
                            if(userHistory[formattedDate]) {
                                for(let content of Object.entries(userHistory[formattedDate])) {
                                    for (let entry of content[1]) {
                                        duration+= ((currentMode == "all" || (currentMode == "lectures" ? entry.duration : !entry.duration)) ? (!entry.duration ? Math.round(entry.words_count / wordsPerMin) : entry.duration) : 0)
                                    }
                                }
                            }
                            
                            return valueToColor(duration, currentGoal["day"]);
                        }}
                        onIonChange={(e)=>{
                            const date = new Date(e.detail.value);
                            const formattedDate = formatDate(date)
                            history.push(`/history/${formattedDate}`)
                        }}
                        ></IonDatetime>
                        </IonCardContent>
                        </IonCard>
                        <IonCard>
                            <IonCardContent>
                            {goal["books"]["day"] != -1  ?
                            <>
                            <div style={{textAlign:"center"}}>
                                Day Goal
                            </div>
                            <div style={{display:"flex", alignItems:"center"}}>
                            <div style={{marginRight:"5px"}}>{dayList.length ? dayList[dayList.length-1]['duration'] : 0}</div>
                            <div style={Parentdiv}>
                            <div style={{
                                height: '100%',
                                width: dayList.length ? (dayList[dayList.length-1]['duration']/currentGoal["day"])*100+"%" : 0,
                                backgroundColor: "blue",
                                borderRadius: 0,
                                textAlign: 'right'
                            }}>
                            </div>
                            </div>
                            <div style={{marginLeft:"5px"}}>{currentGoal["day"]}</div>
                            </div>
                            <div style={{textAlign:"center", marginTop:"10px"}}>
                                Week Goal
                            </div>
                            <div style={{display:"flex", alignItems:"center"}}>
                            <div style={{marginRight:"5px"}}>{weekList.length ? weekList[weekList.length-1]['duration'] : 0}</div>
                            <div style={Parentdiv}>
                            <div style={{
                                height: '100%',
                                width: weekList.length ? (weekList[weekList.length-1]['duration']/currentGoal["week"])*100+"%" : 0,
                                backgroundColor: "blue",
                                borderRadius: 0,
                                textAlign: 'right'
                            }}>
                            </div>
                            </div>
                            <div style={{marginLeft:"5px"}}>{currentGoal["week"]}</div>
                            </div>
                            <div style={{textAlign:"center", marginTop:"10px"}}>
                                Month Goal
                            </div>
                            <div style={{display:"flex", alignItems:"center"}}>
                            <div style={{marginRight:"5px"}}>{monthList.length ? monthList[monthList.length-1]['duration'] : 0}</div>
                            <div style={Parentdiv}>
                            <div style={{
                                height: '100%',
                                width: monthList.length ? (monthList[monthList.length-1]['duration']/currentGoal["month"])*100+"%" : 0,
                                backgroundColor: "blue",
                                borderRadius: 0,
                                textAlign: 'right'
                            }}>
                            </div>
                            </div>
                            <div style={{marginLeft:"5px"}}>{currentGoal["month"]}</div>
                            </div> </> : 
                            <div style={{display:"flex", justifyContent:"space-around"}}>
                                <IonButton id="open-modal">Set Goals</IonButton>
                            </div>
                            }
                            </IonCardContent>
                        </IonCard>
                        <IonCard>
                            <IonCardContent>
                            <LineChart width={300} height={300} data={currentList}  margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                <Line type="monotone" dataKey="duration" stroke="#8884d8" />
                                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                            </LineChart>
                        </IonCardContent>
                        </IonCard>
                    <IonPopover trigger="popover-button" dismissOnSelect={true} triggerAction="click">
                        <IonContent class="ion-padding">
                        <IonList>
                            <IonItem onClick={()=>{
                                setViewRange("Today")
                                setCurrentList(dayList)
                                }} button={true} detail={false}>
                            Today
                            </IonItem>
                            <IonItem onClick={()=>{
                                setViewRange("This Week")
                                setCurrentList(weekList)
                                }} button={true} detail={false}>
                            This Week
                            </IonItem>
                            <IonItem onClick={()=>{
                                setViewRange("This Month")
                                setCurrentList(monthList)
                                }} button={true} detail={false}>
                            This Month
                            </IonItem>
                            <IonItem onClick={()=>{
                                setViewRange("This Year")
                                setCurrentList(yearList)
                                }} button={true} detail={false}>
                            This Year
                            </IonItem>
                        </IonList>
                        </IonContent>
                    </IonPopover>
                    <IonModal ref={modal} trigger="open-modal" id="example-modal">
                    <div style={{textAlign:"center", marginTop:"10px"}}>Input the Goals</div>
                    <IonList>
                        <IonItem>
                            <IonInput label="Lectures Daily Goal" onIonChange={(e)=>{
                                setTempGoal(prev=>{
                                    let dum = {...prev}
                                    dum["lectures"]["day"] = e.detail.value * 1
                                    dum["lectures"]["week"] = e.detail.value * 7
                                    dum["lectures"]["month"] = e.detail.value * 30
                                    return dum
                                })
                            }} type="number" placeholder="in minutes"></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonInput label="Books Daily Goal" onIonChange={(e)=>{
                                setTempGoal(prev=>{
                                    let dum = {...prev}
                                    dum["books"]["day"] = e.detail.value * 1 
                                    dum["books"]["week"] = e.detail.value * 7
                                    dum["books"]["month"] = e.detail.value * 30
                                    return dum
                                })
                            }} type="number" placeholder="in minutes"></IonInput>
                        </IonItem>
                        </IonList>
                        <div style={{display:"flex", justifyContent:"space-evenly", marginTop:"10px"}}>
                            <IonButton onClick={()=>{
                                modalDismiss()
                            }}>Cancel</IonButton> 
                            <IonButton onClick={()=>{
                                if(tempGoal["lectures"]["day"] == -1 || tempGoal["books"]["day"] == -1) setToast("input")
                                else {
                                    setGoal(tempGoal)
                                    modalDismiss()
                                }
                            }}>Done</IonButton>
                      </div>
                    </IonModal>
                    <IonToast isOpen={toast != "false"} message={toastMessageMap[toast]} duration={5000}></IonToast>
                </IonContent>
        </IonPage>
    
    )
}

export default Stats;