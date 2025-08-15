# Ventanilla CH - API Node.js

Sistema de gestión de usuarios con SQLite (desarrollo) y PostgreSQL (producción).

## Instalación

```bash
npm install
```

## Configuración

1. Copia `.env` y configura las variables según tu entorno
2. Para desarrollo local, usa SQLite (configuración por defecto)
3. Para producción, configura `DATABASE_URL` con PostgreSQL

## Comandos

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## API Endpoints

### Usuarios
- `GET /api/usuarios` - Obtener todos los usuarios
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `POST /api/usuarios` - Crear nuevo usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

## Despliegue

### Railway
1. Conecta tu repositorio GitHub
2. Configura variables de entorno
3. Railway detectará automáticamente Node.js

### Render
1. Conecta tu repositorio
2. Configura como "Web Service"
3. Comando de build: `npm install`
4. Comando de start: `npm start`

### Vercel (solo para APIs)
1. `vercel --prod`
2. Configura variables de entorno en el dashboard
