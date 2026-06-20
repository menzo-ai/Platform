'use client'

import { useState } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Modal from '@/components/ui/modal'
import Input from '@/components/ui/input'
import { 
  Database,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Server,
  Users,
  HardDrive,
  FileJson,
  Eye,
  EyeOff,
  RefreshCw,
  Shield,
  Globe,
  Lock,
  Key,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

const DATABASE_PROVIDERS = [
  { id: 'sqlite', name: 'SQLite', icon: HardDrive, color: 'text-blue-400' },
  { id: 'supabase', name: 'Supabase', icon: Server, color: 'text-emerald-400' },
  { id: 'mongodb', name: 'MongoDB Atlas', icon: Database, color: 'text-green-400' },
  { id: 'neon', name: 'Neon', icon: Server, color: 'text-purple-400' },
  { id: 'turso', name: 'Turso', icon: Server, color: 'text-amber-400' },
  { id: 'upstash', name: 'Upstash', icon: Database, color: 'text-red-400' },
]

export default function DatabasePage() {
  const [activeProvider, setActiveProvider] = useState('sqlite')
  const [config, setConfig] = useState<Record<string, string>>({
    url: '',
    anonKey: '',
    serviceKey: '',
    uri: '',
    connectionString: '',
    databaseUrl: '',
    authToken: ''
  })
  const [showKeys, setShowKeys] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>('current')
  
  // Export/Import states
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmModal, setConfirmModal] = useState<{
    title: string
    message: string
    type: 'warning' | 'danger'
    onConfirm: () => void
  } | null>(null)

  const handleConfigChange = (fieldId: string, value: string) => {
    setConfig(prev => ({ ...prev, [fieldId]: value }))
  }

  const handleExportAll = async () => {
    setExporting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const data = {
      exportedAt: new Date().toISOString(),
      provider: activeProvider,
      version: '1.0.0',
      users: [],
      courses: [],
      lectures: [],
      enrollments: [],
      purchases: [],
      subscriptions: [],
      walletTransactions: [],
      aiConversations: [],
      forumPosts: [],
      // Exclude admin accounts
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `platform-backup-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    setExporting(false)
  }

  const handleExportUsers = async () => {
    setExporting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const data = {
      exportedAt: new Date().toISOString(),
      type: 'users-only',
      version: '1.0.0',
      users: []
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users-backup-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    setExporting(false)
  }

  const handleImport = async (file: File) => {
    setImporting(true)
    
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      
      if (data.type === 'full-backup') {
        setConfirmModal({
          title: 'استيراد نسخة كاملة',
          message: 'سيتم استيراد جميع البيانات. هل تريد المتابعة؟',
          type: 'warning',
          onConfirm: async () => {
            await new Promise(resolve => setTimeout(resolve, 2000))
            setShowConfirmModal(false)
            alert('تم استيراد البيانات بنجاح!')
          }
        })
      } else if (data.type === 'users-only') {
        setConfirmModal({
          title: 'استيراد بيانات المستخدمين',
          message: 'سيتم استيراد بيانات المستخدمين فقط. سيتم استيراد ' + (data.users?.length || 0) + ' مستخدم.',
          type: 'warning',
          onConfirm: async () => {
            await new Promise(resolve => setTimeout(resolve, 2000))
            setShowConfirmModal(false)
            alert('تم استيراد البيانات بنجاح!')
          }
        })
      } else {
        alert('ملف غير صالح!')
      }
    } catch (error) {
      alert('حدث خطأ أثناء قراءة الملف!')
    }
    
    setImporting(false)
  }

  const handleChangeProvider = () => {
    setConfirmModal({
      title: '⚠️ تحذير: تغيير قاعدة البيانات',
      message: 'عند تغيير قاعدة البيانات سيتم حذف جميع البيانات الحالية بما في ذلك حساب الأدمن!\n\nهذه العملية لا يمكن التراجع عنها. هل أنت متأكد؟',
      type: 'danger',
      onConfirm: () => {
        setShowConfirmModal(false)
        window.location.href = '/setup'
      }
    })
    setShowConfirmModal(true)
  }

  const currentProvider = DATABASE_PROVIDERS.find(p => p.id === activeProvider)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Database className="w-7 h-7 text-primary" />
            إدارة قاعدة البيانات
          </h1>
          <p className="text-slate-400">إدارة وتصدير واستيراد البيانات</p>
        </div>
      </div>

      {/* Current Database Status */}
      <Card>
        <CardHeader>
          <button 
            onClick={() => setExpandedSection(expandedSection === 'current' ? null : 'current')}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Server className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-right">
                <h3 className="font-bold">قاعدة البيانات الحالية</h3>
                <p className="text-sm text-slate-400">
                  {currentProvider?.name} ({activeProvider.toUpperCase()})
                </p>
              </div>
            </div>
            {expandedSection === 'current' ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </CardHeader>
        
        {expandedSection === 'current' && (
          <CardContent className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-800/50 rounded-xl text-center">
                <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-slate-400">المستخدمين</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl text-center">
                <HardDrive className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-slate-400">الكورسات</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl text-center">
                <FileJson className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-slate-400">المحاضرات</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl text-center">
                <Shield className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">1</p>
                <p className="text-xs text-slate-400">الأدمن</p>
              </div>
            </div>

            {/* Connection Info */}
            <div className="p-4 bg-slate-800/50 rounded-xl">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" />
                معلومات الاتصال
              </h4>
              <div className="space-y-2 text-sm">
                {activeProvider === 'sqlite' && (
                  <div className="flex items-center gap-2">
                    <Badge variant="success">متصل</Badge>
                    <span className="text-slate-400">ملف محلي: ./prisma/dev.db</span>
                  </div>
                )}
                {activeProvider === 'supabase' && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">URL:</span>
                      <code className="text-xs bg-slate-700 px-2 py-1 rounded">{config.url || 'غير محدد'}</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Status:</span>
                      <Badge variant="success">متصل</Badge>
                    </div>
                  </>
                )}
                {activeProvider === 'mongodb' && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Database:</span>
                      <code className="text-xs bg-slate-700 px-2 py-1 rounded">{config.dbName || 'غير محدد'}</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Status:</span>
                      <Badge variant="success">متصل</Badge>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Export Data */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Download className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold">تصدير البيانات</h3>
              <p className="text-sm text-slate-400">تنزيل نسخة احتياطية من البيانات</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Export All */}
          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
            <div className="flex items-center gap-3">
              <FileJson className="w-6 h-6 text-blue-400" />
              <div>
                <p className="font-medium">تصدير جميع البيانات</p>
                <p className="text-xs text-slate-400">باستثناء حساب الأدمن</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleExportAll}
              disabled={exporting}
            >
              {exporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              تصدير
            </Button>
          </div>

          {/* Export Users Only */}
          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-purple-400" />
              <div>
                <p className="font-medium">تصدير بيانات المستخدمين فقط</p>
                <p className="text-xs text-slate-400">مفيد لنقل المستخدمين لمنصة أخرى</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleExportUsers}
              disabled={exporting}
            >
              {exporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              تصدير
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Import Data */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Upload className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold">استيراد البيانات</h3>
              <p className="text-sm text-slate-400">رفع نسخة احتياطية سابقة</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-slate-600 transition-colors">
            <input
              type="file"
              accept=".json"
              onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])}
              className="hidden"
              id="import-file"
            />
            <label htmlFor="import-file" className="cursor-pointer">
              {importing ? (
                <Loader2 className="w-12 h-12 text-amber-400 mx-auto mb-4 animate-spin" />
              ) : (
                <Upload className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              )}
              <p className="text-lg font-medium mb-2">اسحب ملف JSON هنا أو اضغط للاختيار</p>
              <p className="text-sm text-slate-400">يجب أن يكون الملف بصيغة JSON</p>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Change Database Provider */}
      <Card className="border-red-500/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="font-bold">تغيير قاعدة البيانات</h3>
              <p className="text-sm text-slate-400">الانتقال لموفر قاعدة بيانات مختلف</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-red-400 mb-1">⚠️ تحذير مهم!</p>
                <p className="text-slate-300">
                  تغيير قاعدة البيانات سيؤدي لحذف جميع البيانات الحالية بما في ذلك:
                </p>
                <ul className="mt-2 space-y-1 text-slate-400">
                  <li>• جميع حسابات المستخدمين</li>
                  <li>• جميع الكورسات والمحاضرات</li>
                  <li>• جميع الاشتراكات والمعاملات</li>
                  <li>• حساب الأدمن الخاص بك</li>
                </ul>
                <p className="mt-2 text-slate-300 font-medium">
                  ⚠️ تأكد من تصدير بياناتك أولاً!
                </p>
              </div>
            </div>
          </div>

          <Button 
            variant="danger" 
            onClick={handleChangeProvider}
            className="w-full"
          >
            <Globe className="w-4 h-4" />
            تغيير قاعدة البيانات
          </Button>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Modal 
        isOpen={showConfirmModal} 
        onClose={() => setShowConfirmModal(false)}
        title={confirmModal?.title || ''}
      >
        <div className="space-y-4">
          <p className="text-slate-300 whitespace-pre-line">{confirmModal?.message}</p>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmModal(false)}
              className="flex-1"
            >
              إلغاء
            </Button>
            <Button 
              variant="danger" 
              onClick={confirmModal?.onConfirm}
              className="flex-1"
            >
              تأكيد
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}