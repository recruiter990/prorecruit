"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { JobLinkInput } from "@/components/candidates/JobLinkInput";
import { ResumeUploader } from "@/components/candidates/ResumeUploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface JobData {
  jobTitle: string;
  company: string;
  description: string;
  extractedSkills: string[];
  jobUrl: string;
}

interface ResumeData {
  text: string;
  candidateName: string;
}

export default function NewCandidatePage() {
  const router = useRouter();
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [candidateName, setCandidateName] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!jobData?.description) {
      toast.error("Please provide a job description first");
      return;
    }
    if (!resumeData?.text) {
      toast.error("Please upload a resume first");
      return;
    }

    setAnalyzing(true);
    try {
      const res = await fetch("/api/analyze-candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: jobData.description,
          resumeText: resumeData.text,
          candidateName: candidateName || resumeData.candidateName,
          jobTitle: jobData.jobTitle,
          jobUrl: jobData.jobUrl,
        }),
      });

      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success("Analysis complete!");
      router.push(`/candidates/${data.id}`);
    } catch {
      toast.error("Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div>
      <TopBar
        title="New Candidate Analysis"
        description="Analyze how well a candidate fits a job opening"
      />

      <div className="space-y-6 max-w-3xl">
        <JobLinkInput onJobFetched={setJobData} />

        <ResumeUploader
          onResumeParsed={(data) => {
            setResumeData({ text: data.text, candidateName: data.candidateName });
            if (data.candidateName) setCandidateName(data.candidateName);
          }}
        />

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            {analyzing ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <Loader2 className="h-12 w-12 animate-spin text-[#6366F1]" />
                <p className="text-lg font-medium text-gray-900 dark:text-white">ProRecruit AI is analyzing the candidate...</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">This may take 15-30 seconds</p>
              </div>
            ) : (
              <Button
                className="w-full"
                size="lg"
                onClick={handleAnalyze}
                disabled={!jobData || !resumeData}
              >
                Analyze Candidate
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
