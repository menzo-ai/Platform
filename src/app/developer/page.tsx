'use client'

import Card, { CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import { 
  Code,
  Mail,
  Phone,
  Rocket,
  Heart,
  Star,
  Monitor,
  Database,
  Shield,
  Zap,
  Users,
  GraduationCap
} from 'lucide-react'

const skills = [
  { name: 'Next.js', level: 95, color: 'from-white to-gray-300' },
  { name: 'React', level: 90, color: 'from-blue-400 to-blue-600' },
  { name: 'TypeScript', level: 85, color: 'from-blue-300 to-blue-500' },
  { name: 'Tailwind CSS', level: 92, color: 'from-cyan-400 to-cyan-600' },
  { name: 'Node.js', level: 80, color: 'from-green-400 to-green-600' },
  { name: 'PostgreSQL', level: 75, color: 'from-blue-500 to-indigo-600' },
  { name: 'Supabase', level: 88, color: 'from-emerald-400 to-emerald-600' },
  { name: 'Prisma', level: 82, color: 'from-purple-400 to-purple-600' },
]

const technologies = [
  { name: 'Next.js 14', icon: Monitor },
  { name: 'TypeScript', icon: Code },
  { name: 'Tailwind CSS', icon: Star },
  { name: 'Supabase', icon: Database },
  { name: 'Prisma ORM', icon: Database },
  { name: 'NextAuth', icon: Shield },
]

const features = [
  { icon: Users, title: 'نظام متعدد المستخدمين', desc: 'طلاب، أدمن، سوبر أدمن مع صلاحيات مختلفة' },
  { icon: GraduationCap, title: 'منهج مصري كامل', desc: 'الصف الأول والثاني والثالث الثانوي - عام وأزهر' },
  { icon: Zap, title: 'فيديوهات محمية', desc: 'مشغل فيديو آمن بدون علامات YouTube' },
  { icon: Shield, title: 'أمان متقدم', desc: 'JWT، Rate Limiting، RBAC' },
  { icon: Database, title: 'قاعدة بيانات قوية', desc: 'Supabase + PostgreSQL' },
  { icon: Rocket, title: 'قابل للتوسع', desc: 'SaaS Architecture' },
]

export default function DeveloperPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary mb-6">
              <Code className="w-4 h-4" />
              <span className="text-sm font-medium">Full Stack Developer</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="text-gradient">Mohamed El-Manzalawy</span>
            </h1>
            
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              مطور Full Stack متخصص في بناء منصات تعليمية احترافية
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg">
                <Mail className="w-5 h-5" />
                moha147wa@gmail.com
              </Button>
              <Button variant="outline" size="lg">
                <Phone className="w-5 h-5" />
                01003092656
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">GELVANO Learning Platform</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            منصة تعليمية متكاملة لمنهج الفيزياء المصري للصفوف الثانوية
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="hover:scale-105 transition-transform">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <Code className="w-6 h-6 text-primary" />
          المهارات التقنية
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {skills.map((skill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{skill.name}</span>
                <span className="text-sm text-slate-400">{skill.level}%</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000`}
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <Rocket className="w-6 h-6 text-primary" />
          التقنيات المستخدمة
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {technologies.map((tech, index) => (
            <Card key={index} className="hover:scale-105 transition-transform cursor-pointer">
              <CardContent className="p-4 text-center">
                <tech.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">{tech.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <Star className="w-6 h-6 text-primary" />
          سجل التحديثات
        </h2>

        <div className="space-y-4">
          {[
            { version: 'v1.0.0', date: 'يناير 2024', features: ['نظام المستخدمين الكامل', 'المحاضرات والفيديوهات', 'نظام الاشتراكات'] },
            { version: 'v1.1.0', date: 'فبراير 2024', features: ['نظام XP والإنجازات', 'لوحة المتصدرين', 'الذكاء الاصطناعي'] },
            { version: 'v1.2.0', date: 'مارس 2024', features: ['التحليلات المتقدمة', 'نظام الإشعارات', 'تطوير الواجهة'] },
          ].map((release, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="primary">{release.version}</Badge>
                    <span className="text-sm text-slate-400">{release.date}</span>
                  </div>
                </div>
                <ul className="space-y-1">
                  {release.features.map((feature, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 pb-20">
        <Card className="bg-gradient-to-r from-primary/20 to-accent/20">
          <CardContent className="p-8 text-center">
            <Heart className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">صُنع بـ ❤️</h3>
            <p className="text-slate-400 mb-4">
              جميع الحقوق محفوظة © 2024 GELVANO Education Platform
            </p>
            <p className="text-sm text-slate-500">
              Developed by Mohamed El-Manzalawy
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}