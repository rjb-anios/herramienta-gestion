import * as schema from '@adapters/db/SchemaD1'
import type {
	AddVisitResponse,
	EditVisitRequest,
	EditVisitResponse,
	FindVisitsResponse,
	GetAvailableYearsResponse,
	Visit,
	VisitToDisplay
} from '@core/entities/Visit'
import type { VisitRepo } from '@core/ports/VisitRepo'
import { and, desc, eq, gte, lte, sql } from 'drizzle-orm'
import type { DrizzleD1Database } from 'drizzle-orm/d1'

export class D1VisitRepo implements VisitRepo {
	constructor(private readonly db: DrizzleD1Database<typeof schema>) {}

	/// Agregar una nueva visita

	async addVisit(data: Visit): Promise<AddVisitResponse> {
		try {
			const insertVisit = this.db.insert(schema.visitsTable).values({
				concept: data.concept,
				date: data.date,
				description: data.description,
				future: data.future ?? '',
				hours: Number(data.hours),
				id: data.id,
				id_client: data.id_client,
				id_technician: data.id_technicians[0]
			})

			const relations = []

			for (const machineId of data.id_machine) {
				relations.push(
					this.db.insert(schema.visitsToMachinesTable).values({
						id_machine: machineId,
						id_visit: data.id
					})
				)
			}

			for (const technicianId of data.id_technicians) {
				relations.push(
					this.db.insert(schema.visitsToTechniciansTable).values({
						id_technician: technicianId,
						id_visit: data.id
					})
				)
			}

			await this.db.batch([insertVisit, ...relations])

			return { type: 'Success' }
		} catch (error: any) {
			console.error('Error al registrar visita: ', error.message)
			return { message: 'Registrar visita: error desconocido', type: 'Error' }
		}
	}

	/// Editar una visita

	async editVisit(data: EditVisitRequest): Promise<EditVisitResponse> {
		try {
			const setData: Record<string, string | number> = {}

			if (data.description !== undefined) setData.description = data.description
			if (data.future !== undefined) setData.future = data.future
			await this.db
				.update(schema.visitsTable)
				.set(setData)
				.where(eq(schema.visitsTable.id, data.id))

			return { type: 'Success' }
		} catch (error: any) {
			console.log('Error al editar visita: ', error.message)

			return { message: 'Editar visita: error desconocido', type: 'Error' }
		}
	}

	/// Obtener un array con los años en los cuales hay visitas registradas

	async getAvailableYears(): Promise<GetAvailableYearsResponse> {
		try {
			const res = await this.db
				.select({
					year: sql<number>`CAST(strftime('%Y', ${schema.visitsTable.date}) AS INTEGER)`
				})
				.from(schema.visitsTable)
				.groupBy(sql`strftime('%Y', ${schema.visitsTable.date})`)
				.orderBy(sql`strftime('%Y', ${schema.visitsTable.date}) asc`)
				.execute()

			return { type: 'Success', years: res.map(e => e.year) }
		} catch (error: any) {
			console.log('Error al obtener años de visitas: ', error.message)

			return { message: 'Obtener años: error desconocido', type: 'Error' }
		}
	}

	/// Buscar visitas por un año en particular

	async findVisits(year: string): Promise<FindVisitsResponse> {
		try {
			const res = await this.db.query.visitsTable.findMany({
				orderBy: [desc(schema.visitsTable.date)],
				where: and(
					gte(schema.visitsTable.date, `${year}-01-01`),
					lte(schema.visitsTable.date, `${year}-12-31`)
				),
				with: {
					client: {
						columns: { id: true, name: true }
					},
					machines: {
						with: {
							machine: {
								columns: { id: true, model: true, serial_number: true }
							}
						}
					},
					technicians: {
						with: {
							technician: {
								columns: { initials: true }
							}
						}
					}
				}
			})

			if (res.length === 0) return { type: 'NotVisits' }

			const formattedVisits: VisitToDisplay[] = res.map(v => ({
				client: v.client.name,
				concept: v.concept,
				date: v.date,
				description: v.description,
				future: v.future ?? undefined,
				hours: Number(v.hours),
				id: v.id,
				machines: v.machines.map(m => m.machine),
				technicians: v.technicians.map(t => t.technician.initials)
			}))

			return { type: 'Success', visits: formattedVisits }
		} catch (error: any) {
			console.log(
				'Error al obtener lista general de visitas por año: ',
				error.message
			)

			return {
				message: 'Consultar visitas por año: error desconocido',
				type: 'Error'
			}
		}
	}

	async findVisitById(id: string): Promise<FindVisitsResponse> {
		try {
			const res = await this.db.query.visitsTable.findMany({
				where: eq(schema.visitsTable.id, id),
				with: {
					client: {
						columns: { id: true, name: true }
					},
					machines: {
						with: {
							machine: {
								columns: { id: true, model: true, serial_number: true }
							}
						}
					},
					technicians: {
						with: {
							technician: {
								columns: { initials: true }
							}
						}
					}
				}
			})

			if (res.length === 0) return { type: 'NotVisits' }

			const visit = res[0]

			return {
				type: 'Success',
				visits: [
					{
						client: visit.client.name,
						concept: visit.concept,
						date: visit.date,
						description: visit.description,
						future: visit.future ?? undefined,
						hours: Number(visit.hours),
						id: visit.id,
						machines: visit.machines.map(m => m.machine),
						technicians: visit.technicians.map(t => t.technician.initials)
					}
				]
			}
		} catch (error: any) {
			console.log('Error al buscar visita por ID: ', error.message)

			return {
				message: 'Buscar visita: error desconocido',
				type: 'Error'
			}
		}
	}
}
