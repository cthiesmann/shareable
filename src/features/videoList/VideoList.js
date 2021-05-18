import styles from './VideoList.module.css'
import axios from 'axios'
import { useEffect, useState } from 'react'
import ReactTooltip from 'react-tooltip'

export function VideoList(props) {
	const { list } = props
	const previousVideos = list

	return (
		<ul>
			{previousVideos.map((video, index) => <VideoListElement key={index} video={video} />)}
		</ul>
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
		}
		fetchThumbnail()
	}, [url])

	return (
		<a href={url} target='blank'>
			<li className={styles.grid}>
				<img className={styles.thumbnail} src={thumbnail} alt={url} />
				<div className={styles.videoInfo}>
					<p className={styles.title} data-tip={title}>{title}</p>
					<p className={styles.author}>{author}</p>
					<p className={styles.provider}>{provider}</p>
					<ReactTooltip place='bottom'/>
				</div>
			</li>
		</a>
	)
}