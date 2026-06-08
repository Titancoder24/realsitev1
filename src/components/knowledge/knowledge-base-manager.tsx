"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { KnowledgeCategory } from "@/types/domain";

const CATEGORIES: { category: KnowledgeCategory; label: string }[] = [
  { category: "project_details", label: "Project Details" },
  { category: "unit_details", label: "Unit Details" },
  { category: "pricing", label: "Pricing" },
  { category: "availability", label: "Availability" },
  { category: "amenities", label: "Amenities" },
  { category: "possession", label: "Possession" },
  { category: "legal", label: "Legal" },
  { category: "rera", label: "RERA" },
  { category: "faq", label: "FAQs" },
];

export function KnowledgeBaseManager({ readiness = 71 }: { readiness?: number }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">AI Knowledge Base</h1>
          <p className="text-muted-foreground">Zero-hallucination framework — complete critical categories before publishing AI</p>
        </div>
        <Button>Add Entry</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Readiness</CardTitle>
          <CardDescription>Overall: {readiness}%</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={readiness} className="mb-4" />
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat, i) => {
              const complete = i < 6;
              return (
                <div key={cat.category} className="flex items-center justify-between rounded-md border p-3">
                  <span className="text-sm">{cat.label}</span>
                  <Badge variant={complete ? "success" : "warning"}>{complete ? "complete" : "missing"}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
