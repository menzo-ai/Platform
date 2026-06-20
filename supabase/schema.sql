-- GELVANO Education Platform - Supabase Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'ADMIN', 'SUPER_ADMIN', 'CONTENT_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN')),
    phone VARCHAR(20),
    parentName VARCHAR(255),
    parentPhone VARCHAR(20),
    schoolYear INTEGER CHECK (schoolYear IN (1, 2, 3)),
    profileImage TEXT,
    isActive BOOLEAN DEFAULT true,
    isVerified BOOLEAN DEFAULT false,
    otpCode VARCHAR(6),
    otpExpiresAt TIMESTAMP,
    lastLogin TIMESTAMP,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail TEXT,
    grade INTEGER NOT NULL CHECK (grade IN (1, 2, 3)),
    price DECIMAL(10, 2) DEFAULT 0,
    isPublished BOOLEAN DEFAULT false,
    isFeatured BOOLEAN DEFAULT false,
    createdBy UUID REFERENCES users(id),
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);

-- Chapters Table
CREATE TABLE IF NOT EXISTS chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    courseId UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    orderIndex INTEGER DEFAULT 0,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);

-- Lectures Table
CREATE TABLE IF NOT EXISTS lectures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapterId UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    videoUrl TEXT,
    pdfUrl TEXT,
    duration INTEGER,
    isFree BOOLEAN DEFAULT false,
    orderIndex INTEGER DEFAULT 0,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);

-- Enrollments Table
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    courseId UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    enrolledAt TIMESTAMP DEFAULT NOW(),
    completedAt TIMESTAMP,
    UNIQUE(userId, courseId)
);

-- Progress Table
CREATE TABLE IF NOT EXISTS progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lectureId UUID NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    completedAt TIMESTAMP,
    watchTime INTEGER DEFAULT 0,
    UNIQUE(userId, lectureId)
);

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('MONTHLY', 'QUARTERLY', 'YEARLY', 'PER_COURSE')),
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'CANCELLED', 'PENDING')),
    startDate TIMESTAMP DEFAULT NOW(),
    endDate TIMESTAMP,
    autoRenew BOOLEAN DEFAULT false,
    createdAt TIMESTAMP DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    isRead BOOLEAN DEFAULT false,
    link TEXT,
    createdAt TIMESTAMP DEFAULT NOW()
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    senderId UUID NOT NULL REFERENCES users(id),
    receiverId UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    isRead BOOLEAN DEFAULT false,
    createdAt TIMESTAMP DEFAULT NOW()
);

-- Tickets Table
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID NOT NULL REFERENCES users(id),
    subject VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('support', 'payment', 'technical', 'content')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'pending', 'resolved', 'closed')),
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);

-- Ticket Messages Table
CREATE TABLE IF NOT EXISTS ticket_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticketId UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    senderId UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW()
);

-- Exams Table
CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    courseId UUID REFERENCES courses(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) DEFAULT 'chapter_exam',
    duration INTEGER DEFAULT 30,
    passingScore INTEGER DEFAULT 60,
    questions JSONB NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW()
);

-- Exam Attempts Table
CREATE TABLE IF NOT EXISTS exam_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    examId UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    userId UUID NOT NULL REFERENCES users(id),
    answers JSONB,
    score INTEGER,
    startedAt TIMESTAMP DEFAULT NOW(),
    completedAt TIMESTAMP,
    timeSpent INTEGER
);

-- Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID NOT NULL REFERENCES users(id),
    courseId UUID NOT NULL REFERENCES courses(id),
    score INTEGER,
    certificateId VARCHAR(100) UNIQUE,
    issuedAt TIMESTAMP DEFAULT NOW(),
    expiresAt TIMESTAMP,
    UNIQUE(userId, courseId)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_courses_grade ON courses(grade);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(userId);
CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(userId);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(userId);
CREATE INDEX IF NOT EXISTS idx_tickets_user ON tickets(userId);

SELECT '✅ GELVANO Schema Created Successfully!' as status;