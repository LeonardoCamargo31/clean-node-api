// realizaremos testes de integração com banco de dados
// e essa lib @shelf/jest-mongodb permite nos usar um banco em memoria
// ficando mais rapido nossos testes
module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '4.0.3',
      skipMD5: true
    },
    autoStart: false,
    instance: {}
  }
}
