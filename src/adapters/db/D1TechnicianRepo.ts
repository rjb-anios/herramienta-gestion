import * as schema from '@adapters/db/SchemaD1'
import type {
	AddTechnicianResponse,
	DeleteTechnicianResponse,
	EditTechnicianRequest,
	EditTechnicianResponse,
	FindTechnicianResponse,
	Technician
} from '@core/entities/Technician'
import type { TechnicianRepo } from '@core/ports/TechnicianRepo'
import { eq } from 'drizzle-orm'
import type { DrizzleD1Database } from 'drizzle-orm/d1'

export class D1TechnicianRepo implements TechnicianRepo {
	constructor(private readonly db: DrizzleD1Database<typeof schema>) {}

	/// Agregar técnico

	async addTechnician(data: Technician): Promise<AddTechnicianResponse> {
		try {
			await this.db.insert(schema.techniciansTable).values({
				id: data.id,
				initials: data.initials,
				name: data.name
			})

			return { type: 'Success' }
		} catch (error: any) {
			console.log('Error al agregar un técnico: ', error.message)

			return { message: 'Agregar técnico: error desconocido', type: 'Error' }
		}
	}

	/// Eliminar técnico

	async deleteTechnician(id: string): Promise<DeleteTechnicianResponse> {
		try {
			await this.db
				.delete(schema.techniciansTable)
				.where(eq(schema.techniciansTable.id, id))

			return { type: 'Success' }
		} catch (error: any) {
			console.log('Error al eliminar técnico: ', error.message)

			return { message: 'Eliminar técnico: error desconocido', type: 'Error' }
		}
	}

	async findAll(): Promise<FindTechnicianResponse> {
		try {
			const res = await this.db.select().from(schema.techniciansTable).execute()

			if (res.length === 0) {
				return { type: 'NoHasTechnicians' }
			}

			return { technician: res, type: 'Success' }
		} catch (error: any) {
			console.log('Error al buscar técnicos: ', error.message)
			return { message: 'Buscar técnicos: error desconocido', type: 'Error' }
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

			return { technician: res, type: 'Success' }
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
			await this.db
				.update(schema.techniciansTable)
				.set({
					initials: data.initials,
					name: data.name
				})
				.where(eq(schema.techniciansTable.id, data.id))

			return { type: 'Success' }
		} catch (error: any) {
			console.log('Error al editar técnico: ', error.message)

			return { message: 'Editar técnico: error desconocido', type: 'Error' }
		}
	}

	async hasVisits(id: string): Promise<boolean> {
		try {
			const res = await this.db
				.select({ id: schema.visitsTable.id })
				.from(schema.visitsTable)
				.where(eq(schema.visitsTable.id_technician, id))
				.limit(1)
				.execute()

			return res.length > 0
		} catch (error: any) {
			console.log('Error al verificar visitas del técnico: ', error.message)
			return false
		}
	}
}
