import { ideaRepository, hypothesisRepository, experimentRepository } from './database'
import { logger } from './logger'
import { prisma } from './prisma'

// Business Logic Service Layer
// Handles complex workflows and business rules across multiple entities

export class IdeaWorkflowService {
  // Complete idea lifecycle management
  static async submitIdea(data: {
    title: string
    description: string
    category?: string
    context?: string
    priority?: string
    userId: string
  }) {
    try {
      logger.info('Starting idea submission workflow', {
        title: data.title,
        userId: data.userId
      })

      // Create the idea with proper data validation
      const idea = await prisma.idea.create({
        data: {
          title: data.title.trim(),
          description: data.description.trim(),
          category: data.category?.trim() || null,
          context: data.context?.trim() || null,
          priority: data.priority as any || 'MEDIUM',
          status: 'NEW',
          createdBy: data.userId
        },
        include: {
          creator: {
            select: { id: true, name: true, email: true, role: true }
          }
        }
      })

      // Log activity
      await this.logActivity('CREATED', `Idea "${idea.title}" submitted`, 'idea', idea.id, data.userId)

      logger.auditLog('IDEA_SUBMITTED', '/workflow/idea-submission', data.userId, {
        ideaId: idea.id,
        title: idea.title
      })

      return idea
    } catch (error) {
      logger.error('Failed to submit idea', error, { userId: data.userId })
      throw error
    }
  }

  // RICE scoring workflow
  static async scoreIdea(ideaId: string, scores: {
    reach: number
    impact: number
    confidence: number
    effort: number
  }, userId: string) {
    try {
      // Validate the idea exists
      const idea = await ideaRepository.findById(ideaId)
      if (!idea) throw new Error('Idea not found')

      // Calculate RICE score
      const riceScore = (scores.reach * scores.impact * scores.confidence / 100) / scores.effort

      // Use transaction to prevent race conditions
      const updatedIdea = await prisma.$transaction(async (tx) => {
        // Update idea with RICE scores atomically
        const updated = await tx.idea.update({
          where: { id: ideaId },
          data: {
            ...scores,
            riceScore,
            status: 'SCORED'
          },
          include: {
            creator: {
              select: { id: true, name: true, email: true }
            }
          }
        })

        // Log the scoring activity within transaction
        await this.logActivity('UPDATED', `RICE score calculated: ${riceScore.toFixed(2)}`, 'idea', ideaId, userId, tx)

        return updated
      }, {
        isolationLevel: 'Serializable',
        timeout: 10000
      })

      logger.info('Idea RICE score calculated', {
        ideaId,
        riceScore: riceScore.toFixed(2),
        scoredBy: userId
      })

      return updatedIdea
    } catch (error) {
      logger.error('Failed to score idea', error, { ideaId, userId })
      throw error
    }
  }

  // Move idea to hypothesis development
  static async selectForHypothesis(ideaId: string, userId: string) {
    try {
      const idea = await prisma.idea.update({
        where: { id: ideaId },
        data: { status: 'SELECTED' }
      })

      await this.logActivity('STATUS_CHANGED', 'Idea selected for hypothesis development', 'idea', ideaId, userId)

      return idea
    } catch (error) {
      logger.error('Failed to select idea for hypothesis', error, { ideaId, userId })
      throw error
    }
  }

  private static async logActivity(type: string, description: string, entityType: string, entityId: string, userId: string) {
    try {
      await prisma.activity.create({
        data: {
          type: type as any,
          description,
          entityType,
          entityId,
          userId
        }
      })
    } catch (error) {
      logger.warn('Failed to log activity', error, { type, entityType, entityId, userId })
    }
  }
}

export class HypothesisWorkflowService {
  // Create hypothesis from idea
  static async createFromIdea(ideaId: string, data: {
    title: string
    description?: string
    statement: string
    level?: 'LEVEL_1' | 'LEVEL_2'
    priority?: string
    targetAudience?: string
    userValue?: string
    businessImpact?: string
    userId: string
  }) {
    return await prisma.$transaction(async (tx) => {
      try {
        logger.info('Creating hypothesis from idea', {
          ideaId,
          title: data.title,
          userId: data.userId
        })

        // Verify idea exists and is in correct status
        const idea = await tx.idea.findUnique({
          where: { id: ideaId, deletedAt: null }
        })

        if (!idea) throw new Error('Idea not found')
        if (!['SELECTED', 'IN_HYPOTHESIS'].includes(idea.status)) {
          throw new Error('Idea must be selected before creating hypothesis')
        }

        // Create the hypothesis
        const hypothesis = await tx.hypothesis.create({
          data: {
            title: data.title.trim(),
            description: data.description?.trim(),
            statement: data.statement.trim(),
            level: data.level || 'LEVEL_1',
            priority: data.priority as any || 'MEDIUM',
            status: 'DRAFT',
            targetAudience: data.targetAudience?.trim(),
            userValue: data.userValue?.trim(),
            businessImpact: data.businessImpact?.trim(),
            ideaId,
            createdBy: data.userId
          },
          include: {
            idea: { select: { id: true, title: true } },
            creator: { select: { id: true, name: true, email: true } }
          }
        })

        // Update idea status
        await tx.idea.update({
          where: { id: ideaId },
          data: { status: 'IN_HYPOTHESIS' }
        })

        // Log activities
        await this.logActivity(tx, 'CREATED', `Hypothesis "${hypothesis.title}" created`, 'hypothesis', hypothesis.id, data.userId)
        await this.logActivity(tx, 'STATUS_CHANGED', 'Idea status updated to IN_HYPOTHESIS', 'idea', ideaId, data.userId)

        logger.auditLog('HYPOTHESIS_CREATED', '/workflow/hypothesis-creation', data.userId, {
          hypothesisId: hypothesis.id,
          ideaId,
          title: hypothesis.title
        })

        return hypothesis
      } catch (error) {
        logger.error('Failed to create hypothesis from idea', error, { ideaId, userId: data.userId })
        throw error
      }
    })
  }

  // ICE scoring workflow for hypotheses
  static async performIceScoring(hypothesisId: string, scores: Array<{
    userId: string
    impact: number
    confidence: number
    ease: number
    comment?: string
  }>) {
    return await prisma.$transaction(async (tx) => {
      try {
        // Verify hypothesis exists
        const hypothesis = await tx.hypothesis.findUnique({
          where: { id: hypothesisId, deletedAt: null }
        })

        if (!hypothesis) throw new Error('Hypothesis not found')

        // Create ICE scores
        const iceScores = await Promise.all(
          scores.map(score =>
            tx.iCEScore.create({
              data: {
                ...score,
                hypothesisId
              }
            })
          )
        )

        // Calculate average scores
        const avgImpact = scores.reduce((sum, s) => sum + s.impact, 0) / scores.length
        const avgConfidence = scores.reduce((sum, s) => sum + s.confidence, 0) / scores.length
        const avgEase = scores.reduce((sum, s) => sum + s.ease, 0) / scores.length
        const finalPriority = Math.round(avgImpact * avgConfidence * avgEase)

        // Update hypothesis with scoring results
        const updatedHypothesis = await tx.hypothesis.update({
          where: { id: hypothesisId },
          data: {
            finalPriority,
            status: 'SCORED'
          }
        })

        logger.info('ICE scoring completed for hypothesis', {
          hypothesisId,
          finalPriority,
          scorersCount: scores.length
        })

        return { hypothesis: updatedHypothesis, iceScores }
      } catch (error) {
        logger.error('Failed to perform ICE scoring', error, { hypothesisId })
        throw error
      }
    })
  }

  // Desk research workflow
  static async completeDeskResearch(hypothesisId: string, researchData: {
    notes?: string
    sources?: string[]
    risks?: string[]
    opportunities?: string[]
    marketSize?: string
    competitors?: string[]
    assumptions?: string
    userId: string
  }) {
    try {
      const updatedHypothesis = await prisma.hypothesis.update({
        where: { id: hypothesisId },
        data: {
          deskResearchNotes: researchData.notes,
          deskResearchSources: researchData.sources?.join('\n'),
          deskResearchDate: new Date(),
          risks: researchData.risks?.join('\n'),
          opportunities: researchData.opportunities?.join('\n'),
          marketSize: researchData.marketSize,
          competitors: researchData.competitors?.join('\n'),
          assumptions: researchData.assumptions,
          researchCompleted: true,
          status: 'RESEARCH',
          level: 'LEVEL_2'
        }
      })

      await this.logActivity(prisma, 'UPDATED', 'Desk research completed', 'hypothesis', hypothesisId, researchData.userId)

      logger.auditLog('DESK_RESEARCH_COMPLETED', '/workflow/desk-research', researchData.userId, {
        hypothesisId,
        level: 'LEVEL_2'
      })

      return updatedHypothesis
    } catch (error) {
      logger.error('Failed to complete desk research', error, { hypothesisId, userId: researchData.userId })
      throw error
    }
  }

  private static async logActivity(tx: any, type: string, description: string, entityType: string, entityId: string, userId: string) {
    try {
      await tx.activity.create({
        data: {
          type: type as any,
          description,
          entityType,
          entityId,
          userId
        }
      })
    } catch (error) {
      logger.warn('Failed to log activity', error, { type, entityType, entityId, userId })
    }
  }
}

export class ExperimentWorkflowService {
  // Create experiment from hypothesis
  static async createFromHypothesis(hypothesisId: string, data: {
    title: string
    description: string
    type: string
    methodology?: string
    timeline?: string
    resources?: string
    successMetrics?: string
    startDate?: Date
    endDate?: Date
    userId: string
  }) {
    return await prisma.$transaction(async (tx) => {
      try {
        // Verify hypothesis exists and is ready
        const hypothesis = await tx.hypothesis.findUnique({
          where: { id: hypothesisId, deletedAt: null }
        })

        if (!hypothesis) throw new Error('Hypothesis not found')
        if (!['RESEARCH', 'EXPERIMENT_DESIGN'].includes(hypothesis.status)) {
          throw new Error('Hypothesis must complete research before experiment creation')
        }

        // Create experiment
        const experiment = await tx.experiment.create({
          data: {
            title: data.title.trim(),
            description: data.description.trim(),
            type: data.type as any,
            methodology: data.methodology?.trim(),
            timeline: data.timeline?.trim(),
            resources: data.resources?.trim(),
            successMetrics: data.successMetrics?.trim(),
            startDate: data.startDate,
            endDate: data.endDate,
            status: 'PLANNING',
            hypothesisId,
            createdBy: data.userId
          },
          include: {
            hypothesis: {
              include: {
                idea: { select: { id: true, title: true } }
              }
            },
            creator: { select: { id: true, name: true, email: true } }
          }
        })

        // Update hypothesis status
        await tx.hypothesis.update({
          where: { id: hypothesisId },
          data: {
            status: 'READY_FOR_TESTING',
            experimentDesigned: true
          }
        })

        await this.logActivity(tx, 'CREATED', `Experiment "${experiment.title}" created`, 'experiment', experiment.id, data.userId)

        logger.auditLog('EXPERIMENT_CREATED', '/workflow/experiment-creation', data.userId, {
          experimentId: experiment.id,
          hypothesisId,
          type: data.type
        })

        return experiment
      } catch (error) {
        logger.error('Failed to create experiment', error, { hypothesisId, userId: data.userId })
        throw error
      }
    })
  }

  // Start experiment
  static async startExperiment(experimentId: string, userId: string) {
    return await prisma.$transaction(async (tx) => {
      try {
        const experiment = await tx.experiment.update({
          where: { id: experimentId },
          data: {
            status: 'RUNNING',
            actualStartDate: new Date()
          }
        })

        // Update hypothesis status
        await tx.hypothesis.update({
          where: { id: experiment.hypothesisId },
          data: { status: 'IN_EXPERIMENT' }
        })

        await this.logActivity(tx, 'EXPERIMENT_STARTED', 'Experiment started', 'experiment', experimentId, userId)

        logger.auditLog('EXPERIMENT_STARTED', '/workflow/experiment-execution', userId, {
          experimentId,
          startDate: new Date().toISOString()
        })

        return experiment
      } catch (error) {
        logger.error('Failed to start experiment', error, { experimentId, userId })
        throw error
      }
    })
  }

  // Complete experiment with results
  static async completeExperiment(experimentId: string, data: {
    results: Array<{
      metricName: string
      value: number
      unit: string
      notes?: string
    }>
    conclusion: 'VALIDATED' | 'INVALIDATED' | 'INCONCLUSIVE' | 'NEEDS_MORE_DATA'
    conclusionNotes?: string
    nextSteps?: string
    lessonLearned?: string
    userId: string
  }) {
    return await prisma.$transaction(async (tx) => {
      try {
        // Complete the experiment
        const experiment = await tx.experiment.update({
          where: { id: experimentId },
          data: {
            status: 'COMPLETED',
            actualEndDate: new Date()
          }
        })

        // Add experiment results
        await Promise.all(
          data.results.map(result =>
            tx.experimentResult.create({
              data: {
                ...result,
                experimentId
              }
            })
          )
        )

        // Update hypothesis with conclusions
        const hypothesis = await tx.hypothesis.update({
          where: { id: experiment.hypothesisId },
          data: {
            conclusion: data.conclusion,
            conclusionNotes: data.conclusionNotes,
            nextSteps: data.nextSteps,
            lessonLearned: data.lessonLearned,
            status: data.conclusion === 'VALIDATED' ? 'VALIDATED' :
                    data.conclusion === 'INVALIDATED' ? 'INVALIDATED' : 'COMPLETED'
          }
        })

        // Create lesson if provided
        if (data.lessonLearned) {
          await tx.lesson.create({
            data: {
              title: `Lesson from ${experiment.title}`,
              content: data.lessonLearned,
              category: 'Experiment',
              tags: [experiment.type, data.conclusion],
              experimentId,
              hypothesisId: experiment.hypothesisId,
              userId: data.userId
            }
          })
        }

        await this.logActivity(tx, 'EXPERIMENT_COMPLETED', `Experiment completed with conclusion: ${data.conclusion}`, 'experiment', experimentId, data.userId)

        logger.auditLog('EXPERIMENT_COMPLETED', '/workflow/experiment-completion', data.userId, {
          experimentId,
          conclusion: data.conclusion,
          resultsCount: data.results.length
        })

        return { experiment, hypothesis }
      } catch (error) {
        logger.error('Failed to complete experiment', error, { experimentId, userId: data.userId })
        throw error
      }
    })
  }

  private static async logActivity(tx: any, type: string, description: string, entityType: string, entityId: string, userId: string) {
    try {
      await tx.activity.create({
        data: {
          type: type as any,
          description,
          entityType,
          entityId,
          userId
        }
      })
    } catch (error) {
      logger.warn('Failed to log activity', error, { type, entityType, entityId, userId })
    }
  }
}

// Analytics and Reporting Service
export class AnalyticsService {
  // Get comprehensive dashboard data
  static async getDashboardMetrics(userId?: string) {
    try {
      const [
        ideasByStatus,
        hypothesesByStatus,
        experimentsInProgress,
        recentActivity,
        topRicedIdeas,
        conversionFunnel
      ] = await Promise.all([
        this.getIdeasByStatus(),
        this.getHypothesesByStatus(),
        this.getActiveExperiments(),
        this.getRecentActivity(userId),
        this.getTopRicedIdeas(5),
        this.getConversionFunnel()
      ])

      return {
        overview: {
          ideasByStatus,
          hypothesesByStatus,
          experimentsInProgress
        },
        insights: {
          topRicedIdeas,
          conversionFunnel,
          recentActivity
        }
      }
    } catch (error) {
      logger.error('Failed to get dashboard metrics', error, { userId })
      throw error
    }
  }

  private static async getIdeasByStatus() {
    return await prisma.idea.groupBy({
      by: ['status'],
      where: { deletedAt: null },
      _count: { status: true }
    })
  }

  private static async getHypothesesByStatus() {
    return await prisma.hypothesis.groupBy({
      by: ['status'],
      where: { deletedAt: null },
      _count: { status: true }
    })
  }

  private static async getActiveExperiments() {
    return await prisma.experiment.findMany({
      where: {
        status: { in: ['RUNNING', 'PLANNING'] },
        deletedAt: null
      },
      include: {
        hypothesis: {
          include: {
            idea: { select: { id: true, title: true } }
          }
        },
        creator: { select: { id: true, name: true } }
      },
      orderBy: { startDate: 'asc' }
    })
  }

  private static async getRecentActivity(userId?: string) {
    return await prisma.activity.findMany({
      where: userId ? { userId } : {},
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true } }
      }
    })
  }

  private static async getTopRicedIdeas(limit: number = 5) {
    return await prisma.idea.findMany({
      where: {
        riceScore: { not: null },
        deletedAt: null
      },
      take: limit,
      orderBy: { riceScore: 'desc' },
      include: {
        creator: { select: { id: true, name: true } }
      }
    })
  }

  private static async getConversionFunnel() {
    const [ideas, hypotheses, experiments, validatedHypotheses] = await Promise.all([
      prisma.idea.count({ where: { deletedAt: null } }),
      prisma.hypothesis.count({ where: { deletedAt: null } }),
      prisma.experiment.count({ where: { deletedAt: null } }),
      prisma.hypothesis.count({ where: { conclusion: 'VALIDATED', deletedAt: null } })
    ])

    return {
      ideas,
      hypotheses,
      experiments,
      validated: validatedHypotheses,
      conversionRates: {
        ideaToHypothesis: ideas > 0 ? (hypotheses / ideas * 100).toFixed(1) : '0',
        hypothesisToExperiment: hypotheses > 0 ? (experiments / hypotheses * 100).toFixed(1) : '0',
        experimentToValidation: experiments > 0 ? (validatedHypotheses / experiments * 100).toFixed(1) : '0'
      }
    }
  }
}

// Export services
export const ideaWorkflow = IdeaWorkflowService
export const hypothesisWorkflow = HypothesisWorkflowService
export const experimentWorkflow = ExperimentWorkflowService
export const analytics = AnalyticsService