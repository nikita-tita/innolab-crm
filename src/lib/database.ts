import { prisma } from './prisma'
import { logger } from './logger'

// Soft Delete Service Layer
export class SoftDeleteService {
  // Generic soft delete method
  static async softDelete<T extends { deletedAt: Date | null }>(
    model: any,
    id: string,
    userId?: string
  ): Promise<T | null> {
    try {
      const result = await model.update({
        where: { id, deletedAt: null }, // Only update if not already deleted
        data: {
          deletedAt: new Date(),
          updatedAt: new Date()
        },
      })

      logger.info('Entity soft deleted', {
        modelName: model.name,
        id,
        userId
      })

      return result
    } catch (error) {
      logger.error('Failed to soft delete entity', error, {
        modelName: model.name,
        id,
        userId
      })
      throw error
    }
  }

  // Generic restore method
  static async restore<T extends { deletedAt: Date | null }>(
    model: any,
    id: string,
    userId?: string
  ): Promise<T | null> {
    try {
      const result = await model.update({
        where: { id, deletedAt: { not: null } }, // Only restore if deleted
        data: {
          deletedAt: null,
          updatedAt: new Date()
        },
      })

      logger.info('Entity restored', {
        modelName: model.name,
        id,
        userId
      })

      return result
    } catch (error) {
      logger.error('Failed to restore entity', error, {
        modelName: model.name,
        id,
        userId
      })
      throw error
    }
  }

  // Hard delete (permanent removal)
  static async hardDelete(
    model: any,
    id: string,
    userId?: string
  ): Promise<void> {
    try {
      await model.delete({
        where: { id }
      })

      logger.auditLog('HARD_DELETE', model.name, userId || 'system', {
        id,
        permanent: true
      })
    } catch (error) {
      logger.error('Failed to hard delete entity', error, {
        modelName: model.name,
        id,
        userId
      })
      throw error
    }
  }
}

// Enhanced Query Builder for filtered queries
export class QueryBuilder {
  private model: any
  private conditions: any[] = []
  private includeSoftDeleted = false

  constructor(model: any) {
    this.model = model
    // By default, exclude soft deleted records
    this.conditions.push({ deletedAt: null })
  }

  // Include soft deleted records in the query
  withDeleted(): this {
    this.includeSoftDeleted = true
    // Remove the deletedAt: null condition
    this.conditions = this.conditions.filter(
      condition => !('deletedAt' in condition)
    )
    return this
  }

  // Only show deleted records
  onlyDeleted(): this {
    this.conditions = this.conditions.filter(
      condition => !('deletedAt' in condition)
    )
    this.conditions.push({ deletedAt: { not: null } })
    return this
  }

  // Add custom where conditions
  where(condition: any): this {
    this.conditions.push(condition)
    return this
  }

  // Build the where clause
  private buildWhere(): any {
    if (this.conditions.length === 0) return {}
    if (this.conditions.length === 1) return this.conditions[0]

    return { AND: this.conditions }
  }

  // Execute find many
  async findMany(options: any = {}): Promise<any[]> {
    const where = this.buildWhere()

    return await this.model.findMany({
      ...options,
      where: { ...where, ...options.where }
    })
  }

  // Execute find unique
  async findUnique(options: any = {}): Promise<any> {
    const where = this.buildWhere()

    return await this.model.findUnique({
      ...options,
      where: { ...where, ...options.where }
    })
  }

  // Execute find first
  async findFirst(options: any = {}): Promise<any> {
    const where = this.buildWhere()

    return await this.model.findFirst({
      ...options,
      where: { ...where, ...options.where }
    })
  }

  // Execute count
  async count(options: any = {}): Promise<number> {
    const where = this.buildWhere()

    return await this.model.count({
      ...options,
      where: { ...where, ...options.where }
    })
  }
}

// Repository pattern with soft delete support
export class BaseRepository<T> {
  protected model: any
  protected modelName: string

  constructor(model: any, modelName: string) {
    this.model = model
    this.modelName = modelName
  }

  // Create query builder
  query(): QueryBuilder {
    return new QueryBuilder(this.model)
  }

  // Find by ID (excluding soft deleted)
  async findById(id: string, include?: any): Promise<T | null> {
    return await this.query()
      .findUnique({
        where: { id },
        include
      })
  }

  // Find by ID including deleted
  async findByIdWithDeleted(id: string, include?: any): Promise<T | null> {
    return await this.query()
      .withDeleted()
      .findUnique({
        where: { id },
        include
      })
  }

  // Soft delete
  async softDelete(id: string, userId?: string): Promise<T | null> {
    const result = await SoftDeleteService.softDelete(this.model, id, userId)

    // Log activity if the model supports it
    if (result && userId) {
      try {
        await this.logActivity('DELETED', `${this.modelName} soft deleted`, id, userId)
      } catch (error) {
        logger.warn(`Failed to log soft delete activity for ${this.modelName}`, error)
      }
    }

    return result
  }

  // Restore
  async restore(id: string, userId?: string): Promise<T | null> {
    const result = await SoftDeleteService.restore(this.model, id, userId)

    // Log activity if restored
    if (result && userId) {
      try {
        await this.logActivity('UPDATED', `${this.modelName} restored`, id, userId)
      } catch (error) {
        logger.warn(`Failed to log restore activity for ${this.modelName}`, error)
      }
    }

    return result
  }

  // Hard delete
  async hardDelete(id: string, userId?: string): Promise<void> {
    await SoftDeleteService.hardDelete(this.model, id, userId)

    // Log activity
    if (userId) {
      try {
        await this.logActivity('DELETED', `${this.modelName} permanently deleted`, id, userId)
      } catch (error) {
        logger.warn(`Failed to log hard delete activity for ${this.modelName}`, error)
      }
    }
  }

  // Check if entity exists and is not deleted
  async exists(id: string): Promise<boolean> {
    const count = await this.query().count({ where: { id } })
    return count > 0
  }

  // Get all soft deleted records
  async getDeleted(options: any = {}): Promise<T[]> {
    return await this.query()
      .onlyDeleted()
      .findMany(options)
  }

  // Bulk soft delete
  async bulkSoftDelete(ids: string[], userId?: string): Promise<number> {
    try {
      const result = await this.model.updateMany({
        where: {
          id: { in: ids },
          deletedAt: null
        },
        data: {
          deletedAt: new Date(),
          updatedAt: new Date()
        }
      })

      logger.info(`Bulk soft delete completed for ${this.modelName}`, {
        count: result.count,
        ids: ids.length,
        userId
      })

      return result.count
    } catch (error) {
      logger.error(`Failed bulk soft delete for ${this.modelName}`, error, {
        ids: ids.length,
        userId
      })
      throw error
    }
  }

  // Log activity (if Activity model is available)
  private async logActivity(
    type: string,
    description: string,
    entityId: string,
    userId: string
  ): Promise<void> {
    try {
      await prisma.activity.create({
        data: {
          type: type as any,
          description,
          entityType: this.modelName.toLowerCase(),
          entityId,
          userId,
          metadata: {
            timestamp: new Date().toISOString(),
            source: 'BaseRepository'
          }
        }
      })
    } catch (error) {
      // Don't throw - activity logging is non-critical
      logger.warn('Failed to log activity', error, {
        type,
        entityType: this.modelName,
        entityId,
        userId
      })
    }
  }
}

// Specific repositories
export class IdeaRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.idea, 'Idea')
  }

  // Custom methods for ideas
  async findByStatus(status: string, includeDeleted = false): Promise<any[]> {
    const query = includeDeleted ?
      this.query().withDeleted() :
      this.query()

    return await query
      .where({ status })
      .findMany({
        include: {
          creator: {
            select: { id: true, name: true, email: true }
          },
          _count: {
            select: { hypotheses: true, comments: true }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ]
      })
  }

  // Find ideas with RICE scoring
  async findWithRiceScore(minScore?: number): Promise<any[]> {
    return await this.query()
      .where(minScore ? { riceScore: { gte: minScore } } : { riceScore: { not: null } })
      .findMany({
        include: {
          creator: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { riceScore: 'desc' }
      })
  }
}

export class HypothesisRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.hypothesis, 'Hypothesis')
  }

  // Find hypotheses by idea
  async findByIdea(ideaId: string): Promise<any[]> {
    return await this.query()
      .where({ ideaId })
      .findMany({
        include: {
          creator: {
            select: { id: true, name: true, email: true }
          },
          owner: {
            select: { id: true, name: true, email: true }
          },
          experiments: {
            select: { id: true, title: true, status: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
  }

  // Find by workflow status
  async findByWorkflowStatus(status: string, level?: string): Promise<any[]> {
    const conditions: any = { status }
    if (level) conditions.level = level

    return await this.query()
      .where(conditions)
      .findMany({
        include: {
          idea: {
            select: { id: true, title: true }
          },
          creator: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ]
      })
  }
}

export class ExperimentRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.experiment, 'Experiment')
  }

  // Find by hypothesis
  async findByHypothesis(hypothesisId: string): Promise<any[]> {
    return await this.query()
      .where({ hypothesisId })
      .findMany({
        include: {
          creator: {
            select: { id: true, name: true, email: true }
          },
          results: true,
          mvps: {
            select: { id: true, title: true, status: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
  }

  // Find running experiments
  async findRunning(): Promise<any[]> {
    return await this.query()
      .where({ status: 'RUNNING' })
      .findMany({
        include: {
          hypothesis: {
            include: {
              idea: {
                select: { id: true, title: true }
              }
            }
          },
          creator: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { startDate: 'asc' }
      })
  }
}

export class MVPRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.mvp, 'MVP')
  }

  // Find by experiment
  async findByExperiment(experimentId: string): Promise<any[]> {
    return await this.query()
      .where({ experimentId })
      .findMany({
        include: {
          creator: {
            select: { id: true, name: true, email: true }
          },
          attachments: true
        },
        orderBy: { createdAt: 'desc' }
      })
  }
}

// Export repository instances
export const ideaRepository = new IdeaRepository()
export const hypothesisRepository = new HypothesisRepository()
export const experimentRepository = new ExperimentRepository()
export const mvpRepository = new MVPRepository()