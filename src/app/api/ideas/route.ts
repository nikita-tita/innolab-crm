import { NextRequest, NextResponse } from "next/server"
import { withApiHandler, withDatabaseTransaction } from "@/lib/api-handler"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { ideaSchemas, filterSchemas } from "@/lib/schemas"
import { logActivity, getActivityDescription } from "@/lib/activity"
import { ideaRepository, QueryBuilder } from "@/lib/database"
import { ideaWorkflow } from "@/lib/business-logic"

// GET /api/ideas - получение списка идей с фильтрацией
export const GET = withApiHandler(
  async (request: NextRequest, { session, requestId }) => {
    const { searchParams } = new URL(request.url)

    // Валидируем параметры запроса
    const filters = filterSchemas.ideas.parse({
      status: searchParams.get("status"),
      priority: searchParams.get("priority"),
      category: searchParams.get("category"),
      search: searchParams.get("search"),
      page: searchParams.get("page"),
      limit: searchParams.get("limit")
    })

    const include = searchParams.get("include")

    logger.debug('Fetching ideas with filters', {
      filters,
      include,
      userId: session.user.id,
      requestId
    })

    // Построение where условий
    const where: any = {}
    if (filters.status) where.status = filters.status
    if (filters.priority) where.priority = filters.priority
    if (filters.category) where.category = { contains: filters.category, mode: 'insensitive' }
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { category: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    // Базовые включения
    const includeOptions: any = {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      },
      _count: {
        select: {
          hypotheses: true,
          comments: true
        }
      }
    }

    // Дополнительные включения для workflow данных
    if (include?.includes('hypotheses') || include?.includes('experiments')) {
      includeOptions.hypotheses = {
        select: {
          id: true,
          title: true,
          statement: true,
          status: true,
          level: true,
          createdAt: true,
          experiments: include?.includes('experiments') ? {
            select: {
              id: true,
              title: true,
              status: true,
              createdAt: true
            }
          } : false
        }
      }
    } else {
      includeOptions.hypotheses = {
        select: {
          id: true,
          title: true,
          status: true
        }
      }
    }

    // Build where conditions
    const whereConditions: any = {
      deletedAt: null  // Only show non-deleted ideas
    }

    if (filters.status) whereConditions.status = filters.status
    if (filters.priority) whereConditions.priority = filters.priority
    if (filters.category) whereConditions.category = { contains: filters.category, mode: 'insensitive' }
    if (filters.search) {
      whereConditions.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { category: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    const [ideas, totalCount] = await Promise.all([
      prisma.idea.findMany({
        where: whereConditions,
        include: includeOptions,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit
      }),
      prisma.idea.count({ where: whereConditions })
    ])

    logger.info('Ideas fetched successfully', {
      count: ideas.length,
      totalCount,
      page: filters.page,
      userId: session.user.id,
      requestId
    })

    return NextResponse.json({
      data: ideas,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: totalCount,
        pages: Math.ceil(totalCount / filters.limit)
      }
    })
  },
  {
    requireAuth: true
  }
)

// POST /api/ideas - создание новой идеи с использованием бизнес-логики
export const POST = withApiHandler(
  async (request: NextRequest, { session, requestId }) => {
    try {
      const body = await request.json()

      logger.debug('Creating new idea via workflow', {
        title: body.title,
        userId: session.user.id,
        requestId
      })

      // Use the business logic workflow service
      const idea = await ideaWorkflow.submitIdea({
        title: body.title,
        description: body.description,
        category: body.category,
        context: body.context,
        priority: body.priority,
        userId: session.user.id
      })

      // If RICE scores are provided, apply them immediately
      if (body.reach && body.impact && body.confidence && body.effort) {
        const scoredIdea = await ideaWorkflow.scoreIdea(
          idea.id,
          {
            reach: body.reach,
            impact: body.impact,
            confidence: body.confidence,
            effort: body.effort
          },
          session.user.id
        )

        logger.info('Idea created and scored in single request', {
          ideaId: idea.id,
          riceScore: scoredIdea.riceScore,
          userId: session.user.id,
          requestId
        })

        return NextResponse.json(scoredIdea, { status: 201 })
      }

      logger.info('Idea created successfully via workflow', {
        ideaId: idea.id,
        title: idea.title,
        userId: session.user.id,
        requestId
      })

      return NextResponse.json(idea, { status: 201 })
    } catch (error) {
      logger.error('Failed to create idea via workflow', error, {
        userId: session.user.id,
        requestId
      })
      throw error
    }
  },
  {
    requireAuth: true,
    validateBody: ideaSchemas.create
  }
)