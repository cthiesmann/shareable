import ReactPlayer from 'react-player'
import styles from './Video.module.css'

export function Video(props) {
	const { videoUrl, isPlaying, playerRef } = props
	const { handleOnPlay, handleOnPause, handleOnProgress, handleOnReady } = props.handler

	return (
		<div className={styles.playerWrapper}>
			<ReactPlayer
				ref={playerRef}
				url={videoUrl}
				playing={isPlaying}
				controls={true}
				className={styles.reactPlayer}
				width='100%'
				height='100%'
				onPlay={handleOnPlay}
				onPause={handleOnPause}
				onProgress={handleOnProgress}
				onReady={handleOnReady}
			/>
		</div>
	);
}