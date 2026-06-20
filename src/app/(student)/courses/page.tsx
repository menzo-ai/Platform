'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/card'
import Badge from '@/components/ui/badge'
import Progress from '@/components/ui/progress'
import Button from '@/components/ui/button'
import Select from '@/components/ui/select'
import { BookOpen, Users, Play, Lock, Search, Filter } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string | null
  grade: number
  price: number
  isFree: boolean
  chapters: { id: string; lectures: { id: string }[] }[]
  _count: { enrollments: number }
  enrollment?: { progress: number } | null
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedGrade, setSelectedGrade] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, enrollRes] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/enrollments'),
        ])

        if (coursesRes.ok) {
          const data = await coursesRes.json()
          setCourses(data)
          setFilteredCourses(data)
        }

        if (enrollRes.ok) {
          const enrollData = await enrollRes.json()
          const ids = new Set<string>(enrollData.map((e: any) => e.courseId))
          setEnrolledCourseIds(ids)
        }
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = [...courses]

    // Filter by grade
    if (selectedGrade !== 'all') {
      filtered = filtered.filter(c => c.grade === parseInt(selectedGrade))
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredCourses(filtered)
  }, [courses, selectedGrade, searchQuery])

  const totalLectures = (course: Course) =>
    course.chapters.reduce((acc, ch) => acc + ch.lectures.length, 0)

  const isEnrolled = (courseId: string) => enrolledCourseIds.has(courseId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">الدورات</h1>
          <p className="text-slate-400">استكشف الدورات المتاحة لصفك الدراسي</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="ابحث عن دورة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pr-10"
          />
        </div>
        <Select
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          options={[
            { value: 'all', label: 'جميع الصفوف' },
            { value: '1', label: 'الصف الأول الثانوي' },
            { value: '2', label: 'الصف الثاني الثانوي' },
            { value: '3', label: 'الصف الثالث الثانوي' },
          ]}
          className="w-full md:w-48"
        />
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="h-40 bg-slate-700" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-slate-700 rounded w-3/4" />
                <div className="h-4 bg-slate-700 rounded w-1/2" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-slate-700 rounded" />
                  <div className="h-6 w-20 bg-slate-700 rounded" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden group">
              {/* Thumbnail */}
              <div className="relative h-40 bg-gradient-to-br from-primary/20 to-primary/5">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-primary/30" />
                  </div>
                )}

                {/* Grade Badge */}
                <div className="absolute top-3 right-3">
                  <Badge variant="primary">الصف {course.grade}</Badge>
                </div>

                {/* Enrolled Badge */}
                {isEnrolled(course.id) && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="success">مسجل</Badge>
                  </div>
                )}

                {/* Price or Free */}
                {!isEnrolled(course.id) && (
                  <div className="absolute bottom-3 left-3">
                    {course.isFree || course.price === 0 ? (
                      <Badge variant="success">مجاني</Badge>
                    ) : (
                      <Badge variant="warning">{formatPrice(course.price)}</Badge>
                    )}
                  </div>
                )}

                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                    <Play className="w-6 h-6 text-white mr-[-2px]" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold mb-2 line-clamp-1">{course.title}</h3>
                <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {course.chapters.length} فصول
                  </span>
                  <span className="flex items-center gap-1">
                    <Play className="w-4 h-4" />
                    {totalLectures(course)} محاضرة
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course._count.enrollments}
                  </span>
                </div>

                {isEnrolled(course.id) ? (
                  <div className="space-y-2">
                    <Progress value={course.enrollment?.progress || 0} size="sm" showLabel />
                    <Link href={`/courses/${course.id}`}>
                      <Button className="w-full" size="sm">
                        {course.enrollment?.progress === 100 ? 'إعادة المشاهدة' : 'استمر في التعلم'}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    {course.isFree || course.price === 0 ? (
                      <Link href={`/courses/${course.id}`} className="flex-1">
                        <Button className="w-full" size="sm">
                          عرض الدورة
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Lock className="w-4 h-4" />
                          اشتراك
                        </Button>
                        <Button size="sm" className="flex-1">
                          اشترك الآن
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Filter className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">لا توجد دورات</h3>
          <p className="text-slate-400">
            {searchQuery || selectedGrade !== 'all'
              ? 'لا توجد دورات تطابق معايير البحث'
              : 'لم يتم إضافة دورات بعد'}
          </p>
        </div>
      )}
    </div>
  )
}
