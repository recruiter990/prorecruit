import { NextRequest, NextResponse } from "next/server";
import { parsePDFBuffer, parseDOCXBuffer, extractCandidateName } from "@/lib/parsePDF";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.toLowerCase();
    let text = "";

    if (fileName.endsWith(".pdf")) {
      text = await parsePDFBuffer(buffer);
    } else if (fileName.endsWith(".docx")) {
      text = await parseDOCXBuffer(buffer);
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Use PDF or DOCX." },
        { status: 400 }
      );
    }

    const candidateName = extractCandidateName(text);

    return NextResponse.json({ text, candidateName });
  } catch (error) {
    console.error("Parse resume error:", error);
    return NextResponse.json(
      { error: "Failed to parse resume file" },
      { status: 500 }
    );
  }
}
