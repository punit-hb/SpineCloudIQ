import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { ArrowLeft, Check, ChevronRight, Lock, Save, Shield } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

type PermissionAction = "create" | "read" | "update" | "delete";
type RoleStatus = "Active" | "Inactive";

interface Permission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  status: RoleStatus;
  permissions: Record<PermissionModule, Permission>;
  createdAt: string;
  isSystem: boolean;
}

type PermissionModule =
  | "subscriptions"
  | "clinics"
  | "transactions"
  | "revenue"
  | "users"
  | "analytics"
  | "reports"
  | "audit"
  | "emails"
  | "tickets"
  | "settings";

const emptyPermissions: Record<PermissionModule, Permission> = {
  subscriptions: { create: false, read: false, update: false, delete: false },
  clinics: { create: false, read: false, update: false, delete: false },
  transactions: { create: false, read: false, update: false, delete: false },
  revenue: { create: false, read: false, update: false, delete: false },
  users: { create: false, read: false, update: false, delete: false },
  analytics: { create: false, read: false, update: false, delete: false },
  reports: { create: false, read: false, update: false, delete: false },
  audit: { create: false, read: false, update: false, delete: false },
  emails: { create: false, read: false, update: false, delete: false },
  tickets: { create: false, read: false, update: false, delete: false },
  settings: { create: false, read: false, update: false, delete: false },
};

const mockRoles: Role[] = [
  {
    id: "role_001",
    name: "Super Admin",
    description: "Full system access with all permissions",
    userCount: 3,
    status: "Active",
    permissions: Object.fromEntries(Object.keys(emptyPermissions).map((key) => [key, { create: true, read: true, update: true, delete: true }])) as Record<PermissionModule, Permission>,
    createdAt: "2024-01-15",
    isSystem: true,
  },
  {
    id: "role_002",
    name: "Clinic Admin",
    description: "Manage clinic operations and staff",
    userCount: 12,
    status: "Active",
    permissions: {
      ...emptyPermissions,
      subscriptions: { create: false, read: true, update: false, delete: false },
      clinics: { create: false, read: true, update: true, delete: false },
      users: { create: true, read: true, update: true, delete: false },
      tickets: { create: true, read: true, update: true, delete: false },
      settings: { create: false, read: true, update: true, delete: false },
    },
    createdAt: "2024-02-10",
    isSystem: false,
  },
  {
    id: "role_003",
    name: "Support Staff",
    description: "Handle customer support and tickets",
    userCount: 8,
    status: "Active",
    permissions: {
      ...emptyPermissions,
      subscriptions: { create: false, read: true, update: false, delete: false },
      clinics: { create: false, read: true, update: false, delete: false },
      transactions: { create: false, read: true, update: false, delete: false },
      users: { create: false, read: true, update: false, delete: false },
      analytics: { create: false, read: true, update: false, delete: false },
      reports: { create: false, read: true, update: false, delete: false },
      emails: { create: false, read: true, update: false, delete: false },
      tickets: { create: true, read: true, update: true, delete: false },
    },
    createdAt: "2024-03-05",
    isSystem: false,
  },
  {
    id: "role_004",
    name: "Finance Manager",
    description: "Manage financial operations and reports",
    userCount: 5,
    status: "Inactive",
    permissions: {
      ...emptyPermissions,
      subscriptions: { create: false, read: true, update: true, delete: false },
      transactions: { create: false, read: true, update: true, delete: false },
      revenue: { create: false, read: true, update: true, delete: false },
      reports: { create: true, read: true, update: true, delete: false },
      audit: { create: false, read: true, update: false, delete: false },
    },
    createdAt: "2024-04-20",
    isSystem: false,
  },
];

const modules: Array<{ key: PermissionModule; label: string; description: string }> = [
  { key: "subscriptions", label: "Subscription Management", description: "Plan, entitlement, and billing controls" },
  { key: "clinics", label: "Clinic Management", description: "Clinic profile and organization settings" },
  { key: "transactions", label: "Transactions", description: "Payment and transaction operations" },
  { key: "revenue", label: "Revenue", description: "Revenue reporting and financial views" },
  { key: "users", label: "Users", description: "Administrator and support user access" },
  { key: "analytics", label: "Analytics", description: "Platform insights and usage trends" },
  { key: "reports", label: "Reports", description: "Operational and exportable reports" },
  { key: "audit", label: "Audit & Compliance", description: "Activity review and compliance access" },
  { key: "emails", label: "Email Templates", description: "Notification template management" },
  { key: "tickets", label: "Support Tickets", description: "Support queue and response workflows" },
  { key: "settings", label: "Configurations", description: "System-level configuration controls" },
];

const permissionLabels: Record<PermissionAction, string> = {
  create: "Create",
  read: "View",
  update: "Edit",
  delete: "Delete",
};

const clonePermissions = (permissions: Record<PermissionModule, Permission>) => JSON.parse(JSON.stringify(permissions)) as Record<PermissionModule, Permission>;
const countModulePermissions = (permission: Permission) => Object.values(permission).filter(Boolean).length;
const countAllPermissions = (permissions: Record<PermissionModule, Permission>) => Object.values(permissions).reduce((total, permission) => total + countModulePermissions(permission), 0);

const roleCodeFromName = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

function StatusSegment({ value, onChange, disabled }: { value: RoleStatus; onChange: (value: RoleStatus) => void; disabled?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-800 dark:bg-neutral-900">
      {(["Active", "Inactive"] as RoleStatus[]).map((status) => (
        <button
          key={status}
          type="button"
          disabled={disabled}
          onClick={() => onChange(status)}
          className={`h-9 rounded-md border text-sm font-medium transition-colors disabled:opacity-50 ${
            value === status
              ? "border-primary bg-primary/10 text-primary shadow-sm"
              : "border-transparent text-neutral-600 hover:bg-white dark:text-neutral-300 dark:hover:bg-neutral-950"
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}

function CountBadge({ current, total }: { current: number; total: number }) {
  return (
    <span className="inline-flex h-6 min-w-10 items-center justify-center rounded-full border border-neutral-200 bg-white px-2 text-xs font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
      {current}/{total}
    </span>
  );
}

export default function RoleEditorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { roleId } = useParams();
  const routeRole = (location.state as { role?: Role } | null)?.role;
  const existingRole = routeRole || mockRoles.find((role) => role.id === roleId);
  const mode: "create" | "edit" = roleId ? "edit" : "create";
  const isSystem = Boolean(existingRole?.isSystem);

  const [activeModule, setActiveModule] = useState<PermissionModule>(mode === "create" ? "users" : "users");
  const [roleName, setRoleName] = useState(existingRole?.name || "");
  const [roleCode, setRoleCode] = useState(existingRole?.id || "");
  const [description, setDescription] = useState(existingRole?.description || "");
  const [status, setStatus] = useState<RoleStatus>(existingRole?.status || "Active");
  const [permissions, setPermissions] = useState<Record<PermissionModule, Permission>>(clonePermissions(existingRole?.permissions || emptyPermissions));

  const activeModuleMeta = modules.find((module) => module.key === activeModule) || modules[0];
  const totalSelected = countAllPermissions(permissions);
  const totalAvailable = modules.length * 4;
  const selectedInActiveModule = countModulePermissions(permissions[activeModule]);
  const isActiveModuleComplete = selectedInActiveModule === 4;

  const permissionCards = useMemo(
    () =>
      (Object.keys(permissionLabels) as PermissionAction[]).map((action) => ({
        action,
        title: `${permissionLabels[action]} ${activeModuleMeta.label.replace(" Management", "")}`,
        code: `${activeModule}_${action}`,
      })),
    [activeModule, activeModuleMeta.label],
  );

  const handlePermissionChange = (module: PermissionModule, permission: PermissionAction, value: boolean) => {
    if (isSystem) return;
    setPermissions((current) => ({ ...current, [module]: { ...current[module], [permission]: value } }));
  };

  const handleModuleSelectAll = (module: PermissionModule) => {
    if (isSystem) return;
    const allSelected = Object.values(permissions[module]).every(Boolean);
    setPermissions((current) => ({ ...current, [module]: { create: !allSelected, read: !allSelected, update: !allSelected, delete: !allSelected } }));
  };

  const handleSave = () => {
    if (!roleName.trim()) {
      alert("Please enter a role name");
      return;
    }
    console.log(mode === "create" ? "Creating role:" : "Saving role:", {
      id: existingRole?.id || `role_${Date.now()}`,
      name: roleName,
      code: roleCode || roleCodeFromName(roleName),
      description,
      status,
      permissions,
    });
    navigate("/dashboard/roles");
  };

  return (
    <div className="min-h-full bg-neutral-50 px-4 py-6 text-neutral-950 dark:bg-neutral-950 dark:text-white sm:px-6">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <button type="button" onClick={() => navigate("/dashboard/roles")} className="hover:text-primary">Role Management</button>
            <ChevronRight className="h-4 w-4" />
            <span className="text-neutral-800 dark:text-neutral-200">{mode === "create" ? "Create Role" : "Edit Role"}</span>
          </div>
          <h1 className="text-[32px] font-semibold leading-10 tracking-normal">{mode === "create" ? "Create Role" : "Edit Role"}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-5 text-neutral-600 dark:text-neutral-400">Configure module-level access and operational permissions.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/dashboard/roles")} className="h-10">Cancel</Button>
          <Button onClick={handleSave} disabled={isSystem} className="h-10">
            <Save className="h-4 w-4" />
            Save Role
          </Button>
        </div>
      </div>

      {isSystem ? (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-600 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
          <Lock className="h-4 w-4 text-primary" />
          System roles are protected. Review access details without changing permission mapping.
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(280px,32%)_minmax(0,1fr)]">
        <aside className="xl:sticky xl:top-5 xl:self-start">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Role Information</h2>
              <p className="mt-1 text-[13px] text-neutral-500 dark:text-neutral-400">Define the profile details operators will see in access management.</p>
            </div>
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-[13px] font-medium text-neutral-700 dark:text-neutral-300">Role Name *</span>
                <Input value={roleName} disabled={isSystem} onChange={(event) => { setRoleName(event.target.value); if (!roleCode) setRoleCode(roleCodeFromName(event.target.value)); }} placeholder="Enter role name" className="h-10 rounded-lg" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[13px] font-medium text-neutral-700 dark:text-neutral-300">Role Code</span>
                <Input value={roleCode} disabled={isSystem} onChange={(event) => setRoleCode(event.target.value)} placeholder="manager_level_1" className="h-10 rounded-lg font-mono" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[13px] font-medium text-neutral-700 dark:text-neutral-300">Description</span>
                <Textarea value={description} disabled={isSystem} onChange={(event) => setDescription(event.target.value)} rows={5} placeholder="Describe responsibilities and access boundaries" className="rounded-lg" />
              </label>
              <label className="block">
                <span className="mb-2 block text-[13px] font-medium text-neutral-700 dark:text-neutral-300">Status</span>
                <StatusSegment value={status} onChange={setStatus} disabled={isSystem} />
              </label>
            </div>
            <div className="mt-6 border-t border-neutral-200 pt-6 dark:border-neutral-800">
              <div className="mb-4 flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Selected permissions</span>
                <CountBadge current={totalSelected} total={totalAvailable} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={handleSave} disabled={isSystem} className="h-10">Save Changes</Button>
                <Button variant="outline" onClick={() => navigate("/dashboard/roles")} className="h-10">Cancel</Button>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
          <div className="flex flex-col gap-4 border-b border-neutral-200 p-6 dark:border-neutral-800 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Role Privileges</h2>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Select module-level access with compact permission cards.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => handleModuleSelectAll(activeModule)} disabled={isSystem} className="h-9">
                {isActiveModuleComplete ? "Clear Module" : "Select Module"}
              </Button>
              <Button onClick={handleSave} disabled={isSystem} className="h-9">Save Changes</Button>
            </div>
          </div>

          <div className="grid min-h-[620px] lg:grid-cols-[280px_minmax(0,1fr)]">
            <nav className="border-b border-neutral-200 bg-neutral-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-900/30 lg:border-b-0 lg:border-r">
              <div className="max-h-[520px] space-y-1 overflow-y-auto pr-1">
                {modules.map((module) => {
                  const active = module.key === activeModule;
                  const selectedCount = countModulePermissions(permissions[module.key]);
                  return (
                    <button
                      key={module.key}
                      type="button"
                      onClick={() => setActiveModule(module.key)}
                      className={`relative flex min-h-12 w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${
                        active
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-transparent text-neutral-700 hover:border-neutral-200 hover:bg-white dark:text-neutral-300 dark:hover:border-neutral-800 dark:hover:bg-neutral-950"
                      }`}
                    >
                      {active ? <span className="absolute left-0 top-2 h-8 w-0.5 rounded-r bg-primary" /> : null}
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{module.label}</span>
                        <span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">{module.description}</span>
                      </span>
                      <CountBadge current={selectedCount} total={4} />
                    </button>
                  );
                })}
              </div>
            </nav>

            <div className="flex min-w-0 flex-col">
              <div className="flex flex-col gap-3 border-b border-neutral-200 p-6 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <h3 className="text-xl font-semibold">{activeModuleMeta.label} Permissions</h3>
                  </div>
                  <p className="mt-1 text-[13px] text-neutral-500 dark:text-neutral-400">{activeModuleMeta.description}</p>
                </div>
                <button type="button" disabled={isSystem} onClick={() => handleModuleSelectAll(activeModule)} className="text-sm font-medium text-primary disabled:opacity-50">
                  {isActiveModuleComplete ? "Clear All" : "Select All"}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {permissionCards.map((permission) => {
                    const checked = permissions[activeModule][permission.action];
                    return (
                      <label
                        key={permission.action}
                        className={`flex min-h-[86px] cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm ${
                          checked
                            ? "border-primary bg-primary/5 ring-2 ring-primary/10"
                            : "border-neutral-200 bg-white hover:border-primary/30 dark:border-neutral-800 dark:bg-neutral-950"
                        } ${isSystem ? "cursor-not-allowed opacity-80" : ""}`}
                      >
                        <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${checked ? "border-primary bg-primary text-primary-foreground" : "border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-950"}`}>
                          {checked ? <Check className="h-3.5 w-3.5" /> : null}
                        </span>
                        <input type="checkbox" checked={checked} disabled={isSystem} onChange={(event) => handlePermissionChange(activeModule, permission.action, event.target.checked)} className="sr-only" />
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-neutral-950 dark:text-white">{permission.title}</span>
                          <span className="mt-1 block font-mono text-xs text-neutral-500 dark:text-neutral-400">{permission.code}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="sticky bottom-0 flex flex-col gap-3 border-t border-neutral-200 bg-white/95 p-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  {selectedInActiveModule} of 4 permissions selected for {activeModuleMeta.label}.
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => navigate("/dashboard/roles")} className="h-10">Cancel</Button>
                  <Button onClick={handleSave} disabled={isSystem} className="h-10">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
