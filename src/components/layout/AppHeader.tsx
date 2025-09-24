"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getRoleDisplayName } from "@/lib/permissions"
import { HelpCircle, LogOut, Settings } from "lucide-react"
import { useState } from "react"

interface AppHeaderProps {
  onHelpToggle?: () => void
  showHelp?: boolean
}

const NAVIGATION_ITEMS = [
  { href: '/kanban', icon: '🌊', label: 'Канбан' },
  { href: '/ideas', icon: '💡', label: 'Идеи' },
  { href: '/hypotheses', icon: '🔬', label: 'Гипотезы' },
  { href: '/experiments', icon: '⚗️', label: 'Эксперименты' },
  { href: '/knowledge', icon: '📚', label: 'База знаний' },
  { href: '/dashboard', icon: '📊', label: 'Статистика' },
]

export default function AppHeader({ onHelpToggle, showHelp }: AppHeaderProps) {
  const { data: session } = useSession()
  const pathname = usePathname()

  return (
    <>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🌊 InLab CRM
              </h1>
              <div className="text-sm text-gray-600">
                {session?.user?.name} | {getRoleDisplayName(session?.user?.role || '')}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Help Toggle */}
              {onHelpToggle && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onHelpToggle}
                  className={showHelp ? "bg-blue-50 text-blue-600" : ""}
                >
                  <HelpCircle className="w-4 h-4" />
                </Button>
              )}

              {/* Admin Link */}
              {(session?.user?.role === 'ADMIN' || session?.user?.role === 'LAB_DIRECTOR') && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Админка
                  </Button>
                </Link>
              )}

              {/* Sign Out */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </Button>

              <Badge variant="secondary" className="text-xs">
                v1.0.0
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/60 backdrop-blur-sm border-b border-gray-100 sticky top-[73px] z-30">
        <div className="max-w-full mx-auto px-6">
          <div className="flex space-x-8">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`py-4 px-1 text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                  pathname === item.href
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-blue-600'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  )
}