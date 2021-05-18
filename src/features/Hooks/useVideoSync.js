import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import { client, server } from './events'

const useVideoSync = (roomId, playerRef) => {
	const [videoUrl, setVideoUrl] = useState('')
	const [isPlaying, setIsPlaying] = useState(false)
	const [history, setHistory] = useState([])
	const [queue, setQueue] = useState([])

	const ref = useRef()

	useEffect(() => {
		const socket = io('/')
		ref.current = socket

		// Wrapper for socket.on to automatically log incoming events
		const on = (event, callback) => {
			socket.on(event, (data) => {
				if (data) console.log(event.split('/')[1] || event, data)
				else	  console.log(event.split('/')[1] || event)
				callback(data)
			})
		}

		// Listen to events
		on(client.setInitialState, (innitialState) => {
			const { lastTimestamp, isPlaying } = innitialState
			playerRef?.current.seekTo(parseFloat(lastTimestamp))
			setIsPlaying(isPlaying)
		})

		on(client.setUrl, (url) => {
			setVideoUrl(url)
			setIsPlaying(false)
			// Manually send onReady to complete onJoinRoom -> urlChange -> onReady -> innitialState handshake if no url is set for the current room
			if (!url) ref.current.emit(server.ready)
		})

		on(client.setProgress, (progress) => {
			playerRef?.current.seekTo(parseFloat(progress.playedSeconds))
		})

		on(client.play, () => {
			setIsPlaying(true)
		})

		on(client.pause, () => {
			setIsPlaying(false)
		})

		on(client.setHistory, (history) => {
			setHistory(history)
		})

		on(client.setQueue, (queue) => {
			setQueue(queue)
		})

		socket.on('connect', () => {
			// Join current room
			console.log('connecting to', roomId)
			socket.emit(server.joinRoom, roomId)
			// Get history & queue
			socket.emit(server.getQueue)
			socket.emit(server.getHistory)
		})

		// Close connection when component unmounts
		return () => {
			console.log('disconnecting');
			socket.disconnect()
		}
	}, [roomId, playerRef])

	const changeUrl = (url) => {
		setVideoUrl(url)
		if (url) ref.current.emit(server.changeUrl, url)
	}

	const addToQueue = (url) => {
		console.log(server.addToQueue, url);
		if (url) ref.current.emit(server.addToQueue, url)
	}

	const pause = () => {
		if (isPlaying === true) {
			// Pause before changing progress so there is no pause -> play -> pause artifacts
			ref.current.emit(server.pause)
			ref.current.emit(server.progress, { playedSeconds: playerRef?.current.getCurrentTime() })
			setIsPlaying(false)
		}
	}

	const play = () => {
		if (isPlaying === false) {
			// Play after changing progress so there is no play -> pause -> play artifacts
			ref.current.emit(server.progress, { playedSeconds: playerRef?.current.getCurrentTime() })
			ref.current.emit(server.play)
			setIsPlaying(true)
		}
	}

	const progress = (progress) => {
		// Keep the server updated at what time we are
		ref.current.emit(server.setLastKnownProgress, progress)
	}

	const ready = (state) => {
		// Do not emit onReady when no video is set
		if (state) {
			ref.current.emit(server.ready)
		}
	}

	return {
		videoUrl,
		isPlaying,
		history,
		queue,
		changeUrl,
		addToQueue,
		pause,
		play,
		progress,
		ready,
	}
}

export default useVideoSync