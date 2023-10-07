
import {gapi} from 'gapi-script'
import { useContext, useEffect, useState } from 'react'
import Login from './Login'
import { IonButton, IonToast } from '@ionic/react'
import axios from 'axios'
import { Bookmarks, Books, Lectures, Settings, UserHistory } from '../context'
import Modal from 'react-modal';

const CLIENT_ID = "16422091894-2aisb9q5f0qp4mc4u4v9di97hks1u0l8.apps.googleusercontent.com"
const API_KEY = 'AIzaSyAEIH-Mumnvq1nptkEf0DgtsY8-kH5laMU'
const SCOPES = "https://www.googleapis.com/auth/drive.appdata"

function Drive(props) {
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
      };



    useEffect(() => {
        function start() {
            gapi.client.init({
                apikey: API_KEY,
                clientId: CLIENT_ID,
                scope: SCOPES
            })
        }
        gapi.load('client:auth2', start)
       
    })

    const [useHistory, setUserHistory] = useContext(UserHistory)
    const [bookmarksMap, setBookmarksMap] = useContext(Bookmarks)
    const [booksMap, setBooksMap] = useContext(Books)
    const [lecturesMap, setLecturesMap] = useContext(Lectures)
    const [lastModified, setLastModified] = useState("")
    const [overWriteProceed, setOverWriteProceed] = useState(false)
    const [listResponse, setListResponse] = useState({})
    const [toast, setToast] = useState("false")
    const [toastMessageMap, setToastMessageMap] = useState({
        "no_save_file_found": "No saved data found, Please save first!",
        "saved": "Successfully saved the data!",
        "loaded": "Successfully loaded the data!"
    })

    async function saveData() {
        props.setAlertsMap(prev => {
            let dum = {...prev}
            dum["fetching"] = true
            return dum
        })
        var file = new Blob([JSON.stringify({
            "lectures": lecturesMap,
            "books": booksMap,
            "stats": useHistory,
            "bookmarks": bookmarksMap
        })], {type: 'application/json'});
        var metadata = {
            'name': "vanitimeappdata",
            'mimeType': 'application/json',
            'parents': ['appDataFolder'],
        };

        var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
        var formData = new FormData();
        formData.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
        formData.append('file', file);
        console.log(accessToken, formData)

        for (let i=0; i<listResponse.result.files.length; i++){
            if(listResponse.result.files[i].name == "vanitimeappdata") {
                await gapi.client.drive.files.delete({fileId: listResponse.result.files[i].id})
            }
        }
        
        let uploadResponse = await axios({
            method: 'post',
            url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
            headers: {
              'Authorization': 'Bearer ' + accessToken,
              'Content-Type': 'multipart/form-data',
            },
            responseType: 'json',
            data: formData,
        })
        props.setAlertsMap(prev => {
            let dum = {...prev}
            dum["fetching"] = false
            return dum
        })
    }

    async function loadData() {
        for (let i=0; i<listResponse.result.files.length; i++){
            let fileContent = {}
            if(listResponse.result.files[i].name == "vanitimeappdata") {
                props.setAlertsMap(prev => {
                    let dum = {...prev}
                    dum["fetching"] = true
                    return dum
                })
                fileContent = await gapi.client.drive.files.get({alt: 'media', fileId: listResponse.result.files[i].id})
                console.log(fileContent.result)
                setUserHistory(fileContent.result.stats)
                setBookmarksMap(fileContent.result.bookmarks)
                setLecturesMap(fileContent.result.lectures)
                setBooksMap(fileContent.result.books)
                props.setAlertsMap(prev => {
                    let dum = {...prev}
                    dum["fetching"] = false
                    return dum
                })
                break;
            }
        }
    }


    return(
        <div>
            <div style={{textAlign:"center"}}>
            <Login />
            </div>
            <div style={{display:"flex", justifyContent:"space-evenly", margin:"10px"}}>
                    <IonButton onClick={()=>{
                         props.setAlertsMap(prev => {
                            let dum = {...prev}
                            dum["fetching"] = true
                            return dum
                        })
                        gapi.client.load('drive', 'v3', async ()=>{
                            const listResponse = await gapi.client.drive.files.list({
                                spaces: 'appDataFolder',
                                fields: 'files(id, name, modifiedTime)'
                            });
                            props.setAlertsMap(prev => {
                                let dum = {...prev}
                                dum["fetching"] = false
                                return dum
                            })
                            setListResponse(listResponse)
                            for (let i=0; i<listResponse.result.files.length; i++){
                                if(listResponse.result.files[i].name == "vanitimeappdata") {
                                    setLastModified(listResponse.result.files[i].modifiedTime)
                                    props.setAlertsMap(prev => {
                                        let dum = {...prev}
                                        dum["save"] = true
                                        dum["load"] = false
                                        return dum
                                    })
                                    return
                                }
                            }
                            saveData(listResponse)
                        })
                    }}>Save Data</IonButton>
                    <IonButton onClick={()=>{
                         props.setAlertsMap(prev => {
                            let dum = {...prev}
                            dum["fetching"] = true
                            return dum
                        })
                         gapi.client.load('drive', 'v3', async ()=>{
                            const listResponse = await gapi.client.drive.files.list({
                                spaces: 'appDataFolder',
                                fields: 'files(id, name, modifiedTime)'
                            });
                            props.setAlertsMap(prev => {
                                let dum = {...prev}
                                dum["fetching"] = false
                                return dum
                            })
                            setListResponse(listResponse)
                            for (let i=0; i<listResponse.result.files.length; i++){
                                if(listResponse.result.files[i].name == "vanitimeappdata") {
                                    setLastModified(listResponse.result.files[i].modifiedTime)
                                    props.setAlertsMap(prev => {
                                        let dum = {...prev}
                                        dum["save"] = false
                                        dum["load"] = true
                                        return dum
                                    })
                                    return
                                }
                            }
                            setToast("no_save_file_found")
                        })
                    }}>Load Data</IonButton>
                    </div>
                    <Modal
                        isOpen={props.alertsMap["save"] || props.alertsMap["load"]}
                        onRequestClose={()=>{
                            props.setAlertsMap(prev => {
                            let dum = {...prev}
                            dum["save"] = false
                            dum["load"] = false
                            return dum
                        })
                        }}
                        style={customStyles}
                        closeTimeoutMS={200}
                    >
                        <div style={{margin:"10px"}}>
                        <div style={{textAlign:"center", fontSize:"20px", margin:"10px"}}>Save Alert</div>
                        
                        {props.alertsMap["save"] ? <div>
                            You have last saved your data at {lastModified}. Would you like to overwrite that save?
                            </div> : <div>
                            You have last saved your data at {lastModified}. Would you like to overwrite that current loacal data?
                            </div> }
                            <div style={{margin:"10px", display:"flex", justifyContent:"space-evenly"}}>
                            <IonButton onClick={()=>{
                                 props.setAlertsMap(prev => {
                                    let dum = {...prev}
                                    dum["save"] = false
                                    dum["load"] = false
                                    return dum
                                })
                            }}>Cancel</IonButton>
                            <IonButton onClick={()=>{
                                 props.setAlertsMap(prev => {
                                    let dum = {...prev}
                                    dum["save"] = false
                                    dum["load"] = false
                                    return dum
                                })
                                if(props.alertsMap["save"]) saveData()
                                else loadData()
                            }}>Proceed</IonButton>
                            </div>
                        </div>
                    </Modal>
                    <IonToast onDidDismiss={()=>{setToast("false")}} isOpen={toast != "false"} message={toastMessageMap[toast]} duration={2000}></IonToast>
        </div>
    )

}

export default Drive
