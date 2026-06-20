'use client'

import { useState } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import { 
  Settings,
  Save,
  Upload,
  Image,
  User,
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Store,
  Palette,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Wallet,
  Ticket
} from 'lucide-react'

export default function PlatformSettingsPage() {
  // Platform Info
  const [platformName, setPlatformName] = useState('GELVANO')
  const [platformLogo, setPlatformLogo] = useState<string | null>(null)
  const [heroTitle, setHeroTitle] = useState('منصتك الأولى لتعلم الفيزياء')
  const [heroSubtitle, setHeroSubtitle] = useState('بأسلوب بسيط وممتع')
  const [heroImage, setHeroImage] = useState<string | null>(null)
  const [aboutText, setAboutText] = useState('منصة تعليمية متخصصة في الفيزياء للمرحلة الثانوية')

  // Teacher Info
  const [teacherName, setTeacherName] = useState('م. خالد أسامة')
  const [teacherAvatar, setTeacherAvatar] = useState<string | null>(null)
  const [teacherBio, setTeacherBio] = useState('مدرس فيزياء متخصص للمرحلة الثانوية')

  // Contact Info
  const [supportPhone, setSupportPhone] = useState('+20 1xx xxx xxxx')
  const [supportEmail, setSupportEmail] = useState('support@example.com')

  // Social Links
  const [facebookLink, setFacebookLink] = useState('')
  const [instagramLink, setInstagramLink] = useState('')
  const [tiktokLink, setTiktokLink] = useState('')
  const [youtubeLink, setYoutubeLink] = useState('')

  // Feature Toggles
  const [isWalletEnabled, setIsWalletEnabled] = useState(true)
  const [isCodesEnabled, setIsCodesEnabled] = useState(true)

  // States
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPlatformLogo(url)
    }
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setTeacherAvatar(url)
    }
  }

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setHeroImage(url)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <Store className="w-7 h-7 text-primary" />
            إعدادات المنصة
          </h1>
          <p className="text-slate-400">إدارة معلومات المنصة للبيع لمعلمين متعددين</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <span className="animate-spin">⏳</span>
          ) : saved ? (
            <>
              <CheckCircle className="w-4 h-4" />
              تم الحفظ!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              حفظ التغييرات
            </>
          )}
        </Button>
      </div>

      {/* Platform Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Store className="w-5 h-5 text-primary" />
            <h3 className="font-bold">معلومات المنصة</h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">اسم المنصة</label>
              <Input 
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                placeholder="اسم المنصة"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">لوجو المنصة</label>
              <div className="flex items-center gap-4">
                {platformLogo ? (
                  <div className="relative">
                    <img src={platformLogo} alt="Logo" className="w-16 h-16 rounded-lg object-cover" />
                    <button 
                      onClick={() => setPlatformLogo(null)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-slate-800 flex items-center justify-center">
                    <Store className="w-8 h-8 text-slate-600" />
                  </div>
                )}
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">رفع لوجو</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">عنوان الصفحة الرئيسية</label>
              <Input 
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="عنوان المنصة"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">العنوان الفرعي</label>
              <Input 
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="العنوان الفرعي"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">صورة البطاقة الرئيسية</label>
            <div className="flex items-center gap-4">
              {heroImage ? (
                <div className="relative">
                  <img src={heroImage} alt="Hero" className="w-32 h-20 rounded-lg object-cover" />
                  <button 
                    onClick={() => setHeroImage(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="w-32 h-20 rounded-lg bg-slate-800 flex items-center justify-center border-2 border-dashed border-slate-600">
                  <Image className="w-8 h-8 text-slate-600" />
                </div>
              )}
              <label className="cursor-pointer">
                <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="hidden" />
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">رفع صورة</span>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">وصف المنصة</label>
            <Textarea 
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              rows={3}
              placeholder="وصف المنصة..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Teacher Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold">معلومات المعلم</h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">اسم المعلم</label>
              <Input 
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="اسم المعلم"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">الصورة الشخصية</label>
              <div className="flex items-center gap-4">
                {teacherAvatar ? (
                  <div className="relative">
                    <img src={teacherAvatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
                    <button 
                      onClick={() => setTeacherAvatar(null)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
                    <User className="w-8 h-8 text-slate-600" />
                  </div>
                )}
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">رفع صورة</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">نبذة عن المعلم</label>
            <Textarea 
              value={teacherBio}
              onChange={(e) => setTeacherBio(e.target.value)}
              rows={3}
              placeholder="نبذة عن المعلم..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold">معلومات التواصل</h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                رقم الهاتف
              </label>
              <Input 
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                placeholder="رقم الهاتف"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                البريد الإلكتروني
              </label>
              <Input 
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold">روابط السوشيال ميديا</h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Facebook className="w-4 h-4 text-blue-500" />
                رابط فيسبوك
              </label>
              <Input 
                value={facebookLink}
                onChange={(e) => setFacebookLink(e.target.value)}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-500" />
                رابط انستجرام
              </label>
              <Input 
                value={instagramLink}
                onChange={(e) => setInstagramLink(e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                رابط تيك توك
              </label>
              <Input 
                value={tiktokLink}
                onChange={(e) => setTiktokLink(e.target.value)}
                placeholder="https://tiktok.com/@..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-500" />
                رابط يوتيوب
              </label>
              <Input 
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold">تفعيل الأنظمة</h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
            <div className="flex items-center gap-3">
              <Wallet className="w-6 h-6 text-emerald-400" />
              <div>
                <p className="font-medium">نظام المحفظة</p>
                <p className="text-sm text-slate-400">تفعيل الدفع من خلال المحفظة للطلاب</p>
              </div>
            </div>
            <button
              onClick={() => setIsWalletEnabled(!isWalletEnabled)}
              className={`p-2 rounded-lg transition-all ${
                isWalletEnabled 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              {isWalletEnabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
            <div className="flex items-center gap-3">
              <Ticket className="w-6 h-6 text-amber-400" />
              <div>
                <p className="font-medium">نظام الأكواد</p>
                <p className="text-sm text-slate-400">تفعيل الدفع من خلال أكواد الخصم</p>
              </div>
            </div>
            <button
              onClick={() => setIsCodesEnabled(!isCodesEnabled)}
              className={`p-2 rounded-lg transition-all ${
                isCodesEnabled 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              {isCodesEnabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
            </button>
          </div>

          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-400 mb-1">تنبيه مهم</p>
                <p className="text-slate-300">
                  عند تعطيل أي نظام، لن يظهر في الموقع نهائياً. تأكد من قرارك قبل الحفظ.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="border-dashed border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-slate-400" />
            <h3 className="font-bold">معاينة سريعة</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              {platformLogo ? (
                <img src={platformLogo} alt="Logo" className="w-12 h-12 rounded-lg object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center">
                  <Store className="w-6 h-6 text-slate-500" />
                </div>
              )}
              <div>
                <h4 className="font-bold text-lg">{platformName}</h4>
                <p className="text-sm text-slate-400">{heroTitle}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {teacherAvatar ? (
                <img src={teacherAvatar} alt="Teacher" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-500" />
                </div>
              )}
              <span className="text-sm text-slate-300">{teacherName}</span>
            </div>

            <div className="flex gap-3 mt-4">
              {facebookLink && <Badge variant="info" className="cursor-pointer"><Facebook className="w-3 h-3" /></Badge>}
              {instagramLink && <Badge variant="info" className="cursor-pointer"><Instagram className="w-3 h-3" /></Badge>}
              {youtubeLink && <Badge variant="info" className="cursor-pointer"><Youtube className="w-3 h-3" /></Badge>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}