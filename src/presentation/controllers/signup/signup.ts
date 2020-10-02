import { HttpRequest, HttpResponse, Controller, EmailValidator, AddAccount } from './signup-protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError, ok } from '../../helpers/http-helpers'

// todas as controllers precisam de log
// mas não pertence a regra de negócio para isso constructor (email, addAccount, logger)
// ao invés de ficar injetando em todas as controllers, utilizamos o decorator
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({
        name, email, password
      })

      return ok(account)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
