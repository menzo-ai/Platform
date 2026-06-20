'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
  Lock,
  Unlock,
  History,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Save,
  Ban
} from 'lucide-react'

interface StudentSubscription {
  id: string
  courseName: string
  status: 'active' | 'pending' | 'failed' | 'cancelled'
  amount: number
  date: string
}

interface StudentInfo {
  id: string
  name: string
  email: string
  phone: string
  parentName: string
  parentPhone: string
  studentId: string
  schoolYear: number
  grade: string
  profileImage: string
  joinedAt: string
  isVerified: boolean
  isBanned: boolean
  banReason?: string
  lastLogin: string
  loginCount: number
}

const mockStudent: StudentInfo = {
  id: 'usr_abc123xyz',
  name: 'أحمد محمد علي',
  email: 'ahmed.mohamed@email.com',
  phone: '01012345678',
  parentName: 'محمد علي',
  parentPhone: '01123456789',
  studentId: 'GEL2024001',
  schoolYear: 1,
  grade: 'الصف الأول الثانوي',
  profileImage: '',
  joinedAt: '2024-01-15',
  isVerified: true,
  isBanned: false,
  lastLogin: '2024-01-20 14:30',
  loginCount: 45
}

const mockSubscriptions: StudentSubscription[] = [
  { id: '1', courseName: 'الفيزياء - قوانين نيوتن', status: 'active', amount: 500, date: '2024-01-15' },
  { id: '2', courseName: 'الميكانيكا', status: 'active', amount: 350, date: '2024-01-10' },
  { id: '3', courseName: 'الكهرباء', status: 'failed', amount: 400, date: '2024-01-08' },
  { id: '4', courseName: 'الحرارة', status: 'pending', amount: 300, date: '2024-01-20' },
]

export default function StudentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [student, setStudent] = useState<StudentInfo>(mockStudent)
  const [isEditing, setIsEditing] = useState(false)
  const [isBanning, setIsBanning] = useState(false)
  const [banReason, setBanReason] = useState('')
  const [showBanModal, setShowBanModal] = useState(false)

  const handleSave = () => {
    setIsEditing(false)
  }

  const handleBan = () => {
    setStudent(prev => ({ ...prev, isBanned: true, banReason }))
    setShowBanModal(false)
  }

  const handleUnban = () => {
    setStudent(prev => ({ ...prev, isBanned: false, banReason: undefined }))
  }

  const getStatusBadge = (status: StudentSubscription['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="primary"><CheckCircle className="w-3 h-3 ml-1" />نشط</Badge>
      case 'pending':
        return <Badge variant="warning"><Clock className="w-3 h-3 ml-1" />قيد الانتظار</Badge>
      case 'failed':
        return <Badge variant="danger"><XCircle className="w-3 h-3 ml-1" />فاشل</Badge>
      case 'cancelled':
        return <Badge variant="info"><XCircle className="w-3 h-3 ml-1" />ملغي</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-800 rounded-lg">
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">تفاصيل الطالب</h1>
            <p className="text-slate-400">ID: {student.studentId}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {student.isBanned ? (
            <Button variant="primary" onClick={handleUnban}>
              <Unlock className="w-4 h-4" />
              إلغاء الحظر
            </Button>
          ) : (
            <Button variant="danger" onClick={() => setShowBanModal(true)}>
              <Ban className="w-4 h-4" />
              حظر الطالب
            </Button>
          )}
          {isEditing ? (
            <Button onClick={handleSave}>
              <Save className="w-4 h-4" />
              حفظ
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              تعديل
            </Button>
          )}
        </div>
      </div>

      {/* Banned Alert */}
      {student.isBanned && (
        <Card className="border-red-500/50 bg-red-500/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <div>
                <p className="font-bold text-red-400">هذا الطالب محظور</p>
                <p className="text-sm text-slate-400">السبب: {student.banReason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-white">
              {student.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{student.name}</h2>
                {student.isVerified && (
                  <Badge variant="primary"><CheckCircle className="w-3 h-3 ml-1" />موثق</Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" />
                  {student.grade}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  انضم: {student.joinedAt}
                </span>
              </div>
            </div>
            <div className="text-left space-y-2">
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400">آخر دخول</p>
                <p className="font-medium">{student.lastLogin}</p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400">عدد مرات الدخول</p>
                <p className="font-medium">{student.loginCount}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <h3 className="font-bold flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              المعلومات الشخصية
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <Input label="الاسم" defaultValue={student.name} />
                <Input label="رقم الهاتف" defaultValue={student.phone} />
                <Input label="اسم ولى الأمر" defaultValue={student.parentName} />
                <Input label="رقم ولى الأمر" defaultValue={student.parentPhone} />
              </>
            ) : (
              <>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400">الاسم</span>
                  <span className="font-medium">{student.name}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400">البريد الإلكتروني</span>
                  <span className="font-medium">{student.email}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400">رقم الهاتف</span>
                  <span className="font-medium">{student.phone}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400">ولى الأمر</span>
                  <span className="font-medium">{student.parentName}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400">رقم ولى الأمر</span>
                  <span className="font-medium">{student.parentPhone}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <h3 className="font-bold flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              معلومات الحساب
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400">رقم الطالب</span>
              <span className="font-mono font-medium">{student.studentId}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400">الصف</span>
              <span className="font-medium">{student.grade}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400">تاريخ التسجيل</span>
              <span className="font-medium">{student.joinedAt}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400">حالة التوثيق</span>
              {student.isVerified ? (
                <Badge variant="primary"><CheckCircle className="w-3 h-3 ml-1" />موثق</Badge>
              ) : (
                <Badge variant="warning"><Clock className="w-3 h-3 ml-1" />غير موثق</Badge>
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400">حالة الحظر</span>
              {student.isBanned ? (
                <Badge variant="danger"><Lock className="w-3 h-3 ml-1" />محظور</Badge>
              ) : (
                <Badge variant="primary"><Unlock className="w-3 h-3 ml-1" />نشط</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions */}
      <Card>
        <CardHeader>
          <h3 className="font-bold flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            الاشتراكات والدفع
          </h3>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">الكورس</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">المبلغ</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">التاريخ</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {mockSubscriptions.map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-800/30">
                    <td className="p-4 font-medium">{sub.courseName}</td>
                    <td className="p-4 text-emerald-400 font-bold">{sub.amount} ج.م</td>
                    <td className="p-4 text-slate-400">{sub.date}</td>
                    <td className="p-4">{getStatusBadge(sub.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Ban Modal */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h3 className="font-bold flex items-center gap-2 text-red-400">
                <Ban className="w-5 h-5" />
                حظر الطالب
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-400">
                هل أنت متأكد من حظر هذا الطالب؟ لن يستطيع الدخول للحساب.
              </p>
              <div>
                <label className="block text-sm font-medium mb-2">سبب الحظر</label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="أدخل سبب الحظر..."
                  className="input w-full resize-none"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowBanModal(false)}
                >
                  إلغاء
                </Button>
                <Button 
                  variant="danger" 
                  className="flex-1"
                  onClick={handleBan}
                >
                  تأكيد الحظر
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}