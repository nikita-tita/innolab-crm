import { UserRole } from "@prisma/client"

export const teamRoles: UserRole[] = [
  "LAB_DIRECTOR",
  "PRODUCT_MANAGER",
  "UX_RESEARCHER",
  "MARKETER",
  "SALES_EXPERT",
  "OPERATIONS_EXPERT",
  "HYPOTHESIS_OWNER"
]

export const viewerRoles: UserRole[] = [
  "VIEWER",
  "STAKEHOLDER"
]

export const adminRoles: UserRole[] = [
  "ADMIN"
]

export const allRoles: UserRole[] = [
  ...teamRoles,
  ...viewerRoles,
  ...adminRoles
]

export function isTeamMember(role: UserRole): boolean {
  return teamRoles.includes(role)
}

export function isViewer(role: UserRole): boolean {
  return viewerRoles.includes(role)
}

export function isAdmin(role: UserRole): boolean {
  return adminRoles.includes(role)
}

export function canCreate(role: UserRole): boolean {
  return isTeamMember(role) || isAdmin(role)
}

export function canEdit(role: UserRole): boolean {
  return isTeamMember(role) || isAdmin(role)
}

export function canDelete(role: UserRole): boolean {
  return isTeamMember(role) || isAdmin(role)
}

export function canView(role: UserRole): boolean {
  return allRoles.includes(role)
}

export function canManageUsers(role: UserRole): boolean {
  return isAdmin(role)
}

export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    LAB_DIRECTOR: "Директор лаборатории",
    PRODUCT_MANAGER: "Продакт-менеджер",
    UX_RESEARCHER: "UX-исследователь",
    MARKETER: "Маркетолог",
    SALES_EXPERT: "Эксперт по продажам",
    OPERATIONS_EXPERT: "Эксперт по операциям",
    HYPOTHESIS_OWNER: "Владелец гипотезы",
    VIEWER: "Наблюдатель",
    STAKEHOLDER: "Стейкхолдер",
    ADMIN: "Администратор"
  }

  return roleNames[role] || role
}

export function getRoleDescription(role: UserRole): string {
  const descriptions: Record<UserRole, string> = {
    PRODUCT_MANAGER: "Управление продуктом и стратегией",
    DESIGNER: "UX/UI дизайн и пользовательский опыт",
    MARKETER: "Маркетинг и продвижение продукта",
    ANALYST: "Анализ данных и метрик",
    MIDDLE_OFFICE: "Поддержка бизнес-процессов",
    EXECUTIVE: "Стратегическое управление",
    TEAM_MEMBER: "Общая роль участника команды",
    VIEWER: "Просмотр данных без редактирования",
    STAKEHOLDER: "Заинтересованная сторона проекта",
    ADMIN: "Полный доступ к системе"
  }

  return descriptions[role] || "Описание роли не найдено"
}