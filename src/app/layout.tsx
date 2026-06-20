import type { Metadata } from 'next'
import { Cairo, Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'GELVANO - منصة تعليم الفيزياء',
  description: 'منصة تعليمية متميزة لدراسة الفيزياء للمرحلة الثانوية - الصف الأول والثاني والثالث الثانوي',
  keywords: ['تعليم', 'فيزياء', 'ثانوية', 'مصر', 'دورات', 'فيديو'],
  authors: [{ name: 'GELVANO Team' }],
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} ${inter.variable} font-cairo`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
