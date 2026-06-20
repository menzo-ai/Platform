'use client'

import { useState, useEffect } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Input from '@/components/ui/input'
import Modal from '@/components/ui/modal'
import { 
  Brain,
  Sparkles,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Loader2,
  AlertCircle,
  BookOpen,
  Target,
  Eye,
  RotateCcw,
  Trophy,
  Star,
  Settings,
  BookMarked,
  Filter
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  difficulty: string
  explanation: string
  userAnswer?: number
}

interface TestConfig {
  subject: string
  subjectId?: string
  questionCount: number
  difficulty: string
  time: number
  description?: string
}

interface Subject {
  id: string
  name: string
  description?: string
}

const difficultyOptions = [
  { value: 'all', label: 'الكل', color: 'bg-slate-600' },
  { value: 'سهل', label: 'سهل', color: 'bg-emerald-500' },
  { value: 'متوسط', label: 'متوسط', color: 'bg-amber-500' },
  { value: 'صعب', label: 'صعب', color: 'bg-red-500' },
]

const timeOptions = [
  { value: 5, label: '5 دقائق' },
  { value: 10, label: '10 دقائق' },
  { value: 15, label: '15 دقيقة' },
  { value: 30, label: '30 دقيقة' },
  { value: 60, label: '60 دقيقة' },
]

const countOptions = [5, 10, 20, 50]

export default function AITestPage() {
  const [step, setStep] = useState<'config' | 'test' | 'result'>('config')
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [config, setConfig] = useState<TestConfig>({
    subject: '',
    questionCount: 10,
    difficulty: 'all',
    time: 15
  })
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [startedAt, setStartedAt] = useState<Date | null>(null)
  const [customCount, setCustomCount] = useState('')
  const [testHistory, setTestHistory] = useState<any[]>([])

  const fetchSubjects = async () => {
    try {
      const response = await fetch('/api/subjects')
      if (response.ok) {
        const data = await response.json()
        setSubjects(data)
      }
    } catch (error) {
      setSubjects([
        { id: '1', name: 'الفيزياء - الباب الأول' },
        { id: '2', name: 'الفيزياء - الباب الثاني' },
        { id: '3', name: 'الفيزياء - الباب الثالث' },
      ])
    }
  }

  useEffect(() => {
    fetchSubjects()
  }, [])

  useEffect(() => {
    if (step === 'test' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (step === 'test' && timeLeft === 0) {
      toast.error('انتهى الوقت!')
      setStep('result')
    }
  }, [step, timeLeft])

  const startTest = async () => {
    setLoading(true)
    
    const sampleQuestions: Question[] = Array.from({ length: config.questionCount }, (_, i) => {
      const difficulty = config.difficulty === 'all' 
        ? (['سهل', 'متوسط', 'صعب'] as const)[Math.floor(Math.random() * 3)]
        : config.difficulty
      
      return {
        id: i + 1,
        question: `سؤال رقم ${i + 1} - ${config.subject}`,
        options: ['الإجابة الصحيحة', 'إجابة خاطئة 1', 'إجابة خاطئة 2', 'إجابة خاطئة 3'],
        correct: 0,
        difficulty,
        explanation: 'هذا شرح الإجابة'
      }
    })

    setQuestions(sampleQuestions)
    setTimeLeft(config.time * 60)
    setStartedAt(new Date())
    setStep('test')
    setLoading(false)
  }

  const selectAnswer = (answerIndex: number) => {
    setQuestions(prev => prev.map((q, i) => 
      i === currentQuestion ? { ...q, userAnswer: answerIndex } : q
    ))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const finishTest = () => {
    setStep('result')
  }

  const calculateResults = () => {
    const correct = questions.filter(q => q.userAnswer === q.correct).length
    const total = questions.length
    const score = Math.round((correct / total) * 100)
    const timeTaken = startedAt ? Math.floor((Date.now() - startedAt.getTime()) / 1000) : 0
    return { correct, total, score, timeTaken }
  }

  const restartTest = () => {
    setStep('config')
    setQuestions([])
    setCurrentQuestion(0)
    setTimeLeft(0)
    setStartedAt(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyBadge = (diff: string) => {
    if (diff === 'سهل') return 'success'
    if (diff === 'متوسط') return 'warning'
    if (diff === 'صعب') return 'danger'
    return 'info'
  }

  const currentQ = questions[currentQuestion]
  const results = step === 'result' ? calculateResults() : null
  const answeredCount = questions.filter(q => q.userAnswer !== undefined).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">الاختبار بالذكاء الاصطناعي</h1>
              <p className="text-slate-400">أنشئ اختبار مخصص في ثوانٍ</p>
            </div>
          </div>
        </div>

        {step === 'config' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="font-bold flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-amber-400" />
                  اختر المادة
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {subjects.map((subject) => (
                    <button
                      key={subject.id}
                      onClick={() => setConfig(prev => ({ ...prev, subject: subject.name, subjectId: subject.id }))}
                      className={`p-4 rounded-xl border-2 transition-all text-sm ${
                        config.subject === subject.name
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {subject.name}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-bold flex items-center gap-2">
                  <Settings className="w-5 h-5 text-amber-400" />
                  إعدادات الاختبار
                </h3>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    عدد الأسئلة
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {countOptions.map((count) => (
                      <button
                        key={count}
                        onClick={() => {
                          setConfig(prev => ({ ...prev, questionCount: count }))
                          setCustomCount('')
                        }}
                        className={`px-6 py-3 rounded-xl border-2 transition-all font-medium ${
                          config.questionCount === count && !customCount
                            ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                    <Input
                      type="number"
                      placeholder="مخصص (حتى 100)"
                      value={customCount}
                      onChange={(e) => {
                        setCustomCount(e.target.value)
                        const num = parseInt(e.target.value)
                        if (num > 0 && num <= 100) {
                          setConfig(prev => ({ ...prev, questionCount: num }))
                        }
                      }}
                      className="w-32"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    مستوى الصعوبة
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {difficultyOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setConfig(prev => ({ ...prev, difficulty: opt.value }))}
                        className={`px-6 py-3 rounded-xl border-2 transition-all font-medium flex items-center gap-2 ${
                          config.difficulty === opt.value
                            ? 'border-amber-500 bg-amber-500/10'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full ${opt.color}`} />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    الوقت (دقائق)
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {timeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setConfig(prev => ({ ...prev, time: opt.value }))}
                        className={`px-6 py-3 rounded-xl border-2 transition-all font-medium ${
                          config.time === opt.value
                            ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={startTest} 
                  disabled={loading || !config.subject}
                  className="w-full py-4 text-lg bg-gradient-to-r from-amber-500 to-orange-500"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                      جاري توليد الأسئلة...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 ml-2" />
                      ابدأ الاختبار
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 'test' && currentQ && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <Badge variant={getDifficultyBadge(currentQ.difficulty)}>
                      {currentQ.difficulty}
                    </Badge>
                    <span className="text-slate-400">
                      السؤال {currentQuestion + 1} / {questions.length}
                    </span>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    timeLeft <= 60 ? 'bg-red-500/20 text-red-400' : 'bg-slate-800'
                  }`}>
                    <Clock className="w-5 h-5" />
                    <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {questions.map((q, i) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestion(i)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                        i === currentQuestion
                          ? 'bg-amber-500 text-white'
                          : q.userAnswer !== undefined
                            ? 'bg-emerald-500/30 text-emerald-400'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Badge variant={getDifficultyBadge(currentQ.difficulty)} className="mb-4">
                  {currentQ.difficulty}
                </Badge>
                
                <h3 className="text-xl font-bold mb-6">
                  {currentQ.question}
                </h3>
                
                <div className="space-y-3">
                  {currentQ.options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => selectAnswer(i)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-right flex items-center gap-3 ${
                        currentQ.userAnswer === i
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        currentQ.userAnswer === i
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {i + 1}
                      </div>
                      <span className="flex-1">{option}</span>
                      {currentQ.userAnswer === i && <CheckCircle className="w-5 h-5 text-amber-400" />}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
              >
                <ChevronRight className="w-4 h-4 ml-1" />
                السابق
              </Button>
              
              <span className="text-slate-400">{answeredCount} / {questions.length}</span>
              
              {currentQuestion === questions.length - 1 ? (
                <Button onClick={finishTest} className="bg-emerald-500 hover:bg-emerald-600">
                  إنهاء الاختبار
                  <CheckCircle className="w-4 h-4 mr-1" />
                </Button>
              ) : (
                <Button onClick={nextQuestion}>
                  التالي
                  <ChevronLeft className="w-4 h-4 mr-1" />
                </Button>
              )}
            </div>
          </div>
        )}

        {step === 'result' && results && (
          <div className="space-y-6">
            <Card className={`border-2 ${
              results.score >= 70 ? 'border-emerald-500/30' : 
              results.score >= 50 ? 'border-amber-500/30' : 'border-red-500/30'
            }`}>
              <CardContent className="p-8 text-center">
                <div className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center ${
                  results.score >= 70 ? 'bg-emerald-500/20' : 
                  results.score >= 50 ? 'bg-amber-500/20' : 'bg-red-500/20'
                }`}>
                  <span className={`text-5xl font-bold ${
                    results.score >= 70 ? 'text-emerald-400' : 
                    results.score >= 50 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {results.score}%
                  </span>
                </div>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  {results.score >= 70 ? <Trophy className="w-8 h-8 text-emerald-400" /> : 
                   results.score >= 50 ? <Star className="w-8 h-8 text-amber-400" /> :
                   <RotateCcw className="w-8 h-8 text-red-400" />}
                </div>
                
                <h2 className="text-3xl font-bold mb-2">
                  {results.score >= 70 ? 'ممتاز! 🎉' : 
                   results.score >= 50 ? 'جيد! 👍' : 'حاول مرة أخرى 💪'}
                </h2>
                
                <p className="text-slate-400 mb-6">
                  أجبت على {results.correct} من {results.total} سؤال
                </p>

                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{formatTime(results.timeTaken)}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">{results.correct}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-lg">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400">{results.total - results.correct}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-bold flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  مراجعة الإجابات
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {questions.map((q, i) => (
                  <div 
                    key={q.id}
                    className={`p-4 rounded-xl border ${
                      q.userAnswer === q.correct
                        ? 'border-emerald-500/30 bg-emerald-500/5'
                        : 'border-red-500/30 bg-red-500/5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {q.userAnswer === q.correct ? (
                        <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={getDifficultyBadge(q.difficulty)} className="text-xs">{q.difficulty}</Badge>
                          <span className="text-slate-400 text-sm">السؤال {i + 1}</span>
                        </div>
                        <p className="font-medium mb-2">{q.question}</p>
                        
                        <p className="text-emerald-400 text-sm">
                          ✓ {q.options[q.correct]}
                        </p>
                        {q.userAnswer !== undefined && q.userAnswer !== q.correct && (
                          <p className="text-red-400 text-sm mt-1">
                            ✗ {q.options[q.userAnswer]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={restartTest} className="py-6">
                <Sparkles className="w-5 h-5 ml-2" />
                اختبار جديد
              </Button>
              <Button onClick={() => { setCurrentQuestion(0); setStep('test') }} className="py-6 bg-amber-500">
                <RotateCcw className="w-5 h-5 ml-2" />
                إعادة المحاولة
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
