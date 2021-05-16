import styles from './Room.module.css'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Video } from '../video/Video'
import { VideoList } from '../videoList/VideoList'
import { SearchBar } from '../searchBar/SearchBar'

export function Room() {
	let { roomId } = useParams()
	const [url, setUrl] = useState('')
	const [historyList, setHistoryList] = useState([])
	const [queueList, setQueueList] = useState(['https://www.youtube.com/watch?v=zUJ9TLAlT4A', 'https://youtu.be/BDk4isFHtqo'])

	return (
		<div className={styles.Video}>
			<SearchBar onUrlChange={setUrl} />
			<Video roomId={roomId} videoUrl={url} onVideoChange={list => setHistoryList(list)} />
			<VideoList title={'Recently played:'} list={historyList} />
			<VideoList title={'Queue:'} list={queueList} />
		</div>
	)
}