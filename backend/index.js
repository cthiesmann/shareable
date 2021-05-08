const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

let videoUrl = ''
let lastTimestamp = ''
let isPlaying = false

io.on('connection', (socket) => {
	console.log("Socket connected: " + socket.id);
	socket.emit('urlChange', videoUrl)

	socket.on('onReady', (data) => {
		console.log(socket.id, 'onReady', data, { lastTimestamp, isPlaying });
		socket.emit('innitialState', { lastTimestamp, isPlaying })
	})
	
	socket.on('onUrlChange', (data) => {
		console.log(socket.id, 'onUrlChange', data)
		videoUrl = data
		io.emit('urlChange', data)
	})

	socket.on('onUpdateLastTimestamp', (data) => {
		//console.log('onUpdateLastTimestamp', data)
		if(data.playedSeconds > 0)
			lastTimestamp = data.playedSeconds
	})

	socket.on('onReady', (data) => {
		console.log(socket.id, 'onReady', data)
		socket.broadcast.emit('ready', data)
	})
  
	socket.on('onProgress', (data) => {
		console.log(socket.id, 'onProgress', data.playedSeconds)
		socket.broadcast.emit('progress', data)
	})
  
	socket.on('onPause', (data) => {
		console.log(socket.id, 'onPause', data)
		socket.broadcast.emit('pause', data)
		isPlaying = false
	})
  
	socket.on('onPlay', (data) => {
		console.log(socket.id, 'play', data)
		socket.broadcast.emit('play', data)
		isPlaying = true
	})
})

http.listen(4000, () => {
	console.log('listening on *:4000')
})