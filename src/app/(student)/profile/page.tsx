'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Avatar from '@/components/ui/avatar'
import Badge from '@/components/ui/badge'
import { Camera, Save, Lock, User, Mail, Phone, MapPin } from 'lucide-react'

export default function ProfilePage() {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: 'student@example.com',
    phone: '01012345678',
    parentName: 'ولي الأمر',
    parentPhone: '01098765432',
  })

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">الملف الشخصي</h1>
          <p className="text-slate-400">إدارة معلوماتك الشخصية</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
            <User className="w-4 h-4" />
            تعديل الملف
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setIsEditing(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSave} isLoading={isSaving} className="gap-2">
              <Save className="w-4 h-4" />
              حفظ التغييرات
            </Button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* Avatar */}
          <div className="relative">
            <Avatar
              src={session?.user?.image}
              name={session?.user?.name || 'Student'}
              size="xl"
            />
            {isEditing && (
              <button className="absolute bottom-0 left-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary-dark transition-colors">
                <Camera className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-right">
            <h2 className="text-2xl font-bold mb-2">{session?.user?.name}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              <Badge variant="primary">طالب</Badge>
              <Badge variant="success">الصف الأول الثانوي</Badge>
              <Badge>GVN-2024-123456</Badge>
            </div>
            <p className="text-slate-400">معرف الطالب: GVN-2024-123456</p>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <User className="w-5 h-5" />
            المعلومات الشخصية
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="label">الاسم الكامل</label>
              {isEditing ? (
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              ) : (
                <p className="text-slate-300">{formData.name}</p>
              )}
            </div>

            <div>
              <label className="label">البريد الإلكتروني</label>
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              ) : (
                <p className="text-slate-300">{formData.email}</p>
              )}
            </div>

            <div>
              <label className="label">رقم الهاتف</label>
              {isEditing ? (
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              ) : (
                <p className="text-slate-300">{formData.phone}</p>
              )}
            </div>

            <div>
              <label className="label">اسم ولي الأمر</label>
              {isEditing ? (
                <Input
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                />
              ) : (
                <p className="text-slate-300">{formData.parentName}</p>
              )}
            </div>

            <div>
              <label className="label">هاتف ولي الأمر</label>
              {isEditing ? (
                <Input
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                />
              ) : (
                <p className="text-slate-300">{formData.parentPhone}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Lock className="w-5 h-5" />
            الأمان
          </h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
            <div>
              <p className="font-medium">كلمة المرور</p>
              <p className="text-sm text-slate-400">تغيير كلمة المرور الخاصة بك</p>
            </div>
            <Button variant="outline" size="sm">
              تغيير كلمة المرور
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">إحصائياتك</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-slate-800/50">
              <p className="text-3xl font-bold text-primary mb-1">12</p>
              <p className="text-sm text-slate-400">ساعات التعلم</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-800/50">
              <p className="text-3xl font-bold text-secondary mb-1">8</p>
              <p className="text-sm text-slate-400">محاضرات مكتملة</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-800/50">
              <p className="text-3xl font-bold text-accent mb-1">85%</p>
              <p className="text-sm text-slate-400">المعدل العام</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-800/50">
              <p className="text-3xl font-bold text-emerald-400 mb-1">#5</p>
              <p className="text-sm text-slate-400">الترتيب</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
