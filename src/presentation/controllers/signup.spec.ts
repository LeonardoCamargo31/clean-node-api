import { SignUpController } from './signup'

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    // chamar a classe que estamos testando a instância de system under test
    const sut = new SignUpController()

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    // exatamente igual usamos o toBe
    expect(httpResponse.statusCode).toBe(400)
    // valores iguais usamos o toEqual
    expect(httpResponse.body).toEqual(new Error('Missing param: name'))
  })
})
