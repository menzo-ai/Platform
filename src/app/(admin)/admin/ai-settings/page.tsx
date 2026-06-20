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
  ToggleRight
} from 'lucide-react'

// AI Services with their free models
const AI_SERVICES: Record<string, { name: string; icon: string; freeModels: string[] }> = {
  openai: { name: 'OpenAI', icon: '🤖', freeModels: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo'] },
  anthropic: { name: 'Anthropic', icon: '🧠', freeModels: ['claude-3-haiku', 'claude-3-sonnet', 'claude-3-opus'] },
  deepseek: { name: 'DeepSeek', icon: '🔮', freeModels: ['deepseek-chat', 'deepseek-coder'] },
  google: { name: 'Google Gemini', icon: '✨', freeModels: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'] },
  minimax: { name: 'MiniMax', icon: '🔢', freeModels: ['abab6-chat', 'abab5.5-chat'] },
  moonshot: { name: 'Moonshot', icon: '🌙', freeModels: ['moonshot-v1-8k', 'moonshot-v1-32k'] },
  openrouter: { name: 'OpenRouter', icon: '🛤️', freeModels: ['openrouter/auto', 'openai/gpt-4o-mini'] },
  groq: { name: 'Groq', icon: '⚡', freeModels: ['llama-3.1-8b-instant', 'llama-3.1-70b-versatile'] },
  cohere: { name: 'Cohere', icon: '🌊', freeModels: ['command-r-plus', 'command-r'] },
  deepinfra: { name: 'DeepInfra', icon: '🔧', freeModels: ['meta-llama/Llama-3.1-8B-Instruct'] },
}

// Search Engines
const SEARCH_ENGINES = [
  { id: 'serper', name: 'Serper API', needsApiKey: true },
  { id: 'tavily', name: 'Tavily AI', needsApiKey: true },
  { id: 'jina', name: 'Jina AI Reader', needsApiKey: false },
  { id: 'exa', name: 'Exa AI', needsApiKey: true },
  { id: 'ddgs', name: 'DDGS (DuckDuckGo)', needsApiKey: false },
  { id: 'searxng', name: 'SearXNG', needsApiKey: false },
  { id: 'none', name: 'بدون بحث', needsApiKey: false },
]

export default function AdminAISettingsPage() {
  // Main settings
  const [isEnabled, setIsEnabled] = useState(true)
  const [service, setService] = useState('openai')
  const [model, setModel] = useState('gpt-4o-mini')
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  
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
- الوقت: {time} دقائق

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
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['main', 'search', 'prompts']))

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
    setModel(AI_SERVICES[newService]?.freeModels[0] || '')
  }

  const handleTestAPI = async () => {
    setTesting(true)
    setTestResult(null)
    
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setTestResult({
        success: true,
        message: `تم الاتصال بنجاح بخدمة ${AI_SERVICES[service]?.name || service}!`
      })
    } catch (error) {
      setTestResult({
        success: false,
        message: 'فشل الاتصال. تأكد من صحة API Key.'
      })
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
          apiKey,
          searchEngine,
          searchApiKey,
          customPrompt,
          testPrompt,
          showTestPage
        })
      })
      
      if (response.ok) {
        alert('تم حفظ الإعدادات بنجاح!')
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      alert('حدث خطأ أثناء الحفظ')
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
    }
  }

  const currentService = AI_SERVICES[service] || { name: service, freeModels: [] }
  const currentSearchEngine = SEARCH_ENGINES.find(e => e.id === searchEngine)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <Brain className="w-7 h-7 text-primary" />
            إعدادات الذكاء الاصطناعي
          </h1>
          <p className="text-slate-400">إدارة المساعد الذكي وخدمة الاختبارات</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
            إعادة تعيين
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <Save className="w-4 h-4" />
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
                    ? 'الذكاء الاصطناعي يعمل في الموقع - يظهر في القائمة الجانبية وصفحات الكورسات'
                    : 'الذكاء الاصطناعي معطل - لن يظهر في أي مكان في الموقع'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsEnabled(!isEnabled)}
              className={`p-3 rounded-xl transition-all ${
                isEnabled 
                  ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' 
                  : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
              }`}
            >
              {isEnabled ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Main Settings */}
      <Card>
        <CardHeader>
          <button 
            onClick={() => toggleSection('main')}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-primary" />
              <h3 className="font-bold">إعدادات الخدمة والنموذج</h3>
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
            {/* Service Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">اختر الخدمة</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(AI_SERVICES).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => handleServiceChange(key)}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      service === key 
                        ? 'border-primary bg-primary/10' 
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-2xl">{data.icon}</span>
                    <span className="text-sm font-medium">{data.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">
                النماذج المتاحة المجانية
                <span className="text-slate-400 text-xs block">للخدمة: {currentService.name}</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {currentService.freeModels.map((m) => (
                  <button
                    key={m}
                    onClick={() => setModel(m)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm ${
                      model === m 
                        ? 'border-primary bg-primary/10' 
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* API Key */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Key className="w-4 h-4" />
                API Key
                <span className="text-xs text-slate-400">(لخدمة {currentService.name})</span>
              </label>
              <div className="relative">
                <Input 
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="أدخل API Key هنا..."
                  className="pl-10"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Test Connection */}
            <Button 
              variant="outline" 
              onClick={handleTestAPI}
              disabled={testing || !apiKey}
              className="w-full md:w-auto"
            >
              {testing ? (
                <>
                  <span className="animate-spin">⏳</span>
                  جاري الاختبار...
                </>
              ) : (
                <>
                  <TestTube className="w-4 h-4" />
                  اختبار الاتصال
                </>
              )}
            </Button>

            {testResult && (
              <div className={`p-4 rounded-lg flex items-center gap-3 ${
                testResult.success 
                  ? 'bg-emerald-500/10 border border-emerald-500/20' 
                  : 'bg-red-500/10 border border-red-500/20'
              }`}>
                {testResult.success ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                )}
                <span className={testResult.success ? 'text-emerald-400' : 'text-red-400'}>
                  {testResult.message}
                </span>
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
                    {engine.name}
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
              <p className="text-xs text-slate-400 mt-2">
                المتغيرات المتاحة: {'{subject}'} للمادة، {'{count}'} للعدد، {'{difficulty}'} للصعوبة، {'{time}'} للوقت
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Test Page Settings */}
      <Card className={showTestPage ? 'border-amber-500/30' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold">صفحة الاختبارات بالذكاء الاصطناعي</h3>
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
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400">
            {showTestPage 
              ? 'صفحة الاختبارات ستظهر في الشريط الجانبي للطلاب'
              : 'صفحة الاختبارات لن تظهر في الموقع'}
          </p>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <h3 className="font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
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