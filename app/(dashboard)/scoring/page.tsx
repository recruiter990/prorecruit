"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { extractSkillsFromText } from "@/lib/extractSkills";
import { toast } from "sonner";

interface UploadedCandidate {
  id: string;
  file: File;
  name: string;
  resumeText: string;
}

interface ScoredCandidate {
  name: string;
  fit_score: number;
  recommendation: string;
  matched_skills: string[];
  missing_skills: string[];
  experience_gap: string;
  key_strength: string;
  summary: string;
}

interface ScoreResponse {
  best_candidate: string;
  analysis_summary: string;
  candidates: ScoredCandidate[];
}

const LOADING_STEPS = [
  { label: "Parsing job description", start: 0, end: 5 },
  { label: "Reading candidate resumes", start: 5, end: 10 },
  { label: "AI is analyzing each candidate", start: 10, end: 15 },
  { label: "Calculating fit scores", start: 15, end: 20 },
];

function getScoreMeta(score: number) {
  if (score >= 80) return { color: "#22C55E", label: "Strong Fit" };
  if (score >= 60) return { color: "#F59E0B", label: "Good Fit" };
  if (score >= 40) return { color: "#F97316", label: "Partial Fit" };
  return { color: "#EF4444", label: "Not Recommended" };
}

function ScoreGauge({ score }: { score: number }) {
  const { color } = getScoreMeta(score);
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r="40" fill="none" stroke="#334155" strokeWidth="8" />
        <circle
          cx="48"
          cy="48"
          r="40"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 48 48)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold" style={{ color }}>
          {score}
        </span>
      </div>
    </div>
  );
}

export default function ScoringPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [jdTab, setJdTab] = useState("paste");
  const [skills, setSkills] = useState<string[]>([]);
  const [candidates, setCandidates] = useState<UploadedCandidate[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [results, setResults] = useState<ScoreResponse | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (jobDescription.trim()) {
      setSkills(extractSkillsFromText(jobDescription));
    } else {
      setSkills([]);
    }
  }, [jobDescription]);

  const onJdDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    try {
      if (file.name.toLowerCase().endsWith(".txt")) {
        const text = await file.text();
        setJobDescription(text);
        toast.success("Job description loaded");
      } else if (file.name.toLowerCase().endsWith(".pdf")) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/parse-resume", { method: "POST", body: formData });
        const data = await res.json();
        if (data.error) {
          toast.error(data.error);
          return;
        }
        setJobDescription(data.text);
        toast.success("Job description extracted from PDF");
      }
    } catch {
      toast.error("Failed to read file");
    }
  }, []);

  const jdDropzone = useDropzone({
    onDrop: onJdDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
  });

  const onResumeDrop = useCallback(async (files: File[]) => {
    const remaining = 10 - candidates.length;
    const toAdd = files.slice(0, remaining);
    if (files.length > remaining) {
      toast.error("Maximum 10 resume files allowed");
    }

    for (const file of toAdd) {
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        toast.error(`${file.name}: only PDF files supported`);
        continue;
      }
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/parse-resume", { method: "POST", body: formData });
        const data = await res.json();
        const name =
          data.candidateName && data.candidateName !== "Unknown Candidate"
            ? data.candidateName
            : file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");

        setCandidates((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${file.name}`,
            file,
            name,
            resumeText: data.text || "",
          },
        ]);
      } catch {
        toast.error(`Failed to parse ${file.name}`);
      }
    }
  }, [candidates.length]);

  const resumeDropzone = useDropzone({
    onDrop: onResumeDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 10,
  });

  const removeCandidate = (id: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
  };

  const canAnalyze = jobDescription.trim().length > 0 && candidates.length > 0;

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setAnalyzing(true);
    setShowResults(false);
    setResults(null);
    setProgress(0);
    setActiveStep(0);

    const startTime = Date.now();
    const duration = 20000;

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      const stepIndex = LOADING_STEPS.findIndex(
        (s) => elapsed >= s.start * 1000 && elapsed < s.end * 1000
      );
      if (stepIndex >= 0) setActiveStep(stepIndex);
      if (elapsed >= duration) {
        clearInterval(progressInterval);
      }
    }, 100);

    let apiResult: ScoreResponse | null = null;
    try {
      const res = await fetch("/api/score-candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription,
          candidates: candidates.map((c) => ({
            name: c.name,
            resumeText: c.resumeText,
          })),
        }),
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
        setAnalyzing(false);
        clearInterval(progressInterval);
        return;
      }
      apiResult = data;
    } catch {
      toast.error("Analysis failed");
      setAnalyzing(false);
      clearInterval(progressInterval);
      return;
    }

    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, duration - elapsed);
    await new Promise((r) => setTimeout(r, remaining));

    clearInterval(progressInterval);
    setProgress(100);
    setActiveStep(LOADING_STEPS.length);

    if (apiResult) {
      setResults(apiResult);
      setTimeout(() => {
        setShowResults(true);
        setAnalyzing(false);
      }, 300);
    } else {
      setAnalyzing(false);
    }
  };

  const sortedCandidates = useMemo(() => {
    if (!results?.candidates) return [];
    return [...results.candidates].sort((a, b) => b.fit_score - a.fit_score);
  }, [results]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div>
      <TopBar
        title="AI Candidate Scoring"
        description="Upload a job description and candidate resumes to receive instant AI-powered scores"
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left — Input */}
        <div className="space-y-6">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="text-lg">Job Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={jdTab} onValueChange={setJdTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="paste" className="flex-1">
                    Paste Text
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="flex-1">
                    Upload File
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="paste" className="mt-4">
                  <Textarea
                    rows={8}
                    placeholder="Paste the full job description here"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="resize-none"
                  />
                </TabsContent>
                <TabsContent value="upload" className="mt-4">
                  <div
                    {...jdDropzone.getRootProps()}
                    className={cn(
                      "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-8 transition-colors hover:border-primary/50",
                      jdDropzone.isDragActive && "border-primary bg-primary/5"
                    )}
                  >
                    <input {...jdDropzone.getInputProps()} />
                    <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">PDF or TXT only</p>
                  </div>
                </TabsContent>
              </Tabs>

              {skills.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Required skills detected
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        className="bg-blue-500/20 text-blue-400 border-blue-500/30"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="text-lg">Candidates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                {...resumeDropzone.getRootProps()}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-8 transition-colors hover:border-primary/50",
                  resumeDropzone.isDragActive && "border-primary bg-primary/5"
                )}
              >
                <input {...resumeDropzone.getInputProps()} />
                <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drop multiple PDF resumes (max 10)
                </p>
              </div>

              {candidates.length > 0 && (
                <div className="space-y-2">
                  {candidates.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-[#0F172A]/50 px-3 py-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 shrink-0 text-primary" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{c.file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatSize(c.file.size)} · {c.name}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCandidate(c.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-sm text-muted-foreground">
                {candidates.length} candidate{candidates.length !== 1 ? "s" : ""} ready to
                analyze
              </p>
            </CardContent>
          </Card>

          <Button
            size="lg"
            className={cn(
              "w-full h-12 text-base btn-primary-glow",
              !canAnalyze && "opacity-50 cursor-not-allowed"
            )}
            disabled={!canAnalyze || analyzing}
            onClick={handleAnalyze}
          >
            {analyzing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze All Candidates"
            )}
          </Button>
        </div>

        {/* Right — Results */}
        <div>
          <Card className="dashboard-card min-h-[500px]">
            <CardHeader>
              <CardTitle className="text-lg">Results</CardTitle>
            </CardHeader>
            <CardContent>
              {!analyzing && !showResults && (
                <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                  <FileText className="mb-4 h-12 w-12 opacity-40" />
                  <p>Upload a job description and resumes, then click Analyze</p>
                </div>
              )}

              {analyzing && (
                <div className="space-y-6 py-4">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#334155]">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="space-y-4">
                    {LOADING_STEPS.map((step, i) => {
                      const done = activeStep > i || progress >= 100;
                      const current = activeStep === i && progress < 100;
                      return (
                        <div
                          key={step.label}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                            current && "bg-primary/10 border border-primary/30",
                            done && "opacity-80"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                              done
                                ? "bg-success text-white"
                                : current
                                  ? "bg-primary text-white"
                                  : "bg-[#334155] text-muted-foreground"
                            )}
                          >
                            {done ? "✓" : i + 1}
                          </div>
                          <span
                            className={cn(
                              "text-sm",
                              current ? "text-foreground font-medium" : "text-muted-foreground"
                            )}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {showResults && results && (
                <div className="animate-fade-in space-y-6">
                  <div className="rounded-2xl border border-primary/40 bg-primary/10 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-primary mb-1">
                      Top Candidate
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {results.best_candidate}
                      <span className="ml-2 text-primary">
                        {sortedCandidates[0]?.fit_score}%
                      </span>
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {results.analysis_summary}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {sortedCandidates.map((c, i) => (
                        <Badge
                          key={c.name}
                          variant="outline"
                          className={cn(
                            i === 0 && "border-amber-400/50 text-amber-400",
                            i === 1 && "border-slate-400/50 text-slate-300",
                            i === 2 && "border-orange-600/50 text-orange-400"
                          )}
                        >
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}{" "}
                          {c.name} — {c.fit_score}%
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {sortedCandidates.map((candidate, index) => {
                    const meta = getScoreMeta(candidate.fit_score);
                    const isTop = index === 0;
                    return (
                      <div
                        key={candidate.name}
                        className={cn(
                          "relative rounded-2xl border bg-[#0F172A]/40 p-5 transition-all",
                          isTop
                            ? "border-amber-400/60 shadow-[0_0_24px_rgba(251,191,36,0.15)]"
                            : "border-border"
                        )}
                      >
                        {isTop && (
                          <Badge className="absolute right-4 top-4 bg-amber-500/20 text-amber-400 border-amber-500/40">
                            Top Candidate
                          </Badge>
                        )}
                        <div className="flex gap-4">
                          <ScoreGauge score={candidate.fit_score} />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg">{candidate.name}</h3>
                            <Badge
                              className="mt-1"
                              style={{
                                backgroundColor: `${meta.color}20`,
                                color: meta.color,
                                borderColor: `${meta.color}40`,
                              }}
                            >
                              {meta.label}
                            </Badge>
                            <p className="mt-2 text-sm text-muted-foreground">
                              {candidate.summary}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              <strong className="text-foreground">Strength: </strong>
                              {candidate.key_strength}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {candidate.experience_gap}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-1">
                              {candidate.matched_skills?.map((s) => (
                                <Badge key={s} variant="success" className="text-xs">
                                  {s}
                                </Badge>
                              ))}
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {candidate.missing_skills?.map((s) => (
                                <Badge key={s} variant="danger" className="text-xs">
                                  {s}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
