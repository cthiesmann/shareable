import { useState } from 'react'
import { Video } from './features/video/Video'
import { History } from './features/history/History'
import { SearchBar } from './features/searchBar/SearchBar'
import { BrowserRouter as Router, Switch, Route, Redirect, useParams } from 'react-router-dom'
import Readable from 'readable-url-names'
import './App.css'

function App() {
	const generator = new Readable()

	return (
		<div className="App">
			<Router>
				<Switch>
					<Route path='/:roomId'><Room /></Route>
					<Route path='/'>
						<Redirect to={{ pathname: '/' + generator.generate() }} />
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

function Room() {
	let { roomId } = useParams()
	const [url, setUrl] = useState('')
	const [historyList, setHistoryList] = useState([])

	return (
		<div className="Video">
			<SearchBar onUrlChange={setUrl} />
			<Video roomId={roomId} videoUrl={url} onVideoChange={list => setHistoryList(list)} />
			<History videoList={historyList} />
		</div>
	)
}

export default App
