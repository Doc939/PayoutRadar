import { createClient } from "../../lib/supabase/server";
import { getFirms } from "../../lib/firms-data";
import LoginForm from "../../components/admin/LoginForm";
import AdminDashboard from "./AdminDashboard";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <LoginForm />;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    return (
      <main className="wrap section">
        <h1>Access denied</h1>
        <p className="muted">This account doesn&apos;t have admin access.</p>
      </main>
    );
  }

  const firms = await getFirms();

  return <AdminDashboard firms={firms} adminUsername={profile.username} />;
}
