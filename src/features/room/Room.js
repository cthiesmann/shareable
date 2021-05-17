import styles from './Room.module.css'
import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Video } from '../video/Video'
import { VideoList } from '../videoList/VideoList'
import { SearchBar } from '../searchBar/SearchBar'
import useVideoSync from '../Hooks/useVideoSync'

export function Room() {
	const { roomId } = useParams()

	const playerRef = useRef(null)

	const {
		videoUrl,
		isPlaying,
		history,
		queue,
		changeUrl,
		addToQueue,
		pause,
		play,
		progress,
		ready,
	} = useVideoSync(roomId, playerRef)

	return (
		<div className={styles.grid}>
			<div className={styles.search}>
				<SearchBar onUrlChange={changeUrl} onQueueAdd={addToQueue} />
			</div>

			<div className={styles.video}>
				<Video videoUrl={videoUrl} isPlaying={isPlaying} playerRef={playerRef} handler={{ play, pause, progress, ready }} />
			</div>

			<div className={styles.queue}>
				{queue.length > 0 && <h3 className={styles.queueTitle}>Queue:</h3>}
				<VideoList title={'Queue:'} list={queue} />
			</div>
			
			<div className={styles.history}>
				{history.length > 0 && <h3 className={styles.historyTitle}>History:</h3>}
				<VideoList title={'Recently played:'} list={history} />
			</div>
		</div>
	)
}