'use client'

import { useState } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { 
  Mail,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Key,
  Server,
  Lock
} from 'lucide-react'
import toast from 'react-hot-toast'

interface EmailSettings {
  enabled: boolean
  host: string
  port: string
  secure: boolean
  user: string
  password: string
  fromEmail: string
  fromName: string
}

export default function EmailSettingsPage() {
  const [settings, setSettings] = useState<EmailSettings>({
    enabled: false,
    host: '',
    port: '587',
    secure: false,
    user: '',
    password: '',
    fromEmail: '',
    fromName: 'GELVANO'
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [testing, setTesting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/email-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      
      if (response.ok) {
        toast.success('تم حفظ إعدادات البريد الإلكتروني بنجاح!')
      } else {
        throw new Error('Save failed')
      }
    } catch (error) {
      toast.error('حدث خطأ في الحفظ')
    }
    setSaving(false)
  }

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)
    
    try {
      const response = await fetch('/api/admin/email-settings/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        setTestResult({ success: true, message: 'تم إرسال رسالة اختبار بنجاح!' })
        toast.success('تم إرسال رسالة الاختبار!')
      } else {
        setTestResult({ success: false, message: data.message || 'فشل إرسال الرسالة' })
        toast.error('فشل إرسال رسالة الاختبار')
      }
    } catch (error) {
      setTestResult({ success: false, message: 'حدث خطأ في الاتصال' })
      toast.error('حدث خطأ في الاتصال')
    }
    
    setTesting(false)
  }

  const updateSetting = (key: keyof EmailSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Mail className="w-7 h-7 text-primary" />
          إعدادات البريد الإلكتروني
        </h1>
        <p className="text-slate-400 mt-1">إدارة إرسال رسائل البريد الإلكتروني للتحقق من الحسابات</p>
      </div>

      {/* Enable Toggle */}
      <Card className={settings.enabled ? 'border-emerald-500/30' : ''}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                settings.enabled ? 'bg-emerald-500/20' : 'bg-slate-700'
              }`}>
                <Mail className={`w-7 h-7 ${settings.enabled ? 'text-emerald-400' : 'text-slate-400'}`} />
              </div>
              <div>
                <h3 className="font-bold text-lg">تفعيل التحقق من البريد</h3>
                <p className="text-sm text-slate-400">
                  {settings.enabled 
                    ? 'سيتم إرسال رموز تحقق عند التسجيل' 
                    : 'لن يتم إرسال رسائل تحقق'}
                </p>
              </div>
            </div>
            <button
              onClick={() => updateSetting('enabled', !settings.enabled)}
              className={`w-14 h-8 rounded-full transition-all relative ${
                settings.enabled ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            >
              <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${
                settings.enabled ? 'left-7' : 'left-1'
              }`} />
            </button>
          </div>
        </CardContent>
      </Card>

      {settings.enabled && (
        <>
          {/* SMTP Settings */}
          <Card>
            <CardHeader>
              <h3 className="font-bold flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                إعدادات SMTP
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">خادم SMTP</label>
                  <Input
                    value={settings.host}
                    onChange={(e) => updateSetting('host', e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">المنفذ (Port)</label>
                  <Input
                    value={settings.port}
                    onChange={(e) => updateSetting('port', e.target.value)}
                    placeholder="587"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">اسم المستخدم</label>
                  <Input
                    value={settings.user}
                    onChange={(e) => updateSetting('user', e.target.value)}
                    placeholder="example@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">كلمة المرور / App Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={settings.password}
                      onChange={(e) => updateSetting('password', e.target.value)}
                      placeholder="أدخل كلمة المرور أو App Password"
                      className="pl-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    ملاحظة: Gmail يتطلب App Password وليس كلمة المرور العادية
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="secure"
                  checked={settings.secure}
                  onChange={(e) => updateSetting('secure', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-primary focus:ring-primary"
                />
                <label htmlFor="secure" className="text-sm font-medium">
                  استخدام TLS/SSL (المنفذ 465)
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Email Sender Info */}
          <Card>
            <CardHeader>
              <h3 className="font-bold flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                معلومات المرسل
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">بريد المرسل</label>
                  <Input
                    type="email"
                    value={settings.fromEmail}
                    onChange={(e) => updateSetting('fromEmail', e.target.value)}
                    placeholder="noreply@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">اسم المرسل</label>
                  <Input
                    value={settings.fromName}
                    onChange={(e) => updateSetting('fromName', e.target.value)}
                    placeholder="GELVANO"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">رسالة التحقق من البريد</h4>
                    <p className="text-sm text-slate-400 mb-2">
                      الرسالة المرسلة للمستخدم عند التسجيل:
                    </p>
                    <div className="p-3 bg-slate-900/50 rounded-lg text-sm">
                      <p className="text-primary font-medium">الموضوع: رمز التحقق من البريد الإلكتروني</p>
                      <p className="text-slate-300 mt-2 whitespace-pre-line">
{`عزيزي [اسم المستخدم]،

تم إرسال هذا الرمز للتحقق من بريدك الإلكتروني:

[CODE]

هذا الرمز صالح لمدة 10 دقائق.

مع تحيات,
${settings.fromName}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Result */}
          {testResult && (
            <div className={`p-4 rounded-xl ${
              testResult.success 
                ? 'bg-emerald-500/10 border border-emerald-500/30' 
                : 'bg-red-500/10 border border-red-500/30'
            }`}>
              <div className="flex items-center gap-2">
                {testResult.success ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                <span>{testResult.message}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleTest}
              disabled={testing || !settings.host || !settings.user}
              className="flex-1"
            >
              {testing ? (
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 ml-2" />
              )}
              إرسال رسالة اختبار
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-primary"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              ) : (
                <Server className="w-4 h-4 ml-2" />
              )}
              حفظ الإعدادات
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
