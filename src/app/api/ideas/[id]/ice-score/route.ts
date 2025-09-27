import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user can score (not VIEWER)
    if (session.user.role === "VIEWER") {
      return NextResponse.json({ error: "Viewers cannot score ideas" }, { status: 403 })
    }

    const { id } = await params
    const { impact, confidence, ease, comment } = await request.json()

    if (!impact || !confidence || !ease) {
      return NextResponse.json(
        { error: "Impact, confidence, and ease are required" },
        { status: 400 }
      )
    }

    // Validate scores are 1-10
    if (impact < 1 || impact > 10 || confidence < 1 || confidence > 10 || ease < 1 || ease > 10) {
      return NextResponse.json(
        { error: "Scores must be between 1 and 10" },
        { status: 400 }
      )
    }

    // Check if idea exists
    const idea = await prisma.idea.findUnique({
      where: { id }
    })

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 })
    }

    // Create or update ICE score
    const iceScore = await prisma.iCEScore.upsert({
      where: {
        userId_ideaId: {
          userId: session.user.id,
          ideaId: id
        }
      },
      create: {
        impact,
        confidence,
        ease,
        comment: comment?.trim() || null,
        userId: session.user.id,
        ideaId: id
      },
      update: {
        impact,
        confidence,
        ease,
        comment: comment?.trim() || null
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

    return NextResponse.json(iceScore)
  } catch (error) {
    console.error("Error creating/updating ICE score:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Get all ICE scores for this idea
    const iceScores = await prisma.iCEScore.findMany({
      where: { ideaId: id },
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

    // Calculate average scores
    let avgImpact = 0
    let avgConfidence = 0
    let avgEase = 0
    let avgTotal = 0

    if (iceScores.length > 0) {
      avgImpact = iceScores.reduce((sum, score) => sum + score.impact, 0) / iceScores.length
      avgConfidence = iceScores.reduce((sum, score) => sum + score.confidence, 0) / iceScores.length
      avgEase = iceScores.reduce((sum, score) => sum + score.ease, 0) / iceScores.length
      avgTotal = (avgImpact + avgConfidence + avgEase) / 3
    }

    return NextResponse.json({
      scores: iceScores,
      averages: {
        impact: Math.round(avgImpact * 100) / 100,
        confidence: Math.round(avgConfidence * 100) / 100,
        ease: Math.round(avgEase * 100) / 100,
        total: Math.round(avgTotal * 100) / 100
      },
      totalScores: iceScores.length
    })
  } catch (error) {
    console.error("Error fetching ICE scores:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}