// Server-side permissions utilities for API routes

export interface User {
  id: string
  role: string
  email?: string
  name?: string
}

export interface ResourceOwnership {
  createdBy: string
}

export function isAdmin(user: User): boolean {
  return user.role === 'ADMIN' || user.role === 'LAB_DIRECTOR'
}

export function canView(user: User): boolean {
  return true // All authenticated users can view
}

export function canCreate(user: User): boolean {
  return user.role !== 'VIEWER'
}

export function canEdit(user: User, resource?: ResourceOwnership): boolean {
  // Admins can edit anything
  if (isAdmin(user)) {
    return true
  }

  // Resource owners can edit their own items
  if (resource && resource.createdBy === user.id) {
    return true
  }

  // Viewers cannot edit anything
  if (user.role === 'VIEWER') {
    return false
  }

  // Other roles can edit if no resource specified (for general permissions)
  return !resource
}

export function canDelete(user: User, resource?: ResourceOwnership): boolean {
  // Only admins and resource owners can delete
  if (isAdmin(user)) {
    return true
  }

  if (resource && resource.createdBy === user.id) {
    return true
  }

  return false
}

export function requireAuth(user: User | null): user is User {
  return user !== null && typeof user.id === 'string'
}

export function requirePermission(
  user: User,
  action: 'view' | 'create' | 'edit' | 'delete',
  resource?: ResourceOwnership
): boolean {
  switch (action) {
    case 'view':
      return canView(user)
    case 'create':
      return canCreate(user)
    case 'edit':
      return canEdit(user, resource)
    case 'delete':
      return canDelete(user, resource)
    default:
      return false
  }
}

export class PermissionError extends Error {
  constructor(message: string, public statusCode: number = 403) {
    super(message)
    this.name = 'PermissionError'
  }
}

export function checkPermission(
  user: User,
  action: 'view' | 'create' | 'edit' | 'delete',
  resource?: ResourceOwnership
): void {
  if (!requirePermission(user, action, resource)) {
    const resourceStr = resource ? ' this resource' : ''
    throw new PermissionError(`You don't have permission to ${action}${resourceStr}`)
  }
}