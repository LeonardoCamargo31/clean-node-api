import { HttpRequest, HttpResponse, Controller, AddAccount, Validation } from './signup-protocols'
import { badRequest, serverError, ok } from '../../helpers/http-helpers'

// todas as controllers precisam de log
// mas não pertence a regra de negócio para isso constructor (email, addAccount, logger)
// ao invés de ficar injetando em todas as controllers, utilizamos o decorator
export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (addAccount: AddAccount, validation: Validation) {
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add({
        name, email, password
      })

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
