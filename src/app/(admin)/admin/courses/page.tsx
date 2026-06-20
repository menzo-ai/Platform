'use client'

import { useEffect, useState } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Modal from '@/components/ui/modal'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import Textarea from '@/components/ui/textarea'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  BookOpen, 
  Users, 
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string | null
  grade: number
  price: number
  isPublished: boolean
  chapters: { id: string; lectures: { id: string }[] }[]
  _count: { enrollments: number }
  createdAt: string
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchCourses()
  }, [page, searchQuery])

  const fetchCourses = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      })
      if (searchQuery) params.append('search', searchQuery)

      const response = await fetch(`/api/courses?${params}`)
      if (response.ok) {
        const data = await response.json()
        setCourses(data)
        setTotalPages(data.pagination?.pages || 1)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (courseId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الدورة؟')) return

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchCourses()
      }
    } catch (error) {
      console.error('Error deleting course:', error)
    }
  }

  const handleTogglePublish = async (course: Course) => {
    try {
      const response = await fetch(`/api/courses/${course.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !course.isPublished }),
      })
      if (response.ok) {
        fetchCourses()
      }
    } catch (error) {
      console.error('Error toggling publish:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">إدارة الدورات</h1>
          <p className="text-slate-400">إنشاء وتعديل الدورات التعليمية</p>
        </div>
        <Button onClick={() => { setEditingCourse(null); setShowModal(true) }}>
          <Plus className="w-4 h-4" />
          إضافة دورة جديدة
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="ابحث عن دورة..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="input pr-10"
            />
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-primary">{courses.length}</p>
          <p className="text-sm text-slate-400">إجمالي الدورات</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">
            {courses.filter(c => c.isPublished).length}
          </p>
          <p className="text-sm text-slate-400">منشورة</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">
            {courses.filter(c => !c.isPublished).length}
          </p>
          <p className="text-sm text-slate-400">مسودة</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-secondary">
            {courses.reduce((acc, c) => acc + c._count.enrollments, 0)}
          </p>
          <p className="text-sm text-slate-400">إجمالي التسجيلات</p>
        </Card>
      </div>

      {/* Courses Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>الدورة</th>
                <th>الصف</th>
                <th>الفصول</th>
                <th>التسجيلات</th>
                <th>السعر</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td><div className="flex items-center gap-3"><div className="w-12 h-12 bg-slate-700 rounded animate-pulse" /><div><div className="h-4 w-32 bg-slate-700 rounded mb-1" /><div className="h-3 w-24 bg-slate-700 rounded" /></div></div></td>
                    <td><div className="h-4 w-12 bg-slate-700 rounded" /></td>
                    <td><div className="h-4 w-8 bg-slate-700 rounded" /></td>
                    <td><div className="h-4 w-8 bg-slate-700 rounded" /></td>
                    <td><div className="h-4 w-16 bg-slate-700 rounded" /></td>
                    <td><div className="h-6 w-16 bg-slate-700 rounded-full" /></td>
                    <td><div className="h-8 w-20 bg-slate-700 rounded" /></td>
                  </tr>
                ))
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <tr key={course.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <p className="text-xs text-slate-400 truncate max-w-xs">{course.description}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge variant="primary">الصف {course.grade}</Badge>
                    </td>
                    <td>{course.chapters?.length || 0}</td>
                    <td className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-slate-500" />
                      {course._count.enrollments}
                    </td>
                    <td>{course.price === 0 ? 'مجاني' : `${course.price} ج.م`}</td>
                    <td>
                      <Badge variant={course.isPublished ? 'success' : 'warning'}>
                        {course.isPublished ? 'منشورة' : 'مسودة'}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTogglePublish(course)}
                          className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                          title={course.isPublished ? 'إلغاء النشر' : 'نشر'}
                        >
                          {course.isPublished ? (
                            <EyeOff className="w-4 h-4 text-amber-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-emerald-400" />
                          )}
                        </button>
                        <button
                          onClick={() => { setEditingCourse(course); setShowModal(true); }}
                          className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                          <Edit className="w-4 h-4 text-primary" />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    لا توجد دورات
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-700 flex items-center justify-between">
            <p className="text-sm text-slate-400">
              الصفحة {page} من {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <span className="px-3 py-1 bg-slate-800 rounded-lg text-sm">
                {page}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Course Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingCourse(null); }}
        title={editingCourse ? 'تعديل الدورة' : 'إضافة دورة جديدة'}
        size="lg"
      >
        <form className="space-y-4">
          <Input
            label="عنوان الدورة"
            placeholder="مثال: الفيزياء - الصف الأول الثانوي"
            defaultValue={editingCourse?.title}
          />
          
          <Textarea
            label="وصف الدورة"
            placeholder="اكتب وصفاً مختصراً للدورة..."
            rows={3}
            defaultValue={editingCourse?.description}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="الصف الدراسي"
              options={[
                { value: '1', label: 'الصف الأول الثانوي' },
                { value: '2', label: 'الصف الثاني الثانوي' },
                { value: '3', label: 'الصف الثالث الثانوي' },
              ]}
              defaultValue={editingCourse?.grade?.toString()}
            />
            
            <Input
              label="السعر (ج.م)"
              type="number"
              placeholder="0"
              defaultValue={editingCourse?.price?.toString()}
            />
          </div>
          
          <Input
            label="رابط الصورة المصغرة"
            placeholder="https://example.com/image.jpg"
            defaultValue={editingCourse?.thumbnail || ''}
          />
          
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isPublished" className="rounded" defaultChecked={editingCourse?.isPublished} />
            <label htmlFor="isPublished" className="text-sm">نشر الدورة فوراً</label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" className="flex-1" onClick={() => setShowModal(false)}>
              إلغاء
            </Button>
            <Button type="submit" className="flex-1">
              {editingCourse ? 'حفظ التعديلات' : 'إضافة الدورة'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
