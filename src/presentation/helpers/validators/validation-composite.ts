import { Validation } from './validation'

// Design Pattern Composite
// vai ter diversas classes como RequiredFieldValidation
// e todos implementam a interface Validation

// a controller agora só vai depender do Validation
// não mais de EmailValidator, ou outra validação
// e nem lidar com os erros InvalidParamError, MissingParamError, etc...
// minha controller só vai chamar validation.validate(httpRequest.body)
export class ValidationComposite implements Validation {
  private readonly validations: Validation[]

  constructor (validations: Validation[]) {
    this.validations = validations
  }

  validate (input: any): Error {
    for (const validation of this.validations) {
      const error = validation.validate(input)
      if (error) {
        return error
      }
    }
  }
}
