import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { worldLabsService } from "@/services/world-labs.service";

export async function GET(_req: Request, { params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  const supabase = createAdminClient();

  const { data: job, error } = await supabase
    .from("worldlabs_jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (error || !job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: job.id,
    status: job.status,
    operationId: job.operation_id,
    worldId: job.world_id,
    developerLabel: worldLabsService.getDeveloperStatus(job.status),
    errorMessage: job.error_message,
    retryCount: job.retry_count,
    startedAt: job.started_at,
    completedAt: job.completed_at,
  });
}
