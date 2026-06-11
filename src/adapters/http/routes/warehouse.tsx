import { regMachineValidator } from '@adapters/http/middlewares/machineFormsValidator'
import RegMachine from '@presentation/components/machines/RegMachine'
import { Hono } from 'hono'
import type { Env } from 'src/env'

const warehouse = new Hono<Env>()

// Listar equipos en depósito

warehouse.get('/all', async c => {
	const {
		queries: { findAllWarehouseMachines }
	} = c.get('machineCases')

	const res = await findAllWarehouseMachines.execute()

	if (res.type === 'Error') {
		return await c.render(
			<>
				<div class='flex flex-col gap-4'>
					<a href='/dashboard/warehouse'>🡨 Volver</a>
					<h2 class='w-fit h-fit text-4xl'>Equipos</h2>
				</div>
				<p class='w-fit text-3xl m-auto block text-center'>{res.message}</p>
			</>
		)
	}

	if (res.machines.length === 0) {
		return await c.render(
			<>
				<div class='flex flex-col gap-4'>
					<a href='/dashboard/warehouse'>🡨 Volver</a>
					<h2 class='w-fit h-fit text-4xl'>Equipos</h2>
				</div>
				<p class='w-fit text-3xl m-auto block text-center'>
					No existen equipos en depósito
				</p>
			</>
		)
	}

	return await c.render(
		<>
			<div class='flex flex-col gap-4'>
				<a href='/dashboard/warehouse'>🡨 Volver</a>
				<h2 class='w-fit h-fit text-4xl'>Equipos</h2>
			</div>
			<table class='text-3xl min-w-[890px] w-auto max-w-[1440px] mx-auto'>
				<thead class='w-full border-b p-3'>
					<tr class='h-[40px]'>
						<th class='w-1/3 border-x'>Fabricante</th>
						<th class='w-1/3 border-x'>Modelo</th>
						<th class='w-1/3 border-x'>Número de serie</th>
					</tr>
				</thead>
				<tbody class='w-full text-center p-3'>
					{res.machines.map(m => (
						<tr class='h-[40px]'>
							<td class='w-1/3 border-x truncate'>{m.manufacturer}</td>
							<td class='w-1/3 border-x truncate'>{m.model}</td>
							<td class='w-1/3 border-x truncate'>{m.serial_number}</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	)
})

// Formulario de ingreso

warehouse.get('/register', async c => {
	return await c.render(<RegMachine />)
})

// Registrar ingreso

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

	return await c.render(
		<RegMachine>
			<p class='w-fit text-3xl mx-auto block text-green-900'>
				Se ingresó el equipo al depósito correctamente
			</p>
		</RegMachine>
	)
})

export default warehouse
