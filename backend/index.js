const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const express = require('express')
const path = require('path')

const port = process.env.PORT || 80

let videoUrl = ''
let lastTimestamp = 0.0
let isPlaying = true
let history = []

io.on('connection', (socket) => {
	console.log("Socket connected: " + socket.id);
	socket.emit('urlChange', videoUrl)

	socket.on('onReady', () => {
		console.log(socket.id, 'onReady', { lastTimestamp, isPlaying });
		socket.emit('innitialState', { lastTimestamp, isPlaying, history })
	})
	
	socket.on('onUrlChange', (data) => {
		console.log(socket.id, 'onUrlChange', data)
		if (videoUrl !== '') history = [videoUrl, ...history].slice(0, 10)
		videoUrl = data
		lastTimestamp = 0.0
		io.emit('urlChange', data)
	})

	socket.on('onUpdateLastTimestamp', (data) => {
		//console.log('onUpdateLastTimestamp', data)
		if(data.playedSeconds > 0)
			lastTimestamp = data.playedSeconds
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

app.use(express.static(path.join(__dirname, '../build')))

http.listen(port, () => {
	console.log(`listening on *:${port}`)
})