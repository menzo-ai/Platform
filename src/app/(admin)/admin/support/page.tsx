'use client'

import { useState } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Modal from '@/components/ui/modal'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import { 
  Headphones, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Send,
  ChevronRight,
  FileText,
  CreditCard,
  HelpCircle,
  Eye,
  MessageCircle
} from 'lucide-react'

interface Ticket {
  id: string
  subject: string
  category: 'support' | 'payment' | 'technical' | 'content'
  status: 'open' | 'pending' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high'
  user: { name: string; email: string }
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
    user: { name: 'أحمد محمد', email: 'ahmed@example.com' },
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
    status: 'pending',
    priority: 'medium',
    user: { name: 'فاطمة علي', email: 'fatma@example.com' },
    createdAt: '2024-01-14T14:20:00',
    updatedAt: '2024-01-15T09:00:00',
    messages: [
      { id: '1', sender: 'user', content: 'هل يمكنني تجديد الاشتراك الشهري؟', createdAt: '2024-01-14T14:20:00' },
      { id: '2', sender: 'admin', content: 'نعم بالطبع! يمكنك التجديد من صفحة الاشتراكات.', createdAt: '2024-01-14T15:00:00' }
    ]
  },
  {
    id: '3',
    subject: 'خطأ في محاضرة رقم 5',
    category: 'content',
    status: 'resolved',
    priority: 'low',
    user: { name: 'محمد خالد', email: 'mohamed@example.com' },
    createdAt: '2024-01-10T08:00:00',
    updatedAt: '2024-01-11T12:00:00',
    messages: [
      { id: '1', sender: 'user', content: 'هناك خطأ في الشرح في محاضرة رقم 5', createdAt: '2024-01-10T08:00:00' },
      { id: '2', sender: 'admin', content: 'شكراً لإبلاغنا! تم تصحيح الخطأ.', createdAt: '2024-01-10T10:00:00' },
      { id: '3', sender: 'user', content: 'ممتاز، شكراً!', createdAt: '2024-01-11T12:00:00' }
    ]
  }
]

const categoryIcons = { support: HelpCircle, payment: CreditCard, technical: AlertCircle, content: FileText }
const categoryLabels = { support: 'استفسار عام', payment: 'مشكلات الدفع', technical: 'مشاكل تقنية', content: 'مشاكل المحتوى' }
const statusColors = { open: 'info', pending: 'warning', resolved: 'success', closed: 'primary' } as const
const priorityColors = { low: 'info', medium: 'warning', high: 'danger' } as const
const statusLabels = { open: 'مفتوح', pending: 'قيد الانتظار', resolved: 'تم الحل', closed: 'مغلق' }
const priorityLabels = { low: 'منخفضة', medium: 'متوسطة', high: 'عالية' }

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [newMessage, setNewMessage] = useState('')

  const filteredTickets = tickets.filter(ticket => {
    if (statusFilter !== 'all' && ticket.status !== statusFilter) return false
    if (searchQuery && !ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !ticket.user.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return
    
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === selectedTicket.id) {
        return {
          ...ticket,
          status: 'pending' as const,
          updatedAt: new Date().toISOString(),
          messages: [
            ...ticket.messages,
            { id: Date.now().toString(), sender: 'admin' as const, content: newMessage, createdAt: new Date().toISOString() }
          ]
        }
      }
      return ticket
    })
    
    setTickets(updatedTickets)
    setSelectedTicket(updatedTickets.find(t => t.id === selectedTicket.id) || null)
    setNewMessage('')
  }

  const handleUpdateStatus = (status: Ticket['status']) => {
    if (!selectedTicket) return
    const updatedTickets = tickets.map(t => t.id === selectedTicket.id ? { ...t, status } : t)
    setTickets(updatedTickets)
    setSelectedTicket(updatedTickets.find(t => t.id === selectedTicket.id) || null)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  const stats = {
    open: tickets.filter(t => t.status === 'open').length,
    pending: tickets.filter(t => t.status === 'pending').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    total: tickets.length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <Headphones className="w-7 h-7 text-primary" />
            إدارة التذاكر
          </h1>
          <p className="text-slate-400">الرد على استفسارات الطلاب</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-400" />
          <p className="text-2xl font-bold">{stats.open}</p>
          <p className="text-xs text-slate-400">مفتوحة</p>
        </Card>
        <Card className="p-4 text-center">
          <Clock className="w-6 h-6 mx-auto mb-2 text-amber-400" />
          <p className="text-2xl font-bold">{stats.pending}</p>
          <p className="text-xs text-slate-400">قيد الانتظار</p>
        </Card>
        <Card className="p-4 text-center">
          <CheckCircle className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
          <p className="text-2xl font-bold">{stats.resolved}</p>
          <p className="text-xs text-slate-400">تم الحل</p>
        </Card>
        <Card className="p-4 text-center">
          <MessageCircle className="w-6 h-6 mx-auto mb-2 text-blue-400" />
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-slate-400">الإجمالي</p>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input type="text" placeholder="ابحث في التذاكر..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pr-10" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input py-2 w-auto md:w-40">
              <option value="all">الكل</option>
              <option value="open">مفتوحة</option>
              <option value="pending">قيد الانتظار</option>
              <option value="resolved">تم الحل</option>
              <option value="closed">مغلقة</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <Card className="lg:col-span-1">
          <CardContent className="p-0">
            <div className="divide-y divide-slate-700 max-h-[600px] overflow-y-auto">
              {filteredTickets.map(ticket => {
                const CategoryIcon = categoryIcons[ticket.category]
                return (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`w-full p-4 text-right hover:bg-slate-800/50 transition-colors ${selectedTicket?.id === ticket.id ? 'bg-primary/10' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <CategoryIcon className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant={statusColors[ticket.status]} className="text-xs">{statusLabels[ticket.status]}</Badge>
                          <Badge variant={priorityColors[ticket.priority]} className="text-xs">{priorityLabels[ticket.priority]}</Badge>
                        </div>
                        <p className="font-medium text-sm truncate">{ticket.subject}</p>
                        <p className="text-xs text-slate-500 mt-1">{ticket.user.name}</p>
                        <p className="text-xs text-slate-600">{formatDate(ticket.updatedAt)}</p>
                      </div>
                      {ticket.messages.length > 1 && (
                        <Badge variant="info" className="text-xs">{ticket.messages.length}</Badge>
                      )}
                    </div>
                  </button>
                )
              })}
              {filteredTickets.length === 0 && (
                <div className="p-8 text-center text-slate-400">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>لا توجد تذاكر</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          {selectedTicket ? (
            <>
              <CardHeader className="border-b border-slate-700">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold">{selectedTicket.subject}</h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
                      <User className="w-4 h-4" />
                      {selectedTicket.user.name}
                      <span>•</span>
                      {selectedTicket.user.email}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusColors[selectedTicket.status]}>{statusLabels[selectedTicket.status]}</Badge>
                    <Badge variant={priorityColors[selectedTicket.priority]}>{priorityLabels[selectedTicket.priority]}</Badge>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" onClick={() => handleUpdateStatus('resolved')}>
                    <CheckCircle className="w-4 h-4" /> تم الحل
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleUpdateStatus('closed')}>
                    <Eye className="w-4 h-4" /> إغلاق
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
                {selectedTicket.messages.map(message => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      <div className={`p-3 rounded-2xl ${
                        message.sender === 'user' ? 'bg-slate-800 rounded-tl-none' : 'bg-primary/20 rounded-tr-none'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          {message.sender === 'admin' && <span className="text-xs text-emerald-400">الدعم الفني</span>}
                          <span className="text-xs text-slate-500">{formatDate(message.createdAt)}</span>
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
                    <input type="text" placeholder="اكتب ردك..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} className="input flex-1" />
                    <Button onClick={handleSendMessage}><Send className="w-4 h-4" /></Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 min-h-[400px]">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>اختر تذكرة للرد عليها</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}