'use client'

import { useState } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Modal from '@/components/ui/modal'
import Progress from '@/components/ui/progress'
import { 
  Calendar,
  Clock,
  BookOpen,
  Target,
  CheckCircle,
  Play,
  RotateCcw,
  Zap,
  Brain,
  TrendingUp,
  Award,
  Flame,
  Star,
  ChevronRight,
  Settings,
  Sparkles
} from 'lucide-react'

interface StudyDay {
  id: string
  day: string
  date: string
  tasks: StudyTask[]
}

interface StudyTask {
  id: string
  title: string
  type: 'lecture' | 'homework' | 'exam' | 'revision'
  courseName: string
  duration: number
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'high' | 'medium' | 'low'
}

const mockStudyPlan: StudyDay[] = [
  {
    id: '1',
    day: 'السبت',
    date: '2024-01-20',
    tasks: [
      { id: '1', title: 'محاضرة قوانين نيوتن - الجزء 2', type: 'lecture', courseName: 'الفيزياء', duration: 45, status: 'completed', priority: 'high' },
      { id: '2', title: 'واجب قوانين نيوتن', type: 'homework', courseName: 'الفيزياء', duration: 30, status: 'completed', priority: 'high' },
      { id: '3', title: 'مراجعة قوانين نيوتن', type: 'revision', courseName: 'الفيزياء', duration: 20, status: 'in-progress', priority: 'medium' },
    ]
  },
  {
    id: '2',
    day: 'الأحد',
    date: '2024-01-21',
    tasks: [
      { id: '4', title: 'محاضرة التسارع', type: 'lecture', courseName: 'الفيزياء', duration: 45, status: 'pending', priority: 'high' },
      { id: '5', title: 'اختبار القصور الذاتي', type: 'exam', courseName: 'الفيزياء', duration: 30, status: 'pending', priority: 'high' },
    ]
  },
  {
    id: '3',
    day: 'الاثنين',
    date: '2024-01-22',
    tasks: [
      { id: '6', title: 'محاضرة الطاقة الحركية', type: 'lecture', courseName: 'الفيزياء', duration: 45, status: 'pending', priority: 'medium' },
      { id: '7', title: 'حل مسائل إضافية', type: 'homework', courseName: 'الفيزياء', duration: 60, status: 'pending', priority: 'medium' },
    ]
  },
  {
    id: '4',
    day: 'الثلاثاء',
    date: '2024-01-23',
    tasks: [
      { id: '8', title: 'مراجعة شاملة للأسبوع', type: 'revision', courseName: 'الفيزياء', duration: 90, status: 'pending', priority: 'low' },
    ]
  },
]

const stats = {
  completedTasks: 8,
  totalTasks: 12,
  streak: 5,
  totalHours: 6.5,
  averageScore: 85,
  nextMilestone: 15
}

export default function StudyPlanPage() {
  const [studyPlan] = useState<StudyDay[]>(mockStudyPlan)
  const [selectedTask, setSelectedTask] = useState<StudyTask | null>(null)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  const getTypeIcon = (type: StudyTask['type']) => {
    const icons: Record<string, any> = {
      lecture: Play,
      homework: BookOpen,
      exam: Target,
      revision: RotateCcw
    }
    return icons[type] || Play
  }

  const getTypeColor = (type: StudyTask['type']) => {
    const colors: Record<string, string> = {
      lecture: 'bg-blue-500/10 text-blue-400',
      homework: 'bg-emerald-500/10 text-emerald-400',
      exam: 'bg-amber-500/10 text-amber-400',
      revision: 'bg-purple-500/10 text-purple-400'
    }
    return colors[type] || ''
  }

  const getPriorityColor = (priority: StudyTask['priority']) => {
    const colors: Record<string, string> = {
      high: 'bg-red-500',
      medium: 'bg-amber-500',
      low: 'bg-slate-500'
    }
    return colors[priority]
  }

  const getTypeLabel = (type: StudyTask['type']) => {
    const labels: Record<string, string> = {
      lecture: 'محاضرة',
      homework: 'واجب',
      exam: 'اختبار',
      revision: 'مراجعة'
    }
    return labels[type] || ''
  }

  const completionRate = Math.round((stats.completedTasks / stats.totalTasks) * 100)

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <Calendar className="w-7 h-7 text-primary" />
            خطة الدراسة
          </h1>
          <p className="text-slate-400">خطط لدراستك بطريقة منظمة</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completionRate}%</p>
                <p className="text-xs text-slate-400">معدل الإتمام</p>
              </div>
            </div>
            <Progress value={completionRate} className="mt-3" />
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.streak}</p>
                <p className="text-xs text-slate-400">أيام متتالية 🔥</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalHours}h</p>
                <p className="text-xs text-slate-400">ساعات الدراسة</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.nextMilestone}</p>
                <p className="text-xs text-slate-400">المستوى التالي</p>
              </div>
            </div>
          </Card>
        </div>

        {/* AI Study Plan Generator */}
        <Card className="mb-8 bg-gradient-to-r from-primary/20 to-purple-500/20 border-primary/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    خطة ذكية من menzo-ai
                  </h3>
                  <p className="text-sm text-slate-400">احصل على خطة دراسة مخصصة بناءً على أدائك</p>
                </div>
              </div>
              <Button>
                <Zap className="w-4 h-4" />
                إنشاء خطة ذكية
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Study Plan Timeline */}
        <div className="space-y-6">
          {studyPlan.map((day, dayIndex) => (
            <div key={day.id} className="relative">
              {/* Timeline connector */}
              {dayIndex < studyPlan.length - 1 && (
                <div className="absolute right-6 top-20 w-0.5 h-full bg-slate-700" />
              )}

              {/* Day header */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  day.tasks.every(t => t.status === 'completed') 
                    ? 'bg-emerald-500' 
                    : day.tasks.some(t => t.status === 'in-progress')
                      ? 'bg-primary'
                      : 'bg-slate-700'
                }`}>
                  {day.tasks.every(t => t.status === 'completed') ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <span className="text-white font-bold">{dayIndex + 1}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{day.day}</h3>
                  <p className="text-sm text-slate-400">
                    {new Date(day.date).toLocaleDateString('ar-EG', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="mr-auto flex items-center gap-2">
                  <Badge>
                    {day.tasks.filter(t => t.status === 'completed').length}/{day.tasks.length}
                  </Badge>
                </div>
              </div>

              {/* Tasks */}
              <div className="mr-6 space-y-3">
                {day.tasks.map((task) => {
                  const TypeIcon = getTypeIcon(task.type)
                  return (
                    <Card 
                      key={task.id}
                      className={`cursor-pointer transition-all hover:scale-[1.01] ${
                        task.status === 'completed' ? 'opacity-60' : ''
                      }`}
                      onClick={() => setSelectedTask(task)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(task.type)}`}>
                            <TypeIcon className="w-5 h-5" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                              <span className="text-xs text-slate-400">{task.courseName}</span>
                              <Badge variant="info" className="text-xs">{getTypeLabel(task.type)}</Badge>
                            </div>
                            <p className={`font-medium ${task.status === 'completed' ? 'line-through' : ''}`}>
                              {task.title}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-sm text-slate-400">
                              <Clock className="w-4 h-4" />
                              {task.duration} د
                            </div>

                            {task.status === 'pending' && (
                              <Button size="sm" variant="outline">
                                <Play className="w-4 h-4" />
                                بدء
                              </Button>
                            )}
                            {task.status === 'in-progress' && (
                              <Button size="sm" variant="primary">
                                <Play className="w-4 h-4" />
                                متابعة
                              </Button>
                            )}
                            {task.status === 'completed' && (
                              <CheckCircle className="w-6 h-6 text-emerald-400" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats Footer */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
                <p className="text-2xl font-bold">+15%</p>
                <p className="text-xs text-slate-400">تحسن هذا الأسبوع</p>
              </div>
              <div>
                <Target className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-slate-400">اختبارات قادمة</p>
              </div>
              <div>
                <BookOpen className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                <p className="text-2xl font-bold">5</p>
                <p className="text-xs text-slate-400">محاضرات متبقية</p>
              </div>
              <div>
                <Star className="w-6 h-6 mx-auto mb-2 text-amber-400" />
                <p className="text-2xl font-bold">{stats.averageScore}%</p>
                <p className="text-xs text-slate-400">متوسط درجاتك</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Detail Modal */}
      <Modal 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTask(null)} 
        title={selectedTask?.title || ''}
        size="md"
      >
        {selectedTask && (
          <div className="space-y-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getTypeColor(selectedTask.type)}`}>
              {(() => { const Icon = getTypeIcon(selectedTask.type); return <Icon className="w-4 h-4" /> })()}
              {getTypeLabel(selectedTask.type)}
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400">المادة</p>
                  <p className="font-medium">{selectedTask.courseName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">المدة</p>
                  <p className="font-medium">{selectedTask.duration} دقيقة</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">الأولوية</p>
                  <Badge variant={selectedTask.priority === 'high' ? 'danger' : selectedTask.priority === 'medium' ? 'warning' : 'info'}>
                    {selectedTask.priority === 'high' ? 'عالية' : selectedTask.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-400">الحالة</p>
                  <Badge>
                    {selectedTask.status === 'completed' ? 'مكتمل' : selectedTask.status === 'in-progress' ? 'قيد التقدم' : 'في الانتظار'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedTask(null)}>
                إغلاق
              </Button>
              {selectedTask.status !== 'completed' && (
                <Button className="flex-1">
                  <CheckCircle className="w-4 h-4" />
                  إنهاء المهمة
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}