'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema, ForgotPasswordInput } from '@/lib/validations'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { GraduationCap, Mail, ArrowRight, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [email, setEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error)
        return
      }

      setEmail(data.email)
      setIsSuccess(true)
    } catch (err) {
      setError('حدث خطأ أثناء العملية')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background-dark via-slate-900 to-slate-800 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center glow-primary">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-gradient">GELVANO</span>
          </div>
        </div>

        <div className="card p-8 animate-fade-in">
          {!isSuccess ? (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">نسيت كلمة المرور؟</h1>
                <p className="text-slate-400">
                  لا تقلق! أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {error && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

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

                <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                  إرسال رابط الاستعادة
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h1 className="text-2xl font-bold mb-2">تم الإرسال!</h1>
              <p className="text-slate-400 mb-6">
                إذا كان البريد الإلكتروني <span className="text-primary">{email}</span> مسجلاً لدينا،
                ستصلك رسالة تحتوي على رابط إعادة تعيين كلمة المرور.
              </p>
              <p className="text-slate-500 text-sm mb-6">
                تحقق من بريدك الإلكتروني واتبع التعليمات.
              </p>
              <Button onClick={() => router.push('/login')} className="w-full" size="lg">
                العودة لتسجيل الدخول
              </Button>
            </div>
          )}
        </div>

        <Link
          href="/login"
          className="block text-center mt-6 text-slate-400 hover:text-white transition-colors"
        >
          تذكرت كلمة المرور؟ سجل دخولك
        </Link>
      </div>
    </div>
  )
}
