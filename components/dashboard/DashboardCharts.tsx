"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PIE_COLORS = ["#22C55E", "#6366F1", "#F59E0B", "#EF4444"];

interface DashboardChartsProps {
  chartData: { name: string; score: number; level: string }[];
  pieData: { name: string; value: number }[];
}

export function DashboardCharts({ chartData, pieData }: DashboardChartsProps) {
  return (
    <div className="mb-8 grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top 10 Employees by Productivity</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No employee data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" tick={{ fill: "#94A3B8" }} />
                  <YAxis tick={{ fill: "#94A3B8" }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1E293B",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="score" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Candidate Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No candidates yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1E293B",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
