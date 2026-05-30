"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const springTransition = {
  type: "spring" as const,
  stiffness: 80,
  damping: 20,
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const flipInY = {
  hidden: { opacity: 0, rotateY: 90 },
  visible: { opacity: 1, rotateY: 0 },
};

const flipInFromBottom = {
  hidden: { opacity: 0, rotateX: 90, y: 50 },
  visible: { opacity: 1, rotateX: 0, y: 0 },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0 },
};

const slideInRight = {
  hidden: { opacity: 0, x: 100, rotateY: 45 },
  visible: { opacity: 1, x: 0, rotateY: 0 },
};

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isInView) return;
    if (hasStarted.current) return;
    hasStarted.current = true;
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, isInView]);

  return { count, ref };
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[#0A0A0A] font-extrabold text-xl tracking-tight">
        <span className="text-[#0A0A0A]">Pro</span>
        <span className="text-[#6366F1]">Recruit</span>
      </span>
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white backdrop-blur-sm"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={springTransition}
    >
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
        <Logo />
        <div className="hidden md:flex items-center gap-8">
          {["Features", "How It Works", "AI Scoring"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-[#6B7280] hover:text-[#0A0A0A] transition-colors text-sm font-medium">
              {item}
            </a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-4">
          <a href="/login" className="text-[#0A0A0A] font-medium text-sm hover:text-[#6366F1] transition-colors">Login</a>
          <motion.a href="/register"
            className="bg-[#0A0A0A] text-white rounded-full px-7 py-3.5 text-sm font-medium"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)" }}
            whileTap={{ scale: 0.98 }}>
            Get Started Free
          </motion.a>
        </div>
        <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`h-0.5 w-full bg-[#0A0A0A] transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`h-0.5 w-full bg-[#0A0A0A] transition-all ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-full bg-[#0A0A0A] transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>
      {mobileMenuOpen && (
        <motion.div className="md:hidden bg-white border-t border-[#F3F4F6] px-6 py-4"
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          {["Features", "How It Works", "AI Scoring"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="block py-3 text-[#6B7280] hover:text-[#0A0A0A] transition-colors text-sm font-medium">{item}</a>
          ))}
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-[#F3F4F6]">
            <a href="/login" className="text-[#0A0A0A] font-medium text-sm py-2">Login</a>
            <a href="/register" className="bg-[#0A0A0A] text-white rounded-full px-7 py-3.5 text-sm font-medium text-center">Get Started Free</a>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

function HeroSection() {
  return (
    <section className="pt-32 pb-24 md:pt-40 md:pb-32 px-6">
      <div className="max-w-[1200px] mx-auto text-center">
        <motion.div className="inline-flex items-center gap-2 bg-[#F3F4F6] rounded-full px-4 py-2 mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springTransition, delay: 0.1 }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6366F1] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6366F1]"></span>
          </span>
          <span className="text-[#6B7280] text-sm font-medium">AI Powered HR Platform</span>
        </motion.div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-[#0A0A0A] tracking-tight leading-none mb-6">
          <span className="block">
            {["Hire", "Smarter."].map((word, i) => (
              <motion.span key={word} className="inline-block mr-4"
                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...springTransition, delay: 0.2 + i * 0.1 }}>{word}</motion.span>
            ))}
          </span>
          <span className="block mt-2">
            {["Grow", "Faster."].map((word, i) => (
              <motion.span key={word} className="inline-block mr-4"
                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...springTransition, delay: 0.4 + i * 0.1 }}>{word}</motion.span>
            ))}
          </span>
        </h1>
        <motion.p className="text-[#6B7280] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...springTransition, delay: 0.6 }}>
          ProRecruit analyzes candidates, tracks performance, and eliminates hiring guesswork using advanced AI
        </motion.p>
        <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springTransition, delay: 0.7 }}>
          <motion.a href="/register" className="bg-[#0A0A0A] text-white rounded-full px-8 py-4 text-base font-medium w-full sm:w-auto text-center"
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(99, 102, 241, 0.4)" }} whileTap={{ scale: 0.98 }}>
            Get Started Free
          </motion.a>
          <motion.a href="#how-it-works" className="bg-white text-[#0A0A0A] border border-[#0A0A0A] rounded-full px-8 py-4 text-base font-medium w-full sm:w-auto text-center"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            See How It Works
          </motion.a>
        </motion.div>
        <motion.div className="flex flex-wrap items-center justify-center gap-6 mb-16"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...springTransition, delay: 0.8 }}>
          {["Free to use", "No credit card", "AI powered"].map((text) => (
            <div key={text} className="flex items-center gap-2 text-[#6B7280] text-sm">
              <svg className="w-4 h-4 text-[#6366F1]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {text}
            </div>
          ))}
        </motion.div>
        <motion.div className="relative max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springTransition, delay: 0.9 }}>
          <div className="bg-white rounded-2xl shadow-2xl border border-[#F3F4F6] overflow-hidden">
            <div className="bg-[#F9FAFB] border-b border-[#F3F4F6] px-4 py-3 flex items-center justify-between">
              <Logo />
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <div className="w-3 h-3 rounded-full bg-[#10B981]" />
              </div>
            </div>
            <div className="flex min-h-[300px] md:min-h-[400px]">
              <div className="hidden sm:block w-48 bg-[#F9FAFB] border-r border-[#F3F4F6] p-4">
                {["Dashboard", "Candidates", "Performance", "AI Scoring"].map((item, i) => (
                  <div key={item} className={`px-3 py-2.5 rounded-lg mb-2 text-sm ${i === 0 ? "bg-[#6366F1] text-white" : "text-[#6B7280]"}`}>{item}</div>
                ))}
              </div>
              <div className="flex-1 p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6">
                <div className="flex-1 bg-[#F9FAFB] rounded-xl p-4 md:p-6">
                  <div className="text-[#0A0A0A] font-semibold text-sm mb-4">Performance Overview</div>
                  <div className="flex items-end gap-2 md:gap-3 h-32 md:h-48">
                    {[40, 65, 45, 80, 55, 90, 70, 85].map((height, i) => (
                      <motion.div key={i} className="flex-1 rounded-t-md"
                        style={{ backgroundColor: i % 3 === 0 ? "#6366F1" : i % 3 === 1 ? "#10B981" : "#F59E0B" }}
                        initial={{ height: 0 }} animate={{ height: `${height}%` }}
                        transition={{ ...springTransition, delay: 1 + i * 0.1 }} />
                    ))}
                  </div>
                </div>
                <div className="w-full md:w-48 bg-white rounded-xl border border-[#F3F4F6] p-4 shadow-sm">
                  <div className="text-[#6B7280] text-xs mb-3">Top Candidate</div>
                  <div className="flex items-center justify-center mb-3">
                    <div className="relative w-20 h-20">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle cx="40" cy="40" r="36" stroke="#F3F4F6" strokeWidth="6" fill="none" />
                        <motion.circle cx="40" cy="40" r="36" stroke="#10B981" strokeWidth="6" fill="none"
                          strokeDasharray={226} initial={{ strokeDashoffset: 226 }}
                          animate={{ strokeDashoffset: 226 - (226 * 94) / 100 }}
                          transition={{ ...springTransition, delay: 1.2 }} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[#10B981] font-bold text-lg">94%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#0A0A0A] font-semibold text-sm">Sarah Johnson</div>
                    <div className="text-[#6B7280] text-xs">Senior Developer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatItem({ value, suffix, label, index }: { value: number; suffix: string; label: string; index: number }) {
  const { count, ref } = useCountUp(value);
  return (
    <motion.div ref={ref}
      className={`text-center ${index < 3 ? "md:border-r md:border-[#E5E7EB]" : ""}`}
      variants={fadeInUp} initial="hidden" whileInView="visible"
      viewport={{ once: true }} transition={{ ...springTransition, delay: index * 0.1 }}>
      <div className="text-3xl md:text-5xl font-extrabold text-[#0A0A0A] tracking-tight">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-[#6B7280] text-sm mt-2">{label}</div>
    </motion.div>
  );
}

function StatsSection() {
  const stats = [
    { value: 500, suffix: "+", label: "HR Teams" },
    { value: 10000, suffix: "+", label: "Candidates Analyzed" },
    { value: 95, suffix: "%", label: "Accuracy" },
    { value: 3, suffix: "x", label: "Faster Hiring" },
  ];

  return (
    <section className="bg-[#F9FAFB] py-16 md:py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { title: "AI Candidate Scoring", description: "Upload resumes and get instant fit scores with detailed skill gap analysis for every candidate" },
    { title: "Performance Tracking", description: "Track attendance and project completion across your entire team in one clean dashboard" },
    { title: "Productivity Charts", description: "Visual graphs instantly show high and low performers so you can act fast" },
  ];

  return (
    <section id="features" className="py-24 md:py-32 px-6">
      <div className="max-w-[1200px] mx-auto">
        <motion.div className="text-center mb-16" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={springTransition}>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0A0A0A] tracking-tight mb-4">Everything Your HR Team Needs</h2>
          <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">Powerful tools designed to streamline your hiring process and boost team productivity</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, i) => (
            <motion.div key={feature.title} className="bg-white rounded-2xl border border-[#F3F4F6] p-8 shadow-sm group cursor-pointer"
              style={{ perspective: "1000px" }} variants={flipInY} initial="hidden" whileInView="visible"
              viewport={{ once: true }} transition={{ ...springTransition, delay: i * 0.15 }}
              whileHover={{ rotateY: 5, rotateX: 3, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)", transition: { duration: 0.3 } }}>
              <div className="w-12 h-12 bg-[#6366F1]/10 rounded-xl flex items-center justify-center text-[#6366F1] mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0A0A0A] mb-3">{feature.title}</h3>
              <p className="text-[#6B7280] mb-6 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { number: "01", title: "Upload Your Data", description: "Import resumes, job descriptions, and team attendance data in seconds" },
    { number: "02", title: "AI Analyzes Everything", description: "Our AI processes and scores all candidates and performance data automatically" },
    { number: "03", title: "Make Better Decisions", description: "Get actionable insights to hire the best talent and support your team" },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 px-6 bg-[#F9FAFB]">
      <div className="max-w-[1200px] mx-auto">
        <motion.div className="text-center mb-16" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={springTransition}>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0A0A0A] tracking-tight">Three Steps to Better Hiring</h2>
        </motion.div>
        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px border-t-2 border-dashed border-[#E5E7EB] -translate-y-1/2" />
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, i) => (
              <motion.div key={step.number} className="relative bg-white rounded-2xl border border-[#F3F4F6] p-8 shadow-sm text-center"
                style={{ perspective: "1000px" }} variants={flipInFromBottom} initial="hidden" whileInView="visible"
                viewport={{ once: true }} transition={{ ...springTransition, delay: i * 0.2 }}>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-7xl font-extrabold text-[#F3F4F6] select-none">{step.number}</div>
                <div className="relative pt-8">
                  <h3 className="text-xl font-bold text-[#0A0A0A] mb-3">{step.title}</h3>
                  <p className="text-[#6B7280] leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    { quote: "ProRecruit cut our hiring time by 60 percent. The AI scoring is incredibly accurate.", name: "Sarah M.", title: "HR Director, TechCorp", initials: "SM" },
    { quote: "Finally an HR tool that understands technical roles. The skill gap analysis is outstanding.", name: "Ahmed K.", title: "Lead Recruiter, DevHouse", initials: "AK" },
    { quote: "We track all 50 employees with ProRecruit. The productivity charts save us hours every week.", name: "Priya S.", title: "People Manager, ScaleUp", initials: "PS" },
  ];

  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-[1200px] mx-auto">
        <motion.div className="text-center mb-16" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={springTransition}>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0A0A0A] tracking-tight">Trusted by HR Teams Worldwide</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div key={testimonial.name} className="bg-white rounded-2xl border border-[#F3F4F6] p-8 shadow-sm"
              style={{ perspective: "1000px" }} variants={flipInY} initial="hidden" whileInView="visible"
              viewport={{ once: true }} transition={{ ...springTransition, delay: i * 0.15 }}
              whileHover={{ rotateY: 5, rotateX: 3, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="w-5 h-5 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-[#0A0A0A] text-lg mb-6 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#6366F1] flex items-center justify-center text-white font-semibold">{testimonial.initials}</div>
                <div>
                  <div className="text-[#0A0A0A] font-semibold">{testimonial.name}</div>
                  <div className="text-[#6B7280] text-sm">{testimonial.title}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 md:py-32 px-6 bg-[#F9FAFB]">
      <div className="max-w-[1200px] mx-auto text-center">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={springTransition}>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#0A0A0A] tracking-tight mb-6">Ready to Transform Your HR Process?</h2>
          <p className="text-[#6B7280] text-lg mb-10 max-w-xl mx-auto">Join hundreds of HR teams already using ProRecruit to hire smarter and grow faster.</p>
          <motion.a href="/register" className="inline-block bg-[#0A0A0A] text-white rounded-full px-10 py-4 text-base font-medium"
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(99, 102, 241, 0.4)" }} whileTap={{ scale: 0.98 }}>
            Get Started Free
          </motion.a>
          <p className="text-[#6B7280] text-sm mt-6">Free forever. No credit card required.</p>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-[#F3F4F6] py-16 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="mb-4"><Logo /></div>
            <p className="text-[#6B7280] text-sm leading-relaxed">AI-powered HR platform for smarter hiring and team management.</p>
          </div>
          <div>
            <h4 className="text-[#0A0A0A] font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-[#6B7280] hover:text-[#0A0A0A] text-sm transition-colors">Features</a></li>
              <li><a href="#ai-scoring" className="text-[#6B7280] hover:text-[#0A0A0A] text-sm transition-colors">AI Scoring</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#0A0A0A] font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-[#6B7280] hover:text-[#0A0A0A] text-sm transition-colors">About</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#0A0A0A] font-semibold mb-4">Connect</h4>
            <div>
              <p className="text-[#0A0A0A] font-semibold text-sm">Built by Abdul Rehman</p>
              <a href="https://www.linkedin.com/in/emir-rehman-recruiter/" target="_blank" rel="noopener noreferrer"
                className="text-[#6366F1] text-sm hover:underline">Connect on LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="border-t border-[#F3F4F6] pt-8">
          <p className="text-center text-[#6B7280] text-sm">2025 ProRecruit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function ProRecruitLandingPage() {
  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
