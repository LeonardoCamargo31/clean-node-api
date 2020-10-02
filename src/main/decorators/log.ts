import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

// Design Pattern Decorator
// ele pega uma instância de objeto, e cria um wrapper em volta dele
// então vai criar uma outra instância do mesmo tipo da classe que quer decorar
// e vai englobar ela com essa instância

// vamos utilizar composição, assim implementamos uma interface
export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  constructor (controller: Controller) {
    this.controller = controller
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    // vai chamar o handle, que já era chamado antes pela rota
    // mas podemos adicionar um logger aqui dentro
    const httpResponse = await this.controller.handle(httpRequest)

    // caso retorne um server error
    if (httpResponse.statusCode === 500) {
      // logger

    }
    return httpResponse
  }
}
