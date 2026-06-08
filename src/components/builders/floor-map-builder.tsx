"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MediaUpload } from "@/components/shared/media-upload";
import { toast } from "sonner";

interface Pin {
  id: string;
  name: string;
  x: number;
  y: number;
  sceneId?: string;
  cameraPosition?: { x: number; y: number; z: number };
}

export function FloorMapBuilder({
  propertyId,
  experienceId,
  initialMap,
}: {
  propertyId: string;
  experienceId?: string;
  initialMap?: { id: string; image_url: string; pins: Pin[] };
}) {
  const [imageUrl, setImageUrl] = useState(initialMap?.image_url ?? "");
  const [pins, setPins] = useState<Pin[]>(initialMap?.pins ?? []);
  const [mapId, setMapId] = useState(initialMap?.id);
  const [placing, setPlacing] = useState(false);
  const [pinName, setPinName] = useState("");

  function handleMapClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!placing || !imageUrl) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPins((p) => [...p, { id: crypto.randomUUID(), name: pinName || `Pin ${p.length + 1}`, x, y }]);
    setPlacing(false);
    setPinName("");
  }

  async function save() {
    if (!imageUrl) return toast.error("Upload a floor plan first");
    const payload = { property_id: propertyId, experience_id: experienceId, image_url: imageUrl, name: "Floor Map", pins };
    const res = await fetch(mapId ? `/api/floor-maps/${mapId}` : "/api/floor-maps", {
      method: mapId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error);
    if (!mapId) setMapId(data.id);
    toast.success("Floor map saved");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>Floor Plan</CardTitle>
          <MediaUpload propertyId={propertyId} onUploaded={(a) => setImageUrl(a.file_url)} />
        </CardHeader>
        <CardContent>
          <div
            className="relative aspect-video cursor-crosshair rounded-lg border bg-muted"
            onClick={handleMapClick}
          >
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="Floor plan" className="h-full w-full object-contain" />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">Upload floor plan</div>
            )}
            {pins.map((p) => (
              <div key={p.id} className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-2 ring-white" style={{ left: `${p.x}%`, top: `${p.y}%` }} title={p.name} />
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Pins</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Pin name" value={pinName} onChange={(e) => setPinName(e.target.value)} />
          <Button variant={placing ? "default" : "outline"} className="w-full" onClick={() => setPlacing(!placing)}>
            {placing ? "Click map to place…" : "Add Pin"}
          </Button>
          {pins.map((p) => (
            <div key={p.id} className="text-sm">{p.name} ({p.x.toFixed(0)}%, {p.y.toFixed(0)}%)</div>
          ))}
          <Button className="w-full" onClick={save}>Save Map</Button>
        </CardContent>
      </Card>
    </div>
  );
}
