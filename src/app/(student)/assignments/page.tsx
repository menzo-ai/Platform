'use client'

import { useState } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Modal from '@/components/ui/modal'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import Progress from '@/components/ui/progress'
import { 
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  BookOpen,
  Calendar,
  Users,
  Trophy,
  Star,
  Download,
  Eye,
  Send,
  MessageSquare,
  Filter,
  Search,
  Zap,
  Brain,
  Award,
  TrendingUp,
  Play,
  FileCheck
} from 'lucide-react'

interface Assignment {
  id: string
  title: string
  description: string
  courseName: string
  lectureName: string
  dueDate: string
  status: 'pending' | 'submitted' | 'graded' | 'late'
  grade?: number
  maxGrade: number
  questions?: Question[]
  submittedAt?: string
  feedback?: string
}

interface Question {
  id: string
  type: 'mcq' | 'text' | 'file'
  question: string
  options?: string[]
  answer?: string
  maxScore: number
}

interface Submission {
  id: string
  assignmentId: string
  answers: Record<string, string>
  submittedAt: string
  grade?: number
  feedback?: string
}

const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'واجب قوانين نيوتن',
    description: 'حل المسائل التالية باستخدام قوانين نيوتن للحركة',
    courseName: 'الفيزياء - الصف الأول',
    lectureName: 'قوانين نيوتن للحركة',
    dueDate: '2024-01-20',
    status: 'pending',
    maxGrade: 20,
    questions: [
      { id: '1', type: 'mcq', question: 'قانون نيوتن الثاني يُعبر عنه بـ:', options: ['F = mv', 'F = ma', 'F = m/v', 'F = m+v'], maxScore: 5 },
      { id: '2', type: 'mcq', question: 'وحدة قياس القوة هي:', options: ['كيلوغرام', 'نيوتن', 'متر', 'ثانية'], maxScore: 5 },
      { id: '3', type: 'text', question: 'اشرح قانون نيوتن الثالث بأسلوبك', maxScore: 10 }
    ]
  },
  {
    id: '2',
    title: 'مسائل على التسارع',
    description: 'احسب التسارع في الحالات التالية',
    courseName: 'الفيزياء - الصف الأول',
    lectureName: 'التسارع والحركة',
    dueDate: '2024-01-18',
    status: 'submitted',
    maxGrade: 25,
    submittedAt: '2024-01-17T14:30:00'
  },
  {
    id: '3',
    title: 'اختبار القصور الذاتي',
    description: 'أجب على الأسئلة التالية',
    courseName: 'الفيزياء - الصف الأول',
    lectureName: 'قانون القصور الذاتي',
    dueDate: '2024-01-15',
    status: 'graded',
    grade: 18,
    maxGrade: 20,
    submittedAt: '2024-01-14T10:00:00',
    feedback: 'إجابة ممتازة! فقط في السؤال الثالث كان هناك خطأ بسيط'
  },
  {
    id: '4',
    title: 'واجب الطاقة الحركية',
    description: 'حل مسائل الطاقة الحركية',
    courseName: 'الفيزياء - الصف الأول',
    lectureName: 'الطاقة الحركية',
    dueDate: '2024-01-25',
    status: 'pending',
    maxGrade: 30
  },
  {
    id: '5',
    title: 'تقرير التجارب',
    description: 'اكتب تقرير عن تجربة قياس التسارع',
    courseName: 'الفيزياء - الصف الأول',
    lectureName: 'تجربة قياس التسارع',
    dueDate: '2024-01-10',
    status: 'late',
    maxGrade: 15
  }
]

const stats = {
  pending: 3,
  submitted: 5,
  graded: 12,
  averageGrade: 85,
  totalPoints: 480,
  earnedPoints: 408
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [filter, setFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const filteredAssignments = assignments.filter(a => {
    if (filter !== 'all' && a.status !== filter) return false
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handleOpenAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setAnswers({})
    setSubmitted(assignment.status === 'submitted' || assignment.status === 'graded')
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setAssignments(prev => prev.map(a => 
      a.id === selectedAssignment?.id 
        ? { ...a, status: 'submitted' as const, submittedAt: new Date().toISOString() }
        : a
    ))
    
    setSubmitting(false)
    setSubmitted(true)
    setShowSubmitModal(false)
  }

  const getStatusBadge = (status: Assignment['status']) => {
    const statusConfig = {
      pending: { variant: 'warning' as const, label: 'لم يُسلم', icon: Clock },
      submitted: { variant: 'info' as const, label: 'تم التسليم', icon: Send },
      graded: { variant: 'success' as const, label: 'تم التصحيح', icon: CheckCircle },
      late: { variant: 'danger' as const, label: 'متأخر', icon: AlertCircle }
    }
    const config = statusConfig[status]
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const isDueSoon = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    return diff <= 2 && diff > 0
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <FileText className="w-7 h-7 text-primary" />
            الواجبات
          </h1>
          <p className="text-slate-400">إدارة وتسليم الواجبات</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-slate-400">في الانتظار</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.graded}</p>
                <p className="text-xs text-slate-400">تم تصحيحه</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.averageGrade}%</p>
                <p className="text-xs text-slate-400">متوسط الدرجات</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.earnedPoints}/{stats.totalPoints}</p>
                <p className="text-xs text-slate-400">النقاط</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="ابحث في الواجبات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pr-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'submitted', 'graded'].map(f => (
              <Button
                key={f}
                variant={filter === f ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'الكل' : f === 'pending' ? 'في الانتظار' : f === 'submitted' ? 'تم التسليم' : 'تم التصحيح'}
              </Button>
            ))}
          </div>
        </div>

        {/* Assignments List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssignments.map(assignment => (
            <Card 
              key={assignment.id}
              className={`overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
                assignment.status === 'late' ? 'border-red-500/30' : ''
              }`}
              onClick={() => handleOpenAssignment(assignment)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  {getStatusBadge(assignment.status)}
                  {isDueSoon(assignment.dueDate) && assignment.status === 'pending' && (
                    <Badge variant="danger" className="animate-pulse">
                      <Zap className="w-3 h-3" />
                      قريب!
                    </Badge>
                  )}
                </div>

                <h3 className="font-bold mb-2">{assignment.title}</h3>
                <p className="text-sm text-slate-400 mb-3 line-clamp-2">{assignment.description}</p>

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {assignment.courseName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(assignment.dueDate).toLocaleDateString('ar-EG')}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="text-sm">{assignment.maxGrade} درجة</span>
                  </div>
                  {assignment.grade !== undefined && (
                    <Badge variant={assignment.grade >= assignment.maxGrade * 0.6 ? 'success' : 'danger'}>
                      {assignment.grade}/{assignment.maxGrade}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredAssignments.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>لا توجد واجبات</p>
          </div>
        )}
      </div>

      {/* Assignment Detail Modal */}
      <Modal 
        isOpen={!!selectedAssignment} 
        onClose={() => setSelectedAssignment(null)} 
        title={selectedAssignment?.title || ''}
        size="lg"
      >
        {selectedAssignment && (
          <div className="space-y-6">
            {/* Info */}
            <div className="flex flex-wrap gap-4 p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span className="text-sm">{selectedAssignment.courseName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm">ينتهي: {new Date(selectedAssignment.dueDate).toLocaleDateString('ar-EG')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                <span className="text-sm">{selectedAssignment.maxGrade} درجة</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-bold mb-2">الوصف</h4>
              <p className="text-slate-400">{selectedAssignment.description}</p>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              <h4 className="font-bold flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                الأسئلة ({selectedAssignment.questions?.length || 0})
              </h4>
              
              {selectedAssignment.questions?.map((q, i) => (
                <div key={q.id} className="p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-start gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <p className="font-medium flex-1">{q.question}</p>
                    <Badge variant="info">{q.maxScore} درجات</Badge>
                  </div>

                  {q.type === 'mcq' && q.options && (
                    <div className="space-y-2 mr-8">
                      {q.options.map((opt, j) => (
                        <label key={j} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            value={opt}
                            checked={answers[q.id] === opt}
                            onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                            className="w-4 h-4"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'text' && (
                    <div className="mr-8">
                      <textarea
                        value={answers[q.id] || ''}
                        onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder="اكتب إجابتك هنا..."
                        rows={4}
                        className="input w-full"
                      />
                    </div>
                  )}

                  {q.type === 'file' && (
                    <div className="mr-8">
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4" />
                        ارفع ملف
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Feedback for graded */}
            {selectedAssignment.feedback && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <h4 className="font-bold text-emerald-400 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  ملاحظات المعلم
                </h4>
                <p className="text-sm">{selectedAssignment.feedback}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedAssignment(null)}>
                إغلاق
              </Button>
              {selectedAssignment.status === 'pending' && (
                <Button 
                  className="flex-1" 
                  onClick={() => setShowSubmitModal(true)}
                  disabled={Object.keys(answers).length === 0}
                >
                  <Send className="w-4 h-4" />
                  تسليم الواجب
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Submit Confirmation Modal */}
      <Modal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)} title="تأكيد التسليم" size="md">
        <div className="space-y-4">
          <div className="text-center">
            <FileCheck className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h4 className="font-bold mb-2">هل أنت متأكد من تسليم الواجب؟</h4>
            <p className="text-sm text-slate-400">
              لا يمكنك تعديل إجاباتك بعد التسليم
            </p>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">عدد الأسئلة</span>
              <span>{selectedAssignment?.questions?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">الإجابات المقدمة</span>
              <span>{Object.keys(answers).length}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowSubmitModal(false)}>
              إلغاء
            </Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  جاري التسليم...
                </span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  تأكيد التسليم
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}