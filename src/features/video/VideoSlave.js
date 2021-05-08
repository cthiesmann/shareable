import { useEffect, useState, useRef } from 'react'
import ReactPlayer from 'react-player'
import io from 'socket.io-client'
import styles from './Video.module.css'

const socket = io('/')


export function VideoSlave() {
	const [videoUrl, setVideoUrl] = useState('')
	const [playerUrl, setPlayerUrl] = useState('')
	const [isPlaying, setIsPlaying] = useState(true)
	const player = useRef(null)

	useEffect(() => {
		socket.on('innitialState', (data) => {
			const { lastTimestamp, isPlaying } = data
			console.log('innitialState', data)
			player.current.seekTo(parseFloat(lastTimestamp))
			setIsPlaying(isPlaying)
		})

		socket.on('urlChange', (data) => {
			console.log('urlChange', data);
			setPlayerUrl(data)
			setIsPlaying(false)
		})

		socket.on('progress', (data) => {
			console.log('progress', data)
			player.current.seekTo(parseFloat(data.playedSeconds))
		})

		socket.on('pause', (data) => {
			console.log('pause', data)
			setIsPlaying(false)
		})

		socket.on('play', (data) => {
			console.log('play', data)
			setIsPlaying(true)
		})
	}, [])
	
	const handleUrlChange = () => {
		socket.emit('onUrlChange', videoUrl)
	}

	const handleOnPause = (props) => {
		if(isPlaying === true) {
			socket.emit('onPause', props)
			socket.emit('onProgress', { playedSeconds: player.current.getCurrentTime() })
			setIsPlaying(false)
		}
	}
	
	const handleOnPlay = (props) => {
		if(isPlaying === false) {
			socket.emit('onPlay', props)
			socket.emit('onProgress', { playedSeconds: player.current.getCurrentTime() })
			setIsPlaying(true)
		}
	}

	const handleOnProgress = (props) => {
		// Keep the server updated at what time we are
		socket.emit('onUpdateLastTimestamp', props)
	}

	const handleOnReady = (props) => {
		if(props) {
			console.log('onReady', props);
			socket.emit('onReady')
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
				onProgress={handleOnProgress}
				onReady={handleOnReady}
				onError={error => console.log('error', error)}
			/>
		</div>
		</>
	);
}