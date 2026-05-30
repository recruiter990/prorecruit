import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "HR User";
  const userEmail = user?.email || "";

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userName={userName} userEmail={userEmail} />
      <main className="lg:pl-64">
        <div className="container mx-auto p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
