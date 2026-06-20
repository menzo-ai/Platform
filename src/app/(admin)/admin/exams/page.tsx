'use client'

import { useState } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Modal from '@/components/ui/modal'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import Textarea from '@/components/ui/textarea'
import { 
  FileText,
  Plus,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Edit,
  Trash2,
  Eye,
  Copy,
  Download,
  BarChart3,
  TrendingUp,
  Award,
  Play,
  Pause,
  Settings,
  BookOpen
} from 'lucide-react'

interface Exam {
  id: string
  title: string
  courseName: string
  type: 'chapter' | 'midterm' | 'final' | 'quiz'
  duration: number
  questionsCount: number
  totalGrade: number
  attempts: number
  averageScore: number
  passRate: number
  status: 'active' | 'scheduled' | 'closed' | 'draft'
  scheduledFor?: string
}

interface Question {
  id: string
  text: string
  type: 'mcq' | 'true-false' | 'essay'
  options?: string[]
  correctAnswer?: string
  grade: number
}

const mockExams: Exam[] = [
  { id: '1', title: 'اختبار قوانين نيوتن', courseName: 'الفيزياء - الصف الأول', type: 'chapter', duration: 60, questionsCount: 20, totalGrade: 40, attempts: 45, averageScore: 72, passRate: 85, status: 'active' },
  { id: '2', title: 'اختبار منتصف الفصل', courseName: 'الفيزياء - الصف الأول', type: 'midterm', duration: 120, questionsCount: 40, totalGrade: 100, attempts: 38, averageScore: 68, passRate: 78, status: 'closed' },
  { id: '3', title: 'اختبار نهاية العام', courseName: 'الميكانيكا', type: 'final', duration: 180, questionsCount: 50, totalGrade: 100, attempts: 0, averageScore: 0, passRate: 0, status: 'scheduled', scheduledFor: '2024-02-01' },
  { id: '4', title: 'Quiz سريع', courseName: 'الكهرباء', type: 'quiz', duration: 15, questionsCount: 10, totalGrade: 20, attempts: 60, averageScore: 85, passRate: 95, status: 'active' },
]

const stats = {
  totalExams: 28,
  activeExams: 5,
  totalAttempts: 1247,
  averageScore: 74,
  passRate: 82
}

export default function AdminExamsPage() {
  const [exams, setExams] = useState<Exam[]>(mockExams)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showQuestionsModal, setShowQuestionsModal] = useState(false)
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredExams = exams.filter(e => {
    if (filter !== 'all' && e.status !== filter) return false
    if (searchQuery && !e.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const getStatusBadge = (status: Exam['status']) => {
    const config: Record<string, { variant: any; label: string }> = {
      active: { variant: 'success', label: 'نشط' },
      scheduled: { variant: 'warning', label: 'مجدول' },
      closed: { variant: 'secondary', label: 'مغلق' },
      draft: { variant: 'info', label: 'مسودة' }
    }
    return <Badge variant={config[status].variant}>{config[status].label}</Badge>
  }

  const getTypeBadge = (type: Exam['type']) => {
    const config: Record<string, { variant: any; label: string }> = {
      chapter: { variant: 'primary', label: 'فصلي' },
      midterm: { variant: 'warning', label: 'منتصف' },
      final: { variant: 'danger', label: 'نهائي' },
      quiz: { variant: 'info', label: 'Quiz' }
    }
    return <Badge variant={config[type].variant}>{config[type].label}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <FileText className="w-7 h-7 text-primary" />
            إدارة الاختبارات
          </h1>
          <p className="text-slate-400">إنشاء وتعديل وإدارة الاختبارات</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4" />
          إضافة اختبار
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold">{stats.totalExams}</p>
              <p className="text-xs text-slate-400">إجمالي الاختبارات</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Play className="w-8 h-8 text-emerald-400" />
            <div>
              <p className="text-2xl font-bold">{stats.activeExams}</p>
              <p className="text-xs text-slate-400">اختبارات نشطة</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-2xl font-bold">{stats.totalAttempts.toLocaleString()}</p>
              <p className="text-xs text-slate-400">محاولة</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-amber-400" />
            <div>
              <p className="text-2xl font-bold">{stats.averageScore}%</p>
              <p className="text-xs text-slate-400">متوسط الدرجات</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-pink-400" />
            <div>
              <p className="text-2xl font-bold">{stats.passRate}%</p>
              <p className="text-xs text-slate-400">نسبة النجاح</p>
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
                placeholder="ابحث في الاختبارات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pr-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'active', 'scheduled', 'closed', 'draft'].map(f => (
                <Button
                  key={f}
                  variant={filter === f ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? 'الكل' : f === 'active' ? 'نشط' : f === 'scheduled' ? 'مجدول' : f === 'closed' ? 'مغلق' : 'مسودة'}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exams Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">الاختبار</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">النوع</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">المدة</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">الأسئلة</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">التقديم</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">الحالة</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredExams.map(exam => (
                  <tr key={exam.id} className="hover:bg-slate-800/30">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{exam.title}</p>
                        <p className="text-xs text-slate-400">{exam.courseName}</p>
                      </div>
                    </td>
                    <td className="p-4">{getTypeBadge(exam.type)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{exam.duration} دقيقة</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span>{exam.questionsCount} سؤال</span>
                        <span className="text-slate-500">•</span>
                        <span>{exam.totalGrade} درجة</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="text-sm">{exam.attempts} محاولة</p>
                        {exam.averageScore > 0 && (
                          <p className="text-xs text-slate-400">
                            متوسط: {exam.averageScore}% | نجاح: {exam.passRate}%
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">{getStatusBadge(exam.status)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedExam(exam); setShowQuestionsModal(true); }}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 cursor-pointer hover:bg-slate-800/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Plus className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="font-medium">اختبار سريع</p>
              <p className="text-xs text-slate-400">إنشاء Quiz في 5 دقائق</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 cursor-pointer hover:bg-slate-800/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Download className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="font-medium">تصدير النتائج</p>
              <p className="text-xs text-slate-400">CSV, Excel</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 cursor-pointer hover:bg-slate-800/50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="font-medium">تقارير شاملة</p>
              <p className="text-xs text-slate-400">إحصائيات متقدمة</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Create Exam Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="إضافة اختبار جديد" size="lg">
        <div className="space-y-4">
          <Input label="عنوان الاختبار" placeholder="مثال: اختبار قوانين نيوتن" />
          <Select 
            label="الكورس" 
            options={[
              { value: '1', label: 'الفيزياء - الصف الأول' },
              { value: '2', label: 'الميكانيكا' },
              { value: '3', label: 'الكهرباء' }
            ]} 
          />
          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="نوع الاختبار"
              options={[
                { value: 'chapter', label: 'اختبار فصلي' },
                { value: 'midterm', label: 'منتصف الفصل' },
                { value: 'final', label: 'اختبار نهائي' },
                { value: 'quiz', label: 'Quiz سريع' }
              ]} 
            />
            <Input label="المدة (دقائق)" type="number" placeholder="60" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="عدد الأسئلة" type="number" placeholder="20" />
            <Input label="الدرجة الكلية" type="number" placeholder="40" />
          </div>
          <Select 
            label="حالة الاختبار"
            options={[
              { value: 'draft', label: 'مسودة' },
              { value: 'scheduled', label: 'مجدول' },
              { value: 'active', label: 'نشط' }
            ]} 
          />
          <Textarea label="تعليمات الاختبار" placeholder="اكتب تعليمات الاختبار للطلاب..." rows={3} />
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>
              إلغاء
            </Button>
            <Button className="flex-1">
              <Plus className="w-4 h-4" />
              إضافة الأسئلة
            </Button>
          </div>
        </div>
      </Modal>

      {/* Questions Modal */}
      <Modal isOpen={showQuestionsModal} onClose={() => setShowQuestionsModal(false)} title={selectedExam?.title || ''} size="lg">
        {selectedExam && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 p-4 bg-slate-800/50 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold">{selectedExam.questionsCount}</p>
                <p className="text-xs text-slate-400">سؤال</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{selectedExam.duration}</p>
                <p className="text-xs text-slate-400">دقيقة</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{selectedExam.totalGrade}</p>
                <p className="text-xs text-slate-400">درجة</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{selectedExam.attempts}</p>
                <p className="text-xs text-slate-400">محاولة</p>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium">سؤال {i + 1} - اختر الإجابة الصحيحة</p>
                      <p className="text-sm text-slate-400 mt-1">هذا نص السؤال التجريبي للاختبار</p>
                    </div>
                    <Badge variant="info">5 درجات</Badge>
                  </div>
                  <div className="space-y-2 mr-11">
                    <label className="flex items-center gap-2 p-2 rounded bg-emerald-500/10 border border-emerald-500/30">
                      <input type="radio" name={`q${i}`} defaultChecked />
                      <span>الإجابة الصحيحة</span>
                      <CheckCircle className="w-4 h-4 text-emerald-400 mr-auto" />
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded hover:bg-slate-700/50">
                      <input type="radio" name={`q${i}`} />
                      <span>إجابة خاطئة 1</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded hover:bg-slate-700/50">
                      <input type="radio" name={`q${i}`} />
                      <span>إجابة خاطئة 2</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-700">
              <Button variant="outline" className="flex-1" onClick={() => setShowQuestionsModal(false)}>
                إغلاق
              </Button>
              <Button variant="outline" className="flex-1">
                <Edit className="w-4 h-4" />
                تعديل الأسئلة
              </Button>
              <Button className="flex-1">
                <Play className="w-4 h-4" />
                {selectedExam.status === 'active' ? 'إيقاف' : 'تفعيل'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}