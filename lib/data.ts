import { createClient } from "@/lib/supabase/server";
import {
  calculateProductivityScore,
  getDefaultDateRange,
} from "@/lib/calculateProductivity";
import type {
  Employee,
  EmployeeWithProductivity,
  AttendanceRecord,
  ProjectTask,
  CandidateAnalysis,
} from "@/types";

export async function getEmployeesWithProductivity(
  dateRange = getDefaultDateRange()
): Promise<EmployeeWithProductivity[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: employees } = await supabase
    .from("employees")
    .select("*")
    .eq("hr_id", user.id)
    .order("name");

  if (!employees?.length) return [];

  const result: EmployeeWithProductivity[] = [];

  for (const emp of employees as Employee[]) {
    const { data: attendance } = await supabase
      .from("attendance")
      .select("*")
      .eq("employee_id", emp.id)
      .gte("date", dateRange.start)
      .lte("date", dateRange.end);

    const { data: tasks } = await supabase
      .from("project_tasks")
      .select("*")
      .eq("employee_id", emp.id);

    const productivity = calculateProductivityScore(
      (attendance || []) as AttendanceRecord[],
      (tasks || []) as ProjectTask[],
      dateRange
    );

    result.push({ ...emp, productivity });
  }

  return result;
}

export async function getDashboardStats() {
  const employees = await getEmployeesWithProductivity();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: candidates } = await supabase
    .from("candidate_analyses")
    .select("*")
    .eq("hr_id", user?.id || "")
    .order("created_at", { ascending: false });

  const candidateList = (candidates || []) as CandidateAnalysis[];

  const avgProductivity =
    employees.length > 0
      ? Math.round(
          employees.reduce((sum, e) => sum + e.productivity.score, 0) / employees.length
        )
      : 0;

  return {
    totalEmployees: employees.length,
    avgProductivity,
    highPerformers: employees.filter((e) => e.productivity.level === "HIGH").length,
    lowPerformers: employees.filter(
      (e) => e.productivity.level === "LOW" || e.flagged_for_review
    ).length,
    totalCandidates: candidateList.length,
    strongFitCandidates: candidateList.filter(
      (c) => c.recommendation === "Strong Fit"
    ).length,
    employees,
    candidates: candidateList,
  };
}

export async function getEmployeeById(id: string) {
  const supabase = await createClient();
  const { data: employee } = await supabase
    .from("employees")
    .select("*")
    .eq("id", id)
    .single();

  if (!employee) return null;

  const { data: attendance } = await supabase
    .from("attendance")
    .select("*")
    .eq("employee_id", id)
    .order("date");

  const { data: tasks } = await supabase
    .from("project_tasks")
    .select("*")
    .eq("employee_id", id);

  const dateRange = getDefaultDateRange();
  const productivity = calculateProductivityScore(
    (attendance || []) as AttendanceRecord[],
    (tasks || []) as ProjectTask[],
    dateRange
  );

  return {
    employee,
    attendance: attendance || [],
    tasks: tasks || [],
    productivity,
  };
}

export async function getCandidateById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("candidate_analyses")
    .select("*")
    .eq("id", id)
    .single();
  return data as CandidateAnalysis | null;
}
