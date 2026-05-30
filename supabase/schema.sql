-- Employees table
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hr_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  department TEXT,
  position TEXT,
  flagged_for_review BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance records (parsed from CSV upload)
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('present', 'absent', 'late', 'half_day')),
  hours_worked DECIMAL(4,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project tasks
CREATE TABLE project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  task_name TEXT NOT NULL,
  status TEXT CHECK (status IN ('completed', 'in_progress', 'pending', 'overdue')),
  due_date DATE,
  completion_date DATE,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Candidate analyses
CREATE TABLE candidate_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hr_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  candidate_name TEXT,
  job_title TEXT,
  job_url TEXT,
  job_description TEXT,
  resume_text TEXT,
  fit_score INTEGER CHECK (fit_score BETWEEN 0 AND 100),
  match_summary TEXT,
  matched_skills JSONB,
  missing_skills JSONB,
  experience_gap TEXT,
  recommendation TEXT CHECK (recommendation IN ('Strong Fit', 'Good Fit', 'Partial Fit', 'Not Recommended')),
  ai_full_analysis TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "HR owns their employees" ON employees FOR ALL USING (hr_id = auth.uid());
CREATE POLICY "HR owns their analyses" ON candidate_analyses FOR ALL USING (hr_id = auth.uid());

-- Attendance & tasks policies via employee ownership
CREATE POLICY "HR owns attendance via employee" ON attendance FOR ALL
  USING (EXISTS (SELECT 1 FROM employees WHERE employees.id = attendance.employee_id AND employees.hr_id = auth.uid()));

CREATE POLICY "HR owns tasks via employee" ON project_tasks FOR ALL
  USING (EXISTS (SELECT 1 FROM employees WHERE employees.id = project_tasks.employee_id AND employees.hr_id = auth.uid()));

-- Indexes
CREATE INDEX idx_attendance_employee_date ON attendance(employee_id, date);
CREATE INDEX idx_project_tasks_employee ON project_tasks(employee_id);
CREATE INDEX idx_candidate_analyses_hr ON candidate_analyses(hr_id, fit_score DESC);
