import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PropertiesPage() {
  const properties = [
    { name: "2BHK Sample Flat", type: "Residential", experience: "360°", status: "published" },
    { name: "3BHK Premium Unit", type: "Residential", experience: "360° + 3D", status: "published" },
    { name: "Penthouse", type: "Residential", experience: "3D", status: "processing" },
    { name: "Clubhouse", type: "Amenity", experience: "360°", status: "draft" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Properties</h1>
        <Button asChild><Link href="/dashboard/experiences/new">Create Experience</Link></Button>
      </div>
      <div className="space-y-3">
        {properties.map((p) => (
          <Card key={p.name}>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-base">{p.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{p.type} · {p.experience}</p>
              </div>
              <Badge variant={p.status === "published" ? "success" : p.status === "processing" ? "warning" : "secondary"}>
                {p.status}
              </Badge>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
