"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Brain,
  BarChart3,
  TrendingUp,
  Search,
  Kanban,
  FileText,
  Star,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Brain,
    title: "AI Candidate Scoring",
    desc: "Instant fit scores powered by advanced AI for every applicant.",
  },
  {
    icon: TrendingUp,
    title: "Performance Tracking",
    desc: "Monitor attendance and productivity across your entire team.",
  },
  {
    icon: BarChart3,
    title: "Productivity Charts",
    desc: "Visual dashboards that reveal top performers at a glance.",
  },
  {
    icon: Search,
    title: "Skill Gap Analysis",
    desc: "Identify missing skills and experience gaps automatically.",
  },
  {
    icon: Kanban,
    title: "ATS Pipeline Management",
    desc: "Organize candidates from application to offer in one place.",
  },
  {
    icon: FileText,
    title: "Instant Reports",
    desc: "Download professional candidate analysis reports in seconds.",
  },
];

const steps = [
  { num: "01", title: "Upload Your Data", desc: "Import resumes and job descriptions in seconds." },
  { num: "02", title: "AI Analyzes Everything", desc: "Our AI scores fit, skills, and experience gaps." },
  { num: "03", title: "Make Better Decisions", desc: "Hire with confidence using data-driven insights." },
];

const testimonials = [
  {
    quote:
      "ProRecruit cut our hiring time by 60 percent. The AI scoring is incredibly accurate.",
    name: "Sarah M.",
    title: "HR Director",
  },
  {
    quote:
      "Finally an HR tool that understands technical roles. The skill gap analysis is outstanding.",
    name: "Ahmed K.",
    title: "Tech Recruiter",
  },
  {
    quote:
      "We track all 50 employees with ProRecruit. The productivity charts save us hours every week.",
    name: "Priya S.",
    title: "People Manager",
  },
];

function FadeSection({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("landing-fade opacity-0 translate-y-6", className)}>
      {children}
    </section>
  );
}

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("landing-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".landing-fade").forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-[#F8FAFC] font-sans">
      {/* Navbar */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[#0A0F1E]/95 backdrop-blur-md border-b border-[#334155] shadow-lg"
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6366F1] font-bold text-white font-[family-name:var(--font-syne)]">
              PR
            </div>
            <span className="text-xl font-bold font-[family-name:var(--font-syne)]">
              ProRecruit
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" className="border-[#334155] hover:border-[#6366F1] btn-landing-ghost">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="btn-landing-primary bg-[#6366F1] hover:bg-[#6366F1]/90">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <FadeSection className="pt-28 pb-20 px-6">
        <div className="container mx-auto grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl font-[family-name:var(--font-syne)]">
              Hire Smarter. Track Better.{" "}
              <span className="text-[#6366F1]">Grow Faster.</span>
            </h1>
            <p className="mt-6 text-lg text-[#94A3B8] max-w-xl">
              ProRecruit is the AI-powered HR platform that scores candidates, tracks employee
              performance, and eliminates guesswork from hiring.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/register">
                <Button size="lg" className="btn-landing-primary bg-[#6366F1] h-12 px-8">
                  Get Started Free
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 border-[#334155] btn-landing-ghost"
                >
                  See How It Works
                </Button>
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-[#94A3B8]">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#6366F1]" /> Free to use
              </span>
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#6366F1]" /> No credit card required
              </span>
              <span className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-[#6366F1]" /> AI powered
              </span>
            </div>
          </div>

          {/* Mock dashboard */}
          <div className="rounded-2xl border border-[#334155] bg-[#1E293B] p-5 shadow-2xl shadow-black/40">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-[#94A3B8]">Dashboard Preview</span>
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[72, 88, 65].map((v, i) => (
                <div key={i} className="rounded-xl bg-[#0A0F1E] p-3 border border-[#334155]">
                  <div className="h-1.5 w-full rounded bg-[#334155] mb-2" />
                  <div
                    className="text-lg font-bold"
                    style={{ color: v >= 80 ? "#22C55E" : v >= 60 ? "#F59E0B" : "#EF4444" }}
                  >
                    {v}%
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-[#0A0F1E] border border-[#334155] p-4 mb-4">
              <div className="flex items-end gap-2 h-24">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t"
                    style={{
                      height: `${h}%`,
                      backgroundColor: h >= 80 ? "#22C55E" : h >= 60 ? "#6366F1" : "#F59E0B",
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-[#6366F1]/40 bg-[#6366F1]/10 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#94A3B8]">Top Candidate</p>
                <p className="font-semibold">Alex Johnson</p>
              </div>
              <div className="relative h-14 w-14">
                <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="#334155" strokeWidth="4" />
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    fill="none"
                    stroke="#22C55E"
                    strokeWidth="4"
                    strokeDasharray="150.8"
                    strokeDashoffset="18"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#22C55E]">
                  92
                </span>
              </div>
            </div>
          </div>
        </div>
      </FadeSection>

      {/* Stats */}
      <FadeSection className="px-6 pb-20">
        <div className="container mx-auto rounded-2xl border border-[#334155] bg-[#1E293B] py-10 px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "500+", label: "HR Teams" },
              { value: "10,000+", label: "Candidates Analyzed" },
              { value: "95%", label: "Accuracy Score" },
              { value: "3x", label: "Faster Hiring" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-[#6366F1] font-[family-name:var(--font-syne)]">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-[#94A3B8]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* Features */}
      <FadeSection id="features" className="px-6 pb-20">
        <div className="container mx-auto">
          <h2 className="text-center text-3xl font-bold font-[family-name:var(--font-syne)] mb-12">
            Everything Your HR Team Needs
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-[#334155] bg-[#1E293B] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] hover:border-[#6366F1]/40"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#6366F1]/20 text-[#6366F1]">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-[#94A3B8]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* How it works */}
      <FadeSection id="how-it-works" className="px-6 pb-20">
        <div className="container mx-auto">
          <h2 className="text-center text-3xl font-bold font-[family-name:var(--font-syne)] mb-16">
            Three Simple Steps
          </h2>
          <div className="relative grid gap-8 md:grid-cols-3">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-[#334155]" />
            {steps.map((step) => (
              <div key={step.num} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#6366F1] text-xl font-bold font-[family-name:var(--font-syne)]">
                  {step.num}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-[#94A3B8]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* Testimonials */}
      <FadeSection className="px-6 pb-20">
        <div className="container mx-auto grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-[#334155] bg-[#1E293B] p-6"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-[#F8FAFC] mb-4">&ldquo;{t.quote}&rdquo;</p>
              <p className="font-medium">{t.name}</p>
              <p className="text-xs text-[#94A3B8]">{t.title}</p>
            </div>
          ))}
        </div>
      </FadeSection>

      {/* CTA */}
      <FadeSection className="px-6 pb-20">
        <div className="container mx-auto text-center rounded-2xl border border-[#6366F1]/30 bg-[#6366F1]/10 py-16 px-6">
          <h2 className="text-3xl font-bold font-[family-name:var(--font-syne)] mb-4">
            Ready to Transform Your HR Process?
          </h2>
          <p className="text-[#94A3B8] mb-8">
            Join hundreds of HR professionals using ProRecruit today
          </p>
          <Link href="/register">
            <Button size="lg" className="btn-landing-primary bg-[#6366F1] h-14 px-10 text-lg">
              Get Started Free
            </Button>
          </Link>
        </div>
      </FadeSection>

      {/* Footer */}
      <footer className="border-t border-[#334155] px-6 py-12">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6366F1] text-xs font-bold">
                  PR
                </div>
                <span className="font-bold font-[family-name:var(--font-syne)]">ProRecruit</span>
              </div>
              <p className="text-sm text-[#94A3B8]">AI-powered HR intelligence for modern teams.</p>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <a href="#features" className="text-[#94A3B8] hover:text-[#F8FAFC]">
                Features
              </a>
              <a href="#how-it-works" className="text-[#94A3B8] hover:text-[#F8FAFC]">
                How It Works
              </a>
              <Link href="/login" className="text-[#94A3B8] hover:text-[#F8FAFC]">
                Login
              </Link>
            </div>
            <div className="text-sm text-[#94A3B8]">
              Built by Abdul Rehman
              <br />
              <a
                href="https://www.linkedin.com/in/emir-rehman-recruiter/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6366F1] hover:underline"
              >
                LinkedIn Profile
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#334155] text-center text-xs text-[#94A3B8]">
            2025 ProRecruit. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
