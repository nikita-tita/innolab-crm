// Предустановленная команда лаборатории
export const TEAM_MEMBERS = [
  {
    id: 'admin-main',
    name: 'Главный Администратор',
    email: 'admin@innolab.com',
    role: 'ADMIN',
    password: 'admin2024', // В реальной системе должно быть захешировано
    avatar: '/avatars/admin.jpg',
    permissions: ['all']
  }
] as const

// Наблюдатели (могут быть добавлены динамически)
export const OBSERVERS = [] as const

export const ALL_USERS = [...TEAM_MEMBERS, ...OBSERVERS]

export function getUserByCredentials(email: string, password: string) {
  return ALL_USERS.find(user =>
    user.email === email && user.password === password
  )
}

export function getUserById(id: string) {
  return ALL_USERS.find(user => user.id === id)
}

export function getRoleDisplayName(role: string): string {
  switch (role) {
    case 'LAB_DIRECTOR': return 'Руководитель лаборатории'
    case 'PRODUCT_MANAGER': return 'Менеджер по продукту'
    case 'UX_RESEARCHER': return 'UX-исследователь'
    case 'MARKETER': return 'Маркетолог-экспериментатор'
    case 'SALES_EXPERT': return 'Эксперт по продажам'
    case 'OPERATIONS_EXPERT': return 'Эксперт по операциям'
    case 'HYPOTHESIS_OWNER': return 'Владелец гипотезы'
    case 'VIEWER': return 'Наблюдатель'
    case 'STAKEHOLDER': return 'Заинтересованная сторона'
    case 'ADMIN': return 'Администратор'
    default: return role
  }
}

export function canUserEdit(userRole: string): boolean {
  const editRoles = [
    'LAB_DIRECTOR',
    'PRODUCT_MANAGER',
    'UX_RESEARCHER',
    'MARKETER',
    'SALES_EXPERT',
    'OPERATIONS_EXPERT',
    'HYPOTHESIS_OWNER',
    'ADMIN'
  ]
  return editRoles.includes(userRole)
}

export function canUserDelete(userRole: string): boolean {
  const deleteRoles = ['LAB_DIRECTOR', 'ADMIN']
  return deleteRoles.includes(userRole)
}

export function canUserApprove(userRole: string): boolean {
  const approveRoles = ['LAB_DIRECTOR']
  return approveRoles.includes(userRole)
}