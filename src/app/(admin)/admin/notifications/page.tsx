'use client'

import { useState } from 'react'
import Card, { CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import { 
  Bell,
  Send,
  Users,
  Clock,
  CheckCircle,
  Settings,
  BarChart3
} from 'lucide-react'

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'history' | 'compose' | 'settings'>('history')
  const [showSuccess, setShowSuccess] = useState(false)

  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'all',
    target: '',
    schedule: false,
    scheduledFor: ''
  })

  const mockNotifications = [
    { id: '1', title: 'محاضرة جديدة', message: 'تم إضافة محاضرة جديدة', sentAt: '2024-01-15', reads: 245, delivered: 300, status: 'sent' },
    { id: '2', title: 'تذكير بالاختبار', message: 'اختبار غداً', sentAt: '2024-01-14', reads: 180, delivered: 200, status: 'sent' },
  ]

  const totalDelivered = mockNotifications.reduce((sum, n) => sum + n.delivered, 0)
  const totalReads = mockNotifications.reduce((sum, n) => sum + n.reads, 0)
  const readRate = Math.round((totalReads / totalDelivered) * 100)

  const handleSend = () => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
    setNewNotification({ title: '', message: '', type: 'all', target: '', schedule: false, scheduledFor: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <Bell className="w-7 h-7 text-primary" />
            نظام الإشعارات
          </h1>
          <p className="text-slate-400">إرسال وإدارة الإشعارات للطلاب</p>
        </div>
        
        {showSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <CheckCircle className="w-5 h-5" />
            <span>تم الإرسال بنجاح!</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 border-b border-slate-700 pb-2">
        {[
          { id: 'history', label: 'السجل', icon: Clock },
          { id: 'compose', label: 'إنشاء', icon: Send },
          { id: 'settings', label: 'الإعدادات', icon: Settings },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
              activeTab === tab.id ? 'bg-slate-800 text-white border-b-2 border-primary' : 'text-slate-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Bell className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockNotifications.length}</p>
              <p className="text-xs text-slate-400">إجمالي الإشعارات</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalDelivered}</p>
              <p className="text-xs text-slate-400">تم الإرسال</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalReads}</p>
              <p className="text-xs text-slate-400">قُرأت</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{readRate}%</p>
              <p className="text-xs text-slate-400">نسبة القراءة</p>
            </div>
          </div>
        </Card>
      </div>

      {activeTab === 'history' && (
        <div className="space-y-4">
          {mockNotifications.map(notification => (
            <Card key={notification.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{notification.title}</h3>
                      <Badge variant="primary">تم الإرسال</Badge>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">{notification.message}</p>
                    <span className="text-xs text-slate-500">{notification.sentAt}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-bold text-emerald-400">{notification.reads}</p>
                      <p className="text-xs text-slate-500">قراءة</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-blue-400">{notification.delivered}</p>
                      <p className="text-xs text-slate-500">إجمالي</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'compose' && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">عنوان الإشعار</label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  placeholder="مثال: محاضرة جديدة متاحة!"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">نص الإشعار</label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                  rows={4}
                  placeholder="اكتب تفاصيل الإشعار..."
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">نوع الإرسال</label>
                  <select
                    value={newNotification.type}
                    onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">جميع الطلاب</option>
                    <option value="grade">صف معين</option>
                    <option value="course">كورس معين</option>
                    <option value="individual">طالب معين</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">الهدف</label>
                  <select
                    value={newNotification.target}
                    onChange={(e) => setNewNotification({ ...newNotification, target: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">اختر...</option>
                    <option value="all">جميع الطلاب</option>
                    <option value="first">الصف الأول الثانوي</option>
                    <option value="second">الصف الثاني الثانوي</option>
                    <option value="third">الصف الثالث الثانوي</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newNotification.schedule}
                    onChange={(e) => setNewNotification({ ...newNotification, schedule: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-600"
                  />
                  <span className="text-sm">جدولة الإرسال</span>
                </label>

                {newNotification.schedule && (
                  <input
                    type="datetime-local"
                    value={newNotification.scheduledFor}
                    onChange={(e) => setNewNotification({ ...newNotification, scheduledFor: e.target.value })}
                    className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSend} className="flex-1 gap-2">
                  <Send className="w-4 h-4" />
                  {newNotification.schedule ? 'جدولة' : 'إرسال الآن'}
                </Button>
                <Button variant="outline">حفظ كمسودة</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'settings' && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">إعدادات الإشعارات</h3>
            <div className="space-y-4">
              {[
                { icon: Bell, label: 'إشعارات المحاضرات الجديدة', enabled: true },
                { icon: Users, label: 'إشعارات الاختبارات', enabled: true },
                { icon: Settings, label: 'إشعارات عامة', enabled: true },
              ].map((setting, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <setting.icon className="w-5 h-5 text-slate-400" />
                    <span>{setting.label}</span>
                  </div>
                  <button
                    className={`w-12 h-6 rounded-full transition-colors ${setting.enabled ? 'bg-primary' : 'bg-slate-600'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${setting.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
