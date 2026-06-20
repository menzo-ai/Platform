'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Progress from '@/components/ui/progress'
import Modal from '@/components/ui/modal'
import { 
  Play, 
  Clock, 
  Users, 
  BookOpen, 
  Lock, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Video,
  PlayCircle,
  ArrowRight,
  Share2,
  Bookmark,
  Award
} from 'lucide-react'

interface Chapter {
  id: string
  title: string
  order: number
  lectures: Lecture[]
}

interface Lecture {
  id: string
  title: string
  description: string | null
  videoUrl: string | null
  duration: number | null
  isFree: boolean
  order: number
  pdfUrl: string | null
}

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string | null
  grade: number
  price: number
  enrollment: { progress: number } | null
  chapters: Chapter[]
  totalLectures: number
  hasAccess: boolean
}

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.id as string
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    fetchCourse()
  }, [courseId])

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}`)
      if (response.ok) {
        const data = await response.json()
        setCourse(data)
        if (data.chapters?.length > 0) {
          setExpandedChapters(new Set([data.chapters[0].id]))
        }
        if (data.chapters?.length > 0 && data.chapters[0].lectures?.length > 0) {
          setSelectedLecture(data.chapters[0].lectures[0])
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnroll = async () => {
    setEnrolling(true)
    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      })
      if (response.ok) {
        fetchCourse()
      }
    } catch (error) {
      console.error('Error enrolling:', error)
    } finally {
      setEnrolling(false)
    }
  }

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => {
      const next = new Set(prev)
      if (next.has(chapterId)) {
        next.delete(chapterId)
      } else {
        next.add(chapterId)
      }
      return next
    })
  }

  const openLecture = (lecture: Lecture) => {
    setSelectedLecture(lecture)
    if (course?.hasAccess || lecture.isFree) {
      setShowVideoModal(true)
    }
  }

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '0:00'
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hrs > 0 ? `${hrs}:${mins.toString().padStart(2, '0')}` : `${mins} دقيقة`
  }

  const getYouTubeEmbedUrl = (url: string | null) => {
    if (!url) return null
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]+)/)
    return match ? `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1` : null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">الدورة غير موجودة</p>
          <Link href="/courses">
            <Button>العودة للدورات</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-dark">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/20 to-background-dark pt-20 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Course Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="primary">الصف {course.grade}</Badge>
                <Badge variant="info">{course.totalLectures} محاضرة</Badge>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <p className="text-slate-400 mb-6">{course.description}</p>

              <div className="flex flex-wrap gap-6 text-sm text-slate-400 mb-6">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {Math.floor(Math.random() * 500 + 100)} طالب
                </span>
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {course.chapters.length} فصول
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {course.chapters.reduce((acc, ch) => acc + ch.lectures.length * 15, 0)} ساعة
                </span>
              </div>

              {course.enrollment ? (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">التقدم في الدورة</span>
                    <span className="text-sm font-medium">{course.enrollment.progress}%</span>
                  </div>
                  <Progress value={course.enrollment.progress} showLabel />
                </div>
              ) : null}

              <div className="flex gap-3">
                {!course.enrollment && !course.hasAccess ? (
                  <Button size="lg" onClick={handleEnroll} isLoading={enrolling}>
                    <Lock className="w-5 h-5" />
                    اشترك الآن - {course.price} ج.م
                  </Button>
                ) : course.enrollment ? (
                  <Button size="lg" onClick={() => setShowVideoModal(true)}>
                    <Play className="w-5 h-5" />
                    استمر في المشاهدة
                  </Button>
                ) : (
                  <Button size="lg" onClick={() => setShowVideoModal(true)}>
                    <Play className="w-5 h-5" />
                    عرض المحتوى
                  </Button>
                )}
                <Button variant="outline" size="lg">
                  <Bookmark className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Preview Card */}
            <div className="lg:w-96">
              <Card className="overflow-hidden">
                <div 
                  className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 cursor-pointer relative group"
                  onClick={() => setShowVideoModal(true)}
                >
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PlayCircle className="w-20 h-20 text-primary/50 group-hover:text-primary transition-colors" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                      <Play className="w-8 h-8 text-white mr-[-2px]" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                    <span>مدة الكورس</span>
                    <span>{course.chapters.reduce((acc, ch) => acc + ch.lectures.length * 15, 0)} ساعة</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                    <span>عدد المحاضرات</span>
                    <span>{course.totalLectures}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                    <span>الدروس المتاحة</span>
                    <span>{course.chapters.reduce((acc, ch) => acc + ch.lectures.filter(l => l.isFree).length, 0)} مجانية</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-accent">
                    <Award className="w-4 h-4" />
                    <span>شهادة إتمام الكورس</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Curriculum */}
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-6">محتوى الدورة</h2>
            
            <div className="space-y-4">
              {course.chapters.map((chapter) => (
                <Card key={chapter.id} className="overflow-hidden">
                  <button
                    onClick={() => toggleChapter(chapter.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {chapter.order}
                      </div>
                      <div className="text-right">
                        <h3 className="font-semibold">{chapter.title}</h3>
                        <p className="text-sm text-slate-400">
                          {chapter.lectures.length} محاضرة
                        </p>
                      </div>
                    </div>
                    {expandedChapters.has(chapter.id) ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  {expandedChapters.has(chapter.id) && (
                    <div className="border-t border-slate-700">
                      {chapter.lectures.map((lecture) => (
                        <button
                          key={lecture.id}
                          onClick={() => openLecture(lecture)}
                          className={`w-full p-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors border-b border-slate-700/50 last:border-0 ${
                            selectedLecture?.id === lecture.id ? 'bg-primary/10' : ''
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            course.hasAccess || lecture.isFree 
                              ? 'bg-secondary/10 text-secondary' 
                              : 'bg-slate-700 text-slate-500'
                          }`}>
                            {course.hasAccess || lecture.isFree ? (
                              <Play className="w-5 h-5" />
                            ) : (
                              <Lock className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex-1 text-right">
                            <h4 className="font-medium">{lecture.title}</h4>
                            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                              <span className="flex items-center gap-1">
                                <Video className="w-3 h-3" />
                                {formatDuration(lecture.duration)}
                              </span>
                              {lecture.pdfUrl && (
                                <span className="flex items-center gap-1">
                                  <FileText className="w-3 h-3" />
                                  PDF
                                </span>
                              )}
                              {lecture.isFree && (
                                <Badge variant="success" className="text-xs">مجاني</Badge>
                              )}
                            </div>
                          </div>
                          {selectedLecture?.id === lecture.id && (
                            <CheckCircle className="w-5 h-5 text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            {selectedLecture && (
              <Card className="mb-6">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center rounded-t-lg cursor-pointer"
                  onClick={() => openLecture(selectedLecture)}>
                  <PlayCircle className="w-16 h-16 text-primary/50" />
                </div>
                <div className="p-4">
                  <h4 className="font-medium mb-2">{selectedLecture.title}</h4>
                  <p className="text-sm text-slate-400 line-clamp-2">
                    {selectedLecture.description || 'لا يوجد وصف'}
                  </p>
                </div>
              </Card>
            )}

            <Card>
              <h3 className="font-bold mb-4">ماذا ستتعلم</h3>
              <ul className="space-y-3">
                {[
                  'فهم أساسيات الفيزياء',
                  'حل المسائل بسهولة',
                  'التحضير للامتحانات',
                  'التفوق في الصف الدراسي',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <Modal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        title={selectedLecture?.title || ''}
        size="xl"
      >
        <div className="space-y-4">
          {selectedLecture?.videoUrl ? (
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={getYouTubeEmbedUrl(selectedLecture.videoUrl) || ''}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Lock className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">اشترك للوصول لهذه المحاضرة</p>
              </div>
            </div>
          )}

          {selectedLecture && (
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <h4 className="font-medium mb-2">وصف المحاضرة</h4>
              <p className="text-sm text-slate-400">
                {selectedLecture.description || 'لا يوجد وصف لهذه المحاضرة'}
              </p>
              
              {selectedLecture.pdfUrl && (
                <a 
                  href={selectedLecture.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center gap-2 text-primary hover:text-primary-light transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  تحميل ملاحظات PDF
                </a>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm">
              <ArrowRight className="w-4 h-4" />
              المحاضرة السابقة
            </Button>
            <Button variant="outline" size="sm">
              المحاضرة التالية
              <ArrowRight className="w-4 h-4 -scale-x-100" />
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
