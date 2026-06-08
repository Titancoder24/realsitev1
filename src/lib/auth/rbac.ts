import type { UserRole } from "@/types/domain";

const ROLE_HIERARCHY: Record<UserRole, number> = {
  viewer: 1,
  sales_agent: 2,
  marketing_manager: 3,
  sales_manager: 4,
  project_manager: 5,
  organization_admin: 6,
  platform_admin: 7,
};

export function hasRole(userRole: UserRole, required: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[required];
}

export function canAccessAdmin(role: UserRole): boolean {
  return role === "platform_admin";
}

export function canManageProjects(role: UserRole): boolean {
  return hasRole(role, "project_manager");
}

export function canViewLeads(role: UserRole): boolean {
  return hasRole(role, "sales_agent");
}

export function canManageLeads(role: UserRole): boolean {
  return hasRole(role, "sales_manager");
}

export const ROUTE_PERMISSIONS: Record<string, UserRole> = {
  "/dashboard": "viewer",
  "/dashboard/projects": "project_manager",
  "/dashboard/properties": "project_manager",
  "/dashboard/experiences": "project_manager",
  "/dashboard/leads": "sales_agent",
  "/dashboard/campaigns": "marketing_manager",
  "/admin": "platform_admin",
};
