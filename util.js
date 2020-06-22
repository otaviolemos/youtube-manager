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

function jsonPLFromName(name) {
  const jsonPLString = `{
    "part": "snippet,status",
    "resource": {
      "snippet": {
        "title": "${name}"
      },
      "status": {
        "privacyStatus": "public"
      }
    }
  }`
  return JSON.parse(jsonPLString)
}

exports.getAllNames = getAllNames
exports.jsonPLFromName = jsonPLFromName
