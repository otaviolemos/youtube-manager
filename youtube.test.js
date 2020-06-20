const jsonPLFromName = require('./youtube.js')

test('given a playlist name, creates the correct JSON object', () => {
  const jsonPL = jsonPLFromName('I1 - Metastudies')
  expect(jsonPL.resource.snippet.title).toBe('I1 - Metastudies')
})