import request from 'supertest'
import app from '../config/app'

describe('Content Type Middleware', () => {
  // por padrão se retorna json
  // em caso especifico retorna por exemplo xml
  test('Should return default content type as json', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/test_content_type')
      // regex se tiver um json ja passa no teste
      .expect('content-type', /json/)
  })

  test('Should return xml content type when forced', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      res.send()
    })
    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})
