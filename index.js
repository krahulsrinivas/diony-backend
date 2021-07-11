const http = require('http')
const express = require('express')
require('dotenv').config({ path: 'config/dev.env' })

const app = express()

const { url, oauth2Client } = require('./googleApi')
const { getSubscriptions } = require('./getSubscriptions')
const { getLatestVideos } = require('./getLatestVideos')
const { getLikedVideos } = require('./getLikedVideos')

http.createServer(app).listen(3000, () => {
	console.log('Listening on port: 3000')
})

app.get('/', (req, res) => {
	res.redirect(url)
})

app.get('/auth/redirect', async (req, res) => {
	const { tokens } = await oauth2Client.getToken(req.query.code)
	oauth2Client.setCredentials(tokens)
	await getSubscriptions()
	res.json('Success')
})

app.get('/videos', async (req, res) => {
	await getLatestVideos()
	res.json('Success')
})

app.get('/likedVideos', async (req, res) => {
	await getLikedVideos()
	res.json('Success')
})
