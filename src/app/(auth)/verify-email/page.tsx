'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Card, { CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { 
  CheckCircle,
  XCircle,
  Mail,
  Loader2,
  ArrowRight,
  AlertCircle,
  Shield,
  Sparkles
} from 'lucide-react'

function VerifyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(5)

  const token = searchParams.get('token')
  const email = searchParams.get('email')
  const errorParam = searchParams.get('error')
  const successParam = searchParams.get('success')

  useEffect(() => {
    // Check URL parameters
    if (errorParam === 'invalid_token') {
      setStatus('error')
      setError('رابط التأكيد غير صالح أو منتهي الصلاحية')
      return
    }
    
    if (errorParam === 'server_error') {
      setStatus('error')
      setError('حدث خطأ أثناء تأكيد البريد الإلكتروني')
      return
    }

    if (successParam === 'true') {
      setStatus('success')
      // Start countdown
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            router.push('/login')
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return
    }

    // If we have a token, verify it
    if (token && email) {
      verifyEmail()
    } else {
      setStatus('error')
      setError('رابط التأكيد غير صالح')
    }
  }, [token, email, errorParam, successParam])

  const verifyEmail = async () => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token })
      })

      const data = await response.json()

      if (data.success) {
        setStatus('success')
        // Start countdown
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer)
              router.push('/login')
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        setStatus('error')
        setError(data.error || 'فشل تأكيد البريد الإلكتروني')
      }
    } catch (err) {
      setStatus('error')
      setError('حدث خطأ أثناء الاتصال بالخادم')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4">
            <img 
              src="/images/logo.png" 
              alt="GELVANO" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.parentElement!.innerHTML = `
                  <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto">
                    <span class="text-3xl font-bold text-white">G</span>
                  </div>
                `
              }}
            />
          </div>
          <h1 className="text-2xl font-bold mb-2">تأكيد البريد الإلكتروني</h1>
          <p className="text-slate-400">منصة GELVANO التعليمية</p>
        </div>

        <Card>
          <CardContent className="p-8">
            {status === 'loading' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <h2 className="text-xl font-bold mb-2">جاري التأكيد...</h2>
                <p className="text-slate-400">يرجى الانتظار</p>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold mb-2 text-emerald-400">تم تأكيد البريد الإلكتروني!</h2>
                <p className="text-slate-400 mb-6">
                  تهانينا! تم تأكيد بريدك الإلكتروني بنجاح.
                </p>
                
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-6">
                  <div className="flex items-center gap-2 text-emerald-400 mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-medium">مرحباً بك في GELVANO!</span>
                  </div>
                  <p className="text-sm text-slate-400">
                    يمكنك الآن تسجيل الدخول والاستمتاع بخدماتنا التعليمية
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mb-6">
                  <span>سيتم التحويل خلال</span>
                  <span className="font-bold text-primary">{countdown}</span>
                  <span>ثانية</span>
                </div>

                <Link href="/login">
                  <Button className="w-full">
                    تسجيل الدخول الآن
                    <ArrowRight className="w-4 h-4 mr-2" />
                  </Button>
                </Link>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="text-xl font-bold mb-2 text-red-400">فشل التأكيد</h2>
                <p className="text-slate-400 mb-6">
                  {error || 'حدث خطأ أثناء تأكيد البريد الإلكتروني'}
                </p>

                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-6">
                  <div className="flex items-center gap-2 text-amber-400 mb-2">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">السبب المحتمل</span>
                  </div>
                  <ul className="text-sm text-slate-400 text-right space-y-1">
                    <li>• الرابط منتهي الصلاحية</li>
                    <li>• تم استخدام الرابط من قبل</li>
                    <li>• البريد الإلكتروني غير صحيح</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <Link href="/register">
                    <Button className="w-full">
                      <Mail className="w-4 h-4 ml-2" />
                      إعادة التسجيل
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" className="w-full">
                      العودة لتسجيل الدخول
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-slate-800/50 rounded-xl">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>تأمين حسابك أمر مهم! استخدم كلمة مرور قوية</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-slate-400">جاري التحميل...</p>
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}