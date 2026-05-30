"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, truncateText } from "@/lib/utils";
import { toast } from "sonner";

interface ResumeUploaderProps {
  onResumeParsed: (data: { text: string; candidateName: string; file: File }) => void;
}

export function ResumeUploader({ onResumeParsed }: ResumeUploaderProps) {
  const [candidateName, setCandidateName] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const uploaded = acceptedFiles[0];
      if (!uploaded) return;
      setFile(uploaded);
      setLoading(true);

      const formData = new FormData();
      formData.append("file", uploaded);

      try {
        const res = await fetch("/api/parse-resume", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.error) {
          toast.error(data.error);
          return;
        }
        setResumeText(data.text);
        if (!candidateName && data.candidateName) {
          setCandidateName(data.candidateName);
        }
        onResumeParsed({
          text: data.text,
          candidateName: candidateName || data.candidateName,
          file: uploaded,
        });
        toast.success("Resume parsed successfully");
      } catch {
        toast.error("Failed to parse resume");
      } finally {
        setLoading(false);
      }
    },
    [candidateName, onResumeParsed]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Step 2 — Candidate Resume</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="candidateName">Candidate Name</Label>
          <Input
            id="candidateName"
            placeholder="John Smith"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
          />
        </div>

        <div
          {...getRootProps()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-8 transition-colors hover:border-primary/50",
            isDragActive && "border-primary bg-primary/5"
          )}
        >
          <input {...getInputProps()} />
          {loading ? (
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          ) : (
            <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
          )}
          <p className="text-sm text-muted-foreground">
            Upload resume (.pdf or .docx)
          </p>
          {file && (
            <p className="mt-2 text-xs text-primary">{file.name}</p>
          )}
        </div>

        {resumeText && (
          <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <button
              type="button"
              className="flex w-full items-center justify-between text-sm font-medium"
              onClick={() => setExpanded(!expanded)}
            >
              Extracted Text Preview
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            <p className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap">
              {expanded ? resumeText : truncateText(resumeText, 300)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
