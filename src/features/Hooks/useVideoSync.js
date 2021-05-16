import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'

const useVideoSync = (roomId, playerRef) => {
	const [videoUrl, setVideoUrl] = useState('')
	const [isPlaying, setIsPlaying] = useState(false)
	const [history, setHistory] = useState([])

	const ref = useRef()

	useEffect(() => {
		const socket = io('/')
		ref.current = socket

		// Join current room
		console.log('joining ', roomId)
		socket.emit('onJoinRoom', roomId)

		// Listen to events
		socket.on('innitialState', (innitialState) => {
			const { lastTimestamp, isPlaying, history } = innitialState
			console.log('innitialState', innitialState)
			playerRef?.current.seekTo(parseFloat(lastTimestamp))
			setIsPlaying(isPlaying)
			if (history?.length) setHistory(history)
		})

		socket.on('urlChange', (url) => {
			console.log('urlChange', url);
			setVideoUrl(url)
			setIsPlaying(false)
		})

		socket.on('progress', (progress) => {
			console.log('progress', progress)
			playerRef?.current.seekTo(parseFloat(progress.playedSeconds))
		})

		socket.on('play', () => {
			console.log('play')
			setIsPlaying(true)
		})

		socket.on('pause', () => {
			console.log('pause')
			setIsPlaying(false)
		})

		// Close connection
		return () => {
			console.log('disconnecting');
			socket.disconnect()
		}
	}, [roomId, playerRef])

	const changeUrl = (url) => {
		setVideoUrl(url)
		if (url) ref.current.emit('onUrlChange', url)
	}

	const pause = () => {
		if (isPlaying === true) {
			// Pause before changing progress so there is no pause > play > pause artifacts
			ref.current.emit('onPause')
			ref.current.emit('onProgress', { playedSeconds: playerRef?.current.getCurrentTime() })
			setIsPlaying(false)
		}
	}
	
	const play = () => {
		if (isPlaying === false) {
			// Play after changing progress so there is no play > pause > play artifacts
			ref.current.emit('onProgress', { playedSeconds: playerRef?.current.getCurrentTime() })
			ref.current.emit('onPlay')
			setIsPlaying(true)
		}
	}

	const progress = (progress) => {
		// Keep the server updated at what time we are
		ref.current.emit('onUpdateLastTimestamp', progress)
	}

	const ready = (state) => {
		// Do not emit onReady when no video is set
		if (state) {
			ref.current.emit('onReady')
		}
	}

	return {
		videoUrl,
		isPlaying,
		history,
		changeUrl,
		pause,
		play,
		progress,
		ready,
	}
}

export default useVideoSync