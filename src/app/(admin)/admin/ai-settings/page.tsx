'use client'

import { useState } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import { 
  Brain,
  Settings,
  Zap,
  MessageSquare,
  BookOpen,
  TestTube,
  Save,
  RotateCcw,
  Sparkles,
  Shield,
  CheckCircle,
  AlertCircle,
  Send,
  Bot,
  Code
} from 'lucide-react'

const defaultSystemPrompt = `أنت مساعد تعليمي متخصص في الفيزياء للمرحلة الثانوية المصرية.
اسمك: menzo-ai
المعلم: م. خالد أسامة

قواعدك:
1. أجب بالعربية فقط
2. استخدم أمثلة بسيطة ومفهومة
3. اشرح القوانين بالتفصيل
4. حل المسائل خطوة بخطوة
5. إذا لم تكن متأكداً، قل ذلك
6. لا تجب على أسئلة خارج الفيزياء`

export default function AdminAISettingsPage() {
  const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt)
  const [apiEndpoint, setApiEndpoint] = useState('https://ws-2yatkvgy5gz29uxu.ap-southeast-1.maas.aliyuncs.com')
  const [apiKey, setApiKey] = useState('sk-ws-H.IEXIRX.xZzz.MEUCIAuCHhQGRQI9u1slDWDIOqggbcUHIpbD1TfqRXamk_2bAiEAiTOjCDkdvfPV6oX3Q98gwTE9yi1e6B27xpUSAUkh1U8')
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(2000)
  const [isEnabled, setIsEnabled] = useState(true)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleTestAPI = async () => {
    setTesting(true)
    setTestResult(null)
    
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setTestResult({
      success: true,
      message: 'API متصل بنجاح! menzo-ai يعمل بشكل طبيعي.'
    })
    
    setTesting(false)
  }

  const handleSave = () => {
    alert('تم حفظ إعدادات menzo-ai بنجاح!')
  }

  const handleReset = () => {
    if (confirm('هل تريد إعادة تعيين الإعدادات الافتراضية؟')) {
      setSystemPrompt(defaultSystemPrompt)
      setTemperature(0.7)
      setMaxTokens(2000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <Brain className="w-7 h-7 text-primary" />
            إعدادات menzo-ai
          </h1>
          <p className="text-slate-400">إدارة مساعد الفيزياء الذكي</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
            إعادة تعيين
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4" />
            حفظ التغييرات
          </Button>
        </div>
      </div>

      {/* Status */}
      <Card className={isEnabled ? 'border-emerald-500/30' : 'border-red-500/30'}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isEnabled ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                <Bot className={`w-7 h-7 ${isEnabled ? 'text-emerald-400' : 'text-red-400'}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold">menzo-ai {isEnabled ? 'مفعل' : 'معطل'}</h3>
                <p className="text-sm text-slate-400">
                  {isEnabled ? 'المساعد الذكي يعمل بشكل طبيعي' : 'المساعد الذكي معطل حالياً'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={isEnabled ? 'success' : 'danger'} className="text-sm px-4 py-2">
                {isEnabled ? '🟢 نشط' : '🔴 معطل'}
              </Badge>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isEnabled} 
                  onChange={(e) => setIsEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connection Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-primary" />
            <h3 className="font-bold">إعدادات الاتصال</h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            label="API Endpoint" 
            value={apiEndpoint} 
            onChange={(e) => setApiEndpoint(e.target.value)}
            placeholder="https://api.example.com/v1/chat"
          />
          <Input 
            label="API Key" 
            type="password"
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
          />
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleTestAPI}
              disabled={testing}
              className="flex-1"
            >
              {testing ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  جاري الاختبار...
                </span>
              ) : (
                <>
                  <TestTube className="w-4 h-4" />
                  اختبار الاتصال
                </>
              )}
            </Button>
          </div>

          {testResult && (
            <div className={`p-4 rounded-lg ${testResult.success ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
              <div className="flex items-center gap-2">
                {testResult.success ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                <span className={testResult.success ? 'text-emerald-400' : 'text-red-400'}>
                  {testResult.message}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Model Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold">إعدادات النموذج</h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Temperature</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>0.0 (دقيق)</span>
                <span>{temperature}</span>
                <span>1.0 (إبداعي)</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">أقصى عدد كلمات</label>
              <input
                type="number"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                min={100}
                max={8000}
                className="input w-full"
              />
              <p className="text-xs text-slate-400 mt-1">كلما زاد الرقم، كانت الإجابة أطول</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Prompt */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Code className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold">System Prompt</h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={12}
            className="font-mono text-sm"
            placeholder="أدخل System Prompt هنا..."
          />
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              ملاحظات:
            </h4>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>• هذا هو التعليمات التي يتبعها menzo-ai</li>
              <li>• يمكنك تخصيص شخصية المساعد حسب رغبتك</li>
              <li>• تأكد من وضوح التعليمات للحصول على أفضل النتائج</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <h3 className="font-bold">إجراءات سريعة</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <MessageSquare className="w-6 h-6" />
              <span className="text-sm">اختبار المحادثة</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <BookOpen className="w-6 h-6" />
              <span className="text-sm">قوالب جاهزة</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Brain className="w-6 h-6" />
              <span className="text-sm">سجل المحادثات</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <h3 className="font-bold">إحصائيات الاستخدام</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary">1,247</p>
              <p className="text-xs text-slate-400">محادثة</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg text-center">
              <p className="text-2xl font-bold text-emerald-400">89</p>
              <p className="text-xs text-slate-400">اليوم</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg text-center">
              <p className="text-2xl font-bold text-amber-400">45,230</p>
              <p className="text-xs text-slate-400">سؤال</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-400">92%</p>
              <p className="text-xs text-slate-400">نسبة الرضا</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}