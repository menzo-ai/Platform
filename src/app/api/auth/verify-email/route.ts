import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    if (!token || !email) {
      return NextResponse.redirect(new URL('/verify-email?error=invalid', request.url))
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.redirect(new URL('/verify-email?error=notfound', request.url))
    }

    if (user.isVerified) {
      return NextResponse.redirect(new URL('/login?verified=true', request.url))
    }

    if (user.otpCode !== token) {
      return NextResponse.redirect(new URL('/verify-email?error=invalid', request.url))
    }

    if (user.otpExpiry && new Date() > user.otpExpiry) {
      return NextResponse.redirect(new URL('/verify-email?error=expired', request.url))
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

    return NextResponse.redirect(new URL('/verify-email?success=true', request.url))
  } catch (error: any) {
    console.error('Verification error:', error)
    return NextResponse.redirect(new URL('/verify-email?error=server', request.url))
  }
}
