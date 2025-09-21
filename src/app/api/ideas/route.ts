import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logActivity, getActivityDescription } from "@/lib/activity"

export async function GET(request: NextRequest) {
  try {
    // Allow public access for demo purposes
    // const session = await getServerSession(authOptions)
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const category = searchParams.get("category")

    const where: Record<string, unknown> = {}

    if (status) where.status = status
    if (priority) where.priority = priority
    if (category) where.category = { contains: category, mode: 'insensitive' }

    const ideas = await prisma.idea.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        hypotheses: {
          select: {
            id: true,
            title: true,
            status: true
          }
        },
        _count: {
          select: {
            hypotheses: true,
            comments: true
          }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(ideas)
  } catch (error) {
    console.error("Error fetching ideas:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Allow demo access without authentication
    const session = await getServerSession(authOptions)

    const body = await request.json()
    const { title, description, category, priority = "MEDIUM" } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      )
    }

    // Create or get demo user
    let userId = session?.user?.id || 'demo-user-id'

    // First try to find existing demo user by email
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: userId },
          { email: 'demo@innolab.com' }
        ]
      }
    })

    if (!user) {
      try {
        user = await prisma.user.create({
          data: {
            id: userId,
            email: 'demo@innolab.com',
            name: 'Demo User',
            role: 'PRODUCT_MANAGER',
          }
        })
      } catch (error: any) {
        // If user already exists, find them
        if (error.code === 'P2002') {
          user = await prisma.user.findFirst({
            where: { email: 'demo@innolab.com' }
          })
          if (!user) {
            throw new Error('Could not create or find demo user')
          }
        } else {
          throw error
        }
      }
    }

    userId = user.id

    const idea = await prisma.idea.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category: category?.trim() || null,
        priority,
        status: "NEW",
        createdBy: userId
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        _count: {
          select: {
            hypotheses: true,
            comments: true
          }
        }
      }
    })

    // Log activity only if user is authenticated
    if (session?.user?.id) {
      try {
        await logActivity({
          type: "CREATED",
          description: getActivityDescription("CREATED", "idea", idea.title, session.user.email || ""),
          entityType: "idea",
          entityId: idea.id,
          userId: session.user.id
        })
      } catch (error) {
        console.warn("Could not log activity:", error)
      }
    }

    return NextResponse.json(idea, { status: 201 })
  } catch (error) {
    console.error("Error creating idea:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}