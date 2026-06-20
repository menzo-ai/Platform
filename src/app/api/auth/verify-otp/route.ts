import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني والكود مطلوبان' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: 'الحساب مفعل مسبقاً' },
        { status: 200 }
      )
    }

    if (user.otpCode !== otp) {
      return NextResponse.json(
        { error: 'كود التحقق غير صحيح' },
        { status: 400 }
      )
    }

    if (user.otpExpiry && new Date() > user.otpExpiry) {
      return NextResponse.json(
        { error: 'كود التحقق منتهي الصلاحية' },
        { status: 400 }
      )
    }

    // Verify user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otpCode: null,
        otpExpiry: null,
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'VERIFY_EMAIL',
      },
    })

    return NextResponse.json({
      message: 'تم تفعيل حسابك بنجاح',
    })
  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء التحقق' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: otp,
        otpExpiry,
      },
    })

    // In production, send email
    console.log(`New OTP for ${email}: ${otp}`)

    return NextResponse.json({
      message: 'تم إرسال كود جديد',
    })
  } catch (error) {
    console.error('OTP resend error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال الكود' },
      { status: 500 }
    )
  }
}
