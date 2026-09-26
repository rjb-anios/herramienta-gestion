import type { EditUserRequest, EditUserResponse } from '@core/entities/User'
import type { PasswordHasher } from '@core/ports/PasswordHasher'
import type { UserRepo } from '@core/ports/UserRepo'
import { mergeUserData } from '@core/use-cases/user/mergeUserData'

export class EditUserCommand {
	constructor(
		private readonly userRepo: UserRepo,
		private readonly passwordHasher: PasswordHasher
	) {}

	async execute(data: EditUserRequest): Promise<EditUserResponse> {
		const userExists = await this.userRepo.existsById(data.id)

		if (!userExists) {
			return { message: 'El usuario no existe', type: 'Error' }
		}

		const {
			hasChanges,
			usernameChanged,
			data: mergedData
		} = mergeUserData(data)

		const hasPassword = data.password !== undefined && data.password !== ''

		if (!hasChanges && !hasPassword) {
			return { type: 'NoHasChanges' }
		}

		if (usernameChanged) {
			const userExist = await this.userRepo.existsByUsername(
				mergedData.username
			)
			if (userExist) {
				return { type: 'UserAlreadyExists' }
			}
		}

		const roleChanged = data.role !== undefined && data.role !== data.prevRole

		const updateData = {
			...mergedData,
			...(hasPassword && {
				password: await this.passwordHasher.hash(data.password!)
			})
		}

		const res = await this.userRepo.editUser(updateData)

		if (res.type === 'Success' && (roleChanged || hasPassword)) {
			await this.userRepo.deleteRefreshTokensByUser(data.id)
		}

		return res
	}
}
