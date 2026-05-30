export async function parsePDFBuffer(buffer: Buffer): Promise<string> {
  const pdfParse = (await import("pdf-parse")).default;
  const data = await pdfParse(buffer);
  return data.text;
}

export async function parseDOCXBuffer(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

export function extractCandidateName(text: string): string {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return "Unknown Candidate";
  const firstLine = lines[0];
  if (firstLine.length < 50 && !firstLine.includes("@")) {
    return firstLine;
  }
  return "Unknown Candidate";
}
