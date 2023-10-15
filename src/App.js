import { Redirect, Route, useHistory, useLocation } from 'react-router-dom'
import {
 IonApp,
 IonContent,
 IonFooter,
 IonIcon,
 IonLabel,
 IonPage,
 IonRouterOutlet,
 IonSegment,
 IonSegmentButton,
 setupIonicReact,
 IonItem,
 IonCheckbox,
 IonButton,
 IonToolbar,
 IonMenu,
 IonHeader,
 IonTitle,
} from '@ionic/react'
import {
 hourglassOutline,
 statsChartOutline,
 bookmarksOutline,
 bookOutline,
 albumsOutline,
} from 'ionicons/icons'
import { useEffect, useState, useContext, useRef } from 'react'
import { findNextPurport } from './scripts/findNextPurports'
import Modal from 'react-modal'
import './styles.css'
import axios from 'axios'

import '@ionic/react/css/core.css'
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

import Stats from './pages/StatsPage'
import History from './pages/HistoryPage'
import BookmarkFolders from './pages/BookmarkFoldersPage'
import VaniTimePage from './pages/VaniTimePage'
import VaniBase from './pages/VaniBasePage'
import Text from './pages/TextPage'
import Audio from './pages/AudioPage'
import Book from './pages/BookPage'
import Lecture from './pages/LecturePage'
import {
 Books,
 CheckAlerts,
 CurrentBook,
 CurrentLecture,
 CurrentVersesMap,
 IncompleteUserHistory,
 Lectures,
 Settings,
 UserHistory,
} from './context'
import minutesToMinutes from './scripts/durationToMinutes'
import SettingPage from './pages/SettingPage'
import VaniMedia from './pages/VaniMediaPage'

import imageQuotesList from './data/imageQuotesList.json'
import imagesList from './data/imagesList.json'
import audioList from './data/audioList.json'

setupIonicReact({
 mode: 'ios',
})

function App() {
 let history = useHistory()
 const [currentTab, setCurrentTab] = useState()
 const [checkAlerts, setCheckAlerts] = useContext(CheckAlerts)
 const [currentVersesMap, setCurrentVersesMap] = useContext(CurrentVersesMap)
 const [currentLecture, setCurrentLecture] = useContext(CurrentLecture)
 const [booksMap, setBooksMap] = useContext(Books)
 const [userHistory, setUserHistory] = useContext(UserHistory)
 const [currentBook, setCurrentBook] = useContext(CurrentBook)
 const [incompleteUserHistory, setIncompleteUserHistory] = useContext(
  IncompleteUserHistory
 )
 const [lecturesMap, setLecturesMap] = useContext(Lectures)
 const [settings, setSettings] = useContext(Settings)
 const customStyles = {
  content: {
   top: '50%',
   left: '50%',
   right: 'auto',
   bottom: 'auto',
   marginRight: '-50%',
   transform: 'translate(-50%, -50%)',
   width: '90%',
   maxWidth: '400px',
   padding: 0,
   backgroundColor: settings.theme == 'light' ? '#ffffff' : '#121212',
   color: settings.theme == 'light' ? 'black' : '#ffffff',
   borderColor: settings.theme == 'light' ? '#ffffff' : '#121212',
  },
  overlay: {
   position: 'fixed',
   top: 0,
   left: 0,
   right: 0,
   bottom: 0,
   backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
 }
 let location = useLocation()
 const [videos, setVideos] = useState([])
 const [imageQuotes, setImageQuotes] = useState([])
 const [images, setImages] = useState([])
 const [audios, setAudios] = useState([])
 const [searchText, setSearchText] = useState('')
 const [searchTextT, setSearchTextT] = useState('')
 const [searchResults, setSearchResults] = useState({})
 const [searchLoaded, setSearchLoaded] = useState(true)

 useEffect(() => {
  axios
   .get(
    'https://vanipedia.org/w/api.php?action=parse&prop=text&format=xml&page=' +
     'VanimediaMayapur_YouTube_SHORTS_List'
   )
   .then((res) => {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(res.data, 'text/xml')
    let textContent = xmlDoc.querySelector('text').textContent
    const youtubeShortURLs = textContent.match(
     /https:\/\/www\.youtube\.com\/shorts\/[^\s]+/g
    )
    let shortsList = []
    for (let url of youtubeShortURLs) {
     shortsList.push({
      url: url.replace('"', ''),
      isPlaying: false,
     })
    }
    setVideos(shortsList.sort(() => Math.random() - 0.5))
   })
   .catch((error) => {
    console.log(error)
   })
  setAudios(audioList.sort(() => Math.random() - 0.5))
  setImages(imagesList.sort(() => Math.random() - 0.5))
  setImageQuotes(imageQuotesList.sort(() => Math.random() - 0.5))
 }, [])

 useEffect(() => {
  let backgroundColor
  let backgroundRGB
  let textColor
  let primaryColor
  let primaryHoverColor
  let boxShadow
  let cardTextColor
  if (settings.theme == 'light') {
   backgroundColor = '#ffffff'
   backgroundRGB = '255, 255, 255'
   textColor = '#000000'
   primaryColor = '#1e90ff'
   primaryHoverColor = '#1871b5'
   boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.08)'
   cardTextColor = 'black'
  }
  if (settings.theme == 'dark') {
   backgroundColor = '#121212'
   backgroundRGB = '18, 18, 18'
   textColor = '#ffffff'
   primaryColor = '#3498db'
   primaryHoverColor = '#2980b9'
   boxShadow =
    '0 4px 6px rgba(255, 255, 255, 0.06), 0 5px 15px rgba(255, 255, 255, 0.08)'
   cardTextColor = 'white'
  }

  document.documentElement.style.setProperty(
   '--ion-background-color',
   backgroundColor
  )
  document.documentElement.style.setProperty(
   '--ion-background-rgb',
   backgroundRGB
  )
  document.documentElement.style.setProperty('--ion-text-color', textColor)
  document.documentElement.style.setProperty(
   '--ion-color-primary',
   primaryColor
  )
  document.documentElement.style.setProperty(
   '--ion-color-primary-shade',
   primaryHoverColor
  )
  document.documentElement.style.setProperty(
   '--ion-color-primary-tint',
   primaryHoverColor
  )
  document.documentElement.style.setProperty(
   '--ion-toolbar-background',
   primaryColor
  )
  document.documentElement.style.setProperty('--ion-toolbar-color', '#ffffff')

  document.documentElement.style.setProperty(
   '--ion-toolbar-segment-color',
   '#ffffff'
  )
  document.documentElement.style.setProperty(
   '--ion-toolbar-segment-color-checked',
   primaryColor
  )
  document.documentElement.style.setProperty(
   '--ion-toolbar-segment-indicator-color',
   '#ffffff'
  )
  document.documentElement.style.setProperty('--ion-box-shadow', boxShadow)
  document.documentElement.style.setProperty(
   '--ion-border',
   '1px solid ' + (settings.theme == 'light' ? '#DDDDDD' : '#444444')
  )

  document.documentElement.style.setProperty(
   '--ion-font-family',
   settings.font_style
  )
  document.documentElement.style.setProperty('font-size', '16px')
  document.documentElement.style.setProperty(
   'font-weight',
   settings.font_style == 'Papyrus, fantasy' ? '500' : 'normal'
  )
  document.documentElement.style.setProperty(
   '--ion-card-title-size',
   settings.font_style.includes('monospace') ? '20px' : '25px'
  )
  document.documentElement.style.setProperty(
   '--ion-card-text-color',
   cardTextColor
  )
 }, [settings])

 useEffect(() => {
  console.log(location)
  let currentPath = window.location.pathname
  if (currentPath.includes('vanitime')) setCurrentTab('vanitime')
  if (currentPath.includes('vanibase') || currentPath.includes('index'))
   setCurrentTab('vanibase')
  if (currentPath.includes('stats') || currentPath.includes('history'))
   setCurrentTab('stats')
  if (currentPath.includes('setting')) setCurrentTab('setting')
  if (currentPath.includes('bookmarks')) setCurrentTab('bookmarks')
  if (currentPath.includes('vanimedia')) setCurrentTab('vanimedia')
 }, [location])

 useEffect(() => {
  if (
   !`${location.pathname}`.includes('/purports/') &&
   !`${location.pathname}`.includes('/lecture/')
  ) {
   if (incompleteUserHistory == 'purports')
    setCheckAlerts((prev) => {
     let dum = { ...prev }
     dum['purports'] = true
     return dum
    })
   if (incompleteUserHistory == 'lecture')
    setCheckAlerts((prev) => {
     let dum = { ...prev }
     dum['lecture'] = true
     return dum
    })
  }
 }, [location])

 function generateTitlesMap() {
  let titlesMap = {}
  for (let key1 of Object.keys(booksMap)) {
   for (let key2 of Object.keys(booksMap[key1]['parts'])) {
    if (
     Object.keys(booksMap[key1]['parts'][key2]['parts'])[0].startsWith('_')
    ) {
     for (let key3 of Object.keys(booksMap[key1]['parts'][key2]['parts'])) {
      let title =
       key1 +
       (isNaN(key1) ? '_' : '.') +
       key2 +
       (isNaN(key2) ? '_' : '.') +
       key3.replace('_', '')
      if (key1 == 'OB')
       titlesMap[key3.replace('_', '')] =
        '8. ' + booksMap[key1]['parts'][key2]['name']
      else titlesMap[title] = '2. ' + booksMap[key1]['name']
     }
    } else {
     for (let key3 of Object.keys(booksMap[key1]['parts'][key2]['parts'])) {
      for (let key4 of Object.keys(
       booksMap[key1]['parts'][key2]['parts'][key3]['parts']
      )) {
       let title =
        key1 +
        (isNaN(key1) ? '_' : '.') +
        key2 +
        (isNaN(key2) ? '_' : '.') +
        key3 +
        (isNaN(key3) ? '_' : '.') +
        key4.replace('_', '')
       if (key1 == 'SB' && parseInt(key2) < 10) titlesMap[title] = '3. '
       if (key1 == 'SB' && parseInt(key2) >= 10) titlesMap[title] = '4. '
       if (key2 == 'Adi') titlesMap[title] = '5. '
       if (key2 == 'Madhya') titlesMap[title] = '6. '
       if (key2 == 'Antya') titlesMap[title] = '7. '
       titlesMap[title] =
        titlesMap[title] +
        booksMap[key1]['name'] +
        ' | ' +
        booksMap[key1]['parts'][key2]['name']
      }
     }
    }
   }
  }

  for (let key1 of Object.keys(lecturesMap)) {
   for (let key2 of Object.keys(lecturesMap[key1]['parts'])) {
    titlesMap[key2] = '1. ' + 'Lectures'
   }
  }

  return titlesMap
 }

 function customSort(arr) {
  return arr.sort((a, b) => {
   const aParts = a['name'].split(/[\._]/)
   const bParts = b['name'].split(/[\._]/)

   for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
    if (!isNaN(aParts[i]) && !isNaN(bParts[i])) {
     const numA = parseInt(aParts[i])
     const numB = parseInt(bParts[i])
     if (numA < numB) {
      return -1
     } else if (numA > numB) {
      return 1
     }
    } else if (aParts[i] < bParts[i]) {
     return -1
    } else if (aParts[i] > bParts[i]) {
     return 1
    }
   }

   return aParts.length - bParts.length
  })
 }

 useEffect(() => {
  async function fetchData() {
   try {
    let continueParam = ''
    let results = {}
    let searchResult = {}

    while (true) {
     const response = await axios.get(
      `https://vanisource.org/w/api.php?action=query&list=search&srwhat=text&format=xml&srlimit=max&srsearch=${searchText.replace(
       /\s+/g,
       ' '
      )}${continueParam}&srprop=redirecttitle`
     )

     const xmlDoc = new DOMParser().parseFromString(
      response.data,
      'application/xml'
     )

     const searchElements = xmlDoc.querySelectorAll('p')

     searchElements.forEach((searchElement) => {
      const title = searchElement.getAttribute('title').replace(/ /g, '_')
      const snippet = searchElement.getAttribute('snippet')
      results[title] = snippet
     })

     const continueElement = xmlDoc.querySelector('continue')
     if (continueElement) {
      continueParam = `&sroffset=${continueElement.getAttribute('sroffset')}`
     } else {
      break
     }
    }
    let titlesMap = generateTitlesMap()
    for (const title in results) {
     if (title in titlesMap) {
      if (titlesMap[title] in searchResult) {
       searchResult[titlesMap[title]].push({
        name: title,
        snippet: '<div>' + results[title] + '</div>',
       })
      } else {
       searchResult[titlesMap[title]] = []
       searchResult[titlesMap[title]].push({
        name: title,
        snippet: '<div>' + results[title] + '</div>',
       })
      }
     } else {
      console.log(title)
     }
    }

    let sortedSearchResult = {}

    Object.keys(searchResult)
     .sort((a, b) => a.localeCompare(b))
     .forEach((key) => {
      let title = key.slice(3) + ` (${searchResult[key].length})`
      sortedSearchResult[title] = customSort(searchResult[key])
     })

    setSearchResults(sortedSearchResult)
    setSearchLoaded(true)
   } catch (error) {
    console.error('Error fetching data:', error)
   }
  }
  setSearchLoaded(false)
  fetchData()
 }, [searchText])

 const [isOnline, setIsOnline] = useState(navigator.onLine)

 useEffect(() => {
  const handleOnlineStatusChange = () => {
   setTimeout(() => {
    window.location.reload()
   }, 1000)
   setIsOnline(navigator.onLine)
  }

  window.addEventListener('online', handleOnlineStatusChange)
  window.addEventListener('offline', handleOnlineStatusChange)

  return () => {
   window.removeEventListener('online', handleOnlineStatusChange)
   window.removeEventListener('offline', handleOnlineStatusChange)
  }
 }, [])

 let noInternetPageHtml = (
  <div
   style={{
    height: '100%',
    width: '100%',
    padding: '10px',
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
   }}
  >
   <div>
    No Internet connection! But you can still access your highlights, notes and
    stats.
   </div>
  </div>
 )

 return (
  <IonApp>
   <IonMenu contentId="main-content">
    <IonHeader>
     <IonToolbar>
      <IonTitle>VaniTime App</IonTitle>
     </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
     <img src="https://vanimedia.org/w/images/0/08/CT16-001.JPG" />
     <IonItem
      onClick={() => {
       window.location = 'https://vanipedia.org/wiki/Main_Page'
      }}
     >
      <IonLabel>About</IonLabel>
     </IonItem>
    </IonContent>
   </IonMenu>

   <IonPage>
    <IonContent>
     <IonRouterOutlet>
      <Route path="/vanitime">
       {isOnline ? <VaniTimePage /> : noInternetPageHtml}
      </Route>
      <Route path="/vanibase">
       {isOnline ? (
        <VaniBase
         searchTextHook={{
          searchText,
          setSearchText,
         }}
         searchTextTHook={{
          searchTextT,
          setSearchTextT,
         }}
         searchResultsHook={{
          searchResults,
          setSearchResults,
         }}
         searchLoadedHook={{
          searchLoaded,
          setSearchLoaded,
         }}
        />
       ) : (
        noInternetPageHtml
       )}
      </Route>
      <Route path="/stats">
       <Stats />
      </Route>
      <Route path={'/history/:key'}>
       <History />
      </Route>
      <Route path={'/bookmarks'}>
       <BookmarkFolders />
      </Route>
      <Route path={'/setting'}>
       {isOnline ? <SettingPage /> : noInternetPageHtml}
      </Route>
      <Route path={'/lecture/:key'}>
       {isOnline ? <Audio /> : noInternetPageHtml}
      </Route>
      <Route path={'/purports/:key'}>
       {isOnline ? <Text /> : noInternetPageHtml}
      </Route>
      <Route path={'/lectureindex/:key'}>
       {isOnline ? <Lecture /> : noInternetPageHtml}
      </Route>
      <Route path={'/bookindex/:key'}>
       {isOnline ? <Book /> : noInternetPageHtml}
      </Route>
      <Route path={'/vanimedia'}>
       {isOnline ? (
        <VaniMedia
         videos={videos}
         audios={audios}
         images={images}
         imageQuotes={imageQuotes}
        />
       ) : (
        noInternetPageHtml
       )}
      </Route>

      <Route exact path="/">
       <Redirect to={`/${settings.home_page}`} />
      </Route>
     </IonRouterOutlet>
    </IonContent>
    {!`${location.pathname}`.includes('/lecture/') &&
    !`${location.pathname}`.includes('/purports/') ? (
     <IonFooter>
      <IonToolbar>
       <IonSegment value={currentTab}>
        <IonSegmentButton
         style={{ minWidth: 0 }}
         value="stats"
         onClick={() => history.push('/stats')}
        >
         <div
          style={{
           display: 'flex',
           flexWrap: 'wrap',
           alignItems: 'center',
          }}
         >
          <div
           style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            flexBasis: '100%',
            fontSize: '30px',
            marginTop: '5px',
           }}
          >
           <IonIcon icon={statsChartOutline} />
          </div>
          <div
           style={{
            flexBasis: '100%',
            fontSize: '10px',
           }}
          >
           <IonLabel>Stats</IonLabel>
          </div>
         </div>
        </IonSegmentButton>
        <IonSegmentButton
         style={{ minWidth: 0 }}
         value="vanibase"
         onClick={() => history.push('/vanibase')}
        >
         <div
          style={{
           display: 'flex',
           flexWrap: 'wrap',
           alignItems: 'center',
          }}
         >
          <div
           style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            flexBasis: '100%',
            fontSize: '30px',
            marginTop: '5px',
           }}
          >
           <IonIcon icon={bookOutline} />
          </div>
          <div
           style={{
            flexBasis: '100%',
            fontSize: '10px',
           }}
          >
           <IonLabel>VaniBase</IonLabel>
          </div>
         </div>
        </IonSegmentButton>
        <IonSegmentButton
         style={{ minWidth: 0 }}
         value="vanitime"
         onClick={() => history.push('/vanitime')}
        >
         <div
          style={{
           display: 'flex',
           flexWrap: 'wrap',
           alignItems: 'center',
          }}
         >
          <div
           style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            flexBasis: '100%',
            fontSize: '30px',
            marginTop: '5px',
           }}
          >
           <IonIcon icon={hourglassOutline} />
          </div>
          <div
           style={{
            flexBasis: '100%',
            fontSize: '10px',
           }}
          >
           <IonLabel>VaniTime</IonLabel>
          </div>
         </div>
        </IonSegmentButton>
        <IonSegmentButton
         style={{ minWidth: 0 }}
         value="vanimedia"
         onClick={() => history.push('/vanimedia')}
        >
         <div
          style={{
           display: 'flex',
           flexWrap: 'wrap',
           alignItems: 'center',
          }}
         >
          <div
           style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            flexBasis: '100%',
            fontSize: '30px',
            marginTop: '5px',
           }}
          >
           <IonIcon icon={albumsOutline} />
          </div>
          <div
           style={{
            flexBasis: '100%',
            fontSize: '10px',
           }}
          >
           <IonLabel>VaniMedia</IonLabel>
          </div>
         </div>
        </IonSegmentButton>

        <IonSegmentButton
         style={{ minWidth: 0 }}
         value="bookmarks"
         onClick={() => history.push('/bookmarks')}
        >
         <div
          style={{
           display: 'flex',
           flexWrap: 'wrap',
           alignItems: 'center',
          }}
         >
          <div
           style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            flexBasis: '100%',
            fontSize: '30px',
            marginTop: '5px',
           }}
          >
           <IonIcon icon={bookmarksOutline} />
          </div>
          <div
           style={{
            flexBasis: '100%',
            fontSize: '10px',
           }}
          >
           <IonLabel>Bookmarks</IonLabel>
          </div>
         </div>
        </IonSegmentButton>
       </IonSegment>
      </IonToolbar>
     </IonFooter>
    ) : null}

    <Modal
     isOpen={checkAlerts['purports']}
     onRequestClose={() => {
      setCheckAlerts((prev) => {
       let dum = { ...prev }
       dum['purports'] = false
       return dum
      })
      setIncompleteUserHistory('')
     }}
     style={customStyles}
     closeTimeoutMS={200}
    >
     <p style={{ margin: '10px' }}>Tick the verse which you have read</p>
     <div className="wrapper">
      {Object.entries(currentVersesMap).map(([verseKey, verseValue]) => {
       return (
        <IonItem>
         <IonLabel>{verseKey.replace(/_/g, ' ')}</IonLabel>
         <IonCheckbox
          checked={verseValue.checked}
          onIonChange={(e) => {
           setCurrentVersesMap((prev) => {
            let dum = { ...prev }
            dum[verseKey]['checked'] = e.detail.checked
            const now = new Date()
            const hours = String(now.getHours()).padStart(2, '0')
            const minutes = String(now.getMinutes()).padStart(2, '0')
            dum[verseKey]['time'] = `${hours}:${minutes}`
            let verseKeyParts = verseKey.split(/[_\.]/)
            if (
             verseKeyParts[0] != 'BG' &&
             verseKeyParts[0] != 'SB' &&
             verseKeyParts[0] != 'CC'
            ) {
             verseKeyParts = [
              'OB',
              verseKeyParts[0].startsWith('SSR') ? 'SSR' : verseKeyParts[0],
              verseKeyParts.join('_'),
             ]
            }
            let verse = booksMap[verseKeyParts[0]]
            for (let i = 1; i < verseKeyParts.length - 1; i++) {
             verse = verse['parts'][verseKeyParts[i]]
            }
            verse =
             verse['parts']['_' + verseKeyParts[verseKeyParts.length - 1]]
            dum[verseKey]['wc'] = verse['wc']
            return dum
           })
          }}
         />
        </IonItem>
       )
      })}
     </div>
     <div
      style={{
       display: 'flex',
       justifyContent: 'space-evenly',
       marginTop: '10px',
      }}
     >
      <IonButton
       onClick={() => {
        setCheckAlerts((prev) => {
         let dum = { ...prev }
         dum['purports'] = false
         return dum
        })
        setIncompleteUserHistory('')
       }}
      >
       Cancel
      </IonButton>
      <IonButton
       onClick={() => {
        setCurrentVersesMap((prev) => {
         let dum = { ...prev }
         for (let verseKey in dum) {
          dum[verseKey]['checked'] = true
          const now = new Date()
          const hours = String(now.getHours()).padStart(2, '0')
          const minutes = String(now.getMinutes()).padStart(2, '0')
          dum[verseKey]['time'] = `${hours}:${minutes}`
          let verseKeyParts = verseKey.split(/[_\.]/)
          if (
           verseKeyParts[0] != 'BG' &&
           verseKeyParts[0] != 'SB' &&
           verseKeyParts[0] != 'CC'
          ) {
           verseKeyParts = [
            'OB',
            verseKeyParts[0].startsWith('SSR') ? 'SSR' : verseKeyParts[0],
            verseKeyParts.join('_'),
           ]
          }
          let verse = booksMap[verseKeyParts[0]]
          for (let i = 1; i < verseKeyParts.length - 1; i++) {
           verse = verse['parts'][verseKeyParts[i]]
          }
          verse = verse['parts']['_' + verseKeyParts[verseKeyParts.length - 1]]
          dum[verseKey]['wc'] = verse['wc']
         }
         return dum
        })
        const button = document.getElementById('versesdone')
        if (button) button.click()
       }}
      >
       Select All
      </IonButton>
      <IonButton
       onClick={() => {
        setCheckAlerts((prev) => {
         let dum = { ...prev }
         dum['purports'] = false
         return dum
        })
        setUserHistory((prev) => {
         let dum = { ...prev }
         const now = new Date()
         const day = String(now.getDate()).padStart(2, '0')
         const month = String(now.getMonth() + 1).padStart(2, '0')
         const year = String(now.getFullYear())
         const date = day + '-' + month + '-' + year
         if (!dum[date]) dum[date] = {}
         for (let verse of Object.entries(currentVersesMap)) {
          if (verse[1]['checked'] && !verse[1]['done']) {
           if (!dum[date][verse[0]]) dum[date][verse[0]] = []
           dum[date][verse[0]].push({
            time: verse[1]['time'],
            wc: verse[1]['wc'],
           })
          }
          if (!verse[1]['checked'] && verse[1]['done']) {
           dum[date][verse[0]].pop()
           if (dum[date][verse[0]].length == 0) delete dum[date][verse[0]]
          }
         }
         return dum
        })
        setCurrentVersesMap((prev) => {
         let dum = { ...prev }
         for (let verse of Object.entries(dum)) {
          if (verse[1]['checked']) {
           verse[1]['done'] = true
          } else {
           verse[1]['done'] = false
          }
         }
         return dum
        })
        setBooksMap((prev) => {
         let dum = JSON.parse(JSON.stringify(prev))
         let book = ''
         let chap = ''
         let sub_chap = ''
         let verse = ''
         for (let verseObj of Object.entries(currentVersesMap)) {
          let verseKeyParts = verseObj[0].split(/[_\.]/)
          if (
           verseKeyParts[0] != 'BG' &&
           verseKeyParts[0] != 'SB' &&
           verseKeyParts[0] != 'CC'
          ) {
           verseKeyParts = [
            'OB',
            verseKeyParts[0].startsWith('SSR') ? 'SSR' : verseKeyParts[0],
            verseKeyParts.join('_'),
           ]
          }
          if (verseKeyParts.length == 3) {
           book = verseKeyParts[0]
           chap = verseKeyParts[1]
           verse = '_' + verseKeyParts[2]
           if (
            !dum[book]['parts'][chap]['parts'][verse]['read'] &&
            verseObj[1]['checked']
           )
            dum[book]['parts'][chap]['parts'][verse]['read'] = true
           if (
            !dum[book]['parts'][chap]['parts'][verse]['read'] &&
            !verseObj[1]['checked']
           )
            dum[book]['parts'][chap]['parts'][verse]['read'] = false
          }
          if (verseKeyParts.length == 4) {
           book = verseKeyParts[0]
           chap = verseKeyParts[1]
           sub_chap = verseKeyParts[2]
           verse = '_' + verseKeyParts[3]
           if (
            !dum[book]['parts'][chap]['parts'][sub_chap]['parts'][verse][
             'read'
            ] &&
            verseObj[1]['checked']
           )
            dum[book]['parts'][chap]['parts'][sub_chap]['parts'][verse][
             'read'
            ] = true
           if (
            !dum[book]['parts'][chap]['parts'][sub_chap]['parts'][verse][
             'read'
            ] &&
            !verseObj[1]['checked']
           )
            dum[book]['parts'][chap]['parts'][sub_chap]['parts'][verse][
             'read'
            ] = false
          }
         }
         return dum
        })
        setCurrentBook((prev) => {
         let dum = { ...prev }
         let finalVerse = ''
         for (let verse of Object.entries(currentVersesMap)) {
          if (finalVerse && !verse[1]['checked']) {
           break
          }
          if (finalVerse && verse[1]['checked']) {
           finalVerse = verse[0]
          }
          if (!finalVerse && verse[1]['checked']) {
           let verseKeyParts = verse[0].split(/[_\.]/)
           if (
            verseKeyParts[0] != 'BG' &&
            verseKeyParts[0] != 'SB' &&
            verseKeyParts[0] != 'CC'
           ) {
            verseKeyParts = [
             'OB',
             verseKeyParts[0].startsWith('SSR') ? 'SSR' : verseKeyParts[0],
             verseKeyParts.join('_'),
            ]
           }
           if (
            verseKeyParts.length == 3 &&
            dum['name'] == verseKeyParts[0] &&
            dum['part'] == verseKeyParts[1] &&
            dum['verse'] == verseKeyParts[2]
           )
            finalVerse = verse[0]
           if (
            verseKeyParts.length == 4 &&
            dum['name'] == verseKeyParts[0] &&
            dum['part'] == verseKeyParts[1] &&
            dum['sub_part'] == verseKeyParts[2] &&
            dum['verse'] == verseKeyParts[3]
           )
            finalVerse = verse[0]
          }
         }
         if (finalVerse) {
          finalVerse = findNextPurport(booksMap, finalVerse)
          if (!finalVerse) {
           dum['name'] = ''
           dum['part'] = ''
           dum['sub_part'] = ''
           dum['verse'] = ''
          } else {
           let verseKeyParts = finalVerse.split(/[_\.]/)
           if (
            verseKeyParts[0] != 'BG' &&
            verseKeyParts[0] != 'SB' &&
            verseKeyParts[0] != 'CC'
           ) {
            verseKeyParts = [
             'OB',
             verseKeyParts[0].startsWith('SSR') ? 'SSR' : verseKeyParts[0],
             verseKeyParts.join('_'),
            ]
           }
           if (verseKeyParts.length == 3) {
            dum['name'] = verseKeyParts[0]
            dum['part'] = verseKeyParts[1]
            dum['verse'] = verseKeyParts[2]
           }
           if (verseKeyParts.length == 4) {
            dum['name'] = verseKeyParts[0]
            dum['part'] = verseKeyParts[1]
            dum['sub_part'] = verseKeyParts[2]
            dum['verse'] = verseKeyParts[3]
           }
          }
         }
         return dum
        })
        setIncompleteUserHistory('')
       }}
       id="versesdone"
      >
       Done
      </IonButton>
     </div>
     <div style={{ margin: '5px 5px 0 5px', fontSize: '10px' }}>
      *You can turn off the alerts in settings
     </div>
    </Modal>

    <Modal
     isOpen={checkAlerts['lecture']}
     onRequestClose={() => {
      setCheckAlerts((prev) => {
       let dum = { ...prev }
       dum['lecture'] = false
       return dum
      })
      setIncompleteUserHistory('')
     }}
     style={customStyles}
     closeTimeoutMS={200}
    >
     <div style={{ textAlign: 'center', marginTop: '10px' }}>
      Have heard the Lecture?
     </div>
     <div className="wrapper">
      <p>{`${currentLecture}`.replace(/_/g, ' ')}</p>
     </div>
     <div
      style={{
       display: 'flex',
       justifyContent: 'space-evenly',
      }}
     >
      <IonButton
       onClick={() => {
        setCheckAlerts((prev) => {
         let dum = { ...prev }
         dum['lecture'] = false
         return dum
        })
        setIncompleteUserHistory('')
       }}
      >
       Not Listend
      </IonButton>
      <IonButton
       onClick={() => {
        setCheckAlerts((prev) => {
         let dum = { ...prev }
         dum['lecture'] = false
         return dum
        })

        setUserHistory((prev) => {
         let dum = { ...prev }
         const now = new Date()
         const hours = String(now.getHours()).padStart(2, '0')
         const minutes = String(now.getMinutes()).padStart(2, '0')
         const day = String(now.getDate()).padStart(2, '0')
         const month = String(now.getMonth() + 1).padStart(2, '0')
         const year = String(now.getFullYear())
         const date = day + '-' + month + '-' + year
         if (!dum[date]) dum[date] = {}
         if (!dum[date][currentLecture]) dum[date][currentLecture] = []
         let duration = 0
         for (let category of Object.entries(lecturesMap)) {
          for (let lecture of Object.entries(category[1]['parts'])) {
           if (lecture[0] == currentLecture) {
            duration = minutesToMinutes(lecture[1]['duration'])
           }
          }
         }
         dum[date][currentLecture].push({
          time: `${hours}:${minutes}`,
          duration,
         })
         return dum
        })
        setLecturesMap((prev) => {
         let dum = JSON.parse(JSON.stringify(prev))
         for (let category of Object.entries(dum)) {
          for (let lecture of Object.entries(category[1]['parts'])) {
           if (lecture[0] == currentLecture) {
            lecture[1]['read'] = true
           }
          }
         }
         return dum
        })

        setIncompleteUserHistory('')
       }}
      >
       Listend
      </IonButton>
     </div>
     <div style={{ margin: '5px 5px 0 5px', fontSize: '12px' }}>
      *You can turn off the alerts in settings
     </div>
    </Modal>
   </IonPage>
  </IonApp>
 )
}

export default App
