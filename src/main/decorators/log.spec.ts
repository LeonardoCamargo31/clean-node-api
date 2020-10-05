import { LogControllerDecorator } from './log'
import { Controller, HttpResponse, HttpRequest } from '../../presentation/protocols'
import { serverError, ok } from '../../presentation/helpers/http-helpers'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { AccountModel } from '../../domain/models/account'

// a classe que vai ser envolvida pelo decorator
const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise(resolve => resolve(ok(makeFakeAccount())))
    }
  }
  return new ControllerStub()
}

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new LogErrorRepositoryStub()
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
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    // o decorator deve repassar ao handle o httpRequest
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(handleSpy).toBeCalledWith(httpRequest)
  })

  // garantir que a respostas são iguais
  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)

    // igual ao objeto enviado da nossa ControllerStub
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  // salvar erro no banco de dados
  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle')
      .mockResolvedValueOnce(new Promise((resolve) => {
        return resolve(makeFakeServerError())
      }))

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)
    // deve ser chamado com error stack mockado
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
