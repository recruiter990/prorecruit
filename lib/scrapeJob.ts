import * as cheerio from "cheerio";
import type { JobScrapeResult } from "@/types";

const SKILL_PATTERNS = [
  /(?:required|must have|proficiency in|experience with|knowledge of)[:\s]+([^.]+)/gi,
  /(?:skills?)[:\s]+([^.]+)/gi,
];

function extractSkills(text: string): string[] {
  const skills = new Set<string>();
  const commonSkills = [
    "JavaScript", "TypeScript", "Python", "Java", "React", "Node.js", "SQL",
    "AWS", "Docker", "Kubernetes", "Git", "Agile", "Scrum", "Leadership",
    "Communication", "Project Management", "Data Analysis", "Machine Learning",
    "HTML", "CSS", "Angular", "Vue", "Next.js", "GraphQL", "REST", "API",
    "PostgreSQL", "MongoDB", "Redis", "CI/CD", "DevOps", "Testing", "Jest",
  ];

  for (const skill of commonSkills) {
    if (text.toLowerCase().includes(skill.toLowerCase())) {
      skills.add(skill);
    }
  }

  for (const pattern of SKILL_PATTERNS) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const parts = match[1].split(/[,;|•·]/);
      parts.forEach((p) => {
        const cleaned = p.trim();
        if (cleaned.length > 2 && cleaned.length < 40) {
          skills.add(cleaned);
        }
      });
    }
  }

  return Array.from(skills).slice(0, 15);
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export async function scrapeJob(url: string): Promise<JobScrapeResult> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return { error: "Could not fetch URL. Please paste manually." };
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    $("script, style, nav, footer, header, noscript").remove();

    let description = "";
    const selectors = [
      ".job-description",
      ".description__text",
      "#job-description",
      "[data-testid='job-description']",
      ".show-more-less-html__markup",
      "article",
      "section",
      ".jobsearch-JobComponent-description",
      ".jobs-description",
    ];

    for (const selector of selectors) {
      const el = $(selector);
      if (el.length && el.text().trim().length > 100) {
        description = cleanText(el.text());
        break;
      }
    }

    if (!description) {
      description = cleanText($("main").text() || $("body").text());
    }

    if (description.length < 50) {
      return { error: "Could not fetch URL. Please paste manually." };
    }

    let jobTitle =
      $('meta[property="og:title"]').attr("content") ||
      $("h1").first().text().trim() ||
      $("title").text().trim();

    let company =
      $('meta[property="og:site_name"]').attr("content") ||
      $(".company-name").first().text().trim() ||
      $('[data-testid="company-name"]').first().text().trim() ||
      "";

    jobTitle = cleanText(jobTitle.split("|")[0].split("-")[0]);
    company = cleanText(company);

    const extractedSkills = extractSkills(description);

    return { jobTitle, company, description, extractedSkills };
  } catch {
    return { error: "Could not fetch URL. Please paste manually." };
  }
}
