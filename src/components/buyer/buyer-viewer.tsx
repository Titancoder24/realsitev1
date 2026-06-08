"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIVoicePanel } from "@/components/buyer/ai-voice-panel";
import { Map, Mic, MessageSquare, Phone, Users } from "lucide-react";
import type { ExperienceType } from "@/types/domain";

interface BuyerViewerProps {
  experienceType: ExperienceType;
  propertyName: string;
  projectName: string;
  organizationId: string;
  propertyId: string;
  experienceId: string;
  sessionId: string;
  splatUrl?: string;
  panoramaUrl?: string;
}

export function BuyerViewer(props: BuyerViewerProps) {
  const [showAI, setShowAI] = useState(false);
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="relative h-screen w-full bg-black text-white">
      {/* Viewer canvas */}
      <div className="absolute inset-0">
        {props.experienceType === "worldlabs_splat" ? (
          <SplatViewerAdapter splatUrl={props.splatUrl} />
        ) : (
          <Tour360ViewerAdapter panoramaUrl={props.panoramaUrl} />
        )}
      </div>

      {/* Loading overlay header */}
      <div className="absolute left-0 right-0 top-0 bg-gradient-to-b from-black/70 to-transparent p-4">
        <p className="text-xs uppercase tracking-wider text-white/70">{props.projectName}</p>
        <h1 className="text-lg font-semibold">{props.propertyName}</h1>
        <Badge className="mt-1" variant="secondary">
          {props.experienceType === "worldlabs_splat" ? "3D Walkthrough" : "360° Tour"}
        </Badge>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center justify-center gap-3">
          <Button size="icon" variant="secondary" className="rounded-full h-12 w-12" onClick={() => setShowAI(true)}>
            <Mic className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full text-white" onClick={() => setShowAI(true)}>
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full text-white" onClick={() => setShowMap(!showMap)}>
            <Map className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full text-white">
            <Users className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full text-white">
            <Phone className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {showAI && (
        <AIVoicePanel
          organizationId={props.organizationId}
          propertyId={props.propertyId}
          sessionId={props.sessionId}
          onClose={() => setShowAI(false)}
        />
      )}

      {showMap && (
        <div className="absolute bottom-24 right-4 w-48 rounded-lg border bg-card p-2 text-foreground shadow-lg">
          <p className="mb-2 text-xs font-medium">Floor Map</p>
          <div className="aspect-square rounded bg-muted" />
        </div>
      )}
    </div>
  );
}

function Tour360ViewerAdapter({ panoramaUrl }: { panoramaUrl?: string }) {
  return (
    <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
      {panoramaUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={panoramaUrl} alt="360 panorama" className="h-full w-full object-cover" />
      ) : (
        <p className="text-white/60">360° Panorama Viewer — swipe to look around</p>
      )}
    </div>
  );
}

function SplatViewerAdapter({ splatUrl }: { splatUrl?: string }) {
  return (
    <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-950 to-slate-900">
      <p className="text-white/60">
        {splatUrl ? `3D Splat Viewer — ${splatUrl}` : "3D Splat Viewer — WASD to move"}
      </p>
    </div>
  );
}
