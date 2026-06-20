'use client'

import { useState } from 'react'
import Card, { CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Modal from '@/components/ui/modal'
import { 
  Award, 
  Download, 
  Share2, 
  ExternalLink,
  Calendar,
  BookOpen,
  CheckCircle,
  Eye,
  Filter
} from 'lucide-react'

interface Certificate {
  id: string
  title: string
  courseName: string
  issueDate: string
  expiryDate: string | null
  score: number
  status: 'valid' | 'expired' | 'pending'
  certificateId: string
}

const certificates: Certificate[] = [
  {
    id: '1',
    title: 'شهادة إتمام دورة',
    courseName: 'الفيزياء - الصف الأول الثانوي',
    issueDate: '2024-01-15',
    expiryDate: null,
    score: 95,
    status: 'valid',
    certificateId: 'CERT-2024-001'
  },
  {
    id: '2',
    title: 'شهادة إتمام دورة',
    courseName: 'الميكانيكا - الجزء الأول',
    issueDate: '2023-12-20',
    expiryDate: '2024-12-20',
    score: 88,
    status: 'valid',
    certificateId: 'CERT-2023-156'
  },
  {
    id: '3',
    title: 'شهادة إتمام دورة',
    courseName: 'الحرارة والديناميكا الحرارية',
    issueDate: '2023-11-10',
    expiryDate: '2023-11-10',
    score: 72,
    status: 'expired',
    certificateId: 'CERT-2023-089'
  }
]

export default function CertificatesPage() {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [filter, setFilter] = useState<string>('all')

  const filteredCerts = certificates.filter(cert => {
    if (filter === 'all') return true
    return cert.status === filter
  })

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleShare = (cert: Certificate) => {
    const shareUrl = `https://gelvano.com/verify/${cert.certificateId}`
    if (navigator.share) {
      navigator.share({
        title: cert.title,
        text: `شهادة ${cert.courseName} - نسبة النجاح ${cert.score}%`,
        url: shareUrl
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      alert('تم نسخ رابط الشهادة!')
    }
  }

  const getStatusBadge = (status: Certificate['status']) => {
    switch (status) {
      case 'valid':
        return <Badge variant="success">سارية</Badge>
      case 'expired':
        return <Badge variant="danger">منتهية</Badge>
      case 'pending':
        return <Badge variant="warning">قيد الانتظار</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <Award className="w-7 h-7 text-amber-400" />
            شهاداتي
          </h1>
          <p className="text-slate-400">عرض وتحميل شهادات إتمام الكورسات</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="p-4 text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-amber-400" />
            <p className="text-2xl font-bold">{certificates.length}</p>
            <p className="text-xs text-slate-400">إجمالي الشهادات</p>
          </Card>
          <Card className="p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
            <p className="text-2xl font-bold">{certificates.filter(c => c.status === 'valid').length}</p>
            <p className="text-xs text-slate-400">سارية</p>
          </Card>
          <Card className="p-4 text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <p className="text-2xl font-bold">
              {Math.round(certificates.reduce((acc, c) => acc + c.score, 0) / certificates.length)}%
            </p>
            <p className="text-xs text-slate-400">متوسط الدرجات</p>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4 mb-6">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input py-2 text-sm w-auto"
          >
            <option value="all">الكل</option>
            <option value="valid">سارية</option>
            <option value="expired">منتهية</option>
          </select>
        </div>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredCerts.map(cert => (
            <Card key={cert.id} className="overflow-hidden">
              {/* Certificate Preview */}
              <div 
                className="aspect-[1.4/1] bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-primary/20 relative cursor-pointer"
                onClick={() => { setSelectedCert(cert); setShowPreview(true); }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-3">
                    <Award className="w-8 h-8 text-amber-400" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{cert.title}</h3>
                  <p className="text-sm text-slate-400">{cert.courseName}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <Badge variant="primary">{cert.score}%</Badge>
                    {getStatusBadge(cert.status)}
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  <Badge variant="info" className="text-xs">
                    {cert.certificateId}
                  </Badge>
                </div>
              </div>

              {/* Info */}
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="w-4 h-4" />
                    {formatDate(cert.issueDate)}
                  </div>
                  {getStatusBadge(cert.status)}
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => { setSelectedCert(cert); setShowPreview(true); }}
                  >
                    <Eye className="w-4 h-4" />
                    عرض
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleShare(cert)}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    disabled={cert.status !== 'valid'}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCerts.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>لا توجد شهادات</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <Modal 
        isOpen={showPreview} 
        onClose={() => setShowPreview(false)} 
        title="معاينة الشهادة"
        size="xl"
      >
        {selectedCert && (
          <div className="space-y-4">
            <div className="aspect-[1.4/1] bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-primary/20 rounded-xl p-8 text-center relative overflow-hidden">
              {/* Decorative Border */}
              <div className="absolute inset-2 border-2 border-amber-400/30 rounded-lg" />
              <div className="absolute inset-4 border border-amber-400/20 rounded-md" />
              
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <Award className="w-20 h-20 text-amber-400 mb-4" />
                <h2 className="text-2xl font-bold mb-2">GELVANO</h2>
                <p className="text-slate-400 mb-6">منصة تعليم الفيزياء</p>
                
                <h3 className="text-xl font-bold mb-4">شهادة إتمام</h3>
                <p className="text-slate-300 mb-4">تُمنح هذه الشهادة لـ</p>
                <p className="text-2xl font-bold text-primary mb-4">اسم الطالب</p>
                <p className="text-slate-300 mb-2">بعد إتمام دورة</p>
                <p className="text-xl font-bold mb-6">{selectedCert.courseName}</p>
                
                <div className="flex items-center gap-8 mb-6">
                  <div>
                    <p className="text-sm text-slate-400">نسبة النجاح</p>
                    <p className="text-2xl font-bold text-emerald-400">{selectedCert.score}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">تاريخ الإصدار</p>
                    <p className="font-medium">{formatDate(selectedCert.issueDate)}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-500">{selectedCert.certificateId}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowPreview(false)}>
                إغلاق
              </Button>
              <Button className="flex-1" disabled={selectedCert.status !== 'valid'}>
                <Download className="w-4 h-4" />
                تحميل PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}