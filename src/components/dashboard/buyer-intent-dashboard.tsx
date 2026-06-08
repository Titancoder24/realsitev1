"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { IntentScoreExplainer } from "@/components/crm/intent-score-explainer";

const mockLeads = [
  { id: "1", name: "Rajesh K.", property: "3BHK Premium Unit", score: 91, status: "hot", source: "WhatsApp" },
  { id: "2", name: "Priya M.", property: "Penthouse", score: 78, status: "qualified", source: "Google Ads" },
  { id: "3", name: "Anonymous", property: "2BHK Sample Flat", score: 45, status: "new", source: "QR Code" },
];

const mockSignals = [
  { type: "long_session", weight: 10, description: "Spent 18 minutes in the walkthrough" },
  { type: "invited_family", weight: 15, description: "Invited 3 family members" },
  { type: "asked_price", weight: 15, description: "Asked about total price" },
  { type: "requested_callback", weight: 20, description: "Requested callback" },
];

export function BuyerIntentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Buyer Intent CRM</h1>
        <p className="text-muted-foreground">Every buyer action becomes structured intent data</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Hot Leads", value: 12 },
          { label: "Callbacks", value: 8 },
          { label: "Family Sessions", value: 5 },
          { label: "Avg Intent", value: "67%" },
        ].map((k) => (
          <Card key={k.label}>
            <CardHeader className="pb-2"><CardDescription>{k.label}</CardDescription></CardHeader>
            <CardContent><div className="text-2xl font-bold">{k.value}</div></CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Leads</CardTitle>
            <CardDescription>Sorted by intent score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockLeads.map((lead) => (
                <div key={lead.id} className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="flex-1">
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.property} · {lead.source}</p>
                  </div>
                  <div className="w-24">
                    <Progress value={lead.score} />
                    <p className="mt-1 text-center text-xs">{lead.score}</p>
                  </div>
                  <Badge variant={lead.status === "hot" ? "success" : "secondary"}>{lead.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Why This Lead Is Hot</CardTitle>
            <CardDescription>Intent Score: 91 / 100</CardDescription>
          </CardHeader>
          <CardContent>
            <IntentScoreExplainer score={91} signals={mockSignals} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
