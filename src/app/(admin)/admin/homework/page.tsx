'use client'

import { useState } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Modal from '@/components/ui/modal'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import Textarea from '@/components/ui/textarea'
import Progress from '@/components/ui/progress'
import { 
  FileText,
  Plus,
  Users,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Star,
  MessageSquare,
  BarChart3,
  UsersRound,
  FileCheck,
  TrendingUp
} from 'lucide-react'

interface Assignment {
  id: string
  title: string
  courseName: string
  lectureName: string
  dueDate: string
  totalSubmissions: number
  gradedCount: number
  averageGrade: number
  status: 'active' | 'closed' | 'draft'
}

interface Submission {
  id: string
  studentName: string
  studentEmail: string
  submittedAt: string
  status: 'pending' | 'graded'
  grade?: number
  maxGrade: number
}

const mockAssignments: Assignment[] = [
  { id: '1', title: 'واجب قوانين نيوتن', courseName: 'الفيزياء - الصف الأول', lectureName: 'قوانين نيوتن للحركة', dueDate: '2024-01-20', totalSubmissions: 45, gradedCount: 38, averageGrade: 82, status: 'active' },
  { id: '2', title: 'مسائل التسارع', courseName: 'الفيزياء - الصف الأول', lectureName: 'التسارع', dueDate: '2024-01-18', totalSubmissions: 42, gradedCount: 42, averageGrade: 75, status: 'closed' },
  { id: '3', title: 'تقرير التجارب', courseName: 'الميكانيكا', lectureName: 'تجربة قياس القوة', dueDate: '2024-01-25', totalSubmissions: 0, gradedCount: 0, averageGrade: 0, status: 'draft' },
  { id: '4', title: 'اختبار القصور الذاتي', courseName: 'الكهرباء', lectureName: 'الدوائر الكهربائية', dueDate: '2024-01-15', totalSubmissions: 38, gradedCount: 38, averageGrade: 88, status: 'closed' },
]

const mockSubmissions: Submission[] = [
  { id: '1', studentName: 'أحمد محمد', studentEmail: 'ahmed@ex.com', submittedAt: '2024-01-19T14:30:00', status: 'graded', grade: 18, maxGrade: 20 },
  { id: '2', studentName: 'فاطمة علي', studentEmail: 'fatma@ex.com', submittedAt: '2024-01-19T12:00:00', status: 'graded', grade: 19, maxGrade: 20 },
  { id: '3', studentName: 'محمد خالد', studentEmail: 'mohamed@ex.com', submittedAt: '2024-01-20T09:15:00', status: 'pending', maxGrade: 20 },
  { id: '4', studentName: 'سارة أحمد', studentEmail: 'sara@ex.com', submittedAt: '2024-01-19T16:45:00', status: 'pending', maxGrade: 20 },
  { id: '5', studentName: 'عمر يوسف', studentEmail: 'omar@ex.com', submittedAt: '2024-01-18T11:30:00', status: 'graded', grade: 15, maxGrade: 20 },
]

const stats = {
  totalAssignments: 24,
  activeAssignments: 8,
  totalSubmissions: 456,
  pendingGrading: 45,
  averageGrade: 78,
  submissionRate: 87
}

export default function AdminHomeworkPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [showGradingModal, setShowGradingModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [gradingStudent, setGradingStudent] = useState<Submission | null>(null)
  const [grade, setGrade] = useState('')
  const [feedback, setFeedback] = useState('')

  const filteredAssignments = assignments.filter(a => {
    if (filter !== 'all' && a.status !== filter) return false
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handleGrade = (submission: Submission) => {
    setGradingStudent(submission)
    setGrade(submission.grade?.toString() || '')
    setFeedback('')
    setShowGradingModal(true)
  }

  const submitGrade = () => {
    // In real app, submit to API
    setShowGradingModal(false)
    setGradingStudent(null)
  }

  const getStatusBadge = (status: Assignment['status']) => {
    const config: Record<string, { variant: any; label: string; color: string }> = {
      active: { variant: 'success', label: 'نشط', color: 'text-emerald-400' },
      closed: { variant: 'secondary', label: 'مغلق', color: 'text-slate-400' },
      draft: { variant: 'warning', label: 'مسودة', color: 'text-amber-400' }
    }
    return <Badge variant={config[status].variant}>{config[status].label}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <FileText className="w-7 h-7 text-primary" />
            إدارة الواجبات
          </h1>
          <p className="text-slate-400">إنشاء وتعديل وتصحيح الواجبات</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4" />
          إضافة واجب
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold">{stats.totalAssignments}</p>
              <p className="text-xs text-slate-400">إجمالي الواجبات</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-emerald-400" />
            <div>
              <p className="text-2xl font-bold">{stats.activeAssignments}</p>
              <p className="text-xs text-slate-400">واجبات نشطة</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Upload className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
              <p className="text-xs text-slate-400">إجمالي التسليمات</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-amber-400" />
            <div>
              <p className="text-2xl font-bold">{stats.pendingGrading}</p>
              <p className="text-xs text-slate-400">بانتظار التصحيح</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-pink-400" />
            <div>
              <p className="text-2xl font-bold">{stats.submissionRate}%</p>
              <p className="text-xs text-slate-400">نسبة التسليم</p>
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
                placeholder="ابحث في الواجبات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pr-10"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'active', 'closed', 'draft'].map(f => (
                <Button
                  key={f}
                  variant={filter === f ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? 'الكل' : f === 'active' ? 'نشط' : f === 'closed' ? 'مغلق' : 'مسودة'}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">الواجب</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">الكورس</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">تاريخ التسليم</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">التسليمات</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">المتوسط</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">الحالة</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredAssignments.map(assignment => (
                  <tr key={assignment.id} className="hover:bg-slate-800/30">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-xs text-slate-400">{assignment.lectureName}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{assignment.courseName}</td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(assignment.dueDate).toLocaleDateString('ar-EG')}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{assignment.gradedCount}/{assignment.totalSubmissions}</span>
                        <Progress 
                          value={(assignment.gradedCount / Math.max(assignment.totalSubmissions, 1)) * 100} 
                          className="w-16 h-2"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      {assignment.averageGrade > 0 ? (
                        <Badge variant={assignment.averageGrade >= 70 ? 'success' : 'warning'}>
                          {assignment.averageGrade}%
                        </Badge>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="p-4">{getStatusBadge(assignment.status)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedAssignment(assignment); }}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
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

      {/* Assignment Detail & Submissions */}
      {selectedAssignment && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold">{selectedAssignment.title}</h3>
                <p className="text-sm text-slate-400">{selectedAssignment.courseName} - {selectedAssignment.lectureName}</p>
              </div>
              <Button variant="ghost" onClick={() => setSelectedAssignment(null)}>إغلاق</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                <UsersRound className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                <p className="text-2xl font-bold">{selectedAssignment.totalSubmissions}</p>
                <p className="text-xs text-slate-400">إجمالي التسليمات</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                <FileCheck className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
                <p className="text-2xl font-bold">{selectedAssignment.gradedCount}</p>
                <p className="text-xs text-slate-400">تم تصحيحه</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                <BarChart3 className="w-6 h-6 mx-auto mb-2 text-amber-400" />
                <p className="text-2xl font-bold">{selectedAssignment.averageGrade}%</p>
                <p className="text-xs text-slate-400">المتوسط العام</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-400" />
                <p className="text-2xl font-bold">{selectedAssignment.totalSubmissions - selectedAssignment.gradedCount}</p>
                <p className="text-xs text-slate-400">بانتظار التصحيح</p>
              </div>
            </div>

            <h4 className="font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              التسليمات
            </h4>
            <div className="space-y-3">
              {mockSubmissions.map(submission => (
                <div key={submission.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{submission.studentName}</p>
                      <p className="text-xs text-slate-400">{submission.studentEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-400">
                      {new Date(submission.submittedAt).toLocaleDateString('ar-EG')}
                    </span>
                    {submission.status === 'graded' ? (
                      <Badge variant="success">
                        <Star className="w-3 h-3 ml-1" />
                        {submission.grade}/{submission.maxGrade}
                      </Badge>
                    ) : (
                      <Badge variant="warning">بانتظار</Badge>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleGrade(submission)}>
                      <Edit className="w-4 h-4" />
                      تصحيح
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grading Modal */}
      <Modal isOpen={showGradingModal} onClose={() => setShowGradingModal(false)} title="تصحيح الواجب" size="md">
        {gradingStudent && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <p className="font-medium">{gradingStudent.studentName}</p>
              <p className="text-sm text-slate-400">{gradingStudent.studentEmail}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">الدرجة</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  min={0}
                  max={gradingStudent.maxGrade}
                  className="input w-24 text-center"
                />
                <span className="text-slate-400">/ {gradingStudent.maxGrade}</span>
              </div>
              <Progress 
                value={(parseInt(grade || '0') / gradingStudent.maxGrade) * 100} 
                className="mt-2"
               
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">ملاحظات</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="أضف ملاحظاتك للطالب..."
                rows={4}
                className="input w-full"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowGradingModal(false)}>
                إلغاء
              </Button>
              <Button className="flex-1" onClick={submitGrade}>
                <CheckCircle className="w-4 h-4" />
                حفظ الدرجة
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Assignment Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="إضافة واجب جديد" size="lg">
        <div className="space-y-4">
          <Input label="عنوان الواجب" placeholder="مثال: واجب قوانين نيوتن" />
          <Select 
            label="الكورس" 
            options={[
              { value: '1', label: 'الفيزياء - الصف الأول' },
              { value: '2', label: 'الميكانيكا' },
              { value: '3', label: 'الكهرباء' }
            ]} 
          />
          <Select 
            label="المحاضرة" 
            options={[
              { value: '1', label: 'قوانين نيوتن للحركة' },
              { value: '2', label: 'التسارع' },
              { value: '3', label: 'الطاقة الحركية' }
            ]} 
          />
          <Input label="تاريخ التسليم" type="date" />
          <Input label="الدرجة القصوى" type="number" placeholder="20" />
          <Textarea label="الوصف" placeholder="تفاصيل الواجب..." rows={3} />
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>
              إلغاء
            </Button>
            <Button className="flex-1">
              <Plus className="w-4 h-4" />
              إنشاء الواجب
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}