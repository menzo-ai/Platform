'use client'

import Link from 'next/link'
import { 
  Plus,
  Users,
  BookOpen,
  FileText,
  CreditCard,
  MessageSquare,
  UserPlus,
  Settings,
  BarChart3,
  Bell
} from 'lucide-react'

interface QuickAction {
  label: string
  href: string
  icon: any
  color: string
  description: string
}

interface QuickActionsProps {
  role: 'admin' | 'student'
}

export default function QuickActions({ role }: QuickActionsProps) {
  const adminActions: QuickAction[] = [
    { label: 'طالب جديد', href: '/admin/students?action=add', icon: UserPlus, color: 'emerald', description: 'إضافة طالب' },
    { label: 'كورس جديد', href: '/admin/courses?action=add', icon: Plus, color: 'blue', description: 'إنشاء كورس' },
    { label: 'امتحان', href: '/admin/exams?action=add', icon: FileText, color: 'purple', description: 'إنشاء اختبار' },
    { label: 'رسالة', href: '/admin/messages?action=send', icon: MessageSquare, color: 'amber', description: 'إرسال رسالة' },
  ]

  const studentActions: QuickAction[] = [
    { label: 'تصفح الكورسات', href: '/courses', icon: BookOpen, color: 'blue', description: 'استكشف الكورسات' },
    { label: 'الاختبارات', href: '/exams', icon: FileText, color: 'purple', description: 'اختبر معلوماتك' },
    { label: 'المحفظة', href: '/wallet', icon: CreditCard, color: 'emerald', description: 'إدارة رصيدك' },
    { label: 'الدعم', href: '/support', icon: Bell, color: 'amber', description: 'تواصل معانا' },
  ]

  const actions = role === 'admin' ? adminActions : studentActions

  const colorClasses: Record<string, { bg: string; icon: string; hover: string }> = {
    emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', hover: 'hover:bg-emerald-500/20' },
    blue: { bg: 'bg-blue-500/10', icon: 'text-blue-400', hover: 'hover:bg-blue-500/20' },
    purple: { bg: 'bg-purple-500/10', icon: 'text-purple-400', hover: 'hover:bg-purple-500/20' },
    amber: { bg: 'bg-amber-500/10', icon: 'text-amber-400', hover: 'hover:bg-amber-500/20' },
    red: { bg: 'bg-red-500/10', icon: 'text-red-400', hover: 'hover:bg-red-500/20' },
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action, index) => {
        const colors = colorClasses[action.color]
        return (
          <Link key={index} href={action.href}>
            <div className={`p-4 rounded-xl bg-slate-800/50 ${colors.hover} transition-all duration-200 hover:scale-[1.02] cursor-pointer group`}>
              <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className={`w-6 h-6 ${colors.icon}`} />
              </div>
              <h4 className="font-medium mb-1">{action.label}</h4>
              <p className="text-xs text-slate-400">{action.description}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}