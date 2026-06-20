'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  BookOpen,
  Video,
  GraduationCap,
  FileText,
  MessageSquare,
  Bell,
  User,
  CreditCard,
  Trophy,
  Settings,
  Users,
  BarChart3,
  Ticket,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Gift,
  FileBadge,
  Brain,
  Activity,
  Calendar,
  BarChart,
  Database,
  Settings2,
  Award,
  Home,
  Play,
} from 'lucide-react'
import { useState } from 'react'

interface SidebarProps {
  role: 'student' | 'admin'
}

const studentLinks = [
  { href: '/dashboard', label: 'الرئيسية', icon: Home },
  { href: '/courses', label: 'الدورات', icon: BookOpen },
  { href: '/exams', label: 'الاختبارات', icon: FileText },
  { href: '/assignments', label: 'الواجبات', icon: FileBadge },
  { href: '/study-plan', label: 'خطة الدراسة', icon: Calendar },
  { href: '/wallet', label: 'المحفظة', icon: Wallet },
  { href: '/forum', label: 'المنتدى', icon: MessageSquare },
  { href: '/ai-tutor', label: 'menzo-ai', icon: Brain },
  { href: '/leaderboard', label: 'التصنيف', icon: Trophy },
  { href: '/certificates', label: 'الشهادات', icon: Award },
  { href: '/achievements', label: 'الإنجازات', icon: Play },
  { href: '/messages', label: 'الرسائل', icon: MessageSquare },
  { href: '/notifications', label: 'الإشعارات', icon: Bell },
  { href: '/subscriptions', label: 'الاشتراكات', icon: CreditCard },
  { href: '/profile', label: 'الملف الشخصي', icon: User },
  { href: '/settings', label: 'الإعدادات', icon: Settings },
]

const adminLinks = [
  { href: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/admin/students', label: 'الطلاب', icon: Users },
  { href: '/admin/courses', label: 'الدورات', icon: BookOpen },
  { href: '/admin/lectures', label: 'المحاضرات', icon: Video },
  { href: '/admin/exams', label: 'الاختبارات', icon: FileText },
  { href: '/admin/homework', label: 'الواجبات', icon: FileBadge },
  { href: '/admin/grades', label: 'الدرجات', icon: BarChart },
  { href: '/admin/payments', label: 'الدفع', icon: CreditCard },
  { href: '/admin/wallet', label: 'المحفظة', icon: Wallet },
  { href: '/admin/coupons', label: 'الأكواد', icon: Gift },
  { href: '/admin/forum', label: 'المنتدى', icon: MessageSquare },
  { href: '/admin/tickets', label: 'التذاكر', icon: Ticket },
  { href: '/admin/messages', label: 'الرسائل', icon: MessageSquare },
  { href: '/admin/analytics', label: 'التحليلات', icon: BarChart3 },
  { href: '/admin/ai-settings', label: 'إعدادات AI', icon: Brain },
  { href: '/admin/activity-log', label: 'سجل النشاط', icon: Activity },
  { href: '/admin/data', label: 'البيانات', icon: Database },
  { href: '/admin/settings', label: 'الإعدادات', icon: Settings2 },
]

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const links = role === 'admin' ? adminLinks : studentLinks

  return (
    <aside
      className={cn(
        'fixed right-0 top-0 h-screen bg-surface-dark border-l border-slate-700/50 transition-all duration-300 z-30',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b border-slate-700/50">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <img src="/logo.svg" alt="GELVANO" className="w-8 h-8" />
            </div>
            {!collapsed && (
              <span className="text-xl font-bold text-gradient">GELVANO</span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  isActive ? 'sidebar-item-active' : 'sidebar-item',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? link.label : undefined}
              >
                <link.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Collapse Button */}
        <div className="p-4 border-t border-slate-700/50">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
          >
            {collapsed ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <>
                <ChevronRight className="w-5 h-5" />
                <span>طي</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  )
}
