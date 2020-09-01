const config = require('./jest.config')
// qualquer arquivos com .spec.js, vou rodar essa configuração
config.testMatch = ['**/*.spec.js']
module.exports = config
