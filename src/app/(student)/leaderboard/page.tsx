'use client'

import { useState } from 'react'
import Card, { CardContent } from '@/components/ui/card'
import Badge from '@/components/ui/badge'
import { Trophy, Medal, Crown, Flame, Zap, Award, Filter, ChevronDown } from 'lucide-react'

interface StudentRank {
  id: string
  name: string
  avatar: string
  xp: number
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  levelTitle: string
  courses: number
  streak: number
  schoolYear: number
  badge: 'bronze' | 'silver' | 'gold' | 'platinum'
  rank: number
}

const mockLeaderboard: StudentRank[] = [
  { id: '1', name: 'أحمد محمد', avatar: 'أ', xp: 15420, level: 'EXPERT', levelTitle: 'خبير', courses: 12, streak: 45, schoolYear: 3, badge: 'platinum', rank: 1 },
  { id: '2', name: 'فاطمة علي', avatar: 'ف', xp: 12350, level: 'ADVANCED', levelTitle: 'متقدم', courses: 10, streak: 38, schoolYear: 3, badge: 'gold', rank: 2 },
  { id: '3', name: 'محمود حسن', avatar: 'م', xp: 10890, level: 'ADVANCED', levelTitle: 'متقدم', courses: 9, streak: 30, schoolYear: 2, badge: 'gold', rank: 3 },
  { id: '4', name: 'سارة خالد', avatar: 'س', xp: 9540, level: 'ADVANCED', levelTitle: 'متقدم', courses: 8, streak: 25, schoolYear: 3, badge: 'gold', rank: 4 },
  { id: '5', name: 'عمر يوسف', avatar: 'ع', xp: 8720, level: 'INTERMEDIATE', levelTitle: 'متوسط', courses: 7, streak: 22, schoolYear: 2, badge: 'silver', rank: 5 },
  { id: '6', name: 'نورا سعيد', avatar: 'ن', xp: 7890, level: 'INTERMEDIATE', levelTitle: 'متوسط', courses: 6, streak: 18, schoolYear: 1, badge: 'silver', rank: 6 },
  { id: '7', name: 'ياسين أحمد', avatar: 'ي', xp: 6540, level: 'INTERMEDIATE', levelTitle: 'متوسط', courses: 5, streak: 15, schoolYear: 2, badge: 'silver', rank: 7 },
  { id: '8', name: 'ليلى محمود', avatar: 'ل', xp: 5430, level: 'BEGINNER', levelTitle: 'مبتدئ', courses: 4, streak: 12, schoolYear: 1, badge: 'bronze', rank: 8 },
  { id: '9', name: 'كريم عبدالله', avatar: 'ك', xp: 4320, level: 'BEGINNER', levelTitle: 'مبتدئ', courses: 3, streak: 8, schoolYear: 1, badge: 'bronze', rank: 9 },
  { id: '10', name: 'ديما يوسف', avatar: 'د', xp: 3210, level: 'BEGINNER', levelTitle: 'مبتدئ', courses: 2, streak: 5, schoolYear: 1, badge: 'bronze', rank: 10 },
]

const levelColors: Record<string, { bg: string; text: string; border: string; label: string }> = {
  BEGINNER: { bg: 'bg-amber-700/20', text: 'text-amber-400', border: 'border-amber-600', label: 'مبتدئ' },
  INTERMEDIATE: { bg: 'bg-slate-400/20', text: 'text-slate-300', border: 'border-slate-400', label: 'متوسط' },
  ADVANCED: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500', label: 'متقدم' },
  EXPERT: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500', label: 'خبير' },
}

const badgeColors: Record<string, { bg: string; text: string }> = {
  bronze: { bg: 'bg-amber-700/20', text: 'text-amber-400' },
  silver: { bg: 'bg-slate-400/20', text: 'text-slate-300' },
  gold: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  platinum: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
}

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<'all' | 'first' | 'second' | 'third'>('all')
  const [showLevelInfo, setShowLevelInfo] = useState(true)

  const filteredLeaderboard = mockLeaderboard.filter(student => {
    if (filter !== 'all' && student.schoolYear !== parseInt(filter.replace('first', '1').replace('second', '2').replace('third', '3'))) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <Trophy className="w-7 h-7 text-amber-400" />
            لوحة المتصدرين
          </h1>
          <p className="text-slate-400">ترتيب الطلاب حسب النقاط والخبرة</p>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              نظام المستويات
            </h3>
            <button onClick={() => setShowLevelInfo(!showLevelInfo)} className="text-sm text-primary flex items-center gap-1">
              {showLevelInfo ? 'إخفاء' : 'عرض'} التفاصيل
              <ChevronDown className={`w-4 h-4 transition-transform ${showLevelInfo ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(levelColors).map(([level, colors]) => (
              <div key={level} className={`p-4 rounded-xl ${colors.bg} border ${colors.border}`}>
                <p className={`text-lg font-bold ${colors.text}`}>{colors.label}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {level === 'BEGINNER' && '0 - 999 XP'}
                  {level === 'INTERMEDIATE' && '1,000 - 4,999 XP'}
                  {level === 'ADVANCED' && '5,000 - 9,999 XP'}
                  {level === 'EXPERT' && '10,000+ XP'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">الصف:</span>
              {[
                { value: 'all', label: 'الكل' },
                { value: 'first', label: 'الأول' },
                { value: 'second', label: 'الثاني' },
                { value: 'third', label: 'الثالث' },
              ].map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value as typeof filter)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filter === f.value ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                >
                  {f.label} الثانوي
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        {filteredLeaderboard.slice(0, 3).map((student, index) => {
          const position = index + 1
          const podiumColors = [
            { bg: 'bg-gradient-to-b from-amber-500/30 to-amber-600/10', ring: 'ring-4 ring-amber-400' },
            { bg: 'bg-gradient-to-b from-slate-400/30 to-slate-500/10', ring: 'ring-4 ring-slate-300' },
            { bg: 'bg-gradient-to-b from-amber-700/30 to-amber-800/10', ring: 'ring-4 ring-amber-600' },
          ]
          const colors = podiumColors[index]
          
          return (
            <Card key={student.id} className={`relative overflow-hidden ${colors.ring}`}>
              <CardContent className="p-6 text-center">
                {position === 1 && (
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400" />
                )}
                
                <div className="flex justify-center mb-2">
                  {position === 1 ? <Crown className="w-8 h-8 text-amber-400 animate-pulse" /> : 
                   position === 2 ? <Medal className="w-8 h-8 text-slate-300" /> :
                   <Medal className="w-8 h-8 text-amber-600" />}
                </div>
                
                <div className={`w-20 h-20 rounded-full ${colors.bg} flex items-center justify-center mx-auto mb-3 ring-4 ring-slate-900`}>
                  <span className={`text-3xl font-bold ${badgeColors[student.badge].text}`}>{student.avatar}</span>
                </div>
                
                <h3 className="font-bold text-lg mb-1">{student.name}</h3>
                
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${levelColors[student.level].bg} ${levelColors[student.level].text}`}>
                  <Zap className="w-4 h-4" />
                  {student.levelTitle}
                </div>
                
                <div className="mt-3 space-y-1">
                  <p className="text-3xl font-bold text-primary">{student.xp.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">نقطة خبرة</p>
                </div>
                
                <div className="flex items-center justify-center gap-4 mt-3 text-sm">
                  <span className="text-slate-400">{student.courses} كورس</span>
                  <span className="flex items-center gap-1 text-orange-400">
                    <Flame className="w-4 h-4" />
                    {student.streak}
                  </span>
                </div>

                <Badge className="mt-2" variant="primary">
                  #{student.rank}
                </Badge>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">#</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">الطالب</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">المستوى</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">النقاط</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">الكورسات</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">الصف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredLeaderboard.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        student.rank === 1 ? 'bg-amber-500/20 text-amber-400' :
                        student.rank === 2 ? 'bg-slate-400/20 text-slate-300' :
                        student.rank === 3 ? 'bg-amber-700/20 text-amber-600' :
                        'bg-slate-700/50 text-slate-400'
                      }`}>
                        {student.rank <= 3 ? <Trophy className="w-4 h-4" /> : student.rank}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${badgeColors[student.badge].bg} flex items-center justify-center`}>
                          <span className={`font-bold ${badgeColors[student.badge].text}`}>{student.avatar}</span>
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-slate-400">#{student.rank} على مستوى المنصة</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${levelColors[student.level].bg} ${levelColors[student.level].text}`}>
                        <Zap className="w-4 h-4" />
                        {student.levelTitle}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-lg font-bold text-primary">{student.xp.toLocaleString()}</span>
                      <span className="text-xs text-slate-400 mr-1">XP</span>
                    </td>
                    <td className="p-4 text-slate-400">{student.courses}</td>
                    <td className="p-4">
                      <Badge variant="info">
                        {student.schoolYear === 1 ? 'الأول' : student.schoolYear === 2 ? 'الثاني' : 'الثالث'} ثانوي
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
