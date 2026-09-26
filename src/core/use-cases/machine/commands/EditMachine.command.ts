import type {
	EditMachineRequest,
	EditMachineResponse
} from '@core/entities/Machine'
import type { MachineRepo } from '@core/ports/MachineRepo'
import { mergeMachineData } from '@core/use-cases/machine/mergeMachineData'

export class EditMachineCommand {
	constructor(private readonly machineRepo: MachineRepo) {}

	async execute(data: EditMachineRequest): Promise<EditMachineResponse> {
		const machine = await this.machineRepo.findMachine(data.id)

		if (machine.type === 'NotExists') {
			return { message: 'El equipo no existe', type: 'Error' }
		}

		if (machine.type === 'Error') {
			return { message: machine.message, type: 'Error' }
		}

		if (
			data.serial_number !== undefined &&
			data.serial_number !== '' &&
			data.serial_number !== data.prevSerial_number
		) {
			const serialExists = await this.machineRepo.existsBySerialNumber(
				data.serial_number
			)

			if (serialExists) {
				return {
					message: 'Ya existe un equipo con ese número de serie',
					type: 'Error'
				}
			}
		}

		const { hasChanges, data: mergedData } = mergeMachineData(data)

		if (!hasChanges) {
			return { type: 'NoHasChanges' }
		}

		return await this.machineRepo.editMachine(mergedData)
	}
}
