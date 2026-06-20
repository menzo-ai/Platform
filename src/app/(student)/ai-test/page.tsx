'use client'

import { useState } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Input from '@/components/ui/input'
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
  Zap,
  Eye
} from 'lucide-react'

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  difficulty: 'سهل' | 'متوسط' | 'صعب'
  explanation: string
  userAnswer?: number
}

interface TestConfig {
  subject: string
  questionCount: number
  difficulty: 'all' | 'سهل' | 'متوسط' | 'صعب'
  time: number
}

const subjects = [
  'الفيزياء - الباب الأول',
  'الفيزياء - الباب الثاني',
  'الفيزياء - الباب الثالث',
  'الفيزياء - الباب الرابع',
  'الفيزياء - الباب الخامس',
  'الفيزياء - الباب السادس',
]

const difficultyOptions = [
  { value: 'all', label: 'الكل', color: 'bg-slate-600' },
  { value: 'سهل', label: 'سهل', color: 'bg-emerald-500' },
  { value: 'متوسط', label: 'متوسط', color: 'bg-amber-500' },
  { value: 'صعب', label: 'صعب', color: 'bg-red-500' },
]

const timeOptions = [5, 10, 15, 30, 60]
const countOptions = [5, 10, 20, 50]

export default function AITestPage() {
  const [step, setStep] = useState<'config' | 'test' | 'result'>('config')
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
  const [customCount, setCustomCount] = useState<string>('')

  const startTest = async () => {
    setLoading(true)
    
    // Simulate AI generating questions
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Generate sample questions based on config
    const sampleQuestions: Question[] = Array.from({ length: config.questionCount }, (_, i) => ({
      id: i + 1,
      question: `سؤال رقم ${i + 1} - ${config.subject}\n${getSampleQuestion(i, config.difficulty)}`,
      options: [
        `الإجابة الصحيحة - ${config.subject}`,
        `إجابة خاطئة 1`,
        `إجابة خاطئة 2`,
        `إجابة خاطئة 3`
      ].sort(() => Math.random() - 0.5),
      correct: 0, // Will be updated after shuffle
      difficulty: config.difficulty === 'all' 
        ? (['سهل', 'متوسط', 'صعب'] as const)[Math.floor(Math.random() * 3)]
        : config.difficulty as 'سهل' | 'متوسط' | 'صعب',
      explanation: `شرح الإجابة الصحيحة للسؤال رقم ${i + 1}`
    }))

    // Set correct answer index
    sampleQuestions.forEach(q => {
      q.correct = q.options.indexOf(`الإجابة الصحيحة - ${config.subject}`)
    })

    setQuestions(sampleQuestions)
    setTimeLeft(config.time * 60)
    setStartedAt(new Date())
    setStep('test')
    setLoading(false)
  }

  const getSampleQuestion = (index: number, difficulty: string): string => {
    const physicsQuestions = [
      'ما هو قانون نيوتن الثاني للحركة؟',
      'احسب التسارع لجسم كتلته 10kg تؤثر عليه قوة 50N',
      'ما هي وحدة قياس القوة في النظام الدولي؟',
      'اشرح ظاهرة الانعكاس في المرايا المستوية',
      'ما هو الفرق بين الشغل والطاقة؟',
      'احسب الطاقة الحركية لجسم يتحرك بسرعة 20m/s وكتلته 5kg',
      'ما هي قوانين الانكسار؟',
      'اشرح ظاهرة الحيود',
      'ما هو الطول الموجي؟',
      'احسب التردد لموجة طولها الموجي 2m وسرعتها 10m/s'
    ]
    return physicsQuestions[index % physicsQuestions.length]
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
    const score = (correct / total) * 100
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

  // Timer effect
  if (step === 'test' && timeLeft > 0) {
    setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentQ = questions[currentQuestion]
  const results = step === 'result' ? calculateResults() : null

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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

        {/* Config Step */}
        {step === 'config' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card>
              <CardHeader>
                <h3 className="font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  إعدادات الاختبار
                </h3>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    اختر المادة
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {subjects.map((subject) => (
                      <button
                        key={subject}
                        onClick={() => setConfig(prev => ({ ...prev, subject }))}
                        className={`p-3 rounded-xl border-2 transition-all text-sm ${
                          config.subject === subject
                            ? 'border-amber-500 bg-amber-500/10'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Count */}
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
                        className={`px-6 py-3 rounded-xl border-2 transition-all ${
                          config.questionCount === count && !customCount
                            ? 'border-amber-500 bg-amber-500/10 font-bold'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">مخصص (حتى 100):</span>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={customCount}
                        onChange={(e) => {
                          const val = e.target.value
                          setCustomCount(val)
                          if (val) {
                            setConfig(prev => ({ ...prev, questionCount: Math.min(100, Math.max(1, parseInt(val) || 1)) }))
                          }
                        }}
                        className="input w-20"
                        placeholder="..."
                      />
                    </div>
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    مستوى الصعوبة
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {difficultyOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setConfig(prev => ({ ...prev, difficulty: opt.value as any }))}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 transition-all ${
                          config.difficulty === opt.value
                            ? 'border-amber-500 bg-amber-500/10 font-bold'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full ${opt.color}`} />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    الوقت (دقائق)
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {timeOptions.map((time) => (
                      <button
                        key={time}
                        onClick={() => setConfig(prev => ({ ...prev, time }))}
                        className={`px-6 py-3 rounded-xl border-2 transition-all ${
                          config.time === time
                            ? 'border-amber-500 bg-amber-500/10 font-bold'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start Button */}
                <Button
                  onClick={startTest}
                  disabled={!config.subject || loading}
                  className="w-full h-14 text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      جاري إنشاء الاختبار...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      ابدأ الاختبار
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="border-amber-500/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-300">
                    <p className="font-medium mb-1">كيف يعمل الاختبار؟</p>
                    <p className="text-slate-400">
                      الذكاء الاصطناعي ينشئ أسئلة مخصصة بناءً على اختياراتك. الأسئلة متنوعة في مستوى الصعوبة وتغطي أهم نقاط المادة.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Test Step */}
        {step === 'test' && currentQ && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Badge variant="warning" className="text-sm">
                  {currentQ.difficulty}
                </Badge>
                <span className="text-slate-400 text-sm">
                  السؤال {currentQuestion + 1} / {questions.length}
                </span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                timeLeft <= 60 ? 'bg-red-500/20 text-red-400' : 'bg-slate-800'
              }`}>
                <Clock className="w-4 h-4" />
                <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="flex flex-wrap gap-2 mb-6">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(i)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                    i === currentQuestion
                      ? 'bg-amber-500 text-white'
                      : q.userAnswer !== undefined
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Question Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-2 mb-4">
                  <span className="text-amber-400 font-bold">{currentQ.difficulty}</span>
                </div>
                <h3 className="text-xl font-bold mb-6 whitespace-pre-line">
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
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        currentQ.userAnswer === i
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {i + 1}
                      </div>
                      <span>{option}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
              >
                <ChevronRight className="w-4 h-4" />
                السابق
              </Button>
              
              {currentQuestion === questions.length - 1 ? (
                <Button onClick={finishTest} className="bg-emerald-500 hover:bg-emerald-600">
                  إنهاء الاختبار
                  <CheckCircle className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={nextQuestion}>
                  التالي
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Unanswered Warning */}
            {questions.some(q => q.userAnswer === undefined) && (
              <div className="text-center text-sm text-slate-400">
                يوجد {questions.filter(q => q.userAnswer === undefined).length} سؤال بدون إجابة
              </div>
            )}
          </div>
        )}

        {/* Result Step */}
        {step === 'result' && results && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Score Card */}
            <Card className={`border-2 ${
              results.score >= 70 ? 'border-emerald-500/30' : 
              results.score >= 50 ? 'border-amber-500/30' : 'border-red-500/30'
            }`}>
              <CardContent className="p-8 text-center">
                <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  results.score >= 70 ? 'bg-emerald-500/20' : 
                  results.score >= 50 ? 'bg-amber-500/20' : 'bg-red-500/20'
                }`}>
                  <span className={`text-4xl font-bold ${
                    results.score >= 70 ? 'text-emerald-400' : 
                    results.score >= 50 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {Math.round(results.score)}%
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold mb-2">
                  {results.score >= 70 ? 'ممتاز! 🎉' : 
                   results.score >= 50 ? 'جيد! 👍' : 'حاول مرة أخرى 💪'}
                </h2>
                
                <p className="text-slate-400 mb-4">
                  أجبت على {results.correct} من {results.total} سؤال بشكل صحيح
                </p>

                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>الوقت: {Math.floor(results.timeTaken / 60)}:{String(results.timeTaken % 60).padStart(2, '0')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>صحيح: {results.correct}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span>خطأ: {results.total - results.correct}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review Questions */}
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
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={q.difficulty === 'سهل' ? 'success' : q.difficulty === 'متوسط' ? 'warning' : 'danger'} className="text-xs">
                            {q.difficulty}
                          </Badge>
                          <span className="text-slate-400 text-sm">السؤال {i + 1}</span>
                        </div>
                        <p className="font-medium mb-3 whitespace-pre-line">{q.question}</p>
                        
                        <div className="text-sm space-y-1">
                          <p className="text-emerald-400">
                            ✓ الإجابة الصحيحة: {q.options[q.correct]}
                          </p>
                          {q.userAnswer !== undefined && q.userAnswer !== q.correct && (
                            <p className="text-red-400">
                              ✗ إجابتك: {q.options[q.userAnswer]}
                            </p>
                          )}
                        </div>
                        
                        <p className="text-slate-400 text-sm mt-3 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button variant="outline" onClick={restartTest} className="flex-1">
                <Sparkles className="w-4 h-4" />
                اختبار جديد
              </Button>
              <Button onClick={() => {
                setCurrentQuestion(0)
                setStep('test')
              }} className="flex-1">
                <Eye className="w-4 h-4" />
                إعادة المحاولة
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}