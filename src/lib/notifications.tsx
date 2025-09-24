"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
  persistent?: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  success: (title: string, message?: string, options?: Partial<Notification>) => void
  error: (title: string, message?: string, options?: Partial<Notification>) => void
  warning: (title: string, message?: string, options?: Partial<Notification>) => void
  info: (title: string, message?: string, options?: Partial<Notification>) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(7)
    const newNotification: Notification = {
      id,
      duration: 5000,
      ...notification
    }

    setNotifications(prev => [...prev, newNotification])

    // Автоматическое удаление через указанное время
    if (!newNotification.persistent && newNotification.duration) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const success = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    addNotification({ ...options, type: 'success', title, message })
  }, [addNotification])

  const error = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    addNotification({ ...options, type: 'error', title, message, persistent: true })
  }, [addNotification])

  const warning = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    addNotification({ ...options, type: 'warning', title, message })
  }, [addNotification])

  const info = useCallback((title: string, message?: string, options?: Partial<Notification>) => {
    addNotification({ ...options, type: 'info', title, message })
  }, [addNotification])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
        success,
        error,
        warning,
        info
      }}
    >
      {children}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </NotificationContext.Provider>
  )
}

interface NotificationContainerProps {
  notifications: Notification[]
  onRemove: (id: string) => void
}

function NotificationContainer({ notifications, onRemove }: NotificationContainerProps) {
  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}

interface NotificationItemProps {
  notification: Notification
  onRemove: (id: string) => void
}

function NotificationItem({ notification, onRemove }: NotificationItemProps) {
  const { type, title, message, action } = notification

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div
      className={`p-4 rounded-lg border shadow-lg ${getBackgroundColor()} transform transition-all duration-300 ease-in-out animate-in slide-in-from-right`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{getIcon()}</div>

        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          {message && (
            <p className="mt-1 text-sm text-gray-600">{message}</p>
          )}

          {action && (
            <button
              onClick={() => {
                action.onClick()
                onRemove(notification.id)
              }}
              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              {action.label}
            </button>
          )}
        </div>

        <button
          onClick={() => onRemove(notification.id)}
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Хук для обработки API ошибок
export function useApiErrorHandler() {
  const { error } = useNotifications()

  return useCallback((err: any, defaultMessage: string = 'Произошла ошибка') => {
    if (err?.response?.data?.message) {
      error('Ошибка', err.response.data.message)
    } else if (err?.message) {
      error('Ошибка', err.message)
    } else {
      error('Ошибка', defaultMessage)
    }
  }, [error])
}

// Хук для успешных операций
export function useSuccessHandler() {
  const { success } = useNotifications()

  return useCallback((message: string, title: string = 'Успешно') => {
    success(title, message)
  }, [success])
}