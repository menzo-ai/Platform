'use client'

import { useState } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import { Check, CreditCard, Calendar, Clock, AlertCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const plans = [
  {
    id: 'monthly',
    name: 'اشتراك شهري',
    price: 150,
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
    id: 'quarterly',
    name: 'اشتراك ربع سنوي',
    price: 400,
    duration: '3 أشهر',
    features: [
      'كل مميزات الاشتراك الشهري',
      'خصم 11%',
      'محاضرات إضافية مجانية',
      'جلسات مراجعة',
    ],
    recommended: false,
  },
  {
    id: 'yearly',
    name: 'اشتراك سنوي',
    price: 1200,
    duration: '12 شهر',
    features: [
      'كل مميزات الاشتراك الشهري',
      'خصم 33%',
      'محاضرات إضافية مجانية',
      'جلسات مراجعة',
      'دعم متقدم',
    ],
    recommended: false,
  },
]

export default function SubscriptionsPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [currentSubscription] = useState({
    status: 'active',
    plan: 'monthly',
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">الاشتراكات</h1>
        <p className="text-slate-400">اختر الخطة المناسبة لك</p>
      </div>

      {/* Current Subscription */}
      {currentSubscription.status === 'active' && (
        <Card className="bg-gradient-to-r from-secondary/20 to-secondary/5 border-secondary/20">
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="font-medium">اشتراك نشط</p>
                <p className="text-sm text-slate-400">
                  متبقي: <span className="text-secondary font-medium">15 يوم</span>
                </p>
              </div>
            </div>
            <div className="text-left">
              <Badge variant="success">نشط</Badge>
              <p className="text-sm text-slate-400 mt-1">
                ينتهي: {formatDate(currentSubscription.endDate)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative overflow-hidden transition-all ${
              plan.recommended ? 'border-primary ring-2 ring-primary/20' : ''
            }`}
          >
            {plan.recommended && (
              <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center py-1 text-sm font-medium">
                الأكثر طلباً
              </div>
            )}

            <CardContent className={`pt-8 ${plan.recommended ? 'pt-12' : ''}`}>
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-slate-400 mr-1">ج.م / {plan.duration}</span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.recommended ? 'primary' : 'outline'}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {currentSubscription.status === 'active' ? 'ترقية' : 'اشترك الآن'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-accent" />
            معلومات مهمة
          </h3>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-slate-400">
            <li className="flex items-start gap-2">
              <Clock className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
              <span>الاشتراك يبدأ من تاريخ الدفع ويتم تجديده تلقائياً</span>
            </li>
            <li className="flex items-start gap-2">
              <Calendar className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
              <span>يمكنك إلغاء الاشتراك في أي وقت من الإعدادات</span>
            </li>
            <li className="flex items-start gap-2">
              <CreditCard className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
              <span>طرق الدفع المتاحة: بطاقة ائتمان، فودافون كاش، بطاقة خصم</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
