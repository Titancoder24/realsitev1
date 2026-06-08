"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3, Building2, Home, Layers, Map, Settings,
  Sparkles, Users, Box, Shield, FileText, Mic,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const navGroups = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", label: "Home", icon: Home },
      { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Portfolio",
    items: [
      { href: "/dashboard/projects", label: "Projects", icon: Building2 },
      { href: "/dashboard/properties", label: "Properties", icon: Layers },
      { href: "/dashboard/experiences", label: "Experiences", icon: Box },
      { href: "/dashboard/floor-maps", label: "Floor Maps", icon: Map },
    ],
  },
  {
    label: "AI & Sales",
    items: [
      { href: "/dashboard/knowledge", label: "AI Knowledge", icon: FileText },
      { href: "/dashboard/ai-agent", label: "AI Agent", icon: Mic },
      { href: "/dashboard/leads", label: "Leads CRM", icon: Users },
      { href: "/dashboard/campaigns", label: "Campaigns", icon: Sparkles },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
      { href: "/admin", label: "Admin", icon: Shield, adminOnly: true },
    ],
  },
];

export function SpatialSalesAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r bg-card lg:flex lg:flex-col">
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">SS</div>
          <div>
            <p className="text-sm font-semibold">Spatial Sales</p>
            <p className="text-xs text-muted-foreground">Real Estate AI</p>
          </div>
        </div>
        <nav className="flex-1 space-y-6 overflow-y-auto p-4">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                        active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                      {"adminOnly" in item && item.adminOnly && <Badge variant="outline" className="ml-auto text-[10px]">Admin</Badge>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card/50 px-4 backdrop-blur">
          <Input placeholder="Search projects, properties, leads…" className="max-w-md" />
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="success">Engines Online</Badge>
            <Button size="sm" variant="ghost" asChild><Link href="/dashboard/settings">Settings</Link></Button>
            <Button size="sm" asChild>
              <Link href="/dashboard/projects/new">Create Project</Link>
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
