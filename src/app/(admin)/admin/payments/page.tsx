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
  CreditCard,
  Wallet,
  Banknote,
  Smartphone,
  Receipt,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Settings,
  Shield,
  Lock,
  EyeOff
} from 'lucide-react'

interface Payment {
  id: string
  studentName: string
  studentEmail: string
  type: 'wallet' | 'paymob' | 'fawry'
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  courseName?: string
  transactionId?: string
  date: string
}

interface WalletBalance {
  id: string
  studentName: string
  balance: number
  totalDeposited: number
  totalSpent: number
  lastDeposit: string
}

const mockPayments: Payment[] = [
  { id: '1', studentName: 'أحمد محمد', studentEmail: 'ahmed@ex.com', type: 'paymob', amount: 500, status: 'completed', courseName: 'الفيزياء - الصف الأول', transactionId: 'PM-2024-001', date: '2024-01-15' },
  { id: '2', studentName: 'فاطمة علي', studentEmail: 'fatma@ex.com', type: 'wallet', amount: 200, status: 'completed', courseName: 'الميكانيكا', date: '2024-01-14' },
  { id: '3', studentName: 'محمد خالد', studentEmail: 'mohamed@ex.com', type: 'fawry', amount: 150, status: 'pending', courseName: 'محاضرة قوانين نيوتن', date: '2024-01-16' },
  { id: '4', studentName: 'سارة أحمد', studentEmail: 'sara@ex.com', type: 'paymob', amount: 700, status: 'completed', courseName: 'الكهرباء', transactionId: 'PM-2024-002', date: '2024-01-13' },
  { id: '5', studentName: 'عمر يوسف', studentEmail: 'omar@ex.com', type: 'wallet', amount: 100, status: 'refunded', courseName: 'الفيزياء - الصف الأول', date: '2024-01-10' },
]

const mockWallets: WalletBalance[] = [
  { id: '1', studentName: 'أحمد محمد', balance: 350, totalDeposited: 500, totalSpent: 150, lastDeposit: '2024-01-15' },
  { id: '2', studentName: 'فاطمة علي', balance: 200, totalDeposited: 300, totalSpent: 100, lastDeposit: '2024-01-14' },
  { id: '3', studentName: 'محمد خالد', balance: 0, totalDeposited: 200, totalSpent: 200, lastDeposit: '2024-01-10' },
]

const stats = {
  totalRevenue: 45680,
  paymobRevenue: 28000,
  fawryRevenue: 12000,
  walletDeposits: 5680,
  pendingPayments: 12,
  successfulPayments: 245,
  failedPayments: 8
}

export default function AdminPaymentsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'wallet' | 'settings'>('overview')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPayments = mockPayments.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false
    if (searchQuery && !p.studentName.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const getStatusBadge = (status: Payment['status']) => {
    const config: Record<string, { variant: any; label: string; icon: any }> = {
      completed: { variant: 'success', label: 'مكتمل', icon: CheckCircle },
      pending: { variant: 'warning', label: 'قيد الانتظار', icon: Clock },
      failed: { variant: 'danger', label: 'فاشل', icon: XCircle },
      refunded: { variant: 'info', label: 'مسترد', icon: RefreshCw }
    }
    return <Badge variant={config[status].variant}>{config[status].label}</Badge>
  }

  const getTypeIcon = (type: Payment['type']) => {
    const icons: Record<string, any> = {
      paymob: CreditCard,
      fawry: Smartphone,
      wallet: Wallet
    }
    return icons[type] || CreditCard
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <CreditCard className="w-7 h-7 text-primary" />
            إدارة الدفع والPayments
          </h1>
          <p className="text-slate-400">Paymob - Fawry - المحفظة</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setActiveTab('settings')}>
            <Settings className="w-4 h-4" />
            إعدادات الدفع
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'overview', label: 'نظرة عامة', icon: TrendingUp },
          { id: 'payments', label: 'المدفوعات', icon: Receipt },
          { id: 'wallet', label: 'المحافظ', icon: Wallet },
          { id: 'settings', label: 'الإعدادات', icon: Settings }
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Main Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-6 bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 border-emerald-500/20">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-emerald-400">إجمالي الإيراد (ج.م)</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.paymobRevenue.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">Paymob</p>
                </div>
              </div>
              <Progress value={(stats.paymobRevenue / stats.totalRevenue) * 100} className="mt-3" />
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.fawryRevenue.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">Fawry</p>
                </div>
              </div>
              <Progress value={(stats.fawryRevenue / stats.totalRevenue) * 100} className="mt-3" />
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.walletDeposits.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">المحفظة</p>
                </div>
              </div>
              <Progress value={(stats.walletDeposits / stats.totalRevenue) * 100} className="mt-3" />
            </Card>
          </div>

          {/* Payment Methods */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Paymob */}
            <Card className="overflow-hidden">
              <div className="p-6 bg-gradient-to-br from-blue-500/20 to-blue-600/5 border-b border-blue-500/20">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center">
                    <CreditCard className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Paymob</h3>
                    <Badge variant="success" className="mt-1">مفعل</Badge>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">API Key</span>
                    <span className="font-mono text-sm">••••••••1234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Merchant ID</span>
                    <span>1234567</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">نسبة العمولة</span>
                    <span>2.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fawry */}
            <Card className="overflow-hidden">
              <div className="p-6 bg-gradient-to-br from-purple-500/20 to-purple-600/5 border-b border-purple-500/20">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-purple-500 flex items-center justify-center">
                    <Smartphone className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Fawry</h3>
                    <Badge variant="success" className="mt-1">مفعل</Badge>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Merchant Code</span>
                    <span className="font-mono text-sm">••••••••ABCD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Security Key</span>
                    <span>••••••••</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">نسبة العمولة</span>
                    <span>3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wallet */}
            <Card className="overflow-hidden">
              <div className="p-6 bg-gradient-to-br from-amber-500/20 to-amber-600/5 border-b border-amber-500/20">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-amber-500 flex items-center justify-center">
                    <Wallet className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">المحفظة</h3>
                    <Badge variant="success" className="mt-1">مفعل</Badge>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">إجمالي الأرصدة</span>
                    <span className="font-bold text-amber-400">5,680 ج.م</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">عدد المستخدمين</span>
                    <span>150</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">نسبة العمولة</span>
                    <span>0%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-bold">آخر المعاملات</h3>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('payments')}>
                  عرض الكل
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-700">
                {mockPayments.slice(0, 5).map(payment => {
                  const TypeIcon = getTypeIcon(payment.type)
                  return (
                    <div key={payment.id} className="p-4 flex items-center gap-4 hover:bg-slate-800/30">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        payment.type === 'paymob' ? 'bg-blue-500/20' :
                        payment.type === 'fawry' ? 'bg-purple-500/20' : 'bg-amber-500/20'
                      }`}>
                        <TypeIcon className={`w-5 h-5 ${
                          payment.type === 'paymob' ? 'text-blue-400' :
                          payment.type === 'fawry' ? 'text-purple-400' : 'text-amber-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{payment.studentName}</p>
                        <p className="text-xs text-slate-400">{payment.courseName || 'شحن محفظة'}</p>
                      </div>
                      <div className="text-left">
                        <p className={`font-bold ${payment.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {payment.amount > 0 ? '+' : ''}{payment.amount} ج.م
                        </p>
                        <p className="text-xs text-slate-400">{payment.date}</p>
                      </div>
                      {getStatusBadge(payment.status)}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="ابحث..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pr-10"
                  />
                </div>
                <div className="flex gap-2">
                  {['all', 'completed', 'pending', 'failed'].map(f => (
                    <Button
                      key={f}
                      variant={filter === f ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setFilter(f)}
                    >
                      {f === 'all' ? 'الكل' : f === 'completed' ? 'مكتمل' : f === 'pending' ? 'معلق' : 'فاشل'}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="p-4 text-right text-sm font-medium text-slate-400">الطالب</th>
                      <th className="p-4 text-right text-sm font-medium text-slate-400">الطريقة</th>
                      <th className="p-4 text-right text-sm font-medium text-slate-400">المبلغ</th>
                      <th className="p-4 text-right text-sm font-medium text-slate-400">الحالة</th>
                      <th className="p-4 text-right text-sm font-medium text-slate-400">التاريخ</th>
                      <th className="p-4 text-right text-sm font-medium text-slate-400">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {filteredPayments.map(payment => (
                      <tr key={payment.id} className="hover:bg-slate-800/30">
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{payment.studentName}</p>
                            <p className="text-xs text-slate-400">{payment.studentEmail}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {(() => { const Icon = getTypeIcon(payment.type); return <Icon className="w-4 h-4" /> })()}
                            <span className="capitalize">{payment.type === 'paymob' ? 'Paymob' : payment.type === 'fawry' ? 'Fawry' : 'محفظة'}</span>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-emerald-400">{payment.amount} ج.م</td>
                        <td className="p-4">{getStatusBadge(payment.status)}</td>
                        <td className="p-4 text-sm text-slate-400">{payment.date}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedPayment(payment)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            {payment.status === 'pending' && (
                              <>
                                <Button variant="ghost" size="sm" className="text-emerald-400">
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-400">
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Wallet Tab */}
      {activeTab === 'wallet' && (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            {mockWallets.map(wallet => (
              <Card key={wallet.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold">
                      {wallet.studentName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{wallet.studentName}</p>
                      <p className="text-xs text-slate-400">الرصيد: <span className="text-amber-400 font-bold">{wallet.balance} ج.م</span></p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-emerald-500/10 rounded">
                      <p className="text-slate-400">المشحن</p>
                      <p className="font-bold text-emerald-400">{wallet.totalDeposited}</p>
                    </div>
                    <div className="p-2 bg-red-500/10 rounded">
                      <p className="text-slate-400">المصروف</p>
                      <p className="font-bold text-red-400">{wallet.totalSpent}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    <Plus className="w-4 h-4" />
                    إضافة رصيد
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Paymob Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">إعدادات Paymob</h3>
                  <p className="text-xs text-slate-400">Payment API Integration</p>
                </div>
                <div className="mr-auto">
                  <Badge variant="success">مفعل</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="API Key" type="password" placeholder="Your Paymob API Key" />
              <Input label="Merchant ID" placeholder="1234567" />
              <Input label="Frame ID" placeholder="12345" />
              <div className="flex gap-3 pt-4">
                <Button>حفظ التغييرات</Button>
                <Button variant="outline">اختبار الاتصال</Button>
              </div>
            </CardContent>
          </Card>

          {/* Fawry Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">إعدادات Fawry</h3>
                  <p className="text-xs text-slate-400">Fawry Payment Gateway</p>
                </div>
                <div className="mr-auto">
                  <Badge variant="success">مفعل</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Merchant Code" placeholder="ABC123" />
              <Input label="Security Key" type="password" placeholder="Your Fawry Security Key" />
              <div className="flex gap-3 pt-4">
                <Button>حفظ التغييرات</Button>
                <Button variant="outline">اختبار الاتصال</Button>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">إعدادات المحفظة</h3>
                  <p className="text-xs text-slate-400">Internal Wallet System</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <span className="font-medium text-emerald-400">محمي</span>
                </div>
                <p className="text-sm text-slate-400">
                  نظام المحفظة داخلي 100% بدون عمولة. الطالب يدفع في السنتر أو عن طريق التحويل.
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <Button>حفظ التغييرات</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payment Detail Modal */}
      <Modal isOpen={!!selectedPayment} onClose={() => setSelectedPayment(null)} title="تفاصيل الدفع" size="md">
        {selectedPayment && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                {(() => { const Icon = getTypeIcon(selectedPayment.type); return <Icon className="w-6 h-6" /> })()}
                <span className="font-bold text-lg">{selectedPayment.type === 'paymob' ? 'Paymob' : selectedPayment.type === 'fawry' ? 'Fawry' : 'محفظة'}</span>
              </div>
              <div className="text-3xl font-bold text-emerald-400 mb-2">{selectedPayment.amount} ج.م</div>
              {getStatusBadge(selectedPayment.status)}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-slate-800/30 rounded">
                <span className="text-slate-400">الطالب</span>
                <span>{selectedPayment.studentName}</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-800/30 rounded">
                <span className="text-slate-400">البريد</span>
                <span>{selectedPayment.studentEmail}</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-800/30 rounded">
                <span className="text-slate-400">الكورس</span>
                <span>{selectedPayment.courseName || '-'}</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-800/30 rounded">
                <span className="text-slate-400">رقم العملية</span>
                <span className="font-mono">{selectedPayment.transactionId || '-'}</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-800/30 rounded">
                <span className="text-slate-400">التاريخ</span>
                <span>{selectedPayment.date}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedPayment(null)}>
                إغلاق
              </Button>
              {selectedPayment.status === 'completed' && (
                <Button variant="danger" className="flex-1">
                  <RefreshCw className="w-4 h-4" />
                  استرداد
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}