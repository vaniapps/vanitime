import {
 IonContent,
 IonHeader,
 IonPage,
 IonToolbar,
 IonItem,
 IonLabel,
 IonCheckbox,
 IonButtons,
 IonButton,
 IonIcon,
 IonChip,
 IonSpinner,
 IonRadio,
 IonRadioGroup,
 IonInput,
 IonToast,
 IonFabButton,
 IonFab,
 IonFabList,
 IonTextarea,
} from '@ionic/react'
import { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import axios from 'axios'
import '../styles.css'
import {
 Bookmarks,
 Books,
 CurrentBook,
 CurrentVersesMap,
 IncompleteUserHistory,
 Settings,
 UserHistory,
} from '../context'
import {
 arrowDownOutline,
 arrowUpOutline,
 checkboxOutline,
 chevronBackOutline,
 bookmarkOutline,
 colorPaletteOutline,
 folderOpenOutline,
 removeCircleOutline,
 documentTextOutline,
 brushOutline,
 timeOutline,
} from 'ionicons/icons'
import {
 findNextPurport,
 findPreviousPurport,
} from '../scripts/findNextPurports'
import Modal from 'react-modal'
import MaxPriorityDataStructure from '../scripts/priorityQueue'

function Text() {
 let { key } = useParams()
 const [focusElement, setFocusElement] = useState(
  key.lastIndexOf('@') != -1 ? key.slice(key.lastIndexOf('@') + 1) : ''
 )
 key = key.lastIndexOf('@') != -1 ? key.slice(0, key.lastIndexOf('@')) : key
 let history = useHistory()
 const [htmlContent, setHtmlContent] = useState('')
 const [userHistory, setUserHistory] = useContext(UserHistory)
 const [versesMap, setVersesMap] = useState({})
 const [booksMap, setBooksMap] = useContext(Books)
 const [tempBooksMap, setTempBooksMap] = useState({})
 const [alertsMap, setAlertsMap] = useState({
  user_history: false,
  bookmark_verses: false,
  bookmark_input: false,
 })
 const [incompleteUserHistory, setIncompleteUserHistory] = useContext(
  IncompleteUserHistory
 )
 const [currentBook, setCurrentBook] = useContext(CurrentBook)
 const [tempCurrentBook, setTempCurrentBook] = useState({})
 const [bookmarksMap, setBookmarksMap] = useContext(Bookmarks)
 const [bookmarkInput, setBookmarkInput] = useState({ radio: '', text: '' })
 const [toast, setToast] = useState('false')
 const [settings, setSettings] = useContext(Settings)
 const [toastMessageMap, setToastMessageMap] = useState({
  bookmark_verse: 'Please select atleast one verse to bookmark',
  bookmark_input:
   'Please select a boomark folder/input a new boomark folder name',
  added_read_later: 'Added to Read Later',
 })
 const [currentVersesMap, setCurrentVersesMap] = useContext(CurrentVersesMap)
 const [showHighlightButton, setShowHighlightButton] = useState(false)
 const [textBookmark, setTextBookmark] = useState({})
 const [bookmarkType, setBookmarkType] = useState('bookmarks')
 const [contentLoaded, setContentLoaded] = useState(0)
 const [tempHtmlContent, setTempHtmlContent] = useState('')
 const [editHighlightButton, setEditHighlightButton] = useState(false)
 const [selectedHighlight, setSelectedHighlight] = useState({})
 const [editNotes, setEditNotes] = useState(false)
 const [fabButtonActivated, setFabButtonActivated] = useState(false)
 const [searchWords, setSearchWords] = useState([])
 const [topVerseLoad, setTopVerseLoad] = useState(false)
 const [bottomVerseLoad, setBottomVerseLoad] = useState(false)
 useEffect(() => {
  setSearchWords(window.location.search)
 }, [])
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

 const parseXmlToHtml = (xmlData, verse) => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlData, 'text/xml')

  let textContent = xmlDoc.querySelector('text').textContent
  if (key.startsWith('BG') || key.startsWith('SB') || key.startsWith('CC'))
   textContent = textContent.slice(textContent.indexOf('<h4><span class'))
  else textContent = textContent.slice(textContent.indexOf('<p>'))
  textContent = textContent.slice(0, textContent.indexOf('<div style="float:'))
  textContent = textContent.replace(
   /<a\s+href="\/(?!wiki\/(BG|SB|CC))[^"][^>]*>/g,
   ''
  )
  textContent = textContent.replace(/<b*>/g, '')
  textContent = textContent.replace(/<br \/>/g, '')
  textContent = textContent.replace(/\/wiki/g, '/purports')
  textContent = textContent.replace(/_\(1972\)/g, '')
  textContent = textContent.replace(/<p><br \/>\n<\/p>/g, '')
  textContent = textContent.replace(/h4/g, 'dl')
  textContent = textContent.replace(/\bTEXT\s+\d+\b/, verse.replace('_', ' '))
  textContent = textContent.replace(/<i.*?>/g, '').replace(/<\/i>/g, '')
  textContent = textContent.replace(
   /<p[^>]*>(.*?)<a[^>]*>(.*?)<\/a>(.*?)<\/p>/g,
   ''
  )
  textContent = textContent
   .replace(/\[\<\/span>edit/g, '')
   .replace(/\]<\/span>/g, '')

  let parsedDocument = parser.parseFromString(textContent, 'text/html')
  let elements = parsedDocument.querySelectorAll('*')

  elements.forEach((element, index) => {
   if (element.tagName == 'P') {
    element.innerHTML =
     '<span>' +
     element.innerHTML
      .replace(/<a/g, '</span><a')
      .replace(/<\/a>/g, '</a><span>') +
     '</span>'
   }
  })

  textContent = parsedDocument.documentElement.outerHTML

  parsedDocument = parser.parseFromString(textContent, 'text/html')
  elements = parsedDocument.querySelectorAll('*')

  elements.forEach((element, index) => {
   if (element.hasAttribute('class')) {
    element.removeAttribute('class')
   }
   if (element.hasAttribute('id')) {
    element.removeAttribute('id')
   }

   element.setAttribute('id', `${verse}!${index + 1}`)
  })

  textContent = parsedDocument.documentElement.outerHTML

  const htmlData = textContent.replace(/"/g, '')
  return htmlData
 }

 useEffect(() => {
  const versesList = key.split(',') // Add your API URLs here
  let dumVersesMap = {}
  for (let verse of versesList) {
   dumVersesMap[verse] = {
    checked: false,
   }
  }
  setVersesMap(dumVersesMap)
  const fetchData = async () => {
   try {
    const fetchPromises = Object.keys(dumVersesMap).map((verse) => {
     return axios.get(
      'https://vanisource.org/w/api.php?action=parse&prop=text&format=xml&page=' +
       verse
     )
    })
    const responses = await Promise.all(fetchPromises)

    const parsedHtmlContents = responses.map((response, i) => {
     const xmlData = response.data
     return parseXmlToHtml(xmlData, Object.keys(dumVersesMap)[i])
    })
    setHtmlContent(parsedHtmlContents.join(' <br /> '))
    setTempHtmlContent(parsedHtmlContents.join(' <br /> '))
    setContentLoaded(contentLoaded + 1)
   } catch (error) {
    console.error('Error fetching data:', error)
   }
  }
  fetchData()
  if (settings.check_alerts != 'never') setIncompleteUserHistory('purports')
  setTempCurrentBook(JSON.parse(JSON.stringify(currentBook)))
  setTempBooksMap(JSON.parse(JSON.stringify(booksMap)))
 }, [])

 async function fetchVerse(verse, position) {
  try {
   const response = await axios.get(
    'https://vanisource.org/w/api.php?action=parse&prop=text&format=xml&page=' +
     verse
   )
   const xmlData = response.data
   let verseHtml = parseXmlToHtml(xmlData, verse)
   if (position == 'top') {
    setHtmlContent(verseHtml + ' <br/> ' + tempHtmlContent)
    setTempHtmlContent(verseHtml + ' <br/> ' + tempHtmlContent)
    setTopVerseLoad(false)
   }
   if (position == 'bottom') {
    setHtmlContent(tempHtmlContent + ' <br/> ' + verseHtml)
    setTempHtmlContent(tempHtmlContent + ' <br/> ' + verseHtml)
    setBottomVerseLoad(false)
   }
   setContentLoaded(contentLoaded + 1)
  } catch (error) {
   console.error('Error fetching data:', error)
  }
 }

 useEffect(() => {
  setCurrentVersesMap(JSON.parse(JSON.stringify(versesMap)))
 }, [versesMap])

 useEffect(() => {
  const containerDiv = document.getElementsByClassName('content-container')[0]
  if (containerDiv) {
   function onSelect() {
    if (searchWords) {
     setSearchWords('')
    }
    const selection = window.getSelection()
    const selectedText = selection.toString()
    if (selectedText) {
     setShowHighlightButton(true)
     let anchorId = selection.anchorNode.parentElement.id
     let focusId = selection.focusNode.parentElement.id
     let startVerse = anchorId.slice(0, anchorId.indexOf('!'))
     let endVerse = focusId.slice(0, focusId.indexOf('!'))
     let anchorOffset = selection.anchorOffset
     let focusOffset = selection.focusOffset
     let allVerses = [...Object.keys(versesMap)].join(',')
     let selectedVerses = allVerses.slice(
      allVerses.indexOf(startVerse),
      allVerses.indexOf(endVerse) + endVerse.length
     )
     if (
      selection.anchorNode.parentElement.className.startsWith('highlight') ||
      selection.anchorNode.parentElement.className == 'non-highlight'
     ) {
      anchorOffset += parseInt(
       anchorId.slice(
        anchorId.indexOf('*') + 1,
        anchorId.indexOf('^') != -1 ? anchorId.indexOf('^') : anchorId.length
       )
      )
      anchorId = anchorId.slice(0, anchorId.indexOf('*'))
     }
     if (
      selection.focusNode.parentElement.className.startsWith('highlight') ||
      selection.focusNode.parentElement.className == 'non-highlight'
     ) {
      focusOffset += parseInt(
       focusId.slice(
        focusId.indexOf('*') + 1,
        focusId.indexOf('^') != -1 ? focusId.indexOf('^') : focusId.length
       )
      )
      focusId = focusId.slice(0, focusId.indexOf('*'))
     }
     setTimeout(() => {
      setTextBookmark({
       name: selectedVerses,
       type: 'verse',
       text: selectedText,
       start_id: anchorId,
       end_id: focusId,
       start_index: anchorOffset,
       end_index: focusOffset,
       color: settings.highlights_color,
       timestamp: new Date().toISOString(),
      })
     }, 1)

     setTimeout(() => {
      if (!window.getSelection().toString()) setShowHighlightButton(false)
     }, 1)
    } else {
     setShowHighlightButton(false)
    }
   }
   containerDiv.addEventListener('mouseup', () => {
    onSelect()
   })
   containerDiv.addEventListener('touchend', () => {
    onSelect()
   })

   containerDiv.addEventListener('click', (event) => {
    const clickedElement = event.target
    if (clickedElement.id.includes('@notes')) {
     for (let bookmark of Object.entries(bookmarksMap)) {
      for (let i = 0; i < bookmark[1]['children'].length; i++) {
       if (
        bookmark[1]['children'][i].timestamp ==
        clickedElement.id.slice(
         clickedElement.id.indexOf('^') + 1,
         clickedElement.id.indexOf('@')
        )
       ) {
        setTextBookmark(bookmark[1]['children'][i])
        setBookmarkType('notes')
        setBookmarkInput((prev) => {
         let dum = { ...prev }
         dum['radio'] = bookmark[0]
         return dum
        })
        setAlertsMap((prev) => {
         let dum = { ...prev }
         dum['bookmark_input'] = true
         return dum
        })
        setEditHighlightButton(false)
        setEditNotes(true)
        break
       }
      }
     }
    } else if (
     !clickedElement.id.includes('@notes') &&
     clickedElement.className.startsWith('highlight')
    ) {
     setEditHighlightButton(false)
     setTimeout(() => {
      setEditHighlightButton(true)
     }, 100)
     let elementId = clickedElement.id
     for (let bookmark of Object.entries(bookmarksMap)) {
      for (let i = 0; i < bookmark[1]['children'].length; i++) {
       if (
        bookmark[1]['children'][i].timestamp ==
        clickedElement.id.slice(clickedElement.id.indexOf('^') + 1)
       ) {
        setSelectedHighlight({
         color: '#' + clickedElement.className.slice(9),
         folder: bookmark[0],
         timestamp: elementId.slice(elementId.lastIndexOf('^') + 1),
        })
        setTextBookmark(bookmark[1]['children'][i])
        break
       }
      }
     }
    } else {
     setEditHighlightButton(false)
     setSelectedHighlight({})
    }
    setFabButtonActivated(false)
   })
  }
  if (focusElement) {
   setTimeout(() => {
    const parser = new DOMParser()
    const parsedDocument = parser.parseFromString(htmlContent, 'text/html')
    const elements = parsedDocument.querySelectorAll('*')
    for (let element of elements) {
     if (
      element.getAttribute('id') &&
      element.getAttribute('id').startsWith(focusElement)
     ) {
      let focusedElement = document.getElementById(element.getAttribute('id'))
      if (focusedElement) {
       focusedElement.scrollIntoView({
        behavior: 'smooth',
       })
       setFocusElement('')
       break
      }
     }
    }
   }, 1)
  }
 }, [htmlContent])

 useEffect(() => {
  if (contentLoaded >= 1) {
   let highlights = {}

   function colorHtml() {
    const parser = new DOMParser()
    const parsedDocument = parser.parseFromString(tempHtmlContent, 'text/html')
    const elements = parsedDocument.querySelectorAll('*')
    for (let element of elements) {
     let elementId = element.getAttribute('id')
     if (highlights[elementId]) {
      const originalHTML = element.innerHTML
      let modifiedHTML =
       highlights[elementId][0][0] != 0
        ? `<span id=${elementId}*0 class="non-highlight">${originalHTML.substring(
           0,
           highlights[elementId][0][0]
          )}</span>`
        : ''
      for (let i = 0; i < highlights[elementId].length; i++) {
       if (!highlights[elementId][i][4])
        modifiedHTML += `<span id=${elementId}*${highlights[elementId][i][0]}^${
         highlights[elementId][i][3]
        } class=${
         highlights[elementId][i][2]
          ? 'highlight' + highlights[elementId][i][2].slice(1)
          : 'non-highlight'
        }>${originalHTML.substring(
         highlights[elementId][i][0],
         highlights[elementId][i][1]
        )}</span>`
       else
        modifiedHTML += `<svg id=${elementId}*${highlights[elementId][i][1]}^${highlights[elementId][i][4]}@notes style="user-select=none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="15" height="15">
              <path id=${elementId}*${highlights[elementId][i][1]}^${highlights[elementId][i][4]}@notes style="user-select=none" d="M352 0H80C53.49 0 32 21.49 32 48v416c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V160L352 0zM192 64h160c8.837 0 16 7.163 16 16s-7.163 16-16 16H192c-8.837 0-16-7.163-16-16s7.163-16 16-16zm-64 64h224c8.837 0 16 7.163 16 16s-7.163 16-16 16H128c-8.837 0-16-7.163-16-16s7.163-16 16-16zm0 64h224c8.837 0 16 7.163 16 16s-7.163 16-16 16H128c-8.837 0-16-7.163-16-16s7.163-16 16-16zm0 64h160c8.837 0 16 7.163 16 16s-7.163 16-16 16H128c-8.837 0-16-7.163-16-16s7.163-16 16-16z" fill="#FFD700"/>
            </svg>`
       if (
        i < highlights[elementId].length - 1 &&
        highlights[elementId][i][1] < highlights[elementId][i + 1][0]
       )
        modifiedHTML += `<span id=${elementId}*${
         highlights[elementId][i][1]
        } class="non-highlight">${originalHTML.substring(
         highlights[elementId][i][1],
         highlights[elementId][i + 1][0]
        )}</span>`
      }
      modifiedHTML +=
       highlights[elementId][highlights[elementId].length - 1][1] !=
       originalHTML.length
        ? `<span id=${elementId}*${
           highlights[elementId][highlights[elementId].length - 1][1]
          } class="non-highlight">${originalHTML.substring(
           highlights[elementId][highlights[elementId].length - 1][1],
           originalHTML.length
          )}</span>`
        : ''
      element.innerHTML = modifiedHTML
     }
    }
    let textContent = parsedDocument.documentElement.outerHTML
    if (searchWords) {
     let wordsMap = {}
     searchWords
      .slice(4)
      .split('|')
      .forEach((word) => {
       wordsMap[word] = true
      })
     Object.keys(wordsMap).forEach((word) => {
      let pattern = new RegExp(`\\b${word}\\b`, 'g')
      textContent = textContent.replace(
       pattern,
       "<span class='searchtext'>" + word + '</span>'
      )
     })
    }
    setHtmlContent(textContent)
   }

   function makehighlights(
    text,
    start_id,
    end_id,
    start_index,
    end_index,
    color,
    timestamp
   ) {
    let startColoring = false
    // if(!htmlContent.includes(start_id)) startColoring = true
    const parser = new DOMParser()
    const parsedDocument = parser.parseFromString(tempHtmlContent, 'text/html')
    const elements = parsedDocument.querySelectorAll('*')
    for (let element of elements) {
     let elementId = element.getAttribute('id')
     if (element.childElementCount > 0) continue
     if (element.getAttribute('id') == start_id && color != 'notes') {
      if (start_id == end_id) {
       if (highlights[elementId]) {
        highlights[elementId].push([start_index, end_index, color, timestamp])
       } else {
        highlights[elementId] = [[start_index, end_index, color, timestamp]]
       }
       break
      } else {
       if (highlights[elementId]) {
        highlights[elementId].push([
         start_index,
         element.textContent.length,
         color,
         timestamp,
        ])
       } else {
        highlights[elementId] = [
         [start_index, element.textContent.length, color, timestamp],
        ]
       }
      }
      startColoring = true
      continue
     }
     if (element.getAttribute('id') == end_id) {
      if (highlights[elementId]) {
       highlights[elementId].push([0, end_index, color, timestamp])
      } else {
       highlights[elementId] = [[0, end_index, color, timestamp]]
      }
      break
     }
     if (startColoring && color != 'notes') {
      if (highlights[elementId]) {
       highlights[elementId].push([
        0,
        element.textContent.length,
        color,
        timestamp,
       ])
      } else {
       highlights[elementId] = [
        [0, element.textContent.length, color, timestamp],
       ]
      }
     }
    }
   }

   for (let key of Object.keys(bookmarksMap)) {
    if (bookmarksMap[key]['children'])
     for (let bookmark of bookmarksMap[key]['children']) {
      if (bookmark['text']) {
       for (let verse of Object.keys(versesMap)) {
        if (bookmark['name'].includes(verse)) {
         makehighlights(
          bookmark['text'],
          bookmark['start_id'],
          bookmark['end_id'],
          bookmark['start_index'],
          bookmark['end_index'],
          bookmark['color'] ?? 'notes',
          bookmark['timestamp']
         )
         break
        }
       }
      }
     }
   }

   for (let highlight of Object.entries(highlights)) {
    let element = highlight[1]
    let operateArray = []
    let resultArray = []
    for (let i = 0; i < element.length; i++) {
     if (element[i][2] != 'notes') {
      operateArray.push([element[i][0], 's', element[i][2], element[i][3]])
      operateArray.push([element[i][1], 'e', element[i][2], element[i][3]])
     } else {
      operateArray.push([element[i][1], 's', element[i][2], element[i][3]])
      operateArray.push([element[i][1], 'e', element[i][2], element[i][3]])
     }
    }
    operateArray.sort((a, b) => {
     if (a[0] == b[0]) {
      if (a[1] == 's') return -1
      if (b[1] == 's') return 1
      if (a[2] == 'notes') return -1
      if (b[2] == 'notes') return 1
      return 0
     }
     return a[0] - b[0]
    })
    let priorityQueue = new MaxPriorityDataStructure()

    for (let i = 0; i < operateArray.length - 1; i++) {
     if (operateArray[i][1] == 's' && operateArray[i + 1][1] == 's') {
      let color =
       priorityQueue.size() &&
       new Date(priorityQueue.getMax()['timestamp']) >
        new Date(operateArray[i][3])
        ? priorityQueue.getMax()['value']
        : operateArray[i][2]
      let timestamp =
       priorityQueue.size() &&
       new Date(priorityQueue.getMax()['timestamp']) >
        new Date(operateArray[i][3])
        ? priorityQueue.getMax()['timestamp']
        : operateArray[i][3]
      resultArray.push([
       operateArray[i][0],
       operateArray[i + 1][0],
       color,
       timestamp,
      ])
      if (operateArray[i][2] != 'notes')
       priorityQueue.insert({
        value: operateArray[i][2],
        priority: new Date(operateArray[i][3]),
        timestamp: operateArray[i][3],
       })
     }
     if (operateArray[i][1] == 's' && operateArray[i + 1][1] == 'e') {
      let color =
       new Date(operateArray[i][3]) > new Date(operateArray[i + 1][3])
        ? operateArray[i][2]
        : operateArray[i + 1][2]
      let timestamp =
       new Date(operateArray[i][3]) > new Date(operateArray[i + 1][3])
        ? operateArray[i][3]
        : operateArray[i + 1][3]
      color =
       priorityQueue.size() &&
       new Date(priorityQueue.getMax()['timestamp']) > new Date(timestamp)
        ? priorityQueue.getMax()['value']
        : color
      timestamp =
       priorityQueue.size() &&
       new Date(priorityQueue.getMax()['timestamp']) > new Date(timestamp)
        ? priorityQueue.getMax()['timestamp']
        : timestamp
      resultArray.push([
       operateArray[i][0],
       operateArray[i + 1][0],
       color,
       timestamp,
       operateArray[i + 1][2] == 'notes' ? operateArray[i + 1][3] : null,
      ])
      if (operateArray[i][2] != 'notes')
       priorityQueue.insert({
        value: operateArray[i][2],
        priority: new Date(operateArray[i][3]),
        timestamp: operateArray[i][3],
       })
     }
     if (operateArray[i][1] == 'e' && operateArray[i + 1][1] == 's') {
      priorityQueue.remove(new Date(operateArray[i][3]))
      let color = priorityQueue.size() ? priorityQueue.getMax()['value'] : ''
      let timestamp = priorityQueue.size()
       ? priorityQueue.getMax()['timestamp']
       : ''
      resultArray.push([
       operateArray[i][0],
       operateArray[i + 1][0],
       color,
       timestamp,
      ])
     }
     if (operateArray[i][1] == 'e' && operateArray[i + 1][1] == 'e') {
      priorityQueue.remove(new Date(operateArray[i][3]))
      let color =
       priorityQueue.size() &&
       new Date(priorityQueue.getMax()['timestamp']) >
        new Date(operateArray[i + 1][3])
        ? priorityQueue.getMax()['value']
        : operateArray[i + 1][2]
      let timestamp =
       priorityQueue.size() &&
       new Date(priorityQueue.getMax()['timestamp']) >
        new Date(operateArray[i + 1][3])
        ? priorityQueue.getMax()['timestamp']
        : operateArray[i + 1][3]
      resultArray.push([
       operateArray[i][0],
       operateArray[i + 1][0],
       color,
       timestamp,
      ])
     }
    }
    if (resultArray.length == 0) delete highlights[highlight[0]]
    highlights[highlight[0]] = resultArray
   }
   colorHtml()
  }
 }, [contentLoaded, bookmarksMap, searchWords])

 function setHighlightColor(color) {
  setSettings((prev) => {
   let dum = { ...prev }
   dum.highlights_color = color
   return dum
  })
 }

 function editHighlightColor(color) {
  setBookmarksMap((prev) => {
   let dum = { ...prev }
   for (let bookmark of Object.entries(dum)) {
    for (let i = 0; i < bookmark[1]['children'].length; i++) {
     if (bookmark[1]['children'][i].timestamp == selectedHighlight.timestamp) {
      dum[bookmark[0]]['children'][i].color = color
      break
     }
    }
   }
   return dum
  })
  setSettings((prev) => {
   let dum = { ...prev }
   dum.highlights_color = color
   return dum
  })
  setEditHighlightButton(false)
 }

 return (
  <IonPage>
   <IonHeader>
    <IonToolbar>
     <IonButtons slot="start">
      <IonButton
       onClick={() => {
        if (history.length > 1) {
         history.goBack()
        } else {
         history.push('/')
        }
       }}
      >
       <IonIcon icon={chevronBackOutline}></IonIcon>
      </IonButton>
     </IonButtons>
     <IonButtons style={{ width: '80%' }} slot="start">
      <IonLabel>
       {key.split(',')[0].replace(/_/g, ' ')}
       {key.split(',').length > 1
        ? ' to ' + key.split(',')[key.split(',').length - 1].replace(/_/g, ' ')
        : ''}
      </IonLabel>
     </IonButtons>
     <IonButtons slot="end">
      <IonButton
       onClick={() => {
        setAlertsMap((prev) => {
         let dum = { ...prev }
         dum['user_history'] = true
         return dum
        })
       }}
       style={{ marginRight: '5px' }}
      >
       <IonIcon icon={checkboxOutline}></IonIcon>
      </IonButton>
     </IonButtons>
     <IonButtons slot="end">
      <IonButton
       onClick={() => {
        setBookmarksMap((prev) => {
         let dum = { ...prev }
         dum['Read-Later']['children'].push({
          name: [...Object.keys(versesMap)].join(','),
          type: 'verse',
          isChecked: false,
         })
         return dum
        })
        setToast('added_read_later')
       }}
      >
       <IonIcon icon={timeOutline}></IonIcon>
      </IonButton>
     </IonButtons>

     <IonButtons slot="end">
      <IonButton
       onClick={() => {
        setBookmarkType('bookmarks')
        setBookmarkInput((prev) => {
         let dum = { ...prev }
         dum['radio'] = settings.bookmarks_folder
         return dum
        })
        setAlertsMap((prev) => {
         let dum = { ...prev }
         dum['bookmark_verses'] = true
         return dum
        })
       }}
       style={{ marginRight: '7px' }}
      >
       <IonIcon icon={bookmarkOutline}></IonIcon>
      </IonButton>
     </IonButtons>
    </IonToolbar>
   </IonHeader>
   <IonContent className="ion-padding">
    {htmlContent != '' ? (
     <>
      {Object.entries(versesMap).length > 0 &&
      findPreviousPurport(booksMap, Object.entries(versesMap)[0][0]) ? (
       <IonChip
        onClick={() => {
         if (!topVerseLoad) {
          let verse = findPreviousPurport(
           booksMap,
           Object.entries(versesMap)[0][0]
          )
          setTopVerseLoad(true)
          fetchVerse(verse, 'top')
          setVersesMap((prev) => {
           let prevVerse = {}
           prevVerse[verse] = { checked: false }
           let dum = { ...prevVerse, ...prev }
           return dum
          })
         }
        }}
        style={{
         backgroundColor: settings.theme == 'light' ? '#DDDDDD' : '#E0E0E0',
        }}
       >
        <>
         {topVerseLoad ? (
          <IonSpinner></IonSpinner>
         ) : (
          <>
           <IonLabel>
            {Object.entries(versesMap).length > 0
             ? findPreviousPurport(
                booksMap,
                Object.entries(versesMap)[0][0]
               ).replace(/_/g, ' ')
             : ''}
           </IonLabel>
           <IonIcon icon={arrowUpOutline}></IonIcon>
          </>
         )}
        </>
       </IonChip>
      ) : null}
      <div style={{ fontSize: settings.font_size }}>
       <div
        className="content-container"
        dangerouslySetInnerHTML={{
         __html: htmlContent,
        }}
       />
      </div>
      <div style={{ textAlign: 'right' }}>
       {Object.entries(versesMap).length > 0 &&
       findNextPurport(
        booksMap,
        Object.entries(versesMap)[Object.entries(versesMap).length - 1][0]
       ) ? (
        <IonChip
         onClick={() => {
          if (!bottomVerseLoad) {
           let verse = findNextPurport(
            booksMap,
            Object.entries(versesMap)[Object.entries(versesMap).length - 1][0]
           )
           setBottomVerseLoad(true)
           fetchVerse(verse, 'bottom')
           setVersesMap((prev) => {
            let nextVerse = {}
            nextVerse[verse] = { checked: false }
            let dum = { ...prev, ...nextVerse }
            return dum
           })
          }
         }}
         style={{
          backgroundColor: settings.theme == 'light' ? '#DDDDDD' : '#E0E0E0',
         }}
        >
         <>
          {bottomVerseLoad ? (
           <IonSpinner></IonSpinner>
          ) : (
           <>
            <IonLabel>
             {Object.entries(versesMap).length > 0
              ? findNextPurport(
                 booksMap,
                 Object.entries(versesMap)[
                  Object.entries(versesMap).length - 1
                 ][0]
                ).replace(/_/g, ' ')
              : ''}
            </IonLabel>
            <IonIcon icon={arrowDownOutline}></IonIcon>
           </>
          )}
         </>
        </IonChip>
       ) : null}
      </div>
     </>
    ) : (
     <div
      style={{
       height: '100%',
       width: '100%',
       display: 'flex',
       justifyContent: 'center',
       alignItems: 'center',
      }}
     >
      <IonSpinner />
     </div>
    )}

    <>
     {showHighlightButton ? (
      <>
       <div
        className="noselect"
        style={{
         display: 'flex',
         flexDirection: 'column',
         justifyContent: 'center',
         alignItems: 'center',
         position: 'fixed',
         bottom: '5px',
         left: '10px',
        }}
       >
        <IonFabButton
         onTouchStart={() => {
          setBookmarkType('notes')
          setBookmarkInput((prev) => {
           let dum = { ...prev }
           dum['radio'] = settings.notes_folder
           return dum
          })
          setAlertsMap((prev) => {
           let dum = { ...prev }
           dum['bookmark_input'] = true
           return dum
          })
          setEditHighlightButton(false)
         }}
         onClick={() => {
          setBookmarkType('notes')
          setBookmarkInput((prev) => {
           let dum = { ...prev }
           dum['radio'] = settings.notes_folder
           return dum
          })
          setAlertsMap((prev) => {
           let dum = { ...prev }
           dum['bookmark_input'] = true
           return dum
          })
          setEditHighlightButton(false)
         }}
        >
         <IonIcon icon={documentTextOutline}></IonIcon>
        </IonFabButton>
       </div>
       <div
        className="noselect"
        style={{
         display: 'flex',
         flexDirection: 'column',
         justifyContent: 'center',
         alignItems: 'center',
         position: 'fixed',
         bottom: '5px',
         right: '10px',
        }}
       >
        <IonFabButton
         onTouchStart={() => {
          let modidfiedTextBookmark = {
           ...textBookmark,
          }
          modidfiedTextBookmark.color = settings.highlights_color
          setBookmarksMap((prev) => {
           let dum = { ...prev }
           let bookmark_folder_name = settings.highlights_folder
           dum[bookmark_folder_name]['children'].push(modidfiedTextBookmark)
           return dum
          })
          setShowHighlightButton(false)
          setEditHighlightButton(false)
          const timerInterval = setInterval(() => {
           setEditHighlightButton(false)
          }, 1)
          setTimeout(() => {
           clearInterval(timerInterval)
          }, 500)
         }}
         style={{ marginBottom: '35px' }}
         onClick={(e) => {
          let modidfiedTextBookmark = {
           ...textBookmark,
          }
          modidfiedTextBookmark.color = settings.highlights_color
          setBookmarksMap((prev) => {
           let dum = { ...prev }
           let bookmark_folder_name = settings.highlights_folder
           dum[bookmark_folder_name]['children'].push(modidfiedTextBookmark)
           return dum
          })
          setShowHighlightButton(false)
          setEditHighlightButton(false)
         }}
        >
         <div
          style={{
           backgroundColor: settings.highlights_color,
           borderRadius: '50%',
           height: '100%',
           width: '100%',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
          }}
         >
          <IonIcon style={{ fontSize: '30px' }} icon={brushOutline}></IonIcon>
         </div>
        </IonFabButton>

        <IonFab
         onTouchStart={() => {
          if (fabButtonActivated) setFabButtonActivated(false)
          else setFabButtonActivated(true)
         }}
         activated={fabButtonActivated}
        >
         <IonFabButton>
          <IonIcon icon={colorPaletteOutline}></IonIcon>
         </IonFabButton>
         <IonFabList side="start">
          <IonFabButton
           onTouchStart={() => {
            setHighlightColor('#66B2FF')
           }}
           onClick={() => {
            setHighlightColor('#66B2FF')
           }}
          >
           <div
            style={{
             backgroundColor: '#66B2FF',
             height: '100%',
             width: '100%',
            }}
           ></div>
          </IonFabButton>
          <IonFabButton
           onTouchStart={() => {
            setHighlightColor('#EFD610')
           }}
           onClick={() => {
            setHighlightColor('#EFD610')
           }}
          >
           <div
            style={{
             backgroundColor: '#EFD610',
             height: '100%',
             width: '100%',
            }}
           ></div>
          </IonFabButton>
          <IonFabButton
           onTouchStart={() => {
            setHighlightColor('#2ECC71')
           }}
           onClick={() => {
            setHighlightColor('#2ECC71')
           }}
          >
           <div
            style={{
             backgroundColor: '#2ECC71',
             height: '100%',
             width: '100%',
            }}
           ></div>
          </IonFabButton>
         </IonFabList>
        </IonFab>

        <IonFabButton
         style={{ marginTop: '35px' }}
         onTouchStart={() => {
          setBookmarkType('highlights')
          setBookmarkInput((prev) => {
           let dum = { ...prev }
           dum['radio'] = settings.highlights_folder
           return dum
          })
          setAlertsMap((prev) => {
           let dum = { ...prev }
           dum['bookmark_input'] = true
           return dum
          })
          setEditHighlightButton(false)
         }}
         onClick={() => {
          setBookmarkType('highlights')
          setBookmarkInput((prev) => {
           let dum = { ...prev }
           dum['radio'] = settings.highlights_folder
           return dum
          })
          setAlertsMap((prev) => {
           let dum = { ...prev }
           dum['bookmark_input'] = true
           return dum
          })
          setEditHighlightButton(false)
         }}
        >
         <div
          style={{
           display: 'flex',
           flexDirection: 'column',
           justifyContent: 'center',
           alignItems: 'center',
          }}
         >
          <IonIcon
           style={{ fontSize: '30px' }}
           icon={folderOpenOutline}
          ></IonIcon>
          <IonLabel style={{ fontSize: '10px' }}>
           {settings.highlights_folder.slice(
            0,
            settings.highlights_folder.lastIndexOf('-')
           )}
          </IonLabel>
         </div>
        </IonFabButton>
       </div>
      </>
     ) : null}
    </>

    <>
     {editHighlightButton && !showHighlightButton ? (
      <div
       style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        position: 'fixed',
        bottom: '5px',
        right: '10px',
       }}
      >
       <IonFabButton
        style={{ marginBottom: '35px' }}
        onClick={() => {
         setBookmarksMap((prev) => {
          let dum = { ...prev }
          for (let bookmark of Object.entries(dum)) {
           for (let i = 0; i < bookmark[1]['children'].length; i++) {
            if (
             bookmark[1]['children'][i].timestamp == selectedHighlight.timestamp
            ) {
             dum[bookmark[0]]['children'].splice(i, 1)
             break
            }
           }
          }
          return dum
         })
         setEditHighlightButton(false)
        }}
       >
        <IonIcon icon={removeCircleOutline}></IonIcon>
       </IonFabButton>

       <IonFab>
        <IonFabButton>
         <div
          style={{
           backgroundColor: selectedHighlight.color,
           borderRadius: '50%',
           height: '100%',
           width: '100%',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
          }}
         >
          <IonIcon
           style={{ fontSize: '30px' }}
           icon={colorPaletteOutline}
          ></IonIcon>
         </div>
        </IonFabButton>
        <IonFabList side="start">
         <IonFabButton
          onClick={() => {
           editHighlightColor('#66B2FF')
          }}
         >
          <div
           style={{
            backgroundColor: '#66B2FF',
            height: '100%',
            width: '100%',
           }}
          ></div>
         </IonFabButton>
         <IonFabButton
          onClick={() => {
           editHighlightColor('#EFD610')
          }}
         >
          <div
           style={{
            backgroundColor: '#EFD610',
            height: '100%',
            width: '100%',
           }}
          ></div>
         </IonFabButton>
         <IonFabButton
          onClick={() => {
           editHighlightColor('#2ECC71')
          }}
         >
          <div
           style={{
            backgroundColor: '#2ECC71',
            height: '100%',
            width: '100%',
           }}
          ></div>
         </IonFabButton>
        </IonFabList>
       </IonFab>

       <IonFabButton
        style={{ marginTop: '35px' }}
        onClick={() => {
         setBookmarkType('highlights')
         setBookmarkInput((prev) => {
          let dum = { ...prev }
          dum['radio'] = selectedHighlight.folder
          return dum
         })
         setAlertsMap((prev) => {
          let dum = { ...prev }
          dum['bookmark_input'] = true
          return dum
         })
         setEditHighlightButton(false)
        }}
       >
        <div
         style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
         }}
        >
         <IonIcon
          style={{ fontSize: '30px' }}
          icon={folderOpenOutline}
         ></IonIcon>
         <IonLabel style={{ fontSize: '10px' }}>
          {selectedHighlight.folder.slice(
           0,
           selectedHighlight.folder.lastIndexOf('-')
          )}
         </IonLabel>
        </div>
       </IonFabButton>
      </div>
     ) : null}
    </>
    <Modal
     isOpen={alertsMap['user_history']}
     onRequestClose={() => {
      setAlertsMap((prev) => {
       let dum = { ...prev }
       dum['user_history'] = false
       return dum
      })
     }}
     style={customStyles}
     closeTimeoutMS={200}
    >
     <p style={{ margin: '10px' }}>Tick the verse which you have read</p>
     <div className="wrapper">
      {Object.entries(versesMap).map(([verseKey, verseValue]) => {
       return (
        <IonItem>
         <IonLabel>{verseKey.replace(/_/g, ' ')}</IonLabel>
         <IonCheckbox
          checked={verseValue.checked}
          onIonChange={(e) => {
           setVersesMap((prev) => {
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
        setAlertsMap((prev) => {
         let dum = { ...prev }
         dum['user_history'] = false
         return dum
        })
       }}
      >
       Cancel
      </IonButton>
      <IonButton
       onClick={() => {
        setVersesMap((prev) => {
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
        setAlertsMap((prev) => {
         let dum = { ...prev }
         dum['user_history'] = false
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
         for (let verse of Object.entries(versesMap)) {
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
        setVersesMap((prev) => {
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
         let dum = JSON.parse(JSON.stringify(tempBooksMap))
         let book = ''
         let chap = ''
         let sub_chap = ''
         let verse = ''
         for (let verseObj of Object.entries(versesMap)) {
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
         let dum = { ...tempCurrentBook }
         let finalVerse = ''
         for (let verse of Object.entries(versesMap)) {
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

        if (settings.check_alerts == 'manual') setIncompleteUserHistory('')
       }}
       id="versesdone"
      >
       Done
      </IonButton>
     </div>
    </Modal>

    <Modal
     isOpen={alertsMap['bookmark_verses']}
     onRequestClose={() => {
      setAlertsMap((prev) => {
       let dum = { ...prev }
       dum['bookmark_verses'] = false
       return dum
      })
     }}
     style={customStyles}
     closeTimeoutMS={200}
    >
     <p style={{ margin: '10px' }}>Tick the verse which you want to bookmark</p>
     <div className="wrapper">
      {Object.entries(versesMap).map(([verseKey, verseValue]) => {
       return (
        <IonItem>
         <IonLabel>{verseKey.replace(/_/g, ' ')}</IonLabel>
         <IonCheckbox
          checked={verseValue.bookmarked}
          onIonChange={(e) => {
           setVersesMap((prev) => {
            let dum = { ...prev }
            dum[verseKey]['bookmarked'] = e.detail.checked
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
        setAlertsMap((prev) => {
         let dum = { ...prev }
         dum['bookmark_verses'] = false
         return dum
        })
        setVersesMap((prev) => {
         let dum = { ...prev }
         for (let verse of Object.entries(versesMap)) {
          dum[verse[0]]['bookmarked'] = false
         }
         return dum
        })
       }}
      >
       Cancel
      </IonButton>
      <IonButton
       onClick={() => {
        let bookmarkFound = false
        for (let verse of Object.entries(versesMap)) {
         if (verse[1]['bookmarked']) {
          bookmarkFound = true
          break
         }
        }
        if (!bookmarkFound) {
         setToast('bookmark_verse')
         return
        }
        setAlertsMap((prev) => {
         let dum = { ...prev }
         dum['bookmark_verses'] = false
         dum['bookmark_input'] = true
         return dum
        })
       }}
      >
       Done
      </IonButton>
     </div>
    </Modal>

    <Modal
     isOpen={alertsMap['bookmark_input']}
     onRequestClose={() => {
      setAlertsMap((prev) => {
       let dum = { ...prev }
       dum['bookmark_input'] = false
       return dum
      })
      setBookmarkInput((prev) => {
       let dum = { ...prev }
       dum['radio'] = ''
       dum['text'] = ''
       return dum
      })
      setVersesMap((prev) => {
       let dum = { ...prev }
       for (let verse of Object.entries(versesMap)) {
        dum[verse[0]]['bookmarked'] = false
       }
       return dum
      })
      setShowHighlightButton(false)
      setEditNotes(false)
     }}
     style={customStyles}
     closeTimeoutMS={200}
    >
     {bookmarkType == 'notes' ? (
      <div style={{ margin: '10px 10px 30px 10px' }}>
       <p>Your Notes:</p>
       <div className="wrapper">
        <IonItem>
         <IonTextarea
          placeholder="Type your notes here..."
          autoGrow={true}
          value={textBookmark.notes}
          onIonInput={(e) => {
           setTextBookmark((prev) => {
            let dum = { ...prev }
            dum['notes'] = e.detail.value
            return dum
           })
          }}
         ></IonTextarea>
        </IonItem>
       </div>
       <p>Selected Text:</p>
       <div className="wrapper">
        <p>{textBookmark.text}</p>
       </div>
      </div>
     ) : null}
     <p style={{ margin: '10px' }}>
      Select the {bookmarkType} folder/collection
     </p>
     <div className="wrapper">
      <IonItem>
       <IonInput
        onIonFocus={() => {
         setBookmarkInput((prev) => {
          let dum = { ...prev }
          dum['radio'] = ''
          return dum
         })
        }}
        onIonInput={(e) => {
         setBookmarkInput((prev) => {
          let dum = { ...prev }
          dum['radio'] = ''
          dum['text'] = e.detail.value
          return dum
         })
        }}
        type="text"
        placeholder={`New ${bookmarkType} folder`}
        value={bookmarkInput['text']}
       ></IonInput>
      </IonItem>
      {Object.keys(bookmarksMap).length > 0 ? (
       <IonRadioGroup
        allowEmptySelection={true}
        onIonChange={(e) => {
         setBookmarkInput((prev) => {
          let dum = { ...prev }
          dum['radio'] = e.detail.value
          dum['text'] = ''
          return dum
         })
        }}
        value={bookmarkInput['radio']}
       >
        {Object.keys(bookmarksMap).map((bookmarkFolder) => {
         return (
          <>
           {bookmarkFolder.slice(bookmarkFolder.lastIndexOf('-') + 1) ===
           bookmarkType ? (
            <IonItem>
             <IonLabel>
              {bookmarkFolder.slice(0, bookmarkFolder.lastIndexOf('-'))}
             </IonLabel>
             <IonRadio slot="end" value={bookmarkFolder} />
            </IonItem>
           ) : null}
          </>
         )
        })}
       </IonRadioGroup>
      ) : null}
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
        setAlertsMap((prev) => {
         let dum = { ...prev }
         dum['bookmark_input'] = false
         return dum
        })
        setBookmarkInput((prev) => {
         let dum = { ...prev }
         dum['radio'] = ''
         dum['text'] = ''
         return dum
        })
        setVersesMap((prev) => {
         let dum = { ...prev }
         for (let verse of Object.entries(versesMap)) {
          dum[verse[0]]['bookmarked'] = false
         }
         return dum
        })
        setShowHighlightButton(false)
        setEditNotes(false)
       }}
      >
       Cancel
      </IonButton>
      {editNotes ? (
       <IonButton
        onClick={() => {
         setAlertsMap((prev) => {
          let dum = { ...prev }
          dum['bookmark_input'] = false
          return dum
         })
         setBookmarksMap((prev) => {
          let dum = { ...prev }
          for (let bookmark of Object.entries(dum)) {
           for (let i = 0; i < bookmark[1]['children'].length; i++) {
            if (
             bookmark[1]['children'][i].timestamp == textBookmark.timestamp
            ) {
             bookmark[1]['children'].splice(i, 1)
             break
            }
           }
          }
          return dum
         })
         setBookmarkInput((prev) => {
          let dum = { ...prev }
          dum['radio'] = ''
          dum['text'] = ''
          return dum
         })
         setEditNotes(false)
        }}
       >
        Delete
       </IonButton>
      ) : null}
      <IonButton
       onClick={() => {
        if (!bookmarkInput['radio'] && !bookmarkInput['text']) {
         setToast('bookmark_input')
         return
        }
        setAlertsMap((prev) => {
         let dum = { ...prev }
         dum['bookmark_input'] = false
         return dum
        })

        if (bookmarkType == 'bookmarks') {
         setBookmarksMap((prev) => {
          let dum = { ...prev }
          let bookmark_folder_name = bookmarkInput['radio']
          if (bookmarkInput['text']) {
           bookmark_folder_name = bookmarkInput['text'] + '-bookmarks'
           dum[bookmark_folder_name] = {
            children: [],
            isChecked: false,
           }
          }
          for (let verse of Object.entries(versesMap)) {
           if (verse[1]['bookmarked'])
            dum[bookmark_folder_name]['children'].push({
             name: verse[0],
             type: 'verse',
             isChecked: false,
            })
          }
          return dum
         })
         setVersesMap((prev) => {
          let dum = { ...prev }
          for (let verse of Object.entries(versesMap)) {
           dum[verse[0]]['bookmarked'] = false
          }
          return dum
         })
         setSettings((prev) => {
          let dum = { ...prev }
          dum['bookmarks_folder'] =
           bookmarkInput['radio'] != ''
            ? bookmarkInput['radio']
            : bookmarkInput['text'] + '-highlights'
          return dum
         })
        } else if (bookmarkType == 'highlights') {
         if (selectedHighlight.folder) {
          setBookmarksMap((prev) => {
           let dum = { ...prev }
           for (let bookmark of Object.entries(dum)) {
            for (let i = 0; i < bookmark[1]['children'].length; i++) {
             if (
              bookmark[1]['children'][i].timestamp ==
              selectedHighlight.timestamp
             ) {
              bookmark[1]['children'].splice(i, 1)
              break
             }
            }
           }
           let bookmark_folder_name = bookmarkInput['radio']
           if (bookmarkInput['text']) {
            bookmark_folder_name = bookmarkInput['text'] + '-highlights'
            dum[bookmark_folder_name] = {
             children: [],
             isChecked: false,
            }
           }
           dum[bookmark_folder_name]['children'].push(textBookmark)
           return dum
          })
         } else {
          let modidfiedTextBookmark = {
           ...textBookmark,
          }
          modidfiedTextBookmark.color = settings.highlights_color
          setBookmarksMap((prev) => {
           let dum = { ...prev }
           let bookmark_folder_name = bookmarkInput['radio']
           if (bookmarkInput['text']) {
            bookmark_folder_name = bookmarkInput['text'] + '-highlights'
            dum[bookmark_folder_name] = {
             children: [],
             isChecked: false,
            }
           }
           dum[bookmark_folder_name]['children'].push(modidfiedTextBookmark)
           return dum
          })
          setSettings((prev) => {
           let dum = { ...prev }
           dum['highlights_folder'] =
            bookmarkInput['radio'] != ''
             ? bookmarkInput['radio']
             : bookmarkInput['text'] + '-highlights'
           return dum
          })
          setShowHighlightButton(false)
         }
        } else if (bookmarkType == 'notes') {
         if (editNotes) {
          setBookmarksMap((prev) => {
           let dum = { ...prev }
           for (let bookmark of Object.entries(dum)) {
            for (let i = 0; i < bookmark[1]['children'].length; i++) {
             if (
              bookmark[1]['children'][i].timestamp == textBookmark.timestamp
             ) {
              bookmark[1]['children'].splice(i, 1)
              break
             }
            }
           }
           let bookmark_folder_name = bookmarkInput['radio']
           if (bookmarkInput['text']) {
            bookmark_folder_name = bookmarkInput['text'] + '-notes'
            dum[bookmark_folder_name] = {
             children: [],
             isChecked: false,
            }
           }
           delete textBookmark['color']
           dum[bookmark_folder_name]['children'].push(textBookmark)
           return dum
          })
         } else {
          setBookmarksMap((prev) => {
           let dum = { ...prev }
           let bookmark_folder_name = bookmarkInput['radio']
           if (bookmarkInput['text']) {
            bookmark_folder_name = bookmarkInput['text'] + '-notes'
            dum[bookmark_folder_name] = {
             children: [],
             isChecked: false,
            }
           }
           delete textBookmark['color']
           dum[bookmark_folder_name]['children'].push(textBookmark)
           return dum
          })
          setSettings((prev) => {
           let dum = { ...prev }
           dum['notes_folder'] =
            bookmarkInput['radio'] != ''
             ? bookmarkInput['radio']
             : bookmarkInput['text'] + '-notes'
           return dum
          })
          setShowHighlightButton(false)
         }
        }
        setEditNotes(false)
        setBookmarkInput((prev) => {
         let dum = { ...prev }
         dum['radio'] = ''
         dum['text'] = ''
         return dum
        })
       }}
      >
       {editNotes || selectedHighlight.folder ? 'Save' : 'Done'}
      </IonButton>
     </div>
    </Modal>
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

export default Text
