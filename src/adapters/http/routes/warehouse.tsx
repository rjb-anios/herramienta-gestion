import {
	editMachineValidator,
	regMachineValidator
} from '@adapters/http/middlewares/machineFormsValidator'
import EditMachineForm from '@presentation/components/machines/EditMachineForm'
import RegMachine from '@presentation/components/machines/RegMachine'
import Back from '@presentation/components/reusables/Back'
import WarehouseMachinesTable from '@presentation/components/warehouse/WarehouseMachinesTable'
import { Hono } from 'hono'
import type { Env } from 'src/env'

const warehouse = new Hono<Env>()

/// Listar equipos en depósito

warehouse.get('/all', async c => {
	const {
		queries: { findAllWarehouseMachines }
	} = c.get('machineCases')

	const res = await findAllWarehouseMachines.execute()

	if (res.type === 'Error') {
		return await c.render(
			<>
				<Back
					route='warehouse'
					title='Equipos'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>{res.message}</p>
			</>
		)
	}

	if (res.machines.length === 0) {
		return await c.render(
			<>
				<Back
					route='warehouse'
					title='Equipos'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>
					No existen equipos en depósito
				</p>
			</>
		)
	}

	return await c.render(<WarehouseMachinesTable arrMachine={res.machines} />)
})

/// Obtiene formulario de registro de equipos

warehouse.get('/register', async c => {
	return await c.render(<RegMachine />)
})

/// Registrar equipo en depósito

warehouse.post('/register', regMachineValidator, async c => {
	const { manufacturer, model, serial_number } = c.req.valid('form')

	const {
		commands: { regMachine }
	} = c.get('machineCases')

	const res = await regMachine.execute({
		manufacturer,
		model,
		serial_number
	})

	if (res.type === 'Error') {
		return await c.render(
			<RegMachine>
				<p class='w-fit text-3xl m-auto block text-center'>{res.message}</p>
			</RegMachine>
		)
	}

	return c.redirect('/dashboard/warehouse', 303)
})

//// Obtiene formulario para editar datos de equipo

warehouse.get('/all/edit/:id', async c => {
	const id = c.req.param('id')

	const {
		queries: { findMachine }
	} = c.get('machineCases')

	const res = await findMachine.execute(id)

	if (res.type === 'NotExists') {
		return await c.render(
			<>
				<Back
					route='warehouse/all'
					title='Editar equipo'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>
					El equipo que intenta buscar no existe
				</p>
			</>
		)
	}

	if (res.type === 'Error') {
		return await c.render(
			<>
				<Back
					route='warehouse/all'
					title='Editar equipo'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>{res.message}</p>
			</>
		)
	}

	return await c.render(<EditMachineForm data={res.machine} />)
})

//// Edita datos de equipo

warehouse.post('/all/edit/:id', editMachineValidator, async c => {
	const {
		prevManufacturer,
		manufacturer,
		prevModel,
		model,
		prevSerial_number: prevSerialNumber,
		serial_number: serialNumber
	} = c.req.valid('form')

	const {
		commands: { editMachine }
	} = c.get('machineCases')

	const id = c.req.param('id')

	const res = await editMachine.execute({
		id,
		manufacturer,
		model,
		prevManufacturer,
		prevModel,
		prevSerial_number: prevSerialNumber,
		serial_number: serialNumber
	})

	if (res.type === 'NoHasChanges') {
		return await c.render(
			<>
				<Back
					route='warehouse/all'
					title='Editar equipo'
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
					route='warehouse/all'
					title='Editar equipo'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>{res.message}</p>
			</>
		)
	}

	return c.redirect('/dashboard/warehouse/all', 303)
})

//// Elimina un equipo

warehouse.post('/all/delete/:id', async c => {
	const id = c.req.param('id')
	const {
		commands: { deleteMachine }
	} = c.get('machineCases')

	const res = await deleteMachine.execute(id)

	if (res.type === 'Error') {
		return await c.render(
			<>
				<Back
					route='warehouse/all'
					title='Eliminar equipo'
				/>
				<p class='w-fit text-3xl m-auto block text-center'>{res.message}</p>
			</>
		)
	}

	return c.redirect('/dashboard/warehouse/all', 303)
})

export default warehouse
