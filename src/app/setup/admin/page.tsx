'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Card, { CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { 
  User,
  Mail,
  Lock,
  Shield,
  AlertCircle,
  Loader2,
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles,
  Building,
  CheckCircle
} from 'lucide-react'

export default function AdminSetupPage() {
  const router = useRouter()
  const [step, setStep] = useState<'info' | 'account'>('info')
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [creating, setCreating] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!adminData.name.trim()) {
      newErrors.name = 'يرجى إدخال الاسم'
    }
    
    if (!adminData.email.trim()) {
      newErrors.email = 'يرجى إدخال البريد الإلكتروني'
    } else if (!validateEmail(adminData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح'
    }
    
    if (!adminData.password) {
      newErrors.password = 'يرجى إدخال كلمة المرور'
    } else if (!validatePassword(adminData.password)) {
      newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
    }
    
    if (adminData.password !== adminData.confirmPassword) {
      newErrors.confirmPassword = 'كلمة المرور غير متطابقة'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateAdmin = async () => {
    if (!validateForm()) return
    
    setCreating(true)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    localStorage.setItem('admin_setup', JSON.stringify({
      name: adminData.name,
      email: adminData.email,
      createdAt: Date.now()
    }))
    
    router.push('/login')
    setCreating(false)
  }

  const passwordStrength = () => {
    const password = adminData.password
    if (!password) return { strength: 0, label: '', color: '' }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    
    if (strength <= 1) return { strength: 1, label: 'ضعيفة', color: 'bg-red-500' }
    if (strength <= 2) return { strength: 2, label: 'متوسطة', color: 'bg-amber-500' }
    if (strength <= 3) return { strength: 3, label: 'جيدة', color: 'bg-emerald-500' }
    return { strength: 4, label: 'قوية', color: 'bg-emerald-600' }
  }

  const strength = passwordStrength()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/30">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">إنشاء حساب الأدمن</h1>
          <p className="text-slate-400">
            هذا الحساب سيكون له صلاحيات كاملة على المنصة
          </p>
        </div>

        {step === 'info' && (
          <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-start gap-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Building className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">⚠️ ملاحظة مهمة</h3>
                  <p className="text-sm text-slate-300">
                    هذا هو أول حساب يُنشأ في المنصة، لذلك سيكون له صلاحيات الأدمن الكاملة.
                    تأكد من استخدام بريد إلكتروني حقيقي وكلمة مرور قوية.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span>إدارة جميع المستخدمين</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span>إنشاء وتعديل الكورسات والمحاضرات</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span>إدارة الإعدادات والاشتراكات</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span>عرض التقارير والإحصائيات</span>
                </div>
              </div>

              <Button onClick={() => setStep('account')} className="w-full h-12">
                ابدأ إنشاء الحساب
                <ChevronRight className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'account' && (
          <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CardContent className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  الاسم
                </label>
                <Input
                  value={adminData.name}
                  onChange={(e) => setAdminData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="أدخل اسمك الكامل"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  البريد الإلكتروني
                </label>
                <Input
                  type="email"
                  value={adminData.email}
                  onChange={(e) => setAdminData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="example@domain.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  كلمة المرور
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={adminData.password}
                    onChange={(e) => setAdminData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="8 أحرف على الأقل"
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {adminData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all ${strength.color}`}
                          style={{ width: `${strength.strength * 25}%` }}
                        />
                      </div>
                      <span className={`text-xs ${
                        strength.strength <= 1 ? 'text-red-400' : 
                        strength.strength <= 2 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {strength.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">يجب أن تحتوي على: 8 أحرف، حرف كبير، رقم، رمز خاص</p>
                  </div>
                )}
                
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  تأكيد كلمة المرور
                </label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={adminData.confirmPassword}
                  onChange={(e) => setAdminData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="أعد إدخال كلمة المرور"
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button 
                onClick={handleCreateAdmin} 
                disabled={creating}
                className="w-full h-12"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري إنشاء حساب الأدمن...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    إنشاء حساب الأدمن
                  </>
                )}
              </Button>

              <button
                onClick={() => setStep('info')}
                className="w-full text-sm text-slate-400 hover:text-white text-center"
              >
                ← العودة للمعلومات
              </button>
            </CardContent>
          </Card>
        )}

        <p className="text-center text-slate-500 text-sm mt-6">
          © 2026 GELVANO Education Platform
        </p>
      </div>
    </div>
  )
}