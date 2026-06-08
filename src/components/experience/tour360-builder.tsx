"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MediaUpload } from "@/components/shared/media-upload";
import { PanoramaViewer } from "@/components/buyer/panorama-viewer";
import { toast } from "sonner";

interface Scene {
  id: string;
  room_name: string;
  image_url: string;
  is_start_scene: boolean;
  hotspots: { id: string; label: string; yaw: number; pitch: number; targetSceneId?: string }[];
  ai_context?: string;
}

export function Tour360Builder({ experienceId, propertyId }: { experienceId: string; propertyId: string }) {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [selected, setSelected] = useState<Scene | null>(null);
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    fetch(`/api/scenes?experienceId=${experienceId}`).then((r) => r.json()).then(setScenes).catch(() => {});
  }, [experienceId]);

  async function addScene(fileUrl: string) {
    const res = await fetch("/api/scenes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        experience_id: experienceId,
        property_id: propertyId,
        room_name: roomName || `Room ${scenes.length + 1}`,
        image_url: fileUrl,
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
          <MediaUpload propertyId={propertyId} onUploaded={(a) => addScene(a.file_url)} />
        </CardHeader>
        <CardContent className="space-y-2">
          {scenes.map((room) => (
            <button key={room.id} type="button" onClick={() => setSelected(room)} className={`w-full rounded-md border p-2 text-left text-sm ${selected?.id === room.id ? "border-primary bg-primary/5" : ""}`}>
              <span>{room.room_name}</span>
              {room.is_start_scene && <Badge className="ml-2" variant="secondary">Start</Badge>}
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Panorama Preview</CardTitle></CardHeader>
        <CardContent className="aspect-video overflow-hidden rounded-lg">
          {selected ? (
            <PanoramaViewer imageUrl={selected.image_url} hotspots={selected.hotspots ?? []} />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">Select or add a room</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Actions</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full" variant="outline" onClick={async () => {
            const res = await fetch(`/api/experiences/${experienceId}`);
            const exp = await res.json();
            if (exp.slug) window.open(`/view/${exp.slug}`, "_blank");
            else toast.error("Publish first to get a buyer link");
          }}>Preview</Button>
          <Button className="w-full" onClick={publish}>Publish Experience</Button>
        </CardContent>
      </Card>
    </div>
  );
}
