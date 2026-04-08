export const notFound = (req, res, next) => {
  res.status(404)
  next(new Error(`Route not found: ${req.originalUrl}`))
}

export const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500

  const errorResponse = {
    message: error.message,
  }

  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = error.stack
  }

  res.status(statusCode).json(errorResponse)
}
