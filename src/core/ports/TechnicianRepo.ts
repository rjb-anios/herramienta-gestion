import type {
	AddTechnicianResponse,
	DeleteTechnicianResponse,
	EditTechnicianRequest,
	EditTechnicianResponse,
	FindTechnicianResponse,
	Technician
} from '@core/entities/Technician'

export interface TechnicianRepo {
	addTechnician: (technician: Technician) => Promise<AddTechnicianResponse>

	deleteTechnician: (id: string) => Promise<DeleteTechnicianResponse>

	editTechnician: (
		data: EditTechnicianRequest
	) => Promise<EditTechnicianResponse>

	findAll: () => Promise<FindTechnicianResponse>

	findById: (id: string) => Promise<FindTechnicianResponse>

	existsById: (id: string) => Promise<boolean>

	hasVisits: (id: string) => Promise<boolean>
}
