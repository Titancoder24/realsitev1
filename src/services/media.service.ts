import { createAdminClient } from "@/lib/supabase/admin";
import { worldLabsService } from "./world-labs.service";

export class MediaService {
  async uploadToStorage(file: File, organizationId: string, propertyId?: string) {
    const admin = createAdminClient();
    const ext = file.name.split(".").pop() ?? "bin";
    const path = `${organizationId}/${propertyId ?? "general"}/${Date.now()}.${ext}`;

    const buffer = await file.arrayBuffer();
    const { error: uploadError } = await admin.storage
      .from("media")
      .upload(path, buffer, { contentType: file.type, upsert: false });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = admin.storage.from("media").getPublicUrl(path);

    const { data: asset, error } = await admin.from("media_assets").insert({
      organization_id: organizationId,
      property_id: propertyId,
      file_name: file.name,
      file_url: publicUrl,
      content_type: file.type,
      file_size: file.size,
      asset_type: file.type.startsWith("image/") ? "image" : "other",
    }).select().single();

    if (error) throw error;
    return asset;
  }

  async uploadToWorldLabs(file: File, organizationId: string, propertyId?: string) {
    const asset = await this.uploadToStorage(file, organizationId, propertyId);

    try {
      const prepared = await worldLabsService.prepareMediaUpload(file.name, file.type);
      const buffer = await file.arrayBuffer();
      await worldLabsService.uploadToSignedUrl(
        prepared.upload_url,
        buffer,
        file.type,
        prepared.upload_headers
      );

      const admin = createAdminClient();
      await admin.from("media_assets").update({
        worldlabs_media_asset_id: prepared.media_asset_id,
      }).eq("id", asset.id);

      return { ...asset, worldlabs_media_asset_id: prepared.media_asset_id };
    } catch {
      return asset;
    }
  }
}

export const mediaService = new MediaService();
