"use client";

import { useState } from "react";
import { Link2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface JobLinkInputProps {
  onJobFetched: (data: {
    jobTitle: string;
    company: string;
    description: string;
    extractedSkills: string[];
    jobUrl: string;
  }) => void;
}

export function JobLinkInput({ onJobFetched }: JobLinkInputProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manualDescription, setManualDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const handleFetch = async () => {
    if (!url.trim()) {
      toast.error("Please enter a job URL");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/scrape-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
        setShowManual(true);
        return;
      }
      setJobTitle(data.jobTitle || "");
      setCompany(data.company || "");
      setSkills(data.extractedSkills || []);
      onJobFetched({
        jobTitle: data.jobTitle || "Unknown Role",
        company: data.company || "",
        description: data.description,
        extractedSkills: data.extractedSkills || [],
        jobUrl: url,
      });
      toast.success("Job description fetched successfully");
    } catch {
      toast.error("Failed to fetch job. Please paste manually.");
      setShowManual(true);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = () => {
    if (!manualDescription.trim()) {
      toast.error("Please paste a job description");
      return;
    }
    onJobFetched({
      jobTitle: jobTitle || "Custom Role",
      company: company || "",
      description: manualDescription,
      extractedSkills: skills,
      jobUrl: url,
    });
    toast.success("Job description saved");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Step 1 — Job Input</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="jobUrl">Paste job URL (LinkedIn, Indeed, etc.)</Label>
          <div className="flex gap-2">
            <Input
              id="jobUrl"
              placeholder="https://linkedin.com/jobs/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button onClick={handleFetch} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Link2 className="mr-2 h-4 w-4" />
                  Fetch
                </>
              )}
            </Button>
          </div>
        </div>

        {(showManual || manualDescription) && (
          <div className="space-y-2">
            <Label htmlFor="manualDesc">Paste job description manually</Label>
            <Textarea
              id="manualDesc"
              rows={8}
              placeholder="Paste the full job description here..."
              value={manualDescription}
              onChange={(e) => setManualDescription(e.target.value)}
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                placeholder="Job Title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
              <Input
                placeholder="Company Name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={handleManualSubmit}>
              Use Manual Description
            </Button>
          </div>
        )}

        {jobTitle && !showManual && (
          <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-2">
            <p className="font-semibold">{jobTitle}</p>
            {company && <p className="text-sm text-muted-foreground">{company}</p>}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
