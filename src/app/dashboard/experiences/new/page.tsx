"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExperienceTypeSelector } from "@/components/experience/experience-type-selector";
import { Button } from "@/components/ui/button";
import type { ExperienceType } from "@/types/domain";

export default function NewExperiencePage() {
  const [selected, setSelected] = useState<ExperienceType>();
  const router = useRouter();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create Experience</h1>
        <p className="text-muted-foreground">Choose your production creation engine</p>
      </div>
      <ExperienceTypeSelector selected={selected} onSelect={setSelected} />
      <Button
        disabled={!selected}
        onClick={() => router.push(`/dashboard/experiences/builder?type=${selected}`)}
      >
        Continue
      </Button>
    </div>
  );
}
