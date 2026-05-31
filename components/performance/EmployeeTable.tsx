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
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="py-12 text-center text-gray-600 dark:text-gray-300">
          No employees yet. Upload attendance CSV to get started.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg text-gray-800 dark:text-gray-100">Employee Performance</CardTitle>
        <Button variant="ghost" size="sm" className="text-gray-900 dark:text-white" onClick={() => setSortAsc(!sortAsc)}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Sort by score {sortAsc ? "↑" : "↓"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-3 py-3 text-left font-medium text-gray-700 dark:text-gray-200">Name</th>
                <th className="px-3 py-3 text-left font-medium text-gray-700 dark:text-gray-200">Department</th>
                <th className="px-3 py-3 text-left font-medium text-gray-700 dark:text-gray-200">Attendance %</th>
                <th className="px-3 py-3 text-left font-medium text-gray-700 dark:text-gray-200">Tasks Completed</th>
                <th className="px-3 py-3 text-left font-medium text-gray-700 dark:text-gray-200">Score</th>
                <th className="px-3 py-3 text-left font-medium text-gray-700 dark:text-gray-200">Status</th>
                <th className="px-3 py-3 text-left font-medium text-gray-700 dark:text-gray-200">Action</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((emp) => (
                <tr key={emp.id} className="border-b border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-3 py-3 font-medium text-gray-800 dark:text-gray-100">{emp.name}</td>
                  <td className="px-3 py-3 text-gray-500 dark:text-gray-400">{emp.department || "—"}</td>
                  <td className="px-3 py-3 text-gray-800 dark:text-gray-100">{emp.productivity.attendancePercent}%</td>
                  <td className="px-3 py-3 text-gray-800 dark:text-gray-100">
                    {emp.productivity.tasksCompleted}/{emp.productivity.totalTasks}
                  </td>
                  <td className="px-3 py-3 font-semibold text-gray-800 dark:text-gray-100">{emp.productivity.score}</td>
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
                      <Button variant="ghost" size="sm" className="text-gray-900 dark:text-white">
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
