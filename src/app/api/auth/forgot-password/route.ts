import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { forgotPasswordSchema } from '@/lib/validations'
import { generateOTP } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validation = forgotPasswordSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email } = validation.data

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal that user doesn't exist
      return NextResponse.json({
        message: 'إذا كان البريد الإلكتروني مسجلاً، ستصلك رسالة لاستعادة كلمة المرور',
      })
    }

    // Generate reset token
    const resetToken = generateOTP()
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetExpiry,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'PASSWORD_RESET_REQUEST',
      },
    })

    // In production, send email
    console.log(`Password reset token for ${email}: ${resetToken}`)

    return NextResponse.json({
      message: 'إذا كان البريد الإلكتروني مسجلاً، ستصلك رسالة لاستعادة كلمة المرور',
      email,
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء العملية' },
      { status: 500 }
    )
  }
}
