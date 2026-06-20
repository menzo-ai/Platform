import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { users, courses, platformSettings, aiSettings } = body

    // Import users
    if (users && Array.isArray(users)) {
      for (const user of users) {
        await prisma.user.upsert({
          where: { id: user.id },
          update: {
            email: user.email,
            name: user.name,
            phone: user.phone,
            isAzhar: user.isAzhar,
            schoolYear: user.schoolYear
          },
          create: user
        })
      }
    }

    // Import courses
    if (courses && Array.isArray(courses)) {
      for (const course of courses) {
        const { chapters, ...courseData } = course
        await prisma.course.upsert({
          where: { id: courseData.id },
          update: courseData,
          create: courseData
        })

        if (chapters) {
          for (const chapter of chapters) {
            const { lectures, ...chapterData } = chapter
            await prisma.chapter.upsert({
              where: { id: chapterData.id },
              update: chapterData,
              create: chapterData
            })

            if (lectures) {
              for (const lecture of lectures) {
                await prisma.lecture.upsert({
                  where: { id: lecture.id },
                  update: lecture,
                  create: lecture
                })
              }
            }
          }
        }
      }
    }

    // Import platform settings
    if (platformSettings) {
      await prisma.platformSettings.upsert({
        where: { id: platformSettings.id || 'default' },
        update: platformSettings,
        create: { ...platformSettings, id: 'default' }
      })
    }

    // Import AI settings
    if (aiSettings) {
      await prisma.aISettings.upsert({
        where: { id: 'default' },
        update: aiSettings,
        create: { ...aiSettings, id: 'default' }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'تم استيراد البيانات بنجاح'
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { success: false, message: 'فشل استيراد البيانات' },
      { status: 500 }
    )
  }
}
