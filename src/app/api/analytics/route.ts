import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { withAuth } from "@/lib/api-utils";

export async function GET() {
  return withAuth(async (profile) => {
    const admin = createAdminClient();
    const orgId = profile.organization_id!;

    const [{ count: sessions }, { count: leads }, { data: hotLeads }, { data: events }, { data: heatmap }] = await Promise.all([
      admin.from("buyer_sessions").select("*", { count: "exact", head: true }).eq("organization_id", orgId),
      admin.from("leads").select("*", { count: "exact", head: true }).eq("organization_id", orgId),
      admin.from("leads").select("intent_score").eq("organization_id", orgId).gte("intent_score", 80),
      admin.from("analytics_events").select("event_type, created_at").eq("organization_id", orgId).order("created_at", { ascending: false }).limit(100),
      admin.from("heatmap_points").select("scene_id, dwell_seconds, property_id").limit(500),
    ]);

    const eventCounts: Record<string, number> = {};
    (events ?? []).forEach((e) => { eventCounts[e.event_type] = (eventCounts[e.event_type] ?? 0) + 1; });

    const roomDwell: Record<string, number> = {};
    (heatmap ?? []).forEach((h) => {
      const key = h.scene_id ?? "unknown";
      roomDwell[key] = (roomDwell[key] ?? 0) + (h.dwell_seconds ?? 0);
    });

    const topRooms = Object.entries(roomDwell).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return NextResponse.json({
      totalSessions: sessions ?? 0,
      totalLeads: leads ?? 0,
      hotLeads: hotLeads?.length ?? 0,
      eventCounts,
      topRooms,
      recommendations: generateRecommendations(eventCounts, topRooms),
    });
  });
}

function generateRecommendations(events: Record<string, number>, topRooms: [string, number][]) {
  const recs: string[] = [];
  if ((events["ai_question"] ?? 0) > 5) recs.push("Many buyers ask questions via AI. Review unanswered topics in AI Agent console.");
  if (topRooms[0]) recs.push(`High engagement detected. Feature top room in campaign creatives.`);
  if ((events["session_started"] ?? 0) > 10 && (events["lead_captured"] ?? 0) < 2) recs.push("High traffic but low lead capture. Add CTA checkpoints.");
  return recs;
}
