// src/middleware/errorHandler.js - Manejo global de errores (ES Modules)
const errorHandler = (err, req, res, next) => {
  console.error('Error capturado por middleware:', err);

  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Error de validación',
      details: err.message
    });
  }

  // Error de base de datos
  if (err.message.includes('SQLITE')) {
    return res.status(500).json({
      success: false,
      error: 'Error de base de datos',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
    });
  }

  // Error por defecto
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
  });
};

export default errorHandler;
