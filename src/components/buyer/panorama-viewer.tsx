"use client";

import { useEffect, useRef } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import "@photo-sphere-viewer/core/index.css";

interface Hotspot {
  id: string;
  label: string;
  yaw: number;
  pitch: number;
  targetSceneId?: string;
}

export function PanoramaViewer({
  imageUrl,
  yaw = 0,
  pitch = 0,
  hotspots = [],
  onHotspotClick,
  onViewChange,
}: {
  imageUrl: string;
  yaw?: number;
  pitch?: number;
  hotspots?: Hotspot[];
  onHotspotClick?: (hotspot: Hotspot) => void;
  onViewChange?: (yaw: number, pitch: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);

  useEffect(() => {
    if (!containerRef.current || !imageUrl) return;

    const viewer = new Viewer({
      container: containerRef.current,
      panorama: imageUrl,
      defaultYaw: `${yaw}deg`,
      defaultPitch: `${pitch}deg`,
      navbar: false,
      touchmoveTwoFingers: true,
    });

    viewerRef.current = viewer;

    viewer.addEventListener("position-updated", (e) => {
      onViewChange?.(e.position.yaw, e.position.pitch);
    });

    return () => {
      viewer.destroy();
      viewerRef.current = null;
    };
  }, [imageUrl, yaw, pitch, onViewChange]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      {hotspots.map((h) => (
        <button
          key={h.id}
          type="button"
          className="absolute z-10 rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground shadow-lg"
          style={{ left: `${50 + h.yaw / 3.6}%`, top: `${50 - h.pitch / 1.8}%` }}
          onClick={() => onHotspotClick?.(h)}
        >
          {h.label}
        </button>
      ))}
    </div>
  );
}
