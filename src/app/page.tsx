'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, BookOpen, FileText, Video, Users, Brain, ChevronLeft, Play, CheckCircle, Youtube, Facebook, MessageCircle, Star, Trophy, Zap, Shield, Headphones, Award } from 'lucide-react'
import Button from '@/components/ui/button'

export default function HomePage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleStartLearning = () => {
    if (isLoggedIn) {
      router.push('/dashboard')
    } else {
      router.push('/register')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gradient">GELVANO</span>
              <p className="text-xs text-slate-400 -mt-1">Physics Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Social Links */}
            <div className="hidden md:flex items-center gap-2 mr-4">
              <a href="https://www.youtube.com/@Gelvano_ph12" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/people/Mr-khaled-osama/100064048811580/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://wa.me/message/NI47K5DKEZUIE1" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
            
            {isLoggedIn ? (
              <Button onClick={() => router.push('/dashboard')} size="sm">
                لوحة التحكم
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">تسجيل الدخول</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">سجل الآن</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                منصة جلفانو للفيزياء والعلوم المتكاملة
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                كل مشاكلك في الفيزياء
                <br />
                <span className="text-gradient">محلولة مع جلفانو!</span>
              </h1>

              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                منصة جلفانو في الفيزياء والعلوم المتكاملة بتوفر لك أقوي شرح وحل ومراجعة 
                وأهم الملفات اللي هتلاقي فيها كل الملخصات والأسئلة اللي هتخليك قد أي سؤال يا بطل!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" onClick={handleStartLearning} className="gap-2 shadow-lg shadow-primary/20">
                  <Play className="w-5 h-5" />
                  ابدأ المذاكرة
                </Button>
                <Link href="/exams">
                  <Button variant="outline" size="lg" className="gap-2">
                    <FileText className="w-5 h-5" />
                    امتحانات أونلاين
                  </Button>
                </Link>
              </div>

              {/* Instructor Badge */}
              <div className="inline-flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                  م
                </div>
                <div>
                  <p className="font-bold">MR/Khaled Osama</p>
                  <p className="text-sm text-slate-400">Physics Teacher</p>
                </div>
                <div className="flex items-center gap-1 text-amber-400 mr-4">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
              </div>
            </div>

            {/* Right Image/Illustration */}
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-3xl" />
                <div className="absolute inset-8 bg-slate-800/50 rounded-full flex items-center justify-center border border-slate-700">
                  <div className="text-center">
                    <GraduationCap className="w-24 h-24 text-primary mx-auto mb-4" />
                    <p className="text-2xl font-bold">Physics Academy</p>
                    <p className="text-slate-400">Learn, Practice, Succeed</p>
                  </div>
                </div>
                
                {/* Floating badges */}
                <div className="absolute top-10 right-10 bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-700 animate-bounce">
                  <Brain className="w-8 h-8 text-purple-400" />
                </div>
                <div className="absolute bottom-20 left-0 bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-700 animate-bounce" style={{ animationDelay: '0.5s' }}>
                  <Trophy className="w-8 h-8 text-amber-400" />
                </div>
                <div className="absolute top-1/2 right-0 bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-700 animate-bounce" style={{ animationDelay: '1s' }}>
                  <Zap className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20 px-6 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">ما نقدمه لك</h2>
            <p className="text-slate-400">كل اللي تحتاجه للنجاح في الفيزياء</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, title: 'شرح تفصيلي', desc: 'شرح مبسط ومفصل لجميع دروس الفيزياء والعلوم المتكاملة' },
              { icon: FileText, title: 'ملخصات شاملة', desc: 'ملخصات مركزة تغطي أهم النقاط الهامة الواردة في الأسئلة' },
              { icon: Video, title: 'فيديوهات تعليمية', desc: 'شرح مرئي لجميع الدروس بأعلي جودة واستفادة عالية' },
              { icon: Award, title: 'تمارين واختبارات', desc: 'مجموعة متنوعة من التمارين والاختبارات التفاعلية التي تؤهلك للاختبار النهائي' },
            ].map((item, index) => (
              <div key={index} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-primary/30 transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grades/Courses Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">اختر مستواك</h2>
            <p className="text-slate-400">دورات مخصصة لكل صف دراسي</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { grade: 1, title: 'الصف الأول الثانوي', chapters: 8, lectures: 45, color: 'from-blue-500 to-cyan-500' },
              { grade: 2, title: 'الصف الثاني الثانوي', chapters: 10, lectures: 60, color: 'from-purple-500 to-pink-500' },
              { grade: 3, title: 'الصف الثالث الثانوي', chapters: 12, lectures: 75, color: 'from-amber-500 to-orange-500' },
            ].map((grade) => (
              <div key={grade.grade} className="group relative overflow-hidden rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-primary/30 transition-all">
                <div className={`absolute inset-0 bg-gradient-to-br ${grade.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-slate-700 text-sm font-medium">
                      الصف {grade.grade}
                    </span>
                    <BookOpen className="w-6 h-6 text-slate-500 group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{grade.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">الفيزياء التطبيقية والمتقدمة</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {grade.chapters} فصل
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="w-4 h-4" />
                      {grade.lectures} محاضرة
                    </span>
                  </div>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:border-primary transition-all">
                    ابدأ الآن
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 text-sm mb-4">
                <Brain className="w-5 h-5" />
                ذكاء اصطناعي
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">助教 - مساعدك الذكي</h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                مساعد ذكي يعمل علي مدار الساعة للإجابة على أسئلتك في الفيزياء. 
                اسأل أي سؤال واحصل على إجابة فورية مع شرح مفصل.
              </p>
              <ul className="space-y-3 mb-6">
                {['إجابات فورية 24/7', 'شرح مفصل خطوة بخطوة', 'أسئلة متابعة ذكية', 'متاح في أي وقت'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/ai-tutor">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-purple-500 to-blue-500">
                  <Brain className="w-5 h-5" />
                  جرّب مساعد الذكاء الاصطناعي
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold">menzo-ai</p>
                    <p className="text-xs text-slate-400">مساعد الذكاء الاصطناعي</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-slate-700/50 p-3 rounded-xl rounded-tl-none">
                    <p className="text-sm">ما هو قانون نيوتن الثاني؟</p>
                  </div>
                  <div className="bg-primary/20 p-3 rounded-xl rounded-tr-none">
                    <p className="text-sm">قانون نيوتن الثاني ينص على أن القوة المؤثرة على جسم تساوي حاصل ضرب كتلته في تسارعه...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media & Quick Links */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">تابعنا</h2>
            <p className="text-slate-400">تابع صفحاتنا على السوشيال ميديا عشان يوصلك كل جديد</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <a href="https://www.youtube.com/@Gelvano_ph12" target="_blank" rel="noopener noreferrer" 
               className="flex items-center gap-3 px-6 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all">
              <Youtube className="w-6 h-6" />
              <span>YouTube</span>
            </a>
            <a href="https://www.facebook.com/people/Mr-khaled-osama/100064048811580/" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-3 px-6 py-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all">
              <Facebook className="w-6 h-6" />
              <span>Facebook</span>
            </a>
            <a href="https://wa.me/message/NI47K5DKEZUIE1" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-3 px-6 py-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-all">
              <MessageCircle className="w-6 h-6" />
              <span>WhatsApp</span>
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/exams">
              <Button variant="outline" size="lg" className="gap-2">
                <FileText className="w-5 h-5" />
                امتحانات أونلاين
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" size="lg" className="gap-2">
                <BookOpen className="w-5 h-5" />
                ابدأ مذاكرة
              </Button>
            </Link>
            <a href="https://wa.me/message/NI47K5DKEZUIE1" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500">
                <MessageCircle className="w-5 h-5" />
                تواصل مع تيم GELVANO
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-gradient">GELVANO</span>
                  <p className="text-xs text-slate-400">Physics Platform</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                منصة تعليمية متكاملة للفيزياء والعلوم للمرحلة الثانوية
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">روابط سريعة</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <Link href="/courses" className="block hover:text-primary transition-colors">الدورات</Link>
                <Link href="/exams" className="block hover:text-primary transition-colors">الامتحانات</Link>
                <Link href="/ai-tutor" className="block hover:text-primary transition-colors">مساعد AI</Link>
                <Link href="/contact" className="block hover:text-primary transition-colors">تواصل معنا</Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">تواصل معنا</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <p>moha147wa@gmail.com</p>
                <p>01003092656</p>
                <div className="flex items-center gap-2 mt-3">
                  <a href="https://www.youtube.com/@Gelvano_ph12" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700">
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a href="https://www.facebook.com/people/Mr-khaled-osama/100064048811580/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="https://wa.me/message/NI47K5DKEZUIE1" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700">
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
              Developed by Mohamed El-Manzalawy
            </p>
            <p className="text-slate-500 text-xs">
              Instructor: Mr. Khaled Osama
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
