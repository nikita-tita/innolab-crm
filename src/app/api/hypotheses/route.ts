import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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
    const ideaId = searchParams.get("ideaId")

    const where: Record<string, string> = {}

    if (status) where.status = status
    if (priority) where.priority = priority
    if (ideaId) where.ideaId = ideaId

    const hypotheses = await prisma.hypothesis.findMany({
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
        idea: {
          select: {
            id: true,
            title: true
          }
        },
        experiments: {
          select: {
            id: true,
            title: true,
            status: true
          }
        },
        _count: {
          select: {
            experiments: true,
            comments: true
          }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(hypotheses)
  } catch (error) {
    console.error("Error fetching hypotheses:", error)
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
    const {
      title,
      statement,
      description,
      ideaId,
      priority = "MEDIUM",
      confidenceLevel = 70,
      testingMethod,
      successCriteria: successCriteriaText,
      reach,
      impact,
      confidence,
      effort,
      targetAudience,
      userValue,
      businessImpact,
      financialImpact,
      strategicAlignment,
      deskResearchNotes,
      deskResearchSources
    } = body

    if (!title || !statement || !ideaId) {
      return NextResponse.json(
        { error: "Title, statement and ideaId are required" },
        { status: 400 }
      )
    }

    // Create or get demo user
    let userId = session?.user?.id || 'demo-user-id'

    // Ensure demo user exists
    let user = await prisma.user.findUnique({ where: { id: userId } })
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
        // User might already exist with different ID but same email
        if (error.code === 'P2002') {
          user = await prisma.user.findUnique({ where: { email: 'demo@innolab.com' } })
          if (user) {
            userId = user.id
          }
        } else {
          throw error
        }
      }
    }

    // Check if idea exists, create demo idea if not
    let idea = await prisma.idea.findUnique({
      where: { id: ideaId }
    })

    if (!idea && ideaId === "demo-idea-id") {
      idea = await prisma.idea.create({
        data: {
          id: ideaId,
          title: "Демо идея",
          description: "Базовая идея для демонстрации",
          status: "NEW",
          priority: "MEDIUM",
          createdBy: userId
        }
      })
    }

    if (!idea) {
      return NextResponse.json(
        { error: "Idea not found" },
        { status: 404 }
      )
    }

    // Calculate RICE score if all values are provided
    let riceScore = null
    if (reach && impact && confidence && effort && reach > 0 && impact > 0 && confidence > 0 && effort > 0) {
      riceScore = (reach * impact * confidence) / effort
    }

    const hypothesis = await prisma.hypothesis.create({
      data: {
        title: title.trim(),
        statement: statement.trim(),
        description: description?.trim() || null,
        ideaId,
        priority,
        confidenceLevel,
        testingMethod: testingMethod?.trim() || null,
        successCriteriaText: successCriteriaText?.trim() || null,
        status: riceScore ? "SCORED" : "DRAFT",
        reach: reach || null,
        impact: impact || null,
        confidence: confidence || null,
        effort: effort || null,
        riceScore,
        targetAudience: targetAudience?.trim() || null,
        userValue: userValue?.trim() || null,
        businessImpact: businessImpact?.trim() || null,
        financialImpact: financialImpact?.trim() || null,
        strategicAlignment: strategicAlignment?.trim() || null,
        deskResearchNotes: deskResearchNotes?.trim() || null,
        deskResearchSources: deskResearchSources?.trim() || null,
        deskResearchDate: deskResearchNotes ? new Date() : null,
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
        idea: {
          select: {
            id: true,
            title: true
          }
        },
        _count: {
          select: {
            experiments: true,
            comments: true
          }
        }
      }
    })

    return NextResponse.json(hypothesis, { status: 201 })
  } catch (error) {
    console.error("Error creating hypothesis:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}