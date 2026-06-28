import type { FC } from 'hono/jsx'

const NotFound: FC = async () => {
	return await (
		<section class='w-10/12 h-full text-3xl p-4 flex mx-auto'>
			<p class='m-auto w-fit h-fit'>La página que intenta visitar no existe</p>
		</section>
	)
}

export default NotFound
