# GELVANO - منصة تعليم الفيزياء

<div align="center">

![GELVANO Logo](https://img.shields.io/badge/GELVANO-Education%20Platform-6366F1?style=for-the-badge)

**منصة تعليمية متكاملة لدراسة الفيزياء للمرحلة الثانوية في مصر**

*Developed by Mohamed El-Manzalawy | Instructor: Mr. Khaled Osama*

</div>

---

## 🎯 نظرة عامة

GELVANO هي منصة تعليمية SaaS متكاملة مصممة خصيصاً للطلاب المصريون في المرحلة الثانوية (الصف الأول والثاني والثالث الثانوي - شعبة علوم). تجمع المنصة بين:

- 🎓 محتوى تعليمي عالي الجودة (أسلوب Udemy)
- 🎬 واجهة جذابة (أسلوب Netflix)
- 📚 إدارة التعلم (أسلوب LMS)
- 📊 لوحة تحكم إدارية قوية (أسلوب SaaS Dashboard)

---

## ✨ المميزات الرئيسية

### 👥 نظام المستخدمين
- [x] تسجيل دخول/خروج آمن
- [x] التحقق من البريد الإلكتروني (OTP)
- [x] استعادة كلمة المرور
- [x] حسابات متعددة المستويات (طالب، مدير، سوبر أدمن)

### 📚 نظام الدورات
- [x] دورات مصنفة حسب الصف الدراسي
- [x] فصول ومحاضرات منظمة
- [x] فيديوهات YouTube مدمجة
- [x] ملاحظات PDF لكل محاضرة
- [x] تصفية ذكية حسب الصف

### 💳 نظام الاشتراكات
- [x] اشتراك شهري
- [x] اشتراك لكل دورة
- [x] محتوى مقفل/مفتوح

### 📊 لوحة تحكم المدير
- [x] إدارة الطلاب
- [x] إدارة الدورات
- [x] لوحة تحليلات
- [x] نظام تذاكر الدعم

### 👨‍🎓 بوابة الطالب
- [x] لوحة تحكم شخصية
- [x] تصفح الدورات
- [x] تتبع التقدم
- [x] الإشعارات
- [x] الرسائل
- [x] الاختبارات
- [x] التصنيف

---

## 🛠️ التقنيات المستخدمة

### Frontend
- **Next.js 14** - React Framework مع App Router
- **TypeScript** - Type Safety
- **TailwindCSS** - Styling
- **React Query** - Server State Management
- **Zustand** - Client State Management
- **Lucide React** - Icons

### Backend
- **Next.js API Routes** - REST API
- **Prisma** - ORM
- **SQLite** - Database (قابل للترقية لـ PostgreSQL)
- **NextAuth.js** - Authentication

### Security
- **bcryptjs** - Password Hashing
- **JWT** - Session Management
- **Zod** - Input Validation

---

## 📦 التثبيت

### المتطلبات
- Node.js 18+
- npm أو yarn

### خطوات التثبيت

```bash
# استنساخ المشروع
git clone <repo-url>
cd gelvano

# تثبيت الحزم
npm install

# إعداد قاعدة البيانات
npx prisma generate
npx prisma db push

# تشغيل الخادم
npm run dev
```

### بناء للإنتاج

```bash
npm run build
npm start
```

---

## 🔐 متغيرات البيئة

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 📁 هيكل المشروع

```
gelvano/
├── prisma/
│   └── schema.prisma        # قاعدة البيانات
├── public/                  # الملفات الثابتة
├── src/
│   ├── app/                # الصفحات (App Router)
│   │   ├── (auth)/         # صفحات المصادقة
│   │   ├── (student)/      # صفحات الطالب
│   │   ├── (admin)/        # صفحات المدير
│   │   └── api/            # API Routes
│   ├── components/          # المكونات
│   │   ├── ui/             # مكونات UI الأساسية
│   │   ├── layout/         # مكونات التخطيط
│   │   ├── student/         # مكونات الطالب
│   │   └── admin/          # مكونات المدير
│   ├── lib/                 # المكتبات
│   ├── hooks/               # React Hooks
│   ├── store/               # Zustand Store
│   └── types/               # TypeScript Types
├── SPEC.md                  # المواصفات التقنية
└── package.json
```

---

## 🎨 التصميم

### نظام الألوان
- **Primary**: `#6366F1` (Indigo)
- **Secondary**: `#10B981` (Emerald)
- **Accent**: `#F59E0B` (Amber)
- **Background**: `#0F172A` (Dark)
- **Surface**: `#1E293B` (Card Dark)

### الخطوط
- **Cairo** - للنص العربي
- **Inter** - للنص اللاتيني

### RTL Support
- كامل للدعم العربي

---

## 🔒 الأمان

- تشفير كلمات المرور بـ bcrypt (12 rounds)
- RBAC (Role-Based Access Control)
- حماية API Routes
- Validation مع Zod
- Rate Limiting للحماية من Brute Force

---

## 📝 الترخيص

هذا المشروع مخصص للاستخدام التعليمي.

---

## 👨‍💻 المطور

**Mohamed El-Manzalawy**
- Email: moha147wa@gmail.com
- Phone: 01003092656

---

## 👨‍🏫 المدرب

**Mr. Khaled Osama**
- Physics Instructor

---

<div align="center">

صُنع بـ ❤️ للطلاب المصريون

</div>
