import { kvCacheGet, kvCacheInvalidate } from '@adapters/db/kvCache'
import * as schema from '@adapters/db/SchemaD1'
import { getErrorMessage } from '@adapters/external/errorTools'
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
	constructor(
		private readonly db: DrizzleD1Database<typeof schema>,
		private readonly kv: KVNamespace
	) {}

	private get cacheKeys() {
		return {
			assigned: 'machines:assigned',
			warehouse: 'machines:warehouse'
		}
	}

	private async invalidateAll() {
		const keys = Object.values(this.cacheKeys)
		await kvCacheInvalidate(this.kv, ...keys)
	}

	/// Eliminar una máquina asociada a un cliente

	async deleteMachine(id: string): Promise<AddOrDeleteMachineResponse> {
		try {
			await this.db
				.delete(schema.machinesTable)
				.where(eq(schema.machinesTable.id, id))
			await this.invalidateAll()

			return { type: 'Success' }
		} catch (error) {
			console.error('Error al eliminar equipo: ', getErrorMessage(error))

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
		} catch (error) {
			console.error('Error al buscar equipo: ', getErrorMessage(error))

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
			await this.invalidateAll()

			return { type: 'Success' }
		} catch (error) {
			console.error('Error al editar equipo: ', getErrorMessage(error))

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
		} catch (error) {
			console.error(
				'Error al verificar número de serie de equipo: ',
				getErrorMessage(error)
			)
			return false
		}
	}

	/// Registrar máquina en depósito

	async regMachine(data: Machine): Promise<AddOrDeleteMachineResponse> {
		try {
			await this.db.insert(schema.machinesTable).values({
				id: data.id,
				id_client: null,
				manufacturer: data.manufacturer,
				model: data.model,
				serial_number: data.serial_number
			})
			await this.invalidateAll()

			return { type: 'Success' }
		} catch (error) {
			console.error(
				'Error al registrar equipo en depósito: ',
				getErrorMessage(error)
			)
			return {
				message: 'Registrar equipo en depósito: error desconocido',
				type: 'Error'
			}
		}
	}

	/// Asignar máquina a cliente

	async assignToClient(
		machineId: string,
		clientId: string
	): Promise<AddOrDeleteMachineResponse> {
		try {
			await this.db
				.update(schema.machinesTable)
				.set({ id_client: clientId })
				.where(eq(schema.machinesTable.id, machineId))
			await this.invalidateAll()
			await kvCacheInvalidate(this.kv, `machines:by-client:${clientId}`)

			return { type: 'Success' }
		} catch (error) {
			console.error(
				'Error al asignar equipo a cliente: ',
				getErrorMessage(error)
			)

			return {
				message: 'Asignar equipo: error desconocido',
				type: 'Error'
			}
		}
	}

	/// Desasignar máquina a cliente

	async unassignFromClient(
		machineId: string
	): Promise<AddOrDeleteMachineResponse> {
		try {
			const machine = await this.findMachine(machineId)
			const oldClientId =
				machine.type === 'Success' ? machine.machine.id_client : null

			await this.db
				.update(schema.machinesTable)
				.set({ id_client: null })
				.where(eq(schema.machinesTable.id, machineId))
			await this.invalidateAll()

			if (oldClientId) {
				await kvCacheInvalidate(this.kv, `machines:by-client:${oldClientId}`)
			}

			return { type: 'Success' }
		} catch (error) {
			console.error('Error al desasignar equipo: ', getErrorMessage(error))

			return {
				message: 'Desasignar equipo: error desconocido',
				type: 'Error'
			}
		}
	}

	/// Buscar todos los equipos en depósito

	async findAllWarehouse(): Promise<FindAllMachinesResponse> {
		return kvCacheGet<FindAllMachinesResponse>(
			this.kv,
			this.cacheKeys.warehouse,
			async () => {
				try {
					const res = await this.db
						.select()
						.from(schema.machinesTable)
						.where(isNull(schema.machinesTable.id_client))
						.orderBy(asc(schema.machinesTable.manufacturer))
						.execute()

					return { machines: res, type: 'Success' }
				} catch (error) {
					console.error(
						'Error al buscar equipos en depósito: ',
						getErrorMessage(error)
					)

					return {
						message: 'Buscar depósito: error desconocido',
						type: 'Error'
					}
				}
			}
		)
	}

	/// Veirifica si existe alguna máquina en depósito

	async existsAnyMachine(): Promise<boolean> {
		try {
			const res = await this.db
				.select({ id: schema.machinesTable.id })
				.from(schema.machinesTable)
				.limit(1)
				.execute()

			return res.length > 0
		} catch (error) {
			console.error(
				'Error al verificar si existen equipos: ',
				getErrorMessage(error)
			)

			return false
		}
	}

	/// Buscar máquinas con nombre de cliente al cual está asignada

	async findAllMachinesWithClientName(): Promise<FindAllMachinesWithClientNameResponse> {
		return kvCacheGet<FindAllMachinesWithClientNameResponse>(
			this.kv,
			this.cacheKeys.assigned,
			async () => {
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
				} catch (error) {
					console.error(
						'Error al buscar la lista de equipos con cliente: ',
						getErrorMessage(error)
					)

					return {
						message: 'Buscar equipos con cliente: error desconocido',
						type: 'Error'
					}
				}
			}
		)
	}

	/// Buscar si una máquina particular ha sido intervenida en visitas técnicas

	async hasVisits(id: string): Promise<boolean> {
		try {
			const res = await this.db
				.select({ id: schema.visitsToMachinesTable.id_machine })
				.from(schema.visitsToMachinesTable)
				.where(eq(schema.visitsToMachinesTable.id_machine, id))
				.limit(1)
				.execute()

			return res.length > 0
		} catch (error) {
			console.error(
				'Error al verificar uso del equipo: ',
				getErrorMessage(error)
			)
			return false
		}
	}

	/// Buscar todas las máquinas asociadas a un cliente particular

	async findAllMachinesByClient(id: string): Promise<FindAllMachinesResponse> {
		return kvCacheGet<FindAllMachinesResponse>(
			this.kv,
			`machines:by-client:${id}`,
			async () => {
				try {
					const res = await this.db
						.select()
						.from(schema.machinesTable)
						.where(eq(schema.machinesTable.id_client, id))
						.orderBy(asc(schema.machinesTable.manufacturer))
						.execute()

					return { machines: res, type: 'Success' }
				} catch (error) {
					console.error(
						'Error al buscar equipos por cliente: ',
						getErrorMessage(error)
					)

					return {
						message: 'Buscar equipos por cliente: error desconocido',
						type: 'Error'
					}
				}
			},
			60
		)
	}
}
