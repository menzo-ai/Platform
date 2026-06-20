'use client'

import { useState } from 'react'
import Card, { CardContent } from '@/components/ui/card'
import Badge from '@/components/ui/badge'
import Button from '@/components/ui/button'
import { 
  Brain,
  Zap,
  Target,
  CheckCircle,
  XCircle,
  Trophy,
  ChevronRight,
  RefreshCw
} from 'lucide-react'

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const dailyQuiz: Question[] = [
  {
    id: '1',
    question: 'ما هو قانون نيوتن الثاني للحركة؟',
    options: [
      'F = ma (القوة = الكتلة × التسارع)',
      'F = mv (القوة = الكتلة × السرعة)',
      'F = m/a (القوة = الكتلة ÷ التسارع)',
      'F = m + a (القوة = الكتلة + التسارع)'
    ],
    correctAnswer: 0,
    explanation: 'قانون نيوتن الثاني ينص على أن القوة المؤثرة على جسم تساوي حاصل ضرب كتلته في تسارعه: F = ma'
  },
  {
    id: '2',
    question: 'وحدة قياس القوة في النظام الدولي هي؟',
    options: [
      'الجول (Joule)',
      'النيوتن (Newton)',
      'الوات (Watt)',
      'الباسكال (Pascal)'
    ],
    correctAnswer: 1,
    explanation: 'النيوتن هو وحدة قياس القوة في النظام الدولي للوحدات'
  },
  {
    id: '3',
    question: 'ما هو التسارع الأرضي تقريباً؟',
    options: [
      '5.8 m/s²',
      '9.8 m/s²',
      '10.2 m/s²',
      '8.5 m/s²'
    ],
    correctAnswer: 1,
    explanation: 'التسارع الأرضي يساوي تقريباً 9.8 م/ث² عند سطح الأرض'
  }
]

export default function DailyQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const question = dailyQuiz[currentQuestion]
  const progress = ((currentQuestion + 1) / dailyQuiz.length) * 100

  const handleAnswer = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
    setShowResult(true)
    if (index === question.correctAnswer) {
      setScore(prev => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < dailyQuiz.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setQuizCompleted(false)
  }

  const getOptionClass = (index: number) => {
    if (!showResult) {
      return selectedAnswer === index 
        ? 'bg-primary/20 border-primary' 
        : 'bg-slate-800/50 border-slate-700 hover:border-primary/50'
    }
    if (index === question.correctAnswer) {
      return 'bg-emerald-500/20 border-emerald-500'
    }
    if (selectedAnswer === index && index !== question.correctAnswer) {
      return 'bg-red-500/20 border-red-500'
    }
    return 'bg-slate-800/50 border-slate-700 opacity-50'
  }

  if (quizCompleted) {
    const percentage = Math.round((score / dailyQuiz.length) * 100)
    const xpEarned = score * 10
    
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">أحسنت!</h2>
            <p className="text-slate-400 mb-6">لقد أكملت الاختبار اليومي</p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <p className="text-3xl font-bold text-primary">{percentage}%</p>
                <p className="text-sm text-slate-400">النتيجة</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <p className="text-3xl font-bold text-emerald-400">{score}/{dailyQuiz.length}</p>
                <p className="text-sm text-slate-400">إجابات صحيحة</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <p className="text-3xl font-bold text-purple-400">+{xpEarned}</p>
                <p className="text-sm text-slate-400">XP</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={handleRestart} className="gap-2">
                <RefreshCw className="w-5 h-5" />
                حاول مرة أخرى
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <Brain className="w-7 h-7 text-purple-400" />
            الاختبار اليومي
          </h1>
          <p className="text-slate-400">اختبر معلوماتك كل يوم</p>
        </div>
        <Badge variant="primary" className="gap-1">
          <Zap className="w-4 h-4" />
          {score * 10} XP
        </Badge>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">
              السؤال {currentQuestion + 1} من {dailyQuiz.length}
            </span>
            <span className="text-sm text-slate-400">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="info">
              <Target className="w-4 h-4" />
              سؤال {currentQuestion + 1}
            </Badge>
          </div>
          <h3 className="text-xl font-bold mb-6">{question.question}</h3>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                className={`w-full p-4 rounded-xl border transition-all text-right ${getOptionClass(index)}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    showResult && index === question.correctAnswer
                      ? 'bg-emerald-500 text-white'
                      : showResult && selectedAnswer === index && index !== question.correctAnswer
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-700'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {showResult && index === question.correctAnswer && (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  )}
                  {showResult && selectedAnswer === index && index !== question.correctAnswer && (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {showResult && (
            <div className={`mt-6 p-4 rounded-xl ${
              selectedAnswer === question.correctAnswer 
                ? 'bg-emerald-500/10 border border-emerald-500/20'
                : 'bg-amber-500/10 border border-amber-500/20'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {selectedAnswer === question.correctAnswer ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-emerald-400">إجابة صحيحة!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-amber-400">إجابة خاطئة</span>
                  </>
                )}
              </div>
              <p className="text-slate-300 text-sm">{question.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {showResult && (
        <Button onClick={handleNext} className="w-full gap-2">
          {currentQuestion < dailyQuiz.length - 1 ? (
            <>
              السؤال التالي
              <ChevronRight className="w-5 h-5" />
            </>
          ) : (
            <>
              عرض النتيجة
              <Trophy className="w-5 h-5" />
            </>
          )}
        </Button>
      )}
    </div>
  )
}
