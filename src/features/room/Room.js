import styles from './Room.module.css'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Video } from '../video/Video'
import { VideoList } from '../videoList/VideoList'
import { SearchBar } from '../searchBar/SearchBar'
import io from 'socket.io-client'

const socket = io('/')

export function Room() {
	let { roomId } = useParams()
	const [url, setUrl] = useState('')
	const [historyList, setHistoryList] = useState([])
	const [queueList, setQueueList] = useState(['https://www.youtube.com/watch?v=zUJ9TLAlT4A', 'https://youtu.be/BDk4isFHtqo'])

	const [isPlaying, setIsPlaying] = useState(true)
	const playerRef = useRef(null)

	useEffect(() => {
		socket.emit('onJoinRoom', roomId)
		
		socket.on('innitialState', (innitialState) => {
			const { lastTimestamp, isPlaying, history } = innitialState
			console.log('innitialState', innitialState)
			playerRef?.current.seekTo(parseFloat(lastTimestamp))
			setIsPlaying(isPlaying)
			if (history?.length) setHistoryList(history)
		})

		socket.on('urlChange', (url) => {
			console.log('urlChange', url);
			setUrl(url)
			setIsPlaying(false)
		})

		socket.on('progress', (data) => {
			console.log('progress', data)
			playerRef?.current.seekTo(parseFloat(data.playedSeconds))
		})

		socket.on('pause', () => {
			console.log('pause')
			setIsPlaying(false)
		})

		socket.on('play', () => {
			console.log('play')
			setIsPlaying(true)
		})
	}, [])

	const changeUrl = (url) => {
		setUrl(url)
		if(url) socket.emit('onUrlChange', url)
	}
	
	/* Video Player Handler */
	const handleOnPause = (props) => {
		if (isPlaying === true) {
			socket.emit('onPause')
			socket.emit('onProgress', { playedSeconds: playerRef?.current.getCurrentTime() })
			setIsPlaying(false)
		}
	}

	const handleOnPlay = (props) => {
		if (isPlaying === false) {
			socket.emit('onPlay', props)
			socket.emit('onProgress', { playedSeconds: playerRef?.current.getCurrentTime() })
			setIsPlaying(true)
		}
	}

	const handleOnProgress = (props) => {
		// Keep the server updated at what time we are
		socket.emit('onUpdateLastTimestamp', props)
	}

	const handleOnReady = (props) => {
		// Do not emit onReady when no video is set
		if (props) {
			socket.emit('onReady')
		}
	}

	return (
		<div className={styles.Video}>
			<SearchBar onUrlChange={changeUrl} />
			<Video videoUrl={url} isPlaying={isPlaying} playerRef={playerRef} handler={{ handleOnPlay, handleOnPause, handleOnProgress, handleOnReady }}/>
			<VideoList title={'Recently played:'} list={historyList} />
			<VideoList title={'Queue:'} list={queueList} />
		</div>
	)
}