import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  // para o ts funcionar em um objeto js
  // então inicializo com um valor
  connection: null as MongoClient,

  async connect (uri: string): Promise<void> {
    this.connection = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect (): Promise<void> {
    await this.connection.close()
  },

  // só vamos conectar ao banco de dados
  // apenas uma vez ao inicializar a API
  // precisamos expor a collection e reutilizar a conexão ativa
  getCollection (name: string): Collection {
    return this.connection.db().collection(name)
  }
}
