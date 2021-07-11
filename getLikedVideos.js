const fs = require('fs')
const { oauth2Client, youtube } = require('./googleApi')

const getLikedVideos = async () => {
	let response
	let nextPageToken
	const likes = []

	const { token } = await oauth2Client.getAccessToken()
	try {
		response = await youtube.videos.list({
            myRating:'like',
			access_token: token,
			key: process.env.API_KEY,
			part: 'snippet',
			maxResults: 50,
		})
		response.data.items.forEach(channel => {
			likes.push(channel.snippet.title)
		})
		nextPageToken = response.data.nextPageToken
		while (nextPageToken) {
			/* eslint-disable no-await-in-loop */
			response = await youtube.videos.list({
                myRating:'like',
                access_token: token,
                key: process.env.API_KEY,
                part: 'snippet',
                maxResults: 50,
                pageToken:nextPageToken
			})
			response.data.items.forEach(channel => {
				likes.push(channel.snippet.title)
			})
			nextPageToken = response.data.nextPageToken
            console.log('hi')
		}
	} catch (e) {
		console.log(e)
	}
	fs.writeFileSync('likes.json', JSON.stringify(likes, null, 4), 'utf8')
}

module.exports = {
	getLikedVideos,
}
