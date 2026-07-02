import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, ViteClient } from 'vite-ssr-components/hono'

const renderer = jsxRenderer(async ({ children }) => {
	const scriptPath = import.meta.env.PROD ? '/client.js' : '/src/client.tsx'

	return await (
		<html lang='es'>
			<head>
				<meta charset='utf-8' />
				<meta
					content='width=device-width,initial-scale=1'
					name='viewport'
				/>
				<link
					href='/pc.png'
					rel='shortcut icon'
					type='image/x-icon'
				/>
				<script
					src={scriptPath}
					type='module'
				/>
				<Link
					href='/src/presentation/style.css'
					rel='stylesheet'
				/>
				<ViteClient />
				<title>Herramienta de Gestión</title>
			</head>
			<body class='w-full h-dvh'>
				<header class='h-1/12 flex min-h-[60px] pt-[10px] px-8'>
					<section class='m-auto'>
						<h1 class='text-5xl h-fit w-fit max-[660px]:text-4xl max-[490px]:text-3xl'>
							Herramienta de Gestión
						</h1>
					</section>
				</header>
				<main class='h-10/12 min-h-[450px] flex flex-col'>{children}</main>
				<footer class='h-1/12 min-h-[60px] flex flex-col text-2xl border-t pt-4'>
					<p class='mx-auto'>RB - 2026</p>
				</footer>
			</body>
		</html>
	)
})

export default renderer
