import React, {useState} from 'react'
import {AiFillPlayCircle, AiOutlineClose} from 'react-icons/ai'
import {FaPlay, FaWindowClose} from 'react-icons/fa'
import {IoClose, IoCloseCircle} from 'react-icons/io5'

const CustomVideoPlayer = ({
  videoUrl,
  thumbnailUrl,
  isFromUploader
}: {
  videoUrl: string
  thumbnailUrl: string
  isFromUploader?: boolean
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isClosed, setIsClosed] = useState(false)

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  const closeFullScreen = () => {
    setIsFullScreen(false)
  }

  return (
    <div className="custom-video-player">
      {!isFullScreen ? (
        <div className="thumbnail">
          <div
            className="videos"
            style={{
              height: isFromUploader ? '80px' : '220px',
              width: isFromUploader ? '80px' : '120px'
            }}
          >
            <video src={videoUrl} muted autoPlay loop playsInline />
          </div>

          <div className="play-button" onClick={toggleFullScreen}>
            <FaPlay size={30} color="white" stroke="white" />
          </div>
        </div>
      ) : (
        <div className="video-container">
          <button className="close-button" onClick={closeFullScreen}>
            <IoClose size={20} color="red" stroke="white"></IoClose>
          </button>
          <video src={videoUrl} controls autoPlay playsInline />
        </div>
      )}
    </div>
  )
}

export default CustomVideoPlayer