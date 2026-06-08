"use client";

import { useEffect, useRef } from "react";

function pickSplatUrl(urls: { spz100k?: string; spz500k?: string; spzFull?: string; marbleUrl?: string }) {
  if (typeof window === "undefined") return urls.spz500k ?? urls.marbleUrl;
  const isMobile = window.innerWidth < 768;
  const lowEnd = navigator.hardwareConcurrency <= 4;
  if (isMobile && lowEnd && urls.spz100k) return urls.spz100k;
  if (isMobile && urls.spz500k) return urls.spz500k;
  return urls.spzFull ?? urls.spz500k ?? urls.spz100k ?? urls.marbleUrl;
}

export function SplatViewer({
  spz100kUrl,
  spz500kUrl,
  spzFullResUrl,
  worldMarbleUrl,
}: {
  spz100kUrl?: string;
  spz500kUrl?: string;
  spzFullResUrl?: string;
  worldMarbleUrl?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const url = pickSplatUrl({ spz100k: spz100kUrl, spz500k: spz500kUrl, spzFull: spzFullResUrl, marbleUrl: worldMarbleUrl });
    if (!url) return;

    let viewer: { dispose?: () => void } | null = null;
    let cancelled = false;

    async function init() {
      if (worldMarbleUrl && url === worldMarbleUrl) {
        if (containerRef.current && !cancelled) {
          containerRef.current.innerHTML = `<iframe src="${worldMarbleUrl}" class="h-full w-full border-0" allow="fullscreen" />`;
        }
        return;
      }

      try {
        const { Viewer } = await import("@mkkellogg/gaussian-splats-3d");
        if (cancelled || !containerRef.current) return;
        viewer = new Viewer({
          rootElement: containerRef.current,
          cameraUp: [0, 1, 0],
          initialCameraPosition: [0, 1, 3],
          initialCameraLookAt: [0, 0, 0],
          sharedMemoryForWorkers: false,
        });
        await (viewer as { addSplatScene: (url: string) => Promise<void> }).addSplatScene(url!);
      } catch {
        if (containerRef.current && worldMarbleUrl) {
          containerRef.current.innerHTML = `<iframe src="${worldMarbleUrl}" class="h-full w-full border-0" allow="fullscreen" />`;
        }
      }
    }

    init();
    return () => {
      cancelled = true;
      viewer?.dispose?.();
    };
  }, [spz100kUrl, spz500kUrl, spzFullResUrl, worldMarbleUrl]);

  return <div ref={containerRef} className="h-full w-full bg-black" />;
}
