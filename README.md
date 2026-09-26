# Herramienta de Gestión

Aplicación para gestionar el servicio técnico de equipos médicos: visitas, clientes, equipos, técnicos y usuarios.

Arquitectura hexagonal: el núcleo (`src/core`) define entidades, puertos y casos de uso; los adaptadores (`src/adapters`) implementan HTTP, D1, KV y servicios externos; la presentación (`src/presentation`) usa Hono JSX con islas hidratadas en el cliente.

Stack: Cloudflare Workers + Hono + Vite, D1 (SQLite) con Drizzle ORM, KV, Tailwind CSS 4 + DaisyUI.

## Requisitos

- Node.js 20+
- pnpm 12+ (`packageManager` del proyecto)
- Wrangler autenticado (`pnpm exec wrangler login`) o variables de Cloudflare en el entorno

## Puesta en marcha

1. Instalar dependencias:

   ```sh
   pnpm install
   ```

2. Crear `.dev.vars` en la raíz (solo desarrollo local):

   ```sh
   ACCESS_TOKEN_SECRET=...
   REFRESH_TOKEN_SECRET=...
   ```

   En producción estos secretos viven en Cloudflare Secrets Store (bindings `AT_SECRET` y `RT_SECRET` definidos en `wrangler.jsonc`).

3. Crear `.env` (solo para drizzle-kit):

   ```sh
   CLOUDFLARE_ACCOUNT_ID=...
   CLOUDFLARE_DATABASE_ID=...
   CLOUDFLARE_API_TOKEN=...
   ```

4. Aplicar migraciones en la D1 local y levantar el servidor:

   ```sh
   pnpm migrate:local
   pnpm dev
   ```

   El primer usuario se registra desde `/register` y queda como Administrador.

## Scripts

| Script | Descripción |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo (Vite + Workers) |
| `pnpm build` | Build de producción en `dist/` |
| `pnpm preview` | Build + preview local del Worker compilado |
| `pnpm deploy` | Build + `wrangler deploy` |
| `pnpm check` | `typecheck` + `lint` (ejecutar antes de commitear) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` / `pnpm lint:fix` | Biome check / autofix |
| `pnpm migrate:local` / `pnpm migrate:remote` | Aplicar migraciones D1 |
| `pnpm clean` | Elimina `dist/` (ver Seguridad) |
| `pnpm cf-typegen` | Regenera `worker-configuration.d.ts` |

## Base de datos y KV

- Esquema Drizzle: `src/adapters/db/SchemaD1.ts`.
- Migraciones versionadas: `drizzle/migrations` (aplicadas con `wrangler d1 migrations apply`). El `schema.sql` es la referencia manual del esquema.
- Bindings: `DB` → D1 `herramienta-db`; `KV` → caché de listados y plantillas.

Plantilla de visita para la generación de PDF (feature en backlog). Sembrar en KV:

```sh
# local
pnpm exec wrangler kv key put reg07.pdf --binding=KV --local --path=public/reg07.pdf

# remoto
pnpm exec wrangler kv key put reg07.pdf --binding=KV --remote --path=public/reg07.pdf
```

## Roles

| Rol | Nivel | Permisos |
| --- | --- | --- |
| `A` | 100 | Administrador: acceso total |
| `t` | 40 | Técnico: registrar/editar visitas y asignar/desasignar equipos |
| `u` | 10 | Usuario: solo lectura |

La autorización se valida en el Worker (`src/server.tsx`); ocultar botones en la UI es solo cosmético.

## Seguridad

- No commitear `.env` ni `.dev.vars` (están en `.gitignore`).
- No compartir ni publicar la carpeta `dist/`: al construir, el plugin de Vite copia `.dev.vars` a `dist/herramienta/.dev.vars` para el preview local. Usa `pnpm clean` si la distribuyes.
- Los logs de error de los adaptadores usan `console.error` y quedan visibles en la observabilidad del Worker (logs y traces habilitados en `wrangler.jsonc`).

## Estado

- Migraciones D1 versionadas (`0001_baseline.sql`) aplicadas en local y remoto.
- Feature de firmas digitales y PDF de visita en backlog: las firmas se capturan y guardan, pero la impresión (`/visits/gen-pdf`) aún no está implementada.
