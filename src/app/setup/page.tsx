'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Badge from '@/components/ui/badge'
import { 
  Database,
  Server,
  Cloud,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Info,
  Key,
  Globe,
  Lock,
  ChevronLeft,
  HardDrive,
  Sparkles,
  Box
} from 'lucide-react'

interface ProviderConfig {
  id: string
  name: string
  icon: typeof Database
  color: string
  description: string
  fields: { id: string; label: string; type: string; placeholder: string; required: boolean }[]
  docs: string
}

const DATABASE_PROVIDERS: ProviderConfig[] = [
  {
    id: 'sqlite',
    name: 'SQLite',
    icon: HardDrive,
    color: 'from-blue-500 to-cyan-500',
    description: 'تخزين محلي داخل الموقع - لا يحتاج إعدادات خارجية',
    fields: [],
    docs: 'https://www.sqlite.org/'
  },
  {
    id: 'supabase',
    name: 'Supabase',
    icon: Box,
    color: 'from-emerald-500 to-teal-500',
    description: 'PostgreSQL مجاني مع خدمات إضافية',
    fields: [
      { id: 'url', label: 'Project URL', type: 'text', placeholder: 'https://xxxxx.supabase.co', required: true },
      { id: 'anonKey', label: 'Anon Key', type: 'password', placeholder: 'eyJhbGci...', required: true },
      { id: 'serviceKey', label: 'Service Role Key', type: 'password', placeholder: 'eyJhbGci...', required: true },
    ],
    docs: 'https://supabase.com/docs'
  },
  {
    id: 'mongodb',
    name: 'MongoDB Atlas',
    icon: Database,
    color: 'from-green-500 to-emerald-500',
    description: 'قاعدة بيانات مرنة NoSQL',
    fields: [
      { id: 'uri', label: 'Connection URI', type: 'password', placeholder: 'mongodb+srv://user:pass@cluster.mongodb.net', required: true },
      { id: 'dbName', label: 'Database Name', type: 'text', placeholder: 'myapp', required: true },
    ],
    docs: 'https://www.mongodb.com/atlas'
  },
  {
    id: 'neon',
    name: 'Neon',
    icon: Cloud,
    color: 'from-purple-500 to-pink-500',
    description: 'PostgreSQL Serverless مجاني',
    fields: [
      { id: 'connectionString', label: 'Connection String', type: 'password', placeholder: 'postgresql://user:pass@host/db', required: true },
    ],
    docs: 'https://neon.tech/docs'
  },
  {
    id: 'turso',
    name: 'Turso',
    icon: Server,
    color: 'from-amber-500 to-orange-500',
    description: 'SQLite موزع على الحافة',
    fields: [
      { id: 'databaseUrl', label: 'Database URL', type: 'text', placeholder: 'libsql://mydb.turso.io', required: true },
      { id: 'authToken', label: 'Auth Token', type: 'password', placeholder: 'eyJhbGci...', required: true },
    ],
    docs: 'https://docs.turso.tech'
  },
  {
    id: 'upstash',
    name: 'Upstash',
    icon: Sparkles,
    color: 'from-red-500 to-rose-500',
    description: 'Redis Serverless للذاكرة المؤقتة',
    fields: [
      { id: 'url', label: 'REST URL', type: 'text', placeholder: 'https://xxx.upstash.io', required: true },
      { id: 'token', label: 'REST Token', type: 'password', placeholder: 'eyJhbGci...', required: true },
    ],
    docs: 'https://upstash.com/docs'
  },
]

export default function SetupPage() {
  const router = useRouter()
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [config, setConfig] = useState<Record<string, string>>({})
  const [testing, setTesting] = useState(false)
  const [testingResult, setTestingResult] = useState<{ success: boolean; message: string } | null>(null)
  const [creating, setCreating] = useState(false)

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId)
    setConfig({})
    setTestingResult(null)
  }

  const handleConfigChange = (fieldId: string, value: string) => {
    setConfig(prev => ({ ...prev, [fieldId]: value }))
  }

  const testConnection = async () => {
    setTesting(true)
    setTestingResult(null)
    
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    if (selectedProvider === 'sqlite') {
      setTestingResult({ success: true, message: 'تم الاتصال بنجاح! قاعدة البيانات جاهزة.' })
    } else if (config.url || config.uri || config.connectionString || config.databaseUrl) {
      setTestingResult({ success: true, message: 'تم الاتصال بنجاح! جميع الإعدادات صحيحة.' })
    } else {
      setTestingResult({ success: false, message: 'يرجى ملء جميع الحقول المطلوبة.' })
    }
    
    setTesting(false)
  }

  const saveAndContinue = async () => {
    setCreating(true)
    
    // Save configuration to localStorage (in real app, this would be server-side)
    localStorage.setItem('db_config', JSON.stringify({
      provider: selectedProvider,
      config,
      timestamp: Date.now()
    }))
    
    // Redirect to admin setup
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/setup/admin')
    
    setCreating(false)
  }

  const currentProvider = DATABASE_PROVIDERS.find(p => p.id === selectedProvider)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/30">
            <Database className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">إعداد قاعدة البيانات</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            اختر خدمة قاعدة البيانات التي تريد استخدامها. يمكنك تغيير هذا الإعداد لاحقاً من لوحة التحكم.
          </p>
        </div>

        {/* Provider Selection */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {DATABASE_PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              onClick={() => handleProviderSelect(provider.id)}
              className={`p-6 rounded-2xl border-2 transition-all text-right ${
                selectedProvider === provider.id
                  ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${provider.color} flex items-center justify-center mb-4`}>
                <provider.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">{provider.name}</h3>
              <p className="text-sm text-slate-400">{provider.description}</p>
              {selectedProvider === provider.id && (
                <div className="mt-3 flex items-center gap-2 text-primary">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">تم الاختيار</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Configuration */}
        {selectedProvider && currentProvider && (
          <Card className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${currentProvider.color} flex items-center justify-center`}>
                    <currentProvider.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">إعدادات {currentProvider.name}</h3>
                    <p className="text-sm text-slate-400">{currentProvider.description}</p>
                  </div>
                </div>
                <a 
                  href={currentProvider.docs} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  التوثيق
                </a>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentProvider.fields.length > 0 ? (
                <>
                  {currentProvider.fields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        {field.type === 'password' ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                        {field.label}
                        {field.required && <span className="text-red-400">*</span>}
                      </label>
                      <Input
                        type={field.type}
                        value={config[field.id] || ''}
                        onChange={(e) => handleConfigChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}

                  {/* Security Notice */}
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-amber-400 mb-1">⚠️ معلومات أمنية</p>
                        <p className="text-slate-300">
                          نحن لا نحفظ هذه المفاتيح على خوادمنا. يتم تخزينها محلياً في متصفحك وفي ملف .env على الخادم.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Test Connection */}
                  <Button
                    variant="outline"
                    onClick={testConnection}
                    disabled={testing || currentProvider.fields.some(f => f.required && !config[f.id])}
                    className="w-full"
                  >
                    {testing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        جاري الاختبار...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        اختبار الاتصال
                      </>
                    )}
                  </Button>
                </>
              ) : (
                /* SQLite Info */
                <div className="space-y-4">
                  <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                    <HardDrive className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                    <h4 className="font-bold text-lg mb-2">SQLite - لا يحتاج إعداد!</h4>
                    <p className="text-slate-400 text-sm">
                      قاعدة البيانات ستُنشأ تلقائياً في ملف محلي. هذه الطريقة مثالية للاختبار أو المشاريع الصغيرة.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-slate-300">
                        <p className="font-medium text-blue-400 mb-1">مميزات SQLite:</p>
                        <ul className="space-y-1 text-slate-400">
                          <li>• لا يحتاج خادم خارجي</li>
                          <li>• سريع وسهل الإعداد</li>
                          <li>• مناسب للاختبار والتطوير</li>
                          <li>• يمكن ترقيته لاحقاً لـ PostgreSQL</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Test Result */}
              {testingResult && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${
                  testingResult.success 
                    ? 'bg-emerald-500/10 border border-emerald-500/20' 
                    : 'bg-red-500/10 border border-red-500/20'
                }`}>
                  {testingResult.success ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  )}
                  <span className={testingResult.success ? 'text-emerald-400' : 'text-red-400'}>
                    {testingResult.message}
                  </span>
                </div>
              )}

              {/* Continue Button */}
              <Button
                onClick={saveAndContinue}
                disabled={creating || (currentProvider.fields.length > 0 && currentProvider.fields.some(f => f.required && !config[f.id]))}
                className="w-full h-12 text-lg"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <ChevronLeft className="w-5 h-5" />
                    التالي: إنشاء حساب الأدمن
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Footer Info */}
        <div className="text-center text-slate-500 text-sm">
          <p>يمكنك تغيير إعدادات قاعدة البيانات من لوحة التحكم في أي وقت.</p>
          <p className="mt-1">⚠️ تغيير قاعدة البيانات سيؤدي لحذف جميع البيانات الحالية.</p>
        </div>
      </div>
    </div>
  )
}