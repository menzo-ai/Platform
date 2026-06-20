'use client'

import { useState } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Modal from '@/components/ui/modal'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import Progress from '@/components/ui/progress'
import { 
  Wallet,
  Plus,
  Minus,
  Users,
  Gift,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  XCircle,
  Banknote,
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  Shield,
  Eye,
  Edit,
  Trash2,
  Copy,
  Download,
  Upload
} from 'lucide-react'

interface WalletTransaction {
  id: string
  studentName: string
  studentEmail: string
  type: 'deposit' | 'refund' | 'purchase'
  amount: number
  status: 'pending' | 'completed' | 'rejected'
  description: string
  date: string
}

interface Coupon {
  id: string
  code: string
  courseName: string
  lectureName?: string
  value: number
  used: boolean
  usedBy?: string
  usedAt?: string
  createdAt: string
  expiresAt: string
}

interface StudentWallet {
  id: string
  name: string
  email: string
  balance: number
  totalDeposited: number
  totalSpent: number
  lastTransaction: string
}

const mockTransactions: WalletTransaction[] = [
  { id: '1', studentName: 'أحمد محمد', studentEmail: 'ahmed@ex.com', type: 'deposit', amount: 500, status: 'pending', description: 'طلب شحن رصيد', date: '2024-01-15' },
  { id: '2', studentName: 'فاطمة علي', studentEmail: 'fatma@ex.com', type: 'deposit', amount: 200, status: 'completed', description: 'شحن رصيد', date: '2024-01-14' },
  { id: '3', studentName: 'محمد خالد', studentEmail: 'mohamed@ex.com', type: 'refund', amount: 50, status: 'pending', description: 'طلب استرداد', date: '2024-01-13' },
]

const mockCoupons: Coupon[] = [
  { id: '1', code: 'PHYSICS2024', courseName: 'الفيزياء - الصف الأول', value: 100, used: true, usedBy: 'أحمد محمد', usedAt: '2024-01-14', createdAt: '2024-01-01', expiresAt: '2024-12-31' },
  { id: '2', code: 'NEWTON50', courseName: 'الفيزياء - الصف الأول', lectureName: 'قوانين نيوتن', value: 50, used: false, createdAt: '2024-01-10', expiresAt: '2024-06-30' },
  { id: '3', code: 'WELCOME100', courseName: 'كل الكورسات', value: 100, used: false, createdAt: '2024-01-15', expiresAt: '2024-03-15' },
]

const mockStudents: StudentWallet[] = [
  { id: '1', name: 'أحمد محمد', email: 'ahmed@ex.com', balance: 350, totalDeposited: 500, totalSpent: 150, lastTransaction: '2024-01-15' },
  { id: '2', name: 'فاطمة علي', email: 'fatma@ex.com', balance: 200, totalDeposited: 300, totalSpent: 100, lastTransaction: '2024-01-14' },
  { id: '3', name: 'محمد خالد', email: 'mohamed@ex.com', balance: 0, totalDeposited: 200, totalSpent: 200, lastTransaction: '2024-01-10' },
]

const stats = {
  totalBalance: 12500,
  pendingRequests: 5,
  totalDeposits: 45000,
  totalSpent: 32500,
  activeCoupons: 8
}

export default function AdminWalletPage() {
  const [activeTab, setActiveTab] = useState<'requests' | 'coupons' | 'students'>('requests')
  const [showAddFundsModal, setShowAddFundsModal] = useState(false)
  const [showCreateCouponModal, setShowCreateCouponModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<StudentWallet | null>(null)
  const [addAmount, setAddAmount] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const handleApproveRequest = (id: string) => {
    // In real app, call API
    alert('تمت الموافقة! تم إضافة الرصيد لحساب الطالب')
  }

  const handleRejectRequest = (id: string) => {
    alert('تم رفض الطلب')
  }

  const handleAddFunds = () => {
    if (!selectedStudent || !addAmount) return
    alert(`تم إضافة ${addAmount} جنية لحساب ${selectedStudent.name}`)
    setShowAddFundsModal(false)
    setAddAmount('')
    setSelectedStudent(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <Wallet className="w-7 h-7 text-primary" />
            إدارة المحفظة
          </h1>
          <p className="text-slate-400">إدارة أرصدة الطلاب والمحفظة والأكواد</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowCreateCouponModal(true)}>
            <Gift className="w-4 h-4" />
            إنشاء كود خصم
          </Button>
          <Button onClick={() => setShowAddFundsModal(true)}>
            <Plus className="w-4 h-4" />
            إضافة رصيد
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Wallet className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{stats.totalBalance.toLocaleString()}</p>
              <p className="text-xs text-slate-400">إجمالي الأرصدة</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-amber-400" />
            <div>
              <p className="text-2xl font-bold">{stats.pendingRequests}</p>
              <p className="text-xs text-slate-400">طلبات معلقة</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <ArrowDownLeft className="w-8 h-8 text-emerald-400" />
            <div>
              <p className="text-2xl font-bold">{stats.totalDeposits.toLocaleString()}</p>
              <p className="text-xs text-slate-400">إجمالي الشحن</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <ArrowUpRight className="w-8 h-8 text-red-400" />
            <div>
              <p className="text-2xl font-bold">{stats.totalSpent.toLocaleString()}</p>
              <p className="text-xs text-slate-400">إجمالي المصروف</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Gift className="w-8 h-8 text-amber-400" />
            <div>
              <p className="text-2xl font-bold">{stats.activeCoupons}</p>
              <p className="text-xs text-slate-400">أكواد نشطة</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'requests', label: 'طلبات الشحن', icon: Banknote },
          { id: 'coupons', label: 'أكواد الخصم', icon: Gift },
          { id: 'students', label: 'محافظ الطلاب', icon: Users }
        ].map(tab => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'primary' : 'outline'}
            onClick={() => setActiveTab(tab.id as any)}
          >
            <tab.icon className="w-4 h-4 ml-2" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="p-4 text-right text-sm font-medium text-slate-400">الطالب</th>
                    <th className="p-4 text-right text-sm font-medium text-slate-400">النوع</th>
                    <th className="p-4 text-right text-sm font-medium text-slate-400">المبلغ</th>
                    <th className="p-4 text-right text-sm font-medium text-slate-400">الوصف</th>
                    <th className="p-4 text-right text-sm font-medium text-slate-400">التاريخ</th>
                    <th className="p-4 text-right text-sm font-medium text-slate-400">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {mockTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-800/30">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{tx.studentName}</p>
                          <p className="text-xs text-slate-400">{tx.studentEmail}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={tx.type === 'deposit' ? 'success' : tx.type === 'refund' ? 'info' : 'warning'}>
                          {tx.type === 'deposit' ? 'شحن' : tx.type === 'refund' ? 'استرداد' : 'شراء'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className={`font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount} ج.م
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-400">{tx.description}</td>
                      <td className="p-4 text-sm text-slate-400">{tx.date}</td>
                      <td className="p-4">
                        {tx.status === 'pending' ? (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleApproveRequest(tx.id)}>
                              <CheckCircle className="w-4 h-4" />
                              موافقة
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleRejectRequest(tx.id)}>
                              <XCircle className="w-4 h-4" />
                              رفض
                            </Button>
                          </div>
                        ) : (
                          <Badge variant={tx.status === 'completed' ? 'success' : 'danger'}>
                            {tx.status === 'completed' ? 'تم' : 'مرفوض'}
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coupons Tab */}
      {activeTab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="ابحث بالأكواد..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pr-10"
              />
            </div>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              options={[
                { value: 'all', label: 'الكل' },
                { value: 'used', label: 'مستخدم' },
                { value: 'unused', label: 'غير مستخدم' }
              ]}
              className="w-40"
            />
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="p-4 text-right text-sm font-medium text-slate-400">الكود</th>
                      <th className="p-4 text-right text-sm font-medium text-slate-400">الكورس/المحاضرة</th>
                      <th className="p-4 text-right text-sm font-medium text-slate-400">القيمة</th>
                      <th className="p-4 text-right text-sm font-medium text-slate-400">الحالة</th>
                      <th className="p-4 text-right text-sm font-medium text-slate-400">تاريخ الانتهاء</th>
                      <th className="p-4 text-right text-sm font-medium text-slate-400">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {mockCoupons.map(coupon => (
                      <tr key={coupon.id} className="hover:bg-slate-800/30">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <code className="font-mono font-bold bg-slate-800 px-2 py-1 rounded">{coupon.code}</code>
                            <button onClick={() => navigator.clipboard.writeText(coupon.code)} className="text-slate-400 hover:text-white">
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{coupon.courseName}</p>
                            {coupon.lectureName && <p className="text-xs text-slate-400">{coupon.lectureName}</p>}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-emerald-400">{coupon.value} ج.م</span>
                        </td>
                        <td className="p-4">
                          <Badge variant={coupon.used ? 'info' : 'success'}>
                            {coupon.used ? `مستخدم (${coupon.usedBy})` : 'متاح'}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-slate-400">{coupon.expiresAt}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="ابحث بالاسم أو الإيميل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pr-10"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockStudents.map(student => (
              <Card key={student.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs text-slate-400">{student.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-sm text-slate-400">الرصيد الحالي</span>
                      <span className="font-bold text-emerald-400">{student.balance} ج.م</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 bg-emerald-500/10 rounded">
                        <p className="text-slate-400">المشحن</p>
                        <p className="font-bold text-emerald-400">{student.totalDeposited}</p>
                      </div>
                      <div className="p-2 bg-red-500/10 rounded">
                        <p className="text-slate-400">المصروف</p>
                        <p className="font-bold text-red-400">{student.totalSpent}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => { setSelectedStudent(student); setShowAddFundsModal(true); }}
                    >
                      <Plus className="w-4 h-4" />
                      إضافة رصيد
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add Funds Modal */}
      <Modal isOpen={showAddFundsModal} onClose={() => { setShowAddFundsModal(false); setSelectedStudent(null); }} title="إضافة رصيد" size="md">
        <div className="space-y-4">
          {selectedStudent ? (
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <p className="font-medium">{selectedStudent.name}</p>
              <p className="text-sm text-slate-400">{selectedStudent.email}</p>
              <p className="text-sm mt-2">الرصيد الحالي: <span className="text-emerald-400 font-bold">{selectedStudent.balance} ج.م</span></p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2">اختر الطالب</label>
              <select className="input w-full">
                <option value="">اختر...</option>
                {mockStudents.map(s => (
                  <option key={s.id} value={s.id}>{s.name} - {s.email}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">المبلغ</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="مثال: 500"
                className="input flex-1"
              />
              <span className="self-center text-slate-400">ج.م</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">ملاحظة (اختياري)</label>
            <input type="text" placeholder="مثال: شحن يدوي في المركز" className="input w-full" />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowAddFundsModal(false)}>
              إلغاء
            </Button>
            <Button className="flex-1" onClick={handleAddFunds} disabled={!addAmount}>
              <CheckCircle className="w-4 h-4" />
              تأكيد الإضافة
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create Coupon Modal */}
      <Modal isOpen={showCreateCouponModal} onClose={() => setShowCreateCouponModal(false)} title="إنشاء كود خصم" size="md">
        <div className="space-y-4">
          <Input label="الكود" placeholder="مثال: PHYSICS2024" />
          <Select 
            label="الكورس" 
            options={[
              { value: '1', label: 'الفيزياء - الصف الأول' },
              { value: '2', label: 'الميكانيكا' },
              { value: 'all', label: 'كل الكورسات' }
            ]} 
          />
          <Select 
            label="المحاضرة (اختياري)" 
            options={[
              { value: '', label: 'كود للكورس كامل' },
              { value: '1', label: 'قوانين نيوتن' },
              { value: '2', label: 'التسارع' }
            ]} 
          />
          <Input label="قيمة الخصم (جنيه)" type="number" placeholder="مثال: 50" />
          <Input label="تاريخ الانتهاء" type="date" />

          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              ملاحظات مهمة:
            </h4>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>• الكود يستخدم مرة واحدة فقط</li>
              <li>• الكود خاص بالكورس أو المحاضرة المحددة</li>
              <li>• لا يمكن استخدام كود محاضرة لكورس آخر</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowCreateCouponModal(false)}>
              إلغاء
            </Button>
            <Button className="flex-1">
              <Gift className="w-4 h-4" />
              إنشاء الكود
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}