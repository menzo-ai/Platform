'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Card, { CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { GraduationCap, Lock, Mail, Loader2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [step, setStep] = useState<'request' | 'reset'>('request')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [tokenError, setTokenError] = useState(false)

  const token = searchParams.get('token')
  const type = searchParams.get('type')

  // Check if we have a reset token
  if (token && type === 'recovery' && step === 'request') {
    setStep('reset')
  }

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email')
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (newPassword !== confirmPassword) {
      setError('كلمات المرور غير متطابقة')
      return
    }

    if (newPassword.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          newPassword,
          accessToken: token
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-gradient">GELVANO</span>
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            {step === 'request' && !success && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">نسيت كلمة المرور؟</h1>
                  <p className="text-slate-400">أدخل بريدك الإلكتروني لإرسال رابط إعادة التعيين</p>
                </div>

                {error && (
                  <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 inline ml-2" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleRequestReset} className="space-y-4">
                  <Input
                    type="email"
                    label="البريد الإلكتروني"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <Button type="submit" className="w-full" isLoading={isLoading}>
                    إرسال رابط إعادة التعيين
                    <ArrowRight className="w-4 h-4 mr-2" />
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-400">
                  <span>تذكرت كلمة المرور؟</span>
                  <Link href="/login" className="text-primary hover:underline mr-1">
                    سجل دخولك
                  </Link>
                </div>
              </>
            )}

            {step === 'request' && success && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-emerald-400">تم الإرسال!</h2>
                <p className="text-slate-400 mb-4">
                  تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني
                </p>
                <p className="text-sm text-slate-500 mb-6">
                  قد يستغرق البريد بضع دقائق. تحقق من مجلد البريد العشوائي أيضاً.
                </p>
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    العودة لتسجيل الدخول
                  </Button>
                </Link>
              </div>
            )}

            {step === 'reset' && !success && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">إنشاء كلمة مرور جديدة</h1>
                  <p className="text-slate-400">أدخل كلمة المرور الجديدة لحسابك</p>
                </div>

                {error && (
                  <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 inline ml-2" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <Input
                    type="password"
                    label="كلمة المرور الجديدة"
                    placeholder="8 أحرف على الأقل"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />

                  <Input
                    type="password"
                    label="تأكيد كلمة المرور"
                    placeholder="أعد إدخال كلمة المرور"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />

                  <Button type="submit" className="w-full" isLoading={isLoading}>
                    تغيير كلمة المرور
                    <ArrowRight className="w-4 h-4 mr-2" />
                  </Button>
                </form>
              </>
            )}

            {step === 'reset' && success && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-emerald-400">تم التغيير!</h2>
                <p className="text-slate-400 mb-6">
                  تم تغيير كلمة المرور بنجاح
                </p>
                <p className="text-sm text-slate-500 mb-6">
                  جاري التحويل لتسجيل الدخول...
                </p>
                <Link href="/login">
                  <Button className="w-full">
                    سجل دخولك الآن
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-500 mt-6">
          Developed by Mohamed El-Manzalawy
        </p>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}