import type {
	DeleteUserResponse,
	EditUserRequest,
	EditUserResponse,
	FindAllUsersResponse,
	FindUserResponse,
	RegisterUserData,
	RegisterUserResponse,
	TokenData,
	UserPrivateData
} from '@core/entities/User'

export interface UserRepo {
	register: (data: RegisterUserData) => Promise<RegisterUserResponse>

	deleteUser: (id: string) => Promise<DeleteUserResponse>

	editUser: (data: EditUserRequest) => Promise<EditUserResponse>

	existsByUsername: (username: string) => Promise<boolean>

	existsById: (id: string) => Promise<boolean>

	existsAnyUser: () => Promise<boolean>

	findUser: (id: string) => Promise<FindUserResponse>

	findToken: (idRFT: string) => Promise<TokenData | null>

	findAllUsers: () => Promise<FindAllUsersResponse>

	findPrivateByUsername: (username: string) => Promise<UserPrivateData | null>

	saveRefreshToken: (data: {
		userId: string
		tokenId: string
		token: string
		created: string
		expiry: string
	}) => Promise<void>

	deleteRefreshToken: (tokenId: string) => Promise<void>
}
