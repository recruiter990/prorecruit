"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = name.trim();

    if (!cleanName) {
      toast.error("Please enter your name");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInAnonymously({
      options: {
        data: {
          full_name: cleanName,
        },
      },
    });

    setLoading(false);

    if (error) {
      console.error("Anonymous login error:", error);
      toast.error(error.message);
      return;
    }

    toast.success(`Welcome, ${cleanName}!`);

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <span className="font-extrabold text-xl tracking-tight">
              <span style={{ color: "#0A0A0A" }}>Pro</span>
              <span style={{ color: "#6366F1" }}>Recruit</span>
            </span>
          </div>

          <CardTitle className="font-heading">
            Welcome to ProRecruit
          </CardTitle>

          <CardDescription>
            Enter your name to start using ProRecruit
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>

              <Input
                id="name"
                type="text"
                placeholder="John Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Starting..." : "Start Using ProRecruit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
