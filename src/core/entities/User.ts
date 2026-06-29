import type { Role } from '@core/entities/Role'

export interface User {
	id: string
	username: string
	name: string
	role: Role
}

export interface DataToLoginUser extends User {
	rfToken: string
	expRTF: string
}

export interface UserPrivateData extends User {
	password: string
}

export interface RegisterUserRequest extends UserPrivateData {
	confirmPassword: string
}

export interface RegisterUserData extends UserPrivateData {}

export type RegisterUserResponse =
	| { type: 'Success' }
	| { type: 'PasswordsDoNotMatch' }
	| { type: 'UserAlreadyExists' }
	| { type: 'Error'; message: string }

export interface LoginUserRequest {
	username: string
	password: string
}

export type LoginUserResponse =
	| { type: 'Success'; user: DataToLoginUser }
	| { type: 'IncorrectPasswordOrUser' }
	| { type: 'Error'; message: string }

export interface EditUserRequest {
	id: string
	prevUsername: string
	username?: string
	prevName: string
	name?: string
	prevRole: Role
	role?: Role
	password?: string
}

export type EditUserResponse =
	| { type: 'Success' }
	| { type: 'NoHasChanges' }
	| { type: 'UserAlreadyExists' }
	| { type: 'Error'; message: string }

export type FindUserResponse =
	| { type: 'Exist'; user: User }
	| { type: 'NotExist' }
	| { type: 'Error'; message: string }

export type DeleteUserResponse =
	| { type: 'Success' }
	| { type: 'UserNotExists' }
	| { type: 'Error'; message: string }

export interface TokenData {
	token: string
	expiry: string
}

export type FindAllUsersResponse =
	| { type: 'Success'; users: User[] }
	| { type: 'Error'; message: string }
