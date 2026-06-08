"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BuyerViewer } from "@/components/buyer/buyer-viewer";
import { v4 as uuidv4 } from "uuid";

export default function BuyerViewPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    setSessionId(uuidv4());
  }, []);

  if (!sessionId) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <p>Loading property experience…</p>
      </div>
    );
  }

  const isDemo = slug === "demo";

  return (
    <BuyerViewer
      experienceType={isDemo ? "worldlabs_splat" : "360_realistic"}
      propertyName={isDemo ? "3BHK Premium Unit" : slug}
      projectName="Ocean Heights"
      organizationId="00000000-0000-0000-0000-000000000010"
      propertyId="00000000-0000-0000-0000-000000000002"
      experienceId="00000000-0000-0000-0000-000000000001"
      sessionId={sessionId}
    />
  );
}
