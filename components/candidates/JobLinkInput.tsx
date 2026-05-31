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
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg text-gray-800 dark:text-gray-100">Step 1 — Job Input</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="jobUrl" className="text-gray-700 dark:text-gray-200">Paste job URL (LinkedIn, Indeed, etc.)</Label>
          <div className="flex gap-2">
            <Input
              id="jobUrl"
              placeholder="https://linkedin.com/jobs/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400"
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
            <Label htmlFor="manualDesc" className="text-gray-700 dark:text-gray-200">Paste job description manually</Label>
            <Textarea
              id="manualDesc"
              rows={8}
              placeholder="Paste the full job description here..."
              value={manualDescription}
              onChange={(e) => setManualDescription(e.target.value)}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400"
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                placeholder="Job Title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400"
              />
              <Input
                placeholder="Company Name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>
            <Button variant="outline" onClick={handleManualSubmit} className="text-gray-900 dark:text-white">
              Use Manual Description
            </Button>
          </div>
        )}

        {jobTitle && !showManual && (
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 p-4 space-y-2">
            <p className="font-semibold text-gray-800 dark:text-gray-100">{jobTitle}</p>
            {company && <p className="text-sm text-gray-600 dark:text-gray-300">{company}</p>}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600">
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
