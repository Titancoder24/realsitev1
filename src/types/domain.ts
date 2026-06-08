export type ExperienceType = "360_realistic" | "worldlabs_splat" | "future_inhouse_splat";
export type ExperienceStatus = "draft" | "processing" | "ready_for_review" | "published" | "unpublished" | "archived" | "failed";

export type WorldLabsJobStatus =
  | "draft"
  | "media_uploaded"
  | "validating_media"
  | "preparing_worldlabs_upload"
  | "worldlabs_upload_ready"
  | "worldlabs_media_uploaded"
  | "worldlabs_generation_requested"
  | "worldlabs_processing"
  | "worldlabs_succeeded"
  | "downloading_assets"
  | "optimizing_viewer_assets"
  | "ready_for_review"
  | "published"
  | "media_validation_failed"
  | "worldlabs_upload_failed"
  | "worldlabs_generation_failed"
  | "worldlabs_polling_failed"
  | "asset_download_failed"
  | "viewer_optimization_failed"
  | "manual_review_required";

export type KnowledgeCategory =
  | "project_details"
  | "unit_details"
  | "pricing"
  | "availability"
  | "amenities"
  | "possession"
  | "legal"
  | "rera"
  | "bank_approvals"
  | "nri_process"
  | "financing"
  | "developer_profile"
  | "faq"
  | "objection"
  | "room_context"
  | "checkpoint_context"
  | "restricted_topic"
  | "fallback";

export type UserRole =
  | "organization_admin"
  | "project_manager"
  | "sales_manager"
  | "sales_agent"
  | "marketing_manager"
  | "viewer"
  | "platform_admin";

export type CheckpointType =
  | "info"
  | "room_detail"
  | "view"
  | "amenity"
  | "ai_trigger"
  | "cta"
  | "legal_disclaimer"
  | "pricing"
  | "internal_only";

export type LeadStatus = "new" | "contacted" | "qualified" | "hot" | "callback_requested" | "lost" | "converted";

export interface SpatialGenerationInput {
  experienceId: string;
  propertyId: string;
  organizationId: string;
  mediaAssetIds: string[];
  prompt?: string;
  model?: string;
}

export interface SpatialGenerationResult {
  engine: ExperienceType;
  status: ExperienceStatus | WorldLabsJobStatus;
  jobId?: string;
  worldId?: string;
  assets?: Record<string, string>;
}

export interface RAGContext {
  id: string;
  category: KnowledgeCategory;
  title: string;
  content: string;
  sourceType: string;
  sourceId?: string;
  score: number;
}

export interface AIResponse {
  answer: string;
  retrievedSources: RAGContext[];
  confidenceScore: number;
  sensitiveTopic: boolean;
  fallbackUsed: boolean;
  humanEscalation: boolean;
  navigationIntent?: { type: string; targetId?: string };
}

export interface IntentSignal {
  type: string;
  weight: number;
  description: string;
}
