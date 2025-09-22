import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import { getUserByCredentials, TEAM_MEMBERS, OBSERVERS } from "./team-config"

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

        // Проверяем предустановленных пользователей команды
        const teamUser = getUserByCredentials(credentials.email, credentials.password)

        if (teamUser) {
          // Создаем или обновляем пользователя в базе данных
          let dbUser = await prisma.user.findUnique({
            where: { email: teamUser.email }
          })

          if (!dbUser) {
            // Создаем нового пользователя в БД
            dbUser = await prisma.user.create({
              data: {
                id: teamUser.id,
                email: teamUser.email,
                name: teamUser.name,
                role: teamUser.role as any,
                status: 'ACTIVE',
                isActive: true,
                lastLoginAt: new Date()
              }
            })
          } else {
            // Обновляем время последнего входа
            await prisma.user.update({
              where: { id: dbUser.id },
              data: {
                lastLoginAt: new Date(),
                name: teamUser.name, // Обновляем имя на случай изменений
                role: teamUser.role as any
              }
            })
          }

          return {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role,
            status: dbUser.status,
            image: teamUser.avatar
          }
        }

        return null
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.status = user.status
        token.picture = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.status = token.status as string
        session.user.image = token.picture as string
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/login",
  }
}

// Инициализация команды в базе данных
export async function initializeTeam() {
  try {
    for (const member of [...TEAM_MEMBERS, ...OBSERVERS]) {
      await prisma.user.upsert({
        where: { email: member.email },
        update: {
          name: member.name,
          role: member.role as any,
          status: 'ACTIVE',
          isActive: true
        },
        create: {
          id: member.id,
          email: member.email,
          name: member.name,
          role: member.role as any,
          status: 'ACTIVE',
          isActive: true
        }
      })
    }
    console.log('✅ Команда лаборатории инициализирована')
  } catch (error) {
    console.error('❌ Ошибка инициализации команды:', error)
  }
}