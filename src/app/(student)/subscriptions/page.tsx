'use client'

import { useState } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Input from '@/components/ui/input'
import Modal from '@/components/ui/modal'
import { 
  Check, 
  CreditCard, 
  Calendar, 
  Clock, 
  AlertCircle,
  Wallet,
  Ticket,
  Gift,
  Coins,
  ArrowLeftRight,
  Sparkles,
  BookOpen,
  Video,
  GraduationCap,
  Building
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

const plans = [
  {
    id: 'monthly',
    name: 'اشتراك شهري',
    type: 'عام',
    price: 150,
    originalPrice: 200,
    duration: 'شهر',
    features: [
      'الوصول لجميع محاضرات الصف',
      'اختبارات غير محدودة',
      'دعم فني',
      'ملاحظات PDF',
      'تتبع التقدم',
    ],
    recommended: true,
  },
  {
    id: 'monthly-azhar',
    name: 'اشتراك شهري - أزهر',
    type: 'أزهر',
    price: 150,
    originalPrice: 200,
    duration: 'شهر',
    features: [
      'الوصول لجميع محاضرات الأزهر',
      'اختبارات غير محدودة',
      'دعم فني',
      'ملاحظات PDF',
      'تتبع التقدم',
    ],
    recommended: false,
  },
  {
    id: 'monthly-both',
    name: 'اشتراك شامل',
    type: 'عام + أزهر',
    price: 250,
    originalPrice: 350,
    duration: 'شهر',
    features: [
      'الوصول لجميع المحاضرات',
      'عام + أزهر',
      'اختبارات غير محدودة',
      'دعم فني متقدم',
      'جلسات مراجعة',
    ],
    recommended: false,
  },
]

export default function SubscriptionsPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<'courses' | 'lectures'>('courses')
  const [currentSubscription] = useState({
    status: 'active',
    plan: 'monthly',
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  })
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'code'>('wallet')
  const [couponCode, setCouponCode] = useState('')
  const [userWalletBalance] = useState(50)

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId)
    setShowPaymentModal(true)
  }

  const handlePayment = () => {
    if (paymentMethod === 'wallet') {
      if (userWalletBalance >= (plans.find(p => p.id === selectedPlan)?.price || 0)) {
        alert('تم الدفع من المحفظة بنجاح!')
        setShowPaymentModal(false)
      } else {
        alert('الرصيد في المحفظة غير كافي')
      }
    } else {
      setShowPaymentModal(false)
      setShowCodeModal(true)
    }
  }

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      alert(`تم تطبيق الكود: ${couponCode}`)
      setCouponCode('')
      setShowCodeModal(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">الاشتراكات</h1>
        <p className="text-slate-400">اختر الخطة المناسبة لك</p>
      </div>

      {/* Type Toggle */}
      <div className="flex gap-4 p-1 bg-slate-800/50 rounded-xl w-fit">
        <button
          onClick={() => setSelectedType('courses')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
            selectedType === 'courses'
              ? 'bg-primary text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          الكورسات
        </button>
        <button
          onClick={() => setSelectedType('lectures')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
            selectedType === 'lectures'
              ? 'bg-primary text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Video className="w-5 h-5" />
          محاضرات منفردة
        </button>
      </div>

      {/* Current Subscription */}
      {currentSubscription.status === 'active' && (
        <Card className="bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 border-emerald-500/20">
          <CardContent className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="font-medium">اشتراك نشط</p>
                <p className="text-sm text-slate-400">
                  متبقي: <span className="text-emerald-400 font-medium">15 يوم</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg">
                <Coins className="w-4 h-4 text-amber-400" />
                <span className="font-medium">{userWalletBalance} ج.م</span>
              </div>
              <Badge variant="success">نشط</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscription Type Info */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardContent className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="font-medium flex items-center gap-2">
              <Building className="w-4 h-4" />
              نظام الأزهر / العام
            </p>
            <p className="text-sm text-slate-400">
              اختر الاشتراك المناسب لنظامك الدراسي
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative overflow-hidden transition-all hover:scale-[1.02] ${
              plan.recommended ? 'border-emerald-500 ring-2 ring-emerald-500/20' : ''
            }`}
          >
            {plan.recommended && (
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-center py-1.5 text-sm font-medium">
                <Sparkles className="w-4 h-4 inline ml-1" />
                الأكثر طلباً
              </div>
            )}

            <CardContent className={`pt-8 ${plan.recommended ? 'pt-14' : ''}`}>
              <Badge variant={plan.type === 'أزهر' ? 'info' : 'primary'} className="mb-3">
                {plan.type}
              </Badge>
              
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-emerald-400">{plan.price}</span>
                  <span className="text-slate-400">ج.م / {plan.duration}</span>
                </div>
                {plan.originalPrice > plan.price && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-slate-500 line-through">{plan.originalPrice} ج.م</span>
                    <Badge variant="danger" className="text-xs">
                      خصم {Math.round((1 - plan.price / plan.originalPrice) * 100)}%
                    </Badge>
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.recommended ? 'primary' : 'outline'}
                onClick={() => handleSubscribe(plan.id)}
              >
                {currentSubscription.status === 'active' ? 'ترقية' : 'اشترك الآن'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Standalone Lectures */}
      {selectedType === 'lectures' && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-400" />
              محاضرات متاحة للشراء المنفرد
            </h3>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-slate-400">
              <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>لم يتم إضافة محاضرات منفردة بعد</p>
              <p className="text-sm mt-1">تواصل مع الدعم الفني للاستفسار</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            معلومات مهمة
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Wallet className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="font-medium mb-1">الدفع بالمحفظة</p>
                <p className="text-sm text-slate-400">
                  ادفع من رصيدك في المحفظة مباشرة
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Ticket className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="font-medium mb-1">أكواد الخصم</p>
                <p className="text-sm text-slate-400">
                  استخدم كود خصم للحصول على خصم إضافي
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Gift className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="font-medium mb-1">كود واحد فقط</p>
                <p className="text-sm text-slate-400">
                  كل كود يُستخدم مرة واحدة فقط
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <Modal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
        title="اختر طريقة الدفع"
      >
        <div className="space-y-4">
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <p className="text-sm text-slate-400">المبلغ المطلوب</p>
            <p className="text-2xl font-bold text-emerald-400">
              {plans.find(p => p.id === selectedPlan)?.price} ج.م
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setPaymentMethod('wallet')}
              className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                paymentMethod === 'wallet'
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <Wallet className="w-8 h-8 text-emerald-400" />
              <div className="flex-1 text-right">
                <p className="font-medium">الدفع من المحفظة</p>
                <p className="text-sm text-slate-400">الرصيد المتاح: {userWalletBalance} ج.م</p>
              </div>
              {paymentMethod === 'wallet' && (
                <Check className="w-6 h-6 text-emerald-400" />
              )}
            </button>

            <button
              onClick={() => setPaymentMethod('code')}
              className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                paymentMethod === 'code'
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <Ticket className="w-8 h-8 text-amber-400" />
              <div className="flex-1 text-right">
                <p className="font-medium">كود خصم</p>
                <p className="text-sm text-slate-400">استخدم كود خصم أو voucher</p>
              </div>
              {paymentMethod === 'code' && (
                <Check className="w-6 h-6 text-amber-400" />
              )}
            </button>
          </div>

          <Button onClick={handlePayment} className="w-full" size="lg">
            {paymentMethod === 'wallet' ? (
              <>تأكيد الدفع من المحفظة</>
            ) : (
              <>
                <ArrowLeftRight className="w-4 h-4" />
                استخدام كود خصم
              </>
            )}
          </Button>
        </div>
      </Modal>

      {/* Code Modal */}
      <Modal 
        isOpen={showCodeModal} 
        onClose={() => setShowCodeModal(false)} 
        title="أدخل كود الخصم"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">كود الخصم</label>
            <Input 
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="مثال: SAVE20"
              className="text-center text-xl tracking-widest"
            />
          </div>
          <Button onClick={handleApplyCoupon} className="w-full" disabled={!couponCode.trim()}>
            تطبيق الكود
          </Button>
          <p className="text-xs text-slate-400 text-center">
            الكود صالح لاستخدام واحد فقط ولا يمكن إعادة استخدامه
          </p>
        </div>
      </Modal>
    </div>
  )
}
