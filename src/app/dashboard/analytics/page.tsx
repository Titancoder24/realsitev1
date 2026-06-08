"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeatMapExplorer } from "@/components/analytics/heat-map-explorer";

export default function AnalyticsPage() {
  const [data, setData] = useState<{
    totalSessions: number;
    totalLeads: number;
    hotLeads: number;
    eventCounts: Record<string, number>;
    recommendations: string[];
    heatmapPoints?: { scene_id?: string; x?: number; y?: number; z?: number; dwell_seconds?: number; experience_type?: string }[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/analytics").then((r) => r.json()).then(setData);
  }, []);

  const points360 = (data?.heatmapPoints ?? []).filter((p) => p.experience_type !== "worldlabs_splat");
  const points3d = (data?.heatmapPoints ?? []).filter((p) => p.experience_type === "worldlabs_splat");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Buyer Experience Analytics</h1>
        <p className="text-muted-foreground">Sessions, heat maps, and recommendations</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-normal text-muted-foreground">Sessions</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{data?.totalSessions ?? 0}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-normal text-muted-foreground">Leads</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{data?.totalLeads ?? 0}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-normal text-muted-foreground">Hot Leads</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{data?.hotLeads ?? 0}</p></CardContent></Card>
      </div>
      <Tabs defaultValue="heatmap">
        <TabsList>
          <TabsTrigger value="heatmap">Heat Maps</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="heatmap">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card><CardHeader><CardTitle>360° Heat Map</CardTitle></CardHeader><CardContent><HeatMapExplorer points={points360} mode="360" /></CardContent></Card>
            <Card><CardHeader><CardTitle>3D Heat Map</CardTitle></CardHeader><CardContent><HeatMapExplorer points={points3d} mode="3d" /></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="events">
          <Card>
            <CardHeader><CardTitle>Recommendations</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {(data?.recommendations ?? []).map((r) => <p key={r} className="text-sm text-muted-foreground">• {r}</p>)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
