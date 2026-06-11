import type {
	AddOrDeleteMachineResponse,
	Machine
} from '@core/entities/Machine'
import type { MachineRepo } from '@core/ports/MachineRepo'

export class RegMachineCommand {
	constructor(private readonly machineRepo: MachineRepo) {}

	async execute(
		data: Omit<Machine, 'id' | 'id_client'>
	): Promise<AddOrDeleteMachineResponse> {
		const serialExists = await this.machineRepo.existsBySerialNumber(
			data.serial_number
		)
		if (serialExists) {
			return {
				message: 'Ya existe un equipo con ese número de serie',
				type: 'Error'
			}
		}

		const machine: Machine = {
			id: crypto.randomUUID(),
			id_client: null,
			...data
		}
		return await this.machineRepo.regMachine(machine)
	}
}
