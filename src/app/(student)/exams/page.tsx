'use client'

import { useState } from 'react'
import Card, { CardContent } from '@/components/ui/card'
import Badge from '@/components/ui/badge'
import Button from '@/components/ui/button'
import Progress from '@/components/ui/progress'
import EmptyState from '@/components/ui/empty-state'
import { FileText, Clock, CheckCircle, AlertCircle, Play, Trophy } from 'lucide-react'

interface Exam {
  id: string
  title: string
  course: string
  type: 'quiz' | 'chapter_exam' | 'final_exam'
  questions: number
  duration: number
  passingScore: number
  status: 'available' | 'completed' | 'locked'
  score?: number
}

export default function ExamsPage() {
  const [selectedGrade, setSelectedGrade] = useState('all')

  const exams: Exam[] = [
    {
      id: '1',
      title: 'اختبار الفصل الأول - الحركة',
      course: 'الفيزياء - الصف الأول',
      type: 'chapter_exam',
      questions: 20,
      duration: 30,
      passingScore: 60,
      status: 'available',
    },
    {
      id: '2',
      title: 'اختبار قصير - القوى',
      course: 'الفيزياء - الصف الأول',
      type: 'quiz',
      questions: 10,
      duration: 15,
      passingScore: 70,
      status: 'completed',
      score: 85,
    },
    {
      id: '3',
      title: 'الاختبار النهائي',
      course: 'الفيزياء - الصف الأول',
      type: 'final_exam',
      questions: 50,
      duration: 90,
      passingScore: 60,
      status: 'locked',
    },
  ]

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'quiz':
        return <Badge variant="info">اختبار قصير</Badge>
      case 'chapter_exam':
        return <Badge variant="primary">اختبار فصل</Badge>
      case 'final_exam':
        return <Badge variant="warning">اختبار نهائي</Badge>
      default:
        return <Badge>اختبار</Badge>
    }
  }

  const getStatusBadge = (status: string, score?: number) => {
    switch (status) {
      case 'available':
        return <Badge variant="success">متاح</Badge>
      case 'completed':
        return <Badge variant="info">مكتمل ({score}%)</Badge>
      case 'locked':
        return <Badge variant="danger">مقفل</Badge>
      default:
        return <Badge>غير معروف</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">الاختبارات</h1>
          <p className="text-slate-400">اختبر معلوماتك وحقق أفضل النتائج</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'available', 'completed'].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedGrade(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedGrade === filter
                ? 'bg-primary text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {filter === 'all' ? 'الكل' : filter === 'available' ? 'متاح' : 'مكتمل'}
          </button>
        ))}
      </div>

      {/* Exams List */}
      {exams.length > 0 ? (
        <div className="space-y-4">
          {exams.map((exam) => (
            <Card key={exam.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{exam.title}</h3>
                      {getTypeBadge(exam.type)}
                    </div>
                    <p className="text-slate-400 mb-4">{exam.course}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {exam.questions} سؤال
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {exam.duration} دقيقة
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        درجة النجاح: {exam.passingScore}%
                      </span>
                    </div>
                  </div>

                  <div className="text-left">
                    {getStatusBadge(exam.status, exam.score)}
                  </div>
                </div>

                {exam.status === 'completed' && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">نتيجتك</span>
                      <span className={`font-bold ${
                        (exam.score || 0) >= exam.passingScore 
                          ? 'text-emerald-400' 
                          : 'text-red-400'
                      }`}>
                        {(exam.score || 0)}%
                      </span>
                    </div>
                    <Progress 
                      value={exam.score || 0} 
                      max={100} 
                      className={exam.score && exam.score >= exam.passingScore ? '[&>div]:!bg-emerald-500' : '[&>div]:!bg-red-500'} 
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  {exam.status === 'available' && (
                    <Button className="gap-2">
                      <Play className="w-4 h-4" />
                      بدء الاختبار
                    </Button>
                  )}
                  {exam.status === 'completed' && (
                    <Button variant="outline" className="gap-2">
                      <CheckCircle className="w-4 h-4" />
                      عرض الإجابات
                    </Button>
                  )}
                  {exam.status === 'locked' && (
                    <Button variant="ghost" disabled className="gap-2">
                      <AlertCircle className="w-4 h-4" />
                      يتطلب إكمال محاضرات
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="لا توجد اختبارات"
          description="لم يتم إضافة اختبارات بعد"
        />
      )}

      {/* Tips */}
      <Card>
        <CardContent>
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-accent" />
            نصائح للاختبارات
          </h3>
          <ul className="space-y-2 text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>اقرأ كل سؤال بعناية قبل الإجابة</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>إدارة الوقت مهم - لا تتوقف على سؤال واحد</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>راجع إجاباتك قبل التسليم إن أمكن</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
