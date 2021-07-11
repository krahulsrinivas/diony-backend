/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const fs = require('fs')
const { youtube } = require('./googleApi')

const getLatestVideos = async () => {
	let nextPageToken
	let response
	const videos = []
	const channels = JSON.parse(fs.readFileSync('subscriptions.json'))
	for (const id of channels) {
		try {
			response = await youtube.activities.list({
				channelId: id,
				key: process.env.API_KEY,
				part: 'snippet',
				maxResults: 50,
				publishedAfter: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
			})
			response.data.items.forEach(video => {
				if (video.snippet.type === 'upload') {
					const data = {
						publishedAt: video.snippet.publishedAt,
						channelTitle: video.snippet.channelTitle,
						videoTitle: video.snippet.title,
						videoDescription: video.snippet.description,
						thumbnail: video.snippet.thumbnails.default,
					}
					videos.push(data)
				}
			})
			nextPageToken = response.data.nextPageToken
			while (nextPageToken) {
				response = await youtube.activities.list({
					channelId: id,
					key: process.env.API_KEY,
					part: 'snippet',
					maxResults: 50,
					publishedAfter: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
					pageToken: nextPageToken,
				})
				response.data.items.forEach(video => {
					if (video.snippet.type === 'upload') {
						const data = {
							publishedAt: video.snippet.publishedAt,
							channelTitle: video.snippet.channelTitle,
							videoTitle: video.snippet.title,
							videoDescription: video.snippet.description,
							thumbnail: video.snippet.thumbnails.default,
						}
						videos.push(data)
					}
				})
				nextPageToken = response.data.nextPageToken
			}
		} catch (e) {
			continue
		}
	}
	fs.writeFileSync('videos.json', JSON.stringify(videos, null, 4), 'utf8')
}
module.exports = {
	getLatestVideos,
}
