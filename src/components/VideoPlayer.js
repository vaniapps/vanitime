
import ReactPlayer from 'react-player'
import { useState, useRef } from 'react';

function VideoPlayer(props){
    const video  = props.video
    const currentAudio = props.currentAudio
    const currentPlaySetter = props.currentPlaySetter
    const currentVideoIndex = props.currentVideoIndex
    const i = props.i
    const setVideos = props.setVideos
    const setCurrentVideoIndex = props.setCurrentVideoIndex

    return(
        <div  style={{width: "100%", height: "100%", position:"relative", scrollSnapAlign: "start"}}>
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
            controls
            loop
            width='100%'
            height='100%' />
            </div>
    )
}

export default VideoPlayer