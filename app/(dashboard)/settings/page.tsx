"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Download, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [groqKey, setGroqKey] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setFullName(user.user_metadata?.full_name || "");
        setCompanyName(user.user_metadata?.company_name || "");
        setEmail(user.email || "");
        setGroqKey(user.user_metadata?.groq_api_key || "");
      }
    }
    load();
  }, [supabase]);

  const handleSaveProfile = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      email,
      data: {
        full_name: fullName,
        company_name: companyName,
        groq_api_key: groqKey,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profile updated");
  };

  const downloadTemplate = (type: "attendance" | "project") => {
    const attendanceCSV =
      "Employee Name,Email,Date,Status,Hours Worked\nJohn Smith,john@company.com,2025-01-15,present,8\nJane Doe,jane@company.com,2025-01-15,absent,0";
    const projectCSV =
      "Employee Email,Project Name,Task Name,Status,Due Date,Completion Date,Priority\njohn@company.com,Website Redesign,Build homepage,completed,2025-01-20,2025-01-18,high";

    const content = type === "attendance" ? attendanceCSV : projectCSV;
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = type === "attendance" ? "attendance-template.csv" : "project-template.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Template downloaded");
  };

  const handleDeleteAll = async () => {
    if (!confirm("Are you sure? This will delete ALL your data permanently.")) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("candidate_analyses").delete().eq("hr_id", user.id);
    await supabase.from("employees").delete().eq("hr_id", user.id);
    toast.success("All data deleted");
  };

  return (
    <div>
      <TopBar title="Settings" description="Manage your profile and preferences" />

      <div className="max-w-2xl space-y-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-gray-100">Profile</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">Update your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-700 dark:text-gray-200">Full Name</Label>
              <Input id="fullName" className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 placeholder:text-gray-400" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-gray-700 dark:text-gray-200">Company Name</Label>
              <Input id="companyName" className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 placeholder:text-gray-400" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">Email</Label>
              <Input id="email" type="email" className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 placeholder:text-gray-400" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button onClick={handleSaveProfile} disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-gray-100">API Keys</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">Store your Groq API key in user metadata</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="groqKey" className="text-gray-700 dark:text-gray-200">Groq API Key</Label>
              <Input
                id="groqKey"
                type="password"
                placeholder="gsk_..."
                className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 placeholder:text-gray-400"
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
              />
            </div>
            <Button variant="outline" className="text-gray-900 dark:text-white" onClick={handleSaveProfile}>
              Save API Key
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-gray-100">CSV Templates</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">Download sample CSV files for data upload</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button variant="outline" className="text-gray-900 dark:text-white" onClick={() => downloadTemplate("attendance")}>
              <Download className="mr-2 h-4 w-4" />
              Attendance Template
            </Button>
            <Button variant="outline" className="text-gray-900 dark:text-white" onClick={() => downloadTemplate("project")}>
              <Download className="mr-2 h-4 w-4" />
              Project Tasks Template
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">Permanently delete all your ProRecruit data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleDeleteAll}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete All Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
