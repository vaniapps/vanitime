import { IonAccordion, IonAccordionGroup, IonCard, IonCardContent, IonCardHeader, IonItem, IonLabel, IonSpinner } from "@ionic/react"
import { useContext, useEffect, useState } from "react"
import { Books, Lectures } from "../context";
import { useHistory, Switch, Route, useLocation, useRouteMatch, useParams } from 'react-router-dom';


function Search(props) {
    const {searchResults, setSearchResults} = props.searchResultsHook
    const {searchLoaded, setSearchLoaded} = props.searchLoadedHook
    const {searchText, setSearchText} = props.searchTextHook
    let { text } = useParams();
    let history = useHistory();

    return(
       <div tyle={{
        "height": "100%",
        "overflowY": "scroll"
    }}>
        <p style={{margin:"10px"}}>The search feature is still in development. Please use our comprehensive search page <a href="https://vanipedia.org/wiki/Special:VaniSearch?&tab=text">here</a> </p>
        {!searchLoaded ? <div style={{position:"fixed", top:0, left:0, height:"100vh", width:"100%", zIndex:10,  display:"flex", justifyContent:"center", alignItems:"center", backgroundColor:"black", opacity:"0.5"}}><IonSpinner style={{zIndex:11, color: "white"}} /></div> : null}
         {Object.entries(searchResults).map(([key, values])=>{
            
        return (
            <>
            
            <IonAccordionGroup  multiple={true}>
                <IonAccordion value="first">
                    <IonItem slot="header">
                    <IonLabel>{key}</IonLabel>
                    </IonItem>
                    <div className="ion-padding" slot="content">
                    {values.map(val=>{
                        console.log(val)
                        return(
                            <IonItem onClick={()=>{
                                console.log(key)
                                if(key.startsWith("Lectures")) history.push("/lecture/"+val["name"]+"?hl="+searchText.replace(/\s+/g, '|'))
                                else history.push("/purports/"+val["name"]+"?hl="+text.replace(/\s+/g, '|'))
                            }}>
                                <IonLabel>{val["name"]}</IonLabel>
                            </IonItem>
                        )
                    })}
                    </div>
                </IonAccordion>
            </IonAccordionGroup>
            </>
        )
       })}</div>
    )
}

export default Search