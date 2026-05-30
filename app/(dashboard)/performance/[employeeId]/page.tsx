"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowLeft, Flag } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { calculateProductivityScore, getDefaultDateRange } from "@/lib/calculateProductivity";
import type { Employee, AttendanceRecord, ProjectTask } from "@/types";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPerformanceColor } from "@/lib/utils";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  present: "#22C55E",
  absent: "#EF4444",
  late: "#F59E0B",
  half_day: "#6366F1",
};

const TASK_COLORS = ["#22C55E", "#6366F1", "#94A3B8", "#EF4444"];

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.employeeId as string;
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: emp } = await supabase
        .from("employees")
        .select("*")
        .eq("id", employeeId)
        .single();

      if (!emp) {
        router.push("/performance");
        return;
      }

      const { data: att } = await supabase
        .from("attendance")
        .select("*")
        .eq("employee_id", employeeId)
        .order("date");

      const { data: tsk } = await supabase
        .from("project_tasks")
        .select("*")
        .eq("employee_id", employeeId);

      setEmployee(emp);
      setAttendance(att || []);
      setTasks(tsk || []);
      setLoading(false);
    }
    load();
  }, [employeeId, router, supabase]);

  const handleFlag = async () => {
    const { error } = await supabase
      .from("employees")
      .update({ flagged_for_review: true })
      .eq("id", employeeId);
    if (error) {
      toast.error("Failed to flag employee");
      return;
    }
    toast.success("Employee flagged for review");
    setEmployee((prev) => (prev ? { ...prev, flagged_for_review: true } : null));
  };

  if (loading || !employee) {
    return <p className="py-12 text-center text-muted-foreground">Loading...</p>;
  }

  const dateRange = getDefaultDateRange();
  const productivity = calculateProductivityScore(attendance, tasks, dateRange);

  const taskBreakdown = [
    { name: "Completed", value: tasks.filter((t) => t.status === "completed").length },
    { name: "In Progress", value: tasks.filter((t) => t.status === "in_progress").length },
    { name: "Pending", value: tasks.filter((t) => t.status === "pending").length },
    { name: "Overdue", value: tasks.filter((t) => t.status === "overdue").length },
  ].filter((t) => t.value > 0);

  const trendData = [
    { week: "W1", score: Math.max(0, productivity.score - 12) },
    { week: "W2", score: Math.max(0, productivity.score - 8) },
    { week: "W3", score: Math.max(0, productivity.score - 4) },
    { week: "W4", score: productivity.score },
  ];

  const currentMonth = new Date();
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const attendanceMap = new Map(
    attendance.map((a) => [a.date, a.status])
  );

  return (
    <div>
      <Link href="/performance" className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Performance
      </Link>

      <TopBar title={employee.name} description={`${employee.position || "Employee"} · ${employee.department || "No department"}`} />

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Employee Info</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{employee.email || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Position</p>
              <p className="font-medium">{employee.position || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-medium">{employee.department || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Productivity Score</p>
              <Badge className={getPerformanceColor(productivity.level)}>
                {productivity.score}% — {productivity.level}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 gap-4">
            <Button
              variant="outline"
              onClick={handleFlag}
              disabled={employee.flagged_for_review}
              className="w-full"
            >
              <Flag className="mr-2 h-4 w-4" />
              {employee.flagged_for_review ? "Flagged for Review" : "Flag for Review"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const status = attendanceMap.get(dateStr);
                return (
                  <div
                    key={day}
                    title={status || "No data"}
                    className="aspect-square rounded-md flex items-center justify-center text-xs font-medium"
                    style={{
                      backgroundColor: status ? STATUS_COLORS[status] + "40" : "#33415530",
                      border: `1px solid ${status ? STATUS_COLORS[status] : "#334155"}`,
                      color: status ? STATUS_COLORS[status] : "#64748B",
                    }}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Productivity Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="week" tick={{ fill: "#94A3B8" }} />
                <YAxis tick={{ fill: "#94A3B8" }} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "#1E293B", border: "1px solid #334155", borderRadius: "8px" }} />
                <Line type="monotone" dataKey="score" stroke="#6366F1" strokeWidth={2} dot={{ fill: "#6366F1" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Task Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {taskBreakdown.length === 0 ? (
              <p className="text-muted-foreground text-sm">No tasks assigned</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={taskBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {taskBreakdown.map((_, i) => (
                      <Cell key={i} fill={TASK_COLORS[i % TASK_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1E293B", border: "1px solid #334155", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <p className="text-muted-foreground text-sm">No tasks yet</p>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="text-sm font-medium">{task.task_name}</p>
                      <p className="text-xs text-muted-foreground">{task.project_name}</p>
                    </div>
                    <Badge
                      variant={
                        task.status === "completed" ? "success" :
                        task.status === "overdue" ? "danger" :
                        task.status === "in_progress" ? "default" : "outline"
                      }
                    >
                      {task.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
