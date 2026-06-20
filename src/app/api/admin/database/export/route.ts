import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'

    let data: any = {}

    if (type === 'all' || type === 'users') {
      data.users = await prisma.user.findMany({
        where: { role: { not: 'ADMIN' } },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          isAzhar: true,
          schoolYear: true,
          walletBalance: true,
          createdAt: true
        }
      })
    }

    if (type === 'all' || type === 'courses') {
      data.courses = await prisma.course.findMany({
        include: {
          chapters: {
            include: {
              lectures: true
            }
          }
        }
      })
    }

    if (type === 'all' || type === 'settings') {
      data.platformSettings = await prisma.platformSettings.findFirst()
      data.subscriptionPlans = await prisma.subscription.findMany({
        distinct: ['plan'],
        select: { plan: true, type: true }
      })
    }

    if (type === 'all' || type === 'ai') {
      data.aiSettings = await prisma.aISettings.findFirst()
      data.aiConversations = await prisma.aIConversation.findMany({
        include: {
          messages: true
        }
      })
    }

    return NextResponse.json({
      success: true,
      data,
      exportedAt: new Date().toISOString(),
      type
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { success: false, message: 'فشل تصدير البيانات' },
      { status: 500 }
    )
  }
}
