'use client'

import { useState } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Modal from '@/components/ui/modal'
import Input from '@/components/ui/input'
import { 
  MessageSquare,
  Users,
  Pin,
  Trash2,
  Edit,
  Eye,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Ban,
  AlertTriangle
} from 'lucide-react'

interface Post {
  id: string
  authorName: string
  authorRole: 'student' | 'teacher' | 'admin'
  content: string
  likes: number
  comments: number
  createdAt: string
  isPinned: boolean
  isHidden: boolean
  reported: boolean
}

const mockPosts: Post[] = [
  { id: '1', authorName: 'م. خالد أسامة', authorRole: 'admin', content: 'السلام عليكم! محاضرة جديدة عن قوانين نيوتن جاهزة.', likes: 45, comments: 12, createdAt: '2024-01-15 10:30', isPinned: true, isHidden: false, reported: false },
  { id: '2', authorName: 'أحمد محمد', authorRole: 'student', content: 'في حد فاهم قانون نيوتن الثالث؟', likes: 8, comments: 5, createdAt: '2024-01-15 09:15', isPinned: false, isHidden: false, reported: false },
  { id: '3', authorName: 'مستخدم', authorRole: 'student', content: 'محتوى مخالف أو غير مناسب للمنتدى', likes: 0, comments: 0, createdAt: '2024-01-14 18:45', isPinned: false, isHidden: false, reported: true },
]

const stats = {
  totalPosts: 456,
  totalUsers: 1247,
  activeUsers: 89,
  reportedPosts: 5,
  pinnedPosts: 3
}

export default function AdminForumPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const filteredPosts = posts.filter(post => {
    if (filter === 'reported' && !post.reported) return false
    if (filter === 'hidden' && !post.isHidden) return false
    if (filter === 'pinned' && !post.isPinned) return false
    if (searchQuery && !post.content.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handlePin = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, isPinned: !p.isPinned } : p))
  }

  const handleHide = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, isHidden: !p.isHidden } : p))
  }

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنشور؟')) {
      setPosts(prev => prev.filter(p => p.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
            <MessageSquare className="w-7 h-7 text-primary" />
            إدارة المنتدى
          </h1>
          <p className="text-slate-400">مراقبة وإدارة منتدى الطلاب</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold">{stats.totalPosts}</p>
              <p className="text-xs text-slate-400">إجمالي المنشورات</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-emerald-400" />
            <div>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
              <p className="text-xs text-slate-400">المستخدمين</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-cyan-400" />
            <div>
              <p className="text-2xl font-bold">{stats.activeUsers}</p>
              <p className="text-xs text-slate-400">نشط اليوم</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <div>
              <p className="text-2xl font-bold">{stats.reportedPosts}</p>
              <p className="text-xs text-slate-400">مبلّغ عنه</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Pin className="w-8 h-8 text-amber-400" />
            <div>
              <p className="text-2xl font-bold">{stats.pinnedPosts}</p>
              <p className="text-xs text-slate-400">مثبت</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="ابحث في المنشورات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pr-10"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'reported', 'hidden', 'pinned'].map(f => (
                <Button
                  key={f}
                  variant={filter === f ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? 'الكل' : f === 'reported' ? 'مبلّغ عنه' : f === 'hidden' ? 'مخفى' : '📌 مثبت'}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">المنشور</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">الكاتب</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">التفاعل</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">الحالة</th>
                  <th className="p-4 text-right text-sm font-medium text-slate-400">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredPosts.map(post => (
                  <tr key={post.id} className={`hover:bg-slate-800/30 ${post.isHidden ? 'opacity-50' : ''}`}>
                    <td className="p-4">
                      <div className="max-w-md">
                        <p className="line-clamp-2">{post.content}</p>
                        <p className="text-xs text-slate-500 mt-1">{post.createdAt}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{post.authorName}</span>
                        <Badge variant={post.authorRole === 'admin' ? 'danger' : post.authorRole === 'teacher' ? 'primary' : 'info'}>
                          {post.authorRole === 'admin' ? 'أدمن' : post.authorRole === 'teacher' ? 'مدرس' : 'طالب'}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span>❤️ {post.likes}</span>
                        <span>💬 {post.comments}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {post.isPinned && <Badge variant="warning" className="text-xs">📌</Badge>}
                        {post.isHidden && <Badge variant="info" className="text-xs">🙈</Badge>}
                        {post.reported && <Badge variant="danger" className="text-xs">🚩</Badge>}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedPost(post)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handlePin(post.id)}>
                          <Pin className={`w-4 h-4 ${post.isPinned ? 'text-amber-400' : ''}`} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleHide(post.id)}>
                          {post.isHidden ? <Eye className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)}>
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Post Detail Modal */}
      <Modal isOpen={!!selectedPost} onClose={() => setSelectedPost(null)} title="تفاصيل المنشور" size="lg">
        {selectedPost && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold">{selectedPost.authorName}</span>
                <Badge variant={selectedPost.authorRole === 'admin' ? 'danger' : 'info'}>
                  {selectedPost.authorRole}
                </Badge>
              </div>
              <p className="whitespace-pre-wrap">{selectedPost.content}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedPost(null)}>
                إغلاق
              </Button>
              <Button variant="danger" className="flex-1" onClick={() => { handleDelete(selectedPost.id); setSelectedPost(null); }}>
                <Trash2 className="w-4 h-4" />
                حذف
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}