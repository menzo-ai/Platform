'use client'

import { useState } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Modal from '@/components/ui/modal'
import Input from '@/components/ui/input'
import { 
  Wallet,
  CreditCard,
  Plus,
  Minus,
  History,
  Gift,
  Shield,
  CheckCircle,
  AlertCircle,
  Banknote,
  ArrowDownLeft,
  ArrowUpRight,
  Zap,
  Lock,
  Copy,
  MessageSquare,
  ExternalLink
} from 'lucide-react'

interface Transaction {
  id: string
  type: 'deposit' | 'purchase' | 'refund'
  amount: number
  description: string
  date: string
  status: 'completed' | 'pending' | 'failed'
  courseName?: string
}

interface CouponCode {
  id: string
  code: string
  courseName: string
  used: boolean
  usedAt?: string
}

const mockTransactions: Transaction[] = [
  { id: '1', type: 'deposit', amount: 500, description: 'إضافة رصيد', date: '2024-01-15', status: 'completed' },
  { id: '2', type: 'purchase', amount: -200, description: 'شراء كورس', date: '2024-01-14', status: 'completed', courseName: 'الفيزياء - الصف الأول' },
  { id: '3', type: 'purchase', amount: -150, description: 'شراء محاضرة', date: '2024-01-13', status: 'completed', courseName: 'محاضرة قوانين نيوتن' },
  { id: '4', type: 'refund', amount: 50, description: 'استرداد', date: '2024-01-10', status: 'completed' },
]

const mockCoupons: CouponCode[] = [
  { id: '1', code: 'PHYSICS2024', courseName: 'الفيزياء - الصف الأول', used: true, usedAt: '2024-01-14' },
  { id: '2', code: 'NEWTON50', courseName: 'محاضرة قوانين نيوتن', used: false },
]

export default function WalletPage() {
  const [balance, setBalance] = useState(350)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showCouponModal, setShowCouponModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [message, setMessage] = useState('')
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<'transactions' | 'coupons'>('transactions')

  const handleDeposit = async () => {
    if (!depositAmount || parseInt(depositAmount) <= 0) return
    setProcessing(true)
    
    // Simulate payment redirect to admin
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setSuccess(true)
    setProcessing(false)
    setShowDepositModal(false)
    
    // Reset after showing success
    setTimeout(() => {
      setSuccess(false)
      setDepositAmount('')
    }, 3000)
  }

  const handleCouponSubmit = async () => {
    if (!couponCode.trim()) return
    setProcessing(true)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Check coupon validity
    const coupon = mockCoupons.find(c => c.code === couponCode.toUpperCase())
    
    if (coupon) {
      if (coupon.used) {
        setMessage('هذا الكود تم استخدامه من قبل!')
      } else {
        setSuccess(true)
        setBalance(prev => prev + 100) // Add credit
        setMessage('تم تفعيل الكود بنجاح! تم إضافة 100 جنية لرصيدك')
      }
    } else {
      setMessage('كود غير صحيح! تأكد من الكود وأعد المحاولة')
    }
    
    setProcessing(false)
    setCouponCode('')
    
    setTimeout(() => {
      setSuccess(false)
      setMessage('')
    }, 5000)
  }

  const handleContactAdmin = async () => {
    if (!message.trim()) return
    setProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setProcessing(false)
    setShowContactModal(false)
    alert('تم إرسال رسالتك للإدارة. سيتم التواصل معك قريباً!')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <Wallet className="w-7 h-7 text-primary" />
            المحفظة
          </h1>
          <p className="text-slate-400">إدارة رصيدك والدفع مقابل الكورسات والمحاضرات</p>
        </div>

        {/* Balance Card */}
        <Card className="mb-8 bg-gradient-to-br from-primary via-primary/80 to-accent border-0 overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                  <Wallet className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">الرصيد المتاح</p>
                  <p className="text-4xl font-bold text-white">{balance} ج.م</p>
                </div>
              </div>
              <Badge variant="success" className="bg-white/20 text-white border-0">
                <Zap className="w-4 h-4 ml-1" />
                نشط
              </Badge>
            </div>
            
            <div className="flex gap-3">
              <Button 
                className="flex-1 bg-white text-primary hover:bg-white/90"
                onClick={() => setShowDepositModal(true)}
              >
                <Plus className="w-4 h-4" />
                إضافة رصيد
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-white/30 text-white hover:bg-white/10"
                onClick={() => setShowCouponModal(true)}
              >
                <Gift className="w-4 h-4" />
                تفعيل كود
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="p-4 cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => setShowDepositModal(true)}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Banknote className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="font-medium">الدفع في المركز</p>
                <p className="text-xs text-slate-400">تواصل مع الإدارة للدفع</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => setShowContactModal(true)}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="font-medium">تواصل مع الإدارة</p>
                <p className="text-xs text-slate-400">للبحث عن أكواد أو مشاكل</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <p className="text-emerald-400">{message || 'تمت العملية بنجاح!'}</p>
          </div>
        )}

        {/* Error Message */}
        {message && !success && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
            <p className="text-red-400">{message}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'transactions' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('transactions')}
          >
            <History className="w-4 h-4" />
            المعاملات
          </Button>
          <Button
            variant={activeTab === 'coupons' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('coupons')}
          >
            <Gift className="w-4 h-4" />
            أكواد الخصم
          </Button>
        </div>

        {/* Transactions */}
        {activeTab === 'transactions' && (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-700">
                {mockTransactions.map(tx => (
                  <div key={tx.id} className="p-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'deposit' ? 'bg-emerald-500/20' : 
                      tx.type === 'refund' ? 'bg-blue-500/20' : 'bg-red-500/20'
                    }`}>
                      {tx.type === 'deposit' ? (
                        <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
                      ) : tx.type === 'refund' ? (
                        <ArrowDownLeft className="w-5 h-5 text-blue-400" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-xs text-slate-400">
                        {tx.date} {tx.courseName && `• ${tx.courseName}`}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className={`font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount} ج.م
                      </p>
                      <Badge variant={tx.status === 'completed' ? 'success' : tx.status === 'pending' ? 'warning' : 'danger'} className="text-xs">
                        {tx.status === 'completed' ? 'مكتمل' : tx.status === 'pending' ? 'قيد الانتظار' : 'فاشل'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Coupons */}
        {activeTab === 'coupons' && (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-700">
                {mockCoupons.map(coupon => (
                  <div key={coupon.id} className="p-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      coupon.used ? 'bg-slate-700' : 'bg-primary/20'
                    }`}>
                      <Gift className={`w-5 h-5 ${coupon.used ? 'text-slate-500' : 'text-primary'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <code className="font-mono font-bold">{coupon.code}</code>
                        <button onClick={() => copyToClipboard(coupon.code)} className="text-slate-400 hover:text-white">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-400">{coupon.courseName}</p>
                    </div>
                    <Badge variant={coupon.used ? 'info' : 'success'}>
                      {coupon.used ? 'تم الاستخدام' : 'متاح'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Box */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-400 mb-1">كيفية الشحن</h4>
              <p className="text-sm text-slate-400">
                تواصل مع الإدارة عبر واتساب أو زورنا في المركز لدفع مبلغ المحاضرة أو الكورس. سيتم إضافة الرصيد لحسابك فوراً.
              </p>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="border-blue-500/30 text-blue-400">
                  <MessageSquare className="w-4 h-4" />
                  واتساب
                </Button>
                <Button variant="outline" size="sm" className="border-blue-500/30 text-blue-400">
                  <ExternalLink className="w-4 h-4" />
                  زورنا
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      <Modal isOpen={showDepositModal} onClose={() => setShowDepositModal(false)} title="إضافة رصيد" size="md">
        <div className="space-y-6">
          <div className="text-center py-4">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Banknote className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">الدفع في المركز</h3>
            <p className="text-sm text-slate-400">
              تواصل مع الإدارة لدفع المبلغ في المركز. سيتم إضافة الرصيد لحسابك فوراً.
            </p>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h4 className="font-medium mb-3">طرق التواصل:</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <span>واتساب: 01003092656</span>
              </div>
              <div className="flex items-center gap-3">
                <ExternalLink className="w-5 h-5 text-blue-400" />
                <span>زيارة: العنوان في الفوتر</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">أدخل المبلغ المراد شحنه</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="مثال: 500"
                className="input flex-1"
              />
              <span className="self-center text-slate-400">ج.م</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowDepositModal(false)}>
              إلغاء
            </Button>
            <Button className="flex-1" onClick={handleDeposit} disabled={processing}>
              {processing ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  جاري المعالجة...
                </span>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" />
                  تواصل مع الإدارة
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Coupon Modal */}
      <Modal isOpen={showCouponModal} onClose={() => setShowCouponModal(false)} title="تفعيل كود" size="md">
        <div className="space-y-6">
          <div className="text-center py-4">
            <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
              <Gift className="w-10 h-10 text-amber-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">أدخل كود الخصم</h3>
            <p className="text-sm text-slate-400">
              ادخل الكود المقدم من الإدارة للحصول على رصيد مجاني
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">كود الخصم</label>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="مثال: PHYSICS2024"
              className="input w-full text-center font-mono text-lg tracking-wider"
            />
          </div>

          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              أمان الكود
            </h4>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>• كل كود يستخدم مرة واحدة فقط</li>
              <li>• الكود خاص بالكورس أو المحاضرة المحددة</li>
              <li>• لا يمكن استخدام كود محاضرة لكورس آخر</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowCouponModal(false)}>
              إلغاء
            </Button>
            <Button className="flex-1" onClick={handleCouponSubmit} disabled={processing || !couponCode.trim()}>
              {processing ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  جاري التحقق...
                </span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  تفعيل الكود
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Contact Admin Modal */}
      <Modal isOpen={showContactModal} onClose={() => setShowContactModal(false)} title="تواصل مع الإدارة" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">رسالتك</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا... (مثال: أريد شحن رصيد 500 جنيه)"
              rows={5}
              className="input w-full"
            />
          </div>

          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h4 className="font-medium mb-2">طرق التواصل السريع:</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <span>واتساب: 01003092656</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-5 h-5">📧</span>
                <span>البريد: moha147wa@gmail.com</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowContactModal(false)}>
              إلغاء
            </Button>
            <Button className="flex-1" onClick={handleContactAdmin} disabled={processing}>
              {processing ? 'جاري الإرسال...' : 'إرسال'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}