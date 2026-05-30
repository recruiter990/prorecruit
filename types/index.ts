export type AttendanceStatus = "present" | "absent" | "late" | "half_day";
export type TaskStatus = "completed" | "in_progress" | "pending" | "overdue";
export type TaskPriority = "high" | "medium" | "low";
export type PerformanceLevel = "HIGH" | "MEDIUM" | "LOW";
export type Recommendation =
  | "Strong Fit"
  | "Good Fit"
  | "Partial Fit"
  | "Not Recommended";

export interface Employee {
  id: string;
  hr_id: string;
  name: string;
  email: string | null;
  department: string | null;
  position: string | null;
  flagged_for_review?: boolean;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  status: AttendanceStatus;
  hours_worked: number | null;
  created_at: string;
}

export interface ProjectTask {
  id: string;
  employee_id: string;
  project_name: string;
  task_name: string;
  status: TaskStatus;
  due_date: string | null;
  completion_date: string | null;
  priority: TaskPriority;
  created_at: string;
}

export interface CandidateAnalysis {
  id: string;
  hr_id: string;
  candidate_name: string | null;
  job_title: string | null;
  job_url: string | null;
  job_description: string | null;
  resume_text: string | null;
  fit_score: number | null;
  match_summary: string | null;
  matched_skills: string[] | null;
  missing_skills: string[] | null;
  experience_gap: string | null;
  recommendation: Recommendation | null;
  ai_full_analysis: string | null;
  notes?: string | null;
  created_at: string;
}

export interface AttendanceCSVRow {
  "Employee Name": string;
  Email: string;
  Date: string;
  Status: string;
  "Hours Worked": string;
}

export interface ProjectCSVRow {
  "Employee Email": string;
  "Project Name": string;
  "Task Name": string;
  Status: string;
  "Due Date": string;
  "Completion Date": string;
  Priority: string;
}

export interface ProductivityResult {
  score: number;
  level: PerformanceLevel;
  attendanceScore: number;
  taskScore: number;
  attendancePercent: number;
  tasksCompleted: number;
  totalTasks: number;
}

export interface EmployeeWithProductivity extends Employee {
  productivity: ProductivityResult;
}

export interface AIAnalysisResult {
  fit_score: number;
  recommendation: Recommendation;
  match_summary: string;
  matched_skills: string[];
  missing_skills: string[];
  experience_gap: string;
  strengths: string[];
  concerns: string[];
  interview_questions: string[];
  salary_expectation_alignment: string;
  overall_verdict: string;
}

export interface JobScrapeResult {
  jobTitle?: string;
  company?: string;
  description?: string;
  extractedSkills?: string[];
  error?: string;
}

export interface UserProfile {
  full_name?: string;
  company_name?: string;
  groq_api_key?: string;
}
