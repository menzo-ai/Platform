'use client'

import { useState } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Input from '@/components/ui/input'
import { 
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Shield,
  CreditCard,
  History,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Clock,
  Download
} from 'lucide-react'

interface Subscription {
  id: string
  courseName: string
  status: 'active' | 'pending' | 'failed' | 'cancelled'
  amount: number
  date: string
  paymentMethod: string
}

interface UserInfo {
  id: string
  name: string
  email: string
  phone: string
  parentPhone: string
  studentId: string
  schoolYear: number
  grade: string
  profileImage: string
  joinedAt: string
  isVerified: boolean
  isBanned: boolean
}

const mockUser: UserInfo = {
  id: 'usr_abc123xyz',
  name: 'أحمد محمد علي',
  email: 'ahmed.mohamed@email.com',
  phone: '01012345678',
  parentPhone: '01123456789',
  studentId: 'GEL2024001',
  schoolYear: 1,
  grade: 'الصف الأول الثانوي',
  profileImage: '',
  joinedAt: '2024-01-15',
  isVerified: true,
  isBanned: false
}

const mockSubscriptions: Subscription[] = [
  { id: '1', courseName: 'الفيزياء - قوانين نيوتن', status: 'active', amount: 500, date: '2024-01-15', paymentMethod: 'محفظة' },
  { id: '2', courseName: 'الميكانيكا', status: 'active', amount: 350, date: '2024-01-10', paymentMethod: 'Paymob' },
  { id: '3', courseName: 'الكهرباء', status: 'failed', amount: 400, date: '2024-01-08', paymentMethod: 'Fawry' },
  { id: '4', courseName: 'الحرارة', status: 'pending', amount: 300, date: '2024-01-20', paymentMethod: 'محفظة' },
  { id: '5', courseName: 'البصريات', status: 'cancelled', amount: 450, date: '2024-01-05', paymentMethod: 'Paymob' },
]

export default function AccountPage() {
  const [user] = useState<UserInfo>(mockUser)
  const [activeTab, setActiveTab] = useState<'info' | 'subscriptions' | 'security'>('info')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const getStatusBadge = (status: Subscription['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="success"><CheckCircle className="w-3 h-3 ml-1" />نشط</Badge>
      case 'pending':
        return <Badge variant="warning"><Clock className="w-3 h-3 ml-1" />قيد الانتظار</Badge>
      case 'failed':
        return <Badge variant="danger"><XCircle className="w-3 h-3 ml-1" />فاشل</Badge>
      case 'cancelled':
        return <Badge variant="info"><XCircle className="w-3 h-3 ml-1" />ملغي</Badge>
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('كلمات المرور غير متطابقة')
      return
    }
    if (newPassword.length < 8) {
      alert('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
      return
    }
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    setShowPasswordModal(false)
    alert('تم تغيير كلمة المرور بنجاح')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">حسابي</h1>
        <Button variant="outline" onClick={() => setShowPasswordModal(true)}>
          <Lock className="w-4 h-4" />
          تغيير كلمة المرور
        </Button>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-white">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                {user.isVerified && (
                  <Badge variant="success"><CheckCircle className="w-3 h-3 ml-1" />موثق</Badge>
                )}
                {user.isBanned && (
                  <Badge variant="danger"><XCircle className="w-3 h-3 ml-1" />محظور</Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" />
                  {user.grade}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  انضم: {user.joinedAt}
                </span>
              </div>
            </div>
            <div className="text-left">
              <p className="text-sm text-slate-400">رقم الطالب</p>
              <p className="text-xl font-mono font-bold">{user.studentId}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700 pb-2">
        {[
          { id: 'info', label: 'المعلومات الشخصية', icon: User },
          { id: 'subscriptions', label: 'الاشتراكات', icon: CreditCard },
          { id: 'security', label: 'الأمان', icon: Shield },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
              activeTab === tab.id 
                ? 'bg-primary/20 text-primary border-b-2 border-primary' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Info Tab */}
      {activeTab === 'info' && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                المعلومات الأساسية
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-400">الاسم</span>
                </div>
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-400">البريد الإلكتروني</span>
                </div>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-400">رقم الهاتف</span>
                </div>
                <span className="font-medium">{user.phone}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-400">رقم ولى الأمر</span>
                </div>
                <span className="font-medium">{user.parentPhone}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-bold flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                المعلومات الدراسية
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-400">الصف</span>
                </div>
                <span className="font-medium">{user.grade}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-400">السنة الدراسية</span>
                </div>
                <span className="font-medium">السنة {user.schoolYear}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <History className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-400">تاريخ التسجيل</span>
                </div>
                <span className="font-medium">{user.joinedAt}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-400">حالة الحساب</span>
                </div>
                {user.isVerified ? (
                  <Badge variant="success"><CheckCircle className="w-3 h-3 ml-1" />موثق</Badge>
                ) : (
                  <Badge variant="warning"><Clock className="w-3 h-3 ml-1" />غير موثق</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Subscriptions Tab */}
      {activeTab === 'subscriptions' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                الاشتراكات والدفع
              </h3>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
                تصدير
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="p-4 text-right text-sm font-medium text-slate-400">الكورس</th>
                    <th className="p-4 text-right text-sm font-medium text-slate-400">المبلغ</th>
                    <th className="p-4 text-right text-sm font-medium text-slate-400">طريقة الدفع</th>
                    <th className="p-4 text-right text-sm font-medium text-slate-400">التاريخ</th>
                    <th className="p-4 text-right text-sm font-medium text-slate-400">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {mockSubscriptions.map(sub => (
                    <tr key={sub.id} className="hover:bg-slate-800/30">
                      <td className="p-4 font-medium">{sub.courseName}</td>
                      <td className="p-4 text-emerald-400 font-bold">{sub.amount} ج.م</td>
                      <td className="p-4 text-slate-400">{sub.paymentMethod}</td>
                      <td className="p-4 text-slate-400">{sub.date}</td>
                      <td className="p-4">{getStatusBadge(sub.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="p-4 border-t border-slate-700 grid grid-cols-3 gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg text-center">
                <p className="text-2xl font-bold text-emerald-400">2</p>
                <p className="text-xs text-slate-400">نشط</p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-lg text-center">
                <p className="text-2xl font-bold text-amber-400">1</p>
                <p className="text-xs text-slate-400">قيد الانتظار</p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-400">2</p>
                <p className="text-xs text-slate-400">فاشل/ملغي</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card>
          <CardHeader>
            <h3 className="font-bold flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              الأمان
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-slate-400" />
                <div>
                  <p className="font-medium">كلمة المرور</p>
                  <p className="text-sm text-slate-400">آخر تغيير: منذ شهر</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowPasswordModal(true)}>
                تغيير
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-slate-400" />
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-emerald-400">البريد موثق</p>
                </div>
              </div>
              <Badge variant="success"><CheckCircle className="w-3 h-3 ml-1" />موثق</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-slate-400" />
                <div>
                  <p className="font-medium">جلسة الدخول</p>
                  <p className="text-sm text-slate-400">الجهاز الحالي - Cairo, Egypt</p>
                </div>
              </div>
              <Badge variant="success"><CheckCircle className="w-3 h-3 ml-1" />نشط</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h3 className="font-bold">تغيير كلمة المرور</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  label="كلمة المرور الحالية"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  label="كلمة المرور الجديدة"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  label="تأكيد كلمة المرور"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="showPassword" className="text-sm text-slate-400">
                  إظهار كلمات المرور
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowPasswordModal(false)}
                >
                  إلغاء
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleChangePassword}
                  isLoading={isLoading}
                >
                  تغيير
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}