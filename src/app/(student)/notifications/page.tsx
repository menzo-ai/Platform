'use client'

import { useEffect, useState } from 'react'
import Card from '@/components/ui/card'
import Badge from '@/components/ui/badge'
import Button from '@/components/ui/button'
import { Bell, Check, CheckCheck, Clock, Trash2 } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    fetchNotifications()
  }, [filter])

  const fetchNotifications = async () => {
    try {
      const url = filter === 'unread' ? '/api/notifications?unread=true' : '/api/notifications'
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      })
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'new_lecture':
        return '📚'
      case 'subscription':
        return '💳'
      case 'exam_result':
        return '📝'
      case 'admin_reply':
        return '💬'
      default:
        return '🔔'
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'new_lecture':
        return <Badge variant="primary">محاضرة جديدة</Badge>
      case 'subscription':
        return <Badge variant="success">اشتراك</Badge>
      case 'exam_result':
        return <Badge variant="warning">نتيجة اختبار</Badge>
      case 'admin_reply':
        return <Badge variant="info">رد الإدارة</Badge>
      default:
        return <Badge>إشعار</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">الإشعارات</h1>
          <p className="text-slate-400">جميع إشعاراتك في مكان واحد</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            قراءة الكل
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          الكل
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'unread'
              ? 'bg-primary text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          غير المقروءة
        </button>
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-700 rounded w-1/4" />
                  <div className="h-3 bg-slate-700 rounded w-3/4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 transition-all ${
                !notification.isRead ? 'border-primary/30 bg-primary/5' : ''
              }`}
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-xl">
                  {getTypeIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{notification.title}</h3>
                    {getTypeBadge(notification.type)}
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{notification.message}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(notification.createdAt)}
                    </span>
                  </div>
                </div>
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                    title="تحديد كمقروء"
                  >
                    <Check className="w-5 h-5 text-primary" />
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Bell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">لا توجد إشعارات</h3>
          <p className="text-slate-400">
            {filter === 'unread' 
              ? 'جميع الإشعارات مقروءة' 
              : 'ستظهر الإشعارات هنا عندما تكون متاحة'}
          </p>
        </div>
      )}
    </div>
  )
}
