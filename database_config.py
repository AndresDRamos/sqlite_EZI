# Configuración para Python (Flask/Django)
import os
import sqlite3

class DatabaseConfig:
    def __init__(self):
        self.is_production = os.getenv('NODE_ENV') == 'production'
        
    def get_connection(self):
        if self.is_production:
            # Para producción, usar PostgreSQL
            import psycopg2
            return psycopg2.connect(os.getenv('DATABASE_URL'))
        else:
            # Para desarrollo, usar SQLite
            return sqlite3.connect('ventanilla.db')

# Uso:
# db_config = DatabaseConfig()
# conn = db_config.get_connection()
