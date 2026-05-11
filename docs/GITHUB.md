# Publicar el repositorio en GitHub

Repositorio sugerido: **`solutimp-energy-frontend`** (privado).

## 1. Crear el repo vacío en GitHub

**New repository** → nombre `solutimp-energy-frontend` → **Private** → sin README (ya existe en local).

## 2. Inicializar y subir (comandos exactos)

```bash
cd /home/u642283732/solutimp-energy-frontend

git init
git branch -M main
git add -A
git status   # verificar que no aparezcan .env ni node_modules

git commit -m "chore: initial frontend scaffold (Vue 3, Vite, deploy docs)"

git remote add origin https://github.com/TU_ORG/solutimp-energy-frontend.git
# o SSH:
# git remote add origin git@github.com:TU_ORG/solutimp-energy-frontend.git

git push -u origin main
```

Si Git pide identidad:

```bash
git config user.name "Tu Nombre"
git config user.email "tu-email@solutimp.cl"
```

## 3. Comprobaciones antes del push

- [ ] No existe `.env` en el índice (solo `.env.example`).
- [ ] No hay `node_modules` ni `dist`.
- [ ] No hay listas de precios reales ni datos sensibles en el árbol.
