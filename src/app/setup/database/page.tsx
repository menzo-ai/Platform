'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Card, { CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { 
  Database,
  HardDrive,
  Cloud,
  Server,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Key,
  Globe,
  Lock,
  Zap
} from 'lucide-react'
import toast from 'react-hot-toast'

interface DatabaseConfig {
  type: string
  url?: string
  apiKey?: string
  jwtSecret?: string
  publishableKey?: string
  secretKey?: string
  projectId?: string
  connectionString?: string
  authToken?: string
  accountId?: string
  databaseBranch?: string
  databaseUrl?: string
}

interface DatabaseProvider {
  id: string
  name: string
  icon: typeof Database
  color: string
  description: string
  fields: {
    name: string
    key: string
    type: 'text' | 'password'
    placeholder: string
    required: boolean
    helpText?: string
    docsUrl?: string
  }[]
  docsUrl: string
}

const DATABASE_PROVIDERS: DatabaseProvider[] = [
  {
    id: 'sqlite',
    name: 'SQLite',
    icon: HardDrive,
    color: 'from-blue-500 to-blue-700',
    description: 'تخزين محلي في الملفات - لا يحتاج إعدادات إضافية',
    fields: [],
    docsUrl: 'https://www.sqlite.org/'
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    icon: Database,
    color: 'from-blue-400 to-cyan-500',
    description: 'قاعدة بيانات قوية وموثوقة - مثالية للإنتاج',
    fields: [
      { name: 'رابط الاتصال', key: 'url', type: 'text', placeholder: 'postgresql://user:pass@host:5432/db', required: true, helpText: 'رابط اتصال PostgreSQL الكامل' },
      { name: 'JWT Secret', key: 'jwtSecret', type: 'password', placeholder: 'أدخل JWT Secret', required: false, helpText: 'مفتاح سري لتشفير البيانات' }
    ],
    docsUrl: 'https://www.postgresql.org/docs/'
  },
  {
    id: 'mysql',
    name: 'MySQL',
    icon: Server,
    color: 'from-orange-500 to-yellow-500',
    description: 'قاعدة بيانات شائعة وسريعة',
    fields: [
      { name: 'رابط الاتصال', key: 'url', type: 'text', placeholder: 'mysql://user:pass@host:3306/db', required: true, helpText: 'رابط اتصال MySQL الكامل' },
      { name: 'JWT Secret', key: 'jwtSecret', type: 'password', placeholder: 'أدخل JWT Secret', required: false }
    ],
    docsUrl: 'https://dev.mysql.com/doc/'
  },
  {
    id: 'mongodb',
    name: 'MongoDB Atlas',
    icon: Database,
    color: 'from-green-500 to-emerald-600',
    description: 'قاعدة بيانات NoSQL مرنة وقابلة للتوسع',
    fields: [
      { name: 'Connection URI', key: 'uri', type: 'password', placeholder: 'mongodb+srv://user:pass@cluster.mongodb.net', required: true, helpText: 'رابط اتصال MongoDB Atlas' },
      { name: 'Database Name', key: 'dbName', type: 'text', placeholder: 'myapp', required: true, helpText: 'اسم قاعدة البيانات' }
    ],
    docsUrl: 'https://www.mongodb.com/atlas/docs'
  },
  {
    id: 'neon',
    name: 'Neon',
    icon: Zap,
    color: 'from-purple-500 to-pink-500',
    description: 'PostgreSQL Serverless مع branching',
    fields: [
      { name: 'Connection String', key: 'connectionString', type: 'text', placeholder: 'postgresql://user:pass@ep-xxx.region.aws.neon.tech/db', required: true, helpText: 'رابط اتصال Neon' },
      { name: 'JWT Secret', key: 'jwtSecret', type: 'password', placeholder: 'أدخل JWT Secret', required: false }
    ],
    docsUrl: 'https://neon.tech/docs'
  },
  {
    id: 'turso',
    name: 'Turso',
    icon: Globe,
    color: 'from-teal-500 to-cyan-500',
    description: 'LibSQL Serverless - نسخة محسنة من SQLite',
    fields: [
      { name: 'Database URL', key: 'databaseUrl', type: 'text', placeholder: 'libsql://xxx.turso.io', required: true, helpText: 'رابط قاعدة البيانات' },
      { name: 'Auth Token', key: 'authToken', type: 'password', placeholder: 'أدخل Auth Token', required: true, helpText: 'رمز المصادقة من Turso' }
    ],
    docsUrl: 'https://docs.turso.tech/'
  },
  {
    id: 'upstash',
    name: 'Upstash',
    icon: Server,
    color: 'from-orange-400 to-red-500',
    description: 'Redis Serverless للـ caching',
    fields: [
      { name: 'UPSTASH_REDIS_REST_URL', key: 'url', type: 'text', placeholder: 'https://xxx.upstash.io', required: true },
      { name: 'UPSTASH_REDIS_REST_TOKEN', key: 'authToken', type: 'password', placeholder: 'أدخل Token', required: true }
    ],
    docsUrl: 'https://upstash.com/docs'
  }
]

export default function DatabaseSetupPage() {
  const router = useRouter()
  const [selectedProvider, setSelectedProvider] = useState<string>('')
  const [config, setConfig] = useState<DatabaseConfig>({ type: '' })
  const [testing, setTesting] = useState(false)
  const [testingResult, setTestingResult] = useState<{ success: boolean; message: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [step, setStep] = useState<'select' | 'config' | 'confirm'>('select')

  const handleSelectProvider = (providerId: string) => {
    setSelectedProvider(providerId)
    setConfig({ type: providerId })
    setTestingResult(null)
    setStep('config')
  }

  const updateConfig = (key: string, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const testConnection = async () => {
    setTesting(true)
    setTestingResult(null)

    try {
      const response = await fetch('/api/setup/database/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        setTestingResult({ success: true, message: data.message || 'تم الاتصال بنجاح!' })
        toast.success('تم اختبار الاتصال بنجاح!')
      } else {
        setTestingResult({ success: false, message: data.message || 'فشل الاتصال' })
        toast.error('فشل الاتصال بالداتاباس')
      }
    } catch (error) {
      setTestingResult({ success: false, message: 'حدث خطأ في الاتصال' })
      toast.error('حدث خطأ في الاتصال')
    }

    setTesting(false)
  }

  const saveConfiguration = async () => {
    if (selectedProvider !== 'sqlite') {
      setStep('confirm')
      return
    }

    setSaving(true)

    try {
      const response = await fetch('/api/setup/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      if (response.ok) {
        toast.success('تم حفظ الإعدادات بنجاح!')
        router.push('/setup/admin')
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      toast.error('حدث خطأ في الحفظ')
    }

    setSaving(false)
  }

  const confirmAndSave = async () => {
    setSaving(true)

    try {
      const response = await fetch('/api/setup/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...config, confirmed: true })
      })

      if (response.ok) {
        toast.success('تم حفظ الإعدادات بنجاح!')
        router.push('/setup/admin')
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      toast.error('حدث خطأ في الحفظ')
    }

    setSaving(false)
  }

  const selectedProviderData = DATABASE_PROVIDERS.find(p => p.id === selectedProvider)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mx-auto mb-4">
            <Database className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">اختر قاعدة البيانات</h1>
          <p className="text-slate-400">حدد نوع قاعدة البيانات التي تريد استخدامها</p>
        </div>

        {step === 'select' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DATABASE_PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleSelectProvider(provider.id)}
                className={`p-6 rounded-2xl border-2 transition-all text-right ${
                  selectedProvider === provider.id
                    ? 'border-primary bg-primary/10'
                    : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                }`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${provider.color} flex items-center justify-center mb-4`}>
                  <provider.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{provider.name}</h3>
                <p className="text-sm text-slate-400 mb-3">{provider.description}</p>
                <a 
                  href={provider.docsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3 h-3" />
                  الوثائق
                </a>
              </button>
            ))}
          </div>
        )}

        {step === 'config' && selectedProviderData && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedProviderData.color} flex items-center justify-center`}>
                    <selectedProviderData.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedProviderData.name}</h2>
                    <p className="text-sm text-slate-400">{selectedProviderData.description}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedProvider('')
                      setConfig({ type: '' })
                      setStep('select')
                    }}
                    className="mr-auto"
                  >
                    تغيير
                  </Button>
                </div>

                {selectedProviderData.fields.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold mb-2">لا تحتاج أي إعدادات!</h3>
                    <p className="text-slate-400">SQLite يستخدم تخزين محلي في الملفات</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedProviderData.fields.map((field) => (
                      <div key={field.key}>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                          {field.name}
                          {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <div className="relative">
                          <Input
                            type={field.type}
                            placeholder={field.placeholder}
                            value={config[field.key as keyof DatabaseConfig] as string || ''}
                            onChange={(e) => updateConfig(field.key, e.target.value)}
                            className={field.type === 'password' ? 'pl-10' : ''}
                          />
                          {field.type === 'password' && (
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        {field.helpText && (
                          <p className="text-xs text-slate-500 mt-1">{field.helpText}</p>
                        )}
                        {field.docsUrl && (
                          <a 
                            href={field.docsUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            احصل على هذه المعلومات
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {testingResult && (
                  <div className={`mt-6 p-4 rounded-xl ${
                    testingResult.success 
                      ? 'bg-emerald-500/10 border border-emerald-500/30' 
                      : 'bg-red-500/10 border border-red-500/30'
                  }`}>
                    <div className="flex items-center gap-2">
                      {testingResult.success ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      )}
                      <span>{testingResult.message}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  {selectedProvider !== 'sqlite' && (
                    <Button
                      variant="outline"
                      onClick={testConnection}
                      disabled={testing || selectedProviderData.fields.some(f => f.required && !config[f.key as keyof DatabaseConfig])}
                      className="flex-1"
                    >
                      {testing ? (
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      ) : (
                        <Database className="w-4 h-4 ml-2" />
                      )}
                      اختبار الاتصال
                    </Button>
                  )}
                  <Button
                    onClick={saveConfiguration}
                    disabled={saving || (selectedProvider !== 'sqlite' && !testingResult?.success)}
                    className="flex-1"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 ml-2" />
                    )}
                    حفظ ومتابعة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-6">
            <Card className="border-2 border-red-500/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-red-400 mb-2">تحذير مهم!</h2>
                    <p className="text-slate-300 mb-4">
                      تغيير قاعدة البيانات سيؤدي إلى:
                    </p>
                    <ul className="space-y-2 text-slate-400 mb-4">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full" />
                        حذف جميع المعلومات في قاعدة البيانات الحالية
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full" />
                        حذف جميع حسابات المستخدمين
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full" />
                        حذف جميع الكورسات والمحاضرات
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full" />
                        حذف جميع إعدادات المنصة
                      </li>
                    </ul>
                    <p className="text-amber-400 font-medium">
                      سيتم توجيهك لإنشاء حساب الأدمن مرة أخرى.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setStep('config')}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                  <Button
                    variant="danger"
                    onClick={confirmAndSave}
                    disabled={saving}
                    className="flex-1"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 ml-2" />
                    )}
                    أنا متأكد - المتابعة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
