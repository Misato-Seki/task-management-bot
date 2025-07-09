const { google } = require('googleapis')
const fs = require('fs')

async function getAccessTokenFromRefreshToken() {
    const { refresh_token } = JSON.parse(fs.readFileSync('refreshToken.json'))
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_CALLBACK_URL
    )
    oauth2Client.setCredentials({ refresh_token })
    const { token } = await oauth2Client.getAccessToken()
    return token;
}

module.exports = { getAccessTokenFromRefreshToken }