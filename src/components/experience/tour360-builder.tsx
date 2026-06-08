"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MediaUpload } from "@/components/shared/media-upload";
import { PanoramaViewer } from "@/components/buyer/panorama-viewer";
import { HotspotEditor } from "@/components/experience/hotspot-editor";
import { toast } from "sonner";

interface Scene {
  id: string;
  room_name: string;
  image_url: string;
  thumbnail_url?: string;
  initial_yaw?: number;
  initial_pitch?: number;
  is_start_scene: boolean;
  hotspots: { id: string; label: string; yaw: number; pitch: number; targetSceneId?: string }[];
  ai_context?: string;
}

export function Tour360Builder({ experienceId, propertyId }: { experienceId: string; propertyId: string }) {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [selected, setSelected] = useState<Scene | null>(null);
  const [roomName, setRoomName] = useState("");
  const [viewYaw, setViewYaw] = useState(0);
  const [viewPitch, setViewPitch] = useState(0);

  useEffect(() => {
    fetch(`/api/scenes?experienceId=${experienceId}`).then((r) => r.json()).then(setScenes).catch(() => {});
  }, [experienceId]);

  useEffect(() => {
    if (selected) {
      setViewYaw(selected.initial_yaw ?? 0);
      setViewPitch(selected.initial_pitch ?? 0);
    }
  }, [selected]);

  async function addScene(fileUrl: string, thumbnailUrl?: string) {
    const res = await fetch("/api/scenes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        experience_id: experienceId,
        property_id: propertyId,
        room_name: roomName || `Room ${scenes.length + 1}`,
        image_url: fileUrl,
        thumbnail_url: thumbnailUrl ?? fileUrl,
        is_start_scene: scenes.length === 0,
      }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error);
    setScenes((s) => [...s, data]);
    setSelected(data);
    setRoomName("");
    toast.success("Room added");
  }

  async function saveView() {
    if (!selected) return;
    const res = await fetch(`/api/scenes/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initial_yaw: viewYaw, initial_pitch: viewPitch }),
    });
    if (!res.ok) return toast.error("Failed to save view");
    setScenes((s) => s.map((sc) => sc.id === selected.id ? { ...sc, initial_yaw: viewYaw, initial_pitch: viewPitch } : sc));
    toast.success("Default view saved");
  }

  async function setStartScene(id: string) {
    await fetch(`/api/scenes/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_start_scene: true }) });
    setScenes((s) => s.map((sc) => ({ ...sc, is_start_scene: sc.id === id })));
    toast.success("Start scene updated");
  }

  async function publish() {
    const res = await fetch(`/api/experiences/${experienceId}/publish`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error);
    toast.success(`Published: ${data.publishedUrl}`);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr_320px]">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rooms</CardTitle>
          <Input placeholder="Room name" value={roomName} onChange={(e) => setRoomName(e.target.value)} className="mb-2" />
          <MediaUpload propertyId={propertyId} onUploaded={(a) => addScene(a.file_url, a.file_url)} />
        </CardHeader>
        <CardContent className="space-y-2">
          {scenes.map((room) => (
            <div key={room.id} className={`rounded-md border p-2 ${selected?.id === room.id ? "border-primary bg-primary/5" : ""}`}>
              <button type="button" onClick={() => setSelected(room)} className="w-full text-left text-sm">{room.room_name}</button>
              <div className="mt-1 flex gap-1">
                {room.is_start_scene && <Badge variant="secondary">Start</Badge>}
                {!room.is_start_scene && <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => setStartScene(room.id)}>Set start</Button>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>Panorama Preview</CardTitle>
          {selected && <Button size="sm" variant="outline" onClick={saveView}>Save default view</Button>}
        </CardHeader>
        <CardContent className="aspect-video overflow-hidden rounded-lg">
          {selected ? (
            <PanoramaViewer
              imageUrl={selected.image_url}
              yaw={viewYaw}
              pitch={viewPitch}
              hotspots={selected.hotspots ?? []}
              onViewChange={(y, p) => { setViewYaw(y); setViewPitch(p); }}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">Select or add a room</div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {selected && (
          <HotspotEditor
            sceneId={selected.id}
            hotspots={selected.hotspots ?? []}
            scenes={scenes}
            onSave={(hotspots) => {
              setScenes((s) => s.map((sc) => sc.id === selected.id ? { ...sc, hotspots } : sc));
              setSelected({ ...selected, hotspots });
            }}
          />
        )}
        <Card>
          <CardHeader><CardTitle className="text-base">Actions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="outline" onClick={async () => {
              const res = await fetch(`/api/experiences/${experienceId}`);
              const exp = await res.json();
              if (exp.slug) window.open(`/view/${exp.slug}`, "_blank");
              else toast.error("Publish first");
            }}>Preview</Button>
            <Button className="w-full" onClick={publish}>Publish Experience</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
