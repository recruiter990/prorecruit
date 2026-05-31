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
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg text-gray-800 dark:text-gray-100">Step 2 — Candidate Resume</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="candidateName" className="text-gray-700 dark:text-gray-200">Candidate Name</Label>
          <Input
            id="candidateName"
            placeholder="John Smith"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>

        <div
          {...getRootProps()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 transition-colors hover:border-[#6366F1]/50",
            isDragActive && "border-[#6366F1] bg-[#6366F1]/5"
          )}
        >
          <input {...getInputProps()} />
          {loading ? (
            <Loader2 className="h-10 w-10 animate-spin text-[#6366F1]" />
          ) : (
            <Upload className="mb-3 h-10 w-10 text-gray-500 dark:text-gray-400" />
          )}
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Upload resume (.pdf or .docx)
          </p>
          {file && (
            <p className="mt-2 text-xs text-[#6366F1]">{file.name}</p>
          )}
        </div>

        {resumeText && (
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 p-4">
            <button
              type="button"
              className="flex w-full items-center justify-between text-sm font-medium text-gray-800 dark:text-gray-100"
              onClick={() => setExpanded(!expanded)}
            >
              Extracted Text Preview
              {expanded ? <ChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-300" /> : <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-300" />}
            </button>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 whitespace-pre-wrap">
              {expanded ? resumeText : truncateText(resumeText, 300)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
