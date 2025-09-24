import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Проверяем пользователя в базе данных
        const dbUser = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!dbUser) {
          return null
        }

        // Проверяем статус пользователя
        if (dbUser.status !== 'ACTIVE' || !dbUser.isActive) {
          return null
        }

        // Для демо: простая проверка пароля (в продакшне используйте bcrypt)
        // Проверяем пароль
        const isValidPassword = await bcrypt.compare(credentials.password, dbUser.password || '')

        // Для демо: админ с простым паролем
        const isDemoAdmin = dbUser.email === 'admin@inlab.com' && credentials.password === 'admin2024'

        if (isValidPassword || isDemoAdmin) {
          // Обновляем время последнего входа
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { lastLoginAt: new Date() }
          })

          return {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role,
            status: dbUser.status
          }
        }

        return null
      }
    })
  ],
  pages: {
    signIn: '/auth/login'
  },
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.status = user.status
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.status = token.status as string
      }
      return session
    }
  }
}

// Функция для создания админа
export async function createAdmin() {
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@inlab.com' }
    })

    if (!existingAdmin) {
      const admin = await prisma.user.create({
        data: {
          email: 'admin@inlab.com',
          name: 'Главный Администратор',
          role: 'ADMIN',
          status: 'ACTIVE',
          isActive: true
        }
      })

      console.log('✅ Администратор создан:', admin.email)
      return admin
    }

    return existingAdmin
  } catch (error) {
    console.error('❌ Ошибка создания администратора:', error)
    throw error
  }
}