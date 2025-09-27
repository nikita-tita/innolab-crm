"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: React.ComponentType<{
    error: Error
    reset: () => void
    goHome: () => void
  }>
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Логируем ошибку (в реальном приложении можно отправить в сервис мониторинга)
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Можно отправить ошибку в систему мониторинга
    if (typeof window !== 'undefined') {
      // Отправка в внешний сервис мониторинга (например, Sentry)
      // this.logErrorToService(error, errorInfo)
    }
  }

  private logErrorToService = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      })
    } catch (err) {
      console.error('Failed to log error to service:', err)
    }
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  private handleGoHome = () => {
    // Reset error state first
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });

    // Use Next.js navigation
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return (
          <FallbackComponent
            error={this.state.error!}
            reset={this.handleReset}
            goHome={this.handleGoHome}
          />
        )
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>

            <h1 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Что-то пошло не так
            </h1>

            <p className="text-gray-600 text-center mb-6">
              Произошла неожиданная ошибка. Мы уже получили уведомление и работаем над исправлением.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 rounded-md">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Детали ошибки (только для разработчиков):</h3>
                <pre className="text-xs text-gray-700 overflow-auto">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Попробовать снова
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                На главную
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Если проблема повторяется, обратитесь к администратору системы.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Простой компонент для отображения ошибок загрузки
export function LoadingError({
  error,
  retry,
  message = "Не удалось загрузить данные"
}: {
  error?: Error
  retry?: () => void
  message?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6 text-red-600" />
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>

      {error && process.env.NODE_ENV === 'development' && (
        <p className="text-sm text-gray-600 mb-4 text-center max-w-md">
          {error.message}
        </p>
      )}

      {retry && (
        <button
          onClick={retry}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Повторить попытку
        </button>
      )}
    </div>
  )
}

// Компонент для отображения состояния "ничего не найдено"
export function EmptyState({
  title = "Ничего не найдено",
  description,
  action
}: {
  title?: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6 text-gray-400" />
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>

      {description && (
        <p className="text-gray-600 text-center mb-4 max-w-md">{description}</p>
      )}

      {action}
    </div>
  )
}

export default ErrorBoundary