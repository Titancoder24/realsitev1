"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadTimeline } from "@/components/crm/lead-timeline";
import { IntentScoreExplainer } from "@/components/crm/intent-score-explainer";

export default function LeadDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<{
    lead: { name?: string; phone?: string; intent_score?: number; lead_status?: string; intent_signals?: { type: string; weight: number; description: string }[]; properties?: { name: string } };
    events: { id: string; event_type: string; payload?: Record<string, unknown>; created_at: string }[];
    messages: { role: string; content: string; created_at: string }[];
  } | null>(null);

  useEffect(() => {
    fetch(`/api/leads/${id}`).then((r) => r.json()).then(setData);
  }, [id]);

  if (!data) return <p>Loading lead…</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{data.lead.name ?? "Anonymous Lead"}</h1>
          <p className="text-muted-foreground">{data.lead.properties?.name} · {data.lead.phone}</p>
        </div>
        <Badge variant={data.lead.intent_score && data.lead.intent_score >= 80 ? "success" : "secondary"}>
          {data.lead.lead_status} · Intent {data.lead.intent_score}
        </Badge>
      </div>
      <Tabs defaultValue="timeline">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
          <TabsTrigger value="intent">Intent</TabsTrigger>
        </TabsList>
        <TabsContent value="timeline">
          <Card><CardContent className="pt-6"><LeadTimeline events={data.events} /></CardContent></Card>
        </TabsContent>
        <TabsContent value="ai">
          <Card><CardContent className="space-y-3 pt-6">
            {data.messages.map((m, i) => (
              <div key={i} className={`rounded p-3 text-sm ${m.role === "user" ? "bg-muted" : "bg-primary/5"}`}>
                <span className="text-xs font-medium uppercase">{m.role}</span>
                <p>{m.content}</p>
              </div>
            ))}
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="intent">
          <Card><CardContent className="pt-6">
            <IntentScoreExplainer score={data.lead.intent_score ?? 0} signals={data.lead.intent_signals ?? []} />
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
