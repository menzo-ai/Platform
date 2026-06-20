'use client'

import { useState, useEffect } from 'react'
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
  Ticket,
  Code,
  Trash2,
  Plus,
  X,
  Edit3,
  Check,
  Loader2,
  Camera,
  ImagePlus,
  Building2,
  UserCircle,
  Contact,
  Link2,
  DollarSign,
  Gift,
  Shield,
  History,
  MessageSquare
} from 'lucide-react'
import toast from 'react-hot-toast'

interface TeacherInfo {
  id: string
  name: string
  avatar: string | null
  bio: string
  phone: string
  email: string
  facebook: string
  instagram: string
  youtube: string
  tiktok: string
  isActive: boolean
}

interface PlatformSettings {
  platformName: string
  platformLogo: string | null
  heroTitle: string
  heroSubtitle: string
  heroImage: string | null
  aboutText: string
  supportPhone: string
  supportEmail: string
  facebookLink: string
  instagramLink: string
  tiktokLink: string
  youtubeLink: string
  isWalletEnabled: boolean
  isCodesEnabled: boolean
  developerName: string
  developerEmail: string
  developerAvatar: string | null
}

export default function PlatformSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Platform Info
  const [platformName, setPlatformName] = useState('GELVANO')
  const [platformLogo, setPlatformLogo] = useState<string | null>(null)
  const [heroTitle, setHeroTitle] = useState('منصتك الأولى لتعلم الفيزياء')
  const [heroSubtitle, setHeroSubtitle] = useState('بأسلوب بسيط وممتع')
  const [heroImage, setHeroImage] = useState<string | null>(null)
  const [aboutText, setAboutText] = useState('منصة تعليمية متخصصة في الفيزياء للمرحلة الثانوية')

  // Developer Info
  const [developerName, setDeveloperName] = useState('Mohamed El-Manzalawy')
  const [developerAvatar, setDeveloperAvatar] = useState<string | null>(null)
  const [developerEmail, setDeveloperEmail] = useState('moha147wa@gmail.com')

  // Teacher Info (for multi-teacher support)
  const [teachers, setTeachers] = useState<TeacherInfo[]>([])
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherInfo | null>(null)
  const [editingTeacher, setEditingTeacher] = useState<string | null>(null)

  // Contact Info
  const [supportPhone, setSupportPhone] = useState('')
  const [supportEmail, setSupportEmail] = useState('')

  // Social Links
  const [facebookLink, setFacebookLink] = useState('')
  const [instagramLink, setInstagramLink] = useState('')
  const [tiktokLink, setTiktokLink] = useState('')
  const [youtubeLink, setYoutubeLink] = useState('')

  // Feature Toggles
  const [isWalletEnabled, setIsWalletEnabled] = useState(true)
  const [isCodesEnabled, setIsCodesEnabled] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/platform-settings')
      if (response.ok) {
        const data = await response.json()
        setPlatformName(data.platformName || 'GELVANO')
        setPlatformLogo(data.platformLogo)
        setHeroTitle(data.heroTitle || '')
        setHeroSubtitle(data.heroSubtitle || '')
        setHeroImage(data.heroImage)
        setAboutText(data.aboutText || '')
        setSupportPhone(data.supportPhone || '')
        setSupportEmail(data.supportEmail || '')
        setFacebookLink(data.facebookLink || '')
        setInstagramLink(data.instagramLink || '')
        setTiktokLink(data.tiktokLink || '')
        setYoutubeLink(data.youtubeLink || '')
        setIsWalletEnabled(data.isWalletEnabled ?? true)
        setIsCodesEnabled(data.isCodesEnabled ?? true)
        setDeveloperName(data.developerName || 'Mohamed El-Manzalawy')
        setDeveloperEmail(data.developerEmail || 'moha147wa@gmail.com')
        setDeveloperAvatar(data.developerAvatar)
        
        if (data.teachers) {
          setTeachers(data.teachers)
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    
    try {
      const response = await fetch('/api/admin/platform-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platformName,
          platformLogo,
          heroTitle,
          heroSubtitle,
          heroImage,
          aboutText,
          supportPhone,
          supportEmail,
          facebookLink,
          instagramLink,
          tiktokLink,
          youtubeLink,
          isWalletEnabled,
          isCodesEnabled,
          developerName,
          developerEmail,
          developerAvatar,
          teachers
        })
      })
      
      if (response.ok) {
        toast.success('تم حفظ الإعدادات بنجاح!')
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء الحفظ')
    }
    
    setSaving(false)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPlatformLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setHeroImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeveloperAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setDeveloperAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Teacher Management
  const addTeacher = () => {
    const newTeacher: TeacherInfo = {
      id: Date.now().toString(),
      name: '',
      avatar: null,
      bio: '',
      phone: '',
      email: '',
      facebook: '',
      instagram: '',
      youtube: '',
      tiktok: '',
      isActive: true
    }
    setTeachers(prev => [...prev, newTeacher])
    setSelectedTeacher(newTeacher)
    setEditingTeacher(newTeacher.id)
  }

  const updateTeacher = (id: string, updates: Partial<TeacherInfo>) => {
    setTeachers(prev => prev.map(t => 
      t.id === id ? { ...t, ...updates } : t
    ))
    if (selectedTeacher?.id === id) {
      setSelectedTeacher(prev => prev ? { ...prev, ...updates } : null)
    }
  }

  const deleteTeacher = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المدرس؟')) {
      setTeachers(prev => prev.filter(t => t.id !== id))
      if (selectedTeacher?.id === id) {
        setSelectedTeacher(null)
      }
      toast.success('تم حذف المدرس')
    }
  }

  const selectTeacher = (teacher: TeacherInfo) => {
    setSelectedTeacher(teacher)
    setEditingTeacher(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <Building2 className="w-7 h-7 text-primary" />
            إعدادات المنصة
          </h1>
          <p className="text-slate-400">إدارة معلومات المنصة لبيعها لمعلمين متعددين</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90">
          {saving ? (
            <Loader2 className="w-4 h-4 ml-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 ml-2" />
          )}
          حفظ التغييرات
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teachers List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <UserCircle className="w-5 h-5 text-primary" />
                المعلمين
              </h3>
              <Button size="sm" onClick={addTeacher}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {teachers.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <UserCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>لا يوجد معلمين</p>
                  <Button variant="outline" size="sm" onClick={addTeacher} className="mt-2">
                    <Plus className="w-4 h-4 ml-1" />
                    إضافة معلم
                  </Button>
                </div>
              ) : (
                teachers.map(teacher => (
                  <div
                    key={teacher.id}
                    onClick={() => selectTeacher(teacher)}
                    className={`p-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 ${
                      selectedTeacher?.id === teacher.id
                        ? 'bg-primary/20 border border-primary/50'
                        : 'bg-slate-800/50 hover:bg-slate-800'
                    }`}
                  >
                    {teacher.avatar ? (
                      <img src={teacher.avatar} alt={teacher.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{teacher.name || 'بدون اسم'}</p>
                      <p className="text-xs text-slate-400 truncate">{teacher.email || 'بدون إيميل'}</p>
                    </div>
                    <Badge variant={teacher.isActive ? 'success' : 'info'} className="text-xs">
                      {teacher.isActive ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
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
                      <div className="relative group">
                        <img src={platformLogo} alt="Logo" className="w-16 h-16 rounded-lg object-cover" />
                        <label className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                          <Camera className="w-6 h-6 text-white" />
                        </label>
                      </div>
                    ) : (
                      <label className="w-16 h-16 rounded-lg bg-slate-800 flex items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors">
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        <Store className="w-6 h-6 text-slate-500" />
                      </label>
                    )}
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
                    <div className="relative group">
                      <img src={heroImage} alt="Hero" className="w-32 h-20 rounded-lg object-cover" />
                      <label className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                        <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="hidden" />
                        <Camera className="w-6 h-6 text-white" />
                      </label>
                    </div>
                  ) : (
                    <label className="w-32 h-20 rounded-lg bg-slate-800 flex items-center justify-center border-2 border-dashed border-slate-600 cursor-pointer hover:bg-slate-700 transition-colors">
                      <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="hidden" />
                      <ImagePlus className="w-6 h-6 text-slate-500" />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">نص "عن المنصة"</label>
                <Textarea 
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  rows={4}
                  placeholder="اكتب وصف المنصة هنا..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Developer Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Code className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold">معلومات المطور</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                {developerAvatar ? (
                  <div className="relative group">
                    <img src={developerAvatar} alt={developerName} className="w-20 h-20 rounded-full object-cover" />
                    <label className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                      <input type="file" accept="image/*" onChange={handleDeveloperAvatarUpload} className="hidden" />
                      <Camera className="w-6 h-6 text-white" />
                    </label>
                  </div>
                ) : (
                  <label className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors">
                    <input type="file" accept="image/*" onChange={handleDeveloperAvatarUpload} className="hidden" />
                    <User className="w-8 h-8 text-slate-500" />
                  </label>
                )}
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">اسم المطور</label>
                    <Input 
                      value={developerName}
                      onChange={(e) => setDeveloperName(e.target.value)}
                      placeholder="اسم المطور"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                    <Input 
                      type="email"
                      value={developerEmail}
                      onChange={(e) => setDeveloperEmail(e.target.value)}
                      placeholder="البريد الإلكتروني"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teacher Edit Panel */}
          {selectedTeacher && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-2">
                    <UserCircle className="w-5 h-5 text-amber-400" />
                    {editingTeacher === selectedTeacher.id ? 'تعديل المعلم' : 'معلومات المعلم'}
                  </h3>
                  <div className="flex items-center gap-2">
                    {editingTeacher !== selectedTeacher.id && (
                      <Button variant="outline" size="sm" onClick={() => setEditingTeacher(selectedTeacher.id)}>
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    )}
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => deleteTeacher(selectedTeacher.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  {selectedTeacher.avatar ? (
                    <img src={selectedTeacher.avatar} alt={selectedTeacher.name} className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center">
                      <User className="w-8 h-8 text-slate-400" />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedTeacher.isActive ? 'success' : 'info'}>
                      {selectedTeacher.isActive ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">اسم المعلم</label>
                    {editingTeacher === selectedTeacher.id ? (
                      <Input 
                        value={selectedTeacher.name}
                        onChange={(e) => updateTeacher(selectedTeacher.id, { name: e.target.value })}
                      />
                    ) : (
                      <p className="p-2 bg-slate-800/50 rounded-lg">{selectedTeacher.name || '-'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                    {editingTeacher === selectedTeacher.id ? (
                      <Input 
                        type="email"
                        value={selectedTeacher.email}
                        onChange={(e) => updateTeacher(selectedTeacher.id, { email: e.target.value })}
                      />
                    ) : (
                      <p className="p-2 bg-slate-800/50 rounded-lg">{selectedTeacher.email || '-'}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">نبذة عن المعلم</label>
                    {editingTeacher === selectedTeacher.id ? (
                      <Textarea 
                        value={selectedTeacher.bio}
                        onChange={(e) => updateTeacher(selectedTeacher.id, { bio: e.target.value })}
                        rows={2}
                      />
                    ) : (
                      <p className="p-2 bg-slate-800/50 rounded-lg">{selectedTeacher.bio || '-'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                    {editingTeacher === selectedTeacher.id ? (
                      <Input 
                        value={selectedTeacher.phone}
                        onChange={(e) => updateTeacher(selectedTeacher.id, { phone: e.target.value })}
                      />
                    ) : (
                      <p className="p-2 bg-slate-800/50 rounded-lg">{selectedTeacher.phone || '-'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">الحالة</label>
                    {editingTeacher === selectedTeacher.id ? (
                      <button
                        onClick={() => updateTeacher(selectedTeacher.id, { isActive: !selectedTeacher.isActive })}
                        className={`w-full p-2 rounded-lg border transition-all flex items-center justify-between ${
                          selectedTeacher.isActive 
                            ? 'border-emerald-500/30 bg-emerald-500/10' 
                            : 'border-slate-600 bg-slate-800/50'
                        }`}
                      >
                        <span>{selectedTeacher.isActive ? 'نشط' : 'غير نشط'}</span>
                        {selectedTeacher.isActive ? (
                          <ToggleRight className="w-6 h-6 text-emerald-400" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-slate-400" />
                        )}
                      </button>
                    ) : (
                      <p className="p-2 bg-slate-800/50 rounded-lg">{selectedTeacher.isActive ? 'نشط' : 'غير نشط'}</p>
                    )}
                  </div>
                </div>

                {editingTeacher === selectedTeacher.id && (
                  <div className="pt-4 border-t border-slate-700">
                    <label className="block text-sm font-medium mb-2">روابط السوشيال ميديا</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1">
                          <Facebook className="w-3 h-3 text-blue-500" /> فيسبوك
                        </label>
                        <Input 
                          value={selectedTeacher.facebook}
                          onChange={(e) => updateTeacher(selectedTeacher.id, { facebook: e.target.value })}
                          placeholder="رابط فيسبوك"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1">
                          <Instagram className="w-3 h-3 text-pink-500" /> انستجرام
                        </label>
                        <Input 
                          value={selectedTeacher.instagram}
                          onChange={(e) => updateTeacher(selectedTeacher.id, { instagram: e.target.value })}
                          placeholder="رابط انستجرام"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1">
                          <Youtube className="w-3 h-3 text-red-500" /> يوتيوب
                        </label>
                        <Input 
                          value={selectedTeacher.youtube}
                          onChange={(e) => updateTeacher(selectedTeacher.id, { youtube: e.target.value })}
                          placeholder="رابط يوتيوب"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">تيك توك</label>
                        <Input 
                          value={selectedTeacher.tiktok}
                          onChange={(e) => updateTeacher(selectedTeacher.id, { tiktok: e.target.value })}
                          placeholder="رابط تيك توك"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Contact className="w-5 h-5 text-blue-400" />
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
                    type="email"
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
                <Link2 className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold">روابط السوشيال ميديا العامة</h3>
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
                <Shield className="w-5 h-5 text-purple-400" />
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
        </div>
      </div>
    </div>
  )
}
