"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight, Building2, Eye, Flame, Phone, Users } from "lucide-react";

interface DashboardStats {
  totalProjects: number;
  totalProperties: number;
  publishedExperiences: number;
  experiences360: number;
  experiences3d: number;
  processingJobs: number;
  failedGenerations: number;
  buyerSessions: number;
  hotLeads: number;
  callbackRequests: number;
  familySessions: number;
  avgIntentScore: number;
}

const defaultStats: DashboardStats = {
  totalProjects: 0,
  totalProperties: 0,
  publishedExperiences: 0,
  experiences360: 0,
  experiences3d: 0,
  processingJobs: 0,
  failedGenerations: 0,
  buyerSessions: 0,
  hotLeads: 0,
  callbackRequests: 0,
  familySessions: 0,
  avgIntentScore: 0,
};

export function ExecutiveOverviewDashboard({ stats = defaultStats }: { stats?: Partial<DashboardStats> }) {
  const s = { ...defaultStats, ...stats };

  const kpis = [
    { label: "Projects", value: s.totalProjects, icon: Building2 },
    { label: "Properties", value: s.totalProperties, icon: Building2 },
    { label: "Published", value: s.publishedExperiences, icon: Eye },
    { label: "360° Tours", value: s.experiences360, icon: Eye },
    { label: "3D Walkthroughs", value: s.experiences3d, icon: Eye },
    { label: "Processing", value: s.processingJobs, icon: ArrowUpRight },
    { label: "Buyer Sessions", value: s.buyerSessions, icon: Users },
    { label: "Hot Leads", value: s.hotLeads, icon: Flame },
    { label: "Callbacks", value: s.callbackRequests, icon: Phone },
    { label: "Avg Intent", value: `${s.avgIntentScore}%`, icon: Flame },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Executive Overview</h1>
          <p className="text-muted-foreground">Spatial sales performance across your portfolio</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild><Link href="/dashboard/experiences/new">Create Experience</Link></Button>
          <Button asChild><Link href="/dashboard/properties/new">Add Property</Link></Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>{kpi.label}</CardDescription>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent High-Intent Events</CardTitle>
            <CardDescription>Buyer actions that signal purchase intent</CardDescription>
          </CardHeader>
          <CardContent>
            {s.buyerSessions === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="mb-4 h-10 w-10 text-muted-foreground" />
                <p className="font-medium">No buyer sessions yet</p>
                <p className="text-sm text-muted-foreground">Publish an experience or create a campaign link</p>
                <Button className="mt-4" asChild><Link href="/dashboard/experiences">Publish Experience</Link></Button>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { time: "10:16 PM", event: "Requested callback", score: 91 },
                  { time: "10:11 PM", event: "Asked: Is this RERA approved?", score: 78 },
                  { time: "10:08 PM", event: "Invited spouse to family session", score: 72 },
                ].map((e) => (
                  <div key={e.time} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">{e.event}</p>
                      <p className="text-xs text-muted-foreground">{e.time}</p>
                    </div>
                    <Badge variant={e.score >= 80 ? "success" : "secondary"}>Intent {e.score}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engine Health</CardTitle>
            <CardDescription>360° + World Labs status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">360° Engine</span>
              <Badge variant="success">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">3D Walkthrough (World Labs)</span>
              <Badge variant="success">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Failed Generations</span>
              <Badge variant={s.failedGenerations > 0 ? "destructive" : "secondary"}>{s.failedGenerations}</Badge>
            </div>
            {s.failedGenerations > 0 && (
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/admin/worldlabs">Review Failed Jobs</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
