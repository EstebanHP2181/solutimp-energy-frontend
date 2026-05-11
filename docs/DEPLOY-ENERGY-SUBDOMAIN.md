# Despliegue: `energy.solutimp.cl`

Alineación **NGINX + FastAPI + frontend** para que el cliente use rutas bajo **`/api/...`** sin que el proxy elimine el prefijo `/api`.

**Restricciones:** no modificar PrestaShop, `public_html` ni Enersafe. **No activar** vhosts NGINX reales ni cambios en producción hasta confirmación explícita.

---

## 0. Backend: rutas previstas (`solutimp-energy-backend`)

En el workspace actual **no está presente** el repositorio `solutimp-energy-backend`; la convención acordada es:

| Ruta (en el proceso uvicorn) | Uso |
| --- | --- |
| `GET /health` | Salud del servicio (uso típico **solo interno** en `http://127.0.0.1:8010/health`). |
| `GET /api/v1/energy/...` | API versionada (ej. `.../bom/auto`). |

Ejemplo público tras NGINX (mismo path que ve el backend):

```text
https://energy.solutimp.cl/api/v1/energy/bom/auto
```

**Acción:** al tener el repo backend en el mismo entorno, verificar con `grep`/OpenAPI que los routers coincidan con `/api/v1/energy` y `/health`.

---

## 1. Checklist DNS

| Paso | Acción | Notas |
| --- | --- | --- |
| 1 | Obtener la **IP pública** del servidor donde corre Solutimp. | Mismo host que recibirá HTTP/HTTPS. |
| 2 | Registro **A**: `energy` → IP pública. | FQDN: `energy.solutimp.cl`. |
| 3 | **TTL:** `300` o `600`. | Bajo TTL facilita pruebas y rollback. |
| 4 | Verificar: `dig +short energy.solutimp.cl A`. | Antes de certbot. |
| 5 | Opcional: **AAAA** si hay IPv6. | |

**SSL:** no ejecutar certbot hasta que el DNS apunte correctamente a este servidor.

---

## 2. Puertos internos propuestos

| Servicio | Host | Puerto |
| --- | --- | --- |
| Frontend | `127.0.0.1` | **5175** |
| Backend | `127.0.0.1` | **8010** |

---

## 3. NGINX: estrategia recomendada (no eliminar `/api`)

| Ubicación | Destino |
| --- | --- |
| `location /` | Frontend (ej. `http://127.0.0.1:5175/`). |
| `location /api/` | Backend FastAPI. |

**Regla clave:** usar **`proxy_pass http://127.0.0.1:8010;`** (sin barra final, sin path tras el puerto).

- Así NGINX **no reescribe** el URI: una petición `GET /api/v1/energy/bom/auto` llega al backend como **`/api/v1/energy/bom/auto`**.
- **Evitar** `proxy_pass http://127.0.0.1:8010/;`: la barra final hace que NGINX sustituya el prefijo de `location` y **quite** `/api` del path upstream, rompiendo rutas que viven bajo `/api/v1/energy`.

Archivo de ejemplo en el repo: **`docs/deploy-energy-nginx.conf`**.

---

## 4. Frontend (Vite)

Variable recomendada en producción:

```bash
VITE_API_BASE_URL=https://energy.solutimp.cl
```

- **Sin** path `/api` en la base: el path completo del API va en cada llamada, p. ej. `apiUrl('/api/v1/energy/bom/auto')`.
- Helpers: `getApiBaseUrl()`, `apiUrl(path)` en `src/api/client.ts` (normalizan barras; ver tests y README).

---

## 5. Health check

| Alcance | URL ejemplo | Notas |
| --- | --- | --- |
| **Interno** | `http://127.0.0.1:8010/health` | Monitoreo desde el mismo servidor / systemd / balanceador hacia loopback. |
| **Externo** | `https://energy.solutimp.cl/api/health` | Solo si en FastAPI existe ruta equivalente (p. ej. alias `GET /api/health` que reutilice la misma lógica que `/health`). Sin alias, **no** habrá health público bajo el mismo prefijo que el resto del API. |
| **Alternativa** | `location = /health` en NGINX → `8010` | Solo si se desea health en la raíz del dominio sin tocar FastAPI; documentar aparte para no chocar con el SPA en `/`. |

Recomendación práctica: **`/health` solo interno** hasta definir explícitamente un endpoint público bajo `/api/...`.

---

## 6. SSL (Let’s Encrypt / certbot)

1. DNS correcto.  
2. Puerto 80 (o DNS-01) para validación.  
3. `certbot --nginx -d energy.solutimp.cl` (ejemplo).  
4. Tras obtener certificados, replicar las mismas `location` en el bloque `listen 443 ssl`.

---

## 7. Modo pruebas

- **`VITE_ROBOTS_NOINDEX=true`** en el build (meta noindex); ver `.env.example`.  
- **Basic Auth** opcional en NGINX (comentado en el `.conf` de ejemplo).

---

## 8. Ejemplos `curl` (cuando DNS y servicios estén activos)

Sustituir el host si aún se prueba por IP con `Host:`.

**API pública (a través de NGINX):**

```bash
curl -sS -o /dev/null -w "%{http_code}\n" \
  "https://energy.solutimp.cl/api/v1/energy/bom/auto"

curl -sS -H "Accept: application/json" \
  "https://energy.solutimp.cl/api/v1/energy/bom/auto"
```

**Health solo interno (desde el servidor):**

```bash
curl -sS "http://127.0.0.1:8010/health"
```

**Health externo (solo si existe `GET /api/health` en el backend):**

```bash
curl -sS "https://energy.solutimp.cl/api/health"
```

**Cabeceras del sitio (front):**

```bash
curl -sI "https://energy.solutimp.cl/"
```

---

## 9. Comandos operativos (referencia; no ejecutar en prod sin acuerdo)

```bash
dig +short energy.solutimp.cl A
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d energy.solutimp.cl
```

---

## 10. Advertencias antes de producción

1. Confirmación explícita antes de tocar NGINX/DNS en producción.  
2. **CORS:** permitir `https://energy.solutimp.cl` en el backend.  
3. **TrustedHost / forwarded:** coherencia con `X-Forwarded-Proto` y hosts permitidos.  
4. **Firewall:** solo 80/443 hacia fuera; **8010** y **5175** en loopback.  
5. No mezclar este vhost con PrestaShop / Enersafe.  
6. Quitar noindex y Basic Auth cuando el sitio sea público definitivo.

---

## 11. Archivos en repo

| Archivo | Contenido |
| --- | --- |
| `docs/deploy-energy-nginx.conf` | `proxy_pass` al backend **sin** slash final que elimine `/api`. |
| `docs/DEPLOY-ENERGY-SUBDOMAIN.md` | Este documento. |
| `.env.example` | `VITE_API_BASE_URL` recomendada. |
| `src/api/client.ts` | `apiUrl()` / `joinApiUrl()`. |
| `src/api/client.test.ts` | Tests de unión de URLs. |
