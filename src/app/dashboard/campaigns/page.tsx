"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<{ id: string; utm_campaign?: string; url?: string; properties?: { name: string }; sessions?: number; leads?: number; hotLeads?: number }[]>([]);
  const [properties, setProperties] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({ property_id: "", utm_source: "whatsapp", utm_medium: "social", utm_campaign: "" });

  useEffect(() => {
    fetch("/api/campaigns").then((r) => r.json()).then(setCampaigns).catch(() => {});
    fetch("/api/campaigns/analytics").then((r) => r.json()).then((analytics) => {
      if (Array.isArray(analytics)) {
        setCampaigns((prev) => prev.map((c) => {
          const a = analytics.find((x: { id: string }) => x.id === c.id);
          return a ? { ...c, sessions: a.sessions, leads: a.leads, hotLeads: a.hotLeads } : c;
        }));
      }
    }).catch(() => {});
    fetch("/api/properties").then((r) => r.json()).then(setProperties);
  }, []);

  async function create() {
    const res = await fetch("/api/campaigns", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error);
    setCampaigns((c) => [data, ...c]);
    toast.success("Campaign link created");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Campaign Links</h1>
      <Card>
        <CardHeader><CardTitle>Create Link</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <select className="rounded-md border px-3 py-2 text-sm" value={form.property_id} onChange={(e) => setForm({ ...form, property_id: e.target.value })}>
            <option value="">Select property</option>
            {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <Input placeholder="Campaign name" value={form.utm_campaign} onChange={(e) => setForm({ ...form, utm_campaign: e.target.value })} />
          <Input placeholder="Source" value={form.utm_source} onChange={(e) => setForm({ ...form, utm_source: e.target.value })} />
          <Input placeholder="Medium" value={form.utm_medium} onChange={(e) => setForm({ ...form, utm_medium: e.target.value })} />
          <Button onClick={create} disabled={!form.property_id}>Generate Link</Button>
        </CardContent>
      </Card>
      <div className="space-y-3">
        {campaigns.map((c) => (
          <Card key={c.id}>
            <CardContent className="py-4">
              <p className="font-medium">{c.properties?.name} — {c.utm_campaign}</p>
              <p className="text-xs text-muted-foreground">{c.sessions ?? 0} sessions · {c.leads ?? 0} leads · {c.hotLeads ?? 0} hot</p>
              <p className="text-xs text-muted-foreground break-all">{c.url}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
