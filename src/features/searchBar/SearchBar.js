import { useState, useEffect, useRef } from 'react'
import styles from './SearchBar.module.css'

export function SearchBar(props) {
	const { onUrlChange } = props
	const [videoUrl, setVideoUrl] = useState('')
	const searchBar = useRef(null)

	useEffect(() => {
		searchBar.current.focus()
	}, [])

	const handleOnSubmit = (event) => {
		event.preventDefault()
		if (onUrlChange) onUrlChange(videoUrl)
	}

	return (
		<form onSubmit={handleOnSubmit} className={styles.searchForm, styles.center}>
			<input type="text"
				placeholder="Enter video url..."
				value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)}
				onFocus={(event) => event.target.select()}
				className={styles.searchInput}
				ref={searchBar}
			/>
			<button type="submit" className={styles.searchButton}>Go!</button>
		</form>
	)
}