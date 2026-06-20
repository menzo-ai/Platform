import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
})

export const registerSchema = z.object({
  name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z
    .string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .regex(/[A-Z]/, 'كلمة المرور يجب أن تحتوي على حرف كبير')
    .regex(/[0-9]/, 'كلمة المرور يجب أن تحتوي على رقم'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
})

export const studentRegisterSchema = z.object({
  name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  phone: z.string().min(11, 'رقم الهاتف غير صالح').max(11, 'رقم الهاتف غير صالح'),
  password: z
    .string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .regex(/[A-Z]/, 'كلمة المرور يجب أن تحتوي على حرف كبير')
    .regex(/[0-9]/, 'كلمة المرور يجب أن تحتوي على رقم'),
  confirmPassword: z.string(),
  parentName: z.string().min(3, 'اسم ولي الأمر مطلوب'),
  parentPhone: z.string().min(11, 'رقم هاتف ولي الأمر غير صالح').max(11, 'رقم هاتف ولي الأمر غير صالح'),
  schoolYear: z.number().min(1).max(3, 'الصف يجب أن يكون 1 أو 2 أو 3'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
})

export const otpSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  otp: z.string().length(6, 'رمز التحقق يجب أن يكون 6 أرقام'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'رمز الاستعادة مطلوب'),
  password: z
    .string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .regex(/[A-Z]/, 'كلمة المرور يجب أن تحتوي على حرف كبير')
    .regex(/[0-9]/, 'كلمة المرور يجب أن تحتوي على رقم'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
})

export const courseSchema = z.object({
  title: z.string().min(3, 'عنوان الدورة مطلوب'),
  description: z.string().min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل'),
  grade: z.number().min(1).max(3),
  price: z.number().min(0),
  thumbnail: z.string().optional(),
  isPublished: z.boolean().default(false),
})

export const chapterSchema = z.object({
  title: z.string().min(3, 'عنوان الفصل مطلوب'),
  order: z.number().min(0),
})

export const lectureSchema = z.object({
  title: z.string().min(3, 'عنوان المحاضرة مطلوب'),
  description: z.string().optional(),
  videoUrl: z.string().url('رابط الفيديو غير صالح'),
  pdfUrl: z.string().url('رابط الملف غير صالح').optional().or(z.literal('')),
  duration: z.number().min(0).optional(),
  order: z.number().min(0),
  isFree: z.boolean().default(false),
})

export const ticketSchema = z.object({
  category: z.enum(['subscription', 'technical', 'content', 'payment', 'other']),
  subject: z.string().min(5, 'موضوع التذكرة مطلوب'),
  message: z.string().min(20, 'الرسالة يجب أن تكون 20 حرف على الأقل'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
})

export const messageSchema = z.object({
  receiverId: z.string().min(1, 'المستلم مطلوب'),
  content: z.string().min(1, 'الرسالة مطلوبة'),
})

export const updateProfileSchema = z.object({
  name: z.string().min(3).optional(),
  phone: z.string().min(11).max(11).optional(),
  parentName: z.string().min(3).optional(),
  parentPhone: z.string().min(11).max(11).optional(),
  avatar: z.string().optional(),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'كلمة المرور الحالية مطلوبة'),
  newPassword: z
    .string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .regex(/[A-Z]/, 'كلمة المرور يجب أن تحتوي على حرف كبير')
    .regex(/[0-9]/, 'كلمة المرور يجب أن تحتوي على رقم'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type StudentRegisterInput = z.infer<typeof studentRegisterSchema>
export type OtpInput = z.infer<typeof otpSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type CourseInput = z.infer<typeof courseSchema>
export type ChapterInput = z.infer<typeof chapterSchema>
export type LectureInput = z.infer<typeof lectureSchema>
export type TicketInput = z.infer<typeof ticketSchema>
export type MessageInput = z.infer<typeof messageSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
