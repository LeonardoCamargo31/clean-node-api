import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation'

// ele não poderia ficar mais na factory principal
// devemos adicionar testes, já que agora tem um comportamento
// então criamos mais uma factory, e isolamos para facilitar os testes
export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  // new RequiredFieldValidation('name'),
  // new RequiredFieldValidation('email')
  // ...
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))

  return new ValidationComposite(validations)
}
