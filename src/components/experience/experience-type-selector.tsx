"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Box } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExperienceType } from "@/types/domain";

const options: { type: ExperienceType; title: string; description: string; badge: string; icon: typeof Camera }[] = [
  {
    type: "360_realistic",
    title: "360° Realistic Experience",
    description: "Fast, reliable, works with panoramas and room images. Best for quick onboarding and sales demos.",
    badge: "Fastest",
    icon: Camera,
  },
  {
    type: "worldlabs_splat",
    title: "Generate 3D Walkthrough",
    description: "Asynchronous 3D world generation from property media. Premium immersive splat experience.",
    badge: "Premium 3D",
    icon: Box,
  },
];

export function ExperienceTypeSelector({
  selected,
  onSelect,
}: {
  selected?: ExperienceType;
  onSelect: (type: ExperienceType) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = selected === opt.type;
        return (
          <button
            key={opt.type}
            type="button"
            onClick={() => onSelect(opt.type)}
            className="text-left"
          >
            <Card className={cn("cursor-pointer transition-all hover:border-primary/50", active && "border-primary ring-2 ring-primary/20")}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Icon className="h-8 w-8 text-primary" />
                  <Badge>{opt.badge}</Badge>
                </div>
                <CardTitle className="mt-4">{opt.title}</CardTitle>
                <CardDescription>{opt.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {opt.type === "360_realistic"
                    ? "Upload panoramas → create rooms → add hotspots → publish"
                    : "Upload media → generate 3D world → review → publish"}
                </p>
              </CardContent>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
