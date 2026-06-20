'use client'

import { useState } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Modal from '@/components/ui/modal'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import { 
  Gift,
  Plus,
  Search,
  Copy,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Calendar,
  BookOpen,
  Play,
  Key,
  Shield,
  Download
} from 'lucide-react'

interface Coupon {
  id: string
  code: string
  type: 'course' | 'lecture' | 'global'
  courseName: string
  lectureName?: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  maxUses: number
  usedCount: number
  status: 'active' | 'expired' | 'disabled'
  validFrom: string
  validUntil: string
  createdAt: string
}

const mockCoupons: Coupon[] = [
  { id: '1', code: 'PHYSICS2024', type: 'course', courseName: 'الفيزياء - الصف الأول', discountType: 'percentage', discountValue: 20, maxUses: 100, usedCount: 45, status: 'active', validFrom: '2024-01-01', validUntil: '2024-06-30', createdAt: '2024-01-01' },
  { id: '2', code: 'NEWTON50', type: 'lecture', courseName: 'الفيزياء - الصف الأول', lectureName: 'قوانين نيوتن', discountType: 'fixed', discountValue: 50, maxUses: 50, usedCount: 12, status: 'active', validFrom: '2024-01-01', validUntil: '2024-03-31', createdAt: '2024-01-01' },
  { id: '3', code: 'WELCOME100', type: 'global', courseName: 'كل الكورسات', discountType: 'fixed', discountValue: 100, maxUses: 200, usedCount: 156, status: 'active', validFrom: '2024-01-01', validUntil: '2024-12-31', createdAt: '2024-01-01' },
  { id: '4', code: 'SUMMER30', type: 'course', courseName: 'الميكانيكا', discountType: 'percentage', discountValue: 30, maxUses: 75, usedCount: 0, status: 'expired', validFrom: '2023-06-01', validUntil: '2023-08-31', createdAt: '2023-06-01' },
]

const stats = {
  totalCoupons: 24,
  activeCoupons: 8,
  totalUses: 567,
  totalDiscount: 28450,
  popularCoupon: 'WELCOME100'
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const filteredCoupons = coupons.filter(c => {
    if (filter === 'active' && c.status !== 'active') return false
    if (filter === 'expired' && c.status !== 'expired') return false
    if (searchQuery && !c.code.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الكود؟')) {
      setCoupons(prev => prev.filter(c => c.id !== id))
    }
  }

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  const exportCoupons = () => {
    const data = JSON.stringify(coupons, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `coupons_${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <Gift className="w-7 h-7 text-primary" />
            أكواد الخصم
          </h1>
          <p className="text-slate-400">إنشاء وإدارة أكواد الخصم للطلاب</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={exportCoupons}>
            <Download className="w-4 h-4" />
            تصدير
          </Button>
          <Button variant="outline" onClick={() => setShowBulkModal(true)}>
            <Key className="w-4 h-4" />
            أكواد متعددة
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" />
            كود جديد
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Gift className="w-8 h-8 text-amber-400" />
            <div>
              <p className="text-2xl font-bold">{stats.totalCoupons}</p>
              <p className="text-xs text-slate-400">إجمالي الأكواد</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
            <div>
              <p className="text-2xl font-bold">{stats.activeCoupons}</p>
              <p className="text-xs text-slate-400">نشط</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Play className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold">{stats.totalUses}</p>
              <p className="text-xs text-slate-400">إجمالي الاستخدام</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-2xl font-bold">{stats.totalDiscount.toLocaleString()}</p>
              <p className="text-xs text-slate-400">إجمالي الخصم (ج.م)</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Key className="w-8 h-8 text-cyan-400" />
            <div>
              <p className="text-lg font-bold">{stats.popularCoupon}</p>
              <p className="text-xs text-slate-400">الأكثر استخداماً</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="ابحث بالكود..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pr-10"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'active', 'expired'].map(f => (
                <Button
                  key={f}
                  variant={filter === f ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? 'الكل' : f === 'active' ? 'نشط' : 'منتهي'}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coupons Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">الكود</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">النوع</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">الخصم</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">الاستخدام</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">صالح حتى</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">الحالة</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredCoupons.map(coupon => (
                  <tr key={coupon.id} className="hover:bg-slate-800/30">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <code className="font-mono font-bold bg-slate-800 px-2 py-1 rounded text-primary">
                          {coupon.code}
                        </code>
                        <button 
                          onClick={() => handleCopy(coupon.code)}
                          className="text-slate-400 hover:text-white"
                          title="نسخ"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={coupon.type === 'global' ? 'warning' : coupon.type === 'course' ? 'info' : 'primary'}>
                        {coupon.type === 'global' ? 'عام' : coupon.type === 'course' ? 'كورس' : 'محاضرة'}
                      </Badge>
                      <p className="text-xs text-slate-400 mt-1">
                        {coupon.courseName}
                        {coupon.lectureName && ` - ${coupon.lectureName}`}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-emerald-400">
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `${coupon.discountValue} ج.م`}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span>{coupon.usedCount}/{coupon.maxUses}</span>
                        <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${(coupon.usedCount / coupon.maxUses) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {coupon.validUntil}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={coupon.status === 'active' ? 'success' : 'info'}>
                        {coupon.status === 'active' ? 'نشط' : 'منتهي'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(coupon.id)}>
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

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="إنشاء كود جديد" size="md">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input label="الكود" placeholder="مثال: PHYSICS2024" className="flex-1" />
            <Button variant="outline" className="mt-7" onClick={() => {}}>
              <Key className="w-4 h-4" />
              توليد عشوائي
            </Button>
          </div>

          <Select 
            label="النوع"
            options={[
              { value: 'global', label: 'عام (كل الكورسات)' },
              { value: 'course', label: 'كورس محدد' },
              { value: 'lecture', label: 'محاضرة محددة' }
            ]} 
          />

          <Select 
            label="الكورس"
            options={[
              { value: '1', label: 'الفيزياء - الصف الأول' },
              { value: '2', label: 'الميكانيكا' },
              { value: '3', label: 'الكهرباء' }
            ]} 
          />

          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="نوع الخصم"
              options={[
                { value: 'percentage', label: 'نسبة مئوية' },
                { value: 'fixed', label: 'مبلغ ثابت' }
              ]} 
            />
            <Input label="قيمة الخصم" type="number" placeholder="20" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="تاريخ البداية" type="date" />
            <Input label="تاريخ النهاية" type="date" />
          </div>

          <Input label="عدد مرات الاستخدام" type="number" placeholder="100" />

          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              أمان الكود
            </h4>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>• الكود يستخدم مرة واحدة لكل طالب</li>
              <li>• الكود خاص بالكورس أو المحاضرة المحددة فقط</li>
              <li>• لا يمكن استخدام كود محاضرة لكورس كامل</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>
              إلغاء
            </Button>
            <Button className="flex-1">
              <CheckCircle className="w-4 h-4" />
              إنشاء
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bulk Create Modal */}
      <Modal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)} title="إنشاء أكواد متعددة" size="md">
        <div className="space-y-4">
          <Select 
            label="الكورس"
            options={[
              { value: '1', label: 'الفيزياء - الصف الأول' },
              { value: '2', label: 'الميكانيكا' },
              { value: '3', label: 'الكهرباء' }
            ]} 
          />

          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="نوع الخصم"
              options={[
                { value: 'percentage', label: 'نسبة مئوية' },
                { value: 'fixed', label: 'مبلغ ثابت' }
              ]} 
            />
            <Input label="قيمة الخصم" type="number" placeholder="20" />
          </div>

          <Input label="عدد الأكواد" type="number" placeholder="10" />

          <Input label="تاريخ النهاية" type="date" />

          <div className="p-4 bg-slate-800/50 rounded-lg">
            <p className="text-sm text-slate-400">
              سيتم إنشاء عدد من الأكواد العشوائية. كل كود يستخدم مرة واحدة فقط.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowBulkModal(false)}>
              إلغاء
            </Button>
            <Button className="flex-1">
              <Key className="w-4 h-4" />
              إنشاء {10} أكواد
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}