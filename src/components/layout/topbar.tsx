'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import ThemeToggle from '@/components/ThemeToggle'
import { Bell, Search, LogOut, User, Settings } from 'lucide-react'

interface TopBarProps {
  title?: string
}

export default function TopBar({ title }: TopBarProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-20 bg-background-dark/80 backdrop-blur-xl border-b border-slate-700/50">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold">{title || 'لوحة التحكم'}</h1>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="بحث..."
              className="w-64 pl-4 pr-10 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-sm placeholder:text-slate-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <button className="relative p-2 rounded-lg hover:bg-slate-700/50 transition-colors">
            <Bell className="w-5 h-5 text-slate-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <ThemeToggle className="scale-90" />

          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                {(session?.user as any)?.name?.charAt(0) || 'U'}
              </div>
            </button>

            {showDropdown && (
              <div className="absolute left-0 top-full mt-2 w-48 bg-surface-dark border border-slate-700 rounded-xl shadow-xl overflow-hidden">
                <div className="p-3 border-b border-slate-700">
                  <p className="font-medium text-sm">{(session?.user as any)?.name || 'مستخدم'}</p>
                </div>
                <div className="p-2">
                  <Link href="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700/50 text-sm">
                    <User className="w-4 h-4" /> الملف الشخصي
                  </Link>
                  <Link href="/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700/50 text-sm">
                    <Settings className="w-4 h-4" /> الإعدادات
                  </Link>
                </div>
                <div className="p-2 border-t border-slate-700">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 text-sm w-full"
                  >
                    <LogOut className="w-4 h-4" /> تسجيل الخروج
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
