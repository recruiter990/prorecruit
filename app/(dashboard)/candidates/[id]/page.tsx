"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { FitScoreCard } from "@/components/candidates/FitScoreCard";
import { GapAnalysisCard } from "@/components/candidates/GapAnalysisCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { CandidateAnalysis, AIAnalysisResult } from "@/types";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { DetailPageSkeleton } from "@/components/dashboard/DashboardSkeletons";

export default function CandidateDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [candidate, setCandidate] = useState<CandidateAnalysis | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("candidate_analyses")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setCandidate(data);
        setNotes(data.notes || "");
        if (data.ai_full_analysis) {
          try {
            setAnalysis(JSON.parse(data.ai_full_analysis));
          } catch {
            /* ignore */
          }
        }
      }
      setLoading(false);
    }
    load();
  }, [id, supabase]);

  const handleSaveNotes = async () => {
    const { error } = await supabase
      .from("candidate_analyses")
      .update({ notes })
      .eq("id", id);
    if (error) {
      toast.error("Failed to save notes");
      return;
    }
    toast.success("Notes saved");
  };

  const handleDownload = () => {
    if (!candidate || !analysis) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("ProRecruit Analysis Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Candidate: ${candidate.candidate_name}`, 20, 35);
    doc.text(`Job: ${candidate.job_title}`, 20, 42);
    doc.text(`Fit Score: ${candidate.fit_score}%`, 20, 49);
    doc.text(`Recommendation: ${candidate.recommendation}`, 20, 56);
    doc.text("Summary:", 20, 65);
    const summaryLines = doc.splitTextToSize(candidate.match_summary || "", 170);
    doc.text(summaryLines, 20, 72);
    doc.text("Overall Verdict:", 20, 90);
    const verdictLines = doc.splitTextToSize(analysis.overall_verdict || "", 170);
    doc.text(verdictLines, 20, 97);
    doc.save(`${candidate.candidate_name}-analysis.pdf`);
    toast.success("Report downloaded");
  };

  if (loading) {
    return <DetailPageSkeleton />;
  }

  if (!candidate) {
    return <p className="py-12 text-center text-gray-600 dark:text-gray-300">Analysis not found</p>;
  }

  return (
    <div>
      <Link href="/candidates" className="mb-4 inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Candidates
      </Link>

      <FitScoreCard
        candidateName={candidate.candidate_name || "Unknown"}
        jobTitle={candidate.job_title || "Unknown Role"}
        fitScore={candidate.fit_score || 0}
        recommendation={candidate.recommendation || "Partial Fit"}
        matchSummary={candidate.match_summary || ""}
      />

      <div className="my-6 grid gap-6 lg:grid-cols-2">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-100">✅ Matched Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(candidate.matched_skills as string[] || []).map((skill) => (
                <Badge key={skill} variant="success">{skill}</Badge>
              ))}
              {(!candidate.matched_skills || (candidate.matched_skills as string[]).length === 0) && (
                <p className="text-sm text-gray-600 dark:text-gray-300">No matched skills identified</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 dark:text-gray-100">❌ Missing Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(candidate.missing_skills as string[] || []).map((skill) => (
                <Badge key={skill} variant="danger">{skill}</Badge>
              ))}
              {(!candidate.missing_skills || (candidate.missing_skills as string[]).length === 0) && (
                <p className="text-sm text-gray-600 dark:text-gray-300">No missing skills identified</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <GapAnalysisCard experienceGap={candidate.experience_gap || "No gap analysis available."} />
      </div>

      {analysis && (
        <>
          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800 dark:text-gray-100">Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {analysis.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800 dark:text-gray-100">Concerns</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  {analysis.concerns?.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 dark:text-gray-100">Suggested Interview Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-3 text-sm text-gray-600 dark:text-gray-300">
                {analysis.interview_questions?.map((q, i) => (
                  <li key={i} className="leading-relaxed">{q}</li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className="mb-6 border-[#6366F1]/30 bg-[#6366F1]/5">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 dark:text-gray-100">Overall Verdict</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {analysis.overall_verdict}
              </p>
              {analysis.salary_expectation_alignment && (
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <strong className="text-gray-900 dark:text-white">Salary Alignment: </strong>
                  {analysis.salary_expectation_alignment}
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" disabled className="text-success border-success/30">
          <Check className="mr-2 h-4 w-4" />
          Saved
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="text-gray-900 dark:text-white">Add Notes</Button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-white">Candidate Notes</DialogTitle>
            </DialogHeader>
            <Textarea
              rows={6}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your notes about this candidate..."
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400"
            />
            <Button onClick={handleSaveNotes}>Save Notes</Button>
          </DialogContent>
        </Dialog>

        <Button variant="outline" onClick={handleDownload} className="text-gray-900 dark:text-white">
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>
    </div>
  );
}
