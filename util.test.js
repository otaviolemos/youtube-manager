const util = require('./util.js')


test('get all lines from the playlist names file', async () => {
  const lines = await util.getAllNames()
  expect(lines[0]).toBe('I1 - Metastudies')
  expect(lines[59]).toBe('POSTERS')
})

test('given a playlist name, creates the correct JSON object', () => {
  const jsonPL = util.jsonPLFromName('I1 - Metastudies')
  expect(jsonPL.resource.snippet.title).toBe('I1 - Metastudies')
})
