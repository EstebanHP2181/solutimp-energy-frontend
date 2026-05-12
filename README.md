# SOLUTIMP ENERGY — Frontend

SPA independiente para **SOLUTIMP ENERGY / GOODWE SMART SOLAR**. Consume **`solutimp-energy-backend`** y no depende de PrestaShop. Despliegue previsto en `energy.solutimp.cl` o `solar.solutimp.cl`.

Este directorio es un **repositorio Git propio** (no forma parte de un monorepo con PrestaShop ni `public_html`). Opcionalmente en el VPS conviven carpetas hermanas: `solutimp-energy-backend/`, `solutimp-energy-data/`, `solutimp-energy-deploy/`, etc.

- Índice de documentación: [`docs/README.md`](./docs/README.md)
- Publicación en GitHub: [`docs/GITHUB.md`](./docs/GITHUB.md)

## Stack

- Vue 3, Vite, TypeScript
- Pinia, Vue Router
- Vuetify 3, ApexCharts (`vue3-apexcharts`)
- ESLint 9 (flat config) + Prettier

## Requisitos

- Node.js **20+** (recomendado LTS) con **npm** (o pnpm/yarn equivalente).

## Configuración

1. Copia variables de entorno (desarrollo):

   ```bash
   cp .env.example .env
   ```

2. Define la **base del API** (sin path `/api` en la variable). Las rutas del API incluyen el prefijo completo en cada llamada (`apiUrl('/api/v1/energy/...')`).

   ```bash
   # Producción (build): ver `.env.production` y docs/DEPLOY-FRONTEND.md
   VITE_API_BASE_URL=https://api.energy.solutimp.cl

   # Local contra uvicorn
   VITE_API_BASE_URL=http://127.0.0.1:8010
   ```

   Sin barra final en la base. Usa `apiUrl('/api/v1/energy/bom/auto')` (y `getApiBaseUrl()`) desde `src/api/client.ts`.

### Ejemplos `apiUrl` / `joinApiUrl` (misma lógica que los tests)

| Base (`VITE_API_BASE_URL` o primer arg de `joinApiUrl`) | Path | Resultado |
| --- | --- | --- |
| `https://api.energy.solutimp.cl` | `/api/v1/energy/bom/auto` | `https://api.energy.solutimp.cl/api/v1/energy/bom/auto` |
| `https://api.energy.solutimp.cl/` (se normaliza) | `/api/v1/energy/bom/auto` | `https://api.energy.solutimp.cl/api/v1/energy/bom/auto` |
| `https://api.energy.solutimp.cl` | `api/v1/energy/bom/auto` (sin `/` inicial) | `https://api.energy.solutimp.cl/api/v1/energy/bom/auto` |
| `https://api.energy.solutimp.cl` | `/api//v1/energy///x` | `https://api.energy.solutimp.cl/api/v1/energy/x` (sin dobles `/`) |

Despliegue NGINX y checklist DNS: **`docs/DEPLOY-ENERGY-SUBDOMAIN.md`**.

## Wizard de captación (MVP)

- **`/`** — Landing campaña (CTA hacia el wizard).
- **`/onboarding`** — Flujo paso a paso (bienvenida, propiedad, consumo, objetivo, región, contacto, gracias). El POST de lead usa `apiUrl('/api/v1/energy/leads')`; si el backend aún no responde, el flujo **sigue** y se muestra la pantalla final.
- Estilos: variables CSS en `src/style.css`, fondo animado en `components/wizard/EnergyBackground.vue`, **SPA** con `public/.htaccess` (se copia a `dist/` en el build).

## Despliegue estático (Hostinger)

Ruta típica en este hosting:

`/home/u642283732/domains/solutimp.cl/public_html/energy`

```bash
npm install --legacy-peer-deps
VITE_API_BASE_URL=https://api.energy.solutimp.cl VITE_ROBOTS_NOINDEX=true npm run build
cp -a dist/. /home/u642283732/domains/solutimp.cl/public_html/energy/
```

Comprobar `dist/.htaccess` y refresco en rutas del router (`/onboarding`).

## Comandos

```bash
npm install --legacy-peer-deps
npm run dev
```

- **Desarrollo:** `npm run dev` — servidor Vite por defecto en **http://localhost:5173** (puerto **5173**; si está ocupado, Vite elige el siguiente libre salvo que `strictPort` esté activado; aquí está `strictPort: false`).
- **Build producción:** `npm run build`
- **Preview del build:** `npm run preview`
- **Lint:** `npm run lint`
- **Formato:** `npm run format`
- **Tests unitarios:** `npm run test` (p. ej. `src/api/client.test.ts`)

## Estructura de carpetas (`src/`)

| Carpeta        | Uso                                      |
| -------------- | ---------------------------------------- |
| `api/`         | Cliente HTTP / helpers (URL base)       |
| `components/`  | Componentes reutilizables                 |
| `composables/` | Composables Vue                           |
| `layouts/`     | Layouts (p. ej. mobile-first base)       |
| `onboarding/`  | Pasos del wizard (`steps/`)              |
| `pages/`       | Vistas enlazadas al router               |
| `proposal/`    | Módulo propuesta (vacío, preparado)      |
| `router/`      | Vue Router                               |
| `shared/`      | Utilidades y tipos compartidos           |
| `stores/`      | Pinia stores                             |

## Alcance siguiente

Mapa de techo, motor de cálculo solar real, BOM GoodWe/Trina/JA/Prodalam, ROI detallado y PDF quedan para fases posteriores. El wizard actual es **captación y orientación** sin cifras inventadas.

## Posibles conflictos

- **CORS:** el backend debe permitir el origen del front (p. ej. `http://localhost:5173` en desarrollo y el dominio final en producción).
- **Puerto 5173:** otro proceso puede ocuparlo; Vite puede reasignar puerto con `strictPort: false`.
- **Variables `VITE_*`:** solo las expuestas con prefijo `VITE_` llegan al bundle; no uses secretos en el front.
