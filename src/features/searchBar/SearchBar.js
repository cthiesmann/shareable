import { useState, useEffect, useRef } from 'react'
import styles from './SearchBar.module.css'
import ReactTooltip from 'react-tooltip';


export function SearchBar(props) {
	const { onUrlChange, onQueueAdd } = props
	const [videoUrl, setVideoUrl] = useState('')
	const searchBar = useRef(null)

	useEffect(() => {
		searchBar.current.focus()
	}, [])

	const handleOnSubmit = (event) => {
		event.preventDefault()
		if (onUrlChange) onUrlChange(videoUrl)
	}

	const handleOnQueue = (event) => {
		event.preventDefault()
		if (onQueueAdd) onQueueAdd(videoUrl)
	}

	return (
		<form onSubmit={handleOnSubmit} className={[styles.searchForm, styles.center].join(' ')}>
			<input type="text"
				placeholder="Enter video url..."
				value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)}
				onFocus={(event) => event.target.select()}
				className={styles.searchInput}
				ref={searchBar}
			/>
			<button onClick={handleOnQueue} className={styles.searchButton} data-tip='Add to queue'>Q</button>
			<button type="submit" className={styles.searchButton} data-tip='Play video now'>Go!</button>
			<ReactTooltip place='bottom'/>
		</form>
	)
}