import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { withAuth, jsonError } from "@/lib/api-utils";

export async function GET() {
  return withAuth(async (profile) => {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("profiles")
      .select("id, full_name, email, role")
      .eq("organization_id", profile.organization_id!)
      .in("role", ["sales_agent", "sales_manager", "organization_admin"]);
    if (error) return jsonError(error.message, 500);
    return NextResponse.json(data);
  }, "sales_agent");
}
