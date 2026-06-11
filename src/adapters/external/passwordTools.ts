import type { PasswordHasher } from '@core/ports/PasswordHasher'
import { compare, hash } from 'bcryptjs'

export class BcryptPasswordHasher implements PasswordHasher {
	async hash(password: string): Promise<string> {
		return await hash(password, 12)
	}

	async compare(password: string, hashValue: string): Promise<boolean> {
		return await compare(password, hashValue)
	}
}
