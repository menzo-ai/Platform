'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Card, { CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Progress from '@/components/ui/progress'
import Modal from '@/components/ui/modal'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Flag,
  Award
} from 'lucide-react'

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
}

interface Exam {
  id: string
  title: string
  course: { title: string }
  type: string
  questions: Question[]
  duration: number
  passingScore: number
}

export default function ExamPage() {
  const params = useParams()
  const router = useRouter()
  const examId = params.id as string
  const [exam, setExam] = useState<Exam | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showStartModal, setShowStartModal] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [flagged, setFlagged] = useState<Set<number>>(new Set())
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const mockExam: Exam = {
      id: examId,
      title: 'اختبار الفصل الأول - الحركة والقوة',
      course: { title: 'الفيزياء - الصف الأول' },
      type: 'chapter_exam',
      duration: 30,
      passingScore: 60,
      questions: [
        { id: '1', text: 'ما هي وحدة قياس القوة في النظام الدولي؟', options: ['الجول', 'النيوتن', 'الوات', 'الباسكال'], correctAnswer: 1 },
        { id: '2', text: 'حسب قانون نيوتن الثاني، القوة تساوي؟', options: ['الكتلة × السرعة', 'الكتلة × التسارع', 'السرعة × الزمن', 'الكتلة ÷ التسارع'], correctAnswer: 1 },
        { id: '3', text: 'ما هو التسارع الأرضي؟', options: ['9.8 م/ث', '10.8 م/ث²', '9.8 م/ث²', '8.9 م/ث²'], correctAnswer: 2 },
        { id: '4', text: 'قانون نيوتن الأول يسمى؟', options: ['قانون الحركة', 'قانون القصور الذاتي', 'قانون الفعل ورد الفعل', 'قانون الجاذبية'], correctAnswer: 1 },
        { id: '5', text: 'ما هي وحدة قياس الشغل؟', options: ['النيوتن', 'الجول', 'الوات', 'الأمبير'], correctAnswer: 1 },
      ]
    }
    setExam(mockExam)
    setAnswers(new Array(mockExam.questions.length).fill(-1))
    setIsLoading(false)
  }, [examId])

  useEffect(() => {
    if (exam && showStartModal) {
      setTimeLeft(exam.duration * 60)
    }
  }, [exam, showStartModal])

  useEffect(() => {
    if (timeLeft > 0 && showStartModal) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    } else if (timeLeft === 0 && showStartModal) {
      handleSubmit()
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [timeLeft, showStartModal])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const selectAnswer = (optionIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = optionIndex
    setAnswers(newAnswers)
  }

  const toggleFlag = () => {
    const newFlagged = new Set(flagged)
    if (newFlagged.has(currentQuestion)) {
      newFlagged.delete(currentQuestion)
    } else {
      newFlagged.add(currentQuestion)
    }
    setFlagged(newFlagged)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setShowConfirmSubmit(false)
    setShowStartModal(false)
    setTimeout(() => {
      setIsSubmitting(false)
      setShowResultModal(true)
    }, 1000)
  }

  const getScoreColor = (score: number, passingScore: number) => {
    if (score >= passingScore) return 'text-emerald-400'
    if (score >= passingScore - 20) return 'text-amber-400'
    return 'text-red-400'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">الاختبار غير موجود</p>
          <Button onClick={() => router.push('/exams')}>العودة للاختبارات</Button>
        </div>
      </div>
    )
  }

  const currentQ = exam.questions[currentQuestion]
  const answeredCount = answers.filter(a => a !== -1).length
  const correctCount = exam.questions.filter((q, i) => answers[i] === q.correctAnswer).length
  const score = exam.questions.length > 0 ? Math.round((correctCount / exam.questions.length) * 100) : 0

  return (
    <div className="min-h-screen bg-background-dark">
      {/* Header */}
      <div className="bg-surface-dark border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-lg">{exam.title}</h1>
              <p className="text-sm text-slate-400">{exam.course.title}</p>
            </div>
            {showStartModal && (
              <div className="flex items-center gap-4">
                <Badge variant={flagged.size > 0 ? 'warning' : 'info'} className="gap-1">
                  <Flag className="w-4 h-4" />
                  {flagged.size} محدد
                </Badge>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeLeft < 300 ? 'bg-red-500/20 text-red-400' : 'bg-slate-800'}`}>
                  <Clock className="w-5 h-5" />
                  <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {!showStartModal && !showResultModal && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="mb-8">
            <CardContent className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{exam.title}</h2>
              <p className="text-slate-400 mb-6">{exam.course.title}</p>
              
              <div className="flex justify-center gap-8 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{exam.questions.length}</p>
                  <p className="text-sm text-slate-400">سؤال</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{exam.duration}</p>
                  <p className="text-sm text-slate-400">دقيقة</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{exam.passingScore}%</p>
                  <p className="text-sm text-slate-400">درجة النجاح</p>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-amber-400 mb-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">تنبيه مهم</span>
                </div>
                <p className="text-sm text-slate-300">
                  بمجرد بدء الاختبار، سيبدأ المؤقت فوراً ولا يمكن إيقافه.
                </p>
              </div>

              <Button size="lg" onClick={() => setShowStartModal(true)}>
                بدء الاختبار
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {showStartModal && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">
                السؤال {currentQuestion + 1} من {exam.questions.length}
              </span>
              <span className="text-sm text-slate-400">
                {answeredCount} مجاب
              </span>
            </div>
            <Progress value={(answeredCount / exam.questions.length) * 100} showLabel />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {exam.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  index === currentQuestion
                    ? 'bg-primary text-white'
                    : answers[index] !== -1
                    ? 'bg-secondary/20 text-secondary'
                    : flagged.has(index)
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <Badge variant="primary">سؤال {currentQuestion + 1}</Badge>
                <button onClick={toggleFlag} className={`p-2 rounded-lg transition-colors ${flagged.has(currentQuestion) ? 'bg-amber-500/20 text-amber-400' : 'hover:bg-slate-700 text-slate-400'}`}>
                  <Flag className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-xl font-bold mb-6">{currentQ.text}</h2>
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => selectAnswer(index)}
                    className={`w-full p-4 rounded-lg text-right transition-all ${
                      answers[currentQuestion] === index
                        ? 'bg-primary/20 border-2 border-primary'
                        : 'bg-slate-800 border-2 border-transparent hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${answers[currentQuestion] === index ? 'bg-primary text-white' : 'bg-slate-700 text-slate-400'}`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setCurrentQuestion(q => Math.max(0, q - 1))} disabled={currentQuestion === 0}>
              <ChevronRight className="w-4 h-4" /> السابق
            </Button>
            {currentQuestion === exam.questions.length - 1 ? (
              <Button onClick={() => setShowConfirmSubmit(true)}>إنهاء الاختبار</Button>
            ) : (
              <Button onClick={() => setCurrentQuestion(q => Math.min(exam.questions.length - 1, q + 1))}>
                التالي <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      <Modal isOpen={showConfirmSubmit} onClose={() => setShowConfirmSubmit(false)} title="تأكيد التسليم" size="sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-amber-400">
            <AlertCircle className="w-6 h-6" />
            <span className="font-medium">انتبه!</span>
          </div>
          <p className="text-slate-300">لم تجب على <span className="text-primary font-bold">{exam.questions.length - answeredCount}</span> أسئلة.</p>
          <p className="text-slate-400 text-sm">هل أنت متأكد من تسليم الاختبار؟</p>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowConfirmSubmit(false)}>إلغاء</Button>
            <Button className="flex-1" onClick={handleSubmit}>تسليم</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showResultModal} onClose={() => { setShowResultModal(false); router.push('/exams'); }} title="نتيجة الاختبار" size="md">
        <div className="text-center py-4">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${score >= exam.passingScore ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
            {score >= exam.passingScore ? <CheckCircle className="w-12 h-12 text-emerald-400" /> : <XCircle className="w-12 h-12 text-red-400" />}
          </div>
          <h2 className="text-3xl font-bold mb-2">{score >= exam.passingScore ? 'تهانينا!' : 'للأسف'}</h2>
          <p className={`text-5xl font-bold mb-4 ${getScoreColor(score, exam.passingScore)}`}>{score}%</p>
          <p className="text-slate-400 mb-6">{score >= exam.passingScore ? 'اجتزت الاختبار بنجاح!' : `تحتاج ${exam.passingScore}% للنجاح.`}</p>
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">{correctCount}</p>
              <p className="text-sm text-slate-400">صحيحة</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{exam.questions.length - answeredCount}</p>
              <p className="text-sm text-slate-400">بدون إجابة</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => { setShowResultModal(false); router.push('/exams'); }}>العودة</Button>
            <Button className="flex-1" onClick={() => { setShowResultModal(false); setShowStartModal(true); setAnswers(new Array(exam.questions.length).fill(-1)); setCurrentQuestion(0); setTimeLeft(exam.duration * 60); }}>إعادة المحاولة</Button>
          </div>
        </div>
      </Modal>

      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white">جاري حساب النتيجة...</p>
          </div>
        </div>
      )}
    </div>
  )
}
