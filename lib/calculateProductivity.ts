import type { AttendanceRecord, ProjectTask, ProductivityResult } from "@/types";

interface DateRange {
  start: string;
  end: string;
}

function classifyScore(score: number): "HIGH" | "MEDIUM" | "LOW" {
  if (score >= 80) return "HIGH";
  if (score >= 50) return "MEDIUM";
  return "LOW";
}

function countWorkingDays(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  let count = 0;
  const current = new Date(startDate);
  while (current <= endDate) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return Math.max(count, 1);
}

export function calculateProductivityScore(
  attendance: AttendanceRecord[],
  tasks: ProjectTask[],
  dateRange?: DateRange
): ProductivityResult {
  let filteredAttendance = attendance;
  let filteredTasks = tasks;

  if (dateRange) {
    filteredAttendance = attendance.filter(
      (a) => a.date >= dateRange.start && a.date <= dateRange.end
    );
    filteredTasks = tasks;
  }

  const presentDays = filteredAttendance.filter((a) => a.status === "present").length;
  const lateDays = filteredAttendance.filter((a) => a.status === "late").length;
  const halfDays = filteredAttendance.filter((a) => a.status === "half_day").length;
  const totalWorkingDays =
    filteredAttendance.length > 0
      ? filteredAttendance.length
      : dateRange
        ? countWorkingDays(dateRange.start, dateRange.end)
        : 22;

  const attendanceNumerator = presentDays + lateDays * 0.75 + halfDays * 0.5;
  const attendanceScore = (attendanceNumerator / totalWorkingDays) * 100;

  const completedTasks = filteredTasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = filteredTasks.filter((t) => t.status === "in_progress").length;
  const overdueTasks = filteredTasks.filter((t) => t.status === "overdue").length;
  const totalTasks = Math.max(filteredTasks.length, 1);

  let taskScore =
    ((completedTasks + inProgressTasks * 0.5) / totalTasks) * 100;
  taskScore = Math.max(0, taskScore - overdueTasks * 10);

  const score = attendanceScore * 0.5 + taskScore * 0.5;
  const attendancePercent =
    totalWorkingDays > 0
      ? Math.round((attendanceNumerator / totalWorkingDays) * 100)
      : 0;

  return {
    score: Math.round(Math.min(100, Math.max(0, score))),
    level: classifyScore(score),
    attendanceScore: Math.round(attendanceScore),
    taskScore: Math.round(taskScore),
    attendancePercent,
    tasksCompleted: completedTasks,
    totalTasks: filteredTasks.length,
  };
}

export function getDefaultDateRange(): DateRange {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}
