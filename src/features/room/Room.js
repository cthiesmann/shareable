import styles from './Room.module.css'
import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Video } from '../video/Video'
import { VideoList } from '../videoList/VideoList'
import { SearchBar } from '../searchBar/SearchBar'
import useVideoSync from '../Hooks/useVideoSync'

export function Room() {
	const { roomId } = useParams()
	const [queueList, setQueueList] = useState(['https://www.youtube.com/watch?v=zUJ9TLAlT4A', 'https://youtu.be/BDk4isFHtqo'])

	const playerRef = useRef(null)
	
	const {
		videoUrl,
		isPlaying,
		history,
		changeUrl,
		pause,
		play,
		progress,
		ready,
	} = useVideoSync(roomId, playerRef)

	return (
		<div className={styles.Video}>
			<SearchBar onUrlChange={changeUrl} />
			<Video videoUrl={videoUrl} isPlaying={isPlaying} playerRef={playerRef} handler={{ play, pause, progress, ready }}/>
			<VideoList title={'Recently played:'} list={history} />
			<VideoList title={'Queue:'} list={queueList} />
		</div>
	)
}