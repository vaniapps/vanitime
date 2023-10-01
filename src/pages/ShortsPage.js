import { useState, useRef } from 'react';
import ReactPlayer from 'react-player'
import AudioPlayer from '../components/AudioPlayer';

function Shorts(){
    const [videos, setVideos] = useState([
        {
            "url": 'https://www.youtube.com/shorts/lQuocrpCDK4',
            "isPlaying": false
        },
        {
            "url": 'https://www.youtube.com/shorts/Kk7qeIZStIw',
            "isPlaying": false
        }
    ])
    const [currentVideoIndex, setCurrentVideoIndex] = useState(-1)
    const [imageQuotes, setImageQuotes] = useState([
        {
            "url": "https://vanimedia.org/w/images/b/b7/051672_Image-quote.jpg"
        },
        {
            "url": "https://vanimedia.org/w/images/d/d0/051269_Image-quote.jpg"
        }
    ])
    const [images, setImages] = useState([
        {
            "url": "https://vanimedia.org/w/images/thumb/f/f0/CT07-011.JPG/400px-CT07-011.JPG"
        },
        {
            "url": "https://vanimedia.org/w/images/thumb/e/e0/CT08-001.JPG/400px-CT08-001.JPG"
        }
    ])
    const [audios, setAudios] = useState([
        {
            "url": "https://s3.amazonaws.com/vanipedia/Nectar+Drops/660904BG-NEW_YORK_ND_01.mp3",
            "txt": "So long I have got my bodily conception, when I say 'my self', I think of my body. When I transcend the bodily conception of life, then I think 'I am mind'. But actually, when I am in the real spiritual platform, then my self means 'I am pure spirit'.",
            "src": "660904 - Lecture BG 06.04-12 - New York"

        },
        {
            "url": "https://s3.amazonaws.com/vanipedia/Nectar+Drops/660904BG-NEW_YORK_ND_01.mp3",
            "txt": "So long I have got my bodily conception, when I say 'my self', I think of my body. When I transcend the bodily conception of life, then I think 'I am mind'. But actually, when I am in the real spiritual platform, then my self means 'I am pure spirit'.",
            "src": "660904 - Lecture BG 06.04-12 - New York"
        }
    ])
    const [currentAudio, setCurrentAudio] = useState(null)
    const [currentPlaySetter, setCurrentPlaySetter] = useState(null)
    return(
    <div className="video-list-container">
    {videos.map((video,i)=>{
        return(
            <div className="video">
            <ReactPlayer
            onClick={(e)=>{e.preventDefault();
                e.stopPropagation();}}
            url={video.url}
            playing={video.isPlaying}
            onPlay={()=>{
                if(currentAudio && currentAudio.current){
                    currentAudio.current.pause()
                    currentPlaySetter(false)
                }
                if(currentVideoIndex != -1 && currentVideoIndex != i){
                    setVideos(prev=>{
                        let dum = [...prev]
                        dum[currentVideoIndex].isPlaying = false
                        return dum
                    })
                }
                setCurrentVideoIndex(i)
                setVideos(prev=>{
                    let dum = [...prev]
                    dum[i].isPlaying = true
                    return dum
                })
            }}
            controls
            loop
            width='100%'
            height='90vh' />
            </div>
        )
    })}
    {imageQuotes.map((image, i) => {
        return (
            <img width="100%" src={image.url}></img>
        )
    })}
    {audios.map((audio, i) => {
        return (
           <AudioPlayer audio={audio} currentAudio = {currentAudio} setCurrentAudio = {setCurrentAudio} currentPlaySetter = {currentPlaySetter} setCurrentPlaySetter={setCurrentPlaySetter} currentVideoIndex={currentVideoIndex} setVideos={setVideos}  />
        )
    })}
    {images.map((image, i) => {
        return (
            <img width="100%" src={image.url}></img>
        )
    })}
    </div>
    )
}

export default Shorts;