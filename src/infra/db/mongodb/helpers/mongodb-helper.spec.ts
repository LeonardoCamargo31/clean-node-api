import { MongoHelper as sut } from './mongodb-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('Should reconnect if mongodb is down', async () => {
    let accountColection = await sut.getCollection('accounts')
    // espero que esteja setada essa variavel
    expect(accountColection).toBeTruthy()

    await sut.disconnect()
    accountColection = await sut.getCollection('accounts')
    expect(accountColection).toBeTruthy()
  })
})
