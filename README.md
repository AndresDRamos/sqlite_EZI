# Sistema Ventanilla CH - Backend

Sistema de gestión de folios con arquitectura MVC y soporte para múltiples bases de datos.

## 🚀 Características

- ✅ **Arquitectura MVC** - Separación clara de responsabilidades
- ✅ **Múltiples BD** - SQLite (desarrollo) y PostgreSQL (producción)
- ✅ **API RESTful** - Endpoints completos para todas las funcionalidades
- ✅ **Migraciones automáticas** - Las tablas se crean automáticamente
- ✅ **Datos persistentes** - Los datos se mantienen entre despliegues

## 📊 Base de Datos

### Tablas
- **Usuarios** - Gestión de usuarios del sistema
- **Roles** - Administrador y Solucionador
- **Folios** - Formularios/tickets principales
- **Folio_responsables** - Asignación de usuarios a folios
- **Folio_respuestas** - Respuestas/comentarios en folios

## �️ Instalación Local

```bash
# Instalar dependencias
npm install

# Desarrollo (usa SQLite)
npm run dev

# Producción
npm start
```

## 🌐 Despliegue en Railway

### 1. Agregar PostgreSQL Database
En Railway dashboard:
1. Crea un nuevo servicio **PostgreSQL**
2. Copia la variable `DATABASE_URL`

### 2. Configurar Variables de Entorno
```env
NODE_ENV=production
DATABASE_URL=postgresql://usuario:password@host:port/database
```

### 3. Desplegar
```bash
# Hacer commit de los cambios
git add .
git commit -m "feat: configuración PostgreSQL para Railway"
git push origin main
```

### 4. ¡Listo! 
- El sistema detectará automáticamente PostgreSQL
- Las tablas se crearán automáticamente
- Los datos persistirán entre despliegues

## 📚 API Endpoints

### Usuarios
- `GET /api/usuarios` - Listar usuarios
- `POST /api/usuarios` - Crear usuario
- `GET /api/usuarios/:id` - Obtener usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

### Roles
- `GET /api/roles` - Listar roles
- `POST /api/roles` - Crear rol

### Folios
- `GET /api/folios` - Listar folios
- `POST /api/folios` - Crear folio
- `GET /api/folios/:id` - Obtener folio completo
- `PUT /api/folios/:id` - Actualizar folio
- `DELETE /api/folios/:id` - Eliminar folio

### Asignaciones
- `POST /api/folios/:id/responsables` - Asignar responsable
- `DELETE /api/folios/:id/responsables/:userId` - Remover responsable

### Respuestas
- `POST /api/folios/:id/respuestas` - Agregar respuesta

## 🔧 Scripts Disponibles

```bash
npm start                    # Iniciar servidor
npm run dev                  # Desarrollo con nodemon
npm run migrate:postgres     # Migración manual PostgreSQL
npm run migrate:sqlite       # Migración manual SQLite
```
- `ventanilla.db` - Base de datos SQLite
- `ventanilla.sql` - Script SQL con estructura y datos
- `package.json` - Dependencias

## 🌐 API Endpoints

- `GET /` - Información de la API
- `GET /usuarios` - Ver todos los usuarios
- `GET /usuarios/:id` - Ver usuario específico
- `POST /usuarios` - Crear nuevo usuario

## 📦 Despliegue

Sube tu código a cualquier servicio que soporte Node.js:
- **Vercel**, **Netlify**, **Railway**, **Render**

Solo necesitas configurar el comando de inicio: `npm start`
