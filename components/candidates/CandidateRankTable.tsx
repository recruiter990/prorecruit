"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFitScoreColor, getRecommendationColor, formatDate } from "@/lib/utils";
import type { CandidateAnalysis } from "@/types";

interface CandidateRankTableProps {
  candidates: CandidateAnalysis[];
}

export function CandidateRankTable({ candidates }: CandidateRankTableProps) {
  if (candidates.length === 0) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="py-12 text-center text-gray-600 dark:text-gray-300">
          No candidates analyzed yet. Start a new analysis to see results here.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg text-gray-800 dark:text-gray-100">Candidate Rankings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-3 py-3 text-left font-medium text-gray-700 dark:text-gray-200">Rank</th>
                <th className="px-3 py-3 text-left font-medium text-gray-700 dark:text-gray-200">Candidate</th>
                <th className="px-3 py-3 text-left font-medium text-gray-700 dark:text-gray-200">Job Title</th>
                <th className="px-3 py-3 text-left font-medium text-gray-700 dark:text-gray-200">Fit Score</th>
                <th className="px-3 py-3 text-left font-medium text-gray-700 dark:text-gray-200">Recommendation</th>
                <th className="px-3 py-3 text-left font-medium text-gray-700 dark:text-gray-200">Date</th>
                <th className="px-3 py-3 text-left font-medium text-gray-700 dark:text-gray-200">Action</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c, index) => (
                <tr key={c.id} className="border-b border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-3 py-3 font-bold text-[#6366F1]">#{index + 1}</td>
                  <td className="px-3 py-3 font-medium text-gray-800 dark:text-gray-100">{c.candidate_name}</td>
                  <td className="px-3 py-3 text-gray-500 dark:text-gray-400">{c.job_title}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${c.fit_score || 0}%`,
                            backgroundColor: getFitScoreColor(c.fit_score || 0),
                          }}
                        />
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">{c.fit_score}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <Badge className={getRecommendationColor(c.recommendation || "")}>
                      {c.recommendation}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-gray-500 dark:text-gray-400">
                    {formatDate(c.created_at)}
                  </td>
                  <td className="px-3 py-3">
                    <Link href={`/candidates/${c.id}`}>
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
