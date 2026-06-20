# GELVANO EdTech Platform

## Project Overview
- Full-stack Next.js 14 education platform for Egyptian secondary school physics
- Built for Instructor: Mr. Khaled Osama, Developer: Mohamed El-Manzalawy

## Tech Stack
- Next.js 14 (App Router), TypeScript, TailwindCSS
- Prisma ORM, SQLite (upgradeable to PostgreSQL)
- NextAuth.js for authentication

## Key Features Implemented
- Multi-role system (Student, Admin, Super Admin)
- OTP email verification
- Course/Chapter/Lecture hierarchy
- Subscription system
- Exam system with MCQ
- Progress tracking
- Notifications & messaging
- Analytics dashboard
- Arabic RTL support

## Project Status
- Build: ✅ Successful
- Pages: ✅ All routes created
- Database: ✅ SQLite connected
- Development server: ✅ Running on port 3000

## Build Commands
```bash
npm install           # Install dependencies
npx prisma generate  # Generate Prisma client
npx prisma db push    # Create database tables
npm run dev          # Start development server
npm run build        # Production build
```

## Important Notes
- Next.js 14.2 has a security vulnerability - upgrade to latest version
- nodemailer version must match NextAuth peer dependency (^7.0.7)
- Always add `export const dynamic = 'force-dynamic'` to API routes that use session
- Wrap components using `useSearchParams` in `<Suspense>` boundaries
- Use `Set<string>` explicitly when creating Sets from array maps
