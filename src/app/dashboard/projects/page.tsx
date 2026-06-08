import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const projects = [
  { id: "1", name: "Ocean Heights", city: "Mumbai", properties: 8, experiences: 12, hotLeads: 24 },
  { id: "2", name: "Green Valley", city: "Pune", properties: 5, experiences: 6, hotLeads: 11 },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-muted-foreground">Manage developer projects and portfolios</p>
        </div>
        <Button asChild><Link href="/dashboard/projects/new">Create Project</Link></Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p) => (
          <Card key={p.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{p.name}</CardTitle>
              <Badge>{p.city}</Badge>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {p.properties} properties · {p.experiences} experiences · {p.hotLeads} hot leads
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
