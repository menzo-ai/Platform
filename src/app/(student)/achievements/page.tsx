'use client'

import { useState } from 'react'
import Card, { CardContent } from '@/components/ui/card'
import Badge from '@/components/ui/badge'
import { 
  Trophy, 
  Medal, 
  Star, 
  Zap, 
  Target, 
  Award,
  CheckCircle,
  Lock,
  Flame,
  BookOpen,
  Brain,
  Clock
} from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: any
  xpReward: number
  isUnlocked: boolean
  unlockedAt?: string
  progress?: number
  requirement?: string
  badge: string
}

const achievements: Achievement[] = [
  { id: '1', title: 'أول خطوة', description: 'سجل حسابك первый раз', icon: Star, xpReward: 10, isUnlocked: true, unlockedAt: '2024-01-15', badge: 'bronze' },
  { id: '2', title: 'متعلم نشيط', description: 'أكمل 10 محاضرات', icon: BookOpen, xpReward: 50, isUnlocked: true, unlockedAt: '2024-01-20', progress: 10, requirement: '10/10', badge: 'silver' },
  { id: '3', title: 'خبير الكورس', description: 'أكمل كورس كامل', icon: Trophy, xpReward: 100, isUnlocked: false, progress: 75, requirement: '75%', badge: 'gold' },
  { id: '4', title: 'بطل الاختبار', description: 'اجيب 90% في اختبار', icon: Target, xpReward: 75, isUnlocked: true, unlockedAt: '2024-01-25', badge: 'silver' },
  { id: '5', title: 'مساعد', description: 'ساعد 5 طلاب', icon: Medal, xpReward: 50, isUnlocked: false, progress: 3, requirement: '3/5', badge: 'bronze' },
  { id: '6', title: 'بومة الليل', description: 'ادرس بعد midnight', icon: Clock, xpReward: 25, isUnlocked: true, unlockedAt: '2024-01-18', badge: 'bronze' },
  { id: '7', title: 'صياد النقاط', description: 'اجمع 1000 XP', icon: Zap, xpReward: 100, isUnlocked: true, unlockedAt: '2024-01-22', badge: 'silver' },
  { id: '8', title: 'أسطورة النقاط', description: 'اجمع 5000 XP', icon: Flame, xpReward: 250, isUnlocked: false, progress: 3200, requirement: '3200/5000', badge: 'gold' },
  { id: '9', title: 'عقل مدبب', description: 'اسأل 50 سؤال في AI', icon: Brain, xpReward: 75, isUnlocked: false, progress: 32, requirement: '32/50', badge: 'silver' },
  { id: '10', title: 'الإتقان', description: 'اجمع 10000 XP', icon: Award, xpReward: 500, isUnlocked: false, progress: 3200, requirement: '3200/10000', badge: 'platinum' },
]

const badgeColors = {
  bronze: { bg: 'bg-amber-700/20', text: 'text-amber-400', border: 'border-amber-600' },
  silver: { bg: 'bg-slate-400/20', text: 'text-slate-300', border: 'border-slate-400' },
  gold: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500' },
  platinum: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500' },
}

export default function AchievementsPage() {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all')

  const filteredAchievements = achievements.filter(a => {
    if (filter === 'unlocked') return a.isUnlocked
    if (filter === 'locked') return !a.isUnlocked
    return true
  })

  const unlockedCount = achievements.filter(a => a.isUnlocked).length
  const totalXpEarned = achievements.filter(a => a.isUnlocked).reduce((sum, a) => sum + a.xpReward, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <Trophy className="w-7 h-7 text-amber-400" />
            الإنجازات
          </h1>
          <p className="text-slate-400">Collect badges and earn XP points</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{unlockedCount}</p>
              <p className="text-xs text-slate-400">إنجازات محققة</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalXpEarned}</p>
              <p className="text-xs text-slate-400">نقطة XP</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Medal className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{achievements.length - unlockedCount}</p>
              <p className="text-xs text-slate-400">في الانتظار</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{Math.round((unlockedCount / achievements.length) * 100)}%</p>
              <p className="text-xs text-slate-400">نسبة الإنجاز</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {[
          { value: 'all', label: 'الكل' },
          { value: 'unlocked', label: 'محققة' },
          { value: 'locked', label: 'مغلقة' },
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value as typeof filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map(achievement => {
          const colors = badgeColors[achievement.badge as keyof typeof badgeColors]
          const Icon = achievement.icon
          
          return (
            <Card 
              key={achievement.id} 
              className={`relative overflow-hidden ${
                !achievement.isUnlocked ? 'opacity-60' : ''
              }`}
            >
              {achievement.isUnlocked && (
                <div className={`absolute top-0 left-0 right-0 h-1 ${colors.bg.replace('/20', '')}`} />
              )}
              
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center ${
                    !achievement.isUnlocked ? 'grayscale' : ''
                  }`}>
                    {achievement.isUnlocked ? (
                      <Icon className={`w-7 h-7 ${colors.text}`} />
                    ) : (
                      <Lock className="w-7 h-7 text-slate-500" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{achievement.title}</h3>
                      <Badge className={colors.bg + ' ' + colors.text} variant="info">
                        {achievement.xpReward} XP
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">{achievement.description}</p>
                    
                    {achievement.isUnlocked ? (
                      <p className="text-xs text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        تم التحقق: {achievement.unlockedAt}
                      </p>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                          <span>التقدم</span>
                          <span>{achievement.requirement}</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${colors.bg.replace('/20', '')} rounded-full transition-all`}
                            style={{ width: `${(achievement.progress || 0)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
