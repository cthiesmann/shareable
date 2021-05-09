import { useState } from 'react'
import { Video } from './features/video/Video'
import { History } from './features/history/History'
import { SearchBar } from './features/searchBar/SearchBar'
import './App.css'

function App() {
	const [url, setUrl] = useState('')
	const [historyList, setHistoryList] = useState([])
	return (
		<div className="App">
			<div className="Video">
				<SearchBar onUrlChange={setUrl}/>
				<Video videoUrl={url} onVideoChange={list => setHistoryList(list)}/>
				<History videoList={historyList}/>
			</div>
		</div>
	);
}

export default App
