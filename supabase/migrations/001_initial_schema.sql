-- ============================================
-- GELVANO EDUCATION PLATFORM - DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM (
  'SUPER_ADMIN',
  'ADMIN',
  'CONTENT_ADMIN',
  'FINANCE_ADMIN',
  'SUPPORT_ADMIN',
  'STUDENT'
);

CREATE TYPE school_year AS ENUM (
  'FIRST_SECONDARY',
  'SECOND_SECONDARY', 
  'THIRD_SECONDARY'
);

CREATE TYPE school_type AS ENUM (
  'GENERAL',
  'AZHARI'
);

CREATE TYPE subscription_status AS ENUM (
  'ACTIVE',
  'PENDING',
  'FAILED',
  'CANCELLED',
  'EXPIRED'
);

CREATE TYPE payment_method AS ENUM (
  'PAYMOB',
  'FAWRY',
  'WALLET',
  'COUPON'
);

CREATE TYPE student_level AS ENUM (
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
  'EXPERT'
);

CREATE TYPE exam_status AS ENUM (
  'NOT_STARTED',
  'IN_PROGRESS',
  'COMPLETED',
  'GRADED'
);

-- ============================================
-- PROFILES (Extended User Info)
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  parent_name TEXT,
  parent_phone TEXT,
  student_id TEXT UNIQUE,
  school_year school_year DEFAULT 'FIRST_SECONDARY',
  school_type school_type DEFAULT 'GENERAL',
  grade TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'STUDENT',
  is_verified BOOLEAN DEFAULT FALSE,
  is_banned BOOLEAN DEFAULT FALSE,
  ban_reason TEXT,
  xp_points INTEGER DEFAULT 0,
  level student_level DEFAULT 'BEGINNER',
  level_title TEXT DEFAULT 'مبتدئ',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COURSES
-- ============================================

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  price DECIMAL(10, 2) DEFAULT 0,
  school_year school_year NOT NULL,
  school_type school_type NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  total_students INTEGER DEFAULT 0,
  total_lectures INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CHAPTERS
-- ============================================

CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  total_lectures INTEGER DEFAULT 0,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LECTURES
-- ============================================

CREATE TABLE lectures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  video_duration INTEGER DEFAULT 0,
  pdf_url TEXT,
  notes TEXT,
  order_index INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT TRUE,
  views INTEGER DEFAULT 0,
  completion_rate DECIMAL(5, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SUBSCRIPTIONS
-- ============================================

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status subscription_status DEFAULT 'PENDING',
  amount DECIMAL(10, 2) NOT NULL,
  payment_method payment_method,
  payment_id TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- ============================================
-- PROGRESS TRACKING
-- ============================================

CREATE TABLE lecture_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lecture_id UUID NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT FALSE,
  watch_time INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lecture_id)
);

CREATE TABLE course_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  completion_percentage DECIMAL(5, 2) DEFAULT 0,
  completed_chapters INTEGER DEFAULT 0,
  total_chapters INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

-- ============================================
-- EXAMS
-- ============================================

CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER DEFAULT 60,
  total_marks INTEGER DEFAULT 100,
  passing_marks INTEGER DEFAULT 60,
  questions_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  school_year school_year,
  school_type school_type,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exam_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'MCQ',
  options JSONB,
  correct_answer TEXT,
  marks INTEGER DEFAULT 1,
  order_index INTEGER DEFAULT 0
);

CREATE TABLE exam_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  answers JSONB,
  score INTEGER,
  status exam_status DEFAULT 'NOT_STARTED',
  started_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  graded_at TIMESTAMPTZ,
  graded_by UUID REFERENCES profiles(id)
);

-- ============================================
-- XP & ACHIEVEMENTS SYSTEM
-- ============================================

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  xp_reward INTEGER DEFAULT 0,
  badge_color TEXT DEFAULT 'bronze',
  requirement_type TEXT,
  requirement_value INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE level_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level student_level NOT NULL UNIQUE,
  title TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  min_xp INTEGER DEFAULT 0,
  max_xp INTEGER,
  badge_color TEXT DEFAULT 'bronze'
);

-- ============================================
-- WALLET & PAYMENTS
-- ============================================

CREATE TABLE wallet (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  balance DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID NOT NULL REFERENCES wallet(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  reference_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  method payment_method NOT NULL,
  status subscription_status DEFAULT 'PENDING',
  gateway_ref TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COUPONS
-- ============================================

CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT DEFAULT 'PERCENTAGE',
  discount_value DECIMAL(10, 2) NOT NULL,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE coupon_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(coupon_id, user_id)
);

-- ============================================
-- SUPPORT & MESSAGES
-- ============================================

CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT DEFAULT 'MEDIUM',
  status TEXT DEFAULT 'OPEN',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ticket_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_admin_reply BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_one UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant_two UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FORUM
-- ============================================

CREATE TABLE forum_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  tags TEXT[],
  views INTEGER DEFAULT 0,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE forum_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  parent_id UUID REFERENCES forum_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACTIVITY LOG
-- ============================================

CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_school_year ON profiles(school_year);
CREATE INDEX idx_profiles_school_type ON profiles(school_type);
CREATE INDEX idx_profiles_level ON profiles(level);
CREATE INDEX idx_profiles_xp ON profiles(xp_points DESC);

CREATE INDEX idx_courses_school_year ON courses(school_year);
CREATE INDEX idx_courses_school_type ON courses(school_type);
CREATE INDEX idx_courses_published ON courses(is_published);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_course ON subscriptions(course_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

CREATE INDEX idx_progress_user ON lecture_progress(user_id);
CREATE INDEX idx_progress_lecture ON lecture_progress(lecture_id);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

CREATE INDEX idx_activity_user ON activity_log(user_id);
CREATE INDEX idx_activity_created ON activity_log(created_at);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecture_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view/edit their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admin policies
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() 
      AND role IN ('SUPER_ADMIN', 'ADMIN', 'CONTENT_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN')
    )
  );

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() 
      AND role IN ('SUPER_ADMIN', 'ADMIN')
    )
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_lectures_updated_at
  BEFORE UPDATE ON lectures
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Generate student ID
CREATE OR REPLACE FUNCTION generate_student_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.student_id IS NULL THEN
    NEW.student_id := 'GEL' || TO_CHAR(NOW(), 'YY') || LPAD(CAST(NEXTVAL('student_seq') AS TEXT), 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for student IDs
CREATE SEQUENCE IF NOT EXISTS student_seq START 1;

CREATE TRIGGER set_student_id
  BEFORE INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION generate_student_id();

-- XP Level calculation
CREATE OR REPLACE FUNCTION calculate_level(xp INTEGER)
RETURNS TABLE(level student_level, title TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE
      WHEN xp >= 10000 THEN 'EXPERT'::student_level
      WHEN xp >= 5000 THEN 'ADVANCED'::student_level
      WHEN xp >= 1000 THEN 'INTERMEDIATE'::student_level
      ELSE 'BEGINNER'::student_level
    END,
    CASE
      WHEN xp >= 10000 THEN 'خبير'
      WHEN xp >= 5000 THEN 'متقدم'
      WHEN xp >= 1000 THEN 'متوسط'
      ELSE 'مبتدئ'
    END;
END;
$$ LANGUAGE plpgsql;

-- Update level on XP change
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.xp_points != OLD.xp_points THEN
    UPDATE profiles
    SET level = calculate_level(NEW.xp_points).level,
        level_title = calculate_level(NEW.xp_points).title
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_level_on_xp_change
  AFTER UPDATE OF xp_points ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_user_level();

-- ============================================
-- SEED DATA: Level Milestones
-- ============================================

INSERT INTO level_milestones (level, title, title_ar, min_xp, max_xp, badge_color) VALUES
  ('BEGINNER', 'Beginner', 'مبتدئ', 0, 999, 'bronze'),
  ('INTERMEDIATE', 'Intermediate', 'متوسط', 1000, 4999, 'silver'),
  ('ADVANCED', 'Advanced', 'متقدم', 5000, 9999, 'gold'),
  ('EXPERT', 'Expert', 'خبير', 10000, NULL, 'platinum');

-- ============================================
-- SEED DATA: Achievements
-- ============================================

INSERT INTO achievements (title, description, xp_reward, badge_color, requirement_type, requirement_value) VALUES
  ('First Login', 'سجل دخولك первый раз', 10, 'bronze', 'LOGIN_COUNT', 1),
  ('Active Learner', 'أكمل 10 محاضرات', 50, 'silver', 'LECTURES_COMPLETED', 10),
  ('Course Master', 'أكمل كورس كامل', 100, 'gold', 'COURSES_COMPLETED', 1),
  ('Quiz Champion', 'أجيب 90% في اختبار', 75, 'silver', 'EXAM_SCORE', 90),
  ('Helpful Member', 'ساعد 5 طلاب', 50, 'bronze', 'HELPFUL_ACTIONS', 5),
  ('Night Owl', 'ادرس بعد midnight', 25, 'bronze', 'NIGHT_STUDY', 1),
  ('Early Bird', 'ادرس قبل 6 صباحاً', 25, 'bronze', 'EARLY_STUDY', 1),
  ('XP Hunter', 'اجمع 1000 XP', 100, 'silver', 'TOTAL_XP', 1000),
  ('XP Master', 'اجمع 5000 XP', 250, 'gold', 'TOTAL_XP', 5000),
  ('XP Legend', 'اجمع 10000 XP', 500, 'platinum', 'TOTAL_XP', 10000);
