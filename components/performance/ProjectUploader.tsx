"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { parseProjectCSV, normalizeTaskStatus } from "@/lib/parseCSV";
import type { ProjectCSVRow } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProjectUploaderProps {
  onSuccess?: () => void;
}

export function ProjectUploader({ onSuccess }: ProjectUploaderProps) {
  const [preview, setPreview] = useState<ProjectCSVRow[]>([]);
  const [allRows, setAllRows] = useState<ProjectCSVRow[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    try {
      const rows = await parseProjectCSV(file);
      setAllRows(rows);
      setPreview(rows.slice(0, 10));
      toast.success(`Parsed ${rows.length} task rows. Review preview before importing.`);
    } catch {
      toast.error("Failed to parse CSV file");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
  });

  const handleImport = async () => {
    if (allRows.length === 0) return;
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Not authenticated");
      setLoading(false);
      return;
    }

    let imported = 0;

    for (const row of allRows) {
      const email = row["Employee Email"]?.trim().toLowerCase();
      if (!email) continue;

      const { data: employee } = await supabase
        .from("employees")
        .select("id")
        .eq("email", email)
        .eq("hr_id", user.id)
        .single();

      if (!employee) continue;

      const status = normalizeTaskStatus(row.Status) as
        | "completed"
        | "in_progress"
        | "pending"
        | "overdue";
      const priority = (row.Priority?.toLowerCase() || "medium") as "high" | "medium" | "low";

      const { error } = await supabase.from("project_tasks").insert({
        employee_id: employee.id,
        project_name: row["Project Name"]?.trim(),
        task_name: row["Task Name"]?.trim(),
        status,
        due_date: row["Due Date"] || null,
        completion_date: row["Completion Date"] || null,
        priority,
      });

      if (!error) imported++;
    }

    setLoading(false);
    toast.success(`${imported} project tasks imported.`);
    setPreview([]);
    setAllRows([]);
    onSuccess?.();
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg text-gray-800 dark:text-gray-100">Project Tasks Upload</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          Expected CSV format: Employee Email, Project Name, Task Name, Status, Due Date, Completion Date, Priority
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...getRootProps()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 transition-colors hover:border-[#6366F1]/50",
            isDragActive && "border-[#6366F1] bg-[#6366F1]/5"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="mb-3 h-10 w-10 text-gray-500 dark:text-gray-400" />
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Drag & drop a CSV file here, or click to browse
          </p>
        </div>

        {preview.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <FileSpreadsheet className="h-4 w-4" />
              Preview (first 10 rows of {allRows.length})
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 py-2 text-left text-gray-700 dark:text-gray-200 font-medium">Email</th>
                    <th className="px-3 py-2 text-left text-gray-700 dark:text-gray-200 font-medium">Project</th>
                    <th className="px-3 py-2 text-left text-gray-700 dark:text-gray-200 font-medium">Task</th>
                    <th className="px-3 py-2 text-left text-gray-700 dark:text-gray-200 font-medium">Status</th>
                    <th className="px-3 py-2 text-left text-gray-700 dark:text-gray-200 font-medium">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} className="border-t border-gray-200 dark:border-gray-700">
                      <td className="px-3 py-2 text-gray-800 dark:text-gray-100">{row["Employee Email"]}</td>
                      <td className="px-3 py-2 text-gray-800 dark:text-gray-100">{row["Project Name"]}</td>
                      <td className="px-3 py-2 text-gray-800 dark:text-gray-100">{row["Task Name"]}</td>
                      <td className="px-3 py-2 text-gray-800 dark:text-gray-100">{row.Status}</td>
                      <td className="px-3 py-2 text-gray-800 dark:text-gray-100">{row.Priority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button onClick={handleImport} disabled={loading}>
              {loading ? "Importing..." : `Confirm Import (${allRows.length} rows)`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
