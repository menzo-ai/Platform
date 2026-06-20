import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// Registration schema
const registerSchema = z.object({
  name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z
    .string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .regex(/[A-Z]/, 'كلمة المرور يجب أن تحتوي على حرف كبير')
    .regex(/[0-9]/, 'كلمة المرور يجب أن تحتوي على رقم'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  schoolYear: z.number().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { name, email, password, phone, parentName, parentPhone, schoolYear } = validation.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مسجل بالفعل' },
        { status: 400 }
      )
    }

    // Check if this is the first registration (becomes admin)
    const userCount = await prisma.user.count()
    const isFirstUser = userCount === 0
    const role = isFirstUser ? 'SUPER_ADMIN' : 'STUDENT'

    // Generate student ID for students
    let studentId: string | null = null
    if (!isFirstUser) {
      const lastUser = await prisma.user.findFirst({
        where: { studentId: { not: null } },
        orderBy: { createdAt: 'desc' },
      })
      const lastId = lastUser?.studentId ? parseInt(lastUser.studentId.replace(/\D/g, '')) : 0
      studentId = `STU${String(lastId + 1).padStart(6, '0')}`
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        phone: phone || null,
        parentName: parentName || null,
        parentPhone: parentPhone || null,
        schoolYear: schoolYear || 1,
        studentId,
        isVerified: isFirstUser, // Auto-verify first admin
      },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'REGISTER',
        details: JSON.stringify({ method: 'email', role }),
      },
    })

    return NextResponse.json({
      message: isFirstUser
        ? 'تم إنشاء حسابك بنجاح!'
        : 'تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول.',
      userId: user.id,
      email,
      isAdmin: isFirstUser
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: error.message || 'فشل التسجيل' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const userCount = await prisma.user.count()
    const canRegister = userCount === 0
    
    return NextResponse.json({
      canRegister,
      message: canRegister
        ? 'أول حساب - سيكون أدمن'
        : 'يمكن للطلاب التسجيل'
    })
  } catch {
    return NextResponse.json({
      canRegister: true,
      message: 'النظام جاهز للتسجيل'
    })
  }
}
