import * as schema from '@adapters/db/SchemaD1'
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
import type { UserRepo } from '@core/ports/UserRepo'
import { asc, eq } from 'drizzle-orm'
import type { DrizzleD1Database } from 'drizzle-orm/d1'

export class D1UserRepo implements UserRepo {
	constructor(
		private readonly db: DrizzleD1Database<typeof schema>,
		private readonly kv: KVNamespace
	) {}

	// Registrar usuario

	async register(data: RegisterUserData): Promise<RegisterUserResponse> {
		try {
			await this.db.insert(schema.usersTable).values({
				id: data.id,
				name: data.name,
				password: data.password,
				role: data.role,
				username: data.username
			})

			return {
				type: 'Success'
			}
		} catch (error: any) {
			console.log('Error al registrar usuario: ', error.message)

			return { message: 'Registrar usuario: error desconocido', type: 'Error' }
		}
	}

	// Eliminar cuenta de usuario

	async deleteUser(id: string): Promise<DeleteUserResponse> {
		try {
			// Obtener los id_token del usuario para eliminarlos de KV
			const tokensToDelete = await this.db
				.select({ id_token: schema.refreshTokensTable.id_token })
				.from(schema.refreshTokensTable)
				.where(eq(schema.refreshTokensTable.id_user, id))
				.execute()

			// Eliminar de BD en batch
			await this.db.batch([
				this.db
					.delete(schema.refreshTokensTable)
					.where(eq(schema.refreshTokensTable.id_user, id)),
				this.db.delete(schema.usersTable).where(eq(schema.usersTable.id, id))
			])

			// Eliminar de KV (no esperar respuesta para no bloquear)
			if (tokensToDelete.length > 0) {
				const deletePromises = tokensToDelete.map(t =>
					this.kv.delete(`auth_token:${t.id_token}`)
				)
				await Promise.allSettled(deletePromises)
			}

			return { type: 'Success' }
		} catch (error: any) {
			console.log('Error al eliminar usuario: ', error.message)

			return { message: 'Eliminar usuario: error desconocido', type: 'Error' }
		}
	}

	// Verificar si un usuario existe mediante su ID

	async existsById(id: string): Promise<boolean> {
		try {
			const res = await this.db
				.select({
					user: schema.usersTable.id
				})
				.from(schema.usersTable)
				.where(eq(schema.usersTable.id, id))
				.execute()

			if (res.length === 0) return false

			return true
		} catch (error: any) {
			console.log('Error al buscar usuario por ID: ', error.message)
			return false
		}
	}

	// Verificar si existe al menos un usuario en el sistema

	async existsAnyUser(): Promise<boolean> {
		try {
			const res = await this.db
				.select({
					user: schema.usersTable.id
				})
				.from(schema.usersTable)
				.limit(1)
				.execute()

			if (res.length === 0) return false

			return true
		} catch (error: any) {
			console.log('Error al verificar existencia de usuarios: ', error.message)
			return false
		}
	}

	// Verificar si un token de sesión existe

	async findToken(idRFT: string): Promise<TokenData | null> {
		const kvKey = `auth_token:${idRFT}`

		try {
			// 1. Intentar KV primero (caché)
			const cached = await this.kv.get(kvKey)
			if (cached) {
				try {
					const parsed = JSON.parse(cached) as TokenData
					return parsed
				} catch {
					// Si el JSON es inválido, ignorar y seguir a BD
				}
			}

			// 2. No está en KV → consultar BD
			const res = await this.db
				.select({
					expiry: schema.refreshTokensTable.expiry,
					token: schema.refreshTokensTable.token
				})
				.from(schema.refreshTokensTable)
				.where(eq(schema.refreshTokensTable.id_token, idRFT))
				.execute()

			if (res.length === 0) return null

			const { token, expiry } = res[0]

			await this.kv.put(kvKey, JSON.stringify({ expiry, token }), {
				expirationTtl: 3600
			})

			return { expiry, token }
		} catch (error: any) {
			console.log('Error al buscar token: ', error.message)

			try {
				const res = await this.db
					.select({
						expiry: schema.refreshTokensTable.expiry,
						token: schema.refreshTokensTable.token
					})
					.from(schema.refreshTokensTable)
					.where(eq(schema.refreshTokensTable.id_token, idRFT))
					.execute()

				if (res.length === 0) return null

				const { token, expiry } = res[0]

				return { expiry, token }
			} catch {
				return null
			}
		}
	}

	// Obtener datos mínimos indispensables de usuario

	async findUser(id: string): Promise<FindUserResponse> {
		const userData = await this.findPrivate(id)

		if (userData == null) {
			return {
				type: 'NotExist'
			}
		}

		return {
			type: 'Exist',
			user: {
				id: userData.id,
				name: userData.name,
				role: userData.role,
				username: userData.username
			}
		}
	}

	// Buscar todos los usuarios del sistema

	async findAllUsers(): Promise<FindAllUsersResponse> {
		try {
			const res = await this.db
				.select({
					id: schema.usersTable.id,
					name: schema.usersTable.name,
					role: schema.usersTable.role,
					username: schema.usersTable.username
				})
				.from(schema.usersTable)
				.orderBy(asc(schema.usersTable.name))
				.execute()

			return { type: 'Success', users: res }
		} catch (error: any) {
			console.log('Error al obtener lista general de usuarios: ', error.message)

			return { message: 'Obtener usuarios: error desconocido', type: 'Error' }
		}
	}

	// Obtener datos sensibles de usuario por username

	async findPrivateByUsername(
		username: string
	): Promise<UserPrivateData | null> {
		try {
			const res = await this.db
				.select({
					id: schema.usersTable.id,
					name: schema.usersTable.name,
					password: schema.usersTable.password,
					role: schema.usersTable.role,
					username: schema.usersTable.username
				})
				.from(schema.usersTable)
				.where(eq(schema.usersTable.username, username))
				.execute()

			if (res.length === 0) {
				return null
			}

			return res[0]
		} catch (error: any) {
			console.log('Error al obtener datos del usuario: ', error.message)
			return null
		}
	}

	// Guardar un refresh token

	async saveRefreshToken(data: {
		userId: string
		tokenId: string
		token: string
		created: string
		expiry: string
	}): Promise<void> {
		await this.db.insert(schema.refreshTokensTable).values({
			created: data.created,
			expiry: data.expiry,
			id_token: data.tokenId,
			id_user: data.userId,
			token: data.token
		})

		await this.kv.put(
			`auth_token:${data.tokenId}`,
			JSON.stringify({ expiry: data.expiry, token: data.token }),
			{ expirationTtl: 3600 }
		)
	}

	async deleteRefreshToken(tokenId: string): Promise<void> {
		try {
			await this.db
				.delete(schema.refreshTokensTable)
				.where(eq(schema.refreshTokensTable.id_token, tokenId))

			this.kv.delete(`auth_token:${tokenId}`).catch(() => {})
		} catch (error: any) {
			console.log('Error al eliminar refresh token: ', error.message)
			throw error
		}
	}

	// Editar usuario

	async editUser(data: EditUserRequest): Promise<EditUserResponse> {
		try {
			const setData: Record<string, string> = {}

			if (data.name !== undefined) setData.name = data.name
			if (data.role !== undefined) setData.role = data.role
			if (data.username !== undefined) setData.username = data.username
			if (data.password !== undefined) setData.password = data.password

			await this.db
				.update(schema.usersTable)
				.set(setData)
				.where(eq(schema.usersTable.id, data.id))

			return { type: 'Success' }
		} catch (error: any) {
			console.log('Error al editar datos de usuario: ', error.message)

			return { message: 'Editar usuario: error desconocido', type: 'Error' }
		}
	}

	// Verificar si un nombre de usuario ya está registrado

	async existsByUsername(username: string): Promise<boolean> {
		try {
			const res = await this.db
				.select({
					user: schema.usersTable.username
				})
				.from(schema.usersTable)
				.where(eq(schema.usersTable.username, username))
				.execute()

			if (res.length === 0) return false

			return true
		} catch (error: any) {
			console.log('Error al buscar usuario por nombre: ', error.message)
			return false
		}
	}

	// Método privado para obtener datos sensibles por ID

	private async findPrivate(id: string): Promise<UserPrivateData | null> {
		try {
			const res = await this.db
				.select({
					id: schema.usersTable.id,
					name: schema.usersTable.name,
					password: schema.usersTable.password,
					role: schema.usersTable.role,
					username: schema.usersTable.username
				})
				.from(schema.usersTable)
				.where(eq(schema.usersTable.id, id))
				.execute()

			if (res.length === 0) {
				return null
			}

			return res[0]
		} catch (error: any) {
			console.log('Error al obtener datos del usuario: ', error.message)
			return null
		}
	}
}
