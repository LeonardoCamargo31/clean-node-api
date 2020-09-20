import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  // para o ts funcionar em um objeto js
  // então inicializo com um valor
  connection: null as MongoClient,
  uri: null as string,

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.connection = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },

  async disconnect (): Promise<void> {
    await this.connection.close()
    this.connection = null
  },

  // só vamos conectar ao banco de dados
  // apenas uma vez ao inicializar a API
  // precisamos expor a collection e reutilizar a conexão ativa
  async getCollection (name: string): Promise<Collection> {
    // se não tiver conectado, crio a conexão
    // recurso novo preciso das duas comparações
    //  if (!this.connection || !this.connection.isConnected()) {
    if (!this.connection?.isConnected()) {
      await this.connect(this.uri)
    }
    return this.connection.db().collection(name)
  },

  map: (collection: any): any => {
    const { _id, ...collectionWithoutId } = collection
    // objeto sem _id, e depois o adiciono como id
    return Object.assign({}, collectionWithoutId, { id: _id })
  }

}
