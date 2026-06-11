import type { FC } from 'hono/jsx'

const UsersLayout: FC = async props => {
	return await (
		<>
			<div class='flex flex-col gap-12'>
				<ul class='flex flex-col gap-4 mr-auto'>
					<h3 class='w-fit h-fit text-4xl'>Usuarios</h3>
					<li class='w-fit h-fit'>
						<a href='/dashboard/users/all'>Consultar usuarios</a>
					</li>
					<li class='w-fit h-fit'>
						<a href='/dashboard/users/register'>Registrar usuario</a>
					</li>
				</ul>
			</div>
			<section class='flex flex-col text-3xl pt-8 h-full justify-center'>
				{props.children}
			</section>
		</>
	)
}

export default UsersLayout
