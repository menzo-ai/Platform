'use client'

import { useState } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Modal from '@/components/ui/modal'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import Select from '@/components/ui/select'
import { 
  Headphones, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MessageCircle,
  Send,
  ChevronRight,
  FileText,
  CreditCard,
  HelpCircle,
  User
} from 'lucide-react'

interface Ticket {
  id: string
  subject: string
  category: 'support' | 'payment' | 'technical' | 'content'
  status: 'open' | 'pending' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
  messages: Message[]
}

interface Message {
  id: string
  sender: 'user' | 'admin'
  content: string
  createdAt: string
}

const mockTickets: Ticket[] = [
  {
    id: '1',
    subject: 'مشكلة في تشغيل الفيديو',
    category: 'technical',
    status: 'open',
    priority: 'high',
    createdAt: '2024-01-15T10:30:00',
    updatedAt: '2024-01-15T10:30:00',
    messages: [
      { id: '1', sender: 'user', content: 'مرحباً، لا أستطيع تشغيل فيديوهات المحاضرات. تظهر لي شاشة سوداء.', createdAt: '2024-01-15T10:30:00' }
    ]
  },
  {
    id: '2',
    subject: 'استفسار عن تجديد الاشتراك',
    category: 'payment',
    status: 'resolved',
    priority: 'medium',
    createdAt: '2024-01-10T14:20:00',
    updatedAt: '2024-01-11T09:00:00',
    messages: [
      { id: '1', sender: 'user', content: 'هل يمكنني تجديد الاشتراك الشهري؟', createdAt: '2024-01-10T14:20:00' },
      { id: '2', sender: 'admin', content: 'نعم بالطبع! يمكنك التجديد من صفحة الاشتراكات.', createdAt: '2024-01-10T15:00:00' },
      { id: '3', sender: 'user', content: 'شكراً جزيلاً!', createdAt: '2024-01-11T09:00:00' }
    ]
  }
]

const categoryIcons = {
  support: HelpCircle,
  payment: CreditCard,
  technical: AlertCircle,
  content: FileText
}

const categoryLabels = {
  support: 'استفسار عام',
  payment: 'مشكلات الدفع',
  technical: 'مشاكل تقنية',
  content: 'مشاكل المحتوى'
}

const statusColors = {
  open: 'info',
  pending: 'warning',
  resolved: 'success',
  closed: 'primary'
} as const

const priorityColors = {
  low: 'info',
  medium: 'warning',
  high: 'danger'
} as const

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [newMessage, setNewMessage] = useState('')

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return
    
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === selectedTicket.id) {
        return {
          ...ticket,
          updatedAt: new Date().toISOString(),
          messages: [
            ...ticket.messages,
            {
              id: Date.now().toString(),
              sender: 'user' as const,
              content: newMessage,
              createdAt: new Date().toISOString()
            }
          ]
        }
      }
      return ticket
    })
    
    setTickets(updatedTickets)
    setSelectedTicket(updatedTickets.find(t => t.id === selectedTicket.id) || null)
    setNewMessage('')
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
              <Headphones className="w-7 h-7 text-primary" />
              الدعم الفني
            </h1>
            <p className="text-slate-400">تواصل معنا لأي استفسار أو مشكلة</p>
          </div>
          <Button onClick={() => setShowNewTicket(true)}>
            <Plus className="w-4 h-4" />
            تذكرة جديدة
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: HelpCircle, label: 'استفسار عام', color: 'text-blue-400' },
            { icon: CreditCard, label: 'مشكلات الدفع', color: 'text-emerald-400' },
            { icon: AlertCircle, label: 'مشاكل تقنية', color: 'text-red-400' },
            { icon: FileText, label: 'مشاكل المحتوى', color: 'text-amber-400' }
          ].map((item, i) => (
            <button key={i} className="p-4 rounded-xl bg-surface-dark border border-slate-700 hover:border-primary/50 transition-colors text-center group">
              <item.icon className={`w-8 h-8 mx-auto mb-2 ${item.color} group-hover:scale-110 transition-transform`} />
              <p className="text-sm font-medium">{item.label}</p>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Tickets List */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="ابحث في التذاكر..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pr-10"
                  />
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {filteredTickets.map(ticket => {
                    const CategoryIcon = categoryIcons[ticket.category]
                    return (
                      <button
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className={`w-full p-3 rounded-lg text-right transition-colors ${
                          selectedTicket?.id === ticket.id
                            ? 'bg-primary/20 border border-primary/50'
                            : 'bg-slate-800/50 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <CategoryIcon className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={statusColors[ticket.status]} className="text-xs">{ticket.status === 'open' ? 'مفتوح' : ticket.status === 'pending' ? 'قيد الانتظار' : ticket.status === 'resolved' ? 'تم الحل' : 'مغلق'}</Badge>
                              <Badge variant={priorityColors[ticket.priority]} className="text-xs">{ticket.priority === 'low' ? 'منخفض' : ticket.priority === 'medium' ? 'متوسط' : 'عالي'}</Badge>
                            </div>
                            <p className="font-medium text-sm truncate">{ticket.subject}</p>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(ticket.updatedAt)}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-500" />
                        </div>
                      </button>
                    )
                  })}

                  {filteredTickets.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>لا توجد تذاكر</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="min-h-[500px] flex flex-col">
              {selectedTicket ? (
                <>
                  <CardHeader className="border-b border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold">{selectedTicket.subject}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={statusColors[selectedTicket.status]}>
                            {selectedTicket.status === 'open' ? 'مفتوح' : selectedTicket.status === 'pending' ? 'قيد الانتظار' : selectedTicket.status === 'resolved' ? 'تم الحل' : 'مغلق'}
                          </Badge>
                          <span className="text-xs text-slate-500">{formatDate(selectedTicket.createdAt)}</span>
                        </div>
                      </div>
                      <Badge variant="info">{categoryLabels[selectedTicket.category]}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedTicket.messages.map(message => (
                      <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[80%] ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                          <div className={`p-3 rounded-2xl ${
                            message.sender === 'user'
                              ? 'bg-primary/20 rounded-tr-none'
                              : 'bg-slate-700 rounded-tl-none'
                          }`}>
                            <div className="flex items-center gap-2 mb-1">
                              {message.sender === 'admin' && <User className="w-4 h-4 text-emerald-400" />}
                              <span className="text-xs text-slate-400">{formatDate(message.createdAt)}</span>
                            </div>
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>

                  {selectedTicket.status !== 'closed' && (
                    <div className="p-4 border-t border-slate-700">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="اكتب رسالتك..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="input flex-1"
                        />
                        <Button onClick={handleSendMessage}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>اختر تذكرة لعرض المحادثة</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* New Ticket Modal */}
      <Modal isOpen={showNewTicket} onClose={() => setShowNewTicket(false)} title="إنشاء تذكرة جديدة" size="lg">
        <form className="space-y-4">
          <Select
            label="نوع المشكلة"
            options={[
              { value: 'support', label: 'استفسار عام' },
              { value: 'payment', label: 'مشكلة في الدفع' },
              { value: 'technical', label: 'مشكلة تقنية' },
              { value: 'content', label: 'مشكلة في المحتوى' }
            ]}
          />
          <Input label="عنوان المشكلة" placeholder="اكتب عنواناً مختصراً للمشكلة" />
          <Textarea label="وصف المشكلة" placeholder="اشرح مشكلتك بالتفصيل..." rows={5} />
          <Select
            label="الأولوية"
            options={[
              { value: 'low', label: 'منخفضة' },
              { value: 'medium', label: 'متوسطة' },
              { value: 'high', label: 'عالية' }
            ]}
          />
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowNewTicket(false)}>إلغاء</Button>
            <Button type="submit" className="flex-1">إرسال التذكرة</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}