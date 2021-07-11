const fs = require('fs')
const { oauth2Client, youtube } = require('./googleApi')

const getSubscriptions = async () => {
	let response
	let nextPageToken
	const subscriptions = []

	const { token } = await oauth2Client.getAccessToken()
	try {
		response = await youtube.subscriptions.list({
			mine: true,
			access_token: token,
			key: process.env.API_KEY,
			part: 'snippet',
			maxResults: 50,
		})
		response.data.items.forEach(channel => {
			subscriptions.push(channel.snippet.resourceId.channelId)
		})
		nextPageToken = response.data.nextPageToken
		while (nextPageToken) {
			/* eslint-disable no-await-in-loop */
			response = await youtube.subscriptions.list({
				mine: true,
				access_token: token,
				key: process.env.API_KEY,
				part: 'snippet',
				maxResults: 50,
				pageToken: nextPageToken,
			})
			response.data.items.forEach(channel => {
				subscriptions.push(channel.snippet.resourceId.channelId)
			})
			nextPageToken = response.data.nextPageToken
		}
	} catch (e) {
		console.log(e)
	}
	fs.writeFileSync('subscriptions.json', JSON.stringify(subscriptions, null, 4), 'utf8')
}

module.exports = {
	getSubscriptions,
}
