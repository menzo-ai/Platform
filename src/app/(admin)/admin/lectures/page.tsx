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
  GraduationCap,
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Play,
  FileText,
  Image,
  Lock,
  Unlock,
  Video,
  Upload,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Copy,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  Settings
} from 'lucide-react'

interface Lecture {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnail?: string
  pdfNotes?: string
  duration: number
  order: number
  isLocked: boolean
  views: number
  hasExam: boolean
}

interface Chapter {
  id: string
  title: string
  description: string
  order: number
  lectures: Lecture[]
  isExpanded: boolean
}

interface Course {
  id: string
  title: string
  grade: number
  chapters: Chapter[]
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'الفيزياء - الصف الأول',
    grade: 1,
    chapters: [
      {
        id: 'ch1',
        title: 'الفصل الأول: قوانين نيوتن',
        description: 'شرح تفصيلي لقوانين نيوتن الثلاثة',
        order: 1,
        isExpanded: true,
        lectures: [
          { id: 'l1', title: 'قانون نيوتن الأول - القصور الذاتي', description: 'شرح مفهوم القصور الذاتي', videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ', duration: 45, order: 1, isLocked: false, views: 245, hasExam: true },
          { id: 'l2', title: 'قانون نيوتن الثاني - العلاقة بين القوة والكتلة', description: 'شرح قانون F=ma', videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ', duration: 50, order: 2, isLocked: false, views: 198, hasExam: false },
          { id: 'l3', title: 'قانون نيوتن الثالث - الفعل والردة', description: 'شرح قانون الفعل والردة', videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ', duration: 40, order: 3, isLocked: true, views: 0, hasExam: false },
        ]
      },
      {
        id: 'ch2',
        title: 'الفصل الثاني: التسارع',
        description: 'مفهوم التسارع وأنواعه',
        order: 2,
        isExpanded: false,
        lectures: [
          { id: 'l4', title: 'مفهوم التسارع', description: 'تعريف التسارع ووحدته', videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ', duration: 35, order: 1, isLocked: true, views: 0, hasExam: false },
          { id: 'l5', title: 'التسارع المنتظم', description: 'حالات التسارع المنتظم', videoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ', duration: 55, order: 2, isLocked: true, views: 0, hasExam: false },
        ]
      }
    ]
  }
]

const stats = {
  totalLectures: 45,
  totalChapters: 8,
  totalViews: 12500,
  avgWatchTime: 78,
  lockedLectures: 12,
  lectureWithExam: 15
}

export default function AdminLecturesPage() {
  const [courses, setCourses] = useState<Course[]>(mockCourses)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(mockCourses[0])
  const [showAddChapterModal, setShowAddChapterModal] = useState(false)
  const [showAddLectureModal, setShowAddLectureModal] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const toggleChapter = (courseId: string, chapterId: string) => {
    setCourses(prev => prev.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          chapters: course.chapters.map(ch => 
            ch.id === chapterId ? { ...ch, isExpanded: !ch.isExpanded } : ch
          )
        }
      }
      return course
    }))
  }

  const toggleLectureLock = (courseId: string, chapterId: string, lectureId: string) => {
    setCourses(prev => prev.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          chapters: course.chapters.map(ch => {
            if (ch.id === chapterId) {
              return {
                ...ch,
                lectures: ch.lectures.map(lec => 
                  lec.id === lectureId ? { ...lec, isLocked: !lec.isLocked } : lec
                )
              }
            }
            return ch
          })
        }
      }
      return course
    }))
  }

  const handleAddLecture = (chapterId: string) => {
    setSelectedChapter(mockCourses[0].chapters.find(ch => ch.id === chapterId) || null)
    setShowAddLectureModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <Video className="w-7 h-7 text-primary" />
            إدارة المحاضرات والفصول
          </h1>
          <p className="text-slate-400">إنشاء وتعديل المحاضرات والفصول</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowAddChapterModal(true)}>
            <Plus className="w-4 h-4" />
            إضافة فصل
          </Button>
          <Button onClick={() => setShowAddLectureModal(true)}>
            <Plus className="w-4 h-4" />
            إضافة محاضرة
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Video className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold">{stats.totalLectures}</p>
              <p className="text-xs text-slate-400">محاضرة</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-emerald-400" />
            <div>
              <p className="text-2xl font-bold">{stats.totalChapters}</p>
              <p className="text-xs text-slate-400">فصل</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
              <p className="text-xs text-slate-400">مشاهدة</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-amber-400" />
            <div>
              <p className="text-2xl font-bold">{stats.avgWatchTime}%</p>
              <p className="text-xs text-slate-400">متوسط المشاهدة</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Lock className="w-8 h-8 text-red-400" />
            <div>
              <p className="text-2xl font-bold">{stats.lockedLectures}</p>
              <p className="text-xs text-slate-400">مقفل</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Course Selection */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select
                label="اختر الكورس"
                value={selectedCourse?.id || ''}
                onChange={(e) => {
                  const course = courses.find(c => c.id === e.target.value)
                  setSelectedCourse(course || null)
                }}
                options={courses.map(c => ({ value: c.id, label: `${c.title} - الصف ${c.grade}` }))}
              />
            </div>
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="ابحث في المحاضرات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pr-10 w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Content */}
      {selectedCourse && (
        <div className="space-y-4">
          {selectedCourse.chapters.map(chapter => (
            <Card key={chapter.id} className="overflow-hidden">
              {/* Chapter Header */}
              <div 
                className="p-4 bg-slate-800/50 cursor-pointer hover:bg-slate-800 transition-colors"
                onClick={() => toggleChapter(selectedCourse.id, chapter.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold">{chapter.title}</h3>
                      <p className="text-xs text-slate-400">{chapter.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="info">{chapter.lectures.length} محاضرة</Badge>
                    <Badge variant={chapter.lectures.filter(l => l.isLocked).length > 0 ? 'warning' : 'success'}>
                      {chapter.lectures.filter(l => l.isLocked).length} مقفل
                    </Badge>
                    {chapter.isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Lectures */}
              {chapter.isExpanded && (
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-700">
                    {chapter.lectures.map((lecture, index) => (
                      <div 
                        key={lecture.id} 
                        className={`p-4 flex items-center gap-4 hover:bg-slate-800/30 ${lecture.isLocked ? 'opacity-70' : ''}`}
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        
                        <div className="w-32 h-18 bg-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                          <Video className="w-6 h-6 text-slate-500" />
                          {lecture.isLocked && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <Lock className="w-6 h-6 text-amber-400" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{lecture.title}</h4>
                            {lecture.hasExam && (
                              <Badge variant="warning" className="text-xs">
                                <BarChart3 className="w-3 h-3 ml-1" />
                                امتحان
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 truncate">{lecture.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {lecture.duration} دقيقة
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {lecture.views} مشاهدة
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toggleLectureLock(selectedCourse.id, chapter.id, lecture.id)}
                          >
                            {lecture.isLocked ? (
                              <Unlock className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Lock className="w-4 h-4 text-amber-400" />
                            )}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Lecture Button */}
                  <div className="p-4 border-t border-slate-700">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleAddLecture(chapter.id)}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4" />
                      إضافة محاضرة جديدة
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Add Chapter Modal */}
      <Modal isOpen={showAddChapterModal} onClose={() => setShowAddChapterModal(false)} title="إضافة فصل جديد" size="md">
        <div className="space-y-4">
          <Input label="عنوان الفصل" placeholder="مثال: قوانين نيوتن" />
          <Textarea label="الوصف" placeholder="وصف الفصل..." rows={3} />
          <Select 
            label="الكورس"
            options={courses.map(c => ({ value: c.id, label: `${c.title} - الصف ${c.grade}` }))}
          />
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowAddChapterModal(false)}>
              إلغاء
            </Button>
            <Button className="flex-1">
              <Plus className="w-4 h-4" />
              إضافة
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Lecture Modal */}
      <Modal isOpen={showAddLectureModal} onClose={() => setShowAddLectureModal(false)} title="إضافة محاضرة جديدة" size="lg">
        <div className="space-y-4">
          <Input label="عنوان المحاضرة" placeholder="مثال: قانون نيوتن الأول" />
          <Textarea label="الوصف" placeholder="وصف المحاضرة..." rows={2} />
          
          <Select 
            label="الفصل"
            options={selectedCourse?.chapters.map(ch => ({ value: ch.id, label: ch.title })) || []}
          />

          <div>
            <label className="block text-sm font-medium mb-2">رابط الفيديو (YouTube)</label>
            <input type="url" placeholder="https://youtube.com/watch?v=..." className="input w-full" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="المدة (دقائق)" type="number" placeholder="45" />
            <Select 
              label="الحالة"
              options={[
                { value: 'unlocked', label: 'متاح' },
                { value: 'locked', label: 'مقفل' }
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">ملاحظات PDF (اختياري)</label>
            <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p className="text-sm text-slate-400">ارفع ملف PDF</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm">يحتوي على امتحان</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowAddLectureModal(false)}>
              إلغاء
            </Button>
            <Button className="flex-1">
              <Plus className="w-4 h-4" />
              إضافة المحاضرة
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}