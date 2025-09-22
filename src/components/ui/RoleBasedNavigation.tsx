"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Lightbulb,
  FlaskConical,
  TestTube,
  GitBranch,
  BarChart3,
  Shield,
  LogOut,
  Users,
  Eye,
  Settings
} from "lucide-react"
import { canCreate, canManageUsers, isViewer, getRoleDisplayName } from "@/lib/permissions"

export default function RoleBasedNavigation() {
  const { data: session } = useSession()
  const pathname = usePathname()

  if (!session?.user) return null

  const userRole = session.user.role as any
  const isReadOnly = isViewer(userRole)

  const navigationItems = [
    {
      href: "/dashboard",
      label: "Главная",
      icon: Home,
      show: true
    },
    {
      href: "/workflow",
      label: "Процесс",
      icon: GitBranch,
      show: true
    },
    {
      href: "/ideas",
      label: "Идеи",
      icon: Lightbulb,
      show: true,
      badge: isReadOnly ? "Только чтение" : undefined
    },
    {
      href: "/hypotheses",
      label: "Гипотезы",
      icon: FlaskConical,
      show: true,
      badge: isReadOnly ? "Только чтение" : undefined
    },
    {
      href: "/experiments",
      label: "Эксперименты",
      icon: TestTube,
      show: true,
      badge: isReadOnly ? "Только чтение" : undefined
    },
    {
      href: "/knowledge",
      label: "База знаний",
      icon: BarChart3,
      show: true
    },
    {
      href: "/admin/users",
      label: "Пользователи",
      icon: Users,
      show: canManageUsers(userRole)
    }
  ]

  return (
    <header className="bg-white shadow border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-gray-900">
              InnoLab CRM
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map(item => {
              if (!item.show) return null

              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                  {item.badge && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Badge variant={isReadOnly ? "secondary" : "default"}>
                {isReadOnly ? <Eye className="h-3 w-3 mr-1" /> : <Settings className="h-3 w-3 mr-1" />}
                {getRoleDisplayName(userRole)}
              </Badge>
              {canManageUsers(userRole) && (
                <Badge variant="destructive">
                  <Shield className="h-3 w-3 mr-1" />
                  Админ
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                {session.user.name || session.user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex flex-wrap gap-2">
            {navigationItems.map(item => {
              if (!item.show) return null

              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Role Notice for Viewers */}
        {isReadOnly && (
          <div className="bg-amber-50 border-t border-amber-200 px-4 py-2">
            <div className="flex items-center">
              <Eye className="h-4 w-4 text-amber-600 mr-2" />
              <span className="text-sm text-amber-800">
                У вас доступ только для просмотра. Создание и редактирование недоступны.
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}