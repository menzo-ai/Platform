'use client'

import { useState } from 'react'
import Link from 'next/link'
import Card, { CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import { 
  GraduationCap,
  BookOpen,
  Users,
  Star,
  Play,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Clock,
  Award,
  TrendingUp
} from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  image: string
  instructor: string
  grade: number
  chapters: number
  lectures: number
  students: number
  rating: number
  price: number
  hasExam: boolean
  isPublished: boolean
}

const mockCourses: Course[] = [
  { id: '1', title: 'الفيزياء - الصف الأول الثانوي', description: 'أساسيات الفيزياء الحديثة مع شرح تفصيلي لقوانين نيوتن والحركة', image: '/courses/physics-1.jpg', instructor: 'م. خالد أسامة', grade: 1, chapters: 8, lectures: 45, students: 567, rating: 4.8, price: 500, hasExam: true, isPublished: true },
  { id: '2', title: 'الميكانيكا - الصف الثاني', description: 'ميكانيكا نيوتن والحركة الدورانية', image: '/courses/mechanics.jpg', instructor: 'م. خالد أسامة', grade: 2, chapters: 10, lectures: 60, students: 423, rating: 4.7, price: 600, hasExam: true, isPublished: true },
  { id: '3', title: 'الكهرباء - الصف الثالث', description: 'الدوائر الكهربائية والمجالات المغناطيسية', image: '/courses/electricity.jpg', instructor: 'م. خالد أسامة', grade: 3, chapters: 12, lectures: 75, students: 389, rating: 4.9, price: 700, hasExam: true, isPublished: true },
]

export default function AllCoursesPage() {
  const [courses] = useState<Course[]>(mockCourses)
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price'>('popular')

  const filteredCourses = courses
    .filter(c => {
      if (selectedGrade && c.grade !== selectedGrade) return false
      if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.students - a.students
      if (sortBy === 'rating') return b.rating - a.rating
      return a.price - b.price
    })

  return (
    <div className="min-h-screen bg-background-dark">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/20 via-background-dark to-accent/20 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            جميع الكورسات والمحاضرات
          </h1>
          <p className="text-xl text-slate-400 mb-8">
            استكشف مجموعتنا الكاملة من الكورسات والمحاضرات المميزة
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" />
            <input
              type="text"
              placeholder="ابحث عن كورس أو محاضرة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pr-12 h-14 text-lg w-full"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedGrade === null ? 'primary' : 'outline'}
              onClick={() => setSelectedGrade(null)}
            >
              الكل
            </Button>
            {[1, 2, 3].map(grade => (
              <Button
                key={grade}
                variant={selectedGrade === grade ? 'primary' : 'outline'}
                onClick={() => setSelectedGrade(grade)}
              >
                <GraduationCap className="w-4 h-4 ml-2" />
                الصف {grade}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            {[
              { id: 'popular', label: 'الأكثر شعبية' },
              { id: 'rating', label: 'الأعلى تقييماً' },
              { id: 'price', label: 'السعر' }
            ].map(sort => (
              <Button
                key={sort.id}
                variant={sortBy === sort.id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSortBy(sort.id as any)}
              >
                {sort.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="p-4 text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{courses.length}</p>
            <p className="text-xs text-slate-400">كورس</p>
          </Card>
          <Card className="p-4 text-center">
            <Play className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
            <p className="text-2xl font-bold">{courses.reduce((acc, c) => acc + c.lectures, 0)}</p>
            <p className="text-xs text-slate-400">محاضرة</p>
          </Card>
          <Card className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <p className="text-2xl font-bold">{courses.reduce((acc, c) => acc + c.students, 0).toLocaleString()}</p>
            <p className="text-xs text-slate-400">طالب</p>
          </Card>
          <Card className="p-4 text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-amber-400" />
            <p className="text-2xl font-bold">{(courses.reduce((acc, c) => acc + c.rating, 0) / courses.length).toFixed(1)}</p>
            <p className="text-xs text-slate-400">متوسط التقييم</p>
          </Card>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <Card key={course.id} className="overflow-hidden group">
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                <GraduationCap className="w-20 h-20 text-white/50 group-hover:scale-110 transition-transform" />
                
                {/* Grade Badge */}
                <Badge variant="primary" className="absolute top-4 right-4">
                  <GraduationCap className="w-3 h-3 ml-1" />
                  الصف {course.grade}
                </Badge>

                {/* Exam Badge */}
                {course.hasExam && (
                  <Badge variant="warning" className="absolute top-4 left-4">
                    <Award className="w-3 h-3 ml-1" />
                    امتحان شامل
                  </Badge>
                )}

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/courses/${course.id}`}>
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                      <Play className="w-8 h-8 text-white mr-[-3px]" />
                    </div>
                  </Link>
                </div>
              </div>

              <CardContent className="p-5">
                {/* Title */}
                <h3 className="font-bold text-lg mb-2 line-clamp-1">{course.title}</h3>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{course.description}</p>

                {/* Instructor */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                    {course.instructor.charAt(0)}
                  </div>
                  <span className="text-sm text-slate-400">{course.instructor}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {course.chapters} فصل
                  </span>
                  <span className="flex items-center gap-1">
                    <Play className="w-4 h-4" />
                    {course.lectures} محاضرة
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course.students}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{course.rating}</span>
                  <span className="text-sm text-slate-500">({course.students * 3} تقييم)</span>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div>
                    <span className="text-2xl font-bold text-primary">{course.price}</span>
                    <span className="text-slate-400 mr-1">ج.م</span>
                  </div>
                  <Link href={`/courses/${course.id}`}>
                    <Button>
                      <Play className="w-4 h-4 ml-2" />
                      عرض التفاصيل
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <h3 className="text-xl font-bold mb-2">لا توجد كورسات</h3>
            <p className="text-slate-400">جرب تغيير الفلاتر للبحث</p>
          </div>
        )}
      </div>
    </div>
  )
}