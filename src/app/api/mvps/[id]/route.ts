import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logActivity } from "@/lib/activity"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const mvpId = params.id

    const mvp = await prisma.mVP.findUnique({
      where: { id: mvpId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        experiment: {
          select: {
            id: true,
            title: true,
            status: true,
            hypothesis: {
              select: {
                id: true,
                title: true,
                idea: {
                  select: {
                    id: true,
                    title: true
                  }
                }
              }
            }
          }
        },
        attachments: true,
        _count: {
          select: {
            comments: true
          }
        }
      }
    })

    if (!mvp) {
      return NextResponse.json({ error: "MVP not found" }, { status: 404 })
    }

    return NextResponse.json(mvp)
  } catch (error) {
    console.error("Error fetching MVP:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const mvpId = params.id
    const body = await request.json()

    // Verify MVP exists
    const mvp = await prisma.mVP.findUnique({
      where: { id: mvpId },
      select: { id: true, title: true, status: true }
    })

    if (!mvp) {
      return NextResponse.json({ error: "MVP not found" }, { status: 404 })
    }

    const allowedUpdates = [
      'title', 'description', 'status', 'type', 'features',
      'technicalSpecs', 'resources', 'timeline', 'successCriteria'
    ]

    const updateData: Record<string, any> = {}

    for (const [key, value] of Object.entries(body)) {
      if (allowedUpdates.includes(key)) {
        updateData[key] = typeof value === 'string' ? value.trim() : value
      }
    }

    // Update MVP
    const updatedMVP = await prisma.mVP.update({
      where: { id: mvpId },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        experiment: {
          select: {
            id: true,
            title: true,
            hypothesis: {
              select: {
                id: true,
                title: true,
                idea: {
                  select: {
                    id: true,
                    title: true
                  }
                }
              }
            }
          }
        }
      }
    })

    // Log activity if status changed
    if (body.status && body.status !== mvp.status) {
      await logActivity({
        type: "STATUS_CHANGED",
        description: `${session.user.email} изменил(а) статус MVP "${mvp.title}" с ${mvp.status} на ${body.status}`,
        entityType: "mvp",
        entityId: mvpId,
        userId: session.user.id,
        metadata: {
          oldStatus: mvp.status,
          newStatus: body.status
        }
      })
    }

    return NextResponse.json(updatedMVP)
  } catch (error) {
    console.error("Error updating MVP:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const mvpId = params.id

    // Verify MVP exists
    const mvp = await prisma.mVP.findUnique({
      where: { id: mvpId },
      select: { id: true, title: true }
    })

    if (!mvp) {
      return NextResponse.json({ error: "MVP not found" }, { status: 404 })
    }

    // Delete MVP
    await prisma.mVP.delete({
      where: { id: mvpId }
    })

    // Log activity
    await logActivity({
      type: "DELETED",
      description: `${session.user.email} удалил(а) MVP "${mvp.title}"`,
      entityType: "mvp",
      entityId: mvpId,
      userId: session.user.id
    })

    return NextResponse.json({ message: "MVP deleted successfully" })
  } catch (error) {
    console.error("Error deleting MVP:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}