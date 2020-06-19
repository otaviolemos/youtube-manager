const express = require('express')
const google = require('googleapis').google
const youtube = google.youtube({ version: 'v3'})
const OAuth2 = google.auth.OAuth2

async function runmanager() {
  await authenticateWithOAuth()
}

async function authenticateWithOAuth() {
  const webServer = await startWebServer()
  const OAuthClient = await createOAuthClient()
  requestUserConsent(OAuthClient)
  const authorizationToken = await waitForGoogleCallback(webServer)
  await requestGoogleForAccessTokens(OAuthClient, authorizationToken)
  await setGlobalGoogleAuthentication(OAuthClient)
  await stopWebServer(webServer)
  const addedPlayList = await addPlaylists([])


  async function startWebServer() {
    return new Promise((resolve, reject) => {
      const port = 5000
      const app = express()

      const server = app.listen(port, () => {
        console.log(`> [youtube-manager] Listening on http://localhost:${port}`)

        resolve({
          app,
          server
        })
      })
    })
  }

  async function createOAuthClient() {
    const credentials = require('./credentials/google-youtube.json')

    const OAuthClient = new OAuth2(
      credentials.web.client_id,
      credentials.web.client_secret,
      credentials.web.redirect_uris[0]
    )

    return OAuthClient
  }

  function requestUserConsent(OAuthClient) {
    const consentUrl = OAuthClient.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/youtube']
    })

    console.log(`> [youtube-manager] Please give your consent: ${consentUrl}`)
  }

  async function waitForGoogleCallback(webServer) {
    return new Promise((resolve, reject) => {
      console.log('> [youtube-manager] Waiting for user consent...')

      webServer.app.get('/oauth2callback', (req, res) => {
        const authCode = req.query.code
        console.log(`> [youtube-manager] Consent given: ${authCode}`)

        res.send('<h1>Thank you!</h1><p>Now close this tab.</p>')
        resolve(authCode)
      })
    })
  }

  async function requestGoogleForAccessTokens(OAuthClient, authorizationToken) {
    return new Promise((resolve, reject) => {
      OAuthClient.getToken(authorizationToken, (error, tokens) => {
        if (error) {
          return reject(error)
        }

        console.log('> [youtube-manager] Access tokens received!')

        OAuthClient.setCredentials(tokens)
        resolve()
      })
    })
  }

  function setGlobalGoogleAuthentication(OAuthClient) {
    google.options({
      auth: OAuthClient
    })
  }

  async function addPlaylists(playLists) {
    const youtubeResponse = await youtube.playlists.insert({
      part: 'snippet,status',
      resource: {
        snippet: {
          title: 'Test Playlist - Otavio',
          description: 'A private playlist created with the YouTube API'
        },
        status: {
          privacyStatus: 'public'
        }
      }
    });

    console.log('> [youtube-manager] Playlist added.')
    console.log(youtubeResponse)
    return youtubeResponse.data
  }

  async function stopWebServer(webServer) {
    return new Promise((resolve, reject) => {
      webServer.server.close(() => {
        resolve()
      })
    })
  }
}

module.exports = runmanager