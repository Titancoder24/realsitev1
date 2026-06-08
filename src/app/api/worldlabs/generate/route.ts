import { NextResponse } from "next/server";
import { z } from "zod";
import { spatialGenerationService } from "@/services/spatial-generation.service";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  experienceId: z.string().uuid(),
  propertyId: z.string().uuid(),
  organizationId: z.string().uuid().optional(),
  mediaAssetIds: z.array(z.string().uuid()).optional(),
  prompt: z.string().optional(),
  model: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = schema.parse(body);

    const supabase = createAdminClient();
    const { data: property } = await supabase
      .from("properties")
      .select("organization_id")
      .eq("id", input.propertyId)
      .single();

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const organizationId = input.organizationId ?? property.organization_id;

    const result = await spatialGenerationService.generate("worldlabs_splat", {
      experienceId: input.experienceId,
      propertyId: input.propertyId,
      organizationId,
      mediaAssetIds: input.mediaAssetIds ?? [],
      prompt: input.prompt,
      model: input.model,
    });

    // Process async in background (production: use BullMQ queue)
    if (result.jobId) {
      spatialGenerationService.processWorldLabsJob(result.jobId).catch(console.error);
    }

    return NextResponse.json({ jobId: result.jobId, status: result.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
