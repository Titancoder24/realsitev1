"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  const [data, setData] = useState<{
    totalSessions: number;
    totalLeads: number;
    hotLeads: number;
    eventCounts: Record<string, number>;
    topRooms: [string, number][];
    recommendations: string[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/analytics").then((r) => r.json()).then(setData);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Buyer Experience Analytics</h1>
        <p className="text-muted-foreground">Sessions, engagement, heat maps, and recommendations</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-normal text-muted-foreground">Sessions</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{data?.totalSessions ?? 0}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-normal text-muted-foreground">Leads</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{data?.totalLeads ?? 0}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-normal text-muted-foreground">Hot Leads</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{data?.hotLeads ?? 0}</p></CardContent></Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Event Breakdown</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(data?.eventCounts ?? {}).map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{v}</span></div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recommendations</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {(data?.recommendations ?? ["Publish experiences to start collecting analytics."]).map((r) => (
              <p key={r} className="text-sm text-muted-foreground">• {r}</p>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
