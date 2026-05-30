const SKILL_PATTERNS = [
  /(?:required|must have|proficiency in|experience with|knowledge of)[:\s]+([^.]+)/gi,
  /(?:skills?)[:\s]+([^.]+)/gi,
];

export function extractSkillsFromText(text: string): string[] {
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
