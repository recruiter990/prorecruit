"use client";

import Link from "next/link";
import { ArrowUpDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EmployeeWithProductivity } from "@/types";
import { useState } from "react";

interface EmployeeTableProps {
  employees: EmployeeWithProductivity[];
}

export function EmployeeTable({ employees }: EmployeeTableProps) {
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = [...employees].sort((a, b) =>
    sortAsc
      ? a.productivity.score - b.productivity.score
      : b.productivity.score - a.productivity.score
  );

  if (employees.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No employees yet. Upload attendance CSV to get started.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Employee Performance</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setSortAsc(!sortAsc)}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Sort by score {sortAsc ? "↑" : "↓"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="px-3 py-3 text-left font-medium">Name</th>
                <th className="px-3 py-3 text-left font-medium">Department</th>
                <th className="px-3 py-3 text-left font-medium">Attendance %</th>
                <th className="px-3 py-3 text-left font-medium">Tasks Completed</th>
                <th className="px-3 py-3 text-left font-medium">Score</th>
                <th className="px-3 py-3 text-left font-medium">Status</th>
                <th className="px-3 py-3 text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((emp) => (
                <tr key={emp.id} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="px-3 py-3 font-medium">{emp.name}</td>
                  <td className="px-3 py-3 text-muted-foreground">{emp.department || "—"}</td>
                  <td className="px-3 py-3">{emp.productivity.attendancePercent}%</td>
                  <td className="px-3 py-3">
                    {emp.productivity.tasksCompleted}/{emp.productivity.totalTasks}
                  </td>
                  <td className="px-3 py-3 font-semibold">{emp.productivity.score}</td>
                  <td className="px-3 py-3">
                    <Badge
                      variant={
                        emp.productivity.level === "HIGH"
                          ? "success"
                          : emp.productivity.level === "MEDIUM"
                            ? "warning"
                            : "danger"
                      }
                    >
                      {emp.productivity.level}
                    </Badge>
                  </td>
                  <td className="px-3 py-3">
                    <Link href={`/performance/${emp.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
