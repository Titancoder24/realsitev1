"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function PropertiesContent() {
  const params = useSearchParams();
  const projectId = params.get("projectId");
  const [properties, setProperties] = useState<{ id: string; name: string; unit_type?: string; publish_status?: string; experiences?: { type: string; status: string }[] }[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", unit_type: "", configuration: "", project_id: projectId ?? "" });

  useEffect(() => {
    const url = projectId ? `/api/properties?projectId=${projectId}` : "/api/properties";
    fetch(url).then((r) => r.json()).then(setProperties).catch(() => {});
  }, [projectId]);

  async function createProperty(e: React.FormEvent) {
    e.preventDefault();
    if (!form.project_id) return toast.error("Select a project first via URL ?projectId=");
    const res = await fetch("/api/properties", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error);
    setProperties((p) => [data, ...p]);
    setShowForm(false);
    toast.success("Property created");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Properties</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowForm(!showForm)}>Add Property</Button>
          <Button asChild><Link href="/dashboard/experiences/new">Create Experience</Link></Button>
        </div>
      </div>
      {showForm && (
        <form onSubmit={createProperty} className="grid gap-3 rounded-lg border p-4 md:grid-cols-2">
          <Input placeholder="Property name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input placeholder="Unit type (2BHK, 3BHK…)" value={form.unit_type} onChange={(e) => setForm({ ...form, unit_type: e.target.value })} />
          <Input placeholder="Configuration" value={form.configuration} onChange={(e) => setForm({ ...form, configuration: e.target.value })} />
          <Button type="submit">Save Property</Button>
        </form>
      )}
      <div className="space-y-3">
        {properties.map((p) => (
          <Card key={p.id}>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-base">{p.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{p.unit_type} · {p.experiences?.length ?? 0} experiences</p>
              </div>
              <Badge variant={p.publish_status === "published" ? "success" : "secondary"}>{p.publish_status ?? "draft"}</Badge>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return <Suspense fallback={<p>Loading…</p>}><PropertiesContent /></Suspense>;
}
