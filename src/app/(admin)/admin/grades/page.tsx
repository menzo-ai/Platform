'use client'

import { useState } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Modal from '@/components/ui/modal'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import Progress from '@/components/ui/progress'
import { 
  GraduationCap,
  Users,
  BookOpen,
  FileText,
  Trophy,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Upload,
  Award,
  Star,
  BarChart3,
  Calendar,
  Eye,
  Edit,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageSquare
} from 'lucide-react'

interface StudentGrade {
  id: string
  studentName: string
  studentEmail: string
  courseName: string
  assignments: { grade: number; maxGrade: number; submitted: boolean }[]
  exams: { grade: number; maxGrade: number; completed: boolean }[]
  overallGrade: number
  attendance: number
  participation: number
  rank: number
}

const mockStudents: StudentGrade[] = [
  { id: '1', studentName: 'أحمد محمد', studentEmail: 'ahmed@ex.com', courseName: 'الفيزياء - الصف الأول', assignments: [{ grade: 18, maxGrade: 20, submitted: true }, { grade: 15, maxGrade: 20, submitted: true }], exams: [{ grade: 85, maxGrade: 100, completed: true }], overallGrade: 87, attendance: 95, participation: 80, rank: 1 },
  { id: '2', studentName: 'فاطمة علي', studentEmail: 'fatma@ex.com', courseName: 'الفيزياء - الصف الأول', assignments: [{ grade: 17, maxGrade: 20, submitted: true }, { grade: 16, maxGrade: 20, submitted: true }], exams: [{ grade: 78, maxGrade: 100, completed: true }], overallGrade: 82, attendance: 90, participation: 75, rank: 2 },
  { id: '3', studentName: 'محمد خالد', studentEmail: 'mohamed@ex.com', courseName: 'الفيزياء - الصف الأول', assignments: [{ grade: 14, maxGrade: 20, submitted: true }, { grade: 0, maxGrade: 20, submitted: false }], exams: [{ grade: 70, maxGrade: 100, completed: true }], overallGrade: 68, attendance: 85, participation: 70, rank: 5 },
  { id: '4', studentName: 'سارة أحمد', studentEmail: 'sara@ex.com', courseName: 'الفيزياء - الصف الأول', assignments: [{ grade: 19, maxGrade: 20, submitted: true }, { grade: 18, maxGrade: 20, submitted: true }], exams: [{ grade: 90, maxGrade: 100, completed: true }], overallGrade: 91, attendance: 100, participation: 90, rank: 1 },
  { id: '5', studentName: 'عمر يوسف', studentEmail: 'omar@ex.com', courseName: 'الفيزياء - الصف الأول', assignments: [{ grade: 12, maxGrade: 20, submitted: true }, { grade: 14, maxGrade: 20, submitted: true }], exams: [{ grade: 65, maxGrade: 100, completed: true }], overallGrade: 65, attendance: 80, participation: 60, rank: 8 },
]

const stats = {
  totalStudents: 150,
  averageGrade: 75,
  passRate: 88,
  excellentCount: 25,
  goodCount: 45,
  averageCount: 35,
  failingCount: 10,
  topPerformers: 15
}

export default function AdminGradesPage() {
  const [students, setStudents] = useState<StudentGrade[]>(mockStudents)
  const [selectedStudent, setSelectedStudent] = useState<StudentGrade | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [courseFilter, setCourseFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'grade' | 'rank'>('rank')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [showEditModal, setShowEditModal] = useState(false)

  const filteredStudents = students
    .filter(s => {
      if (courseFilter !== 'all' && s.courseName !== courseFilter) return false
      if (searchQuery && !s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !s.studentEmail.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      let comparison = 0
      if (sortBy === 'name') comparison = a.studentName.localeCompare(b.studentName)
      else if (sortBy === 'grade') comparison = a.overallGrade - b.overallGrade
      else if (sortBy === 'rank') comparison = a.rank - b.rank
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const getGradeBadge = (grade: number) => {
    if (grade >= 90) return { variant: 'success' as const, label: 'ممتاز', color: 'text-emerald-400' }
    if (grade >= 75) return { variant: 'info' as const, label: 'جيد جداً', color: 'text-blue-400' }
    if (grade >= 60) return { variant: 'warning' as const, label: 'مقبول', color: 'text-amber-400' }
    return { variant: 'danger' as const, label: 'ضعيف', color: 'text-red-400' }
  }

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <GraduationCap className="w-7 h-7 text-primary" />
            إدارة الدرجات
          </h1>
          <p className="text-slate-400">متابعة وتعديل درجات الطلاب</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4" />
            تصدير
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4" />
            استيراد
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <p className="text-2xl font-bold">{stats.totalStudents}</p>
            <p className="text-xs text-slate-400">طالب</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
            <p className="text-2xl font-bold">{stats.averageGrade}%</p>
            <p className="text-xs text-slate-400">المتوسط</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-amber-400" />
            <p className="text-2xl font-bold">{stats.passRate}%</p>
            <p className="text-xs text-slate-400">نسبة النجاح</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
            <p className="text-2xl font-bold">{stats.excellentCount}</p>
            <p className="text-xs text-slate-400">ممتاز</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <p className="text-2xl font-bold">{stats.goodCount}</p>
            <p className="text-xs text-slate-400">جيد جداً</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-400" />
            <p className="text-2xl font-bold">{stats.failingCount}</p>
            <p className="text-xs text-slate-400">يحتاج تحسين</p>
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
                placeholder="ابحث بالاسم أو الإيميل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pr-10"
              />
            </div>
            <Select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              options={[
                { value: 'all', label: 'كل الكورسات' },
                { value: 'الفيزياء - الصف الأول', label: 'الفيزياء - الصف الأول' },
                { value: 'الميكانيكا', label: 'الميكانيكا' },
                { value: 'الكهرباء', label: 'الكهرباء' }
              ]}
              className="w-auto"
            />
          </div>
        </CardContent>
      </Card>

      {/* Grade Distribution */}
      <Card>
        <CardHeader>
          <h3 className="font-bold">توزيع الدرجات</h3>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 h-8 rounded-full overflow-hidden">
            <div className="bg-emerald-500 flex items-center justify-center text-xs text-white" style={{ width: `${(stats.excellentCount / stats.totalStudents) * 100}%` }}>
              {Math.round((stats.excellentCount / stats.totalStudents) * 100)}%
            </div>
            <div className="bg-blue-500 flex items-center justify-center text-xs text-white" style={{ width: `${(stats.goodCount / stats.totalStudents) * 100}%` }}>
              {Math.round((stats.goodCount / stats.totalStudents) * 100)}%
            </div>
            <div className="bg-amber-500 flex items-center justify-center text-xs text-white" style={{ width: `${(stats.averageCount / stats.totalStudents) * 100}%` }}>
              {Math.round((stats.averageCount / stats.totalStudents) * 100)}%
            </div>
            <div className="bg-red-500 flex items-center justify-center text-xs text-white" style={{ width: `${(stats.failingCount / stats.totalStudents) * 100}%` }}>
              {Math.round((stats.failingCount / stats.totalStudents) * 100)}%
            </div>
          </div>
          <div className="flex gap-4 mt-4 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500"></span> ممتاز (90%+)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500"></span> جيد جداً (75-89%)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500"></span> مقبول (60-74%)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500"></span> ضعيف (&lt;60%)</span>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">
                    <button className="flex items-center gap-1" onClick={() => toggleSort('rank')}>
                      الترتيب
                      {sortBy === 'rank' && (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                    </button>
                  </th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">
                    <button className="flex items-center gap-1" onClick={() => toggleSort('name')}>
                      الطالب
                      {sortBy === 'name' && (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                    </button>
                  </th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">الكورس</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">الواجبات</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">الاختبارات</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">
                    <button className="flex items-center gap-1" onClick={() => toggleSort('grade')}>
                      الدرجة
                      {sortBy === 'grade' && (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                    </button>
                  </th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">الحالة</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredStudents.map(student => {
                  const gradeBadge = getGradeBadge(student.overallGrade)
                  return (
                    <tr key={student.id} className="hover:bg-slate-800/30">
                      <td className="p-4">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold">
                          {student.rank}
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{student.studentName}</p>
                          <p className="text-xs text-slate-400">{student.studentEmail}</p>
                        </div>
                      </td>
                      <td className="p-4 text-sm">{student.courseName}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {student.assignments.reduce((acc, a) => acc + a.grade, 0)}/{student.assignments.reduce((acc, a) => acc + a.maxGrade, 0)}
                          </span>
                          {student.assignments.some(a => !a.submitted) && (
                            <Badge variant="warning" className="text-xs">متأخر</Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        {student.exams.reduce((acc, e) => acc + e.grade, 0)}/{student.exams.reduce((acc, e) => acc + e.maxGrade, 0)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={student.overallGrade} 
                            className="w-16 h-2"
                            
                          />
                          <span className={`font-bold ${gradeBadge.color}`}>{student.overallGrade}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={gradeBadge.variant}>{gradeBadge.label}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(student)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedStudent(student); setShowEditModal(true); }}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Student Detail Modal */}
      <Modal isOpen={!!selectedStudent && !showEditModal} onClose={() => setSelectedStudent(null)} title="تفاصيل الطالب" size="lg">
        {selectedStudent && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                {selectedStudent.studentName.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{selectedStudent.studentName}</h3>
                <p className="text-slate-400">{selectedStudent.studentEmail}</p>
                <p className="text-sm">{selectedStudent.courseName}</p>
              </div>
              <Badge variant={getGradeBadge(selectedStudent.overallGrade).variant} className="text-lg px-4 py-2">
                {selectedStudent.overallGrade}%
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                <Trophy className="w-6 h-6 mx-auto mb-2 text-amber-400" />
                <p className="text-2xl font-bold">#{selectedStudent.rank}</p>
                <p className="text-xs text-slate-400">الترتيب</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                <p className="text-2xl font-bold">{selectedStudent.attendance}%</p>
                <p className="text-xs text-slate-400">الحضور</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                <MessageSquare className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
                <p className="text-2xl font-bold">{selectedStudent.participation}%</p>
                <p className="text-xs text-slate-400">المشاركة</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                الواجبات
              </h4>
              <div className="space-y-2">
                {selectedStudent.assignments.map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-sm">واجب {i + 1}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(a.grade / a.maxGrade) * 100} className="w-24 h-2" />
                      <span className="text-sm">{a.grade}/{a.maxGrade}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                الاختبارات
              </h4>
              <div className="space-y-2">
                {selectedStudent.exams.map((e, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-sm">اختبار {i + 1}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(e.grade / e.maxGrade) * 100} className="w-24 h-2" />
                      <span className="text-sm">{e.grade}/{e.maxGrade}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Grade Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="تعديل الدرجات" size="md">
        {selectedStudent && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <p className="font-medium">{selectedStudent.studentName}</p>
              <p className="text-sm text-slate-400">{selectedStudent.courseName}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">الدرجة الإجمالية</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  defaultValue={selectedStudent.overallGrade}
                  min={0}
                  max={100}
                  className="input w-24 text-center"
                />
                <span className="text-slate-400">%</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setShowEditModal(false)}>
                إلغاء
              </Button>
              <Button className="flex-1">
                <CheckCircle className="w-4 h-4" />
                حفظ
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}