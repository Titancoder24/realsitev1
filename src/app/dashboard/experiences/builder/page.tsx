"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Tour360Builder } from "@/components/experience/tour360-builder";
import { WorldLabsBuilder } from "@/components/experience/worldlabs-builder";
import type { ExperienceType } from "@/types/domain";

function BuilderContent() {
  const params = useSearchParams();
  const type = (params.get("type") ?? "360_realistic") as ExperienceType;
  const experienceId = params.get("id") ?? "00000000-0000-0000-0000-000000000001";
  const propertyId = params.get("propertyId") ?? "00000000-0000-0000-0000-000000000002";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Experience Builder</h1>
        <p className="text-muted-foreground">
          {type === "worldlabs_splat" ? "Generate 3D Walkthrough" : "360° Realistic Experience"}
        </p>
      </div>
      {type === "worldlabs_splat" ? (
        <WorldLabsBuilder experienceId={experienceId} propertyId={propertyId} />
      ) : (
        <Tour360Builder experienceId={experienceId} propertyId={propertyId} />
      )}
    </div>
  );
}

export default function ExperienceBuilderPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading builder…</div>}>
      <BuilderContent />
    </Suspense>
  );
}
