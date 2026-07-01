import type { FC, PropsWithChildren } from 'hono/jsx'

type Route =
	| 'users'
	| 'users/all'
	| 'clients'
	| 'clients/all'
	| 'clients/equipment/all'
	| 'service'
	| 'service/technicians/all'
	| 'warehouse'
	| 'warehouse/all'

type Title =
	| 'Equipos'
	| 'Registrar equipo'
	| 'Editar equipo'
	| 'Eliminar equipo'
	| 'Asignar equipo'
	| 'Clientes'
	| 'Registrar cliente'
	| 'Editar cliente'
	| 'Eliminar cliente'
	| 'Usuarios'
	| 'Registrar usuario'
	| 'Editar usuario'
	| 'Eliminar usuario'
	| 'Técnicos'
	| 'Registrar técnico'
	| 'Editar técnico'
	| 'Eliminar técnico'
	| 'Visitas'
	| 'Registrar visita'
	| 'Mover equipo'

const Back: FC<PropsWithChildren<{ route: Route; title: Title }>> = ({
	route,
	title
}) => {
	return (
		<div class='flex flex-col gap-4'>
			<a
				class='w-fit'
				href={`/dashboard/${route}`}
			>
				⬅️ Volver
			</a>
			<h2 class='w-fit h-fit text-4xl'>{title}</h2>
		</div>
	)
}

export default Back
