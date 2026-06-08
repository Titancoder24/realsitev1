"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [profile, setProfile] = useState<{ full_name?: string; email?: string; role?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setProfile({ email: data.user.email, full_name: data.user.user_metadata?.full_name, role: data.user.user_metadata?.role });
    });
  }, []);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="text-muted-foreground">Name:</span> {profile?.full_name}</p>
          <p><span className="text-muted-foreground">Email:</span> {profile?.email}</p>
          <p><span className="text-muted-foreground">Role:</span> {profile?.role ?? "organization_admin"}</p>
          <Button variant="outline" onClick={logout}>Sign Out</Button>
        </CardContent>
      </Card>
    </div>
  );
}
