import Papa from "papaparse";
import type { AttendanceCSVRow, ProjectCSVRow } from "@/types";

export function parseAttendanceCSV(file: File): Promise<AttendanceCSVRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<AttendanceCSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
}

export function parseProjectCSV(file: File): Promise<ProjectCSVRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<ProjectCSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
}

export function normalizeStatus(status: string): string {
  return status.toLowerCase().trim().replace(/\s+/g, "_");
}

export function normalizeTaskStatus(status: string): string {
  const normalized = status.toLowerCase().trim().replace(/\s+/g, "_");
  if (normalized === "in progress") return "in_progress";
  return normalized;
}
