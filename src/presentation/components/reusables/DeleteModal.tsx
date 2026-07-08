import type { FC, PropsWithChildren } from 'hono/jsx'

type Route = 'clients/all' | 'users/all' | 'service/technicians/all'

type Mode = 'delete' | 'deactive'

const DeleteModal: FC<
	PropsWithChildren<{ route: Route; name: string; id: string; mode: Mode }>
> = async ({ route, name, id, mode }) => {
	return (
		<div class='flex flex-col text-3xl w-[480px] max-[650px]:text-2xl max-[650px]:w-[300px] items-center justify-center m-auto border p-8 gap-8'>
			<h3 class='w-fit mx-auto text-center'>
				¿Estás seguro que deseas {mode === 'delete' ? 'eliminar' : 'desactivar'}
				&nbsp;a <b>{name}</b>?
			</h3>
			<div class='flex gap-10 justify-center'>
				<form
					action={`/dashboard/${route}/delete/${id}`}
					method='post'
				>
					<button
						class='text-red-700 cursor-pointer'
						type='submit'
					>
						<strong>{mode === 'delete' ? 'Eliminar' : 'Desactivar'}</strong>
					</button>
				</form>
				<form method='dialog'>
					<button
						class='cursor-pointer'
						type='submit'
					>
						Cerrar
					</button>
				</form>
			</div>
		</div>
	)
}

export default DeleteModal
