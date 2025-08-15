# Ventanilla CH - API Simple con SQLite

API básica para gestión de usuarios usando Express y SQLite.

## 🚀 Instalación y Uso

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Producción
npm start
```

## 📋 Archivos del Proyecto

- `app.js` - Aplicación principal
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
