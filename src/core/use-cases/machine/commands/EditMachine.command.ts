import type {
	EditMachineRequest,
	EditMachineResponse
} from '@core/entities/Machine'
import type { MachineRepo } from '@core/ports/MachineRepo'
import { mergeMachineData } from '@core/use-cases/machine/mergeMachineData'

export class EditMachineCommand {
	constructor(private readonly machineRepo: MachineRepo) {}

	async execute(data: EditMachineRequest): Promise<EditMachineResponse> {
		const { hasChanges, data: mergedData } = mergeMachineData(data)

		if (!hasChanges) {
			return { type: 'NoHasChanges' }
		}

		return await this.machineRepo.editMachine(mergedData)
	}
}
