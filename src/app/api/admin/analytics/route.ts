import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    if (!['ADMIN', 'SUPER_ADMIN', 'FINANCE_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const [
      totalStudents,
      activeSubscriptions,
      totalCourses,
      totalLectures,
      pendingTickets,
      recentEnrollments,
      recentActivity,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.course.count(),
      prisma.lecture.count(),
      prisma.ticket.count({ where: { status: 'open' } }),
      prisma.enrollment.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          course: { select: { title: true } },
        },
      }),
      prisma.activityLog.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, role: true } },
        },
      }),
    ])

    // Calculate monthly revenue (mock for now)
    const monthlyRevenue = activeSubscriptions * 150 // 150 EGP per subscription

    // Get enrollments per course
    const courseStats = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        grade: true,
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: {
        enrollments: { _count: 'desc' },
      },
      take: 5,
    })

    return NextResponse.json({
      totalStudents,
      activeSubscriptions,
      totalCourses,
      totalLectures,
      pendingTickets,
      monthlyRevenue,
      recentEnrollments,
      recentActivity,
      courseStats,
    })
  } catch (error) {
    console.error('Get analytics error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب التحليلات' },
      { status: 500 }
    )
  }
}
