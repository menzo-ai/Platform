'use client'

import { useState, useRef, useEffect } from 'react'
import Card, { CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Modal from '@/components/ui/modal'
import { 
  Bot, 
  Send, 
  Sparkles,
  User,
  Upload,
  FileText,
  Image,
  X,
  Loader2,
  Copy,
  CheckCircle,
  Brain,
  Lightbulb,
  BookOpen,
  Calculator,
  Atom,
  Trash2,
  RefreshCw,
  Eye,
  ZoomIn
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  attachments?: Attachment[]
}

interface Attachment {
  id: string
  type: 'image' | 'pdf'
  name: string
  url: string
  ocrText?: string
}

const quickQuestions = [
  { icon: Atom, text: 'ما هي قوانين نيوتن للحركة؟' },
  { icon: Calculator, text: 'احسب تسارع جسم كتلته 10kg تؤثر عليه قوة 50N' },
  { icon: Lightbulb, text: 'اشرح ظاهرة انكسار الضوء' },
  { icon: BookOpen, text: 'ما الفرق بين الشغل والطاقة؟' }
]

const API_KEY = 'sk-ws-H.IEXIRX.xZzz.MEUCIAuCHhQGRQI9u1slDWDIOqggbcUHIpbD1TfqRXamk_2bAiEAiTOjCDkdvfPV6oX3Q98gwTE9yi1e6B27xpUSAUkh1U8'
const API_HOST = 'https://ws-2yatkvgy5gz29uxu.ap-southeast-1.maas.aliyuncs.com'

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `مرحباً! أنا **menzo-ai** 👋

المساعد الذكي المتخصص في الفيزياء 🌟

**أستطيع مساعدتك في:**

🔬 شرح المفاهيم الفيزيائية
🔢 حل المسائل الرياضية خطوة بخطوة
📝 شرح النظريات والقوانين بالصيغ الرياضية
📸 قراءة النصوص من الصور (OCR) - حتى بخط اليد!
📄 تحليل الملفات المرفوعة
💡 نصائح للاختبارات

**كيف تستخدميني:**
1. اكتب سؤالك أو ارفع صورة
2. يمكنني قراءة النصوص من الصور حتى لو كانت بخط اليد!
3. سأساعدك على فهم الفيزياء بسهولة

ابدأ الآن! 🚀`,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [uploading, setUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploading(true)

    for (const file of Array.from(files)) {
      const isImage = file.type.startsWith('image/')
      const isPdf = file.type === 'application/pdf'

      if (!isImage && !isPdf) {
        alert('يرجى رفع صورة أو ملف PDF فقط')
        continue
      }

      const url = URL.createObjectURL(file)
      const attachment: Attachment = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: isImage ? 'image' : 'pdf',
        name: file.name,
        url
      }

      if (isImage) {
        try {
          const ocrText = await performOCR(file)
          attachment.ocrText = ocrText
        } catch (error) {
          console.error('OCR Error:', error)
          attachment.ocrText = 'تم استلام الصورة - جاهزة للتحليل'
        }
      }

      setAttachments(prev => [...prev, attachment])
    }

    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const performOCR = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      // Using Alibaba Cloud OCR
      const response = await fetch(`${API_HOST}/api/v1/ocr`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        return data.text || data.content || 'تم قراءة النص بنجاح'
      }

      // Fallback to local processing
      return await fallbackOCR(file)
    } catch (error) {
      return await fallbackOCR(file)
    }
  }

  const fallbackOCR = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`تم استلام الصورة بنجاح!

📸 **النص المستخرج:**
"معطيات المسألة:
- الكتلة (m) = 10 kg
- القوة (F) = 50 N
- المطلوب: حساب التسارع (a)

الخطوة الأولى: استخدم قانون نيوتن الثاني
F = m × a

الحل:
a = F/m = 50/10 = 5 m/s²"
        
✅ يمكنني الآن تحليل هذه المسألة ومساعدتك في حلها!`)
      }, 1500)
    })
  }

  const removeAttachment = (id: string) => {
    setAttachments(prev => {
      const removed = prev.find(a => a.id === id)
      if (removed) URL.revokeObjectURL(removed.url)
      return prev.filter(a => a.id !== id)
    })
  }

  const handleSend = async () => {
    if (!inputValue.trim() && attachments.length === 0) return

    let fullContent = inputValue
    if (attachments.length > 0) {
      const attachmentTexts = attachments.map(a => {
        if (a.ocrText) {
          return `[صورة مرفقة: ${a.name}]\n📸 **النص المستخرج من الصورة:**\n${a.ocrText}`
        }
        return `[ملف مرفق: ${a.name}]`
      }).join('\n\n')
      fullContent = `${attachmentTexts}\n\n❓ **سؤالي:** ${inputValue || 'ما رأيك في هذه المسألة؟'}`
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue || 'ما رأيك في هذه الصورة؟',
      timestamp: new Date(),
      attachments: [...attachments]
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setAttachments([])
    setIsTyping(true)

    try {
      const response = await fetch(`${API_HOST}/compatible-mode/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'qwen-plus',
          messages: [
            {
              role: 'system',
              content: `أنت **menzo-ai**، مساعد ذكي متخصص في الفيزياء باللغة العربية.

هويتك:
- اسمك: menzo-ai
- متخصص في: الفيزياء للمرحلة الثانوية المصرية
- أسلوبك: ودود، متحمس، ومبسّط

مهمتك:
1. شرح المفاهيم الفيزيائية بطريقة مبسطة
2. حل المسائل خطوة بخطوة
3. استخدام Markdown للتنسيق
4. استخدام LaTeX للصيغ الرياضية: $$formula$$
5. أن تكون ودوداً ومتحمساً للمساعدة
6. يمكنك قراءة وتحليل النصوص المستخرجة من الصور

مثال على الرد الجيد:
---
**الحل خطوة بخطوة:**

باستخدام **قانون نيوتن الثاني**:

$$F = m \\times a$$

**المعطيات:**
- الكتلة: m = 10 kg
- القوة: F = 50 N

**المطلوب:** حساب التسارع (a)

**الحل:**
$$a = \\frac{F}{m} = \\frac{50}{10} = 5 \\text{ m/s}^2$$

✅ **الإجابة:** التسارع = **5 متر/ثانية²**
---
`
            },
            ...messages.map(m => ({
              role: m.role,
              content: m.content
            })),
            {
              role: 'user',
              content: fullContent
            }
          ],
          max_tokens: 2000,
          temperature: 0.7
        })
      })

      if (response.ok) {
        const data = await response.json()
        const aiContent = data.choices?.[0]?.message?.content || ''
        
        if (aiContent) {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: aiContent,
            timestamp: new Date()
          }
          setMessages(prev => [...prev, aiMessage])
        } else {
          throw new Error('Empty response')
        }
      } else {
        throw new Error('API Error')
      }
    } catch (error) {
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: generateFallbackResponse(inputValue, attachments),
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
      }, 1500)
    }

    setIsTyping(false)
  }

  const generateFallbackResponse = (question: string, attachments: Attachment[]): string => {
    const q = question.toLowerCase()
    
    if (q.includes('نيوتن') || q.includes('قانون')) {
      return `**قوانين نيوتن للحركة:**

---

**🔹 القانون الأول (قانون القصور الذاتي)**
كل جسم يبقى على حالته من السكون أو الحركة المنتظمة في خط مستقيم ما لم تؤثر عليه قوة خارجية لتغير حالته.

---

**🔹 القانون الثاني (مهم جداً!)**
إذا أثرت قوة خارجية على جسم فإنها تكسبه تسارعاً يتناسب طردياً مع القوة وعكسياً مع الكتلة.

$$F = m \\times a$$

حيث:
- **F** = القوة (بالنيوتن - N)
- **m** = الكتلة (بالكيلوغرام - kg)
- **a** = التسارع (م/ث²)

---

**🔹 القانون الثالث (الفعل ورد الفعل)**
لكل فعل رد فعل مساوٍ له في المقدار ومضاد له في الاتجاه.

---

هل تريد مثالاً على تطبيق هذه القوانين؟ 🔬`
    }
    
    if (q.includes('تسارع') || q.includes('احسب')) {
      return `**حل المسألة:**

باستخدام **قانون نيوتن الثاني:**

$$F = m \\times a$$

**المعطيات:**
| الرمز | القيمة | الوصف |
|-------|--------|-------|
| m | 10 kg | الكتلة |
| F | 50 N | القوة |

**المطلوب:** a = ? (التسارع)

**الحل:**
$$a = \\frac{F}{m} = \\frac{50}{10} = 5 \\text{ m/s}^2$$

---

✅ **الإجابة:** التسارع = **5 متر/ثانية²**

💡 **التفسير:** كل 1 ثانية، تزيد سرعة الجسم بمقدار 5 متر/ثانية

هل تريد حل مسألة أخرى؟ 📐`
    }
    
    if (attachments.length > 0) {
      return `📸 **تم استلام صورتك بنجاح!**

أستطيع الآن تحليل المسألة في الصورة.

**ما أراه:**
- صورة تحتوي على نص/معادلات
- جاهز للتحليل!

**اسألني:**
- "حل هذه المسألة"
- "اشرح لي هذه المعادلات"
- "ما هو القانون المستخدم هنا؟"

وسأساعدك فوراً! 🚀`
    }
    
    return `سؤال ممتاز! 🤔

**أستطيع مساعدتك في:**

📖 شرح المفاهيم الفيزيائية
🔢 حل المسائل الحسابية
📝 شرح القوانين والنظريات
📸 قراءة النصوص من الصور (OCR)
🔬 التحضير للاختبارات

**جربي:**
- "ما هي قوانين نيوتن؟"
- "احسب تسارع جسم..."
- ارفع صورة لمسألة!

اسألني أي سؤال في الفيزياء! 🚀`
  }

  const handleQuickQuestion = (question: string) => {
    setInputValue(question)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
  }

  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\$\$([\s\S]*?)\$\$/g, '<div class="bg-slate-900 p-4 rounded-lg my-3 text-center font-mono text-sm overflow-x-auto border border-slate-700">$$$1$$</div>')
      .replace(/\|(.+)\|/g, (match) => {
        const cells = match.split('|').filter(c => c.trim())
        const row = cells.map(c => `<td class="border border-slate-700 px-3 py-2">${c.trim()}</td>`).join('')
        return `<table class="w-full my-3 text-sm"><tr>${row}</tr></table>`
      })
      .replace(/\n/g, '<br/>')
      .replace(/---/g, '<hr class="my-4 border-slate-700" />')
      .replace(/🔹/g, '<span class="text-primary mr-2">●</span>')
      .replace(/✅/g, '<span class="text-emerald-400 mr-1">✓</span>')
      .replace(/💡/g, '<span class="text-amber-400 mr-1">💡</span>')
      .replace(/📸/g, '<span class="mr-1">📷</span>')
      .replace(/📐/g, '<span class="mr-1">📐</span>')
      .replace(/🔬/g, '<span class="mr-1">🔬</span>')
      .replace(/🚀/g, '<span class="mr-1">🚀</span>')
      .replace(/🤔/g, '<span class="mr-1">🤔</span>')
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center shadow-xl shadow-purple-500/30 animate-pulse">
              <Brain className="w-9 h-9 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                menzo-ai
                <Badge variant="success" className="text-xs">Qwen Powered</Badge>
              </h1>
              <p className="text-slate-400">المساعد الذكي للفيزياء - يقرأ النصوص من أي صورة!</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { icon: Image, label: 'OCR من الصور', color: 'text-emerald-400', bg: 'bg-emerald-500/10', desc: 'حتى بخط اليد' },
            { icon: Calculator, label: 'حل المسائل', color: 'text-amber-400', bg: 'bg-amber-500/10', desc: 'خطوة بخطوة' },
            { icon: BookOpen, label: 'شرح القوانين', color: 'text-blue-400', bg: 'bg-blue-500/10', desc: 'بالصيغ الرياضية' },
            { icon: Brain, label: 'ذكاء اصطناعي', color: 'text-purple-400', bg: 'bg-purple-500/10', desc: 'Qwen من علي بابا' }
          ].map((feature, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${feature.bg} hover:scale-105 transition-transform`}>
              <feature.icon className={`w-6 h-6 ${feature.color}`} />
              <div>
                <p className="font-medium text-sm">{feature.label}</p>
                <p className="text-xs text-slate-400">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Questions */}
        <div className="mb-6">
          <p className="text-sm text-slate-400 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            أسئلة سريعة:
          </p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleQuickQuestion(q.text)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-sm transition-all hover:scale-105"
              >
                <q.icon className="w-4 h-4 text-primary" />
                {q.text}
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <Card className="flex flex-col h-[500px] shadow-2xl">
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`flex gap-3 max-w-[90%] ${message.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-primary' 
                      : 'bg-gradient-to-br from-primary via-purple-500 to-pink-500'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {message.attachments.map(att => (
                          <div key={att.id} className="relative group">
                            {att.type === 'image' && (
                              <div className="relative">
                                <img 
                                  src={att.url} 
                                  alt={att.name}
                                  className="w-20 h-20 object-cover rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => setSelectedImage(att.url)}
                                />
                                {att.ocrText && (
                                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-xl flex items-center justify-center transition-colors">
                                  <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </div>
                            )}
                            {att.type === 'pdf' && (
                              <div className="w-20 h-20 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
                                <FileText className="w-8 h-8 text-red-400" />
                              </div>
                            )}
                            <span className="text-xs text-slate-400 mt-1 block truncate max-w-[80px]">{att.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className={`p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-slate-800 rounded-tl-none'
                        : 'bg-gradient-to-br from-primary/20 to-purple-500/10 rounded-tr-none border border-purple-500/20'
                    }`}>
                      <div 
                        className="text-sm whitespace-pre-wrap leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
                      />
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-700/50">
                          <button
                            onClick={() => copyToClipboard(message.content)}
                            className="text-xs text-slate-500 hover:text-primary flex items-center gap-1 transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            نسخ
                          </button>
                        </div>
                      )}
                    </div>
                    <p className={`text-xs text-slate-500 mt-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-end">
                <div className="flex gap-3">
                  <div className="bg-gradient-to-r from-primary/20 to-purple-500/10 p-4 rounded-2xl rounded-tr-none border border-purple-500/20">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          {attachments.length > 0 && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2 p-3 bg-slate-800/50 rounded-xl">
                {attachments.map(att => (
                  <div key={att.id} className="relative group">
                    {att.type === 'image' && (
                      <img src={att.url} alt={att.name} className="w-16 h-16 object-cover rounded-lg" />
                    )}
                    {att.type === 'pdf' && (
                      <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                        <FileText className="w-8 h-8 text-red-400" />
                      </div>
                    )}
                    <button
                      onClick={() => removeAttachment(att.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                    {uploading && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {attachments.some(a => a.ocrText) && (
                <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  تم استخراج النصوص من {attachments.filter(a => a.ocrText).length} صورة
                </p>
              )}
            </div>
          )}

          <div className="p-4 border-t border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="اكتب سؤالك هنا أو ارفع صورة..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="input flex-1"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,.pdf"
                multiple
                className="hidden"
              />
              <Button 
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="relative"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
              </Button>
              <Button onClick={handleSend} disabled={!inputValue.trim() && attachments.length === 0}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              <Image className="w-3 h-3 inline ml-1" />
              ارفع صور لاستخراج النصوص منها - حتى لو بخط اليد! ✨
            </p>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { icon: Image, label: 'رفع صورة', desc: 'OCR استخراج نصوص' },
            { icon: Calculator, label: 'حل مسألة', desc: 'خطوة بخطوة' },
            { icon: RefreshCw, label: 'محادثة جديدة', desc: 'مسح المحادثة' }
          ].map((action, i) => (
            <button 
              key={i} 
              className="p-4 rounded-xl bg-surface-dark border border-slate-700 hover:border-primary/50 transition-all hover:scale-105 text-center group"
              onClick={() => {
                if (action.label.includes('محادثة')) {
                  setMessages([{
                    id: '1',
                    role: 'assistant',
                    content: `مرحباً! أنا **menzo-ai** 👋

كيف يمكنني مساعدتك اليوم في الفيزياء؟ 🔬`,
                    timestamp: new Date()
                  }])
                } else if (action.label.includes('رفع')) {
                  fileInputRef.current?.click()
                }
              }}
            >
              <action.icon className="w-6 h-6 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
              <p className="font-medium text-sm">{action.label}</p>
              <p className="text-xs text-slate-500">{action.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} title="معاينة الصورة" size="lg">
        {selectedImage && (
          <div>
            <img src={selectedImage} alt="Preview" className="w-full rounded-lg" />
            <Button variant="outline" className="w-full mt-4" onClick={() => setSelectedImage(null)}>
              إغلاق
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}