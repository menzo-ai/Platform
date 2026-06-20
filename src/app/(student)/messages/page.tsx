'use client'

import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Avatar from '@/components/ui/avatar'
import EmptyState from '@/components/ui/empty-state'
import { MessageSquare, Send, Search, User } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  isRead: boolean
  createdAt: string
  sender?: { name: string }
  receiver?: { name: string }
}

interface Contact {
  id: string
  name: string
  role: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

export default function MessagesPage() {
  const { data: session } = useSession()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchContacts()
  }, [])

  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact.id)
    }
  }, [selectedContact])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchContacts = async () => {
    try {
      // Mock contacts for now - in production, this would be an API call
      setContacts([
        {
          id: 'admin-1',
          name: 'إدارة المنصة',
          role: 'SUPPORT',
          lastMessage: 'مرحباً! كيف يمكنني مساعدتك؟',
          lastMessageTime: new Date().toISOString(),
          unreadCount: 1,
        },
      ])
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMessages = async (contactId: string) => {
    try {
      // Mock messages for now
      setMessages([
        {
          id: '1',
          senderId: contactId,
          receiverId: session?.user?.id || '',
          content: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
          isRead: true,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ])
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return

    setIsSending(true)
    try {
      const message: Message = {
        id: Date.now().toString(),
        senderId: session?.user?.id || '',
        receiverId: selectedContact.id,
        content: newMessage,
        isRead: false,
        createdAt: new Date().toISOString(),
      }

      setMessages(prev => [...prev, message])
      setNewMessage('')
      
      // Update contact last message
      setContacts(prev => prev.map(c => 
        c.id === selectedContact.id 
          ? { ...c, lastMessage: newMessage, lastMessageTime: new Date().toISOString() }
          : c
      ))
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-[calc(100vh-180px)]">
      <div className="flex gap-6 h-full">
        {/* Contacts List */}
        <div className="w-80 flex-shrink-0">
          <Card className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-700">
              <h2 className="font-bold mb-3">الرسائل</h2>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="بحث..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pr-9 text-sm"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-12 h-12 bg-slate-700 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-700 rounded w-24" />
                        <div className="h-3 bg-slate-700 rounded w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`w-full p-4 flex gap-3 hover:bg-slate-800/50 transition-colors text-right ${
                      selectedContact?.id === contact.id ? 'bg-slate-800' : ''
                    }`}
                  >
                    <Avatar name={contact.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium truncate">{contact.name}</span>
                        <span className="text-xs text-slate-500">
                          {formatDateTime(contact.lastMessageTime).split('،')[0]}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 truncate">{contact.lastMessage}</p>
                    </div>
                    {contact.unreadCount > 0 && (
                      <div className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                        {contact.unreadCount}
                      </div>
                    )}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-slate-400">
                  لا توجد محادثات
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="flex-1">
          <Card className="h-full flex flex-col">
            {selectedContact ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-700 flex items-center gap-3">
                  <Avatar name={selectedContact.name} size="sm" />
                  <div>
                    <h3 className="font-medium">{selectedContact.name}</h3>
                    <p className="text-xs text-slate-400">متصل الآن</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => {
                    const isMe = message.senderId === session?.user?.id
                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                      >
                        <Avatar
                          name={isMe ? session?.user?.name || 'Me' : selectedContact.name}
                          size="sm"
                        />
                        <div className={`max-w-[70%] ${isMe ? 'text-left' : 'text-right'}`}>
                          <div
                            className={`inline-block p-3 rounded-2xl ${
                              isMe
                                ? 'bg-primary text-white rounded-tr-sm'
                                : 'bg-slate-800 rounded-tl-sm'
                            }`}
                          >
                            <p>{message.content}</p>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            {formatDateTime(message.createdAt).split('،')[0]}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-slate-700">
                  <div className="flex gap-3">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="اكتب رسالتك..."
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      className="flex-1"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || isSending}
                      isLoading={isSending}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <EmptyState
                  icon={MessageSquare}
                  title="اختر محادثة"
                  description="اختر محادثة من القائمة للبدء في مراسلة الإدارة"
                />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
