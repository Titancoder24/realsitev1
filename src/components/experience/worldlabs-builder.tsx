"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { WorldLabsJobStatus } from "./worldlabs-job-status";
import { toast } from "sonner";

const STEPS = ["Upload Media", "Add Context", "Generate", "Review", "Publish"];

export function WorldLabsBuilder({ experienceId, propertyId }: { experienceId: string; propertyId: string }) {
  const [step, setStep] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [jobId, setJobId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function submitGeneration() {
    setUploading(true);
    try {
      const res = await fetch("/api/worldlabs/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experienceId, propertyId, prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      setJobId(data.jobId);
      setStep(2);
      toast.success("3D generation started");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to start generation");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Generate 3D Walkthrough</h2>
        <p className="text-muted-foreground">Upload property media to create an immersive 3D experience</p>
      </div>

      <div className="flex gap-2">
        {STEPS.map((s, i) => (
          <Badge key={s} variant={i <= step ? "default" : "outline"}>{s}</Badge>
        ))}
      </div>
      <Progress value={((step + 1) / STEPS.length) * 100} />

      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Property Media</CardTitle>
            <CardDescription>Images of rooms, amenities, lobby, exterior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed">
              <p className="text-sm text-muted-foreground">Drag & drop images or click to upload</p>
            </div>
            <Button onClick={() => setStep(1)}>Continue</Button>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Generation Context</CardTitle>
            <CardDescription>Optional prompt to guide 3D world generation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="e.g. Modern 3BHK apartment with balcony view"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
              <Button onClick={submitGeneration} disabled={uploading}>
                {uploading ? "Starting…" : "Generate 3D Walkthrough"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step >= 2 && jobId && (
        <WorldLabsJobStatus jobId={jobId} onReady={() => setStep(3)} />
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Ready for Review</CardTitle>
            <CardDescription>Review generated world, add floor map pins and checkpoints</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setStep(4)}>Continue to Publish</Button>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardHeader><CardTitle>Publish Experience</CardTitle></CardHeader>
          <CardContent>
            <Button asChild>
              <a href={`/api/experiences/${experienceId}/publish`}>Publish Buyer Link</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
