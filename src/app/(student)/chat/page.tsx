'use client'

import { useState, useRef, useEffect } from 'react'
import Card, { CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import { 
  MessageCircle,
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  Image,
  Smile,
  CheckCircle,
  User
} from 'lucide-react'

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  isRead: boolean
  isAdmin?: boolean
}

interface Conversation {
  id: string
  userId: string
  userName: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isOnline: boolean
}

const mockConversations: Conversation[] = [
  { id: '1', userId: '1', userName: 'أحمد محمد', lastMessage: 'هل يمكنني إعادة الاختبار؟', lastMessageTime: '10:30', unreadCount: 2, isOnline: true },
  { id: '2', userId: '2', userName: 'فاطمة علي', lastMessage: 'شكراً على المساعدة', lastMessageTime: '09:15', unreadCount: 0, isOnline: false },
  { id: '3', userId: '3', userName: 'محمود حسن', lastMessage: 'عنوان المحاضرة الجديدة', lastMessageTime: 'أمس', unreadCount: 1, isOnline: true },
]

const mockMessages: Message[] = [
  { id: '1', senderId: '1', senderName: 'أحمد', content: 'مرحباً، أريد الاستفسار عن كورس قوانين نيوتن', timestamp: '10:00', isRead: true },
  { id: '2', senderId: 'admin', senderName: 'الدعم', content: 'مرحباً أحمد! كيف يمكنني مساعدتك؟', timestamp: '10:05', isRead: true, isAdmin: true },
  { id: '3', senderId: '1', senderName: 'أحمد', content: 'هل يمكنني إعادة الاختبار؟', timestamp: '10:30', isRead: false },
]

export default function ChatPage() {
  const [conversations] = useState<Conversation[]>(mockConversations)
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1')
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeConversation = conversations.find(c => c.id === selectedConversation)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'أنا',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    }

    setMessages([...messages, newMsg])
    setNewMessage('')

    setTimeout(() => {
      setIsTyping(true)
    }, 1000)

    setTimeout(() => {
      setIsTyping(false)
      const responseMsg: Message = {
        id: (Date.now() + 1).toString(),
        senderId: 'admin',
        senderName: 'الدعم',
        content: 'شكراً لرسالتك! سنرد عليك في أقرب وقت.',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
        isAdmin: true
      }
      setMessages(prev => [...prev, responseMsg])
    }, 3000)
  }

  const filteredConversations = conversations.filter(c => 
    c.userName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="flex h-full gap-4">
        <Card className="w-80 flex-shrink-0 flex flex-col">
          <CardContent className="p-4 flex-1 overflow-hidden flex flex-col">
            <h2 className="font-bold flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-primary" />
              المحادثات
              <Badge variant="primary">{conversations.length}</Badge>
            </h2>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredConversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full p-3 rounded-lg text-right transition-colors ${
                    selectedConversation === conv.id 
                      ? 'bg-primary/20 border border-primary/30' 
                      : 'hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                        {conv.userName.charAt(0)}
                      </div>
                      {conv.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{conv.userName}</span>
                        <span className="text-xs text-slate-500">{conv.lastMessageTime}</span>
                      </div>
                      <p className="text-sm text-slate-400 truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-xs font-bold">
                        {conv.unreadCount}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                    {activeConversation?.userName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold">{activeConversation?.userName}</h3>
                    <p className="text-xs text-slate-400">
                      {activeConversation?.isOnline ? (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                          متصل
                        </span>
                      ) : 'غير متصل'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm"><Phone className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm"><Video className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-start' : 'justify-end'}`}>
                    <div className="max-w-[70%]">
                      {msg.isAdmin && (
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="primary" className="text-xs">الدعم</Badge>
                        </div>
                      )}
                      <div className={`p-3 rounded-2xl ${msg.senderId === 'me' ? 'bg-primary text-white rounded-tl-none' : 'bg-slate-800 rounded-tr-none'}`}>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <div className={`flex items-center gap-2 mt-1 text-xs text-slate-500 ${msg.senderId === 'me' ? 'justify-start' : 'justify-end'}`}>
                        <span>{msg.timestamp}</span>
                        {msg.senderId === 'me' && <CheckCircle className={`w-3 h-3 ${msg.isRead ? 'text-emerald-400' : ''}`} />}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-slate-700">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm"><Image className="w-5 h-5" /></Button>
                  <Button variant="ghost" size="sm"><Smile className="w-5 h-5" /></Button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="اكتب رسالتك..."
                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">اختر محادثة للبدء</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
