import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { courseSchema } from '@/lib/validations'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        chapters: {
          include: {
            lectures: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'الدورة غير موجودة' },
        { status: 404 }
      )
    }

    // Check if user has access
    const session = await getServerSession(authOptions)
    let enrollment = null
    let subscription = null

    if (session) {
      enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId: params.id,
          },
        },
      })

      if (session.user.role === 'STUDENT') {
        subscription = await prisma.subscription.findUnique({
          where: { userId: session.user.id },
        })
      }
    }

    return NextResponse.json({
      ...course,
      enrollment,
      subscription,
      hasAccess: enrollment !== null || course.price === 0,
    })
  } catch (error) {
    console.error('Get course error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الدورة' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

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

    const course = await prisma.course.update({
      where: { id: params.id },
      data: validation.data,
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Update course error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث الدورة' },
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

    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    await prisma.course.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'تم حذف الدورة' })
  } catch (error) {
    console.error('Delete course error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف الدورة' },
      { status: 500 }
    )
  }
}
