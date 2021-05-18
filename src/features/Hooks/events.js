module.exports = {
	client: {
		setUrl: 'client/setUrl',
		setInitialState: 'client/setInitialState',

		setProgress: 'client/setProgress',
		play: 'client/play',
		pause: 'client/pause',

		setHistory: 'client/setHistory',

		setQueue: 'client/setQueue',
	},
	server: {
		joinRoom: 'server/onJoinRoom',
		ready: 'server/onReady',
		
		changeUrl: 'server/changeUrl',
		setLastKnownProgress: 'server/setLastKnownProgress',
		progress: 'server/progress',
		pause: 'server/pause',
		play: 'server/play',

		getHistory: 'server/getHistory',

		addToQueue: 'server/addToQueue',
		getQueue: 'server/getQueue',
	}
}