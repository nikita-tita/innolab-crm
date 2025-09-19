import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "20")
    const entityType = searchParams.get("entityType")
    const entityId = searchParams.get("entityId")

    const where: {
      entityType?: string
      entityId?: string
    } = {}

    if (entityType) where.entityType = entityType
    if (entityId) where.entityId = entityId

    const activities = await prisma.activity.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true }
        }
      },
      orderBy: [{ createdAt: "desc" }],
      take: limit
    })

    return NextResponse.json(activities)
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      type,
      description,
      entityType,
      entityId,
      metadata
    }: {
      type: string
      description: string
      entityType: string
      entityId: string
      metadata?: any
    } = body

    if (!type || !description || !entityType || !entityId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const activity = await prisma.activity.create({
      data: {
        type: type as any,
        description,
        entityType,
        entityId,
        userId: session.user.id,
        metadata: metadata || null
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true }
        }
      }
    })

    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    console.error("Error creating activity:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}