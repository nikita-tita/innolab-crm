import { prisma } from "./prisma"

export type ActivityType =
  | "CREATED"
  | "UPDATED"
  | "DELETED"
  | "STATUS_CHANGED"
  | "COMMENT_ADDED"
  | "EXPERIMENT_STARTED"
  | "EXPERIMENT_COMPLETED"
  | "HYPOTHESIS_VALIDATED"
  | "HYPOTHESIS_INVALIDATED"

export async function logActivity({
  type,
  description,
  entityType,
  entityId,
  userId,
  metadata
}: {
  type: ActivityType
  description: string
  entityType: string
  entityId: string
  userId: string
  metadata?: any
}) {
  try {
    return await prisma.activity.create({
      data: {
        type,
        description,
        entityType,
        entityId,
        userId,
        metadata: metadata || null
      }
    })
  } catch (error) {
    console.error("Failed to log activity:", error)
    // Don't throw error to prevent breaking main functionality
  }
}

export function getActivityDescription(
  type: ActivityType,
  entityType: string,
  entityTitle: string,
  userEmail: string
): string {
  const entityTypeNames = {
    idea: "идею",
    hypothesis: "гипотезу",
    experiment: "эксперимент",
    successCriteria: "критерий успеха"
  }

  const entityName = entityTypeNames[entityType as keyof typeof entityTypeNames] || entityType

  switch (type) {
    case "CREATED":
      return `${userEmail} создал(а) ${entityName} "${entityTitle}"`
    case "UPDATED":
      return `${userEmail} обновил(а) ${entityName} "${entityTitle}"`
    case "DELETED":
      return `${userEmail} удалил(а) ${entityName} "${entityTitle}"`
    case "STATUS_CHANGED":
      return `${userEmail} изменил(а) статус ${entityName} "${entityTitle}"`
    case "COMMENT_ADDED":
      return `${userEmail} добавил(а) комментарий к ${entityName} "${entityTitle}"`
    case "EXPERIMENT_STARTED":
      return `${userEmail} запустил(а) эксперимент "${entityTitle}"`
    case "EXPERIMENT_COMPLETED":
      return `${userEmail} завершил(а) эксперимент "${entityTitle}"`
    case "HYPOTHESIS_VALIDATED":
      return `Гипотеза "${entityTitle}" подтверждена`
    case "HYPOTHESIS_INVALIDATED":
      return `Гипотеза "${entityTitle}" опровергнута`
    default:
      return `${userEmail} выполнил(а) действие с ${entityName} "${entityTitle}"`
  }
}