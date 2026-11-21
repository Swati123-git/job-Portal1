# 💼 JobSphere - AI-Powered Full-Stack Job Portal

A modern, responsive, and feature-packed **Full-Stack Job Portal Web Application** with **AI Resume Analyzer** and **AI Job Recommendations**, built with **React.js (Vite)**, **Node.js (Express)**, and **MySQL**.

---

## 🌟 Key Features

- **🏠 Home Page**: Hero search (keywords, location, category), live platform statistics, categories, featured jobs, and verified employers.
- **🔍 Advanced Job Search & Filters**: Multi-criteria filtering (Employment Type, Workplace Setting, Experience Level, Salary Range), real-time search, and sorting.
- **📄 Job Details & Instant Apply**: Detailed job view, requirements, skills tags, and interactive **"Apply Now" Modal** with resume and cover note.
- **🧠 AI Resume Analyzer**: Upload PDF or DOCX resume to extract text, calculate ATS score (0-100), identify technical/soft skills, highlight strengths & weaknesses, and get section-by-section improvement recommendations using **Google Gemini AI**.
- **✨ AI Job Recommendations**: Smart matching engine that scores and ranks available jobs based on candidate profile, resume skills, experience level, and preferences with explainable match reasons.
- **🏢 Companies Directory**: Company profiles, workplace culture, benefits, employee reviews, and active job listings.
- **📊 Applicant Dashboard & HR Portal**: Application status tracking (*Applied → Under Review → Interview → Shortlisted/Accepted*), candidate shortlisting, and interview scheduler.
- **🔐 JWT Authentication**: Secure user registration, login, and role-based authorization (*job_seeker*, *employer*, *admin*).

---

## 🛠️ Tech Stack

- **Frontend**: React.js 18, Vite 5, React Router v6, Axios, Lucide Icons, Canvas-Confetti
- **Backend**: Node.js, Express.js, REST API, JWT Authentication, bcryptjs, Multer
- **AI Engine**: Google Gemini API (`@google/generative-ai`), `pdf-parse`, `mammoth`
- **Database**: MySQL with connection pooling (`mysql2`)
- **Deployment**: Render (Blueprint `render.yaml` included)

---

## 🚀 Local Development Setup

### 1. Database Setup
Import `backend/config/schema.sql` into your MySQL instance:
```sql
mysql -u root -p < backend/config/schema.sql
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your DB credentials and GEMINI_API_KEY
npm run dev
```

### 3. Frontend Setup
```bash
npm install
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🌐 Deployment on Render

This repository includes a `render.yaml` configuration for automated deployment.

### Steps to Deploy:
1. Push this repository to your **GitHub** account.
2. Sign in to **[Render.com](https://render.com)**.
3. Click **New +** > **Blueprint**.
4. Connect this GitHub repository.
5. Render will automatically detect `render.yaml` and configure:
   - **Backend Web Service**: Node.js API with health checks.
   - **Frontend Static Site**: Vite React build with SPA client routing.
6. Provide your environment variables on Render:
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (from your Cloud MySQL provider like Aiven, Clever Cloud, or TiDB).
   - `GEMINI_API_KEY` (from [Google AI Studio](https://aistudio.google.com/app/apikey)).
   - `VITE_API_BASE_URL` (set to your Render backend URL, e.g., `https://job-portal-backend-xxxx.onrender.com/api`).
7. Click **Apply** to deploy!
