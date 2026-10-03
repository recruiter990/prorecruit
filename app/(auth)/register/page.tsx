"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    setLoading(true);

    // Store basic onboarding information locally.
    // No Supabase Auth. No email/password account.
    localStorage.setItem(
      "prorecruit_profile",
      JSON.stringify({
        name: name.trim(),
        company: company.trim(),
        email: email.trim(),
      })
    );

    // Also keep the simple name value for older parts of the app.
    localStorage.setItem("prorecruit_name", name.trim());

    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] p-4">
      <div className="w-full max-w-[530px] rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mb-8 text-2xl font-extrabold tracking-tight">
            <span className="text-black">Pro</span>
            <span className="text-indigo-500">Recruit</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Welcome to ProRecruit
          </h1>

          <p className="mt-2 text-slate-500">
            Enter your details to start using ProRecruit
          </p>
        </div>

        <form onSubmit={handleStart} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Full Name *
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label
              htmlFor="company"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Company Name
            </label>

            <input
              id="company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Your company"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-500 px-4 py-3 font-semibold text-white shadow-lg transition hover:bg-indigo-600 disabled:opacity-60"
          >
            {loading ? "Starting..." : "Start Using ProRecruit"}
          </button>
        </form>
      </div>
    </div>
  );
}
