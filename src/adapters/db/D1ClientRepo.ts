import { kvCacheGet, kvCacheInvalidate } from '@adapters/db/kvCache'
import * as schema from '@adapters/db/SchemaD1'
import type {
	AddOrDeleteClientResponse,
	Client,
	EditClientRequest,
	EditClientResponse,
	FindAllClientsResponse,
	FindClientResponse
} from '@core/entities/Client'
import type { ClientRepo } from '@core/ports/ClientRepo'
import { asc, eq } from 'drizzle-orm'
import type { DrizzleD1Database } from 'drizzle-orm/d1'

const CACHE_KEY = 'clients:all'

export class D1ClientRepo implements ClientRepo {
	constructor(
		private readonly db: DrizzleD1Database<typeof schema>,
		private readonly kv: KVNamespace
	) {}

	// Añadir un cliente

	async addClient(data: Client): Promise<AddOrDeleteClientResponse> {
		try {
			await this.db.insert(schema.clientsTable).values(data)
			await kvCacheInvalidate(this.kv, CACHE_KEY)

			return { type: 'Success' }
		} catch (error: any) {
			console.log('Error al agregar cliente: ', error.message)

			return {
				message: 'Agregar cliente: error desconocido',
				type: 'Error'
			}
		}
	}

	// Eliminar un cliente

	async deleteClient(id: string): Promise<AddOrDeleteClientResponse> {
		try {
			await this.db
				.delete(schema.clientsTable)
				.where(eq(schema.clientsTable.id, id))
			await kvCacheInvalidate(this.kv, CACHE_KEY)

			return { type: 'Success' }
		} catch (error: any) {
			console.log('Error al eliminar cliente: ', error.message)

			return {
				message: 'Eliminar cliente: error desconocido',
				type: 'Error'
			}
		}
	}

	// Editar un cliente

	async editClient(data: EditClientRequest): Promise<EditClientResponse> {
		try {
			await this.db
				.update(schema.clientsTable)
				.set(data)
				.where(eq(schema.clientsTable.id, data.id))
			await kvCacheInvalidate(this.kv, CACHE_KEY)

			return { type: 'Success' }
		} catch (error: any) {
			console.log('Error al editar cliente: ', error.message)

			return {
				message: 'Editar cliente: error desconocido',
				type: 'Error'
			}
		}
	}

	// Buscar un cliente a través de su ID

	async findClient(id: string): Promise<FindClientResponse> {
		try {
			const res = await this.db
				.select()
				.from(schema.clientsTable)
				.where(eq(schema.clientsTable.id, id))
				.execute()

			if (res.length === 0) {
				return { type: 'NotExists' }
			}

			return { client: res[0], type: 'Exist' }
		} catch (error: any) {
			console.log('Error al buscar cliente: ', error.message)

			return {
				message: 'Buscar cliente: error desconocido',
				type: 'Error'
			}
		}
	}

	// Buscar todos los clientes registrados

	async findAllClients(): Promise<FindAllClientsResponse> {
		return kvCacheGet<FindAllClientsResponse>(this.kv, CACHE_KEY, async () => {
			try {
				const res = await this.db
					.select()
					.from(schema.clientsTable)
					.orderBy(asc(schema.clientsTable.name))
					.execute()

				return { clients: res, type: 'Success' }
			} catch (error: any) {
				console.log('Error al obtener todos los clientes: ', error.message)

				return {
					message: 'Obtener clientes: error desconocido',
					type: 'Error'
				}
			}
		})
	}

	/// Verificar si existen equipos asociados a un cliente

	async hasMachines(id: string): Promise<boolean> {
		try {
			const res = await this.db
				.select({ id: schema.machinesTable.id })
				.from(schema.machinesTable)
				.where(eq(schema.machinesTable.id_client, id))
				.limit(1)
				.execute()

			return res.length > 0
		} catch (error: any) {
			console.log('Error al verificar equipos del cliente: ', error.message)
			return false
		}
	}

	/// Verificar si existen visitas asociadas a un cliente

	async hasVisits(id: string): Promise<boolean> {
		try {
			const res = await this.db
				.select({ id: schema.visitsTable.id })
				.from(schema.visitsTable)
				.where(eq(schema.visitsTable.id_client, id))
				.limit(1)
				.execute()

			return res.length > 0
		} catch (error: any) {
			console.log('Error al verificar visitas del cliente: ', error.message)
			return false
		}
	}

	/// Verifica nombre de cliente

	async existsByName(name: string): Promise<boolean> {
		try {
			const res = await this.db
				.select({ id: schema.clientsTable.id })
				.from(schema.clientsTable)
				.where(eq(schema.clientsTable.name, name))
				.limit(1)
				.execute()

			return res.length > 0
		} catch (error: any) {
			console.log('Error al verificar nombre de cliente: ', error.message)
			return false
		}
	}

	/// Verificar si existe al menos un cliente

	async existsAnyClient(): Promise<boolean> {
		try {
			const res = await this.db
				.select({ id: schema.clientsTable.id })
				.from(schema.clientsTable)
				.limit(1)
				.execute()

			return res.length > 0
		} catch (error: any) {
			console.log('Error al verificar existencia de clientes: ', error.message)

			return false
		}
	}
}
