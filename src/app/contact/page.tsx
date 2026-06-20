'use client'

import { useState } from 'react'
import Card, { CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import Badge from '@/components/ui/badge'
import { 
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  User,
  GraduationCap,
  Heart,
  Star,
  Zap,
  CheckCircle,
} from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setSubmitted(true)
    setSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-background-dark">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/20 via-background-dark to-accent/20 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">تواصل معنا</h1>
          <p className="text-xl text-slate-400 mb-6">
            نحن هنا لمساعدتك! تواصل معنا في أي وقت
          </p>
          <Badge variant="primary" className="text-sm px-4 py-2">
            <Zap className="w-4 h-4 ml-2" />
            رد سريع خلال 24 ساعة
          </Badge>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  معلومات التواصل
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">البريد الإلكتروني</p>
                      <a href="mailto:moha147wa@gmail.com" className="font-medium hover:text-primary transition-colors">
                        moha147wa@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">رقم الهاتف</p>
                      <a href="tel:+201003092656" className="font-medium hover:text-primary transition-colors">
                        01003092656
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">ساعات العمل</p>
                      <p className="font-medium">السبت - الخميس: 9 ص - 10 م</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">العنوان</p>
                      <p className="font-medium">زهراء مدينه نصر، القاهرة، مصر</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Developer Info */}
            <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">👨‍💻</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">المطور</h3>
                  <p className="text-2xl font-bold text-primary mb-2">Mohamed El-Manzalawy</p>
                  <p className="text-slate-400 text-sm mb-4">مطور منصة GELVANO</p>
                  
                  <div className="flex justify-center gap-3">
                    <a href="mailto:moha147wa@gmail.com" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                      <Mail className="w-5 h-5" />
                    </a>
                    <a href="tel:+201003092656" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                      <Phone className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">روابط سريعة</h3>
                <div className="space-y-2">
                  <a href="/support" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <span>فتح تذكرة دعم</span>
                  </a>
                  <a href="/courses" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                    <GraduationCap className="w-5 h-5 text-emerald-400" />
                    <span>تصفح الكورسات</span>
                  </a>
                  <a href="/ai-tutor" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                    <Star className="w-5 h-5 text-amber-400" />
                    <span>menzo-ai للمساعدة</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-8">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">تم إرسال رسالتك!</h2>
                    <p className="text-slate-400 mb-6">
                      شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.
                    </p>
                    <Button onClick={() => setSubmitted(false)}>
                      إرسال رسالة أخرى
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-6">أرسل لنا رسالة</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">الاسم</label>
                          <div className="relative">
                            <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              placeholder="أدخل اسمك"
                              className="input pr-10 w-full"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                          <div className="relative">
                            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              placeholder="example@email.com"
                              className="input pr-10 w-full"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">رقم الهاتف (اختياري)</label>
                          <div className="relative">
                            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="01012345678"
                              className="input pr-10 w-full"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">الموضوع</label>
                          <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="input w-full"
                          >
                            <option value="">اختر الموضوع</option>
                            <option value="general">استفسار عام</option>
                            <option value="subscription">مشكلة في الاشتراك</option>
                            <option value="payment">مشكلة في الدفع</option>
                            <option value="course">مشكلة في الكورس</option>
                            <option value="technical">مشكلة تقنية</option>
                            <option value="suggestion">اقتراح</option>
                            <option value="partnership">شراكة</option>
                            <option value="other">أخرى</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">الرسالة</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          placeholder="اكتب رسالتك هنا..."
                          rows={6}
                          className="input w-full resize-none"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full" 
                        size="lg"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <span className="flex items-center gap-2">
                            <span className="animate-spin">⏳</span>
                            جاري الإرسال...
                          </span>
                        ) : (
                          <>
                            <Send className="w-4 h-4 ml-2" />
                            إرسال الرسالة
                          </>
                        )}
                      </Button>
                    </form>

                    <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                      <p className="text-sm text-slate-400 text-center">
                        نحن هنا لمساعدتك! 平均 response time: 2-4 ساعات
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card className="mt-8">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  أسئلة شائعة
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <h4 className="font-medium mb-2">كيف أشترك في كورس؟</h4>
                    <p className="text-sm text-slate-400">
                      يمكنك الاشتراك من صفحة الكورس، ثم اختيار طريقة الدفع المناسبة (محفظة/Paymob/Fawry).
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <h4 className="font-medium mb-2">كيف أشحن محفظتي؟</h4>
                    <p className="text-sm text-slate-400">
                      تواصل معنا عبر واتساب أو زورنا في السنتر لدفع المبلغ نقداً.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <h4 className="font-medium mb-2">هل يوجد استرداد؟</h4>
                    <p className="text-sm text-slate-400">
                      نعم، يمكنك طلب استرداد خلال 7 أيام من الاشتراك في حالة عدم الرضا.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}