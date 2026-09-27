import * as schema from '@adapters/db/SchemaD1'
import { getErrorMessage } from '@adapters/external/errorTools'
import type {
	AddVisitResponse,
	EditVisitRequest,
	EditVisitResponse,
	FindVisitsResponse,
	GetAvailableYearsResponse,
	Visit,
	VisitToDisplay,
	VisitToPrint
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
				client_signature: data.client_signature,
				client_signer: data.client_signer,
				concept: data.concept,
				date: data.date,
				future: data.future ?? '',
				hours: Number(data.hours),
				id: data.id,
				id_client: data.id_client,
				id_technician: data.id_technicians[0],
				register_description: data.register_description,
				sector: data.sector ?? '',
				task_description: data.task_description ?? '',
				technician_signature: data.technician_signature
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
		} catch (error) {
			console.error('Error al registrar visita: ', getErrorMessage(error))
			return { message: 'Registrar visita: error desconocido', type: 'Error' }
		}
	}

	/// Editar una visita

	/*

OJO:

Sólo se podrá editar:

* Descripción de tareas (task_description)
* Futuro
* Sector

La descripción de registro (register_description) es inmutable:
es la que se imprime en el PDF de la visita.

*/

	async editVisit(data: EditVisitRequest): Promise<EditVisitResponse> {
		try {
			const setData: Record<string, string | number> = {}

			if (data.task_description !== undefined)
				setData.task_description = data.task_description
			if (data.future !== undefined) setData.future = data.future
			if (data.sector !== undefined) setData.sector = data.sector
			await this.db
				.update(schema.visitsTable)
				.set(setData)
				.where(eq(schema.visitsTable.id, data.id))

			return { type: 'Success' }
		} catch (error) {
			console.error('Error al editar visita: ', getErrorMessage(error))

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
		} catch (error) {
			console.error(
				'Error al obtener años de visitas: ',
				getErrorMessage(error)
			)

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
				future: v.future ?? undefined,
				hours: Number(v.hours),
				id: v.id,
				machines: v.machines.map(m => m.machine),
				register_description: v.register_description,
				sector: v.sector ?? undefined,
				task_description: v.task_description ?? undefined,
				technicians: v.technicians.map(t => t.technician.initials)
			}))

			return { type: 'Success', visits: formattedVisits }
		} catch (error) {
			console.error(
				'Error al obtener lista general de visitas por año: ',
				getErrorMessage(error)
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
						future: visit.future ?? undefined,
						hours: Number(visit.hours),
						id: visit.id,
						machines: visit.machines.map(m => m.machine),
						register_description: visit.register_description,
						sector: visit.sector ?? undefined,
						task_description: visit.task_description ?? undefined,
						technicians: visit.technicians.map(t => t.technician.initials)
					}
				]
			}
		} catch (error) {
			console.error('Error al buscar visita por ID: ', getErrorMessage(error))

			return {
				message: 'Buscar visita: error desconocido',
				type: 'Error'
			}
		}
	}

	/// Obtener los datos completos de una visita para generar el PDF

	async findVisitToPrint(id: string): Promise<VisitToPrint | null> {
		try {
			const res = await this.db.query.visitsTable.findMany({
				where: eq(schema.visitsTable.id, id),
				with: {
					client: {
						columns: { contact: true, name: true }
					},
					machines: {
						with: {
							machine: {
								columns: {
									manufacturer: true,
									model: true,
									serial_number: true
								}
							}
						}
					},
					technicians: {
						with: {
							technician: {
								columns: { email: true, name: true, phone: true }
							}
						}
					}
				}
			})

			if (res.length === 0) return null

			const visit = res[0]

			return {
				client: visit.client.name,
				client_signature: visit.client_signature,
				client_signer: visit.client_signer,
				contact_client: visit.client.contact,
				date: visit.date,
				machines: visit.machines.map(m => ({
					manufacturer: m.machine.manufacturer,
					model: m.machine.model,
					serial_number: m.machine.serial_number
				})),
				register_description: visit.register_description,
				sector: visit.sector,
				technician_signature: visit.technician_signature,
				technicians: visit.technicians.map(t => ({
					email: t.technician.email,
					name: t.technician.name,
					phone: t.technician.phone
				}))
			}
		} catch (error) {
			console.error(
				'Error al obtener visita para PDF: ',
				getErrorMessage(error)
			)

			return null
		}
	}
}
