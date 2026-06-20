'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
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
  Mic,
  MicOff,
  StopCircle,
  Sparkle,
  MessageSquare,
  History,
  Edit3,
  Volume2,
  Plus,
  Save,
  XCircle,
  Clipboard,
  RefreshCcw,
  ThumbsUp,
  ThumbsDown,
  Pin,
  PinOff,
  AlertCircle,
  Trash,
  Settings,
  ChevronDown,
  Globe,
  Search,
  Zap
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  attachments?: Attachment[]
  isDeepThinking?: boolean
  isLiked?: boolean
  isDisliked?: boolean
}

interface Attachment {
  id: string
  type: 'image' | 'pdf'
  name: string
  url: string
  ocrText?: string
}

interface Conversation {
  id: string
  title: string
  updatedAt: Date
  isPinned?: boolean
}

interface Suggestion {
  id: string
  text: string
  icon: typeof Atom
}

interface AIService {
  id: string
  name: string
  icon: string
  models: string[]
}

const AI_SERVICES: AIService[] = [
  { id: 'openai', name: 'OpenAI', icon: '🤖', models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'] },
  { id: 'anthropic', name: 'Anthropic', icon: '🧠', models: ['claude-3-5-sonnet', 'claude-3-opus', 'claude-3-haiku'] },
  { id: 'deepseek', name: 'DeepSeek', icon: '🔮', models: ['deepseek-chat', 'deepseek-coder'] },
  { id: 'gemini', name: 'Gemini', icon: '✨', models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'] },
  { id: 'azure', name: 'Azure AI', icon: '☁️', models: ['gpt-4', 'gpt-4-turbo', 'gpt-35-turbo'] },
]

const QUICK_QUESTIONS = [
  { id: '1', icon: Atom, text: 'ما هي قوانين نيوتن للحركة؟' },
  { id: '2', icon: Calculator, text: 'احسب تسارع جسم كتلته 10kg تؤثر عليه قوة 50N' },
  { id: '3', icon: Lightbulb, text: 'اشرح ظاهرة انكسار الضوء' },
  { id: '4', icon: BookOpen, text: 'ما الفرق بين الشغل والطاقة؟' }
]

const AI_SUGGESTIONS: Suggestion[] = [
  { id: '1', text: 'اشرح لي هذا المفهوم أكثر', icon: Lightbulb },
  { id: '2', text: 'اعطني مثال تطبيقي', icon: Calculator },
  { id: '3', text: 'ما العلاقة بين هذا و...؟', icon: Atom },
  { id: '4', text: 'اكتب سؤال آخر مشابه', icon: Sparkle },
  { id: '5', text: 'لخص لي هذه الإجابة', icon: BookOpen },
  { id: '6', text: 'اعطني تمارين إضافية', icon: Calculator }
]

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isDeepThinking, setIsDeepThinking] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [uploading, setUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editedContent, setEditedContent] = useState('')
  const [isStopRequested, setIsStopRequested] = useState(false)
  
  // Voice state
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)
  
  // Conversations state
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  
  // Suggestions state
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [lastAiContent, setLastAiContent] = useState('')
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, showSuggestions])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      recognitionInstance.lang = 'ar-SA'
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('')
        setInputValue(transcript)
      }
      
      recognitionInstance.onerror = () => {
        setIsRecording(false)
        toast.error('حدث خطأ في التعرف على الصوت')
      }
      
      recognitionInstance.onend = () => {
        if (isRecording) {
          try {
            recognitionInstance.start()
          } catch (e) {
            setIsRecording(false)
          }
        }
      }
      
      setRecognition(recognitionInstance)
    }
  }, [isRecording])

  const startRecording = () => {
    if (recognition) {
      try {
        recognition.start()
        setIsRecording(true)
        toast.success('جاري التسجيل... تحدث الآن')
      } catch (e) {
        toast.error('حدث خطأ في بدء التسجيل')
      }
    } else {
      toast.error('التعرف على الصوت غير مدعوم في متصفحك')
    }
  }

  const stopRecording = () => {
    if (recognition) {
      try {
        recognition.stop()
        setIsRecording(false)
      } catch (e) {
        setIsRecording(false)
      }
    }
  }

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsStopRequested(true)
      setIsTyping(false)
    }
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ar-SA'
      utterance.rate = 0.9
      utterance.onend = () => setIsSpeaking(false)
      setIsSpeaking(true)
      speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  const createNewConversation = async () => {
    try {
      const response = await fetch('/api/ai/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'محادثة جديدة' })
      })
      
      if (response.ok) {
        const data = await response.json()
        const newConv: Conversation = {
          id: data.id,
          title: data.title || 'محادثة جديدة',
          updatedAt: new Date()
        }
        setConversations(prev => [newConv, ...prev])
        setCurrentConversationId(data.id)
      } else {
        throw new Error('API Error')
      }
    } catch (error) {
      const newConv: Conversation = {
        id: Date.now().toString(),
        title: 'محادثة جديدة',
        updatedAt: new Date()
      }
      setConversations(prev => [newConv, ...prev])
      setCurrentConversationId(newConv.id)
    }
    setMessages([])
    setShowHistory(false)
    setShowSuggestions(false)
  }

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/ai/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    }
  }

  useEffect(() => {
    loadConversations()
  }, [])

  const selectConversation = async (conv: Conversation) => {
    try {
      const response = await fetch(`/api/ai/conversations/${conv.id}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
        setCurrentConversationId(conv.id)
        setShowHistory(false)
        setShowSuggestions(false)
      }
    } catch (error) {
      setCurrentConversationId(conv.id)
      setMessages([])
      setShowHistory(false)
      setShowSuggestions(false)
    }
  }

  const deleteConversation = async (convId: string) => {
    try {
      await fetch(`/api/ai/conversations/${convId}`, { method: 'DELETE' })
    } catch (error) {
      console.error('Error deleting conversation:', error)
    }
    setConversations(prev => prev.filter(c => c.id !== convId))
    if (currentConversationId === convId) {
      setCurrentConversationId(null)
      setMessages([])
    }
  }

  const togglePinConversation = (convId: string) => {
    setConversations(prev => prev.map(c => 
      c.id === convId ? { ...c, isPinned: !c.isPinned } : c
    ))
  }

  const updateConversationTitle = (convId: string, newTitle: string) => {
    setConversations(prev => prev.map(c => 
      c.id === convId ? { ...c, title: newTitle, updatedAt: new Date() } : c
    ))
    setIsEditingTitle(false)
  }

  const handleMessageEdit = (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (message) {
      setEditingMessageId(messageId)
      setEditedContent(message.content)
    }
  }

  const saveMessageEdit = () => {
    if (editingMessageId) {
      setMessages(prev => prev.map(m => 
        m.id === editingMessageId ? { ...m, content: editedContent } : m
      ))
      setEditingMessageId(null)
      setEditedContent('')
    }
  }

  const regenerateResponse = async () => {
    if (messages.length < 2) return
    
    const lastAiIndex = messages.length - 1
    if (messages[lastAiIndex].role === 'assistant') {
      const newMessages = messages.slice(0, -1)
      setMessages(newMessages)
      
      const lastUserMessage = newMessages[newMessages.length - 1]
      if (lastUserMessage && lastUserMessage.role === 'user') {
        setIsTyping(true)
        setShowSuggestions(false)
        setIsStopRequested(false)
        
        const controller = new AbortController()
        abortControllerRef.current = controller
        
        try {
          const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: lastUserMessage.content,
              attachments: lastUserMessage.attachments,
              isDeepThinking,
              conversationId: currentConversationId
            }),
            signal: controller.signal
          })
          
          if (response.ok) {
            const data = await response.json()
            const aiMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: data.content,
              timestamp: new Date(),
              isDeepThinking: data.isDeepThinking
            }
            setMessages(prev => [...prev, aiMessage])
            setLastAiContent(data.content)
            setShowSuggestions(true)
          } else {
            throw new Error('API Error')
          }
        } catch (error: any) {
          if (error.name === 'AbortError') {
            toast.success('تم إيقاف التوليد')
          } else {
            toast.error('حدث خطأ في الاتصال')
          }
        } finally {
          setIsTyping(false)
          abortControllerRef.current = null
        }
      }
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('تم النسخ')
    } catch (error) {
      toast.error('فشل النسخ')
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploading(true)

    for (const file of Array.from(files)) {
      const isImage = file.type.startsWith('image/')
      const isPdf = file.type === 'application/pdf'

      if (!isImage && !isPdf) {
        toast.error('يرجى رفع صورة أو ملف PDF فقط')
        continue
      }

      const url = URL.createObjectURL(file)
      const attachment: Attachment = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: isImage ? 'image' : 'pdf',
        name: file.name,
        url
      }

      setAttachments(prev => [...prev, attachment])
    }
    
    setUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    toast.success('تم رفع الملفات')
  }

  const removeAttachment = (attId: string) => {
    setAttachments(prev => prev.filter(a => a.id !== attId))
  }

  const formatContent = (content: string) => {
    let formatted = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-slate-800 px-1 rounded text-sm">$1</code>')
      .replace(/\n/g, '<br/>')
    return formatted
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    handleSend(suggestion)
  }

  const handleSend = async (overrideMessage?: string) => {
    const messageToSend = overrideMessage || inputValue
    if (!messageToSend.trim() && attachments.length === 0) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageToSend,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setAttachments([])
    setIsTyping(true)
    setShowSuggestions(false)
    setIsStopRequested(false)

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageToSend,
          attachments: attachments.length > 0 ? attachments : undefined,
          isDeepThinking,
          conversationId: currentConversationId
        }),
        signal: controller.signal
      })

      if (response.ok) {
        const data = await response.json()
        
        if (!currentConversationId && data.conversationId) {
          const newConv: Conversation = {
            id: data.conversationId,
            title: data.title || 'محادثة جديدة',
            updatedAt: new Date()
          }
          setConversations(prev => [newConv, ...prev])
          setCurrentConversationId(data.conversationId)
        }

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.content,
          timestamp: new Date(),
          isDeepThinking: data.isDeepThinking
        }
        setMessages(prev => [...prev, aiMessage])
        setLastAiContent(data.content)
        setShowSuggestions(true)
      } else {
        throw new Error('API Error')
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        toast.success('تم إيقاف التوليد')
      } else {
        toast.error('حدث خطأ في الاتصال')
        const fallbackMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
          timestamp: new Date(),
          isDeepThinking: false
        }
        setMessages(prev => [...prev, fallbackMessage])
        setShowSuggestions(true)
      }
    } finally {
      setIsTyping(false)
      abortControllerRef.current = null
    }
  }

  const handleLike = (messageId: string) => {
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, isLiked: !m.isLiked, isDisliked: false } : m
    ))
  }

  const handleDislike = (messageId: string) => {
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, isDisliked: !m.isDisliked, isLiked: false } : m
    ))
  }

  const pinnedConversations = conversations.filter(c => c.isPinned)
  const regularConversations = conversations.filter(c => !c.isPinned)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            مساعد الذكاء الاصطناعي
          </h1>
          <p className="text-slate-400 mt-1">اسأل أي سؤال واحصل على إجابة فورية ✨</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Conversations */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    المحادثات
                  </h2>
                  <Button size="sm" onClick={createNewConversation}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full mb-4 justify-start"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <History className="w-4 h-4 ml-2" />
                  {showHistory ? 'إخفاء السجل' : 'إظهار السجل'}
                </Button>

                {showHistory && (
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {pinnedConversations.length > 0 && (
                      <>
                        <p className="text-xs text-slate-500 font-medium">المثبتة</p>
                        {pinnedConversations.map(conv => (
                          <div 
                            key={conv.id}
                            className={`p-3 rounded-lg cursor-pointer transition-all ${
                              currentConversationId === conv.id 
                                ? 'bg-primary/20 border border-primary/50' 
                                : 'bg-slate-800/50 hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div 
                                className="flex-1 min-w-0"
                                onClick={() => selectConversation(conv)}
                              >
                                <p className="font-medium text-sm truncate">{conv.title}</p>
                                <p className="text-xs text-slate-500 mt-1">
                                  {formatTime(conv.updatedAt)}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => togglePinConversation(conv.id)}
                                  className="p-1 hover:bg-slate-700 rounded"
                                >
                                  <Pin className="w-4 h-4 text-primary" />
                                </button>
                                <button
                                  onClick={() => deleteConversation(conv.id)}
                                  className="p-1 hover:bg-slate-700 rounded"
                                >
                                  <Trash2 className="w-4 h-4 text-red-400" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                    {regularConversations.map(conv => (
                      <div 
                        key={conv.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          currentConversationId === conv.id 
                            ? 'bg-primary/20 border border-primary/50' 
                            : 'bg-slate-800/50 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div 
                            className="flex-1 min-w-0"
                            onClick={() => selectConversation(conv)}
                          >
                            {isEditingTitle && currentConversationId === conv.id ? (
                              <input
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                onBlur={() => updateConversationTitle(conv.id, editedTitle)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    updateConversationTitle(conv.id, editedTitle)
                                  }
                                }}
                                className="w-full bg-slate-700 px-2 py-1 rounded text-sm"
                                autoFocus
                              />
                            ) : (
                              <p className="font-medium text-sm truncate">{conv.title}</p>
                            )}
                            <p className="text-xs text-slate-500 mt-1">
                              {formatTime(conv.updatedAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setIsEditingTitle(true)
                                setEditedTitle(conv.title)
                                setCurrentConversationId(conv.id)
                              }}
                              className="p-1 hover:bg-slate-700 rounded"
                            >
                              <Edit3 className="w-4 h-4 text-slate-400" />
                            </button>
                            <button
                              onClick={() => togglePinConversation(conv.id)}
                              className="p-1 hover:bg-slate-700 rounded"
                            >
                              <PinOff className="w-4 h-4 text-slate-400" />
                            </button>
                            <button
                              onClick={() => deleteConversation(conv.id)}
                              className="p-1 hover:bg-slate-700 rounded"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {conversations.length === 0 && (
                      <p className="text-center text-slate-500 text-sm py-4">
                        لا توجد محادثات سابقة
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="min-h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Tutor</h3>
                    <p className="text-xs text-slate-500">متصل الآن</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {currentConversationId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsEditingTitle(true)
                        const conv = conversations.find(c => c.id === currentConversationId)
                        if (conv) setEditedTitle(conv.title)
                      }}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant={isDeepThinking ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setIsDeepThinking(!isDeepThinking)}
                    className={isDeepThinking ? 'bg-purple-500 hover:bg-purple-600' : ''}
                  >
                    <Brain className="w-4 h-4 ml-1" />
                    {isDeepThinking ? '✓ التفكير العميق' : 'التفكير العميق'}
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-4">
                      <Sparkles className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">مرحباً! كيف يمكنني مساعدتك؟</h3>
                    <p className="text-slate-500 mb-6">اختر سؤالاً سريعاً أو اكتب سؤالك</p>
                    
                    <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                      {QUICK_QUESTIONS.map(q => (
                        <button
                          key={q.id}
                          onClick={() => handleSuggestionClick(q.text)}
                          className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-primary/50 transition-all text-right"
                        >
                          <q.icon className="w-5 h-5 text-primary mb-2" />
                          <p className="text-sm">{q.text}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                        message.role === 'user' 
                          ? 'bg-primary' 
                          : 'bg-gradient-to-br from-primary to-purple-500'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        {message.isDeepThinking && (
                          <Badge variant="info" className="self-start bg-purple-500/20 text-purple-300">
                            <Brain className="w-3 h-3 ml-1" />
                            تفكير عميق
                          </Badge>
                        )}
                        
                        {editingMessageId === message.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editedContent}
                              onChange={(e) => setEditedContent(e.target.value)}
                              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-600 text-sm resize-none"
                              rows={4}
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={saveMessageEdit}>
                                <Save className="w-4 h-4 ml-1" />
                                حفظ
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditingMessageId(null)}>
                                <XCircle className="w-4 h-4 ml-1" />
                                إلغاء
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-2">
                                {message.attachments.map(att => (
                                  <div key={att.id} className="relative group">
                                    {att.type === 'image' && (
                                      <img 
                                        src={att.url} 
                                        alt={att.name} 
                                        className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
                                        onClick={() => setSelectedImage(att.url)}
                                      />
                                    )}
                                    {att.type === 'pdf' && (
                                      <div className="w-20 h-20 bg-slate-700 rounded-lg flex items-center justify-center">
                                        <FileText className="w-8 h-8 text-red-400" />
                                      </div>
                                    )}
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
                                <div className="flex items-center gap-3 mt-3 pt-2 border-t border-slate-700/50 flex-wrap">
                                  <button
                                    onClick={() => copyToClipboard(message.content)}
                                    className="text-xs text-slate-500 hover:text-primary flex items-center gap-1 transition-colors"
                                  >
                                    <Copy className="w-3 h-3" />
                                    نسخ
                                  </button>
                                  <button
                                    onClick={() => speakText(message.content)}
                                    className="text-xs text-slate-500 hover:text-primary flex items-center gap-1 transition-colors"
                                  >
                                    <Volume2 className="w-3 h-3" />
                                    استماع
                                  </button>
                                  <button
                                    onClick={() => handleMessageEdit(message.id)}
                                    className="text-xs text-slate-500 hover:text-primary flex items-center gap-1 transition-colors"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    تعديل
                                  </button>
                                </div>
                              )}
                            </div>
                            
                            <div className={`flex items-center gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <p className="text-xs text-slate-500">
                                {formatTime(message.timestamp)}
                              </p>
                              {message.role === 'assistant' && (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleLike(message.id)}
                                    className={`p-1 rounded hover:bg-slate-700 transition-colors ${
                                      message.isLiked ? 'text-green-400' : 'text-slate-500'
                                    }`}
                                  >
                                    <ThumbsUp className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDislike(message.id)}
                                    className={`p-1 rounded hover:bg-slate-700 transition-colors ${
                                      message.isDisliked ? 'text-red-400' : 'text-slate-500'
                                    }`}
                                  >
                                    <ThumbsDown className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gradient-to-r from-primary/20 to-purple-500/10 p-4 rounded-2xl rounded-tr-none border border-purple-500/20">
                        {isStopRequested ? (
                          <div className="flex items-center gap-2 text-slate-400">
                            <AlertCircle className="w-5 h-5" />
                            <span>تم إيقاف التوليد</span>
                          </div>
                        ) : (
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {showSuggestions && lastAiContent && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                      <p className="text-sm text-slate-400 mb-3">هل تريد مني:</p>
                      <div className="flex flex-wrap gap-2">
                        {AI_SUGGESTIONS.map(s => (
                          <button
                            key={s.id}
                            onClick={() => handleSuggestionClick(s.text)}
                            className="px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-sm flex items-center gap-2 transition-colors"
                          >
                            <s.icon className="w-4 h-4 text-primary" />
                            {s.text}
                          </button>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-700">
                        <button
                          onClick={() => copyToClipboard(lastAiContent)}
                          className="flex items-center gap-1 text-xs text-slate-500 hover:text-primary"
                        >
                          <Clipboard className="w-3 h-3" />
                          نسخ الإجابة
                        </button>
                        <button
                          onClick={regenerateResponse}
                          className="flex items-center gap-1 text-xs text-slate-500 hover:text-primary"
                        >
                          <RefreshCcw className="w-3 h-3" />
                          إعادة توليد
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </CardContent>

              {/* Attachments Preview */}
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
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-slate-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="اكتب سؤالك هنا أو ارفع صورة..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
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
                  
                  {/* Voice Input */}
                  <Button 
                    variant={isRecording ? "primary" : "outline"}
                    onClick={isRecording ? stopRecording : startRecording}
                    className={isRecording ? 'bg-red-500 hover:bg-red-600' : ''}
                  >
                    {isRecording ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </Button>
                  
                  {/* Stop Generation */}
                  {isTyping && !isStopRequested && (
                    <Button variant="danger" onClick={stopGeneration}>
                      <StopCircle className="w-4 h-4" />
                    </Button>
                  )}
                  
                  {/* Upload */}
                  <Button 
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                  </Button>
                  
                  {/* Send */}
                  <Button 
                    onClick={() => handleSend()} 
                    disabled={!inputValue.trim() && attachments.length === 0 && !isTyping}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Quick Actions Row */}
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Image className="w-3 h-3" />
                    ارفع صور لاستخراج النصوص ✨
                  </p>
                  
                  <div className="flex items-center gap-2">
                    {inputValue && (
                      <>
                        <button
                          onClick={() => copyToClipboard(inputValue)}
                          className="text-xs text-slate-500 hover:text-primary flex items-center gap-1"
                        >
                          <Clipboard className="w-3 h-3" />
                          نسخ
                        </button>
                        <button
                          onClick={() => setInputValue('')}
                          className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1"
                        >
                          <XCircle className="w-3 h-3" />
                          مسح
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} title="معاينة الصورة" size="lg">
        {selectedImage && (
          <div>
            <img src={selectedImage} alt="Preview" className="w-full rounded-lg" />
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => copyToClipboard(selectedImage)}>
                <Copy className="w-4 h-4 ml-2" />
                نسخ الرابط
              </Button>
              <Button className="flex-1" onClick={() => setSelectedImage(null)}>
                إغلاق
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
