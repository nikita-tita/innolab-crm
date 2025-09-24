type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  userId?: string
  requestId?: string
  action?: string
  resource?: string
  [key: string]: any
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private logLevel = process.env.LOG_LEVEL || 'info'

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    }
    return levels[level] >= levels[this.logLevel as LogLevel]
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString()
    const contextStr = context ? JSON.stringify(context) : ''

    if (this.isDevelopment) {
      return `[${timestamp}] ${level.toUpperCase()}: ${message} ${contextStr}`
    }

    return JSON.stringify({
      timestamp,
      level,
      message,
      context
    })
  }

  debug(message: string, context?: LogContext) {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, context))
    }
  }

  info(message: string, context?: LogContext) {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, context))
    }
  }

  warn(message: string, context?: LogContext) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, context))
    }
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    if (this.shouldLog('error')) {
      const errorContext = {
        ...context,
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
          name: error.name
        } : error
      }
      console.error(this.formatMessage('error', message, errorContext))
    }
  }

  // Специальные методы для бизнес-событий
  auditLog(action: string, resource: string, userId: string, details?: any) {
    this.info(`AUDIT: ${action}`, {
      action,
      resource,
      userId,
      details,
      type: 'audit'
    })
  }

  performanceLog(operation: string, duration: number, context?: LogContext) {
    this.info(`PERFORMANCE: ${operation} completed in ${duration}ms`, {
      operation,
      duration,
      type: 'performance',
      ...context
    })
  }

  securityLog(event: string, userId?: string, ip?: string, details?: any) {
    this.warn(`SECURITY: ${event}`, {
      event,
      userId,
      ip,
      details,
      type: 'security'
    })
  }
}

export const logger = new Logger()

// Утилиты для измерения производительности
export function withPerformanceLogging<T>(
  operation: string,
  fn: () => Promise<T>,
  context?: LogContext
): Promise<T> {
  const start = Date.now()

  return fn()
    .then(result => {
      const duration = Date.now() - start
      logger.performanceLog(operation, duration, context)
      return result
    })
    .catch(error => {
      const duration = Date.now() - start
      logger.error(`${operation} failed after ${duration}ms`, error, context)
      throw error
    })
}

// HOC для логирования API вызовов
export function withApiLogging<T extends any[], R>(
  operation: string,
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const requestId = Math.random().toString(36).substring(7)
    const context = { requestId, operation }

    logger.debug(`API call started: ${operation}`, context)

    try {
      const result = await withPerformanceLogging(operation, () => fn(...args), context)
      logger.info(`API call completed: ${operation}`, context)
      return result
    } catch (error) {
      logger.error(`API call failed: ${operation}`, error, context)
      throw error
    }
  }
}