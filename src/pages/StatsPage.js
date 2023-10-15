import {
 IonPage,
 IonHeader,
 IonToolbar,
 IonSegment,
 IonSegmentButton,
 IonLabel,
 IonContent,
 IonCard,
 IonCardTitle,
 IonCardSubtitle,
 IonCardContent,
 IonButton,
 IonIcon,
 IonPopover,
 IonList,
 IonItem,
 IonDatetime,
 IonInput,
 IonToast,
 isPlatform,
 IonButtons,
 IonMenuButton,
} from '@ionic/react'
import { chevronDownOutline, settingsOutline } from 'ionicons/icons'
import { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Goal, Settings, UserHistory, WordsPerMin } from '../context'
import { useLocal } from '../lshooks'
import '../styles.css'
import Highcharts from 'highcharts'
import { formatMinutes2, formatMinutes3 } from '../scripts/durationToMinutes'

function Stats() {
 const [viewRange, setViewRange] = useState('Today')
 const [graphViewRange, setGraphViewRange] = useState('Days')
 const [userHistory, setUserHistory] = useContext(UserHistory)
 const [dayList, setDayList] = useState([])
 const [weekList, setWeekList] = useState([])
 const [monthList, setMonthList] = useState([])
 const [yearList, setYearList] = useState([])
 const [currentList, setCurrentList] = useState([])
 const [currentGraphList, setCurrentGraphList] = useState([])
 const [currentMode, setCurrentMode] = useLocal('stats-mode', 'all')
 const [wordsPerMin, setWordsPerMin] = useContext(WordsPerMin)
 const [settings, setSettings] = useContext(Settings)
 let primaryColor = settings.theme == 'light' ? '#1e90ff' : '#3498db'
 let textColor = settings.theme == 'light' ? '#000000' : '#ffffff'
 const [toast, setToast] = useState('false')
 const [toastMessageMap, setToastMessageMap] = useState({
  input: 'Please give valid inputs',
 })

 const [goal, setGoal] = useContext(Goal)
 const [tempGoal, setTempGoal] = useState(JSON.parse(JSON.stringify(goal)))
 const [currentGoal, setCurrentGoal] = useState({
  day: 0,
  week: 0,
  month: 0,
 })
 let history = useHistory()

 function formatDate(date) {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${day}-${month}-${year}`
 }
 useEffect(() => {
  // Find the oldest date
  const dates = Object.keys(userHistory)
  const oldestDate = new Date(
   Math.min(
    ...dates.map((date) => new Date(date.split('-').reverse().join('-')))
   )
  )
  // Generate dayList, weekList, monthList, and yearList
  const dayList = []
  const weekList = []
  const monthList = []
  const yearList = []

  const currentDate = new Date(oldestDate)
  const today = new Date()

  while (
   formatDate(currentDate).split('-').reverse().join('-') <=
   formatDate(today).split('-').reverse().join('-')
  ) {
   const formattedDate = formatDate(currentDate)
   const week = getWeekNumber(currentDate).padStart(2, '0')

   let duration = 0
   let count = 0
   if (userHistory[formattedDate]) {
    for (let content of Object.entries(userHistory[formattedDate])) {
     for (let entry of content[1]) {
      duration +=
       currentMode == 'all' ||
       (currentMode == 'lectures' ? entry.duration : !entry.duration)
        ? !entry.duration
          ? Math.round(entry.wc / wordsPerMin)
          : entry.duration
        : 0
      count +=
       currentMode == 'all' ||
       (currentMode == 'lectures' ? entry.duration : !entry.duration)
        ? 1
        : 0
     }
    }
   }

   dayList.push({ name: formattedDate, duration, count })

   const weekKey = `${week}-${currentDate.getFullYear()}`
   const weekIndex = weekList.findIndex((item) => item.name === weekKey)
   if (weekIndex === -1) {
    weekList.push({ name: weekKey, duration, count })
   } else {
    weekList[weekIndex].duration += duration
    weekList[weekIndex].count += count
   }

   const monthKey = `${(currentDate.getMonth() + 1 + '').padStart(
    2,
    '0'
   )}-${currentDate.getFullYear()}`
   const monthIndex = monthList.findIndex((item) => item.name === monthKey)
   if (monthIndex === -1) {
    monthList.push({ name: monthKey, duration, count })
   } else {
    monthList[monthIndex].duration += duration
    monthList[monthIndex].count += count
   }

   const yearKey = currentDate.getFullYear().toString()
   const yearIndex = yearList.findIndex((item) => item.name === yearKey)
   if (yearIndex === -1) {
    yearList.push({ name: yearKey, duration, count })
   } else {
    yearList[yearIndex].duration += duration
    yearList[yearIndex].count += count
   }

   currentDate.setDate(currentDate.getDate() + 1)
  }

  // Function to get week number according to year
  function getWeekNumber(date) {
   let startDate = new Date(date.getFullYear(), 0, 1)
   let days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000))

   let weekNumber = Math.ceil(days / 7)
   return `${weekNumber + 1}`
  }

  // Sort the lists in ascending order
  dayList.sort(
   (a, b) =>
    a.name.split('-').reverse().join('-') -
    b.name.split('-').reverse().join('-')
  )
  weekList.sort(
   (a, b) =>
    a.name.split('-').reverse().join('-') -
    b.name.split('-').reverse().join('-')
  )
  monthList.sort(
   (a, b) =>
    a.name.split('-').reverse().join('-') -
    b.name.split('-').reverse().join('-')
  )
  yearList.sort((a, b) => a.name - b.name)

  setDayList(dayList)
  setWeekList(weekList)
  setMonthList(monthList)
  setYearList(yearList)
  if (viewRange == 'Today') setCurrentList(dayList)
  if (viewRange == 'This Week') setCurrentList(weekList)
  if (viewRange == 'This Month') setCurrentList(monthList)
  if (viewRange == 'This Year') setCurrentList(yearList)
  if (graphViewRange == 'Days') setCurrentGraphList(dayList)
  if (graphViewRange == 'Weeks') setCurrentGraphList(weekList)
  if (graphViewRange == 'Months') setCurrentGraphList(monthList)
  if (graphViewRange == 'Years') setCurrentGraphList(yearList)
  setCurrentGoal((prev) => {
   let dum = { ...prev }
   if (currentMode == 'all') {
    dum.day = goal.books.day + goal.lectures.day
    dum.week = goal.books.week + goal.lectures.week
    dum.month = goal.books.month + goal.lectures.month
   }
   if (currentMode == 'lectures') dum = goal.lectures
   if (currentMode == 'books') dum = goal.books
   return dum
  })
 }, [currentMode])

 useEffect(() => {
  setCurrentGoal((prev) => {
   let dum = { ...prev }
   if (currentMode == 'all') {
    dum.day = goal.books.day + goal.lectures.day
    dum.week = goal.books.week + goal.lectures.week
    dum.month = goal.books.month + goal.lectures.month
   }
   if (currentMode == 'lectures') dum = goal.lectures
   if (currentMode == 'books') dum = goal.books
   return dum
  })
 }, [goal])
 function valueToColor(value, maxValue) {
  // Calculate lightness value (ranging from 0 to 100) based on the given value and maxValue
  if (settings.theme == 'light') {
   if (value <= 0) {
    return { backgroundColor: '#ffffff', textColor: '#000000' }
   }
   if (maxValue <= 0) {
    return { backgroundColor: '#CCEEFF', textColor: '#000000' }
   }
   if (value >= maxValue) {
    return { backgroundColor: primaryColor, textColor: '#ffffff' }
   }
   if (value > 0) {
    return { backgroundColor: '#CCEEFF', textColor: '#000000' }
   }
  }

  if (settings.theme == 'dark') {
   if (value <= 0) {
    return { backgroundColor: '#121212', textColor: '#ffffff' }
   }
   if (maxValue <= 0) {
    return { backgroundColor: '#CCEEFF', textColor: '#000000' }
   }
   if (value >= maxValue) {
    return { backgroundColor: primaryColor, textColor: '#ffffff' }
   }
   if (value > 0) {
    return { backgroundColor: '#CCEEFF', textColor: '#000000' }
   }
  }
 }

 const ParentBar = {
  height: 10,
  width: '100%',
  backgroundColor: settings.theme == 'light' ? '#DDDDDD' : '#444444',
  borderRadius: 0,
  margin: 0,
  position: 'relative',
 }

 useEffect(() => {
  const chartOptions = {
   chart: {
    type: 'line',
    scrollablePlotArea: {
     minWidth: currentGraphList.length * 15,
     scrollPositionX: 1,
    },
    backgroundColor: 'transparent',
   },
   title: {
    text: '', // Set the title text to an empty string
   },
   xAxis: {
    categories: currentGraphList.map((item) => {
     return item.name
    }),

    labels: {
     overflow: 'justify',
     style: {
      color: textColor, // Set the color for the xAxis labels
     },
    },
   },
   yAxis: {
    gridLineColor: 'grey',
    gridLineDashStyle: 'ShortDash',
    tickWidth: 1,
    title: {
     text: 'Minutes',
     style: {
      color: textColor, // Set the color for the xAxis labels
     },
    },
    lineWidth: 1,
    opposite: true,
    labels: {
     style: {
      color: textColor, // Set the color for the xAxis labels
     },
    },
   },
   tooltip: {
    valueSuffix: ' minutes',
    split: false,
   },
   legend: {
    enabled: false, // Disable the legend
   },
   credits: {
    enabled: false, // Disable credits
   },
   series: [
    {
     name: 'Time',
     data: currentGraphList.map((item) => {
      return item.duration
     }),
    },
   ],
  }
  Highcharts.chart('container', chartOptions)
 }, [currentGraphList])

 return (
  <IonPage id="main-content">
   <IonHeader>
    <IonToolbar>
     <IonButtons slot="start">
      <IonMenuButton></IonMenuButton>
     </IonButtons>

     <IonSegment
      onIonChange={(e) => {
       setCurrentMode(e.detail.value)
      }}
      value={currentMode}
     >
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
     <IonButtons slot="end">
      <IonButton onClick={() => history.push('/setting')}>
       <IonIcon icon={settingsOutline}></IonIcon>
      </IonButton>
     </IonButtons>
    </IonToolbar>
   </IonHeader>
   <IonContent>
    <div
     style={
      isPlatform('desktop') ? { display: 'flex', justifyContent: 'center' } : {}
     }
    >
     <div
      style={
       isPlatform('desktop')
        ? {
           width: '400px',
           visibility: dayList.length > 0 ? 'visible' : 'hidden',
          }
        : {}
      }
     >
      <IonCard>
       <IonCardContent style={{ textAlign: 'center' }}>
        <div
         style={{
          display: 'flex',
          justifyContent: 'space-between',
         }}
        >
         <IonCardSubtitle>VaniTime</IonCardSubtitle>
         <IonLabel id="popover-button">
          {viewRange}
          <IonIcon icon={chevronDownOutline}></IonIcon>
         </IonLabel>
        </div>
        <IonCardTitle>
         {formatMinutes2(
          currentList.length > 0
           ? currentList[currentList.length - 1]['duration']
           : 0
         )}
        </IonCardTitle>

        {currentMode == 'all' ? (
         <>
          No of Lectures/Verses:{' '}
          {currentList.length > 0
           ? currentList[currentList.length - 1]['count']
           : 0}
         </>
        ) : (
         <>
          No of{' '}
          {currentMode == 'lectures' ? 'Lectures Listened' : 'Verses Read'} :{' '}
          {currentList.length > 0
           ? currentList[currentList.length - 1]['count']
           : 0}
         </>
        )}
       </IonCardContent>
      </IonCard>
      <IonCard>
       <IonCardContent>
        <p>Click on a date to view that day's history</p>
        <IonDatetime
         presentation="date"
         firstDayOfWeek={1}
         highlightedDates={(isoString) => {
          const date = new Date(isoString)
          const formattedDate = formatDate(date)
          let duration = 0
          if (userHistory[formattedDate]) {
           for (let content of Object.entries(userHistory[formattedDate])) {
            for (let entry of content[1]) {
             duration +=
              currentMode == 'all' ||
              (currentMode == 'lectures' ? entry.duration : !entry.duration)
               ? !entry.duration
                 ? Math.round(entry.wc / wordsPerMin)
                 : entry.duration
               : 0
            }
           }
          }

          if (formattedDate == formatDate(new Date())) {
           let colorObj = valueToColor(duration, currentGoal['day'])
           colorObj['textColor'] = '#FA8072'
           return colorObj
          }

          return valueToColor(duration, currentGoal['day'])
         }}
         onIonChange={(e) => {
          const date = new Date(e.detail.value)
          const formattedDate = formatDate(date)
          history.push(`/history/${formattedDate}`)
         }}
        ></IonDatetime>
       </IonCardContent>
      </IonCard>
      <IonCard>
       <IonCardContent>
        {goal['books']['day'] != -1 ? (
         <>
          <div
           style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '2px',
           }}
          >
           <div
            style={{
             marginRight: '5px',
             width: '75px',
            }}
           >
            {formatMinutes3(
             dayList.length ? dayList[dayList.length - 1]['duration'] : 0
            )}
           </div>
           <div
            style={{
             textAlign: 'center',
             color: textColor,
            }}
           >
            Today's Goal
           </div>
           <div
            style={{
             marginLeft: '5px',
             width: '75px',
             textAlign: 'right',
            }}
           >
            {formatMinutes3(currentGoal['day'])}
           </div>
          </div>
          <div style={ParentBar}>
           <div
            style={{
             height: '100%',
             width: dayList.length
              ? dayList[dayList.length - 1]['duration'] / currentGoal['day'] < 1
                ? (dayList[dayList.length - 1]['duration'] /
                   currentGoal['day']) *
                   100 +
                  '%'
                : '100%'
              : 0,
             backgroundColor: primaryColor,
             borderRadius: 0,
             textAlign: 'right',
             display: 'flex',
             justifyContent: 'end',
             alignItems: 'center',
            }}
           >
            <div
             style={{
              height: '30px',
              fontSize: '11px',
              opacity: '1',
              backgroundColor: '#CCEEFF',
              color: 'black',
              width: '30px',
              position: 'absolute',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '50%',
              left: dayList.length
               ? dayList[dayList.length - 1]['duration'] / currentGoal['day'] <
                 1
                 ? (dayList[dayList.length - 1]['duration'] /
                    currentGoal['day']) *
                    100 -
                   4.5 +
                   '%'
                 : '95.5%'
               : '-4.5%',
             }}
            >
             {dayList.length && currentGoal['day'] > 0
              ? Math.round(
                 (dayList[dayList.length - 1]['duration'] /
                  currentGoal['day']) *
                  100
                )
              : 0}
             %
            </div>
           </div>
          </div>
          <div
           style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '20px',
            marginBottom: '2px',
           }}
          >
           <div
            style={{
             marginRight: '5px',
             width: '75px',
            }}
           >
            {formatMinutes3(
             weekList.length ? weekList[weekList.length - 1]['duration'] : 0
            )}
           </div>
           <div
            style={{
             textAlign: 'center',
             color: textColor,
            }}
           >
            Week's Goal
           </div>
           <div
            style={{
             marginLeft: '5px',
             width: '75px',
             textAlign: 'right',
            }}
           >
            {formatMinutes3(currentGoal['week'])}
           </div>
          </div>
          <div style={ParentBar}>
           <div
            style={{
             height: '100%',
             width: weekList.length
              ? weekList[weekList.length - 1]['duration'] /
                 currentGoal['week'] <
                1
                ? (weekList[weekList.length - 1]['duration'] /
                   currentGoal['week']) *
                   100 +
                  '%'
                : '100%'
              : 0,
             backgroundColor: primaryColor,
             borderRadius: 0,
             textAlign: 'right',
             display: 'flex',
             justifyContent: 'end',
             alignItems: 'center',
            }}
           >
            <div
             style={{
              height: '30px',
              fontSize: '11px',
              opacity: '1',
              backgroundColor: '#CCEEFF',
              color: 'black',
              width: '30px',
              position: 'absolute',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '50%',
              left: weekList.length
               ? weekList[weekList.length - 1]['duration'] /
                  currentGoal['week'] <
                 1
                 ? (weekList[weekList.length - 1]['duration'] /
                    currentGoal['week']) *
                    100 -
                   4.5 +
                   '%'
                 : '95.5%'
               : '-4.5%',
             }}
            >
             {weekList.length && currentGoal['week'] > 0
              ? Math.round(
                 (weekList[weekList.length - 1]['duration'] /
                  currentGoal['week']) *
                  100
                )
              : 0}
             %
            </div>
           </div>
          </div>
          <div
           style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '20px',
            marginBottom: '2px',
           }}
          >
           <div
            style={{
             marginRight: '5px',
             width: '75px',
            }}
           >
            {formatMinutes3(
             monthList.length ? monthList[monthList.length - 1]['duration'] : 0
            )}
           </div>
           <div
            style={{
             textAlign: 'center',
             color: textColor,
            }}
           >
            Month's Goal
           </div>
           <div
            style={{
             marginLeft: '5px',
             width: '75px',
             textAlign: 'right',
            }}
           >
            {formatMinutes3(currentGoal['month'])}
           </div>
          </div>
          <div style={ParentBar}>
           <div
            style={{
             height: '100%',
             width: monthList.length
              ? monthList[monthList.length - 1]['duration'] /
                 currentGoal['month'] <
                1
                ? (monthList[monthList.length - 1]['duration'] /
                   currentGoal['month']) *
                   100 +
                  '%'
                : '100%'
              : 0,
             backgroundColor: primaryColor,
             borderRadius: 0,
             textAlign: 'right',
             display: 'flex',
             justifyContent: 'end',
             alignItems: 'center',
            }}
           >
            <div
             style={{
              height: '30px',
              fontSize: '11px',
              opacity: '1',
              backgroundColor: '#CCEEFF',
              color: 'black',
              width: '30px',
              position: 'absolute',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '50%',
              left: monthList.length
               ? monthList[monthList.length - 1]['duration'] /
                  currentGoal['month'] <
                 1
                 ? (monthList[monthList.length - 1]['duration'] /
                    currentGoal['month']) *
                    100 -
                   4.5 +
                   '%'
                 : '95.5%'
               : '-4.5%',
             }}
            >
             {monthList.length && currentGoal['month'] > 0
              ? Math.round(
                 (monthList[monthList.length - 1]['duration'] /
                  currentGoal['month']) *
                  100
                )
              : 0}
             %
            </div>
           </div>
          </div>{' '}
         </>
        ) : (
         <div>
          <IonList>
           <IonItem>
            <IonLabel style={{ width: '150px' }}>Lectures Daily Goal </IonLabel>
            <IonLabel>:</IonLabel>
            <IonInput
             onIonChange={(e) => {
              setTempGoal((prev) => {
               let dum = {
                ...prev,
               }
               dum['lectures']['day'] = e.detail.value * 1
               dum['lectures']['week'] = e.detail.value * 7
               dum['lectures']['month'] = e.detail.value * 30
               return dum
              })
             }}
             type="number"
             min="0"
             value={
              tempGoal['lectures']['day'] != -1
               ? tempGoal['lectures']['day']
               : null
             }
             placeholder="in minutes"
            ></IonInput>
           </IonItem>
           <IonItem>
            <IonLabel style={{ width: '150px' }}>Books Daily Goal </IonLabel>
            <IonLabel>:</IonLabel>
            <IonInput
             onIonChange={(e) => {
              setTempGoal((prev) => {
               let dum = {
                ...prev,
               }
               dum['books']['day'] = e.detail.value * 1
               dum['books']['week'] = e.detail.value * 7
               dum['books']['month'] = e.detail.value * 30
               return dum
              })
             }}
             type="number"
             min="0"
             value={
              tempGoal['books']['day'] != -1 ? tempGoal['books']['day'] : null
             }
             placeholder="in minutes"
            ></IonInput>
           </IonItem>
          </IonList>
          <div
           onClick={() => {
            console.log(tempGoal)
            if (
             tempGoal['lectures']['day'] < 0 ||
             tempGoal['books']['day'] < 0
            ) {
             setToast('input')
             return
            } else {
             setGoal(tempGoal)
            }
           }}
           style={{
            textAlign: 'center',
            margin: '10px 0 0 0',
           }}
          >
           <IonButton>Set Goals</IonButton>
          </div>
         </div>
        )}
       </IonCardContent>
      </IonCard>
      <IonCard>
       <IonCardContent style={{ paddingRight: 0 }}>
        <div
         style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginRight: '20px',
          marginBottom: '20px',
         }}
        >
         <IonCardSubtitle>VaniTime</IonCardSubtitle>
         <IonLabel id="graph-popover-button">
          {graphViewRange}
          <IonIcon icon={chevronDownOutline}></IonIcon>
         </IonLabel>
        </div>
        <div id="container"></div>
       </IonCardContent>
      </IonCard>
      <IonPopover
       trigger="popover-button"
       dismissOnSelect={true}
       triggerAction="click"
      >
       <IonContent class="ion-padding">
        <IonList>
         <IonItem
          onClick={() => {
           setViewRange('Today')
           setCurrentList(dayList)
          }}
          button={true}
          detail={false}
         >
          Today
         </IonItem>
         <IonItem
          onClick={() => {
           setViewRange('This Week')
           setCurrentList(weekList)
          }}
          button={true}
          detail={false}
         >
          This Week
         </IonItem>
         <IonItem
          onClick={() => {
           setViewRange('This Month')
           setCurrentList(monthList)
          }}
          button={true}
          detail={false}
         >
          This Month
         </IonItem>
         <IonItem
          onClick={() => {
           setViewRange('This Year')
           setCurrentList(yearList)
          }}
          button={true}
          detail={false}
         >
          This Year
         </IonItem>
        </IonList>
       </IonContent>
      </IonPopover>
      <IonPopover
       trigger="graph-popover-button"
       dismissOnSelect={true}
       triggerAction="click"
      >
       <IonContent class="ion-padding">
        <IonList>
         <IonItem
          onClick={() => {
           setGraphViewRange('Days')
           setCurrentGraphList(dayList)
          }}
          button={true}
          detail={false}
         >
          Days
         </IonItem>
         <IonItem
          onClick={() => {
           setGraphViewRange('Weeks')
           setCurrentGraphList(weekList)
          }}
          button={true}
          detail={false}
         >
          Weeks
         </IonItem>
         <IonItem
          onClick={() => {
           setGraphViewRange('Months')
           setCurrentGraphList(monthList)
          }}
          button={true}
          detail={false}
         >
          Months
         </IonItem>
         <IonItem
          onClick={() => {
           setGraphViewRange('Years')
           setCurrentGraphList(yearList)
          }}
          button={true}
          detail={false}
         >
          Years
         </IonItem>
        </IonList>
       </IonContent>
      </IonPopover>
     </div>
    </div>

    <IonToast
     onDidDismiss={() => {
      setToast('false')
     }}
     isOpen={toast != 'false'}
     message={toastMessageMap[toast]}
     duration={2000}
    ></IonToast>
   </IonContent>
  </IonPage>
 )
}

export default Stats
