"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFitScoreColor } from "@/lib/utils";

interface ChartDataPoint {
  name: string;
  score: number;
  level: "HIGH" | "MEDIUM" | "LOW";
}

interface ProductivityChartProps {
  data: ChartDataPoint[];
  trendData?: { week: string; score: number }[];
}

function getBarColor(level: string) {
  if (level === "HIGH") return "#22C55E";
  if (level === "MEDIUM") return "#F59E0B";
  return "#EF4444";
}

export function ProductivityChart({ data, trendData }: ProductivityChartProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg text-gray-800 dark:text-gray-100">Productivity Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bar">
          <TabsList className="mb-4">
            <TabsTrigger value="bar" className="text-gray-900 dark:text-white">Bar Chart</TabsTrigger>
            <TabsTrigger value="line" className="text-gray-900 dark:text-white">Line Chart</TabsTrigger>
          </TabsList>
          <TabsContent value="bar">
            {data.length === 0 ? (
              <p className="py-12 text-center text-gray-600 dark:text-gray-300">No employee data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fill: "#6B7280" }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      color: "#0A0A0A",
                    }}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={index} fill={getBarColor(entry.level)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </TabsContent>
          <TabsContent value="line">
            {(!trendData || trendData.length === 0) ? (
              <p className="py-12 text-center text-gray-600 dark:text-gray-300">No trend data available</p>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="week" tick={{ fill: "#6B7280" }} />
                  <YAxis tick={{ fill: "#6B7280" }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      color: "#0A0A0A",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#6366F1"
                    strokeWidth={2}
                    dot={{ fill: "#6366F1" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export function FitScoreGauge({ score }: { score: number }) {
  const color = getFitScoreColor(score);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-3xl font-bold" style={{ color }}>
          {score}
        </span>
        <span className="block text-xs text-gray-500 dark:text-gray-400">% fit</span>
      </div>
    </div>
  );
}
