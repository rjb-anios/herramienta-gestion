import type {
	AddTechnicianResponse,
	ToggleActiveResponse,
	EditTechnicianRequest,
	EditTechnicianResponse,
	FindTechnicianResponse,
	Technician
} from '@core/entities/Technician'

export interface TechnicianRepo {
	addTechnician: (technician: Technician) => Promise<AddTechnicianResponse>

	toggleActive: (id: string) => Promise<ToggleActiveResponse>

	editTechnician: (
		data: EditTechnicianRequest
	) => Promise<EditTechnicianResponse>

	findAll: () => Promise<FindTechnicianResponse>

	findActive: () => Promise<FindTechnicianResponse>

	findById: (id: string) => Promise<FindTechnicianResponse>

	existsById: (id: string) => Promise<boolean>
}
