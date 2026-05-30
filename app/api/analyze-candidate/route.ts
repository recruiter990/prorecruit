import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@/lib/supabase/server";

const systemPrompt = `
You are ProRecruit AI, an expert HR analyst. Analyze the fit between a job description and a candidate's resume.

Return ONLY a valid JSON object with this exact structure:
{
  "fit_score": <integer 0-100>,
  "recommendation": "<one of: Strong Fit | Good Fit | Partial Fit | Not Recommended>",
  "match_summary": "<2-3 sentence executive summary of fit>",
  "matched_skills": ["skill1", "skill2", ...],
  "missing_skills": ["skill1", "skill2", ...],
  "experience_gap": "<detailed paragraph about experience gaps, years difference, seniority mismatch>",
  "strengths": ["strength1", "strength2", "strength3"],
  "concerns": ["concern1", "concern2"],
  "interview_questions": ["question1", "question2", "question3"],
  "salary_expectation_alignment": "<comment on if candidate experience aligns with likely salary range>",
  "overall_verdict": "<detailed paragraph of final recommendation for the hiring manager>"
}
`;

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
    const { jobDescription, resumeText, candidateName, jobTitle, jobUrl } = body;

    if (!jobDescription || !resumeText) {
      return NextResponse.json(
        { error: "Job description and resume text are required" },
        { status: 400 }
      );
    }

    const userMessage = `JOB DESCRIPTION:\n${jobDescription}\n\nCANDIDATE RESUME:\n${resumeText}\n\nCANDIDATE NAME: ${candidateName || "Unknown"}\nJOB TITLE: ${jobTitle || "Unknown"}`;

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });
    const analysis = JSON.parse(response.choices[0].message.content || "{}");

    const { data: saved, error } = await supabase
      .from("candidate_analyses")
      .insert({
        hr_id: user.id,
        candidate_name: candidateName,
        job_title: jobTitle,
        job_url: jobUrl || null,
        job_description: jobDescription,
        resume_text: resumeText,
        fit_score: analysis.fit_score,
        match_summary: analysis.match_summary,
        matched_skills: analysis.matched_skills,
        missing_skills: analysis.missing_skills,
        experience_gap: analysis.experience_gap,
        recommendation: analysis.recommendation,
        ai_full_analysis: JSON.stringify(analysis),
      })
      .select()
      .single();

    if (error) {
      console.error("Save error:", error);
      return NextResponse.json({ error: "Failed to save analysis" }, { status: 500 });
    }

    return NextResponse.json({ ...analysis, id: saved.id });
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json(
      { error: "Failed to analyze candidate. Check your Groq API key." },
      { status: 500 }
    );
  }
}
