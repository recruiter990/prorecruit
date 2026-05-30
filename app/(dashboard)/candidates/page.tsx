import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { CandidateRankTable } from "@/components/candidates/CandidateRankTable";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import type { CandidateAnalysis } from "@/types";
import { Plus } from "lucide-react";

export default async function CandidatesPage({
  searchParams,
}: {
  searchParams: { recommendation?: string; job?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from("candidate_analyses")
    .select("*")
    .eq("hr_id", user?.id || "")
    .order("fit_score", { ascending: false });

  const { data: candidates } = await query;
  let list = (candidates || []) as CandidateAnalysis[];

  if (searchParams.recommendation) {
    list = list.filter((c) => c.recommendation === searchParams.recommendation);
  }
  if (searchParams.job) {
    list = list.filter((c) =>
      c.job_title?.toLowerCase().includes(searchParams.job!.toLowerCase())
    );
  }

  const topCandidate = list[0];

  return (
    <div>
      <TopBar
        title="Candidate Intelligence"
        description="AI-powered resume and job fit analysis"
        action={
          <Link href="/candidates/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Analysis
            </Button>
          </Link>
        }
      />

      {topCandidate && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 p-4 text-center">
          <p className="text-lg">
            🏆 Top Candidate:{" "}
            <span className="font-bold text-primary">{topCandidate.candidate_name}</span>
            {" — "}
            <span className="font-bold">{topCandidate.fit_score}%</span> fit for{" "}
            <span className="font-medium">{topCandidate.job_title}</span>
          </p>
        </div>
      )}

      <CandidateRankTable candidates={list} />
    </div>
  );
}
