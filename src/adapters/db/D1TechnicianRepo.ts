import { kvCacheGet, kvCacheInvalidate } from '@adapters/db/kvCache'
import * as schema from '@adapters/db/SchemaD1'
import type {
	AddTechnicianResponse,
	ToggleActiveResponse,
	EditTechnicianRequest,
	EditTechnicianResponse,
	FindTechnicianResponse,
	Technician
} from '@core/entities/Technician'
import type { TechnicianRepo } from '@core/ports/TechnicianRepo'
import { asc, eq } from 'drizzle-orm'
import type { DrizzleD1Database } from 'drizzle-orm/d1'

const CACHE_KEY = 'technicians:all'

function mapRow(row: any): Technician {
	return { ...row, active: row.active === 1 }
}

export class D1TechnicianRepo implements TechnicianRepo {
	constructor(
		private readonly db: DrizzleD1Database<typeof schema>,
		private readonly kv: KVNamespace
	) {}

	/// Agregar técnico

	async addTechnician(data: Technician): Promise<AddTechnicianResponse> {
		try {
			await this.db.insert(schema.techniciansTable).values({
				active: data.active ? 1 : 0,
				email: data.email,
				id: data.id,
				initials: data.initials,
				name: data.name,
				phone: data.phone
			})
			await kvCacheInvalidate(this.kv, CACHE_KEY)

			return { type: 'Success' }
		} catch (error: any) {
			console.log('Error al agregar un técnico: ', error.message)

			return { message: 'Agregar técnico: error desconocido', type: 'Error' }
		}
	}

	/// Desactivar técnico (no se elimina, se marca como inactivo)

	async toggleActive(id: string): Promise<ToggleActiveResponse> {
		try {
			const current = await this.findById(id)
			if (current.type !== 'Success') {
				return { type: 'Error', message: 'El técnico no existe' }
			}

			const newState = current.technician[0].active ? 0 : 1

			await this.db
				.update(schema.techniciansTable)
				.set({ active: newState })
				.where(eq(schema.techniciansTable.id, id))
			await kvCacheInvalidate(this.kv, CACHE_KEY)

			return { type: 'Success' }
		} catch (error: any) {
			console.log('Error al cambiar estado del técnico: ', error.message)

			return {
				message: 'Cambiar estado: error desconocido',
				type: 'Error'
			}
		}
	}

	async findAll(): Promise<FindTechnicianResponse> {
		return kvCacheGet<FindTechnicianResponse>(this.kv, CACHE_KEY, async () => {
			try {
				const res = await this.db
					.select()
					.from(schema.techniciansTable)
					.orderBy(asc(schema.techniciansTable.name))
					.execute()

				if (res.length === 0) {
					return { type: 'NoHasTechnicians' }
				}

				return { technician: res.map(mapRow), type: 'Success' }
			} catch (error: any) {
				console.log('Error al buscar técnicos: ', error.message)
				return {
					message: 'Buscar técnicos: error desconocido',
					type: 'Error'
				}
			}
		})
	}

	async findActive(): Promise<FindTechnicianResponse> {
		try {
			const res = await this.db
				.select()
				.from(schema.techniciansTable)
				.where(eq(schema.techniciansTable.active, 1))
				.orderBy(asc(schema.techniciansTable.name))
				.execute()

			if (res.length === 0) {
				return { type: 'NoHasTechnicians' }
			}

			return { technician: res.map(mapRow), type: 'Success' }
		} catch (error: any) {
			console.log('Error al buscar técnicos activos: ', error.message)
			return {
				message: 'Buscar técnicos activos: error desconocido',
				type: 'Error'
			}
		}
	}

	async findById(id: string): Promise<FindTechnicianResponse> {
		try {
			const res = await this.db
				.select()
				.from(schema.techniciansTable)
				.where(eq(schema.techniciansTable.id, id))
				.execute()

			if (res.length === 0) {
				return { type: 'NotExists' }
			}

			return { technician: res.map(mapRow), type: 'Success' }
		} catch (error: any) {
			console.log('Error al buscar técnico: ', error.message)
			return { message: 'Buscar técnico: error desconocido', type: 'Error' }
		}
	}

	async existsById(id: string): Promise<boolean> {
		try {
			const res = await this.db
				.select({ id: schema.techniciansTable.id })
				.from(schema.techniciansTable)
				.where(eq(schema.techniciansTable.id, id))
				.limit(1)
				.execute()

			return res.length > 0
		} catch (error: any) {
			console.log('Error al verificar técnico: ', error.message)
			return false
		}
	}

	/// Editar un técnico

	async editTechnician(
		data: EditTechnicianRequest
	): Promise<EditTechnicianResponse> {
		try {
			const setData: Record<string, string> = {}

			if (data.name !== undefined) setData.name = data.name
			if (data.initials !== undefined) setData.initials = data.initials
			if (data.email !== undefined) setData.email = data.email
			if (data.phone !== undefined) setData.phone = data.phone

			await this.db
				.update(schema.techniciansTable)
				.set(setData)
				.where(eq(schema.techniciansTable.id, data.id))
			await kvCacheInvalidate(this.kv, CACHE_KEY)

			return { type: 'Success' }
		} catch (error: any) {
			console.log('Error al editar técnico: ', error.message)

			return { message: 'Editar técnico: error desconocido', type: 'Error' }
		}
	}
}
