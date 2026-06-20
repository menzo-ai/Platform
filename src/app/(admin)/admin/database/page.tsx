'use client'

import { useState } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Badge from '@/components/ui/badge'
import Modal from '@/components/ui/modal'
import { 
  Database,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Loader2,
  RefreshCw,
  HardDrive,
  Cloud,
  Server,
  Globe,
  Zap,
  FileJson,
  Users,
  BookOpen,
  Settings,
  MessageSquare
} from 'lucide-react'
import toast from 'react-hot-toast'

interface DatabaseProvider {
  id: string
  name: string
  icon: typeof Database
  color: string
}

const PROVIDERS: DatabaseProvider[] = [
  { id: 'sqlite', name: 'SQLite', icon: HardDrive, color: 'from-blue-500 to-blue-700' },
  { id: 'postgresql', name: 'PostgreSQL', icon: Database, color: 'from-blue-400 to-cyan-500' },
  { id: 'mysql', name: 'MySQL', icon: Server, color: 'from-orange-500 to-yellow-500' },
  { id: 'supabase', name: 'Supabase', icon: Cloud, color: 'from-emerald-500 to-green-600' },
  { id: 'neon', name: 'Neon', icon: Zap, color: 'from-purple-500 to-pink-500' },
]

interface ExportOption {
  id: string
  name: string
  description: string
  icon: typeof Database
}

export default function DatabaseManagementPage() {
  const [currentProvider, setCurrentProvider] = useState<string>('sqlite')
  const [showChangeModal, setShowChangeModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  const exportOptions: ExportOption[] = [
    { id: 'all', name: 'جميع البيانات', description: 'تصدير جميع بيانات المنصة (ما عدا حساب الأدمن)', icon: Database },
    { id: 'users', name: 'بيانات المستخدمين', description: 'تصدير بيانات الطلاب والمستخدمين', icon: Users },
    { id: 'courses', name: 'الكورسات والمحاضرات', description: 'تصدير الكورسات والفصول والمحاضرات', icon: BookOpen },
    { id: 'settings', name: 'إعدادات المنصة', description: 'تصدير إعدادات المنصة العامة', icon: Settings },
    { id: 'ai', name: 'بيانات الذكاء الاصطناعي', description: 'تصدير محادثات وإعدادات AI', icon: MessageSquare },
  ]

  const handleExport = async (type: string) => {
    setExporting(true)
    try {
      const response = await fetch(`/api/admin/database/export?type=${type}`)
      if (response.ok) {
        const data = await response.json()
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `gelvano-${type}-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success('تم تصدير البيانات بنجاح!')
      } else {
        throw new Error('Export failed')
      }
    } catch (error) {
      toast.error('فشل تصدير البيانات')
    }
    setExporting(false)
    setShowExportModal(false)
  }

  const handleImport = async (file: File) => {
    setImporting(true)
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      
      const response = await fetch('/api/admin/database/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        toast.success('تم استيراد البيانات بنجاح!')
      } else {
        throw new Error('Import failed')
      }
    } catch (error) {
      toast.error('فشل استيراد البيانات')
    }
    setImporting(false)
    setShowImportModal(false)
  }

  const handleDeleteDatabase = async () => {
    if (deleteConfirmText !== 'احذف الكل') {
      toast.error('يرجى كتابة "احذف الكل" للتأكيد')
      return
    }

    try {
      const response = await fetch('/api/admin/database', {
        method: 'DELETE'
      })
      
      if (response.ok) {
        toast.success('تم حذف جميع البيانات!')
        window.location.href = '/setup/database'
      } else {
        throw new Error('Delete failed')
      }
    } catch (error) {
      toast.error('فشل حذف البيانات')
    }
  }

  const currentProviderData = PROVIDERS.find(p => p.id === currentProvider)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Database className="w-7 h-7 text-primary" />
          إدارة قاعدة البيانات
        </h1>
        <p className="text-slate-400 mt-1">إدارة وتصدير واستيراد بيانات المنصة</p>
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-bold flex items-center gap-2">
            <Server className="w-5 h-5 text-primary" />
            قاعدة البيانات الحالية
          </h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${currentProviderData?.color || 'from-slate-500 to-slate-600'} flex items-center justify-center`}>
                {currentProviderData?.icon && <currentProviderData.icon className="w-7 h-7 text-white" />}
              </div>
              <div>
                <h4 className="font-bold text-lg">{currentProviderData?.name || 'غير محدد'}</h4>
                <p className="text-sm text-slate-400">متصل ويعمل</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                متصل
              </Badge>
              <Button variant="outline" onClick={() => setShowChangeModal(true)}>
                <RefreshCw className="w-4 h-4 ml-2" />
                تغيير
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setShowExportModal(true)}>
          <CardContent className="p-6 text-center">
            <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Download className="w-7 h-7 text-blue-400" />
            </div>
            <h4 className="font-bold mb-2">تصدير البيانات</h4>
            <p className="text-sm text-slate-400">تحميل نسخة احتياطية من البيانات</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setShowImportModal(true)}>
          <CardContent className="p-6 text-center">
            <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-7 h-7 text-emerald-400" />
            </div>
            <h4 className="font-bold mb-2">استيراد البيانات</h4>
            <p className="text-sm text-slate-400">رفع نسخة احتياطية سابقة</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-red-500/50 transition-colors" onClick={() => setShowDeleteModal(true)}>
          <CardContent className="p-6 text-center">
            <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-400" />
            </div>
            <h4 className="font-bold mb-2">حذف البيانات</h4>
            <p className="text-sm text-slate-400">حذف جميع البيانات نهائياً</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-bold flex items-center gap-2">
            <FileJson className="w-5 h-5 text-primary" />
            إحصائيات البيانات
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-xl text-center">
              <p className="text-2xl font-bold text-primary">0</p>
              <p className="text-sm text-slate-400">مستخدم</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl text-center">
              <p className="text-2xl font-bold text-emerald-400">0</p>
              <p className="text-sm text-slate-400">كورس</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl text-center">
              <p className="text-2xl font-bold text-amber-400">0</p>
              <p className="text-sm text-slate-400">محاضرة</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl text-center">
              <p className="text-2xl font-bold text-blue-400">0</p>
              <p className="text-sm text-slate-400">محادثة AI</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={showChangeModal} onClose={() => setShowChangeModal(false)} title="تغيير قاعدة البيانات" size="lg">
        <div className="space-y-4">
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-400">تحذير!</p>
                <p className="text-slate-400">تغيير قاعدة البيانات سيؤدي لحذف جميع البيانات الحالية.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                onClick={() => setCurrentProvider(provider.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  currentProvider === provider.id
                    ? 'border-primary bg-primary/10'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${provider.color} flex items-center justify-center mx-auto mb-2`}>
                  <provider.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-medium">{provider.name}</p>
              </button>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowChangeModal(false)} className="flex-1">
              إلغاء
            </Button>
            <Button onClick={() => {
              setShowChangeModal(false)
              window.location.href = '/setup/database'
            }} className="flex-1 bg-primary">
              تغيير قاعدة البيانات
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showExportModal} onClose={() => setShowExportModal(false)} title="تصدير البيانات" size="lg">
        <div className="space-y-3">
          {exportOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleExport(option.id)}
              disabled={exporting}
              className="w-full p-4 rounded-xl border border-slate-700 hover:border-primary/50 transition-all text-right"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <option.icon className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{option.name}</p>
                  <p className="text-xs text-slate-400">{option.description}</p>
                </div>
                {exporting && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
              </div>
            </button>
          ))}
        </div>
      </Modal>

      <Modal isOpen={showImportModal} onClose={() => setShowImportModal(false)} title="استيراد البيانات" size="lg">
        <div className="space-y-4">
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-400">تنبيه!</p>
                <p className="text-slate-400">استيراد البيانات سيستبدل البيانات الحالية. تأكد من نسخة احتياطية أولاً.</p>
              </div>
            </div>
          </div>

          <label className="block">
            <input
              type="file"
              accept=".json"
              onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])}
              className="hidden"
            />
            <div className="p-8 border-2 border-dashed border-slate-700 rounded-xl text-center cursor-pointer hover:border-primary/50 transition-colors">
              {importing ? (
                <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
              ) : (
                <>
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="font-medium">اضغط لاختيار ملف</p>
                  <p className="text-xs text-slate-400">ملفات JSON فقط</p>
                </>
              )}
            </div>
          </label>
        </div>
      </Modal>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="حذف جميع البيانات" size="lg">
        <div className="space-y-4">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-red-400">هذا الإجراء لا يمكن التراجع عنه!</p>
                <p className="text-slate-400">سيتم حذف جميع البيانات نهائياً بما في ذلك:</p>
                <ul className="mt-2 space-y-1 text-slate-400">
                  <li>• جميع حسابات المستخدمين</li>
                  <li>• جميع الكورسات والمحاضرات</li>
                  <li>• جميع إعدادات المنصة</li>
                  <li>• جميع بيانات الذكاء الاصطناعي</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              اكتب "احذف الكل" للتأكيد:
            </label>
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="احذف الكل"
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)} className="flex-1">
              إلغاء
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteDatabase}
              disabled={deleteConfirmText !== 'احذف الكل'}
              className="flex-1"
            >
              <Trash2 className="w-4 h-4 ml-2" />
              تأكيد الحذف
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
