'use client'

import { useState, useEffect } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Badge from '@/components/ui/badge'
import Progress from '@/components/ui/progress'
import { 
  Users, 
  BookOpen, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Eye,
  Clock,
  Activity,
  ChevronRight,
  BarChart3
} from 'lucide-react'

interface StatCard {
  title: string
  value: string | number
  change: number
  icon: any
  color: string
}

interface ChartData {
  label: string
  value: number
}

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState('week')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const stats: StatCard[] = [
    { title: 'إجمالي الطلاب', value: 1247, change: 12.5, icon: Users, color: 'text-blue-400' },
    { title: 'الدورات النشطة', value: 18, change: 5.2, icon: BookOpen, color: 'text-emerald-400' },
    { title: 'الإيرادات', value: '45,230 ج.م', change: 23.1, icon: CreditCard, color: 'text-amber-400' },
    { title: 'معدل الإتمام', value: '78%', change: -2.3, icon: Activity, color: 'text-purple-400' }
  ]

  const enrollmentsData: ChartData[] = [
    { label: 'السبت', value: 45 },
    { label: 'الأحد', value: 62 },
    { label: 'الاثنين', value: 38 },
    { label: 'الثلاثاء', value: 78 },
    { label: 'الأربعاء', value: 55 },
    { label: 'الخميس', value: 42 },
    { label: 'الجمعة', value: 28 }
  ]

  const topCourses = [
    { name: 'الفيزياء - الصف الأول', students: 342, revenue: 12500, completion: 82 },
    { name: 'الميكانيكا', students: 289, revenue: 10200, completion: 75 },
    { name: 'الكهرباء', students: 234, revenue: 8500, completion: 68 },
    { name: 'الحرارة', students: 198, revenue: 7200, completion: 71 },
    { name: 'البصريات', students: 156, revenue: 5600, completion: 65 }
  ]

  const recentActivity = [
    { user: 'أحمد محمد', action: 'سجل في دورة', target: 'الفيزياء - الصف الأول', time: 'منذ 5 دقائق' },
    { user: 'فاطمة علي', action: 'أنهى اختبار', target: 'اختبار الفصل الثاني', time: 'منذ 12 دقيقة' },
    { user: 'محمد خالد', action: 'اشترك', target: 'اشتراك شهري', time: 'منذ 25 دقيقة' },
    { user: 'سارة أحمد', action: 'تابع محاضرة', target: 'قوانين نيوتن', time: 'منذ ساعة' },
    { user: 'عمر يوسف', action: 'فتح تذكرة', target: 'مشكلة تقنية', time: 'منذ ساعة' }
  ]

  const maxEnrollments = Math.max(...enrollmentsData.map(d => d.value))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-primary" />
            لوحة الإحصائيات
          </h1>
          <p className="text-slate-400">تحليل أداء المنصة والطلاب</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="input py-2 w-auto"
        >
          <option value="today">اليوم</option>
          <option value="week">هذا الأسبوع</option>
          <option value="month">هذا الشهر</option>
          <option value="year">هذا العام</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant={stat.change >= 0 ? 'success' : 'danger'} className="flex items-center gap-1">
                    {stat.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(stat.change)}%
                  </Badge>
                </div>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.title}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Enrollments Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              التسجيلات خلال الأسبوع
            </h3>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-48">
              {enrollmentsData.map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-primary to-primary/50 rounded-t-lg transition-all hover:from-primary-light hover:to-primary/70 cursor-pointer"
                    style={{ height: `${(data.value / maxEnrollments) * 100}%` }}
                  />
                  <span className="text-xs text-slate-400 mt-2">{data.label}</span>
                  <span className="text-sm font-bold">{data.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Courses */}
        <Card>
          <CardHeader>
            <h3 className="font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              الكورسات الأكثر تسجيلاً
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCourses.map((course, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{course.name}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{course.students} طالب</span>
                    <span>•</span>
                    <span>{course.completion}% إتمام</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <h3 className="font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              آخر النشاطات
            </h3>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {activity.user.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>
                    {' '}{activity.action}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{activity.target}</p>
                </div>
                <span className="text-xs text-slate-500">{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <h3 className="font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              التوزيع الجغرافي
            </h3>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { city: 'القاهرة', count: 456, percent: 37 },
              { city: 'الجيزة', count: 234, percent: 19 },
              { city: 'الإسكندرية', count: 189, percent: 15 },
              { city: 'المنصورة', count: 98, percent: 8 },
              { city: 'أخرى', count: 270, percent: 21 }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">{item.city}</span>
                  <span className="text-sm text-slate-400">{item.count} ({item.percent}%)</span>
                </div>
                <Progress value={item.percent} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <Eye className="w-6 h-6 mx-auto mb-2 text-blue-400" />
          <p className="text-2xl font-bold">3,456</p>
          <p className="text-xs text-slate-400">مشاهدة اليوم</p>
        </Card>
        <Card className="p-4 text-center">
          <Clock className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
          <p className="text-2xl font-bold">1.2k</p>
          <p className="text-xs text-slate-400">ساعة مشاهدة</p>
        </Card>
        <Card className="p-4 text-center">
          <Activity className="w-6 h-6 mx-auto mb-2 text-purple-400" />
          <p className="text-2xl font-bold">234</p>
          <p className="text-xs text-slate-400">اختبار اليوم</p>
        </Card>
        <Card className="p-4 text-center">
          <CreditCard className="w-6 h-6 mx-auto mb-2 text-amber-400" />
          <p className="text-2xl font-bold">18</p>
          <p className="text-xs text-slate-400">اشتراك جديد</p>
        </Card>
      </div>
    </div>
  )
}