const express = require('express')

async function startWebServer() {
  return new Promise((resolve, reject) => {
    const port = 5000
    const app = express()

    const server = app.listen(port, () => {
      console.log(`> [youtube-robot] Listening on http://localhost:${port}`)
      resolve({
        app,
        server
      })
    })
  })
}

async function createOAuthClient() {
  const credentials = require('../credentials/google-youtube.json')

  const OAuthClient = new OAuth2(
    credentials.web.client_id,
    credentials.web.client_secret,
    credentials.web.redirect_uris[0]
  )

  return OAuthClient
}