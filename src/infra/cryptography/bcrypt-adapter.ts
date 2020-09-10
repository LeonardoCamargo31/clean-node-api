import { Encrypter } from '../../data/protocols/encrypter'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Encrypter {
  private readonly salt: number
  constructor (salt: number) {
    this.salt = salt
  }

  async encrypt (value: string): Promise<string> {
    // saltOrRounds não é algo generico então não vai para protocols
    // então injetamos no construtor
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }
}
