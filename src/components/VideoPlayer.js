
import ReactPlayer from 'react-player'
import { useState, useRef } from 'react';
import { IonSpinner } from '@ionic/react';

function VideoPlayer(props){
    const video  = props.video
    const currentAudio = props.currentAudio
    const currentPlaySetter = props.currentPlaySetter
    const currentVideoIndex = props.currentVideoIndex
    const i = props.i
    const setVideos = props.setVideos
    const setCurrentVideoIndex = props.setCurrentVideoIndex
    const [loaded, setLoaded] = useState(false)

    return(
        <div  style={{width: "100%", height: "100%", position:"relative", scrollSnapAlign: "start"}}>
            {!loaded ? <div style={{position:"absolute", top:0, left:0, height:"100%", width:"100%", zIndex:10,  display:"flex", justifyContent:"center", alignItems:"center"}}><IonSpinner style={{zIndex:11}} /></div> : null}
            <div style={{backgroundColor: "transparent", position:"absolute", top:"10%", height:"80%", width:"100%", opacity:10000}} onClick={()=>{
                setVideos(prev=>{
                    let dum = [...prev]
                    dum[i].isPlaying = !dum[i].isPlaying
                    return dum
                })
            }}></div>
            <ReactPlayer
            url={video.url}
            playing={video.isPlaying}
            onPlay={()=>{
                setVideos(prev=>{
                    let dum = [...prev]
                    dum[i].isPlaying = true
                    return dum
                })
            }}
            onReady={()=>{
                setLoaded(true)
            }}
            controls
            loop
            width='100%'
            height='100%' />
            </div>
    )
}

export default VideoPlayer