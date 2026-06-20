'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/button'
import { GraduationCap, Mail, Lock, ArrowRight, Timer } from 'lucide-react'

function VerifyOTPContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }

    // Auto-submit when complete
    if (newOtp.every(d => d) && newOtp.join('').length === 6) {
      handleVerify(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (/^\d{1,6}$/.test(pastedData)) {
      const newOtp = [...otp]
      pastedData.split('').forEach((char, i) => {
        newOtp[i] = char
      })
      setOtp(newOtp)
      if (pastedData.length === 6) {
        handleVerify(pastedData)
      }
    }
  }

  const handleVerify = async (code?: string) => {
    const otpCode = code || otp.join('')
    if (otpCode.length !== 6) {
      setError('يرجى إدخال كود التحقق المكون من 6 أرقام')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error)
        return
      }

      setMessage(result.message)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err) {
      setError('حدث خطأ أثناء التحقق')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setResendCooldown(60)
        setMessage('تم إرسال كود جديد')
      }
    } catch (err) {
      setError('فشل في إعادة إرسال الكود')
    }
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-dark p-4">
        <div className="text-center">
          <p className="text-slate-400 mb-4">البريد الإلكتروني مطلوب</p>
          <Link href="/register" className="text-primary hover:text-primary-light">
            العودة للتسجيل
          </Link>
        </div>
      </div>
    )
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
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">التحقق من البريد الإلكتروني</h1>
            <p className="text-slate-400">
              تم إرسال كود التحقق إلى
              <br />
              <span className="text-primary font-medium">{email}</span>
            </p>
          </div>

          {message && (
            <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div className="mb-8" onPaste={handlePaste}>
            <div className="flex justify-center gap-3" dir="ltr">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              ))}
            </div>
          </div>

          <Button
            onClick={() => handleVerify()}
            className="w-full"
            size="lg"
            isLoading={isLoading}
            disabled={otp.join('').length !== 6}
          >
            تحقق من الكود
            <ArrowRight className="w-4 h-4" />
          </Button>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm mb-3">
              لم تستلم الكود؟
            </p>
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className="text-primary hover:text-primary-light disabled:text-slate-500 disabled:cursor-not-allowed transition-colors flex items-center gap-2 mx-auto"
            >
              {resendCooldown > 0 ? (
                <>
                  <Timer className="w-4 h-4" />
                  إعادة الإرسال ({resendCooldown}s)
                </>
              ) : (
                'إعادة إرسال الكود'
              )}
            </button>
          </div>
        </div>

        <Link
          href="/login"
          className="block text-center mt-6 text-slate-400 hover:text-white transition-colors"
        >
          العودة لتسجيل الدخول
        </Link>
      </div>
    </div>
  )
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  )
}
