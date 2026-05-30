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
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No candidates analyzed yet. Start a new analysis to see results here.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Candidate Rankings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="px-3 py-3 text-left font-medium">Rank</th>
                <th className="px-3 py-3 text-left font-medium">Candidate</th>
                <th className="px-3 py-3 text-left font-medium">Job Title</th>
                <th className="px-3 py-3 text-left font-medium">Fit Score</th>
                <th className="px-3 py-3 text-left font-medium">Recommendation</th>
                <th className="px-3 py-3 text-left font-medium">Date</th>
                <th className="px-3 py-3 text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c, index) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="px-3 py-3 font-bold text-primary">#{index + 1}</td>
                  <td className="px-3 py-3 font-medium">{c.candidate_name}</td>
                  <td className="px-3 py-3 text-muted-foreground">{c.job_title}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${c.fit_score || 0}%`,
                            backgroundColor: getFitScoreColor(c.fit_score || 0),
                          }}
                        />
                      </div>
                      <span className="font-semibold">{c.fit_score}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <Badge className={getRecommendationColor(c.recommendation || "")}>
                      {c.recommendation}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">
                    {formatDate(c.created_at)}
                  </td>
                  <td className="px-3 py-3">
                    <Link href={`/candidates/${c.id}`}>
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
