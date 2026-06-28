import {
	editClientValidator,
	regClientValidator
} from '@adapters/http/middlewares/clientFormsValidator'
import ClientsTable from '@presentation/components/clients/ClientsTable'
import EditClientForm from '@presentation/components/clients/EditClientForm'
import RegClient from '@presentation/components/clients/RegClient'
import AssignMachine from '@presentation/components/machines/AssignMachine'
import MachinesTable from '@presentation/components/machines/MachinesTable'
import Back from '@presentation/components/reusables/Back'
import { Hono } from 'hono'
import type { Env } from 'src/env'

const clients = new Hono<Env>()

/// Obtiene lista de clientes registrados

clients.get('/all', async c => {
	const {
		queries: { findAllClients }
	} = c.get('clientCases')

	const res = await findAllClients.execute()

	if (res.type === 'Error') {
		return await c.render(
			<>
				<Back
					route='clients'
					title='Clientes'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>{res.message}</p>
			</>
		)
	}

	if (res.clients.length === 0) {
		return await c.render(
			<>
				<Back
					route='clients'
					title='Clientes'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>
					No existen clientes registrados
				</p>
			</>
		)
	}

	return await c.render(<ClientsTable arrClient={res.clients} />)
})

/// Obtiene formulario para registrar cliente

clients.get('/register', async c => {
	return await c.render(<RegClient />)
})

/// Registra cliente

clients.post('/register', regClientValidator, async c => {
	const { name, contact, phone, email } = c.req.valid('form')

	const {
		commands: { addClient }
	} = c.get('clientCases')

	const res = await addClient.execute({
		contact,
		email,
		name,
		phone
	})

	if (res.type === 'Error') {
		return await c.render(
			<RegClient>
				<p class='w-fit text-3xl m-auto block text-center'>{res.message}</p>
			</RegClient>
		)
	}

	return c.redirect('/dashboard/clients/register', 303)
})

/// Obtiene formulario para editar un cliente específico

clients.get('/all/edit/:id', async c => {
	const id = c.req.param('id')

	const {
		queries: { findClient }
	} = c.get('clientCases')

	const res = await findClient.execute(id)

	if (res.type === 'NotExists') {
		return await c.render(
			<>
				<Back
					route='clients/all'
					title='Editar cliente'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>
					El cliente no existe
				</p>
			</>
		)
	}

	if (res.type === 'Error') {
		return await c.render(
			<>
				<Back
					route='clients/all'
					title='Editar cliente'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>{res.message}</p>
			</>
		)
	}

	return await c.render(<EditClientForm data={res.client} />)
})

/// Edita cliente

clients.post('/all/edit/:id', editClientValidator, async c => {
	const {
		prevName,
		name,
		prevContact,
		contact,
		prevPhone,
		phone,
		email,
		prevEmail
	} = c.req.valid('form')

	const {
		commands: { editClient }
	} = c.get('clientCases')

	const id = c.req.param('id')

	const res = await editClient.execute({
		contact,
		email,
		id,
		name,
		phone,
		prevContact,
		prevEmail,
		prevName,
		prevPhone
	})

	if (res.type === 'NoHasChanges') {
		return await c.render(
			<>
				<Back
					route='clients/all'
					title='Editar cliente'
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
					route='clients/all'
					title='Editar cliente'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>{res.message}</p>
			</>
		)
	}

	return c.redirect('/dashboard/clients/all', 303)
})

/// Elimina cliente

clients.post('/all/delete/:id', async c => {
	const id: string = c.req.param('id')

	const {
		commands: { deleteClient }
	} = c.get('clientCases')

	const res = await deleteClient.execute(id)

	if (res.type === 'Error') {
		return await c.render(
			<>
				<Back
					route='clients/all'
					title='Eliminar cliente'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>{res.message}</p>
			</>
		)
	}

	return c.redirect('/dashboard/clients/all', 303)
})

/// Obtiene lista completa de equipos asignados a clientes

clients.get('/equipment/all', async c => {
	const {
		queries: { existsAnyClient }
	} = c.get('clientCases')

	const hasClients = await existsAnyClient.execute()

	if (!hasClients) {
		return await c.render(
			<>
				<Back
					route='clients'
					title='Equipos'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>
					Deben existir clientes registrados con equipos asignados para poder
					consultarlos
				</p>
			</>
		)
	}

	const {
		queries: { findAllMachinesWithClientName }
	} = c.get('machineCases')

	const resMach = await findAllMachinesWithClientName.execute()

	if (resMach.type === 'Error') {
		return await c.render(
			<>
				<Back
					route='clients'
					title='Equipos'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>{resMach.message}</p>
			</>
		)
	}

	if (resMach.machines.length === 0) {
		return await c.render(
			<>
				<Back
					route='clients'
					title='Equipos'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>
					No existen ningún equipo asignado a un cliente
				</p>
			</>
		)
	}

	return await c.render(<MachinesTable arrMachine={resMach.machines} />)
})

/// Obtiene la lista de equipos asignados a un cliente particular

clients.get('/equipment/:id/all', async c => {
	const id = c.req.param('id')
	const {
		queries: { findAllMachinesByClient }
	} = c.get('machineCases')

	const res = await findAllMachinesByClient.execute(id)

	if (res.type === 'Error') {
		return c.json([])
	}

	if (res.machines.length === 0) {
		return c.json([])
	}

	return c.json(res.machines)
})

// Obtiene formulario paa asignar equipo desde depósito

clients.get('/equipment/assign', async c => {
	const {
		queries: { findAllClients }
	} = c.get('clientCases')

	const {
		queries: { findAllWarehouseMachines }
	} = c.get('machineCases')

	const clientsRes = await findAllClients.execute()
	const machinesRes = await findAllWarehouseMachines.execute()

	if (clientsRes.type === 'Error') {
		return await c.render(
			<>
				<Back
					route='clients'
					title='Asignar equipo'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>
					{clientsRes.message}
				</p>
			</>
		)
	}

	if (machinesRes.type === 'Error') {
		return await c.render(
			<>
				<Back
					route='clients'
					title='Asignar equipo'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>
					{machinesRes.message}
				</p>
			</>
		)
	}

	if (clientsRes.clients.length === 0 || machinesRes.machines.length === 0) {
		return await c.render(
			<>
				<Back
					route='clients'
					title='Asignar equipo'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>
					Deben existir clientes registrados y equipos en depósito para realizar
					una asignación
				</p>
			</>
		)
	}

	return await c.render(
		<AssignMachine
			arrClient={clientsRes.clients}
			arrMachine={machinesRes.machines}
		/>
	)
})

// Asigna desde depósito equipo a cliente

clients.post('/equipment/assign', async c => {
	const form = await c.req.formData()
	const clientId = form.get('id_client') as string
	const machineId = form.get('id_machine') as string

	if (!clientId || !machineId) {
		return await c.render(
			<>
				<Back
					route='clients'
					title='Asignar equipo'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>
					Debe seleccionar un cliente y un equipo
				</p>
			</>
		)
	}

	const {
		commands: { assignMachine }
	} = c.get('machineCases')

	const res = await assignMachine.execute(machineId, clientId)

	if (res.type === 'Error') {
		return await c.render(
			<>
				<Back
					route='clients'
					title='Asignar equipo'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>{res.message}</p>
			</>
		)
	}

	return c.redirect('/dashboard/clients/equipment/assign', 303)
})

export default clients
