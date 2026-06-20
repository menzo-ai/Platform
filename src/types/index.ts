export type Role = 'STUDENT' | 'ADMIN' | 'SUPER_ADMIN' | 'CONTENT_ADMIN' | 'FINANCE_ADMIN' | 'SUPPORT_ADMIN'

export type Plan = 'MONTHLY' | 'PER_COURSE'
export type SubStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING'

export type ExamType = 'QUIZ' | 'CHAPTER_EXAM' | 'FINAL_EXAM'
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface User {
  id: string
  email: string
  name: string
  role: Role
  studentId?: string
  phone?: string
  parentName?: string
  parentPhone?: string
  avatar?: string
  schoolYear?: number
  isVerified: boolean
  isActive: boolean
  createdAt: Date
}

export interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  grade: number
  price: number
  isPublished: boolean
  chapters?: Chapter[]
  createdAt: Date
}

export interface Chapter {
  id: string
  courseId: string
  title: string
  order: number
  lectures?: Lecture[]
}

export interface Lecture {
  id: string
  chapterId: string
  title: string
  description?: string
  videoUrl: string
  pdfUrl?: string
  duration?: number
  order: number
  isFree: boolean
}

export interface Subscription {
  id: string
  userId: string
  plan: Plan
  status: SubStatus
  startDate: Date
  endDate: Date
}

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  data?: Record<string, any>
  isRead: boolean
  createdAt: Date
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  attachments?: string[]
  isRead: boolean
  createdAt: Date
  sender?: User
  receiver?: User
}

export interface Ticket {
  id: string
  userId: string
  category: string
  priority: TicketPriority
  status: TicketStatus
  subject: string
  messages?: TicketMessage[]
  createdAt: Date
}

export interface TicketMessage {
  id: string
  ticketId: string
  senderId: string
  content: string
  createdAt: Date
}

export interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  points: number
}

export interface Exam {
  id: string
  courseId: string
  chapterId?: string
  title: string
  type: ExamType
  duration?: number
  passingScore: number
  questions: Question[]
}

export interface ExamResult {
  id: string
  userId: string
  examId: string
  score: number
  totalQuestions: number
  correctAnswers: number
  timeTaken?: number
  createdAt: Date
}

export interface Analytics {
  totalStudents: number
  activeSubscriptions: number
  monthlyRevenue: number
  pendingTickets: number
  totalCourses: number
  totalLectures: number
}
