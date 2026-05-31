import { TopBar } from "@/components/layout/TopBar";
import { PerformanceCard } from "@/components/performance/PerformanceCard";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { getDashboardStats } from "@/lib/data";
import { getRecommendationColor } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Award, AlertTriangle, Target, Star } from "lucide-react";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const chartData = stats.employees
    .sort((a, b) => b.productivity.score - a.productivity.score)
    .slice(0, 10)
    .map((e) => ({
      name: e.name.split(" ")[0],
      score: e.productivity.score,
      level: e.productivity.level,
    }));

  const recCounts = {
    "Strong Fit": 0,
    "Good Fit": 0,
    "Partial Fit": 0,
    "Not Recommended": 0,
  };
  stats.candidates.forEach((c) => {
    if (c.recommendation && c.recommendation in recCounts) {
      recCounts[c.recommendation as keyof typeof recCounts]++;
    }
  });

  const pieData = Object.entries(recCounts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  return (
    <div>
      <TopBar
        title="Dashboard"
        description="Overview of employee performance and candidate intelligence"
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <PerformanceCard title="Total Employees" value={stats.totalEmployees} icon={<Users className="h-5 w-5" />} />
        <PerformanceCard title="Avg Productivity" value={`${stats.avgProductivity}%`} icon={<TrendingUp className="h-5 w-5" />} />
        <PerformanceCard title="High Performers" value={stats.highPerformers} variant="success" icon={<Award className="h-5 w-5" />} />
        <PerformanceCard title="Low Performers" value={stats.lowPerformers} variant="danger" icon={<AlertTriangle className="h-5 w-5" />} />
        <PerformanceCard title="Candidates Analyzed" value={stats.totalCandidates} icon={<Target className="h-5 w-5" />} />
        <PerformanceCard title="Strong Fit" value={stats.strongFitCandidates} variant="success" icon={<Star className="h-5 w-5" />} />
      </div>

      <DashboardCharts chartData={chartData} pieData={pieData} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-100">Recent Candidate Analyses</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.candidates.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300 text-sm">No candidates analyzed yet</p>
            ) : (
              <div className="space-y-3">
                {stats.candidates.slice(0, 5).map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                    <div>
                      <p className="font-medium text-sm text-gray-800 dark:text-gray-100">{c.candidate_name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{c.job_title}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#6366F1]">{c.fit_score}%</p>
                      <Badge className={`text-xs ${getRecommendationColor(c.recommendation || "")}`}>
                        {c.recommendation}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-100">Recent Employee Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.employees.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300 text-sm">No employees yet</p>
            ) : (
              <div className="space-y-3">
                {stats.employees.slice(0, 5).map((e) => (
                  <div key={e.id} className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                    <div>
                      <p className="font-medium text-sm text-gray-800 dark:text-gray-100">{e.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{e.department || "No department"}</p>
                    </div>
                    <Badge
                      variant={
                        e.productivity.level === "HIGH" ? "success" :
                        e.productivity.level === "MEDIUM" ? "warning" : "danger"
                      }
                    >
                      {e.productivity.score}% — {e.productivity.level}
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
