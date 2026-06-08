import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockJobs = [
  { id: "job-1", property: "3BHK Premium", status: "worldlabs_processing", operationId: "op-abc123", retry: 0 },
  { id: "job-2", property: "Penthouse", status: "ready_for_review", operationId: "op-def456", retry: 0 },
  { id: "job-3", property: "Clubhouse", status: "worldlabs_generation_failed", operationId: "op-ghi789", retry: 2 },
];

export default function WorldLabsAdminPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">World Labs Operations</h1>
            <p className="text-muted-foreground">Production 3D generation job monitoring</p>
          </div>
          <Badge variant="success">API Online</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "In Queue", value: 2 },
            { label: "Processing", value: 1 },
            { label: "Succeeded", value: 24 },
            { label: "Failed", value: 3 },
          ].map((s) => (
            <Card key={s.label}>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-normal text-muted-foreground">{s.label}</CardTitle></CardHeader>
              <CardContent><p className="text-2xl font-bold">{s.value}</p></CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle>Recent Jobs</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">{job.property}</p>
                    <p className="text-xs text-muted-foreground">Operation: {job.operationId} · Retries: {job.retry}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={job.status.includes("failed") ? "destructive" : job.status === "ready_for_review" ? "success" : "secondary"}>
                      {job.status}
                    </Badge>
                    {job.status.includes("failed") && <Button size="sm" variant="outline">Retry</Button>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
