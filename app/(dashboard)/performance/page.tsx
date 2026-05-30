"use client";

import { useEffect, useState, useCallback } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { PerformanceCard } from "@/components/performance/PerformanceCard";
import { ProductivityChart } from "@/components/performance/ProductivityChart";
import { EmployeeTable } from "@/components/performance/EmployeeTable";
import { AttendanceUploader } from "@/components/performance/AttendanceUploader";
import { ProjectUploader } from "@/components/performance/ProjectUploader";
import { createClient } from "@/lib/supabase/client";
import { calculateProductivityScore, getDefaultDateRange } from "@/lib/calculateProductivity";
import type { Employee, EmployeeWithProductivity, AttendanceRecord, ProjectTask } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, TrendingUp, Award, AlertTriangle } from "lucide-react";
import { PerformancePageSkeleton } from "@/components/dashboard/DashboardSkeletons";

export default function PerformancePage() {
  const [employees, setEmployees] = useState<EmployeeWithProductivity[]>([]);
  const [filtered, setFiltered] = useState<EmployeeWithProductivity[]>([]);
  const [department, setDepartment] = useState("all");
  const [departments, setDepartments] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const loadData = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: emps } = await supabase
      .from("employees")
      .select("*")
      .eq("hr_id", user.id)
      .order("name");

    if (!emps?.length) {
      setEmployees([]);
      setFiltered([]);
      setLoading(false);
      return;
    }

    const withProductivity: EmployeeWithProductivity[] = [];

    for (const emp of emps as Employee[]) {
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

      withProductivity.push({ ...emp, productivity });
    }

    setEmployees(withProductivity);
    setFiltered(withProductivity);
    setDepartments(
      Array.from(
        new Set(withProductivity.map((e) => e.department).filter(Boolean) as string[])
      )
    );
    setLoading(false);
  }, [supabase, dateRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    let result = employees;
    if (department !== "all") {
      result = result.filter((e) => e.department === department);
    }
    setFiltered(result);
  }, [department, employees]);

  const avgScore =
    employees.length > 0
      ? Math.round(employees.reduce((s, e) => s + e.productivity.score, 0) / employees.length)
      : 0;

  const chartData = filtered.map((e) => ({
    name: e.name.split(" ")[0],
    score: e.productivity.score,
    level: e.productivity.level,
  }));

  const trendData = [
    { week: "Week 1", score: Math.max(0, avgScore - 15) },
    { week: "Week 2", score: Math.max(0, avgScore - 10) },
    { week: "Week 3", score: Math.max(0, avgScore - 5) },
    { week: "Week 4", score: avgScore },
  ];

  return (
    <div>
      <TopBar
        title="Employee Performance"
        description="Track attendance and project productivity"
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PerformanceCard title="Total Employees" value={employees.length} icon={<Users className="h-5 w-5" />} />
        <PerformanceCard title="Avg Productivity" value={`${avgScore}%`} icon={<TrendingUp className="h-5 w-5" />} />
        <PerformanceCard
          title="High Performers"
          value={employees.filter((e) => e.productivity.level === "HIGH").length}
          variant="success"
          icon={<Award className="h-5 w-5" />}
        />
        <PerformanceCard
          title="Low Performers"
          value={employees.filter((e) => e.productivity.level === "LOW").length}
          variant="danger"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <AttendanceUploader onSuccess={loadData} />
        <ProjectUploader onSuccess={loadData} />
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <div className="space-y-1">
          <Label>Department</Label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Start Date</Label>
          <Input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="w-[180px]"
          />
        </div>
        <div className="space-y-1">
          <Label>End Date</Label>
          <Input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="w-[180px]"
          />
        </div>
      </div>

      {loading ? (
        <PerformancePageSkeleton />
      ) : (
        <>
          <div className="mb-8">
            <ProductivityChart data={chartData} trendData={trendData} />
          </div>
          <EmployeeTable employees={filtered} />
        </>
      )}
    </div>
  );
}
