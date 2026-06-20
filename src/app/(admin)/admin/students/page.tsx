'use client'

import { useEffect, useState } from 'react'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Badge from '@/components/ui/badge'
import Avatar from '@/components/ui/avatar'
import Modal from '@/components/ui/modal'
import { Search, Filter, MoreVertical, User, Mail, Phone, Eye, Edit, Ban, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Student {
  id: string
  name: string
  email: string
  studentId: string
  phone: string | null
  schoolYear: number | null
  isVerified: boolean
  isActive: boolean
  createdAt: string
  _count: { enrollments: number }
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('STUDENT')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [pagination.page, selectedRole])

  const fetchStudents = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        role: selectedRole,
      })
      if (searchQuery) params.append('search', searchQuery)

      const response = await fetch(`/api/users?${params}`)
      if (response.ok) {
        const data = await response.json()
        setStudents(data.users)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchStudents()
  }

  const toggleUserStatus = async (studentId: string, currentStatus: boolean) => {
    try {
      // Mock update
      setStudents(prev => prev.map(s => 
        s.id === studentId ? { ...s, isActive: !currentStatus } : s
      ))
    } catch (error) {
      console.error('Error updating student status:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">إدارة الطلاب</h1>
          <p className="text-slate-400">عرض وإدارة حسابات الطلاب</p>
        </div>
        <Button>إضافة طالب</Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4 flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="ابحث بالاسم أو البريد الإلكتروني أو رقم الطالب..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pr-10"
              />
            </div>
            <Button type="submit" variant="outline">بحث</Button>
          </form>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="input w-full md:w-48"
          >
            <option value="STUDENT">الطلاب</option>
            <option value="ADMIN">المديرين</option>
            <option value="">الكل</option>
          </select>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-primary">{pagination.total}</p>
          <p className="text-sm text-slate-400">إجمالي {selectedRole === 'STUDENT' ? 'الطلاب' : 'المستخدمين'}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">
            {students.filter(s => s.isActive).length}
          </p>
          <p className="text-sm text-slate-400">نشط</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">
            {students.filter(s => !s.isActive).length}
          </p>
          <p className="text-sm text-slate-400">غير نشط</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">
            {students.filter(s => s.isVerified).length}
          </p>
          <p className="text-sm text-slate-400">موثق</p>
        </Card>
      </div>

      {/* Students Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>المستخدم</th>
                <th>رقم الطالب</th>
                <th>الصف</th>
                <th>الدورات</th>
                <th>الحالة</th>
                <th>تاريخ التسجيل</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td><div className="flex items-center gap-3"><div className="w-10 h-10 bg-slate-700 rounded-full animate-pulse" /><div><div className="h-4 w-24 bg-slate-700 rounded mb-1" /><div className="h-3 w-32 bg-slate-700 rounded" /></div></div></td>
                    <td><div className="h-4 w-20 bg-slate-700 rounded" /></td>
                    <td><div className="h-4 w-16 bg-slate-700 rounded" /></td>
                    <td><div className="h-4 w-12 bg-slate-700 rounded" /></td>
                    <td><div className="h-6 w-16 bg-slate-700 rounded-full" /></td>
                    <td><div className="h-4 w-24 bg-slate-700 rounded" /></td>
                    <td><div className="h-8 w-20 bg-slate-700 rounded" /></td>
                  </tr>
                ))
              ) : students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar name={student.name} size="sm" />
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-slate-400">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-sm">{student.studentId || '-'}</td>
                    <td>
                      {student.schoolYear ? (
                        <Badge variant="primary">الصف {student.schoolYear}</Badge>
                      ) : '-'}
                    </td>
                    <td>{student._count.enrollments}</td>
                    <td>
                      <Badge variant={student.isActive ? 'success' : 'danger'}>
                        {student.isActive ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </td>
                    <td className="text-sm text-slate-400">
                      {formatDate(student.createdAt)}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedStudent(student)
                            setShowModal(true)
                          }}
                          className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleUserStatus(student.id, student.isActive)}
                          className={`p-2 rounded-lg hover:bg-slate-700 transition-colors ${
                            student.isActive ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {student.isActive ? <Ban className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    لا يوجد طلاب
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="p-4 border-t border-slate-700 flex items-center justify-between">
            <p className="text-sm text-slate-400">
              عرض {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} من {pagination.total}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <span className="px-3 py-1 bg-slate-800 rounded-lg text-sm">
                {pagination.page} / {pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === pagination.pages}
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Student Detail Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="تفاصيل الطالب"
        size="md"
      >
        {selectedStudent && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name={selectedStudent.name} size="xl" />
              <div>
                <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                <p className="text-slate-400">{selectedStudent.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400 mb-1">رقم الطالب</p>
                <p className="font-mono font-medium">{selectedStudent.studentId || '-'}</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400 mb-1">الصف</p>
                <p className="font-medium">{selectedStudent.schoolYear ? `الصف ${selectedStudent.schoolYear}` : '-'}</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400 mb-1">رقم الهاتف</p>
                <p className="font-medium">{selectedStudent.phone || '-'}</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400 mb-1">الدورات المسجلة</p>
                <p className="font-medium">{selectedStudent._count.enrollments}</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400 mb-1">الحالة</p>
                <Badge variant={selectedStudent.isActive ? 'success' : 'danger'}>
                  {selectedStudent.isActive ? 'نشط' : 'غير نشط'}
                </Badge>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400 mb-1">توثيق البريد</p>
                <Badge variant={selectedStudent.isVerified ? 'success' : 'warning'}>
                  {selectedStudent.isVerified ? 'موثق' : 'غير موثق'}
                </Badge>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                <Edit className="w-4 h-4" />
                تعديل
              </Button>
              <Button
                variant={selectedStudent.isActive ? 'danger' : 'secondary'}
                className="flex-1"
                onClick={() => {
                  toggleUserStatus(selectedStudent.id, selectedStudent.isActive)
                  setShowModal(false)
                }}
              >
                {selectedStudent.isActive ? 'حظر' : 'تفعيل'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
