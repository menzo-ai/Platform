'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

export default function Breadcrumbs(props: { customItems?: BreadcrumbItem[] }) {
  const { customItems } = props
  const pathname = usePathname()

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) return customItems

    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'الرئيسية', href: '/' }
    ]

    let currentPath = ''
    paths.forEach((path, index) => {
      currentPath += `/${path}`
      const label = formatLabel(path)
      
      if (index === paths.length - 1) {
        breadcrumbs.push({ label })
      } else {
        breadcrumbs.push({ label, href: currentPath })
      }
    })

    return breadcrumbs
  }

  const formatLabel = (path: string): string => {
    const labels: Record<string, string> = {
      'dashboard': 'لوحة التحكم',
      'admin': 'الأدمن',
      'courses': 'الدورات',
      'students': 'الطلاب',
      'exams': 'الاختبارات',
      'homework': 'الواجبات',
      'grades': 'الدرجات',
      'wallet': 'المحفظة',
      'payments': 'الدفع',
      'coupons': 'الأكواد',
      'forum': 'المنتدى',
      'tickets': 'التذاكر',
      'analytics': 'التحليلات',
      'settings': 'الإعدادات',
      'profile': 'الملف الشخصي',
      'ai-tutor': 'menzo-ai',
      'leaderboard': 'التصنيف',
      'certificates': 'الشهادات',
      'achievements': 'الإنجازات',
      'messages': 'الرسائل',
      'notifications': 'الإشعارات',
      'subscriptions': 'الاشتراكات',
      'assignments': 'الواجبات',
      'study-plan': 'خطة الدراسة',
      'support': 'الدعم',
      'contact': 'تواصل معنا',
    }

    if (labels[path]) return labels[path]
    if (path.startsWith('[') || /^\d+$/.test(path)) return 'تفاصيل'
    return path
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="w-4 h-4 text-slate-600" />}
          {item.href ? (
            <Link href={item.href} className="hover:text-primary transition-colors flex items-center gap-1">
              {index === 0 && <Home className="w-4 h-4" />}
              {item.label}
            </Link>
          ) : (
            <span className="text-white font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
