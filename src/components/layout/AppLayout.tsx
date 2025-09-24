"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import AppHeader from "./AppHeader"
import HelpSidebar from "./HelpSidebar"

interface AppLayoutProps {
  children: React.ReactNode
}

function getPageFromPathname(pathname: string): 'kanban' | 'ideas' | 'hypotheses' | 'experiments' | 'knowledge' | 'dashboard' {
  if (pathname.startsWith('/ideas')) return 'ideas'
  if (pathname.startsWith('/hypotheses')) return 'hypotheses'
  if (pathname.startsWith('/experiments')) return 'experiments'
  if (pathname.startsWith('/knowledge')) return 'knowledge'
  if (pathname.startsWith('/dashboard')) return 'dashboard'
  return 'kanban'
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [showHelp, setShowHelp] = useState(false)
  const pathname = usePathname()
  const currentPage = getPageFromPathname(pathname)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <AppHeader
        onHelpToggle={() => setShowHelp(!showHelp)}
        showHelp={showHelp}
      />

      <main className="relative">
        {children}
      </main>

      <HelpSidebar
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        page={currentPage}
      />
    </div>
  )
}