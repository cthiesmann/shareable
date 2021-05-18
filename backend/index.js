const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const express = require('express')
const path = require('path')
const { client, server } = require('../src/features/Hooks/events')

const port = process.env.PORT || 80

let rooms = {}

io.on('connection', (socket) => {
	console.log(socket.id, 'connected');
	let room = undefined

	// Wrapper for socket.on to automatically log incoming events
	const on = (event, callback) => {
		socket.on(event, (data) => {
			const info = [
				socket.id,
				room,
				event.split('/')[1] || event,
				data
			]
			// Remove empty items
			.filter(item => item !== undefined)
			// Transform to string
			.join(' ')

			if (event !== server.setLastKnownProgress) // Ignore that one spammy event
				console.log(info)
			callback(data)
		})
	}

	on(server.joinRoom, (roomId) => {
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
					queue: [],
					connectedSockets: [],
					deletionTimeout: null,
					videoEnded: true,
				},
			}
		}
		// Stop room state deletion timeout
		if(rooms[room].deletionTimeout) {
			clearTimeout(rooms[room].deletionTimeout)
			rooms[room].deletionTimeout = null
		}
		// Add this socket to the list of connected sockets
		rooms[room].connectedSockets = [...rooms[room].connectedSockets, socket.id]
		socket.join(room)
		socket.emit(client.setUrl, rooms[room].videoUrl)
	})

	on(server.ready, () => {
		socket.emit(client.setInitialState, rooms[room])
	})

	on(server.changeUrl, (url) => {
		// Update history
		if (rooms[room].videoUrl !== '') rooms[room].history = [rooms[room].videoUrl, ...rooms[room].history].slice(0, 10)
		// Update current video url
		rooms[room].videoUrl = url
		// Reset timestamp to 0.0s
		rooms[room].lastTimestamp = 0.0
		rooms[room].videoEnded = false
		io.to(room).emit(client.setUrl, url)
		socket.emit(client.setHistory, rooms[room].history)
	})

	on(server.addToQueue, (url) => {
		// If no videos are in queue and current video ended
		if(rooms[room].videoEnded) {
			// Update history
			if (rooms[room].videoUrl !== '') rooms[room].history = [rooms[room].videoUrl, ...rooms[room].history].slice(0, 10)
			// Update current video url
			rooms[room].videoUrl = url
			// Reset timestamp to 0.0s
			rooms[room].lastTimestamp = 0.0
			rooms[room].videoEnded = false
			io.to(room).emit(client.setUrl, url)
		}
		// Else just add this url to the queue
		else {
			rooms[room].queue = [...rooms[room].queue, url]
			io.to(room).emit(client.setQueue, rooms[room].queue)
		}
	})

	on(server.setLastKnownProgress, (data) => {
		// Make sure newly joining clients don't reset the timestamp
		if (data.playedSeconds > 0.0) {
			if (rooms[room]) rooms[room].lastTimestamp = data.playedSeconds
			if (data.loaded >= 0.999 && (data.loadedSeconds -1 <= data.playedSeconds)) {
				console.log(room, 'video ended')
				rooms[room].videoEnded = true
				// Add current videoUrl to history
				if (rooms[room].videoUrl !== '') rooms[room].history = [rooms[room].videoUrl, ...rooms[room].history].slice(0, 10)
				// Change videoUrl to 1st in queue
				rooms[room].videoUrl = rooms[room].queue[0] || ''
				// Reset timestamp to 0.0s
				rooms[room].lastTimestamp = 0.0
				if (rooms[room].videoUrl !== '') rooms[room].videoEnded = false
				// Remove video from queue
				rooms[room].queue = rooms[room].queue.slice(1)
				// Notify clients
				io.to(room).emit(client.setUrl, rooms[room].videoUrl)
				io.to(room).emit(client.setHistory, rooms[room].history)
				io.to(room).emit(client.setQueue, rooms[room].queue)

			}
		}
	})

	on(server.progress, (data) => {
		socket.broadcast.to(room).emit(client.setProgress, data)
	})

	on(server.pause, () => {
		socket.broadcast.to(room).emit(client.pause)
		rooms[room].isPlaying = false
	})

	on(server.play, () => {
		socket.broadcast.to(room).emit(client.play)
		rooms[room].isPlaying = true
	})

	on(server.getHistory, () => {
		socket.emit(client.setHistory, rooms[room].history)
	})

	on(server.getQueue, () => {
		socket.emit(client.setQueue, rooms[room].queue)
	})

	on('disconnect', (reason) => {
		// Remove this socket from the list of connected sockets
		if (rooms[room] && rooms[room].connectedSockets) {
			rooms[room].connectedSockets = rooms[room].connectedSockets.filter(socketId => socketId !== socket.id)
			// Delete room state after x seconds if room is empty
			if (rooms[room].connectedSockets.length === 0) {
				rooms[room].deletionTimeout = setTimeout(() => {
					delete rooms[room]
				}, 5000)
			}
		}
	})
})

app.use(express.static(path.join(__dirname, '../build')))

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../build/index.html'));
});

http.listen(port, () => {
	console.log(`listening on *:${port}`)
})