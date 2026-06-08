import { createAdminClient } from "@/lib/supabase/admin";
import type { KnowledgeCategory, RAGContext } from "@/types/domain";

export class RAGService {
  async retrieve(params: {
    organizationId: string;
    propertyId: string;
    query: string;
    sceneId?: string;
    checkpointId?: string;
    limit?: number;
  }): Promise<RAGContext[]> {
    const supabase = createAdminClient();
    const limit = params.limit ?? 8;

    // Text search fallback when pgvector not configured
    const { data: entries } = await supabase
      .from("knowledge_entries")
      .select("id, category, title, content, source_type, source_id")
      .eq("organization_id", params.organizationId)
      .eq("property_id", params.propertyId)
      .eq("approved", true)
      .ilike("content", `%${params.query.split(" ")[0]}%`)
      .limit(limit);

    const results: RAGContext[] = (entries ?? []).map((e, i) => ({
      id: e.id,
      category: e.category as KnowledgeCategory,
      title: e.title,
      content: e.content,
      sourceType: e.source_type,
      sourceId: e.source_id ?? undefined,
      score: 0.85 - i * 0.05,
    }));

    // Boost scene/checkpoint context
    if (params.checkpointId) {
      const { data: cp } = await supabase
        .from("checkpoints")
        .select("id, title, description, ai_context")
        .eq("id", params.checkpointId)
        .single();
      if (cp?.ai_context) {
        results.unshift({
          id: cp.id,
          category: "checkpoint_context",
          title: cp.title,
          content: cp.ai_context || cp.description || "",
          sourceType: "checkpoint",
          sourceId: cp.id,
          score: 0.95,
        });
      }
    }

    if (params.sceneId) {
      const { data: scene } = await supabase
        .from("tour_360_scenes")
        .select("id, room_name, ai_context")
        .eq("id", params.sceneId)
        .single();
      if (scene?.ai_context) {
        results.unshift({
          id: scene.id,
          category: "room_context",
          title: scene.room_name,
          content: scene.ai_context,
          sourceType: "scene",
          sourceId: scene.id,
          score: 0.9,
        });
      }
    }

    return results.slice(0, limit);
  }

  async getReadinessScore(propertyId: string) {
    const supabase = createAdminClient();
    const critical: KnowledgeCategory[] = [
      "project_details", "unit_details", "pricing", "availability",
      "amenities", "possession", "legal", "rera", "faq",
    ];

    const { data } = await supabase
      .from("knowledge_entries")
      .select("category")
      .eq("property_id", propertyId)
      .eq("approved", true);

    const present = new Set((data ?? []).map((d) => d.category));
    const categories = critical.map((cat) => ({
      category: cat,
      status: present.has(cat) ? "complete" : "missing",
    }));
    const complete = categories.filter((c) => c.status === "complete").length;
    return {
      categories,
      overall: Math.round((complete / critical.length) * 100),
    };
  }
}

export const ragService = new RAGService();
