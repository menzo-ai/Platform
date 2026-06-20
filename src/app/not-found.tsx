'use client'

import Link from 'next/link'
import Button from '@/components/ui/button'
import { Home, ArrowRight, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent mb-4">
            404
          </div>
          <div className="w-32 h-32 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Search className="w-16 h-16 text-slate-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">الصفحة غير موجودة</h1>
        <p className="text-slate-400 mb-8">
          عذراً! الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto">
              <Home className="w-4 h-4 ml-2" />
              العودة للرئيسية
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full sm:w-auto">
              لوحة التحكم
              <ArrowRight className="w-4 h-4 mr-2" />
            </Button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 p-4 bg-slate-800/50 rounded-xl">
          <p className="text-sm text-slate-400 mb-4">روابط سريعة:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/courses" className="text-primary hover:underline">الدورات</Link>
            <Link href="/ai-tutor" className="text-primary hover:underline">menzo-ai</Link>
            <Link href="/forum" className="text-primary hover:underline">المنتدى</Link>
            <Link href="/support" className="text-primary hover:underline">الدعم</Link>
          </div>
        </div>
      </div>
    </div>
  )
}