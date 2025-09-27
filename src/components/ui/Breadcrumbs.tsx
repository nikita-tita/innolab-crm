"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  showHome?: boolean
}

export function Breadcrumbs({ items, showHome = true }: BreadcrumbsProps) {
  const allItems = showHome
    ? [{ label: "Дашборд", href: "/dashboard" }, ...items]
    : items

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {allItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
            )}

            {index === 0 && showHome && (
              <Home className="h-4 w-4 text-gray-400 mr-2" />
            )}

            {item.href && !item.isActive ? (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={`text-sm font-medium ${
                item.isActive ? "text-gray-900" : "text-gray-500"
              }`}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Pre-configured breadcrumb helpers for common navigation patterns
export const breadcrumbPatterns = {
  ideas: {
    list: () => [{ label: "Идеи", href: "/ideas", isActive: true }],
    new: () => [
      { label: "Идеи", href: "/ideas" },
      { label: "Новая идея", isActive: true }
    ],
    detail: (ideaTitle: string) => [
      { label: "Идеи", href: "/ideas" },
      { label: ideaTitle, isActive: true }
    ]
  },

  hypotheses: {
    list: () => [{ label: "Гипотезы", href: "/hypotheses", isActive: true }],
    new: (ideaTitle?: string) => {
      const items = [{ label: "Гипотезы", href: "/hypotheses" }]
      if (ideaTitle) {
        items.unshift({ label: "Идеи", href: "/ideas" })
        items.unshift({ label: ideaTitle, href: "#" })
      }
      items.push({ label: "Новая гипотеза", isActive: true })
      return items
    },
    detail: (hypothesisTitle: string, ideaTitle?: string) => {
      const items = [{ label: "Гипотезы", href: "/hypotheses" }]
      if (ideaTitle) {
        items.unshift({ label: "Идеи", href: "/ideas" })
        items.unshift({ label: ideaTitle, href: "#" })
      }
      items.push({ label: hypothesisTitle, isActive: true })
      return items
    }
  },

  experiments: {
    list: () => [{ label: "Эксперименты", href: "/experiments", isActive: true }],
    new: (hypothesisTitle?: string, ideaTitle?: string) => {
      const items = [{ label: "Эксперименты", href: "/experiments" }]
      if (hypothesisTitle) {
        items.unshift({ label: "Гипотезы", href: "/hypotheses" })
        if (ideaTitle) {
          items.unshift({ label: "Идеи", href: "/ideas" })
          items.unshift({ label: ideaTitle, href: "#" })
        }
        items.unshift({ label: hypothesisTitle, href: "#" })
      }
      items.push({ label: "Новый эксперимент", isActive: true })
      return items
    },
    detail: (experimentTitle: string, hypothesisTitle?: string, ideaTitle?: string) => {
      const items = [{ label: "Эксперименты", href: "/experiments" }]
      if (hypothesisTitle) {
        items.unshift({ label: "Гипотезы", href: "/hypotheses" })
        if (ideaTitle) {
          items.unshift({ label: "Идеи", href: "/ideas" })
          items.unshift({ label: ideaTitle, href: "#" })
        }
        items.unshift({ label: hypothesisTitle, href: "#" })
      }
      items.push({ label: experimentTitle, isActive: true })
      return items
    }
  }
}