'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Badge from '@/components/ui/badge'
import Progress from '@/components/ui/progress'
import Avatar from '@/components/ui/avatar'
import { BookOpen, Clock, Trophy, TrendingUp, Play, ChevronLeft, Calendar, Bell } from 'lucide-react'

interface Enrollment {
  id: string
  course: {
    title: string
    grade: number
    thumbnail: string
  }
  progress: number
  completedLectures: number
  totalLectures: number
}

interface Notification {
  id: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

export default function StudentDashboard() {
  const { data: session } = useSession()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrollRes, notifRes] = await Promise.all([
          fetch('/api/enrollments'),
          fetch('/api/notifications'),
        ])

        if (enrollRes.ok) {
          const data = await enrollRes.json()
          setEnrollments(data.slice(0, 3))
        }

        if (notifRes.ok) {
          const data = await notifRes.json()
          setNotifications(data.notifications.slice(0, 5))
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const stats = [
    {
      label: 'الدورات المسجلة',
      value: enrollments.length,
      icon: BookOpen,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'ساعات التعلم',
      value: '12',
      icon: Clock,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      label: 'المعدل',
      value: '85%',
      icon: TrendingUp,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'التصنيف',
      value: '#5',
      icon: Trophy,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            مرحباً، {session?.user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-400">استمر في رحلتك التعليمية</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success">الصف الأول الثانوي</Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">استمر في التعلم</h2>
              <Link href="/courses" className="text-primary text-sm hover:text-primary-light transition-colors flex items-center gap-1">
                عرض الكل
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                      <div className="w-32 h-20 bg-slate-700 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-700 rounded w-3/4" />
                        <div className="h-3 bg-slate-700 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : enrollments.length > 0 ? (
                enrollments.map((enrollment) => (
                  <Link
                    key={enrollment.id}
                    href={`/courses/${enrollment.course.title}`}
                    className="flex gap-4 p-3 rounded-lg hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="w-32 h-20 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Play className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{enrollment.course.title}</h3>
                      <p className="text-sm text-slate-400 mb-2">
                        {enrollment.completedLectures} / {enrollment.totalLectures} محاضرة
                      </p>
                      <Progress value={enrollment.progress} size="sm" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 mb-4">لم تسجل في أي دورة بعد</p>
                  <Link href="/courses" className="text-primary hover:text-primary-light transition-colors">
                    استكشف الدورات المتاحة
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <div>
          <Card className="h-full">
            <CardHeader className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5" />
                الإشعارات
              </h2>
              <Link href="/notifications" className="text-primary text-sm hover:text-primary-light transition-colors">
                عرض الكل
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-10 h-10 bg-slate-700 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-slate-700 rounded w-3/4" />
                        <div className="h-3 bg-slate-700 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex gap-3 p-3 rounded-lg ${
                      notif.isRead ? 'opacity-60' : 'bg-slate-800/30'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      notif.isRead ? 'bg-slate-700' : 'bg-primary/10'
                    }`}>
                      <Bell className={`w-5 h-5 ${notif.isRead ? 'text-slate-500' : 'text-primary'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{notif.title}</p>
                      <p className="text-xs text-slate-400 truncate">{notif.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">لا توجد إشعارات</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">إجراءات سريعة</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/courses"
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
            >
              <BookOpen className="w-8 h-8 text-primary" />
              <span className="text-sm">الدورات</span>
            </Link>
            <Link
              href="/exams"
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
            >
              <Clock className="w-8 h-8 text-secondary" />
              <span className="text-sm">الاختبارات</span>
            </Link>
            <Link
              href="/messages"
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
            >
              <Calendar className="w-8 h-8 text-accent" />
              <span className="text-sm">الرسائل</span>
            </Link>
            <Link
              href="/leaderboard"
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
            >
              <Trophy className="w-8 h-8 text-amber-400" />
              <span className="text-sm">التصنيف</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
