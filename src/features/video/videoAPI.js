import io from 'socket.io-client'

const socket = io('http://localhost:4000')

const listenToEvents = () => {
	socket.on('ready', (data) => {
		console.log('ready', data)
	})

	socket.on('progress', (data) => {
		console.log('progress', data)
	})

	socket.on('pause', (data) => {
		console.log('pause', data)
	})

	socket.on('play', (data) => {
		console.log('play', data)
	})
}

const handleOnReady = (props) => {
	socket.emit('onReady', props)
}

const handleOnProgress = (props) => {
	socket.emit('onProgress', props)
}

const handleOnPause = (props) => {
	socket.emit('onPause', props)
}

const handleOnPlay = (props) => {
	socket.emit('onPlay', props)
}

module.exports = {
	listenToEvents,
	handleOnReady,
	handleOnProgress,
	handleOnPause,
	handleOnPlay,
}