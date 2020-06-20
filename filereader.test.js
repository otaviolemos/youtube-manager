const getAllNames = require('./filereader.js')

test('get all lines from playlist names file', async () => {
  const lines = await getAllNames()
  expect(lines[0]).toBe('I1 - Metastudies')
  expect(lines[59]).toBe('POSTERS')
})