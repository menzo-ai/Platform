import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateOTP } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    if (user.isVerified) {
      return NextResponse.json(
        { success: true, message: 'الحساب مفعل مسبقاً' },
        { status: 200 }
      )
    }

    // Generate new OTP
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: otp,
        otpExpiry,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'SEND_VERIFICATION',
      },
    })

    // In production, send email with the OTP
    console.log(`Verification OTP for ${email}: ${otp}`)

    return NextResponse.json({
      success: true,
      message: 'تم إرسال كود التحقق',
      // For development, return the OTP
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    })
  } catch (error: any) {
    console.error('Send verification error:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء إرسال كود التحقق' },
      { status: 500 }
    )
  }
}
