'use client'

import { useState } from 'react'
import Card, { CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import { 
  Brain,
  Save,
  RotateCcw,
  Sparkles,
  MessageSquare,
  Settings,
  BookOpen,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface PromptConfig {
  id: string
  name: string
  description: string
  prompt: string
  category: string
  isActive: boolean
}

const defaultPrompts: PromptConfig[] = [
  {
    id: '1',
    name: 'Physics Assistant',
    description: 'المساعد الرئيسي للفيزياء',
    prompt: `أنت مساعد ذكي متخصص في الفيزياء المصرية للمرحلة الثانوية.
- أجب على الأسئلة بأسلوب بسيط ومفهوم
- استخدم أمثلة عملية من الحياة اليومية
- اشرح القوانين مع ذكر الوحدات
- إذا لم تكن متأكداً من الإجابة، قل ذلك بوضوح
- استخدم العربية الفصحى المبسطة`,
    category: 'main',
    isActive: true
  },
  {
    id: '2',
    name: 'Newton Laws',
    description: 'شرح قوانين نيوتن',
    prompt: `عند شرح قوانين نيوتن:
- ابدأ بالقانون الأول (القصور الذاتي)
- ثم القانون الثاني (F = ma)
- ثم القانون الثالث (الفعل ورد الفعل)
- أعط أمثلة لكل قانون
- اربط بالقوانين السابقة`,
    category: 'topic',
    isActive: true
  },
  {
    id: '3',
    name: 'Exam Generator',
    description: 'توليد أسئلة امتحان',
    prompt: `أنشئ أسئلة امتحان على النحو التالي:
- الأسئلة تكون MCQ (اختيار من متعدد)
- 4 خيارات لكل سؤال
- إجابة صحيحة واحدة فقط
- صعوبة متوسطة إلى صعبة
- اكتب التفسير للحل`,
    category: 'generator',
    isActive: true
  },
  {
    id: '4',
    name: 'Study Plan',
    description: 'خطة دراسة مخصصة',
    prompt: `أنشئ خطة دراسة مخصصة بناءً على:
- المستوى الحالي للطالب
- الوقت المتاح للدراسة
- المواضيع المطلوب تغطيتها
- قسم الخطة إلى أيام
- حدد وقت لكل موضوع
- أضف فترات راحة`,
    category: 'planner',
    isActive: true
  },
  {
    id: '5',
    name: 'Concept Explanation',
    description: 'شرح المفاهيم',
    prompt: `عند شرح أي مفهوم فيزيائي:
- ابدأ بتعريف بسيط
- اشرح السبب (لماذا يحدث ذلك)
- أعط مثال من الواقع
- اذكر التطبيقات العملية
- اربط بالمفاهيم السابقة`,
    category: 'education',
    isActive: false
  }
]

const categories = [
  { id: 'all', label: 'الكل', icon: Settings },
  { id: 'main', label: 'أساسي', icon: Zap },
  { id: 'topic', label: 'موضوعي', icon: BookOpen },
  { id: 'generator', label: 'مولد', icon: Sparkles },
  { id: 'planner', label: 'مخطط', icon: MessageSquare },
  { id: 'education', label: 'تعليمي', icon: Brain },
]

export default function AIPromptEditorPage() {
  const [prompts, setPrompts] = useState<PromptConfig[]>(defaultPrompts)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [editingPrompt, setEditingPrompt] = useState<PromptConfig | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const filteredPrompts = selectedCategory === 'all' 
    ? prompts 
    : prompts.filter(p => p.category === selectedCategory)

  const handleEdit = (prompt: PromptConfig) => {
    setEditingPrompt({ ...prompt })
  }

  const handleSave = async () => {
    if (!editingPrompt) return
    
    setIsSaving(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setPrompts(prompts.map(p => 
      p.id === editingPrompt.id ? editingPrompt : p
    ))
    
    setEditingPrompt(null)
    setIsSaving(false)
    setShowSuccess(true)
    
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleReset = () => {
    if (editingPrompt) {
      const original = defaultPrompts.find(p => p.id === editingPrompt.id)
      if (original) {
        setEditingPrompt({ ...original })
      }
    }
  }

  const toggleActive = (id: string) => {
    setPrompts(prompts.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <Brain className="w-7 h-7 text-purple-400" />
            إعدادات الذكاء الاصطناعي
          </h1>
          <p className="text-slate-400">تحكم في Prompts و إعدادات المساعد الذكي</p>
        </div>
        
        {showSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <CheckCircle className="w-5 h-5" />
            <span>تم الحفظ بنجاح!</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{prompts.length}</p>
              <p className="text-xs text-slate-400">إجمالي Prompts</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{prompts.filter(p => p.isActive).length}</p>
              <p className="text-xs text-slate-400">نشط</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{prompts.filter(p => p.isActive).length * 25}</p>
              <p className="text-xs text-slate-400">Tokens/رد</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{prompts.filter(p => p.isActive).length * 150}</p>
              <p className="text-xs text-slate-400">محادثة/شهر</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Categories */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(cat => {
              const Icon = cat.icon
              const count = cat.id === 'all' 
                ? prompts.length 
                : prompts.filter(p => p.category === cat.id).length
              
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                  <Badge variant={selectedCategory === cat.id ? 'primary' : 'info'}>
                    {count}
                  </Badge>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Prompts List */}
        <div className="space-y-4">
          <h3 className="font-bold">Prompts النشطة</h3>
          {filteredPrompts.map(prompt => (
            <Card 
              key={prompt.id}
              className={`cursor-pointer transition-all ${editingPrompt?.id === prompt.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => handleEdit(prompt)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold">{prompt.name}</h4>
                      <Badge variant={prompt.isActive ? 'success' : 'warning'}>
                        {prompt.isActive ? 'نشط' : 'متوقف'}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400">{prompt.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Settings className="w-3 h-3" />
                        {categories.find(c => c.id === prompt.category)?.label}
                      </span>
                      <span>{prompt.prompt.length} حرف</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleActive(prompt.id)
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      prompt.isActive 
                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {prompt.isActive ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Panel */}
        <Card>
          <CardContent className="p-6">
            {editingPrompt ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">تعديل Prompt</h3>
                  <Badge variant="info">{editingPrompt.category}</Badge>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">اسم Prompt</label>
                  <input
                    type="text"
                    value={editingPrompt.name}
                    onChange={(e) => setEditingPrompt({ ...editingPrompt, name: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">الوصف</label>
                  <input
                    type="text"
                    value={editingPrompt.description}
                    onChange={(e) => setEditingPrompt({ ...editingPrompt, description: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Prompt</label>
                  <textarea
                    value={editingPrompt.prompt}
                    onChange={(e) => setEditingPrompt({ ...editingPrompt, prompt: e.target.value })}
                    rows={12}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="flex-1 gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        حفظ التغييرات
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    className="gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    إعادة تعيين
                  </Button>
                </div>

                {/* Preview */}
                <div className="mt-4 p-4 bg-slate-800/50 rounded-lg">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    معاينة
                  </h4>
                  <p className="text-sm text-slate-300 font-mono whitespace-pre-wrap">
                    {editingPrompt.prompt}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">اختر Prompt للتعديل</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
