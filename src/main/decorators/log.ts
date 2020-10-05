import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'

// Design Pattern Decorator
// ele pega uma instância de objeto, e cria um wrapper em volta dele
// então vai criar uma outra instância do mesmo tipo da classe que quer decorar
// e vai englobar ela com essa instância

// vamos utilizar composição, assim implementamos uma interface
export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logErrorRepository: LogErrorRepository

  constructor (controller: Controller, logErrorRepository: LogErrorRepository) {
    this.controller = controller
    this.logErrorRepository = logErrorRepository
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    // vai chamar o handle, que já era chamado antes pela rota
    // mas podemos adicionar um logger aqui dentro
    const httpResponse = await this.controller.handle(httpRequest)

    // caso retorne um server error
    if (httpResponse.statusCode === 500) {
      // logger
      await this.logErrorRepository.logError(httpResponse.body.stack)
    }
    return httpResponse
  }
}
