import styles from './History.css'
import axios from 'axios'
import { useEffect, useState } from 'react'

export function History(props) {
	const { videoList } = props
	const previousVideos = videoList
	console.log('video list', videoList);

	return (
		<>
			<div className={styles.center}>
				<ul>
					{previousVideos.length > 0 && <h3 className={styles.recentlyPlayed}>Recently played:</h3>}
					{previousVideos.map((video, index) => <VideoListElement video={video} />)}
				</ul>
			</div>
		</>
	)
}

const VideoListElement = (props) => {
	const { video: url } = props
	const [thumbnail, setThumbnail] = useState('')
	const [title, setTitle] = useState('')
	const [author, setAuthor] = useState('')
	const [provider, setProvider] = useState('')

	useEffect(() => {
		const fetchThumbnail = async () => {
			const response = await axios.get(`http://noembed.com/embed?url=${url}`)
			const { thumbnail_url, title, author_name, provider_name } = response.data
			setThumbnail(thumbnail_url)
			setTitle(title)
			setAuthor(author_name)
			setProvider(provider_name)
			console.log(response.data);
		}
		fetchThumbnail()
	}, [url])

	return (
		<a href={url} className={styles.center} target='blank'>
			<li>
				<img className={styles.thumbnail} src={thumbnail} alt={url}/>
				<div className={styles.videoInfo}>
					<p className={styles.title}>{title}</p>
					<p className={styles.author}>{author}</p>
					<p className={styles.provider}>{provider}</p>
				</div>
			</li>
		</a>
	)
}