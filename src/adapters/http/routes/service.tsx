import {
	isValidUUID,
	isValidYear
} from '@adapters/external/optionalValidationTool'
import {
	editTechValidator,
	regTechValidator
} from '@adapters/http/middlewares/technicianFormsValidator'
import {
	editVisitValidator,
	regVisitValidator
} from '@adapters/http/middlewares/visitFormsValidator'
import Back from '@presentation/components/reusables/Back'
import EditTechnicianForm from '@presentation/components/technician/EditTechicianForm'
import RegTech from '@presentation/components/technician/RegTech'
import TechniciansTable from '@presentation/components/technician/TechniciansTable'
import EditVisitForm from '@presentation/components/visits/EditVisitForm'
import RegVisit from '@presentation/components/visits/RegVisit'
import VisitsTable from '@presentation/components/visits/VisitsTable'
import { Hono } from 'hono'
import type { Env } from 'src/env'

const service = new Hono<Env>()

/// Obtiene la lista de años en los que hay visitas registradas.

service.get('/visits/all', async c => {
	const {
		queries: { getAvailableYears }
	} = c.get('visitCases')

	const res = await getAvailableYears.execute()

	if (res.type === 'Error') {
		return await c.render(
			<>
				<Back
					route='service'
					title='Visitas'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>{res.message}</p>
			</>
		)
	}

	if (res.years.length === 0) {
		return await c.render(
			<>
				<Back
					route='service'
					title='Visitas'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>
					No existe ninguna visita registrada
				</p>
			</>
		)
	}

	return await c.render(
		<div
			class='hono-island flex flex-col gap-8'
			data-component='VisitsTable'
			data-props={JSON.stringify({ years: res.years })}
		>
			<VisitsTable years={res.years} />
		</div>
	)
})

/// Obtiene la lista completa de visitas realizadas en el año seleccionado

service.get('/visits/all/:year', async c => {
	const year = c.req.param('year')

	if (!isValidYear(year)) {
		return c.json({ message: 'Año inválido', type: 'Error' } as const, 400)
	}

	const {
		queries: { findVisits }
	} = c.get('visitCases')

	const visitsByYear = await findVisits.execute(year)

	return c.json(visitsByYear)
})

/// Obtiene el formulario de edición de la visita seleccionada

service.get('/visits/all/:year/edit/:id', async c => {
	const year = c.req.param('year')
	const id = c.req.param('id')

	if (!isValidYear(year) || !isValidUUID(id)) {
		return c.redirect('/dashboard/service/visits/all', 303)
	}

	const {
		queries: { findVisitById }
	} = c.get('visitCases')

	const res = await findVisitById.execute(id)

	if (res.type === 'NotVisits') {
		return await c.render(
			<>
				<Back
					route='service/visits/all'
					title='Editar visita'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>
					La visita que intenta editar no existe
				</p>
			</>
		)
	}

	if (res.type === 'Error') {
		return await c.render(
			<>
				<Back
					route='service/visits/all'
					title='Editar visita'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>{res.message}</p>
			</>
		)
	}

	if (res.type === 'Success') {
		const visit = res.visits[0]

		return await c.render(<EditVisitForm visit={visit} />)
	}
})

/// Edita la visita

service.post(
	'/visits/all/:year/edit/:id',
	async (c, next) => {
		const id = c.req.param('id')
		if (!isValidUUID(id)) {
			return c.redirect('/dashboard/service/visits/all', 303)
		}
		await next()
	},
	editVisitValidator,
	async c => {
		const { description, future } = c.req.valid('form')

		const {
			queries: { findVisitById },
			commands: { editVisit }
		} = c.get('visitCases')

		const id = c.req.param('id')
		const current = await findVisitById.execute(id)

		if (current.type !== 'Success') {
			return c.redirect('/dashboard/service/visits/all', 303)
		}

		const visit = current.visits[0]

		const res = await editVisit.execute({
			description,
			future: future || undefined,
			id,
			prevDescription: visit.description,
			prevFuture: visit.future ?? ''
		})

		if (res.type === 'NoHasChanges') {
			return await c.render(
				<>
					<Back
						route='service/visits/all'
						title='Editar visita'
					/>
					<p class='w-fit text-3xl m-auto block text-center'>
						No actualizó ningún dato
					</p>
				</>
			)
		}

		if (res.type === 'Error') {
			return await c.render(
				<>
					<Back
						route='service/visits/all'
						title='Editar visita'
					/>
					<p class='w-fit text-3xl m-auto block text-center'>{res.message}</p>
				</>
			)
		}

		return c.redirect(`/dashboard/service/visits/all`, 303)
	}
)

/// Obtiene formulario para registrar una nueva visita

service.get('/visits/register', async c => {
	const {
		queries: { findAllClients }
	} = c.get('clientCases')

	const clientsRes = await findAllClients.execute()

	if (clientsRes.type === 'Error') {
		return await c.render(
			<>
				<Back
					route='service'
					title='Registrar visita'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>
					{clientsRes.message}
				</p>
			</>
		)
	}

	if (clientsRes.clients.length === 0) {
		return await c.render(
			<>
				<Back
					route='service'
					title='Registrar visita'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>
					Deben tener clientes registrados para poder crear visitas
				</p>
			</>
		)
	}

	const {
		queries: { existsAnyMachine }
	} = c.get('machineCases')

	const existsMachine = await existsAnyMachine.execute()

	if (!existsMachine) {
		return await c.render(
			<>
				<Back
					route='service'
					title='Registrar visita'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>
					Deben tener equipos registrados para poder crear visitas
				</p>
			</>
		)
	}

	const {
		queries: { findActiveTechnicians }
	} = c.get('technicianCases')

	const technicians = await findActiveTechnicians.execute()

	if (technicians.type === 'NoHasTechnicians') {
		return await c.render(
			<>
				<Back
					route='service'
					title='Registrar visita'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>
					Deben existir técnicos registrados para poder crear visitas
				</p>
			</>
		)
	}

	if (technicians.type === 'Error') {
		return await c.render(
			<>
				<Back
					route='service'
					title='Registrar visita'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>
					{technicians.message}
				</p>
			</>
		)
	}

	if (technicians.type === 'Success') {
		return await c.render(
			<div
				class='hono-island flex flex-col gap-8'
				data-component='RegVisit'
				data-props={JSON.stringify({
					arrClient: clientsRes.clients,
					arrTech: technicians.technician
				})}
			>
				<RegVisit
					arrClient={clientsRes.clients}
					arrTech={technicians.technician}
				/>
			</div>
		)
	}
})

/// Registra la visita

service.post('/visits/register', regVisitValidator, async c => {
	const {
		date,
		client,
		machine,
		technician,
		concept,
		description,
		future,
		hours
	} = c.req.valid('form')

	const {
		commands: { addVisit }
	} = c.get('visitCases')

	const res = await addVisit.execute({
		concept,
		date,
		description,
		future,
		hours: Number(hours),
		id_client: client,
		id_machine: machine,
		id_technicians: technician
	})

	if (res.type === 'Error') {
		return await c.render(
			<>
				<Back
					route='service'
					title='Registrar visita'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>{res.message}</p>
			</>
		)
	}

	return c.redirect('/dashboard/service', 303)
})

/// Obtiene formulario para registrar técnico

service.get('/technicians/register', async c => {
	return await c.render(<RegTech />)
})

/// Registra técnico

service.post('/technicians/register', regTechValidator, async c => {
	const { name, initials, email, phone } = c.req.valid('form')

	const {
		commands: { addTechnician }
	} = c.get('technicianCases')

	const res = await addTechnician.execute({
		active: true,
		email,
		initials,
		name,
		phone
	})

	if (res.type === 'InitialsInUse') {
		return await c.render(
			<RegTech>
				<p class='w-fit text-3xl m-auto block text-center'>
					Conjunto de iniciales en uso
				</p>
			</RegTech>
		)
	}

	if (res.type === 'Error') {
		return await c.render(
			<RegTech>
				<p class='w-fit text-3xl m-auto block text-center'>{res.message}</p>
			</RegTech>
		)
	}

	return c.redirect('/dashboard/service', 303)
})

/// Obtiene la lista de técnicos registrados

service.get('/technicians/all', async c => {
	const {
		queries: { findAllTechnicians }
	} = c.get('technicianCases')

	const res = await findAllTechnicians.execute()

	if (res.type === 'NoHasTechnicians') {
		return await c.render(
			<>
				<Back
					route='service'
					title='Técnicos'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>
					No hay técnicos agregados
				</p>
			</>
		)
	}

	if (res.type === 'Error') {
		return await c.render(
			<>
				<Back
					route='service'
					title='Técnicos'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>{res.message}</p>
			</>
		)
	}

	if (res.type === 'Success') {
		const { role } = c.get('jwtPayload')
		return await c.render(
			<TechniciansTable
				arrTech={res.technician}
				role={role}
			/>
		)
	}
})

/// Obtiene formulario para editar datos de técnico

service.get('/technicians/all/edit/:id', async c => {
	const id = c.req.param('id')

	if (!isValidUUID(id)) {
		return c.redirect('/dashboard/service/technicians/all', 303)
	}

	const {
		queries: { findTechnicianById }
	} = c.get('technicianCases')

	const res = await findTechnicianById.execute(id)

	if (res.type === 'NotExists') {
		return await c.render(
			<>
				<Back
					route='service/technicians/all'
					title='Editar técnico'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>
					El técnico que intenta editar no existe
				</p>
			</>
		)
	}

	if (res.type === 'Error') {
		return await c.render(
			<>
				<Back
					route='service/technicians/all'
					title='Editar técnico'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>{res.message}</p>
			</>
		)
	}

	if (res.type === 'Success') {
		const technician = res.technician[0]

		return await c.render(<EditTechnicianForm data={technician} />)
	}
})

/// Edita técnico

service.post('/technicians/all/edit/:id', editTechValidator, async c => {
	const { id, prevInitials, initials, prevName, name, prevEmail, email, prevPhone, phone } =
		c.req.valid('form')

	const {
		commands: { editTechnician }
	} = c.get('technicianCases')

	const res = await editTechnician.execute({
		id,
		initials,
		name,
		prevInitials,
		prevName,
		email,
		prevEmail,
		phone,
		prevPhone
	})

	if (res.type === 'NoHasChanges') {
		return await c.render(
			<>
				<Back
					route='service/technicians/all'
					title='Editar técnico'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>
					No actualizó ningún dato
				</p>
			</>
		)
	}

	if (res.type === 'Error') {
		return await c.render(
			<>
				<Back
					route='service/technicians/all'
					title='Editar técnico'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>{res.message}</p>
			</>
		)
	}

	return c.redirect('/dashboard/service/technicians/all', 303)
})

/// Activar / Desactivar técnico

service.post('/technicians/all/toggle-active/:id', async c => {
	const id = c.req.param('id')

	if (!isValidUUID(id)) {
		return c.redirect('/dashboard/service/technicians/all', 303)
	}

	const {
		commands: { deactivateTechnician }
	} = c.get('technicianCases')

	const res = await deactivateTechnician.execute(id)

	if (res.type === 'Error') {
		return await c.render(
			<>
				<Back
					route='service/technicians/all'
					title='Cambiar estado'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>{res.message}</p>
			</>
		)
	}

	return c.redirect('/dashboard/service/technicians/all', 303)
})

export default service
