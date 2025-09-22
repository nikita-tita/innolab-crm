import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Разрешаем доступ к публичным страницам
    if (pathname.startsWith("/auth/") || pathname === "/") {
      return NextResponse.next()
    }

    // Проверяем авторизацию
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }

    // Проверяем статус пользователя
    if (token.status !== "ACTIVE") {
      return NextResponse.redirect(new URL("/auth/login?error=account_inactive", req.url))
    }

    // Ограничиваем доступ к админ-панели
    if (pathname.startsWith("/admin")) {
      if (token.role !== "ADMIN" && token.role !== "LAB_DIRECTOR") {
        return NextResponse.redirect(new URL("/dashboard?error=access_denied", req.url))
      }
    }

    // Проверяем права на создание/редактирование
    const teamRoles = [
      "PRODUCT_MANAGER",
      "DESIGNER",
      "MARKETER",
      "ANALYST",
      "MIDDLE_OFFICE",
      "EXECUTIVE",
      "TEAM_MEMBER",
      "ADMIN"
    ]

    const editPaths = ["/ideas/new", "/hypotheses/new", "/experiments/new"]

    if (editPaths.some(path => pathname.startsWith(path))) {
      if (!teamRoles.includes(token.role as string)) {
        return NextResponse.redirect(new URL("/dashboard?error=read_only_access", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Разрешаем доступ к публичным страницам без токена
        if (req.nextUrl.pathname.startsWith("/auth/") || req.nextUrl.pathname === "/") {
          return true
        }
        // Для всех остальных страниц требуем токен
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}