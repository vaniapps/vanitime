import { IonSpinner } from "@ionic/react"
import { useState } from "react"


function Image(props) {
    const [loaded, setLoaded] = useState(false)
    return(
        <div style={{height:"100%", width:"100%", textAlign:"center", "display":"flex", "flexDirection": "column", "justifyContent":"center"}}>
        {!loaded ? <div style={{position:"absolute", top:0, left:0, height:"100%", width:"100%", zIndex:10,  display:"flex", justifyContent:"center", alignItems:"center"}}><IonSpinner style={{zIndex:11}} /></div> : null}
        <img onLoad={()=>{
            setLoaded(true)
        }} width="100%" src={props.image.url}></img>
        </div>
    )
}

export default Image