"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { worldLabsService } from "@/services/world-labs.service";
import type { WorldLabsJobStatus as JobStatus } from "@/types/domain";

const PROGRESS_MAP: Partial<Record<JobStatus, number>> = {
  draft: 5,
  media_uploaded: 10,
  validating_media: 15,
  preparing_worldlabs_upload: 20,
  worldlabs_upload_ready: 25,
  worldlabs_media_uploaded: 30,
  worldlabs_generation_requested: 40,
  worldlabs_processing: 60,
  worldlabs_succeeded: 75,
  downloading_assets: 85,
  optimizing_viewer_assets: 90,
  ready_for_review: 100,
  published: 100,
};

export function WorldLabsJobStatus({ jobId, onReady }: { jobId: string; onReady?: () => void }) {
  const [status, setStatus] = useState<string>("worldlabs_processing");
  const [developerLabel, setDeveloperLabel] = useState("Generating 3D world");

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/worldlabs/jobs/${jobId}`);
        const data = await res.json();
        if (data.status) {
          setStatus(data.status);
          setDeveloperLabel(data.developerLabel ?? worldLabsService.getDeveloperStatus(data.status));
          if (data.status === "ready_for_review" || data.status === "published") {
            onReady?.();
            clearInterval(interval);
          }
        }
      } catch {
        // polling continues
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [jobId, onReady]);

  const progress = PROGRESS_MAP[status as JobStatus] ?? 50;
  const failed = status.includes("failed");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{developerLabel}</CardTitle>
        <Badge variant={failed ? "destructive" : progress >= 100 ? "success" : "secondary"}>
          {failed ? "Failed" : progress >= 100 ? "Complete" : "Processing"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} />
        <p className="text-sm text-muted-foreground">
          World generation typically takes about 5 minutes. You can leave this page — we will notify you when ready.
        </p>
      </CardContent>
    </Card>
  );
}
