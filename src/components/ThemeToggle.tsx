'use client'

import { useTheme } from '@/app/providers'
import { Moon, Sun, Monitor } from 'lucide-react'

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme, toggleTheme } = useTheme()

  const options = [
    { value: 'light' as const, icon: Sun, label: 'فاتح' },
    { value: 'dark' as const, icon: Moon, label: 'داكن' },
    { value: 'system' as const, icon: Monitor, label: 'تلقائي' },
  ]

  return (
    <div className={`flex items-center gap-1 bg-slate-800 rounded-lg p-1 ${className}`}>
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            theme === value
              ? 'bg-primary text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
          title={label}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  )
}