'use client'

import { useState } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import { 
  Activity,
  User,
  LogIn,
  LogOut,
  FileText,
  BookOpen,
  MessageSquare,
  CreditCard,
  Settings,
  Download,
  Filter,
  Search,
  Calendar,
  Clock,
  Eye
} from 'lucide-react'

interface LogEntry {
  id: string
  userId: string
  userName: string
  userEmail: string
  action: string
  details: string
  ip: string
  timestamp: string
}

const mockLogs: LogEntry[] = [
  { id: '1', userId: 'u1', userName: 'أحمد محمد', userEmail: 'ahmed@test.com', action: 'LOGIN', details: 'تسجيل دخول ناجح', ip: '192.168.1.1', timestamp: '2024-01-15 10:30:00' },
  { id: '2', userId: 'u2', userName: 'فاطمة علي', userEmail: 'fatma@test.com', action: 'ENROLL', details: 'تم الاشتراك في كورس الفيزياء', ip: '192.168.1.2', timestamp: '2024-01-15 10:25:00' },
  { id: '3', userId: 'u1', userName: 'أحمد محمد', userEmail: 'ahmed@test.com', action: 'EXAM', details: 'أتم اختبار قوانين نيوتن', ip: '192.168.1.1', timestamp: '2024-01-15 10:20:00' },
  { id: '4', userId: 'u3', userName: 'م. خالد', userEmail: 'admin@test.com', action: 'CREATE_COURSE', details: 'تم إنشاء كورس جديد', ip: '192.168.1.3', timestamp: '2024-01-15 09:00:00' },
  { id: '5', userId: 'u2', userName: 'فاطمة علي', userEmail: 'fatma@test.com', action: 'PAYMENT', details: 'تم دفع 500 ج.م', ip: '192.168.1.2', timestamp: '2024-01-15 08:45:00' },
]

const actionIcons: Record<string, any> = {
  LOGIN: LogIn,
  LOGOUT: LogOut,
  REGISTER: User,
  ENROLL: BookOpen,
  EXAM: FileText,
  PAYMENT: CreditCard,
  MESSAGE: MessageSquare,
  SETTINGS: Settings,
  CREATE_COURSE: BookOpen,
  UPDATE_PROFILE: User
}

const actionLabels: Record<string, string> = {
  LOGIN: 'تسجيل دخول',
  LOGOUT: 'تسجيل خروج',
  REGISTER: 'تسجيل جديد',
  ENROLL: 'اشتراك',
  EXAM: 'اختبار',
  PAYMENT: 'دفع',
  MESSAGE: 'رسالة',
  SETTINGS: 'إعدادات',
  CREATE_COURSE: 'إنشاء كورس',
  UPDATE_PROFILE: 'تعديل الملف'
}

const actionColors: Record<string, string> = {
  LOGIN: 'success',
  LOGOUT: 'info',
  REGISTER: 'primary',
  ENROLL: 'info',
  EXAM: 'warning',
  PAYMENT: 'success',
  MESSAGE: 'primary',
  SETTINGS: 'info',
  CREATE_COURSE: 'info',
  UPDATE_PROFILE: 'info'
}

export default function ActivityLogPage() {
  const [logs] = useState<LogEntry[]>(mockLogs)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredLogs = logs.filter(log => {
    if (filter !== 'all' && log.action !== filter) return false
    if (searchQuery && !log.userName.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const exportLogs = () => {
    const csv = [
      ['ID', 'User', 'Email', 'Action', 'Details', 'IP', 'Time'],
      ...filteredLogs.map(log => [log.id, log.userName, log.userEmail, log.action, log.details, log.ip, log.timestamp])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `activity_log_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <Activity className="w-7 h-7 text-primary" />
            سجل النشاط
          </h1>
          <p className="text-slate-400">تتبع جميع أنشطة المستخدمين</p>
        </div>
        <Button variant="outline" onClick={exportLogs}>
          <Download className="w-4 h-4" />
          تصدير CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <LogIn className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">245</p>
              <p className="text-xs text-slate-400">تسجيلات دخول</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">89</p>
              <p className="text-xs text-slate-400">اشتراكات</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">156</p>
              <p className="text-xs text-slate-400">اختبارات</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">45</p>
              <p className="text-xs text-slate-400">مدفوعات</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="ابحث باسم المستخدم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pr-10 w-full"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'LOGIN', 'ENROLL', 'EXAM', 'PAYMENT'].map(f => (
                <Button
                  key={f}
                  variant={filter === f ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? 'الكل' : actionLabels[f] || f}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* logs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">المستخدم</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">النشاط</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">التفاصيل</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">IP</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">التاريخ</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredLogs.map(log => {
                  const Icon = actionIcons[log.action] || Activity
                  return (
                    <tr key={log.id} className="hover:bg-slate-800/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                            {log.userName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{log.userName}</p>
                            <p className="text-xs text-slate-400">{log.userEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={actionColors[log.action] as any}>
                          <Icon className="w-3 h-3 ml-1" />
                          {actionLabels[log.action] || log.action}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-slate-400">
                        {log.details}
                      </td>
                      <td className="p-4 text-sm font-mono text-slate-500">
                        {log.ip}
                      </td>
                      <td className="p-4 text-sm">
                        <div className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3 h-3" />
                          {log.timestamp.split(' ')[0]}
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3 h-3" />
                          {log.timestamp.split(' ')[1]}
                        </div>
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}