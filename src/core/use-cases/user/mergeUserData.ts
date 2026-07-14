import type { Role } from '@core/entities/Role'
import type { EditUserRequest } from '@core/entities/User'

export interface MergedEditUserData {
	id: string
	prevUsername: string
	username: string
	prevName: string
	name: string
	prevRole: Role
	role: Role
}

export function mergeUserData(request: EditUserRequest): {
	hasChanges: boolean
	usernameChanged: boolean
	data: MergedEditUserData
} {
	const hasUsername = request.username !== undefined && request.username !== ''
	const hasName = request.name !== undefined && request.name !== ''
	const hasRole = request.role !== undefined

	const usernameChanged =
		hasUsername && request.username !== request.prevUsername
	const nameChanged = hasName && request.name !== request.prevName
	const roleChanged = hasRole && request.role !== request.prevRole

	if (!usernameChanged && !nameChanged && !roleChanged) {
		return {
			data: {
				id: request.id,
				name: request.prevName,
				prevName: request.prevName,
				prevRole: request.prevRole,
				prevUsername: request.prevUsername,
				role: request.prevRole,
				username: request.prevUsername
			},
			hasChanges: false,
			usernameChanged: false
		}
	}

	return {
		data: {
			id: request.id,
			name: hasName ? request.name! : request.prevName,
			prevName: request.prevName,
			prevRole: request.prevRole,
			prevUsername: request.prevUsername,
			role: hasRole ? request.role! : request.prevRole,
			username: hasUsername ? request.username! : request.prevUsername
		},
		hasChanges: true,
		usernameChanged
	}
}
