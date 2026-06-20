import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { courseSchema } from '@/lib/validations'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const grade = searchParams.get('grade')

    const where: any = {
      isPublished: true,
    }

    if (grade) {
      where.grade = parseInt(grade)
    }

    // If student is logged in, filter by their school year
    if (session?.user && session.user.role === 'STUDENT') {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      })
      if (user?.schoolYear) {
        where.grade = user.schoolYear
      }
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        chapters: {
          include: {
            lectures: {
              select: { id: true },
            },
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Get courses error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الدورات' },
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

    // Only admins can create courses
    if (!['ADMIN', 'SUPER_ADMIN', 'CONTENT_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const body = await request.json()
    const validation = courseSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const course = await prisma.course.create({
      data: validation.data,
    })

    // Create notification for new course
    if (validation.data.isPublished) {
      const students = await prisma.user.findMany({
        where: { role: 'STUDENT', schoolYear: validation.data.grade },
      })

      await prisma.notification.createMany({
        data: students.map(student => ({
          userId: student.id,
          type: 'new_course',
          title: 'دورة جديدة',
          message: `تم إضافة دورة جديدة: ${validation.data.title}`,
        })),
      })
    }

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error('Create course error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الدورة' },
      { status: 500 }
    )
  }
}
