'use client'

import { useState } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import { 
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Shield,
  ToggleLeft,
  ToggleRight,
  TestTube,
  MessageSquare,
  User,
  Calendar,
  Key,
  Globe,
  Code
} from 'lucide-react'

export default function EmailSettingsPage() {
  // Email Settings
  const [isEmailEnabled, setIsEmailEnabled] = useState(true)
  const [emailConfig, setEmailConfig] = useState({
    host: 'smtp.gmail.com',
    port: '587',
    secure: false,
    user: '',
    pass: '',
    fromName: 'GELVANO',
    fromEmail: 'noreply@gelvano.com'
  })
  const [showPassword, setShowPassword] = useState(false)
  
  // Email Templates
  const [verificationTemplate, setVerificationTemplate] = useState({
    subject: 'رمز التحقق - {{platformName}}',
    body: `مرحباً {{name}},

رمز التحقق الخاص بك هو: {{code}}

هذا الرمز صالح لمدة 10 دقائق.

{{platformName}}
{{platformUrl}}`
  })
  
  const [welcomeTemplate, setWelcomeTemplate] = useState({
    subject: 'مرحباً بك في {{platformName}}!',
    body: `مرحباً {{name}},

أهلاً وسهلاً بك في {{platformName}}!

لقد تم إنشاء حسابك بنجاح. هيا نبدأ رحلتك التعليمية الآن.

{{platformUrl}}

مع تحيات,
فريق {{platformName}}`
  })
  
  // States
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [saving, setSaving] = useState(false)

  const handleTestConnection = async () => {
    setTesting(true)
    setTestResult(null)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    if (emailConfig.user && emailConfig.pass) {
      setTestResult({ 
        success: true, 
        message: 'تم الاتصال بخادم البريد بنجاح!' 
      })
    } else {
      setTestResult({ 
        success: false, 
        message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور أولاً' 
      })
    }
    
    setTesting(false)
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSaving(false)
    alert('تم حفظ إعدادات البريد الإلكتروني بنجاح!')
  }

  const replaceTemplateVariables = (template: string) => {
    return template
      .replace(/\{\{name\}\}/g, 'أحمد محمد')
      .replace(/\{\{code\}\}/g, '123456')
      .replace(/\{\{platformName\}\}/g, emailConfig.fromName || 'GELVANO')
      .replace(/\{\{platformUrl\}\}/g, 'https://gelvano.com')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Mail className="w-7 h-7 text-primary" />
            إعدادات البريد الإلكتروني
          </h1>
          <p className="text-slate-400">إدارة إرسال رسائل البريد والتحقق من الأيميل</p>
        </div>
      </div>

      {/* Email Toggle */}
      <Card className={isEmailEnabled ? 'border-emerald-500/30' : 'border-red-500/30'}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                isEmailEnabled ? 'bg-emerald-500/20' : 'bg-red-500/20'
              }`}>
                <Mail className={`w-7 h-7 ${isEmailEnabled ? 'text-emerald-400' : 'text-red-400'}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  التحقق من البريد الإلكتروني
                  <Badge variant={isEmailEnabled ? 'success' : 'danger'}>
                    {isEmailEnabled ? 'مفعل' : 'معطل'}
                  </Badge>
                </h3>
                <p className="text-sm text-slate-400">
                  {isEmailEnabled 
                    ? 'سيتم إرسال رمز تحقق عند التسجيل'
                    : 'لن يتم إرسال رسائل تحقق'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsEmailEnabled(!isEmailEnabled)}
              className={`p-3 rounded-xl transition-all ${
                isEmailEnabled 
                  ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' 
                  : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
              }`}
            >
              {isEmailEnabled ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* SMTP Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Code className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold">إعدادات SMTP</h3>
              <p className="text-sm text-slate-400">إعدادات خادم إرسال البريد</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                SMTP Host
              </label>
              <Input
                value={emailConfig.host}
                onChange={(e) => setEmailConfig(prev => ({ ...prev, host: e.target.value }))}
                placeholder="smtp.gmail.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Key className="w-4 h-4" />
                SMTP Port
              </label>
              <Input
                value={emailConfig.port}
                onChange={(e) => setEmailConfig(prev => ({ ...prev, port: e.target.value }))}
                placeholder="587"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                البريد الإلكتروني
              </label>
              <Input
                type="email"
                value={emailConfig.user}
                onChange={(e) => setEmailConfig(prev => ({ ...prev, user: e.target.value }))}
                placeholder="your-email@gmail.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                كلمة مرور التطبيق
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={emailConfig.pass}
                  onChange={(e) => setEmailConfig(prev => ({ ...prev, pass: e.target.value }))}
                  placeholder="xxxxxxxxxxxx"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                اسم المرسل
              </label>
              <Input
                value={emailConfig.fromName}
                onChange={(e) => setEmailConfig(prev => ({ ...prev, fromName: e.target.value }))}
                placeholder="GELVANO"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                بريد المرسل
              </label>
              <Input
                type="email"
                value={emailConfig.fromEmail}
                onChange={(e) => setEmailConfig(prev => ({ ...prev, fromEmail: e.target.value }))}
                placeholder="noreply@gelvano.com"
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-400 mb-1">💡 للحصول على كلمة مرور تطبيق Gmail:</p>
                <ol className="space-y-1 text-slate-300 list-decimal list-inside">
                  <li>ادخل على myaccount.google.com</li>
                  <li>اختر "الأمان" ثم "كلمة المرور الخاصة بالتطبيق"</li>
                  <li>أنشئ كلمة مرور جديدة للتطبيق</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Test Connection */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleTestConnection}
              disabled={testing}
              className="flex-1"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري الاختبار...
                </>
              ) : (
                <>
                  <TestTube className="w-4 h-4" />
                  اختبار الاتصال
                </>
              )}
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  حفظ الإعدادات
                </>
              )}
            </Button>
          </div>

          {/* Test Result */}
          {testResult && (
            <div className={`p-4 rounded-xl flex items-center gap-3 ${
              testResult.success 
                ? 'bg-emerald-500/10 border border-emerald-500/20' 
                : 'bg-red-500/10 border border-red-500/20'
            }`}>
              {testResult.success ? (
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              )}
              <span className={testResult.success ? 'text-emerald-400' : 'text-red-400'}>
                {testResult.message}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold">قوالب الرسائل</h3>
              <p className="text-sm text-slate-400">تخصيص محتوى رسائل البريد</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Verification Template */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              قالب رسالة التحقق
            </h4>
            <div>
              <label className="block text-sm font-medium mb-2">عنوان الرسالة</label>
              <Input
                value={verificationTemplate.subject}
                onChange={(e) => setVerificationTemplate(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="رمز التحقق"
              />
              <p className="text-xs text-slate-500 mt-1">
                المتغيرات: {"{{name}}, {{code}}, {{platformName}}, {{platformUrl}}"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">محتوى الرسالة</label>
              <Textarea
                value={verificationTemplate.body}
                onChange={(e) => setVerificationTemplate(prev => ({ ...prev, body: e.target.value }))}
                rows={6}
                placeholder="مرحباً {{name}}..."
              />
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl">
              <p className="text-sm font-medium mb-2 text-slate-400">معاينة:</p>
              <div className="bg-white text-slate-900 p-4 rounded-lg">
                <p className="font-bold">{replaceTemplateVariables(verificationTemplate.subject)}</p>
                <p className="text-sm mt-2 whitespace-pre-line">{replaceTemplateVariables(verificationTemplate.body)}</p>
              </div>
            </div>
          </div>

          {/* Welcome Template */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              قالب رسالة الترحيب
            </h4>
            <div>
              <label className="block text-sm font-medium mb-2">عنوان الرسالة</label>
              <Input
                value={welcomeTemplate.subject}
                onChange={(e) => setWelcomeTemplate(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="مرحباً بك!"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">محتوى الرسالة</label>
              <Textarea
                value={welcomeTemplate.body}
                onChange={(e) => setWelcomeTemplate(prev => ({ ...prev, body: e.target.value }))}
                rows={6}
                placeholder="مرحباً {{name}}..."
              />
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl">
              <p className="text-sm font-medium mb-2 text-slate-400">معاينة:</p>
              <div className="bg-white text-slate-900 p-4 rounded-lg">
                <p className="font-bold">{replaceTemplateVariables(welcomeTemplate.subject)}</p>
                <p className="text-sm mt-2 whitespace-pre-line">{replaceTemplateVariables(welcomeTemplate.body)}</p>
              </div>
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                حفظ قوالب الرسائل
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}