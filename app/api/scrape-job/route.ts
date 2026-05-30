import { NextRequest, NextResponse } from "next/server";
import { scrapeJob } from "@/lib/scrapeJob";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }
    const result = await scrapeJob(url);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Could not fetch URL. Please paste manually." },
      { status: 500 }
    );
  }
}
