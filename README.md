# ProRecruit

Full-stack HR SaaS web application for employee performance tracking and AI-powered candidate intelligence.

## Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** + shadcn/ui components
- **Recharts** for data visualization
- **Supabase** (PostgreSQL + Auth)
- **OpenAI GPT-4o** for resume-job matching
- **Papa Parse** (CSV), **pdf-parse** / **mammoth** (resumes)
- **Cheerio** for job description scraping

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL in `supabase/schema.sql` in the Supabase SQL Editor
3. Copy your project URL and anon key

### 3. Configure environment

Copy `.env.local.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

### Employee Performance Module
- CSV upload for attendance and project tasks
- Productivity score calculation (attendance + tasks)
- Bar/line charts, sortable employee table
- Individual employee detail with calendar heatmap

### Candidate Intelligence Module
- Job URL scraping with manual fallback
- PDF/DOCX resume parsing
- GPT-4o fit analysis with skills matching
- Ranked candidate table and PDF report download

## Deploy to Vercel

1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Add environment variables from `.env.local`
4. Deploy

## CSV Formats

**Attendance:**
```
Employee Name, Email, Date, Status, Hours Worked
John Smith, john@company.com, 2025-01-15, present, 8
```

**Project Tasks:**
```
Employee Email, Project Name, Task Name, Status, Due Date, Completion Date, Priority
john@company.com, Website Redesign, Build homepage, completed, 2025-01-20, 2025-01-18, high
```
