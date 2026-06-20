'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegisterInput } from '@/lib/validations'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, Phone, UserCircle, BookOpen } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [canRegister, setCanRegister] = useState(true)
  const [registrationType, setRegistrationType] = useState<'admin' | 'student'>('student')
  
  // Additional fields
  const [phone, setPhone] = useState('')
  const [parentName, setParentName] = useState('')
  const [parentPhone, setParentPhone] = useState('')
  const [schoolYear, setSchoolYear] = useState<number>(1)
  const [isAzhar, setIsAzhar] = useState(false)

  useEffect(() => {
    fetch('/api/auth/register')
      .then(res => res.json())
      .then(data => {
        setCanRegister(data.canRegister)
        if (data.canRegister) {
          setRegistrationType('admin')
        }
      })
      .catch(() => {})
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          phone,
          parentName,
          parentPhone,
          schoolYear,
          isAzhar
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error)
        return
      }

      if (result.requiresVerification) {
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('حدث خطأ أثناء التسجيل')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background-dark via-slate-900 to-slate-800 p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center glow-primary">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-gradient">GELVANO</span>
          </div>
        </div>

        {/* Register Card */}
        <div className="card p-8 animate-fade-in">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">
              {registrationType === 'admin' ? 'إنشاء حساب مدير' : 'إنشاء حساب جديد'}
            </h1>
            <p className="text-slate-400">
              {registrationType === 'admin' 
                ? 'أنشئ أول حساب مدير للنظام' 
                : 'سجل الآن وابدأ رحلتك التعليمية'}
            </p>
          </div>

          {registrationType === 'admin' && (
            <div className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-200">
                هذا أول حساب يتم إنشاؤه، سيتم تعيينك كمدير عام للنظام.
                بعد ذلك، سيكون التسجيل للطلاب فقط.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            {/* Basic Info */}
            <div className="relative">
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                {...register('name')}
                type="text"
                placeholder="الاسم الكامل"
                className="pr-12"
                error={errors.name?.message}
              />
            </div>

            <div className="relative">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                {...register('email')}
                type="email"
                placeholder="البريد الإلكتروني"
                className="pr-12"
                error={errors.email?.message}
              />
            </div>

            <div className="relative">
              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                type="tel"
                placeholder="رقم الهاتف"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pr-12"
              />
            </div>

            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="كلمة المرور"
                className="pr-12"
                error={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                {...register('confirmPassword')}
                type={showPassword ? 'text' : 'password'}
                placeholder="تأكيد كلمة المرور"
                className="pr-12"
                error={errors.confirmPassword?.message}
              />
            </div>

            {/* Password requirements */}
            <div className="text-xs text-slate-500 space-y-1">
              <p className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-slate-600" />
                8 أحرف على الأقل
              </p>
              <p className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-slate-600" />
                حرف كبير واحد على الأقل
              </p>
              <p className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-slate-600" />
                رقم واحد على الأقل
              </p>
            </div>

            {/* Student-specific fields */}
            {registrationType === 'student' && (
              <>
                <div className="border-t border-slate-700 pt-5">
                  <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
                    <UserCircle className="w-4 h-4" />
                    معلومات إضافية للطالب
                  </h3>

                  {/* School Year */}
                  <div className="mb-4">
                    <label className="block text-sm text-slate-400 mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      الصف الدراسي
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 1, label: 'الصف الأول' },
                        { value: 2, label: 'الصف الثاني' },
                        { value: 3, label: 'الصف الثالث' },
                      ].map((year) => (
                        <button
                          key={year.value}
                          type="button"
                          onClick={() => setSchoolYear(year.value)}
                          className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                            schoolYear === year.value
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          {year.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Azhar or General */}
                  <div className="mb-4">
                    <label className="block text-sm text-slate-400 mb-2">
                      نوع التعليم
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAzhar(false)}
                        className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                          !isAzhar
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        عام
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAzhar(true)}
                        className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                          isAzhar
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        أزهر
                      </button>
                    </div>
                  </div>

                  {/* Parent Info */}
                  <div className="space-y-4">
                    <div className="relative">
                      <UserCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <Input
                        type="text"
                        placeholder="اسم ولى الأمر"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        className="pr-12"
                      />
                    </div>

                    <div className="relative">
                      <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <Input
                        type="tel"
                        placeholder="رقم هاتف ولى الأمر"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        className="pr-12"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              {registrationType === 'admin' ? 'إنشاء حساب المدير' : 'إنشاء الحساب'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            <span>لديك حساب بالفعل؟</span>
            <Link
              href="/login"
              className="text-primary hover:text-primary-light mr-1 transition-colors font-medium"
            >
              سجل دخولك
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Developed by Mohamed El-Manzalawy
        </p>
      </div>
    </div>
  )
}
