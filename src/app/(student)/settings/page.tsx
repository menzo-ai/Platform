'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Badge from '@/components/ui/badge'
import Modal from '@/components/ui/modal'
import { User, Lock, Bell, Moon, Sun, Globe, Shield, Trash2, Save, Check } from 'lucide-react'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    newLecture: true,
    examResult: true,
    subscription: true,
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">الإعدادات</h1>
          <p className="text-slate-400">إدارة حسابك وتفضيلاتك</p>
        </div>
        <Button onClick={handleSave} isLoading={isSaving}>
          {saved ? <><Check className="w-4 h-4" /> تم الحفظ</> : <><Save className="w-4 h-4" /> حفظ التغييرات</>}
        </Button>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center gap-2"><User className="w-5 h-5 text-primary" /> معلومات الحساب</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="الاسم" defaultValue={session?.user?.name || ''} placeholder="اسمك الكامل" />
            <Input label="البريد الإلكتروني" type="email" defaultValue={session?.user?.email || ''} disabled />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="رقم الهاتف" placeholder="01xxxxxxxxx" />
            <div><label className="label">الصف الدراسي</label><Badge variant="primary">الصف الأول الثانوي</Badge></div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center gap-2"><Shield className="w-5 h-5 text-secondary" /> الأمان</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
            <div><p className="font-medium">كلمة المرور</p><p className="text-sm text-slate-400">تغيير كلمة المرور الخاصة بك</p></div>
            <Button variant="outline" size="sm"><Lock className="w-4 h-4" /> تغيير</Button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
            <div><p className="font-medium">تأكيد البريد الإلكتروني</p><p className="text-sm text-slate-400">تم التأكد من {session?.user?.email}</p></div>
            <Badge variant="success">موثق</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center gap-2"><Bell className="w-5 h-5 text-accent" /> الإشعارات</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'newLecture', title: 'محاضرات جديدة', desc: 'عند إضافة محاضرات جديدة للدورات' },
            { key: 'examResult', title: 'نتائج الاختبارات', desc: 'إشعار عند صدور نتيجة أي اختبار' },
            { key: 'subscription', title: 'تحديثات الاشتراك', desc: 'تجديد وتذكير قبل انتهائه' },
          ].map(item => (
            <label key={item.key} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 cursor-pointer hover:bg-slate-800 transition-colors">
              <div><p className="font-medium">{item.title}</p><p className="text-sm text-slate-400">{item.desc}</p></div>
              <input
                type="checkbox"
                checked={notifications[item.key as keyof typeof notifications]}
                onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                className="w-5 h-5 rounded accent-primary"
              />
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center gap-2"><Moon className="w-5 h-5 text-primary" /> المظهر</h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <button onClick={() => setTheme('dark')} className={`flex-1 p-4 rounded-lg border-2 transition-colors ${theme === 'dark' ? 'border-primary bg-primary/10' : 'border-slate-700 hover:border-slate-600'}`}>
              <Moon className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p className="font-medium text-center">داكن</p>
            </button>
            <button onClick={() => setTheme('light')} className={`flex-1 p-4 rounded-lg border-2 transition-colors ${theme === 'light' ? 'border-primary bg-primary/10' : 'border-slate-700 hover:border-slate-600'}`}>
              <Sun className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p className="font-medium text-center">فاتح</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/20">
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center gap-2 text-red-400"><Trash2 className="w-5 h-5" /> منطقة الخطر</h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <div><p className="font-medium">حذف الحساب</p><p className="text-sm text-slate-400">حذف حسابك نهائياً</p></div>
            <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>حذف الحساب</Button>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="حذف الحساب" size="sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-red-400"><Trash2 className="w-6 h-6" /><span className="font-medium">تحذير!</span></div>
          <p className="text-slate-300">هل أنت متأكد من حذف حسابك؟ هذا الإجراء <strong>لا يمكن التراجع عنه</strong>.</p>
          <div className="pt-4 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowDeleteModal(false)}>إلغاء</Button>
            <Button variant="danger" className="flex-1">نعم، احذف</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
