import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { logger } from "@/lib/logger"
import { z } from "zod"

// Стандартные ошибки API
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: any) {
    super(400, 'VALIDATION_ERROR', message, details)
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super(401, 'UNAUTHORIZED', message)
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden') {
    super(403, 'FORBIDDEN', message)
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string = 'Resource') {
    super(404, 'NOT_FOUND', `${resource} not found`)
  }
}

export class ConflictError extends ApiError {
  constructor(message: string) {
    super(409, 'CONFLICT', message)
  }
}

// Типы для API handler'ов
export type ApiHandler = (
  request: NextRequest,
  context: {
    params: any
    session: any
    requestId: string
  }
) => Promise<NextResponse>

export interface ApiHandlerOptions {
  requireAuth?: boolean
  requiredRole?: string
  validateParams?: z.ZodSchema
  validateBody?: z.ZodSchema
  logLevel?: 'debug' | 'info' | 'warn' | 'error'
}

// Главный wrapper для API endpoints
export function withApiHandler(
  handler: ApiHandler,
  options: ApiHandlerOptions = {}
) {
  return async (
    request: NextRequest,
    { params }: { params: Promise<any> }
  ): Promise<NextResponse> => {
    const requestId = Math.random().toString(36).substring(7)
    const resolvedParams = await params
    const method = request.method
    const url = request.url

    const context = {
      requestId,
      method,
      url,
      params: resolvedParams
    }

    logger.debug(`API request started: ${method} ${url}`, context)

    try {
      // Аутентификация
      let session = null
      if (options.requireAuth !== false) {
        session = await getServerSession(authOptions)

        if (!session?.user?.id) {
          logger.securityLog('Unauthorized API access attempt', undefined,
            request.headers.get('x-forwarded-for') || 'unknown', { url, method })
          throw new UnauthorizedError()
        }

        // Проверка роли если требуется
        if (options.requiredRole && session.user.role !== options.requiredRole) {
          logger.securityLog('Insufficient role for API access', session.user.id,
            request.headers.get('x-forwarded-for') || 'unknown',
            { url, method, requiredRole: options.requiredRole, userRole: session.user.role })
          throw new ForbiddenError(`Role ${options.requiredRole} required`)
        }
      }

      // Валидация параметров
      if (options.validateParams) {
        try {
          options.validateParams.parse(resolvedParams)
        } catch (error) {
          throw new ValidationError('Invalid parameters', error)
        }
      }

      // Валидация тела запроса
      if (options.validateBody && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        try {
          const body = await request.json()
          options.validateBody.parse(body)
          // Пересоздаем request с валидированным body для handler'а
          const newRequest = new NextRequest(request.url, {
            method: request.method,
            headers: request.headers,
            body: JSON.stringify(body)
          })
          Object.defineProperty(newRequest, 'json', {
            value: async () => body
          })
          request = newRequest
        } catch (error) {
          if (error instanceof SyntaxError) {
            throw new ValidationError('Invalid JSON in request body')
          }
          throw new ValidationError('Invalid request body', error)
        }
      }

      // Выполняем handler с измерением производительности
      const start = Date.now()
      const result = await handler(request, {
        params: resolvedParams,
        session,
        requestId
      })
      const duration = Date.now() - start

      logger.performanceLog(`API ${method} ${url}`, duration, {
        ...context,
        userId: session?.user?.id,
        statusCode: result.status
      })

      // Логируем успешные операции
      if (session?.user?.id) {
        logger.auditLog(`API_${method}`, url, session.user.id, {
          params: resolvedParams,
          statusCode: result.status,
          duration
        })
      }

      return result

    } catch (error) {
      return handleApiError(error, context)
    }
  }
}

// Централизованная обработка ошибок
function handleApiError(error: unknown, context: any): NextResponse {
  logger.error('API error occurred', error, context)

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: true,
        code: error.code,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { details: error.details })
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: true,
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error.errors
      },
      { status: 400 }
    )
  }

  // Неожиданные ошибки
  const isDevelopment = process.env.NODE_ENV === 'development'

  return NextResponse.json(
    {
      error: true,
      code: 'INTERNAL_ERROR',
      message: isDevelopment && error instanceof Error ? error.message : 'Internal server error',
      ...(isDevelopment && error instanceof Error && { stack: error.stack })
    },
    { status: 500 }
  )
}

// Утилиты для работы с базой данных
export async function withDatabaseTransaction<T>(
  operation: (prisma: any) => Promise<T>,
  context?: any
): Promise<T> {
  const { prisma } = await import('@/lib/prisma')

  return prisma.$transaction(async (tx: any) => {
    logger.debug('Database transaction started', context)
    try {
      const result = await operation(tx)
      logger.debug('Database transaction completed successfully', context)
      return result
    } catch (error) {
      logger.error('Database transaction failed', error, context)
      throw error
    }
  })
}

// Схемы валидации для общих параметров
export const commonSchemas = {
  id: z.object({
    id: z.string().cuid()
  }),

  pagination: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20)
  }),

  status: z.object({
    status: z.enum(['ACTIVE', 'INACTIVE', 'DRAFT', 'PUBLISHED'])
  })
}