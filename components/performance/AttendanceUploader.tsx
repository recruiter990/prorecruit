"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { parseAttendanceCSV, normalizeStatus } from "@/lib/parseCSV";
import type { AttendanceCSVRow } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AttendanceUploaderProps {
  onSuccess?: () => void;
}

export function AttendanceUploader({ onSuccess }: AttendanceUploaderProps) {
  const [preview, setPreview] = useState<AttendanceCSVRow[]>([]);
  const [allRows, setAllRows] = useState<AttendanceCSVRow[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    try {
      const rows = await parseAttendanceCSV(file);
      setAllRows(rows);
      setPreview(rows.slice(0, 10));
      toast.success(`Parsed ${rows.length} rows. Review preview before importing.`);
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

    const employeeMap = new Map<string, string>();
    let imported = 0;
    const uniqueEmails = new Set<string>();

    for (const row of allRows) {
      const email = row.Email?.trim().toLowerCase();
      if (!email) continue;
      uniqueEmails.add(email);

      if (!employeeMap.has(email)) {
        const { data: existing } = await supabase
          .from("employees")
          .select("id")
          .eq("email", email)
          .eq("hr_id", user.id)
          .single();

        if (existing) {
          employeeMap.set(email, existing.id);
        } else {
          const { data: newEmp, error } = await supabase
            .from("employees")
            .insert({
              hr_id: user.id,
              name: row["Employee Name"]?.trim() || email,
              email,
            })
            .select("id")
            .single();

          if (error || !newEmp) continue;
          employeeMap.set(email, newEmp.id);
        }
      }

      const employeeId = employeeMap.get(email);
      if (!employeeId) continue;

      const status = normalizeStatus(row.Status) as "present" | "absent" | "late" | "half_day";
      const validStatuses = ["present", "absent", "late", "half_day"];
      if (!validStatuses.includes(status)) continue;

      const { error } = await supabase.from("attendance").insert({
        employee_id: employeeId,
        date: row.Date,
        status,
        hours_worked: parseFloat(row["Hours Worked"]) || 0,
      });

      if (!error) imported++;
    }

    setLoading(false);
    toast.success(`${imported} records imported for ${uniqueEmails.size} employees.`);
    setPreview([]);
    setAllRows([]);
    onSuccess?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Attendance Upload</CardTitle>
        <CardDescription>
          Expected CSV format: Employee Name, Email, Date, Status, Hours Worked
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...getRootProps()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-8 transition-colors hover:border-primary/50",
            isDragActive && "border-primary bg-primary/5"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag & drop a CSV file here, or click to browse
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Accepts .csv files only</p>
        </div>

        {preview.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileSpreadsheet className="h-4 w-4" />
              Preview (first 10 rows of {allRows.length})
            </div>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary">
                  <tr>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">Email</th>
                    <th className="px-3 py-2 text-left">Date</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="px-3 py-2">{row["Employee Name"]}</td>
                      <td className="px-3 py-2">{row.Email}</td>
                      <td className="px-3 py-2">{row.Date}</td>
                      <td className="px-3 py-2">{row.Status}</td>
                      <td className="px-3 py-2">{row["Hours Worked"]}</td>
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
