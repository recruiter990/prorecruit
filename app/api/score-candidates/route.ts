import { NextRequest, NextResponse } from "next/server";
import { getGroqClient } from "@/lib/groq";
import { createClient } from "@/lib/supabase/server";

const systemPrompt = `You are ProRecruit AI, an expert HR analyst. Analyze multiple candidates against one job description.

Return ONLY valid JSON with no extra text, using this exact structure:
{
  "best_candidate": "<name of highest scoring candidate>",
  "analysis_summary": "<2-3 sentence overview of the candidate pool>",
  "candidates": [
    {
      "name": "<candidate name>",
      "fit_score": <integer 0-100>,
      "recommendation": "<one of: Strong Fit | Good Fit | Partial Fit | Not Recommended>",
      "matched_skills": ["skill1", "skill2"],
      "missing_skills": ["skill1", "skill2"],
      "experience_gap": "<one line summary>",
      "key_strength": "<one line top strength>",
      "summary": "<2 sentence fit summary>"
    }
  ]
}

Scoring guide:
- 80-100: Strong Fit
- 60-79: Good Fit
- 40-59: Partial Fit
- 0-39: Not Recommended`;

function mapRecommendation(rec: string, score: number): string {
  const valid = ["Strong Fit", "Good Fit", "Partial Fit", "Not Recommended"];
  if (valid.includes(rec)) return rec;
  if (score >= 80) return "Strong Fit";
  if (score >= 60) return "Good Fit";
  if (score >= 40) return "Partial Fit";
  return "Not Recommended";
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { jobDescription, candidates } = body as {
      jobDescription: string;
      candidates: Array<{ name: string; resumeText: string }>;
    };

    if (!jobDescription?.trim() || !candidates?.length) {
      return NextResponse.json(
        { error: "Job description and at least one candidate are required" },
        { status: 400 }
      );
    }

    const candidateBlock = candidates
      .map(
        (c, i) =>
          `--- CANDIDATE ${i + 1}: ${c.name} ---\n${c.resumeText.slice(0, 6000)}`
      )
      .join("\n\n");

    const userMessage = `JOB DESCRIPTION:\n${jobDescription}\n\nCANDIDATES:\n${candidateBlock}`;

    const groq = getGroqClient();
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(response.choices[0].message.content || "{}");

    for (const candidate of parsed.candidates || []) {
      const recommendation = mapRecommendation(
        candidate.recommendation,
        candidate.fit_score
      );
      await supabase.from("candidate_analyses").insert({
        hr_id: user.id,
        candidate_name: candidate.name,
        job_title: "AI Scoring Session",
        job_description: jobDescription,
        resume_text: candidates.find((c) => c.name === candidate.name)?.resumeText || "",
        fit_score: candidate.fit_score,
        match_summary: candidate.summary,
        matched_skills: candidate.matched_skills,
        missing_skills: candidate.missing_skills,
        experience_gap: candidate.experience_gap,
        recommendation,
        ai_full_analysis: JSON.stringify(candidate),
      });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Score candidates error:", error);
    return NextResponse.json(
      { error: "Failed to score candidates. Check your Groq API key." },
      { status: 500 }
    );
  }
}
