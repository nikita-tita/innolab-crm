import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, category } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      )
    }

    const materialRequest = await prisma.materialRequest.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category: category || "METHODOLOGY",
        userId: session.user.id,
        status: "PENDING"
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    return NextResponse.json(materialRequest, { status: 201 })
  } catch (error) {
    console.error("Error creating material request:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has admin privileges
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "LAB_DIRECTOR"

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const where: any = {}

    // Regular users can only see their own requests
    if (!isAdmin) {
      where.userId = session.user.id
    }

    if (status) {
      where.status = status
    }

    const materialRequests = await prisma.materialRequest.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(materialRequests)
  } catch (error) {
    console.error("Error fetching material requests:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}