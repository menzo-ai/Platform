'use client'

import { useEffect, useState } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Badge from '@/components/ui/badge'
import Avatar from '@/components/ui/avatar'
import { 
  Users, 
  GraduationCap, 
  CreditCard, 
  Ticket, 
  TrendingUp, 
  TrendingDown,
  BookOpen,
  Clock,
  Activity,
  ArrowUp
} from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import Link from 'next/link'

interface Analytics {
  totalStudents: number
  activeSubscriptions: number
  totalCourses: number
  totalLectures: number
  pendingTickets: number
  monthlyRevenue: number
  recentEnrollments: {
    id: string
    user: { name: string; email: string }
    course: { title: string }
    createdAt: string
  }[]
  recentActivity: {
    id: string
    action: string
    user: { name: string; role: string }
    createdAt: string
  }[]
  courseStats: {
    id: string
    title: string
    grade: number
    _count: { enrollments: number }
  }[]
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/admin/analytics')
        if (response.ok) {
          const data = await response.json()
          setAnalytics(data)
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const stats = [
    {
      label: 'إجمالي الطلاب',
      value: analytics?.totalStudents || 0,
      change: '+12%',
      isPositive: true,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'الاشتراكات النشطة',
      value: analytics?.activeSubscriptions || 0,
      change: '+8%',
      isPositive: true,
      icon: CreditCard,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      label: 'إجمالي الدورات',
      value: analytics?.totalCourses || 0,
      icon: BookOpen,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'التذاكر المعلقة',
      value: analytics?.pendingTickets || 0,
      change: '-5%',
      isPositive: false,
      icon: Ticket,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">لوحة التحكم</h1>
          <p className="text-slate-400">مرحباً بك في لوحة تحكم GELVANO</p>
        </div>
        <Badge variant="primary" className="text-sm">سوبر أدمن</Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              {stat.change && (
                <div className={`flex items-center gap-1 text-xs ${stat.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stat.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </div>
              )}
            </div>
            <p className="text-2xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm text-slate-400">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Revenue Card */}
      <Card className="bg-gradient-to-r from-primary/20 to-primary/5 border-primary/20">
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 mb-1">الإيرادات الشهرية</p>
            <p className="text-3xl font-bold">{analytics?.monthlyRevenue || 0} ج.م</p>
          </div>
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
            <CreditCard className="w-7 h-7 text-primary" />
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Enrollments */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              آخر التسجيلات
            </h2>
            <Link href="/admin/students" className="text-primary text-sm hover:text-primary-light transition-colors">
              عرض الكل
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 bg-slate-700 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 bg-slate-700 rounded w-24" />
                      <div className="h-3 bg-slate-700 rounded w-32" />
                    </div>
                  </div>
                ))}
              </div>
            ) : analytics?.recentEnrollments && analytics.recentEnrollments.length > 0 ? (
              <div className="space-y-3">
                {analytics.recentEnrollments.slice(0, 5).map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors">
                    <Avatar name={enrollment.user.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{enrollment.user.name}</p>
                      <p className="text-xs text-slate-400 truncate">
                        سجل في: {enrollment.course.title}
                      </p>
                    </div>
                    <span className="text-xs text-slate-500">
                      {formatDateTime(enrollment.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-400 py-8">لا توجد تسجيلات جديدة</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-secondary" />
              النشاط الأخير
            </h2>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 bg-slate-700 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 bg-slate-700 rounded w-24" />
                      <div className="h-3 bg-slate-700 rounded w-32" />
                    </div>
                  </div>
                ))}
              </div>
            ) : analytics?.recentActivity && analytics.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {analytics.recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.user.name}</p>
                      <p className="text-xs text-slate-400">
                        {activity.action === 'LOGIN' && 'تسجيل دخول'}
                        {activity.action === 'REGISTER' && 'تسجيل حساب جديد'}
                        {activity.action === 'ENROLL' && 'تسجيل في دورة'}
                        {activity.action === 'VERIFY_EMAIL' && 'تأكيد البريد'}
                        {!['LOGIN', 'REGISTER', 'ENROLL', 'VERIFY_EMAIL'].includes(activity.action) && activity.action}
                      </p>
                    </div>
                    <span className="text-xs text-slate-500">
                      {formatDateTime(activity.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-400 py-8">لا يوجد نشاط حديث</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Courses */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            أكثر الدورات تسجيلاً
          </h2>
          <Link href="/admin/courses" className="text-primary text-sm hover:text-primary-light transition-colors">
            إدارة الدورات
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-8 h-8 bg-slate-700 rounded" />
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-slate-700 rounded w-48" />
                  </div>
                  <div className="h-6 w-16 bg-slate-700 rounded" />
                </div>
              ))}
            </div>
          ) : analytics?.courseStats && analytics.courseStats.length > 0 ? (
            <div className="space-y-3">
              {analytics.courseStats.map((course, index) => (
                <div key={course.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{course.title}</p>
                    <p className="text-xs text-slate-400">الصف {course.grade}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium">{course._count.enrollments}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-400 py-8">لا توجد دورات بعد</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
