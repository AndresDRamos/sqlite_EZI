# Railway Deployment Guide

## Variables de Entorno a Configurar en Railway:

1. `NODE_ENV` = `production`
2. `PORT` = `3000` (Railway asignará automáticamente)

## Para usar PostgreSQL en Railway (Recomendado):

1. En Railway, agrega un servicio de PostgreSQL
2. Railway generará automáticamente la variable `DATABASE_URL`
3. Ejecuta el script `migration-postgresql.sql` en la nueva base de datos

## Comandos de Railway:

```bash
# Instalar Railway CLI (opcional)
npm install -g @railway/cli

# Hacer login
railway login

# Deployar desde CLI (alternativa)
railway up
```
