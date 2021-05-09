const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const express = require('express')
const path = require('path')

const port = process.env.PORT || 80

let rooms = {}

io.on('connection', (socket) => {
	console.log(socket.id, 'connected');
	let room = undefined

	socket.on('onJoinRoom', (roomId) => {
		room = roomId
		// Create room state if it doesn't exist yet
		if (!rooms[roomId]) {
			rooms = {
				...rooms,
				[roomId]: {
					videoUrl: '',
					lastTimestamp: 0.0,
					isPlaying: true,
					history: [],
					connectedSockets: [],
				},
			}
		}
		rooms[room].connectedSockets = [...rooms[room].connectedSockets, socket.id]
		console.log(socket.id, 'joined', room);
		socket.join(room)
		socket.emit('urlChange', rooms[room].videoUrl)
	})

	socket.on('onReady', () => {
		console.log(socket.id, 'onReady', { lastTimestamp: rooms[room].lastTimestamp, isPlaying: rooms[room].isPlaying });
		socket.emit('innitialState', { ...rooms[room] })
	})

	socket.on('onUrlChange', (data) => {
		console.log(socket.id, room, 'onUrlChange', data)
		if (rooms[room].videoUrl !== '') rooms[room].history = [rooms[room].videoUrl, ...rooms[room].history].slice(0, 10)
		rooms[room].videoUrl = data
		rooms[room].lastTimestamp = 0.0
		io.to(room).emit('urlChange', data)
	})

	socket.on('onUpdateLastTimestamp', (data) => {
		console.log(rooms);
		if (data.playedSeconds > 0)
			rooms[room].lastTimestamp = data.playedSeconds
	})

	socket.on('onProgress', (data) => {
		console.log(socket.id, room, 'onProgress', data.playedSeconds)
		socket.broadcast.to(room).emit('progress', data)
	})

	socket.on('onPause', () => {
		console.log(socket.id, room, 'onPause')
		socket.broadcast.to(room).emit('pause')
		rooms[room].isPlaying = false
	})

	socket.on('onPlay', () => {
		console.log(socket.id, room, 'onPlay')
		socket.broadcast.to(room).emit('play')
		rooms[room].isPlaying = true
	})

	socket.on('disconnect', (reason) => {
		console.log(socket.id, 'disconnected', reason);
		// Remove this socket from the list of connected sockets
		rooms[room].connectedSockets = rooms[room]?.connectedSockets.filter(socketId => socketId !== socket.id)
		// Delete room state if room is empty
		if (rooms[room].connectedSockets.length === 0) delete rooms[room]
	})
})

app.use(express.static(path.join(__dirname, '../build')))

http.listen(port, () => {
	console.log(`listening on *:${port}`)
})