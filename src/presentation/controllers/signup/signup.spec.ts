import { SignUpController } from './signup'
import { EmailValidator, AccountModel, AddAccount, AddAccountModel } from './signup-protocols'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { HttpRequest } from '../../protocols'
import { ok, serverError, badRequest } from '../../helpers/http-helpers'

const makeEmailValidator = (): EmailValidator => {
// versão mock de um e-mail validator
  // stub double de teste, uma função e damos um retorno fixo a ela
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  // classe de versão "mockada" dessa interface
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new AddAccountStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

interface SutTypes {
  sut: SignUpController
  emailInvalidStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const emailInvalidStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()

  // vamos injetar classe a nossa controller
  const sut = new SignUpController(emailInvalidStub, addAccountStub)
  return {
    sut,
    emailInvalidStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    // chamar a classe que estamos testando a instância de system under test
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    // exatamente igual usamos o toBe
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })

  test('Should return 400 if no password confirmation fails', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailInvalidStub } = makeSut()

    // vou "mockar" um retorno diferente
    // espionar o emailInvalidStub, método isValid
    jest.spyOn(emailInvalidStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should call email validator with correct email', async () => {
    const { sut, emailInvalidStub } = makeSut()

    // espionar para ver se chamou o método
    const isValidSpy = jest.spyOn(emailInvalidStub, 'isValid')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)
    // tenha sido chamado com esse parâmetro
    expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailInvalidStub } = makeSut()

    jest.spyOn(emailInvalidStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)
    // tenha sido chamado com esses parâmetro
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()

    // fica mais fiel pois nosso método é assíncrono
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })

    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })
})
