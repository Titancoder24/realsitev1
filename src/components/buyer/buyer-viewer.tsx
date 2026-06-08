"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIVoicePanel } from "@/components/buyer/ai-voice-panel";
import { PanoramaViewer } from "@/components/buyer/panorama-viewer";
import { SplatViewer } from "@/components/buyer/splat-viewer";
import { FamilySessionPanel } from "@/components/buyer/family-session-panel";
import { Map, Mic, MessageSquare, Phone, Users } from "lucide-react";
import type { ExperienceType } from "@/types/domain";

interface BuyerData {
  id: string;
  type: ExperienceType;
  organization_id: string;
  property_id: string;
  properties?: { name: string; projects?: { name: string; branding?: { primary_color?: string; logo_url?: string } } };
  tour_360_scenes?: { id: string; room_name: string; image_url: string; is_start_scene: boolean; hotspots: unknown[]; initial_yaw?: number; initial_pitch?: number }[];
  splat_worlds?: { spz_100k_url?: string; spz_500k_url?: string; spz_full_res_url?: string; world_marble_url?: string; collider_mesh_url?: string }[];
  floor_maps?: { image_url: string; pins: { id: string; name: string; x: number; y: number; sceneId?: string; cameraPosition?: { x: number; y: number; z: number } }[] }[];
}

export function BuyerViewer({ slug, utm }: { slug: string; utm?: Record<string, string | undefined> }) {
  const [data, setData] = useState<BuyerData | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentSceneId, setCurrentSceneId] = useState<string | null>(null);
  const [showAI, setShowAI] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showFamily, setShowFamily] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", phone: "" });
  const [gaze, setGaze] = useState({ yaw: 0, pitch: 0 });
  const [position3d, setPosition3d] = useState({ x: 0, y: 1, z: 3 });

  const track = useCallback(async (eventType: string, payload?: Record<string, unknown>, heatmap?: Record<string, unknown>) => {
    if (!sessionId || !data) return;
    await fetch("/api/analytics/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        propertyId: data.property_id,
        organizationId: data.organization_id,
        experienceId: data.id,
        eventType,
        payload,
        heatmap: heatmap ? { ...heatmap, experienceType: data.type } : undefined,
      }),
    });
  }, [sessionId, data]);

  useEffect(() => {
    fetch(`/api/experiences/public/${slug}`).then((r) => r.json()).then((exp) => {
      setData(exp);
      const start = exp.tour_360_scenes?.find((s: { is_start_scene: boolean }) => s.is_start_scene) ?? exp.tour_360_scenes?.[0];
      if (start) setCurrentSceneId(start.id);
    }).catch(() => {});
  }, [slug]);

  useEffect(() => {
    if (!data) return;
    fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId: data.property_id,
        organizationId: data.organization_id,
        experienceId: data.id,
        utmSource: utm?.utm_source,
        utmMedium: utm?.utm_medium,
        utmCampaign: utm?.utm_campaign,
        device: typeof window !== "undefined" && window.innerWidth < 768 ? "mobile" : "desktop",
      }),
    }).then((r) => r.json()).then((d) => setSessionId(d.sessionId));
  }, [data, utm]);

  useEffect(() => {
    if (currentSceneId) track("room_entered", { sceneId: currentSceneId }, { sceneId: currentSceneId, dwellSeconds: 3 });
  }, [currentSceneId, track]);

  useEffect(() => {
    if (!sessionId || !data) return;
    const interval = setInterval(() => {
      if (data.type === "worldlabs_splat") {
        track("gaze_sample", { position3d }, { x: position3d.x, y: position3d.y, z: position3d.z, dwellSeconds: 2 });
      } else if (currentSceneId) {
        track("gaze_sample", { gaze, sceneId: currentSceneId }, { sceneId: currentSceneId, x: gaze.yaw, y: gaze.pitch, dwellSeconds: 2 });
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [sessionId, data, currentSceneId, gaze, position3d, track]);

  async function submitLead() {
    if (!sessionId || !data) return;
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organizationId: data.organization_id,
        propertyId: data.property_id,
        sessionId,
        name: leadForm.name,
        phone: leadForm.phone,
        source: utm?.utm_source ?? "direct",
        campaign: utm?.utm_campaign,
      }),
    });
    await track("requested_callback", { name: leadForm.name });
    setShowLeadForm(false);
  }

  if (!data) {
    return <div className="flex h-screen items-center justify-center bg-black text-white">Loading property experience…</div>;
  }

  const projectName = data.properties?.projects?.name ?? "Project";
  const propertyName = data.properties?.name ?? "Property";
  const brandColor = data.properties?.projects?.branding?.primary_color;
  const logoUrl = data.properties?.projects?.branding?.logo_url;
  const scene = data.tour_360_scenes?.find((s) => s.id === currentSceneId);
  const splat = data.splat_worlds?.[0];
  const floorMap = data.floor_maps?.[0];

  return (
    <div className="relative h-screen w-full bg-black text-white">
      <div className="absolute inset-0">
        {data.type === "worldlabs_splat" ? (
          <SplatViewer
            spz100kUrl={splat?.spz_100k_url}
            spz500kUrl={splat?.spz_500k_url}
            spzFullResUrl={splat?.spz_full_res_url}
            worldMarbleUrl={splat?.world_marble_url}
            colliderMeshUrl={splat?.collider_mesh_url}
            onPositionChange={(x, y, z) => setPosition3d({ x, y, z })}
          />
        ) : scene ? (
          <PanoramaViewer
            imageUrl={scene.image_url}
            yaw={scene.initial_yaw ?? 0}
            pitch={scene.initial_pitch ?? 0}
            hotspots={(scene.hotspots as { id: string; label: string; yaw: number; pitch: number; targetSceneId?: string }[]) ?? []}
            onHotspotClick={(h) => h.targetSceneId && setCurrentSceneId(h.targetSceneId)}
            onViewChange={(yaw, pitch) => setGaze({ yaw, pitch })}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/60">No scenes available</div>
        )}
      </div>

      <div className="absolute left-0 right-0 top-0 bg-gradient-to-b from-black/70 to-transparent p-4" style={brandColor ? { borderBottom: `2px solid ${brandColor}` } : undefined}>
        {logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="Logo" className="mb-2 h-8 object-contain" />
        )}
        <p className="text-xs uppercase tracking-wider text-white/70">{projectName}</p>
        <h1 className="text-lg font-semibold">{propertyName}</h1>
        <Badge className="mt-1" variant="secondary">{data.type === "worldlabs_splat" ? "3D Walkthrough" : "360° Tour"}</Badge>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center justify-center gap-3">
          <Button size="icon" variant="secondary" className="h-12 w-12 rounded-full" onClick={() => { setShowAI(true); track("ai_question"); }}>
            <Mic className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full text-white" onClick={() => setShowAI(true)}><MessageSquare className="h-5 w-5" /></Button>
          <Button size="icon" variant="ghost" className="rounded-full text-white" onClick={() => { setShowMap(!showMap); track("floor_map_opened"); }}><Map className="h-5 w-5" /></Button>
          <Button size="icon" variant="ghost" className="rounded-full text-white" onClick={() => setShowFamily(true)}><Users className="h-5 w-5" /></Button>
          <Button size="icon" variant="ghost" className="rounded-full text-white" onClick={() => setShowLeadForm(true)}><Phone className="h-5 w-5" /></Button>
        </div>
      </div>

      {sessionId && showAI && (
        <AIVoicePanel organizationId={data.organization_id} propertyId={data.property_id} sessionId={sessionId} sceneId={currentSceneId ?? undefined} onClose={() => setShowAI(false)} />
      )}

      {showMap && floorMap && (
        <div className="absolute bottom-24 right-4 w-52 rounded-lg border bg-card p-2 text-foreground shadow-lg">
          <p className="mb-2 text-xs font-medium">Floor Map</p>
          <div className="relative aspect-square">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={floorMap.image_url} alt="Floor map" className="h-full w-full object-contain" />
            {(floorMap.pins as { id: string; x: number; y: number; sceneId?: string }[]).map((p) => (
              <button key={p.id} type="button" className="absolute h-2 w-2 rounded-full bg-primary" style={{ left: `${p.x}%`, top: `${p.y}%` }} onClick={() => p.sceneId && setCurrentSceneId(p.sceneId)} />
            ))}
          </div>
        </div>
      )}

      {showFamily && sessionId && (
        <FamilySessionPanel
          sessionId={sessionId}
          propertyId={data.property_id}
          onClose={() => setShowFamily(false)}
          onInvited={() => track("invited_family")}
        />
      )}

      {showLeadForm && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-xl bg-card p-6 text-foreground">
            <h3 className="font-semibold">Request Callback</h3>
            <input className="mt-3 w-full rounded border px-3 py-2 text-sm" placeholder="Name" value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} />
            <input className="mt-2 w-full rounded border px-3 py-2 text-sm" placeholder="Phone" value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} />
            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowLeadForm(false)}>Cancel</Button>
              <Button className="flex-1" onClick={submitLead}>Submit</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
