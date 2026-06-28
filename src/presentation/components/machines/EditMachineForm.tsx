import type { Machine } from '@core/entities/Machine'
import Back from '@presentation/components/reusables/Back'
import type { FC, PropsWithChildren } from 'hono/jsx'

const EditMachineForm: FC<PropsWithChildren<{ data: Machine }>> = async ({
	children,
	data
}) => {
	return await (
		<>
			<Back
				route='warehouse/all'
				title='Editar equipo'
			/>
			<form
				action={`/dashboard/warehouse/all/edit/${data.id}`}
				class='min-w-[300px] w-full max-w-[500px] h-fit m-auto flex flex-col gap-5'
				id='editMachine'
				method='post'
			>
				<input
					autocomplete='off'
					class='hidden'
					hidden
					name='id'
					readonly
					required
					tabindex={-1}
					type='text'
					value={data.id}
				/>
				<label class='flex flex-col'>
					Fabricante actual
					<input
						autocomplete='off'
						class='h-[45px] min-w-[300px] w-full max-w-[500px] border-t px-[10px] outline-none mx-auto read-only:text-gray-600 truncate'
						maxlength={40}
						minlength={4}
						name='prevManufacturer'
						placeholder='Fabricante (ej. Endoclear)'
						readonly
						required
						tabindex={-1}
						type='text'
						value={data.manufacturer}
					/>
				</label>
				<input
					autocomplete='on'
					class='input text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					maxlength={40}
					minlength={4}
					name='manufacturer'
					placeholder='Nuevo fabricante (ej. Ecolab)'
					type='text'
				/>
				<label class='flex flex-col'>
					Modelo actual
					<input
						autocomplete='off'
						class='h-[45px] min-w-[300px] w-full max-w-[500px] border-t px-[10px] outline-none mx-auto read-only:text-gray-600 truncate'
						maxlength={16}
						minlength={4}
						name='prevModel'
						placeholder='Modelo (ej. CP200)'
						readonly
						required
						tabindex={-1}
						type='text'
						value={data.model}
					/>
				</label>
				<input
					autocomplete='on'
					class='input text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					maxlength={16}
					minlength={4}
					name='model'
					placeholder='Nuevo modelo (ej. CP206)'
					type='text'
				/>
				<label class='flex flex-col'>
					Número de serial actual
					<input
						autocomplete='off'
						class='h-[45px] min-w-[300px] w-full max-w-[500px] border-t px-[10px] outline-none mx-auto read-only:text-gray-600 truncate'
						maxlength={16}
						minlength={4}
						name='prevSerial_number'
						placeholder='Número de serial'
						readonly
						required
						tabindex={-1}
						type='text'
						value={data.serial_number}
					/>
				</label>
				<input
					autocomplete='off'
					class='input text-3xl h-[45px] min-w-[300px] w-full max-w-[500px] px-[10px] outline-none mx-auto truncate'
					maxlength={16}
					minlength={4}
					name='serial_number'
					placeholder='Nuevo número de serial'
					type='text'
				/>
				{children}
				<button
					class='h-[40px] w-[150px] p-2 border mx-auto hover:cursor-pointer'
					form='editMachine'
					type='submit'
				>
					Guardar
				</button>
			</form>
		</>
	)
}

export default EditMachineForm
