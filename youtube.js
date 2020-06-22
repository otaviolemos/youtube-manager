const express = require('express')
const google = require('googleapis').google
const youtube = google.youtube({ version: 'v3'})
const OAuth2 = google.auth.OAuth2
const util = require('./util.js')

async function runmanager() {
  await authenticateWithOAuth()
}

async function authenticateWithOAuth() {
  const webServer = await startWebServer()
  const OAuthClient = await createOAuthClient()
  requestUserConsent(OAuthClient)
  const authorizationToken = await waitForGoogleCallback(webServer)
  await requestGoogleForAccessTokens(OAuthClient, authorizationToken)
  setGlobalGoogleAuthentication(OAuthClient)
  await stopWebServer(webServer)
  let names = await util.getAllNames()
  const addedPlayList = await addPlaylists(names)


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

  async function addPlaylists(names) {
    for(i = 20; i < names.length; i++) {
      var youtubeResponse;
      try {
        youtubeResponse = await youtube.playlists.insert(util.jsonPLFromName(names[i]))
      } catch(err) {
        console.log('Could not add playlist.')
        console.log(err)
        return youtubeResponse
      }
      console.log(`> [youtube-manager] Playlist ${names[i]} added.`)
      await sleep(10000)
    }
    return youtubeResponse
  }

  async function stopWebServer(webServer) {
    return new Promise((resolve, reject) => {
      webServer.server.close(() => {
        resolve()
      })
    })
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = runmanager