import { UserRole } from "@prisma/client"

export const teamRoles: UserRole[] = [
  "PRODUCT_MANAGER",
  "DESIGNER",
  "MARKETER",
  "ANALYST",
  "MIDDLE_OFFICE",
  "EXECUTIVE",
  "TEAM_MEMBER"
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
    PRODUCT_MANAGER: "Product Manager",
    DESIGNER: "Дизайнер",
    MARKETER: "Маркетолог",
    ANALYST: "Аналитик",
    MIDDLE_OFFICE: "Middle Office",
    EXECUTIVE: "Руководитель",
    TEAM_MEMBER: "Участник команды",
    VIEWER: "Наблюдатель",
    STAKEHOLDER: "Заинтересованная сторона",
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