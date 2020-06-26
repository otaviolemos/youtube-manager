const util = require('./util.js')
const fs = require('fs');


test('get all lines from a file', async () => {
  const data = new Uint8Array(Buffer.from('first name\nsecond name'));
  createFile('names.txt', data)
  const lines = await util.getAllLines('names.txt')
  expect(lines[0]).toBe('first name')
  expect(lines[1]).toBe('second name')
  deleteFile('names.txt')
})

function createFile(name, data) { 
  fs.writeFile(name, data, (err) => {
    if (err) throw err('failed to create file');
  }); 
}

function deleteFile(name) {
  fs.unlink(name, function (err) {
    if (err) throw err('failed to delete file');
  }); 
}

test('given a playlist name, creates the correct JSON object', () => {
  const jsonPL = util.jsonPLFromName('I1 - Metastudies')
  expect(jsonPL.resource.snippet.title).toBe('I1 - Metastudies')
})
