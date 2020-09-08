// O presentation precisa de um validador
// alguem simplesmente vai injetar essa dependencia
import { EmailValidator } from '../presentation/protocols/email-validator'

export class EmailValidatorAdapter implements EmailValidator {
  isValid (email: string): boolean {
    return false
  }
}
