import { prisma } from '@/lib/prisma'
import { ActivityType } from '@prisma/client'

export interface LogActivityParams {
  type: ActivityType
  description: string
  entityType: string
  entityId: string
  userId: string
  metadata?: any
}

export async function logActivity(params: LogActivityParams) {
  try {
    return await prisma.activity.create({
      data: params
    })
  } catch (error) {
    console.error('Error logging activity:', error)
    throw error
  }
}

export function getActivityDescription(
  type: ActivityType,
  entityType: string,
  entityName: string,
  userName: string
): string {
  const typeMap = {
    CREATED: 'создал(а)',
    UPDATED: 'обновил(а)',
    DELETED: 'удалил(а)',
    STATUS_CHANGED: 'изменил(а) статус',
    COMMENT_ADDED: 'добавил(а) комментарий к',
    EXPERIMENT_STARTED: 'запустил(а) эксперимент',
    EXPERIMENT_COMPLETED: 'завершил(а) эксперимент',
    HYPOTHESIS_VALIDATED: 'подтвердил(а) гипотезу',
    HYPOTHESIS_INVALIDATED: 'опроверг(ла) гипотезу'
  }

  const entityTypeMap = {
    idea: 'идею',
    hypothesis: 'гипотезу',
    experiment: 'эксперимент',
    mvp: 'MVP'
  }

  return `${userName} ${typeMap[type]} ${entityTypeMap[entityType as keyof typeof entityTypeMap] || entityType} "${entityName}"`
}