'use client'

import { useState } from 'react'
import Card, { CardHeader, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'
import Modal from '@/components/ui/modal'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import { 
  MessageSquare,
  Plus,
  Search,
  Filter,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Image,
  Smile,
  Users,
  Clock,
  Pin,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Eye,
  MoreHorizontal,
  Trash2,
  Edit,
  AlertTriangle,
  Send,
  SmilePlus
} from 'lucide-react'

interface Post {
  id: string
  authorName: string
  authorImage?: string
  authorRole: 'student' | 'teacher' | 'admin'
  content: string
  images?: string[]
  likes: number
  comments: number
  createdAt: string
  isPinned?: boolean
  courseName?: string
  tags?: string[]
}

interface Comment {
  id: string
  authorName: string
  content: string
  createdAt: string
  likes: number
}

const mockPosts: Post[] = [
  { id: '1', authorName: 'م. خالد أسامة', authorRole: 'teacher', content: 'السلام عليكم! محاضرة جديدة عن قوانين نيوتن جاهزة. رابط الشرح في الوصف. بالتوفيق للجميع! 📚', likes: 45, comments: 12, createdAt: '2024-01-15 10:30', isPinned: true, courseName: 'الفيزياء', tags: ['إعلان', 'محاضرة'] },
  { id: '2', authorName: 'أحمد محمد', authorRole: 'student', content: 'في حد فاهم قانون نيوتن الثالث؟ محتاج مساعدة في حل مسألة', likes: 8, comments: 5, createdAt: '2024-01-15 09:15', courseName: 'الفيزياء', tags: ['سؤال'] },
  { id: '3', authorName: 'فاطمة علي', authorRole: 'student', content: 'اللي عنده ملخص قوانين نيوتن ينزله هنا بليز 🙏', likes: 15, comments: 8, createdAt: '2024-01-14 18:45', courseName: 'الفيزياء', tags: ['طلب', 'ملخص'] },
  { id: '4', authorName: 'محمد خالد', authorRole: 'student', content: 'نجحت في الاختبار بنسبة 95%! شكراً أستاذ خالد على المجهود الرائع 💪🔥', likes: 67, comments: 23, createdAt: '2024-01-14 14:20', tags: ['نجاح', 'اختبار'] },
  { id: '5', authorName: 'سارة أحمد', authorRole: 'student', content: 'محاضرة جميلة جداً، الشرح وافي ومبسط. شكراً جزيلاً! 🤍', likes: 34, comments: 6, createdAt: '2024-01-13 20:10', courseName: 'الميكانيكا' },
]

export default function ForumPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showCommentsModal, setShowCommentsModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<string>('all')
  const [newPostContent, setNewPostContent] = useState('')
  const [newComment, setNewComment] = useState('')

  const filteredPosts = posts.filter(post => {
    if (filter !== 'all' && filter === 'pinned' && !post.isPinned) return false
    if (filter !== 'all' && filter !== 'pinned' && post.courseName !== filter) return false
    if (searchQuery && !post.content.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !post.authorName.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, likes: p.likes + 1 } : p
    ))
  }

  const handleOpenComments = (post: Post) => {
    setSelectedPost(post)
    setShowCommentsModal(true)
  }

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedPost) return
    setSelectedPost({
      ...selectedPost,
      comments: selectedPost.comments + 1
    })
    setNewComment('')
  }

  const getRoleBadge = (role: Post['authorRole']) => {
    const config: Record<string, { variant: any; label: string }> = {
      teacher: { variant: 'primary', label: 'مدرس' },
      admin: { variant: 'danger', label: 'أدمن' },
      student: { variant: 'info', label: 'طالب' }
    }
    return <Badge variant={config[role].variant} className="text-xs">{config[role].label}</Badge>
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
              <MessageSquare className="w-7 h-7 text-primary" />
              منتدى الطلاب
            </h1>
            <p className="text-slate-400">ناقش واستفسر وتبادل الخبرات مع زملائك</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" />
            منشور جديد
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-400" />
            <p className="text-2xl font-bold">1,247</p>
            <p className="text-xs text-slate-400">طالب</p>
          </Card>
          <Card className="p-4 text-center">
            <MessageSquare className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
            <p className="text-2xl font-bold">456</p>
            <p className="text-xs text-slate-400">منشور</p>
          </Card>
          <Card className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-amber-400" />
            <p className="text-2xl font-bold">89</p>
            <p className="text-xs text-slate-400">نشط اليوم</p>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="ابحث في المنتدى..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pr-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'pinned', 'الفيزياء', 'الميكانيكا', 'الكهرباء'].map(f => (
              <Button
                key={f}
                variant={filter === f ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'الكل' : f === 'pinned' ? '📌 مثبت' : f}
              </Button>
            ))}
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <Card key={post.id} className={`overflow-hidden ${post.isPinned ? 'border-primary/50' : ''}`}>
              {post.isPinned && (
                <div className="px-4 py-2 bg-primary/10 border-b border-primary/20 flex items-center gap-2 text-xs text-primary">
                  <Pin className="w-3 h-3" />
                  منشور مثبت
                </div>
              )}
              <CardContent className="p-4">
                {/* Author */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                    {post.authorName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{post.authorName}</span>
                      {getRoleBadge(post.authorRole)}
                      {post.courseName && (
                        <Badge variant="info" className="text-xs">
                          <BookOpen className="w-3 h-3 ml-1" />
                          {post.courseName}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      {post.createdAt}
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-white">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <p className="mb-4 whitespace-pre-wrap">{post.content}</p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="info" className="text-xs">#{tag}</Badge>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 pt-3 border-t border-slate-700">
                  <button 
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors"
                    onClick={() => handleLike(post.id)}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    {post.likes}
                  </button>
                  <button 
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors"
                    onClick={() => handleOpenComments(post)}
                  >
                    <MessageSquare className="w-4 h-4" />
                    {post.comments} تعليق
                  </button>
                  <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors mr-auto">
                    <Reply className="w-4 h-4" />
                    مشاركة
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>لا توجد منشورات</p>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="منشور جديد" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">المحتوى</label>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="اكتب منشورك هنا..."
              rows={5}
              className="input w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">الكورس (اختياري)</label>
            <select className="input w-full">
              <option value="">عام</option>
              <option value="الفيزياء">الفيزياء - الصف الأول</option>
              <option value="الميكانيكا">الميكانيكا</option>
              <option value="الكهرباء">الكهرباء</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">صور (اختياري)</label>
            <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Image className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p className="text-sm text-slate-400">اضغط لرفع صور</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>
              إلغاء
            </Button>
            <Button className="flex-1" onClick={() => setShowCreateModal(false)} disabled={!newPostContent.trim()}>
              <Send className="w-4 h-4" />
              نشر
            </Button>
          </div>
        </div>
      </Modal>

      {/* Comments Modal */}
      <Modal isOpen={showCommentsModal} onClose={() => setShowCommentsModal(false)} title="التعليقات" size="lg">
        {selectedPost && (
          <div className="space-y-4">
            {/* Post Content */}
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">{selectedPost.authorName}</span>
                {getRoleBadge(selectedPost.authorRole)}
              </div>
              <p className="text-sm">{selectedPost.content}</p>
            </div>

            {/* Comments List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {Array.from({ length: selectedPost.comments }).map((_, i) => (
                <div key={i} className="p-3 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">مستخدم {i + 1}</span>
                    <span className="text-xs text-slate-500">منذ ساعة</span>
                  </div>
                  <p className="text-sm text-slate-300">تعليق رقم {i + 1} - هنا يمكن إضافة ردود الزوار</p>
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <div className="flex gap-2 pt-4 border-t border-slate-700">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="اكتب تعليقك..."
                className="input flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <Button onClick={handleAddComment}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}