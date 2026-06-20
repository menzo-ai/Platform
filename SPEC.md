# GELVANO Education Platform - Technical Specification

## 1. Concept & Vision

**GELVANO** is a premium Egyptian EdTech SaaS platform designed specifically for secondary school physics education (Grades 1-3, Science Track). The platform combines the content richness of Udemy, the visual elegance of Netflix, the structured learning management of School LMS, and the administrative power of a SaaS Dashboard—all wrapped in a modern, RTL-optimized interface for Egyptian students.

The platform feels **professional, trustworthy, and cutting-edge**—like a premium educational product that students and parents would confidently pay for. It's not just an alternative to traditional tutoring; it's a superior learning experience that leverages technology to deliver better results.

---

## 2. Design Language

### Aesthetic Direction
**"Academic Premium"** — Clean, professional design with subtle depth, inspired by premium educational platforms like Coursera and Khan Academy, but with a distinctive Egyptian identity through color accents and typography choices.

### Color Palette
```css
/* Primary Colors */
--primary: #6366F1;        /* Indigo - Trust, Knowledge */
--primary-dark: #4F46E5;
--primary-light: #818CF8;

/* Secondary Colors */
--secondary: #10B981;       /* Emerald - Progress, Success */
--secondary-dark: #059669;

/* Accent Colors */
--accent: #F59E0B;         /* Amber - Energy, Attention */
--accent-dark: #D97706;

/* Neutrals */
--background: #0F172A;      /* Slate 900 - Dark mode bg */
--background-light: #F8FAFC; /* Slate 50 - Light mode bg */
--surface: #1E293B;         /* Slate 800 - Dark card bg */
--surface-light: #FFFFFF;   /* White - Light card bg */
--text-primary: #F1F5F9;    /* Slate 100 */
--text-secondary: #94A3B8;  /* Slate 400 */
--border: #334155;          /* Slate 700 */

/* Semantic Colors */
--error: #EF4444;
--warning: #F59E0B;
--success: #10B981;
--info: #3B82F6;
```

### Typography
- **Headings**: `Cairo` (Arabic-optimized, Google Font) - Bold weight
- **Body**: `Inter` (Latin) / `Cairo` (Arabic) - Regular/Medium weight
- **Monospace**: `JetBrains Mono` (for code/numbers)

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px
- Border radius: 8px (small), 12px (medium), 16px (large), 24px (cards)
- Max content width: 1400px

### Motion Philosophy
- **Micro-interactions**: 150-200ms ease-out (buttons, hovers)
- **Page transitions**: 300ms ease-in-out
- **Loading states**: Skeleton shimmer at 1.5s loop
- **Success feedback**: Scale bounce (1.0 → 1.05 → 1.0) with checkmark
- **No jarring animations** — everything should feel smooth and intentional

### Visual Assets
- **Icons**: Lucide React (consistent stroke width, clean aesthetic)
- **Illustrations**: Abstract geometric shapes in primary/secondary colors
- **Course thumbnails**: 16:9 aspect ratio, gradient overlays
- **Avatar placeholders**: Initials on gradient backgrounds

---

## 3. Layout & Structure

### Global Layout
```
┌─────────────────────────────────────────────────────┐
│  Top Bar (Logo | Search | Notifications | Profile) │
├────────────┬────────────────────────────────────────┤
│            │                                        │
│  Sidebar   │         Main Content Area              │
│  (Collaps- │                                        │
│   ible)    │                                        │
│            │                                        │
├────────────┴────────────────────────────────────────┤
│  Footer (minimal)                                   │
└─────────────────────────────────────────────────────┘
```

### Page Hierarchy

**Public Pages:**
- `/` - Landing page (redirects to login if not authenticated)
- `/login` - Authentication
- `/register` - Admin registration (first admin only)
- `/forgot-password` - Password reset flow
- `/verify-otp` - Email verification

**Student Portal:**
- `/dashboard` - Student home with progress overview
- `/courses` - Course catalog (filtered by grade level)
- `/courses/[id]` - Course details with chapters
- `/learn/[lectureId]` - Video player with notes
- `/exams` - Available exams list
- `/exams/[id]` - Exam taking interface
- `/messages` - Chat with admin
- `/notifications` - Notification center
- `/profile` - User settings
- `/subscriptions` - Payment and plans
- `/leaderboard` - Student rankings

**Admin Dashboard:**
- `/admin` - Overview with key metrics
- `/admin/students` - Student management
- `/admin/students/[id]` - Student details
- `/admin/courses` - Course management
- `/admin/courses/[id]` - Edit course
- `/admin/lectures` - Lecture management
- `/admin/exams` - Exam builder
- `/admin/messages` - Support tickets
- `/admin/analytics` - Revenue and usage stats
- `/admin/admins` - Admin account management
- `/admin/settings` - Platform settings

### Responsive Strategy
- **Desktop (1200px+)**: Full sidebar, multi-column layouts
- **Tablet (768-1199px)**: Collapsible sidebar, 2-column grids
- **Mobile (< 768px)**: Bottom navigation, single column, swipe gestures

---

## 4. Features & Interactions

### Authentication System

**Admin Registration (First Admin Only):**
- Bootstrap locked after first registration
- Fields: Full name, Email, Password, Confirm Password
- Email verification via OTP (6 digits, 10-minute expiry)
- Password requirements: 8+ chars, 1 uppercase, 1 number
- Success: Redirect to admin dashboard

**Login Flow:**
- Email + Password
- "Remember me" option (30-day session)
- Rate limiting: 5 attempts per 15 minutes
- Success: JWT token stored in httpOnly cookie
- Failure: Generic error message (don't reveal which field is wrong)

**Password Reset:**
- Enter email → Send reset link
- Link expires in 1 hour
- New password + confirm password
- All previous sessions invalidated

### Student System

**Student Registration:**
- Full Name, Email, Phone, Password
- Parent Name, Parent Phone
- School Year selection (1st, 2nd, 3rd Secondary)
- Auto-generated Student ID: `GVN-{YEAR}-{6-DIGIT}`

**Grade-Based Content Filtering:**
- On login, student selects/confirm their grade
- Course catalog ONLY shows courses for that grade
- Switching grades requires admin approval

**Profile Features:**
- Profile picture upload (max 2MB, jpg/png)
- Edit personal info
- Change password
- Activity log view

### Course System

**Course Structure:**
```
Course (e.g., "Physics - First Secondary")
├── Chapter 1: "Mechanics Basics"
│   ├── Lecture 1.1: "Introduction to Forces" (Video + PDF)
│   ├── Lecture 1.2: "Newton's Laws" (Video + PDF)
│   └── Lecture 1.3: Quiz
├── Chapter 2: "Kinematics"
│   ├── Lecture 2.1: "Motion Basics"
│   └── ...
└── Final Exam
```

**Course Card Display:**
- Thumbnail with grade badge
- Title and description
- Chapter count, lecture count
- Progress bar (if enrolled)
- Price or "Enrolled" status

**Course Detail Page:**
- Hero section with course image
- Instructor info
- Curriculum accordion (chapters → lectures)
- Lock/unlock indicators based on subscription
- Reviews/ratings section (future)

### Video Player System

**Secure YouTube Embed:**
```html
<div class="video-wrapper">
  <iframe src="https://www.youtube-nocookie.com/embed/{VIDEO_ID}?rel=0&modestbranding=1" />
</div>
```

**Player Features:**
- Fullscreen toggle
- Playback speed (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x)
- Volume control
- Progress tracking (auto-save position)
- Next lecture button

**Notes Section Below Video:**
- PDF viewer embedded
- Download button
- Lecture description
- Related resources

### Subscription System

**Plans:**
| Plan | Price | Features |
|------|-------|----------|
| Monthly | 150 EGP/month | Full grade access |
| Per-Course | 50-100 EGP | Single course access |

**Access Logic:**
```javascript
canAccessLecture(userId, lectureId) {
  // Check if user has active subscription
  // OR user has purchased this specific lecture/course
  // OR lecture is marked as free preview
}
```

**Locked Content UI:**
- Blurred thumbnail
- Lock icon overlay
- "Subscribe to Access" CTA button
- "Request Access" button → Opens ticket

### Admin Dashboard

**Overview Cards:**
- Total Students (with trend arrow)
- Active Subscriptions
- Monthly Revenue
- Pending Tickets

**Student Management:**
- Searchable/filterable table
- Actions: View, Edit, Suspend, Delete
- Bulk actions: Export CSV, Send notification
- Detail view: Full profile, login history, activity log

**Course Management:**
- CRUD operations for courses
- Drag-and-drop chapter reordering
- Lecture upload: YouTube URL + PDF + description
- Pricing configuration

**Multi-Admin Roles:**
```javascript
const ROLES = {
  SUPER_ADMIN: 'full_access',
  CONTENT_ADMIN: 'courses,lectures,exams',
  FINANCE_ADMIN: 'subscriptions,payments,analytics',
  SUPPORT_ADMIN: 'messages,tickets,notifications'
}
```

### Messaging System

**Student ↔ Admin Chat:**
- Real-time messaging (polling every 5s or WebSocket)
- Message status: sent, delivered, read
- File attachments (screenshots, documents)
- Admin can initiate conversation

**Support Tickets:**
- Categories: Subscription Issue, Technical Problem, Content Question
- Priority levels: Low, Medium, High, Urgent
- Status: Open, In Progress, Resolved, Closed
- Thread-based conversation

### Notification System

**Student Notifications:**
| Type | Trigger | Content |
|------|---------|---------|
| new_lecture | Admin uploads | "New lecture: {title}" |
| admin_reply | Admin responds | "Admin replied to your message" |
| subscription | Status change | "Your subscription has been approved" |
| exam_result | Grade posted | "You scored {score}% on {exam}" |

**Admin Notifications:**
| Type | Trigger |
|------|---------|
| new_student | Registration |
| payment_request | Subscription purchase |
| support_ticket | New ticket created |

### Exam System

**Exam Types:**
- **Lecture Quiz**: 5-10 MCQs, auto-graded
- **Chapter Exam**: 20 MCQs, timed
- **Final Exam**: 50 MCQs, proctored feel

**Question Types (Phase 1: MCQ only):**
- Single correct answer
- 4 options (A, B, C, D)
- Points per question

**Exam Taking Interface:**
- One question per screen (or all at once)
- Timer display (if timed)
- Navigation: Previous/Next buttons
- Submit button with confirmation
- Results shown immediately (or after admin review)

### Progress & Gamification

**Progress Tracking:**
- Per-course completion percentage
- Lectures watched / total
- Time spent per lecture
- Last active timestamp

**Level System:**
| Level | Requirement | Badge |
|-------|-------------|-------|
| Beginner | 0-25% of any course | 🟢 |
| Intermediate | 26-75% | 🟡 |
| Advanced | 76-100% | 🔵 |

**Leaderboard:**
- Weekly/Monthly/All-time rankings
- Based on: lectures completed, exams passed, points earned
- Top 10 displayed

### Extra Features (Future Phases)

**AI Chatbot:**
- Physics assistant for answering questions
- Powered by OpenAI API
- Context-aware (knows current lecture)

**Certificates:**
- PDF generation on course completion
- Student's name, course, date, instructor signature

**Auto-Study Plan:**
- AI-generated weekly schedule based on exam dates

---

## 5. Component Inventory

### Button
- **Variants**: Primary, Secondary, Outline, Ghost, Danger
- **Sizes**: Small (32px), Medium (40px), Large (48px)
- **States**: Default, Hover (lift + shadow), Active (pressed), Disabled (50% opacity), Loading (spinner)

### Input Field
- **Types**: Text, Email, Password (with toggle), Number, Textarea
- **States**: Default, Focus (ring), Error (red border + message), Disabled
- **Features**: Label, helper text, character count

### Card
- **Variants**: Default, Interactive (hover effect), Selected
- **Structure**: Header, Body, Footer (optional)
- **Shadow**: Subtle on light bg, glow on dark bg

### Modal
- **Sizes**: Small (400px), Medium (600px), Large (800px), Full
- **Features**: Header with close button, scrollable body, sticky footer
- **Animation**: Fade in + scale up

### Table
- **Features**: Sortable columns, pagination, row selection, actions menu
- **Responsive**: Horizontal scroll on mobile

### Sidebar Navigation
- **Items**: Icon + Label, active indicator (left border)
- **Collapse**: Icons only mode on tablet
- **Mobile**: Bottom tab bar

### Video Player
- **Custom controls**: Play/pause, volume, progress, fullscreen, speed
- **Overlay**: Play button on pause, loading spinner

### Toast Notification
- **Types**: Success (green), Error (red), Warning (amber), Info (blue)
- **Position**: Top-right
- **Duration**: 5 seconds auto-dismiss

### Avatar
- **Sizes**: XS (24px), SM (32px), MD (40px), LG (56px), XL (80px)
- **Fallback**: Initials on gradient background
- **Status**: Online dot (green/yellow/red)

### Badge
- **Variants**: Default, Success, Warning, Error, Info
- **Sizes**: Small, Medium

### Progress Bar
- **Variants**: Linear, Circular
- **Animation**: Fill on mount

### Skeleton Loader
- **Types**: Text lines, Card, Avatar, Table row
- **Animation**: Shimmer left to right

---

## 6. Technical Approach

### Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: TailwindCSS + custom design tokens
- **State**: Zustand (client state) + React Query (server state)
- **Forms**: React Hook Form + Zod validation
- **Database**: PostgreSQL (via Prisma ORM)
- **Auth**: NextAuth.js with JWT strategy
- **File Storage**: Local uploads (production: S3/Cloudinary)
- **Email**: Nodemailer (dev: console logging)

### Database Schema (Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  name          String
  role          Role      @default(STUDENT)
  phone         String?
  parentName    String?
  parentPhone   String?
  avatar        String?
  schoolYear    Int?      // 1, 2, or 3
  isVerified    Boolean   @default(false)
  otpCode       String?
  otpExpiry     DateTime?
  resetToken    String?
  resetExpiry   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  subscription  Subscription?
  enrollments   Enrollment[]
  messages      Message[]
  notifications Notification[]
  activities    ActivityLog[]
  examResults   ExamResult[]
}

enum Role {
  STUDENT
  ADMIN
  SUPER_ADMIN
  CONTENT_ADMIN
  FINANCE_ADMIN
  SUPPORT_ADMIN
}

model Subscription {
  id            String    @id @default(cuid())
  userId       String    @unique
  user         User      @relation(fields: [userId], references: [id])
  plan          Plan     @default(MONTHLY)
  status        SubStatus @default(ACTIVE)
  startDate     DateTime
  endDate       DateTime
  autoRenew     Boolean   @default(true)
  createdAt     DateTime  @default(now())
}

enum Plan {
  MONTHLY
  PER_COURSE
}

enum SubStatus {
  ACTIVE
  EXPIRED
  CANCELLED
  PENDING
}

model Course {
  id          String    @id @default(cuid())
  title       String
  description String
  thumbnail   String?
  grade       Int       // 1, 2, or 3
  price       Float     @default(0)
  isPublished Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  chapters    Chapter[]
  enrollments Enrollment[]
  purchases   Purchase[]
}

model Chapter {
  id      String    @id @default(cuid())
  courseId String
  course   Course   @relation(fields: [courseId], references: [id])
  title   String
  order   Int
  
  lectures Lecture[]
}

model Lecture {
  id          String    @id @default(cuid())
  chapterId  String
  chapter     Chapter   @relation(fields: [chapterId], references: [id])
  title       String
  description String?
  videoUrl    String    // YouTube URL
  pdfUrl      String?
  duration    Int?      // seconds
  order       Int
  isFree      Boolean   @default(false)
  
  progress    Progress[]
}

model Enrollment {
  id        String    @id @default(cuid())
  userId    String
  courseId  String
  user      User      @relation(fields: [userId], references: [id])
  course    Course    @relation(fields: [courseId], references: [id])
  progress  Float     @default(0)
  createdAt DateTime  @default(now())
  
  @@unique([userId, courseId])
}

model Purchase {
  id        String    @id @default(cuid())
  userId    String
  courseId  String?
  lectureId String?
  amount    Float
  status    String    @default("completed")
  createdAt DateTime  @default(now())
}

model Progress {
  id         String   @id @default(cuid())
  userId     String
  lectureId  String
  user       User     @relation(fields: [userId], references: [id])
  lecture    Lecture  @relation(fields: [lectureId], references: [id])
  watchedSeconds Int @default(0)
  completed  Boolean  @default(false)
  lastPosition Int   @default(0)
  updatedAt  DateTime @updatedAt
  
  @@unique([userId, lectureId])
}

model Exam {
  id        String    @id @default(cuid())
  courseId  String
  title     String
  type      ExamType @default(QUIZ)
  duration  Int?     // minutes, null = unlimited
  passingScore Int   @default(60)
  questions Json     // Array of question objects
  createdAt DateTime  @default(now())
}

enum ExamType {
  QUIZ
  CHAPTER_EXAM
  FINAL_EXAM
}

model ExamResult {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  examId    String
  score     Float
  answers   Json
  timeTaken Int?      // seconds
  createdAt DateTime  @default(now())
}

model Message {
  id        String    @id @default(cuid())
  senderId  String
  receiverId String
  content   String
  attachments String[]
  isRead    Boolean   @default(false)
  createdAt DateTime  @default(now())
  
  sender    User      @relation(fields: [senderId], references: [id])
}

model Notification {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  type      String
  title     String
  message   String
  data      Json?
  isRead    Boolean   @default(false)
  createdAt DateTime  @default(now())
}

model ActivityLog {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  action    String
  details   Json?
  ipAddress String?
  createdAt DateTime  @default(now())
}

model Ticket {
  id        String    @id @default(cuid())
  userId    String
  category  String
  priority  String    @default("medium")
  status    String    @default("open")
  subject   String
  messages  TicketMessage[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model TicketMessage {
  id        String    @id @default(cuid())
  ticketId  String
  ticket    Ticket    @relation(fields: [ticketId], references: [id])
  senderId  String
  content   String
  createdAt DateTime  @default(now())
}
```

### API Routes Structure

```
/api
├── auth
│   ├── register        POST   - Admin registration (first only)
│   ├── login           POST   - Authentication
│   ├── logout          POST   - Clear session
│   ├── verify-otp      POST   - Email verification
│   ├── forgot-password POST   - Send reset link
│   ├── reset-password  POST   - Set new password
│   └── me              GET    - Current user
├── users
│   ├── GET             - List users (admin)
│   ├── POST            - Create user (admin)
│   ├── GET    /:id     - Get user
│   ├── PUT    /:id     - Update user
│   ├── DELETE /:id     - Delete user (admin)
│   └── GET    /:id/activity - Activity log
├── courses
│   ├── GET             - List courses (filtered by grade)
│   ├── POST            - Create course (admin)
│   ├── GET    /:id     - Course details
│   ├── PUT    /:id     - Update course (admin)
│   └── DELETE /:id     - Delete course (admin)
├── chapters
│   ├── POST            - Create chapter
│   ├── PUT    /:id     - Update chapter
│   └── DELETE /:id     - Delete chapter
├── lectures
│   ├── POST            - Create lecture
│   ├── PUT    /:id     - Update lecture
│   └── DELETE /:id     - Delete lecture
├── enrollments
│   ├── GET             - My enrollments
│   └── POST            - Enroll in course
├── progress
│   ├── GET             - My progress
│   └── POST            - Update progress
├── subscriptions
│   ├── GET             - My subscription
│   ├── POST            - Subscribe
│   └── PUT    /:id     - Update subscription
├── exams
│   ├── GET             - List exams
│   ├── GET    /:id     - Get exam questions
│   ├── POST   /:id/submit - Submit answers
│   └── GET    /:id/result - Get result
├── messages
│   ├── GET             - Conversation list
│   ├── GET    /:id     - Messages with user
│   └── POST           - Send message
├── notifications
│   ├── GET             - My notifications
│   └── PUT    /:id/read - Mark as read
├── tickets
│   ├── GET             - List tickets
│   ├── POST            - Create ticket
│   ├── GET    /:id     - Ticket details
│   └── POST   /:id/reply - Reply to ticket
└── admin
    ├── analytics       - Dashboard stats
    ├── students        - Student management
    ├── exports          - CSV export
    └── settings         - Platform settings
```

### Security Measures

1. **Authentication**
   - JWT tokens in httpOnly cookies
   - CSRF protection
   - Rate limiting on auth endpoints
   - Password hashing with bcrypt (12 rounds)

2. **Authorization**
   - Role-based middleware on all admin routes
   - Resource ownership checks
   - Subscription validation before content access

3. **Data Protection**
   - Input sanitization on all endpoints
   - SQL injection prevention via Prisma
   - XSS prevention via React's default escaping
   - File upload validation (type, size)

4. **API Security**
   - CORS configuration
   - Helmet.js for headers
   - Request validation with Zod

---

## 7. File Structure

```
/gelvano
├── prisma/
│   └── schema.prisma
├── public/
│   ├── images/
│   └── files/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── verify-otp/
│   │   │   └── forgot-password/
│   │   ├── (student)/
│   │   │   ├── dashboard/
│   │   │   ├── courses/
│   │   │   ├── learn/[lectureId]/
│   │   │   ├── exams/
│   │   │   ├── messages/
│   │   │   ├── notifications/
│   │   │   ├── profile/
│   │   │   └── subscriptions/
│   │   ├── (admin)/
│   │   │   ├── admin/
│   │   │   ├── admin/students/
│   │   │   ├── admin/courses/
│   │   │   ├── admin/exams/
│   │   │   └── admin/settings/
│   │   ├── api/
│   │   │   └── [routes...]
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/          # Base components
│   │   ├── forms/       # Form components
│   │   ├── layout/      # Layout components
│   │   ├── student/     # Student-specific
│   │   └── admin/       # Admin-specific
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── utils.ts
│   │   └── validations.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useSubscription.ts
│   │   └── ...
│   ├── store/
│   │   └── index.ts
│   └── types/
│       └── index.ts
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 8. Development Phases

### Phase 1: Foundation (Current)
- [x] Project setup
- [x] Database schema
- [x] Authentication (register, login, OTP)
- [x] Basic admin dashboard
- [x] Basic student portal
- [x] Course listing and detail
- [x] Video player integration

### Phase 2: Core Features
- [ ] Subscription system
- [ ] Progress tracking
- [ ] Notifications
- [ ] Messaging system
- [ ] Support tickets

### Phase 3: Assessment
- [ ] Quiz creation (admin)
- [ ] Quiz taking (student)
- [ ] Auto-grading
- [ ] Results display

### Phase 4: Polish
- [ ] Dark/light mode
- [ ] Mobile responsiveness
- [ ] Animations
- [ ] Performance optimization

### Phase 5: Advanced
- [ ] AI chatbot
- [ ] Leaderboard
- [ ] Certificates
- [ ] Analytics dashboard
- [ ] Payment integration
