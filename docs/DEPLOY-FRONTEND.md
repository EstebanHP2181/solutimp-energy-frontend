# Despliegue frontend — Hostinger (estático)

**Dominio:** `https://energy.solutimp.cl`  
**Stack:** Vue 3 + Vite, archivos estáticos en alojamiento compartido / cloud Hostinger.  
**API:** `https://api.energy.solutimp.cl` (CORS ya restringido en el backend).

## Variables de build

Definidas en **`.env.production`** (Vite las inyecta solo en `npm run build`):

| Variable | Valor |
|----------|--------|
| `VITE_API_BASE_URL` | `https://api.energy.solutimp.cl` |
| `VITE_ROBOTS_NOINDEX` | `true` (meta robots noindex en el HTML generado) |

Para otro entorno, copia `.env.example` o ajusta `.env.production` antes del build.

## Build local o en CI

```bash
cd solutimp-energy-frontend
npm install
npm run build
```

Salida: carpeta **`dist/`** con `index.html`, assets hasheados y **`dist/.htaccess`** (copiado desde `public/.htaccess`).

## Subida a Hostinger

1. En el panel Hostinger, abre el **subdominio** `energy.solutimp.cl` y localiza la **carpeta raíz** del sitio (document root del subdominio).
2. Sube **todo el contenido** de **`dist/`** a esa carpeta (no subas la carpeta `dist` como único archivo; el contenido debe quedar en la raíz del subdominio).
3. Comprueba que **`.htaccess`** exista en la **raíz** del subdominio (mismo nivel que `index.html`). Sin él, las rutas del Vue Router devolverán 404 al recargar o al abrir enlaces directos.
4. Opcional: vacía la caché del navegador o del CDN del hosting tras un despliegue.

## Comprobaciones

- Abre `https://energy.solutimp.cl` y navega por el onboarding/rutas; recarga en una ruta interna y confirma que sigue cargando el SPA.
- En DevTools → red, las llamadas al API deben ir a `https://api.energy.solutimp.cl/...` (Vite sustituye `import.meta.env.VITE_API_BASE_URL` en build donde el código importe `apiUrl()` / `getApiBaseUrl()` desde `src/api/client.ts`).
- Si quitas el modo “no index” en el futuro, pon `VITE_ROBOTS_NOINDEX=false` o elimina la variable y vuelve a construir.

## Referencia Nginx (otros hosts)

Si en algún momento el front no fuera Apache sino Nginx, el equivalente al fallback SPA está en el repo bajo `docs/deploy-energy-nginx.conf` y `docs/DEPLOY-ENERGY-SUBDOMAIN.md`.
