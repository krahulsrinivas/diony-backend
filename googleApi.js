const { google } = require('googleapis')

const oauth2Client = new google.auth.OAuth2(
	process.env.CLIENT_ID,
	process.env.CLIENT_SECRET,
	process.env.REDIRECT_URL
)

const scopes = ['https://www.googleapis.com/auth/youtube.readonly']

const url = oauth2Client.generateAuthUrl({
	access_type: 'offline',
	scope: scopes,
})
const youtube = google.youtube('v3')
module.exports = {
	url,
	oauth2Client,
	youtube,
}
