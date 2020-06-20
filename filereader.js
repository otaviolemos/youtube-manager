const fs = require('fs')
const readline = require('readline')

async function getAllNames() {
  const fileStream = fs.createReadStream('resources/playlist-names.txt')

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })

  var names = []

  for await (const line of rl) {
    names.push(line)
  }

  return names
}

module.exports = getAllNames