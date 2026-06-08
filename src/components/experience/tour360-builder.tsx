"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload } from "lucide-react";

const mockRooms = [
  { id: "1", name: "Living Room", hasImage: true, isStart: true },
  { id: "2", name: "Kitchen", hasImage: true, isStart: false },
  { id: "3", name: "Master Bedroom", hasImage: false, isStart: false },
  { id: "4", name: "Balcony", hasImage: false, isStart: false },
];

export function Tour360Builder({ experienceId }: { experienceId: string }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr_320px]">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rooms</CardTitle>
          <Button size="sm" variant="outline" className="w-full"><Plus className="mr-2 h-4 w-4" />Add Room</Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {mockRooms.map((room) => (
            <div key={room.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
              <span>{room.name}</span>
              <div className="flex gap-1">
                {room.isStart && <Badge variant="secondary">Start</Badge>}
                {!room.hasImage && <Badge variant="warning">No image</Badge>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Panorama Preview</CardTitle>
          <CardDescription>Experience ID: {experienceId}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
            <div className="text-center">
              <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Upload 360° equirectangular image</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Scene Properties</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>Select a room to edit hotspots, starting direction, AI context, and floor map pin.</p>
          <Button className="w-full">Preview Buyer Experience</Button>
          <Button className="w-full" variant="default">Publish</Button>
        </CardContent>
      </Card>
    </div>
  );
}
