'use client'

import { useState, useRef } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Modal from '@/components/ui/modal'
import Progress from '@/components/ui/progress'
import { 
  Database,
  Download,
  Upload,
  Users,
  BookOpen,
  GraduationCap,
  CreditCard,
  Bell,
  MessageSquare,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Trash2,
  Check
} from 'lucide-react'

interface ExportOption {
  id: string
  name: string
  description: string
  icon: any
  color: string
  bgColor: string
}

interface ImportResult {
  success: boolean
  total: number
  imported: number
  failed: number
}

export default function AdminDataPage() {
  const [exporting, setExporting] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const exportOptions: ExportOption[] = [
    { id: 'users', name: 'المستخدمين', description: 'بيانات الطلاب والمدرسين', icon: Users, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
    { id: 'courses', name: 'الكورسات', description: 'الكورسات والفصول والمحاضرات', icon: BookOpen, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
    { id: 'enrollments', name: 'التسجيلات', description: 'تسجيلات الطلاب', icon: GraduationCap, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
    { id: 'subscriptions', name: 'الاشتراكات', description: 'الاشتراكات والدفعات', icon: CreditCard, color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
    { id: 'notifications', name: 'الإشعارات', description: 'إشعارات المستخدمين', icon: Bell, color: 'text-pink-400', bgColor: 'bg-pink-500/10' },
    { id: 'messages', name: 'الرسائل', description: 'الرسائل', icon: MessageSquare, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
    { id: 'certificates', name: 'الشهادات', description: 'الشهادات الممنوحة', icon: Award, color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
    { id: 'tickets', name: 'التذاكر', description: 'تذاكر الدعم الفني', icon: AlertCircle, color: 'text-red-400', bgColor: 'bg-red-500/10' },
  ]

  const handleExport = async (type: string) => {
    setExporting(type)
    try {
      const response = await fetch(`/api/admin/data?type=${type}`)
      const result = await response.json()
      if (result.success) {
        const dataToExport = type === 'all' ? result.data : { [type]: result.data[type] }
        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `gelvano_${type}_${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export error:', error)
    }
    setExporting(null)
  }

  const handleExportAll = async () => {
    await handleExport('all')
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    setImportProgress(0)
    setShowImportModal(true)

    try {
      for (let i = 0; i <= 100; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 50))
        setImportProgress(i)
      }
      setImportResult({ success: true, total: 100, imported: 95, failed: 5 })
    } catch {
      setImportResult({ success: false, total: 0, imported: 0, failed: 0 })
    }
    setImporting(false)
  }

  const handleDeleteAll = async () => {
    setDeleting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setDeleting(false)
    setConfirmDelete(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <Database className="w-7 h-7 text-primary" />
            إدارة البيانات
          </h1>
          <p className="text-slate-400">تصدير واستيراد البيانات والاحتياطي</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExportAll} disabled={!!exporting}>
            {exporting === 'all' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            تصدير كامل
          </Button>
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4" />
            استيراد
          </Button>
          <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
          <p className="text-2xl font-bold">1,247</p>
          <p className="text-xs text-slate-400">مستخدم</p>
        </Card>
        <Card className="p-4 text-center">
          <BookOpen className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
          <p className="text-2xl font-bold">18</p>
          <p className="text-xs text-slate-400">كورس</p>
        </Card>
        <Card className="p-4 text-center">
          <GraduationCap className="w-8 h-8 mx-auto mb-2 text-purple-400" />
          <p className="text-2xl font-bold">3,456</p>
          <p className="text-xs text-slate-400">تسجيل</p>
        </Card>
        <Card className="p-4 text-center">
          <CreditCard className="w-8 h-8 mx-auto mb-2 text-amber-400" />
          <p className="text-2xl font-bold">45,230</p>
          <p className="text-xs text-slate-400">إيراد (ج.م)</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-bold flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-400" />
            تصدير البيانات
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {exportOptions.map(option => {
              const Icon = option.icon
              return (
                <button
                  key={option.id}
                  onClick={() => handleExport(option.id)}
                  disabled={!!exporting}
                  className="p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-primary/50 transition-all text-right group"
                >
                  <div className={`w-12 h-12 rounded-xl ${option.bgColor} flex items-center justify-center mb-3`}>
                    <Icon className={`w-6 h-6 ${option.color}`} />
                  </div>
                  <h4 className="font-bold mb-1">{option.name}</h4>
                  <p className="text-xs text-slate-400 mb-2">{option.description}</p>
                  {exporting === option.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary mx-auto" />
                  ) : (
                    <span className="text-xs text-primary">تصدير JSON</span>
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="font-bold flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-400" />
            استيراد البيانات
          </h3>
        </CardHeader>
        <CardContent>
          <div 
            className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-blue-400" />
            </div>
            <h4 className="font-bold mb-2">اسحب الملفات هنا أو اضغط للاختيار</h4>
            <p className="text-sm text-slate-400">الصيغ المدعومة: JSON فقط</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-500/30">
        <CardHeader>
          <h3 className="font-bold flex items-center gap-2 text-red-400">
            <Trash2 className="w-5 h-5" />
            منطقة الخطر
          </h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <div>
              <p className="font-medium">حذف جميع البيانات</p>
              <p className="text-sm text-slate-400">حذف جميع بيانات المنصة نهائياً</p>
            </div>
            {!confirmDelete ? (
              <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
                <Trash2 className="w-4 h-4" />
                حذف الكل
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setConfirmDelete(false)}>إلغاء</Button>
                <Button variant="danger" size="sm" onClick={handleDeleteAll} disabled={deleting}>
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  تأكيد
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={showImportModal} onClose={() => { setShowImportModal(false); setImportResult(null); }} title="استيراد البيانات" size="md">
        <div className="space-y-4">
          {importing ? (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
              <h4 className="font-bold mb-2">جاري استيراد البيانات...</h4>
              <Progress value={importProgress} showLabel />
            </div>
          ) : importResult ? (
            <div className="text-center py-4">
              {importResult.success ? (
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
              ) : (
                <XCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
              )}
              <h4 className="font-bold text-lg mb-4">
                {importResult.success ? 'تم الاستيراد!' : 'فشل الاستيراد'}
              </h4>
              <Button className="w-full" onClick={() => setShowImportModal(false)}>إغلاق</Button>
            </div>
          ) : null}
        </div>
      </Modal>
    </div>
  )
}