const fs = require('fs')
const readline = require('readline')

async function getAllLines(file) {
  const fileStream = fs.createReadStream(file)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  var lines = []
  for await (const line of rl) {
    lines.push(line)
  }
  return lines
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

exports.getAllLines = getAllLines
exports.jsonPLFromName = jsonPLFromName
