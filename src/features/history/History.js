import styles from './History.css'
import axios from 'axios'
import { useEffect, useState } from 'react'

export function History(props) {
	const { videoList } = props
	const previousVideos = videoList
	console.log('video list', videoList);

	return (
		<>
			<div id='center'>
				<ul>
					{previousVideos.length > 0 && <h3 id='recentlyPlayed'>Recently played:</h3>}
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
		<a href={url} className='center' target='blank'>
			<li>
				<img id='thumbnail' src={thumbnail} alt={url}/>
				<div id='video-info'>
					<p id='title'>{title}</p>
					<p id='author'>{author}</p>
					<p id='provider'>{provider}</p>
				</div>
			</li>
		</a>
	)
}