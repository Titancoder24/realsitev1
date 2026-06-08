"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AITestConsole } from "@/components/ai/ai-test-console";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Content() {
  const params = useSearchParams();
  const propertyId = params.get("propertyId");
  const [properties, setProperties] = useState<{ id: string; name: string }[]>([]);
  const [selected, setSelected] = useState(propertyId ?? "");

  useEffect(() => {
    fetch("/api/properties").then((r) => r.json()).then((d) => {
      setProperties(d);
      if (!selected && d[0]) setSelected(d[0].id);
    });
  }, [selected]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">AI Agent Operations</h1>
        <p className="text-muted-foreground">Test grounded answers before publishing</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Select Property</CardTitle></CardHeader>
        <CardContent>
          <select className="w-full rounded-md border px-3 py-2 text-sm" value={selected} onChange={(e) => setSelected(e.target.value)}>
            {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </CardContent>
      </Card>
      {selected && <AITestConsole propertyId={selected} />}
    </div>
  );
}

export default function AIAgentPage() {
  return <Suspense fallback={<p>Loading…</p>}><Content /></Suspense>;
}
