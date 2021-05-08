import { useEffect, useState, useRef } from 'react'
import ReactPlayer from 'react-player'
import io from 'socket.io-client'
import styles from './Video.module.css'

const socket = io('http://localhost:4000')


export function VideoMaster() {
	const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=2IMwBNu0O2c')
	const [playerUrl, setPlayerUrl] = useState('')
	const [isPlaying, setIsPlaying] = useState(false)
	const player = useRef(null)

	useEffect(() => {
		socket.on('urlChange', (data) => {
			setPlayerUrl(data)
			setIsPlaying(false)
		})

		socket.on('progress', (data) => {
			//console.log('progress', data)
			player.current.seekTo(parseFloat(data.playedSeconds))
		})

		socket.on('pause', (data) => {
			//console.log('pause', data)
			setIsPlaying(false)
		})

		socket.on('play', (data) => {
			//console.log('play', data)
			setIsPlaying(true)
		})
	}, [])
	
	const handleUrlChange = () => {
		socket.emit('onUrlChange', videoUrl)
	}

	const handleOnPause = (props) => {
		if(isPlaying === true){
			socket.emit('onPause', props)
			socket.emit('onProgress', { playedSeconds: player.current.getCurrentTime() })
			setIsPlaying(false)
		}
	}
	
	const handleOnPlay = (props) => {
		if(isPlaying === false){
			socket.emit('onPlay', props)
			socket.emit('onProgress', { playedSeconds: player.current.getCurrentTime() })
			setIsPlaying(true)
		}
	}

	return (
		<>
		<input type="text" value={videoUrl} onChange={event => setVideoUrl(event.target.value)}/>
		<button onClick={handleUrlChange}>Go!</button>
		<div>isPlaying = {isPlaying ? 'true' : 'false'}</div>
		<div className={styles.wrapper}>
			<ReactPlayer
				ref={player} 
				url={playerUrl}
				playing={isPlaying}
				controls={true}
				width='100%'
				height='100%'
				className={styles.player}
				onPlay={handleOnPlay}
				onPause={handleOnPause}
			/>
		</div>
		</>
	);
}