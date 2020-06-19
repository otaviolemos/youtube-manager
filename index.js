const { youtube } = require('googleapis/build/src/apis/youtube')
const runmanager = require('./youtube.js')

require('./youtube.js')

async function start() {
  await runmanager()
}

start()