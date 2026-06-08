import { createClient } from "@/lib/supabase/client";

export function subscribeWorldLabsJob(jobId: string, onUpdate: (payload: Record<string, unknown>) => void) {
  const supabase = createClient();
  const channel = supabase
    .channel(`worldlabs-job-${jobId}`)
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "worldlabs_jobs", filter: `id=eq.${jobId}` },
      (payload) => onUpdate(payload.new as Record<string, unknown>)
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}
