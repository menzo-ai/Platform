'use client'

import { useState, useEffect } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import { 
  Brain,
  Settings,
  Zap,
  TestTube,
  Save,
  RotateCcw,
  Sparkles,
  Shield,
  CheckCircle,
  AlertCircle,
  Bot,
  Code,
  Search,
  Globe,
  Eye,
  EyeOff,
  Key,
  ChevronDown,
  ChevronUp,
  FileText,
  ToggleLeft,
  ToggleRight,
  Server,
  Cpu,
  Database,
  ExternalLink,
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'

// AI Services with their free models
const AI_SERVICES: Record<string, { name: string; icon: string; freeModels: string[]; allModels?: string[] }> = {
  openai: { 
    name: 'OpenAI', 
    icon: '🤖', 
    freeModels: ['gpt-4o-mini', 'gpt-4o'], 
    allModels: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'] 
  },
  anthropic: { 
    name: 'Anthropic', 
    icon: '🧠', 
    freeModels: ['claude-3-5-sonnet-latest', 'claude-3-haiku-latest'], 
    allModels: ['claude-3-5-sonnet-latest', 'claude-3-5-sonnet-20240620', 'claude-3-opus-latest', 'claude-3-haiku-latest'] 
  },
  deepseek: { 
    name: 'DeepSeek', 
    icon: '🔮', 
    freeModels: ['deepseek-chat'], 
    allModels: ['deepseek-chat', 'deepseek-coder'] 
  },
  gemini: { 
    name: 'Gemini', 
    icon: '✨', 
    freeModels: ['gemini-1.5-flash', 'gemini-1.5-pro'], 
    allModels: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro', 'gemini-pro'] 
  },
  azure: { 
    name: 'Azure AI', 
    icon: '☁️', 
    freeModels: ['gpt-4', 'gpt-4-turbo', 'gpt-35-turbo'], 
    allModels: ['gpt-4', 'gpt-4-turbo', 'gpt-35-turbo'] 
  },
  cohere: { 
    name: 'Cohere', 
    icon: '🌊', 
    freeModels: ['command-r-plus', 'command-r'], 
    allModels: ['command-r-plus', 'command-r', 'command'] 
  },
  groq: { 
    name: 'Groq', 
    icon: '⚡', 
    freeModels: ['llama-3.1-8b-instant', 'llama-3.1-70b-versatile', 'mixtral-8x7b-32768'], 
    allModels: ['llama-3.1-8b-instant', 'llama-3.1-70b-versatile', 'mixtral-8x7b-32768'] 
  },
  openrouter: { 
    name: 'OpenRouter', 
    icon: '🛤️', 
    freeModels: ['openrouter/auto', 'openai/gpt-4o-mini', 'anthropic/claude-3-haiku'], 
    allModels: ['openrouter/auto', 'openai/gpt-4o-mini', 'anthropic/claude-3-haiku'] 
  },
  fireworks: { 
    name: 'Fireworks AI', 
    icon: '🎆', 
    freeModels: ['accounts/fireworks/models/llama-v3-8b-instruct'], 
    allModels: ['accounts/fireworks/models/llama-v3-8b-instruct', 'accounts/fireworks/models/llama-v3-70b-instruct'] 
  },
  together: { 
    name: 'Together AI', 
    icon: '🤝', 
    freeModels: ['togethercomputer/llama-3-8b-chat-hf', 'togethercomputer/llama-3-70b-chat-hf'], 
    allModels: ['togethercomputer/llama-3-8b-chat-hf', 'togethercomputer/llama-3-70b-chat-hf'] 
  },
}

// Search Engines
const SEARCH_ENGINES = [
  { id: 'serper', name: 'Serper API', needsApiKey: true, url: 'https://serper.dev' },
  { id: 'tavily', name: 'Tavily AI', needsApiKey: true, url: 'https://tavily.com' },
  { id: 'jina', name: 'Jina AI Reader', needsApiKey: false, url: 'https://jina.ai/reader' },
  { id: 'exa', name: 'Exa AI', needsApiKey: true, url: 'https://exa.ai' },
  { id: 'ddgs', name: 'DDGS (DuckDuckGo)', needsApiKey: false, url: 'https://github.com/deedy5/ddgs' },
  { id: 'searxng', name: 'SearXNG', needsApiKey: false, url: 'https://github.com/searxng/searxng' },
  { id: 'none', name: 'بدون بحث', needsApiKey: false, url: '' },
]

interface AISettingsData {
  isEnabled: boolean
  service: string
  model: string
  freeModels: string[]
  apiKey: string
  searchEngine: string
  searchApiKey: string
  customPrompt: string
  testPrompt: string
  showTestPage: boolean
  deepThinkingModels: string[]
}

export default function AdminAISettingsPage() {
  // Main settings
  const [isEnabled, setIsEnabled] = useState(true)
  const [service, setService] = useState('openai')
  const [model, setModel] = useState('gpt-4o-mini')
  const [freeModels, setFreeModels] = useState<string[]>([])
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [deepThinkingModels, setDeepThinkingModels] = useState<string[]>([])
  
  // Search settings
  const [searchEngine, setSearchEngine] = useState('none')
  const [searchApiKey, setSearchApiKey] = useState('')
  const [showSearchApiKey, setShowSearchApiKey] = useState(false)
  
  // Prompts
  const [customPrompt, setCustomPrompt] = useState(`أنت مساعد تعليمي متخصص في الفيزياء للمرحلة الثانوية المصرية.
اسمك: مساعدك الذكي
المعلم: المعلم المختص

قواعدك:
1. أجب بالعربية فقط
2. استخدم أمثلة بسيطة ومفهومة
3. اشرح القوانين بالتفصيل
4. حل المسائل خطوة بخطوة
5. إذا لم تكن متأكداً، قل ذلك`)
  
  const [testPrompt, setTestPrompt] = useState(`أنشئ اختبار فيزياء للمرحلة الثانوية المصرية.
- المادة: {subject}
- عدد الأسئلة: {count}
- مستوى الصعوبة: {difficulty}
- الوصف: {description}

يجب أن يكون الاختبار:
1. متعدد الاختيارات (4 خيارات)
2. كل سؤال له إجابة صحيحة واحدة
3. متنوع في مستوى الصعوبة
4. يغطي أهم النقاط في المادة

أجب بصيغة JSON كالتالي:
{
  "questions": [
    {
      "question": "السؤال",
      "options": ["الخيار 1", "الخيار 2", "الخيار 3", "الخيار 4"],
      "correct": 0,
      "difficulty": "سهل/متوسط/صعب",
      "explanation": "شرح الإجابة"
    }
  ]
}`)

  // Test page settings
  const [showTestPage, setShowTestPage] = useState(true)
  
  // States
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['main', 'search', 'prompts', 'test']))

  // Load settings on mount
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/ai-settings')
      if (response.ok) {
        const data = await response.json()
        setIsEnabled(data.isEnabled ?? true)
        setService(data.service || 'openai')
        setModel(data.model || 'gpt-4o-mini')
        setFreeModels(data.freeModels ? JSON.parse(data.freeModels) : [])
        setApiKey(data.apiKey || '')
        setSearchEngine(data.searchEngine || 'none')
        setSearchApiKey(data.searchApiKey || '')
        setCustomPrompt(data.customPrompt || '')
        setTestPrompt(data.testPrompt || '')
        setShowTestPage(data.showTestPage ?? true)
        setDeepThinkingModels(data.deepThinkingModels ? JSON.parse(data.deepThinkingModels) : [])
      }
    } catch (error) {
      console.error('Error loading AI settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const handleServiceChange = (newService: string) => {
    setService(newService)
    const serviceData = AI_SERVICES[newService]
    if (serviceData) {
      setModel(serviceData.freeModels[0] || '')
      setFreeModels(serviceData.freeModels)
    }
  }

  const handleTestAPI = async () => {
    setTesting(true)
    setTestResult(null)
    
    try {
      const response = await fetch('/api/admin/ai-settings/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service,
          model,
          apiKey,
          searchEngine,
          searchApiKey
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setTestResult({
          success: true,
          message: data.message || `تم الاتصال بنجاح بخدمة ${AI_SERVICES[service]?.name || service}!`
        })
        toast.success('تم اختبار الاتصال بنجاح!')
      } else {
        const error = await response.json()
        throw new Error(error.message || 'فشل الاتصال')
      }
    } catch (error: any) {
      setTestResult({
        success: false,
        message: error.message || 'فشل الاتصال. تأكد من صحة API Key.'
      })
      toast.error('فشل الاتصال بالخدمة')
    }
    
    setTesting(false)
  }

  const handleSave = async () => {
    setSaving(true)
    
    try {
      const response = await fetch('/api/admin/ai-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isEnabled,
          service,
          model,
          freeModels: JSON.stringify(freeModels),
          apiKey,
          searchEngine,
          searchApiKey,
          customPrompt,
          testPrompt,
          showTestPage,
          deepThinkingModels: JSON.stringify(deepThinkingModels)
        })
      })
      
      if (response.ok) {
        toast.success('تم حفظ الإعدادات بنجاح!')
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء الحفظ')
    }
    
    setSaving(false)
  }

  const handleReset = () => {
    if (confirm('هل تريد إعادة تعيين جميع الإعدادات؟')) {
      setIsEnabled(true)
      setService('openai')
      setModel('gpt-4o-mini')
      setApiKey('')
      setSearchEngine('none')
      setSearchApiKey('')
      setShowTestPage(true)
      setFreeModels([])
      setDeepThinkingModels([])
      toast.success('تم إعادة تعيين الإعدادات')
    }
  }

  const currentService = AI_SERVICES[service] || { name: service, freeModels: [], allModels: [] }
  const currentSearchEngine = SEARCH_ENGINES.find(e => e.id === searchEngine)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <Brain className="w-7 h-7 text-primary" />
            إعدادات الذكاء الاصطناعي
          </h1>
          <p className="text-slate-400">إدارة المساعد الذكي وخدمة الاختبارات والبحث</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 ml-2" />
            إعادة تعيين
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90">
            {saving ? (
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 ml-2" />
            )}
            حفظ التغييرات
          </Button>
        </div>
      </div>

      {/* Main Status Toggle */}
      <Card className={`border-2 ${isEnabled ? 'border-emerald-500/30' : 'border-red-500/30'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isEnabled ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                <Bot className={`w-8 h-8 ${isEnabled ? 'text-emerald-400' : 'text-red-400'}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  المساعد الذكي 
                  <Badge variant={isEnabled ? 'success' : 'danger'}>
                    {isEnabled ? '🟢 مفعل' : '🔴 معطل'}
                  </Badge>
                </h3>
                <p className="text-sm text-slate-400">
                  {isEnabled 
                    ? 'يمكن للطلاب استخدام المساعد الذكي في الموقع'
                    : 'تم تعطيل المساعد الذكي - لن يظهر في الموقع'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsEnabled(!isEnabled)}
              className={`p-3 rounded-xl transition-all ${
                isEnabled 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {isEnabled ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* AI Service Selection */}
      <Card>
        <CardHeader>
          <button 
            onClick={() => toggleSection('main')}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold">اختيار خدمة الذكاء الاصطناعي</h3>
            </div>
            {expandedSections.has('main') ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </CardHeader>
        
        {expandedSections.has('main') && (
          <CardContent className="space-y-6">
            {/* Service Grid */}
            <div>
              <label className="block text-sm font-medium mb-3">الخدمة</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {Object.entries(AI_SERVICES).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => handleServiceChange(key)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      service === key 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-3xl mb-2 block">{data.icon}</span>
                    <span className="text-sm font-medium">{data.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                النموذج
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentService.allModels?.map((m) => (
                  <button
                    key={m}
                    onClick={() => setModel(m)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm text-right ${
                      model === m 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{m}</span>
                      {currentService.freeModels?.includes(m) && (
                        <Badge variant="success" className="text-xs">مجاني</Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* API Key */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Key className="w-4 h-4" />
                API Key
                <span className="text-xs text-slate-400">(لـ {currentService.name})</span>
              </label>
              <div className="relative">
                <Input 
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="أدخل API Key..."
                  className="pl-10"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {currentService.name}
              </p>
            </div>

            {/* Deep Thinking Models */}
            <div>
              <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                نماذج التفكير العميق
              </label>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400 mb-3">
                  حدد النماذج التي تدعم التفكير العميق (Deep Thinking). هذه النماذج ستظهر للمستخدمين خيار "التفكير العميق".
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentService.allModels?.map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        if (deepThinkingModels.includes(m)) {
                          setDeepThinkingModels(prev => prev.filter(x => x !== m))
                        } else {
                          setDeepThinkingModels(prev => [...prev, m])
                        }
                      }}
                      className={`px-3 py-2 rounded-lg border-2 transition-all text-sm flex items-center gap-2 ${
                        deepThinkingModels.includes(m) 
                          ? 'border-purple-500 bg-purple-500/10' 
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {deepThinkingModels.includes(m) && <CheckCircle className="w-4 h-4 text-purple-400" />}
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Test Button */}
            <Button 
              onClick={handleTestAPI} 
              disabled={testing}
              variant="outline"
              className="w-full"
            >
              {testing ? (
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              ) : (
                <TestTube className="w-4 h-4 ml-2" />
              )}
              اختبار الاتصال
            </Button>

            {testResult && (
              <div className={`p-4 rounded-lg ${
                testResult.success ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-red-500/10 border border-red-500/30'
              }`}>
                <div className="flex items-center gap-2">
                  {testResult.success ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Search Engine Settings */}
      <Card>
        <CardHeader>
          <button 
            onClick={() => toggleSection('search')}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold">إعدادات محرك البحث</h3>
            </div>
            {expandedSections.has('search') ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </CardHeader>
        
        {expandedSections.has('search') && (
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">محرك البحث</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SEARCH_ENGINES.map((engine) => (
                  <button
                    key={engine.id}
                    onClick={() => setSearchEngine(engine.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm ${
                      searchEngine === engine.id 
                        ? 'border-amber-500 bg-amber-500/10' 
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{engine.name}</span>
                      {engine.url && (
                        <a 
                          href={engine.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-white"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {currentSearchEngine?.needsApiKey && (
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  API Key
                  <span className="text-xs text-slate-400">(لـ {currentSearchEngine.name})</span>
                </label>
                <div className="relative">
                  <Input 
                    type={showSearchApiKey ? 'text' : 'password'}
                    value={searchApiKey} 
                    onChange={(e) => setSearchApiKey(e.target.value)}
                    placeholder="أدخل API Key لمحرك البحث..."
                    className="pl-10"
                  />
                  <button
                    onClick={() => setShowSearchApiKey(!showSearchApiKey)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showSearchApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-300">
                  <p className="font-medium mb-1">ما هو DDGS؟</p>
                  <p className="text-slate-400">
                    DDGS هي مكتبة للبحث تجمع نتائج من محركات بحث متعددة (Google, Bing, DuckDuckGo...)
                    بدون الحاجة لـ API Key. يمكن استخدامها مباشرة أو مع SearXNG.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Custom Prompts */}
      <Card>
        <CardHeader>
          <button 
            onClick={() => toggleSection('prompts')}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Code className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold">التعليمات المخصصة (Prompts)</h3>
            </div>
            {expandedSections.has('prompts') ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </CardHeader>
        
        {expandedSections.has('prompts') && (
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  Prompt المساعد الذكي
                </label>
                <Badge variant="info">يستخدم في المحادثات</Badge>
              </div>
              <Textarea 
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={10}
                className="font-mono text-sm"
                placeholder="أدخل التعليمات التي يتبعها المساعد الذكي..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Prompt الاختبارات
                </label>
                <Badge variant="info">يستخدم في توليد الاختبارات</Badge>
              </div>
              <Textarea 
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                rows={10}
                className="font-mono text-sm"
                placeholder="أدخل تعليمات توليد الاختبارات..."
              />
              <div className="p-3 bg-slate-800/50 rounded-lg mt-3">
                <p className="text-xs text-slate-400 font-medium mb-2">المتغيرات المتاحة:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="info">{'{subject}'} - المادة</Badge>
                  <Badge variant="info">{'{count}'} - عدد الأسئلة</Badge>
                  <Badge variant="info">{'{difficulty}'} - مستوى الصعوبة</Badge>
                  <Badge variant="info">{'{time}'} - الوقت</Badge>
                  <Badge variant="info">{'{description}'} - وصف الاختبار</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Test Page Settings */}
      <Card className={showTestPage ? 'border-amber-500/30' : ''}>
        <CardHeader>
          <button 
            onClick={() => toggleSection('test')}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold">صفحة الاختبارات بالذكاء الاصطناعي</h3>
            </div>
            {expandedSections.has('test') ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </CardHeader>
        
        {expandedSections.has('test') && (
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">تفعيل صفحة الاختبارات</p>
                <p className="text-sm text-slate-400">
                  {showTestPage 
                    ? 'صفحة الاختبارات ستظهر في الشريط الجانبي للطلاب'
                    : 'صفحة الاختبارات لن تظهر في الموقع'}
                </p>
              </div>
              <button
                onClick={() => setShowTestPage(!showTestPage)}
                className={`p-2 rounded-lg transition-all ${
                  showTestPage 
                    ? 'bg-amber-500/20 text-amber-400' 
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                {showTestPage ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
              </button>
            </div>
            
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <p className="text-sm text-slate-400">
                عند تفعيل هذه الخاصية، سيظهر للطلاب في الشريط الجانبي رابط لصفحة الاختبارات بالذكاء الاصطناعي
                حيث يمكنهم إنشاء اختبارات مخصصة في أي مادة.
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <h3 className="font-bold flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            إحصائيات الاستخدام
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary">0</p>
              <p className="text-xs text-slate-400">محادثة</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg text-center">
              <p className="text-2xl font-bold text-emerald-400">0</p>
              <p className="text-xs text-slate-400">اليوم</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg text-center">
              <p className="text-2xl font-bold text-amber-400">0</p>
              <p className="text-xs text-slate-400">اختبار</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-400">0</p>
              <p className="text-xs text-slate-400">سؤال</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
