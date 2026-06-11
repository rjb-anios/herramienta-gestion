import * as schema from '@adapters/db/SchemaD1'
import type {
	AddOrDeleteMachineResponse,
	EditMachineRequest,
	EditMachineResponse,
	FindAllMachinesResponse,
	FindAllMachinesWithClientNameResponse,
	FindMachineResponse,
	Machine
} from '@core/entities/Machine'
import type { MachineRepo } from '@core/ports/MachineRepo'
import { asc, eq, isNull } from 'drizzle-orm'
import type { DrizzleD1Database } from 'drizzle-orm/d1'

export class D1MachineRepo implements MachineRepo {
	constructor(private readonly db: DrizzleD1Database<typeof schema>) {}

	/// Asociar una máquina a un cliente particular

	async addMachine(data: Machine): Promise<AddOrDeleteMachineResponse> {
		try {
			await this.db.insert(schema.machinesTable).values({
				id: data.id,
				id_client: data.id_client,
				manufacturer: data.manufacturer,
				model: data.model,
				serial_number: data.serial_number
			})

			return { type: 'Success' }
		} catch (error: any) {
			console.log('Error a agregar un equipo a cliente: ', error.message)

			return {
				message: 'Agregar equipo: error desconocido',
				type: 'Error'
			}
		}
	}

	/// Eliminar una máquina asociada a un cliente

	async deleteMachine(id: string): Promise<AddOrDeleteMachineResponse> {
		try {
			await this.db
				.delete(schema.machinesTable)
				.where(eq(schema.machinesTable.id, id))

			return { type: 'Success' }
		} catch (error: any) {
			console.log('Error al eliminar equipo: ', error.message)

			return { message: 'Eliminar equipo: error desconocido', type: 'Error' }
		}
	}

	/// Buscar una máquina específica mediante su ID

	async findMachine(id: string): Promise<FindMachineResponse> {
		try {
			const res = await this.db
				.select()
				.from(schema.machinesTable)
				.where(eq(schema.machinesTable.id, id))
				.execute()

			if (res.length === 0) {
				return { type: 'NotExists' }
			}

			return { machine: res[0], type: 'Success' }
		} catch (error: any) {
			console.log('Error al buscar equipo: ', error.message)

			return { message: 'Buscar equipo: error desconocido', type: 'Error' }
		}
	}

	/// Editar características de máquina

	async editMachine(data: EditMachineRequest): Promise<EditMachineResponse> {
		try {
			await this.db
				.update(schema.machinesTable)
				.set({
					manufacturer: data.manufacturer,
					model: data.model,
					serial_number: data.serial_number
				})
				.where(eq(schema.machinesTable.id, data.id))

			return { type: 'Success' }
		} catch (error: any) {
			console.log('Error al editar equipo: ', error.message)

			return { message: 'Editar equipo: error desconocido', type: 'Error' }
		}
	}

	/// Verificar si existe una máquina con el mismo número de serie

	async existsBySerialNumber(serial: string): Promise<boolean> {
		try {
			const res = await this.db
				.select({ id: schema.machinesTable.id })
				.from(schema.machinesTable)
				.where(eq(schema.machinesTable.serial_number, serial))
				.limit(1)
				.execute()

			return res.length > 0
		} catch (error: any) {
			console.log(
				'Error al verificar número de serie de equipo: ',
				error.message
			)
			return false
		}
	}

	async regMachine(data: Machine): Promise<AddOrDeleteMachineResponse> {
		try {
			await this.db.insert(schema.machinesTable).values({
				id: data.id,
				id_client: null,
				manufacturer: data.manufacturer,
				model: data.model,
				serial_number: data.serial_number
			})

			return { type: 'Success' }
		} catch (error: any) {
			console.log('Error al registrar equipo en depósito: ', error.message)
			return {
				message: 'Registrar equipo en depósito: error desconocido',
				type: 'Error'
			}
		}
	}

	async assignToClient(
		machineId: string,
		clientId: string
	): Promise<AddOrDeleteMachineResponse> {
		try {
			await this.db
				.update(schema.machinesTable)
				.set({ id_client: clientId })
				.where(eq(schema.machinesTable.id, machineId))

			return { type: 'Success' }
		} catch (error: any) {
			console.log('Error al asignar equipo a cliente: ', error.message)

			return {
				message: 'Asignar equipo: error desconocido',
				type: 'Error'
			}
		}
	}

	async findAllWarehouse(): Promise<FindAllMachinesResponse> {
		try {
			const res = await this.db
				.select()
				.from(schema.machinesTable)
				.where(isNull(schema.machinesTable.id_client))
				.orderBy(asc(schema.machinesTable.manufacturer))
				.execute()

			return { machines: res, type: 'Success' }
		} catch (error: any) {
			console.log('Error al buscar equipos en depósito: ', error.message)

			return {
				message: 'Buscar depósito: error desconocido',
				type: 'Error'
			}
		}
	}

	async existsAnyMachine(): Promise<boolean> {
		try {
			const res = await this.db
				.select({ id: schema.machinesTable.id })
				.from(schema.machinesTable)
				.limit(1)
				.execute()

			return res.length > 0
		} catch (error: any) {
			console.log('Error al verificar si existen equipos: ', error.message)

			return false
		}
	}

	async findAllMachinesWithClientName(): Promise<FindAllMachinesWithClientNameResponse> {
		try {
			const res = await this.db
				.select({
					client: schema.clientsTable.name,
					id: schema.machinesTable.id,
					id_client: schema.machinesTable.id_client,
					manufacturer: schema.machinesTable.manufacturer,
					model: schema.machinesTable.model,
					serial_number: schema.machinesTable.serial_number
				})
				.from(schema.machinesTable)
				.innerJoin(
					schema.clientsTable,
					eq(schema.machinesTable.id_client, schema.clientsTable.id)
				)
				.orderBy(asc(schema.clientsTable.name))
				.execute()

			return { machines: res, type: 'Success' }
		} catch (error: any) {
			console.log(
				'Error al buscar la lista de equipos con cliente: ',
				error.message
			)

			return {
				message: 'Buscar equipos con cliente: error desconocido',
				type: 'Error'
			}
		}
	}

	async findAllMachines(): Promise<FindAllMachinesResponse> {
		try {
			const res = await this.db
				.select()
				.from(schema.machinesTable)
				.orderBy(asc(schema.machinesTable.manufacturer))
				.execute()

			return { machines: res, type: 'Success' }
		} catch (error: any) {
			console.log('Error al buscar la lista de equipos: ', error.message)

			return {
				message: 'Buscar equipos: error desconocido',
				type: 'Error'
			}
		}
	}

	async hasVisits(id: string): Promise<boolean> {
		try {
			const res = await this.db
				.select({ id: schema.visitsToMachinesTable.id_machine })
				.from(schema.visitsToMachinesTable)
				.where(eq(schema.visitsToMachinesTable.id_machine, id))
				.limit(1)
				.execute()

			return res.length > 0
		} catch (error: any) {
			console.log('Error al verificar uso del equipo: ', error.message)
			return false
		}
	}

	/// Buscar todas las máquinas asociadas a un cliente particular

	async findAllMachinesByClient(id: string): Promise<FindAllMachinesResponse> {
		try {
			const res = await this.db
				.select()
				.from(schema.machinesTable)
				.where(eq(schema.machinesTable.id_client, id))
				.orderBy(asc(schema.machinesTable.manufacturer))
				.execute()

			return { machines: res, type: 'Success' }
		} catch (error: any) {
			console.log('Error al buscar equipos por cliente: ', error.message)

			return {
				message: 'Buscar equipos por cliente: error desconocido',
				type: 'Error'
			}
		}
	}
}
