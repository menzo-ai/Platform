import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: session.user.id },
      include: {
        course: {
          include: {
            chapters: {
              include: {
                lectures: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Get progress for each enrollment
    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const lectureIds = enrollment.course.chapters.flatMap(c => 
          c.lectures.map(l => l.id)
        )
        
        const completedLectures = await prisma.progress.count({
          where: {
            userId: session.user.id,
            lectureId: { in: lectureIds },
            completed: true,
          },
        })

        const totalLectures = lectureIds.length
        const progress = totalLectures > 0 
          ? Math.round((completedLectures / totalLectures) * 100) 
          : 0

        return {
          ...enrollment,
          progress,
          completedLectures,
          totalLectures,
        }
      })
    )

    return NextResponse.json(enrollmentsWithProgress)
  } catch (error) {
    console.error('Get enrollments error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب التسجيلات' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { courseId } = await request.json()

    if (!courseId) {
      return NextResponse.json(
        { error: 'معرف الدورة مطلوب' },
        { status: 400 }
      )
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'الدورة غير موجودة' },
        { status: 404 }
      )
    }

    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'أنت مسجل في هذه الدورة بالفعل' },
        { status: 400 }
      )
    }

    // Check subscription if not free
    if (course.price > 0) {
      const subscription = await prisma.subscription.findUnique({
        where: { userId: session.user.id },
      })

      if (!subscription || subscription.status !== 'ACTIVE') {
        return NextResponse.json(
          { error: 'يجب أن يكون لديك اشتراك نشط للتسجيل في هذه الدورة' },
          { status: 403 }
        )
      }
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId,
      },
      include: {
        course: true,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'ENROLL',
        details: JSON.stringify({ courseId, courseName: course.title }),
      },
    })

    return NextResponse.json(enrollment, { status: 201 })
  } catch (error) {
    console.error('Create enrollment error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء التسجيل' },
      { status: 500 }
    )
  }
}
