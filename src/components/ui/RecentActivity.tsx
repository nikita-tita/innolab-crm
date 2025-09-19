"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

interface Activity {
  id: string
  type: string
  description: string
  entityType: string
  entityId: string
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  metadata: any
}

export default function RecentActivity() {
  const { data: session } = useSession()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/activities?limit=5')
        if (response.ok) {
          const data = await response.json()
          setActivities(data)
        }
      } catch (error) {
        console.error('Error fetching activities:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchActivities()
    }
  }, [session])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "CREATED":
        return "bg-green-500"
      case "UPDATED":
        return "bg-blue-500"
      case "STATUS_CHANGED":
        return "bg-yellow-500"
      case "COMMENT_ADDED":
        return "bg-purple-500"
      case "EXPERIMENT_STARTED":
        return "bg-orange-500"
      case "EXPERIMENT_COMPLETED":
        return "bg-indigo-500"
      case "HYPOTHESIS_VALIDATED":
        return "bg-green-600"
      case "HYPOTHESIS_INVALIDATED":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return "только что"
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} мин назад`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} ч назад`
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} дн назад`
    } else {
      return date.toLocaleDateString('ru-RU')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <span className="text-2xl mr-2">📋</span>
        Недавняя активность
      </h2>
      <div className="space-y-4">
        {loading ? (
          <div className="text-sm text-gray-500">Загрузка...</div>
        ) : activities.length === 0 ? (
          <div className="text-sm text-gray-500">Пока нет активности</div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className={`w-3 h-3 ${getActivityIcon(activity.type)} rounded-full mt-2 shadow-sm`}></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 leading-relaxed">{activity.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500 font-medium">
                    {activity.user.name || activity.user.email}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatTimeAgo(activity.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {activities.length > 0 && (
        <div className="mt-6 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center transition-colors duration-200">
            Показать всю активность
            <span className="ml-1">→</span>
          </button>
        </div>
      )}
    </div>
  )
}