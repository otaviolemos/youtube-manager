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