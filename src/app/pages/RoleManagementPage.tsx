import { type ComponentType, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Check,
  CheckCircle,
  Columns3,
  Download,
  Edit,
  Filter,
  Grid3X3,
  List,
  MoreVertical,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Shield,
  Table2,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";

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
  status: "Active" | "Inactive";
  permissions: {
    subscriptions: Permission;
    clinics: Permission;
    transactions: Permission;
    revenue: Permission;
    users: Permission;
    analytics: Permission;
    reports: Permission;
    audit: Permission;
    emails: Permission;
    tickets: Permission;
    settings: Permission;
  };
  createdAt: string;
  isSystem: boolean;
}

type ViewMode = "grid" | "list" | "table";
type ColumnKey = "name" | "description" | "userCount" | "permissions" | "status" | "createdAt" | "isSystem";
type PermissionModule = keyof Role["permissions"];

const ITEMS_PER_PAGE = 10;

const emptyPermissions: Role["permissions"] = {
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
    permissions: Object.fromEntries(Object.keys(emptyPermissions).map((key) => [key, { create: true, read: true, update: true, delete: true }])) as Role["permissions"],
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

const modules: Array<{ key: PermissionModule; label: string }> = [
  { key: "subscriptions", label: "Subscription Management" },
  { key: "clinics", label: "Clinic Management" },
  { key: "transactions", label: "Transactions" },
  { key: "revenue", label: "Revenue" },
  { key: "users", label: "Users" },
  { key: "analytics", label: "Analytics" },
  { key: "reports", label: "Reports" },
  { key: "audit", label: "Audit & Compliance" },
  { key: "emails", label: "Email Management" },
  { key: "tickets", label: "Support Tickets" },
  { key: "settings", label: "Settings" },
];

const tableColumns: Array<{ key: ColumnKey; label: string }> = [
  { key: "name", label: "Role Name" },
  { key: "description", label: "Description" },
  { key: "userCount", label: "Users Assigned" },
  { key: "permissions", label: "Permissions" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Created" },
  { key: "isSystem", label: "Type" },
];

const formatDate = (value: string) => new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

function HeaderIconButton({ title, icon: Icon, active, badge, onClick }: { title: string; icon: ComponentType<{ className?: string }>; active?: boolean; badge?: number; onClick?: () => void }) {
  return (
    <button type="button" title={title} aria-label={title} onClick={onClick} className={`relative inline-flex h-10 w-10 items-center justify-center rounded-lg border text-neutral-600 transition-colors hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900 ${active ? "border-primary bg-primary/10 text-primary" : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"}`}>
      <Icon className="h-4 w-4" />
      {badge ? <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">{badge}</span> : null}
    </button>
  );
}

function ViewModeSwitcher({ value, onChange }: { value: ViewMode; onChange: (value: ViewMode) => void }) {
  const modes: Array<{ value: ViewMode; title: string; icon: ComponentType<{ className?: string }> }> = [
    { value: "grid", title: "Grid View", icon: Grid3X3 },
    { value: "list", title: "List View", icon: List },
    { value: "table", title: "Table View", icon: Table2 },
  ];
  return (
    <div className="inline-flex h-10 items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-800 dark:bg-neutral-900">
      {modes.map(({ value: mode, title, icon: Icon }) => (
        <button key={mode} type="button" title={title} onClick={() => onChange(mode)} className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors ${value === mode ? "border border-neutral-200 bg-white text-primary shadow-sm dark:border-neutral-800 dark:bg-neutral-950" : "text-neutral-500 hover:bg-white dark:text-neutral-400 dark:hover:bg-neutral-950"}`}>
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: Role["status"] }) {
  const dot = status === "Active" ? "bg-emerald-500" : "bg-neutral-400";
  return (
    <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2 text-xs font-medium text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}

function TypeBadge({ isSystem }: { isSystem: boolean }) {
  return (
    <span className={`inline-flex h-6 items-center rounded-full border px-2 text-xs font-medium ${isSystem ? "border-primary/20 bg-primary/5 text-primary" : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300"}`}>
      {isSystem ? "System" : "Custom"}
    </span>
  );
}

function PermissionBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex h-6 items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 text-xs font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300">
      {count} Active
    </span>
  );
}

function RoleMark() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
      <Shield className="h-4 w-4" />
    </div>
  );
}

function ColumnPanel({ visibleColumns, onToggle, onClose }: { visibleColumns: Record<ColumnKey, boolean>; onToggle: (key: ColumnKey) => void; onClose: () => void }) {
  const activeCount = Object.values(visibleColumns).filter(Boolean).length;
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute right-0 top-12 z-40 w-64 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
        <div className="flex h-11 items-center justify-between border-b border-neutral-100 px-4 dark:border-neutral-800">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Columns</h3>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-2">
          {tableColumns.map((column) => (
            <button key={column.key} type="button" onClick={() => onToggle(column.key)} className="flex h-9 w-full items-center gap-3 rounded-md px-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900">
              <span className={`flex h-4 w-4 items-center justify-center rounded border ${visibleColumns[column.key] ? "border-primary bg-primary text-white" : "border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-950"}`}>
                {visibleColumns[column.key] ? <Check className="h-3 w-3" /> : null}
              </span>
              {column.label}
            </button>
          ))}
        </div>
        <div className="border-t border-neutral-100 px-4 py-3 text-xs font-medium text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">{activeCount} of {tableColumns.length} active</div>
      </div>
    </>
  );
}

function FilterPanel({
  draftRows,
  setDraftRows,
  draftStatus,
  setDraftStatus,
  draftType,
  setDraftType,
  draftDateRange,
  setDraftDateRange,
  onClear,
  onCancel,
  onApply,
}: {
  draftRows: string[];
  setDraftRows: (rows: string[]) => void;
  draftStatus: string;
  setDraftStatus: (value: string) => void;
  draftType: string;
  setDraftType: (value: string) => void;
  draftDateRange: { start: string; end: string };
  setDraftDateRange: (range: { start: string; end: string }) => void;
  onClear: () => void;
  onCancel: () => void;
  onApply: () => void;
}) {
  const fields = ["status", "type", "created"];
  const labels: Record<string, string> = { status: "Status", type: "Role Type", created: "Created Date" };
  const remaining = fields.filter((field) => !draftRows.includes(field));
  const renderWhat = (field: string) => {
    if (field === "status") {
      return (
        <select value={draftStatus} onChange={(event) => setDraftStatus(event.target.value)} className="h-10 flex-1 rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-950">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      );
    }
    if (field === "type") {
      return (
        <select value={draftType} onChange={(event) => setDraftType(event.target.value)} className="h-10 flex-1 rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-950">
          <option value="system">System</option>
          <option value="custom">Custom</option>
        </select>
      );
    }
    return (
      <div className="grid flex-1 grid-cols-2 gap-2">
        <input type="date" value={draftDateRange.start} onChange={(event) => setDraftDateRange({ ...draftDateRange, start: event.target.value })} className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-950" />
        <input type="date" value={draftDateRange.end} onChange={(event) => setDraftDateRange({ ...draftDateRange, end: event.target.value })} className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-950" />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center bg-black/30 px-4 pt-28">
      <div className="w-full max-w-xl overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-950">
        <div className="flex h-12 items-center justify-between border-b border-neutral-100 px-4 dark:border-neutral-800">
          <h2 className="text-sm font-semibold">Filter By</h2>
          <button type="button" onClick={onCancel} className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3 p-4">
          <div className="grid grid-cols-[150px_1fr_32px] gap-2 px-1 text-xs font-semibold uppercase text-neutral-500"><span>Where</span><span>What</span><span /></div>
          {draftRows.length === 0 ? <div className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50 px-3 py-6 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">No filters selected.</div> : null}
          {draftRows.map((row) => (
            <div key={row} className="grid grid-cols-[150px_1fr_32px] items-center gap-2">
              <div className="flex h-10 items-center rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm font-medium dark:border-neutral-800 dark:bg-neutral-900">{labels[row]}</div>
              {renderWhat(row)}
              <button type="button" onClick={() => setDraftRows(draftRows.filter((item) => item !== row))} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"><X className="h-4 w-4" /></button>
            </div>
          ))}
          <button type="button" disabled={remaining.length === 0} onClick={() => setDraftRows([...draftRows, remaining[0]])} className="inline-flex h-9 items-center gap-2 rounded-lg px-2 text-sm font-medium text-primary hover:bg-primary/10 disabled:opacity-40">
            <Plus className="h-4 w-4" />
            Add Filter
          </button>
        </div>
        <div className="flex h-14 items-center justify-end gap-2 border-t border-neutral-100 px-4 dark:border-neutral-800">
          <button type="button" onClick={onClear} className="h-9 rounded-lg px-3 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900">Clear All</button>
          <button type="button" onClick={onCancel} className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium dark:border-neutral-800 dark:bg-neutral-950">Cancel</button>
          <button type="button" onClick={onApply} className="h-9 rounded-lg border border-primary bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90">Apply</button>
        </div>
      </div>
    </div>
  );
}

export default function RoleManagementPage() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [showSummary, setShowSummary] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showColumnPanel, setShowColumnPanel] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [draftRows, setDraftRows] = useState<string[]>([]);
  const [draftStatus, setDraftStatus] = useState("Active");
  const [draftType, setDraftType] = useState("custom");
  const [draftDateRange, setDraftDateRange] = useState({ start: "", end: "" });
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>({
    name: true,
    description: true,
    userCount: true,
    permissions: true,
    status: true,
    createdAt: true,
    isSystem: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"add" | "edit">("add");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStatus, setFormStatus] = useState<Role["status"]>("Active");
  const [formPermissions, setFormPermissions] = useState<Role["permissions"]>(emptyPermissions);

  useEffect(() => {
    if (viewMode !== "table") setShowColumnPanel(false);
  }, [viewMode]);

  const countPermissions = (permissions: Role["permissions"]) => Object.values(permissions).reduce((sum, permission) => sum + Number(permission.create) + Number(permission.read) + Number(permission.update) + Number(permission.delete), 0);

  const filteredRoles = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();
    return roles.filter((role) => {
      const matchesSearch = !search || role.name.toLowerCase().includes(search) || role.description.toLowerCase().includes(search);
      const matchesStatus = !statusFilter || role.status === statusFilter;
      const matchesType = !typeFilter || (typeFilter === "system" ? role.isSystem : !role.isSystem);
      const matchesStart = !dateRange.start || new Date(role.createdAt) >= new Date(dateRange.start);
      const matchesEnd = !dateRange.end || new Date(role.createdAt) <= new Date(dateRange.end);
      return matchesSearch && matchesStatus && matchesType && matchesStart && matchesEnd;
    });
  }, [dateRange.end, dateRange.start, roles, searchQuery, statusFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRoles.length / ITEMS_PER_PAGE));
  const currentData = filteredRoles.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const activeFilterCount = (statusFilter ? 1 : 0) + (typeFilter ? 1 : 0) + (dateRange.start || dateRange.end ? 1 : 0);
  const selectedOnPage = currentData.length > 0 && currentData.every((role) => selectedRowIds.includes(role.id));
  const visibleColumnCount = Object.values(visibleColumns).filter(Boolean).length;

  const openFilters = () => {
    const rows = [];
    if (statusFilter) rows.push("status");
    if (typeFilter) rows.push("type");
    if (dateRange.start || dateRange.end) rows.push("created");
    setDraftRows(rows);
    setDraftStatus(statusFilter || "Active");
    setDraftType(typeFilter || "custom");
    setDraftDateRange({ ...dateRange });
    setShowFilterPanel(true);
  };

  const applyFilters = () => {
    setStatusFilter(draftRows.includes("status") ? draftStatus : "");
    setTypeFilter(draftRows.includes("type") ? draftType : "");
    setDateRange(draftRows.includes("created") ? draftDateRange : { start: "", end: "" });
    setCurrentPage(1);
    setShowFilterPanel(false);
  };

  const clearFilters = () => {
    setDraftRows([]);
    setStatusFilter("");
    setTypeFilter("");
    setDateRange({ start: "", end: "" });
    setDraftDateRange({ start: "", end: "" });
    setCurrentPage(1);
  };

  const handleAddRole = () => {
    setDrawerMode("add");
    setSelectedRole(null);
    setFormName("");
    setFormDescription("");
    setFormStatus("Active");
    setFormPermissions(JSON.parse(JSON.stringify(emptyPermissions)) as Role["permissions"]);
    setIsDrawerOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setDrawerMode("edit");
    setSelectedRole(role);
    setFormName(role.name);
    setFormDescription(role.description);
    setFormStatus(role.status);
    setFormPermissions(JSON.parse(JSON.stringify(role.permissions)) as Role["permissions"]);
    setIsDrawerOpen(true);
    setActiveMenuRowId(null);
  };

  const handleSaveRole = () => {
    if (!formName.trim()) {
      alert("Please enter a role name");
      return;
    }
    if (drawerMode === "add") {
      setRoles([...roles, { id: `role_${Date.now()}`, name: formName, description: formDescription, userCount: 0, status: formStatus, permissions: formPermissions, createdAt: new Date().toISOString().split("T")[0], isSystem: false }]);
    } else if (selectedRole) {
      setRoles(roles.map((role) => (role.id === selectedRole.id ? { ...role, name: formName, description: formDescription, status: formStatus, permissions: formPermissions } : role)));
    }
    setIsDrawerOpen(false);
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find((item) => item.id === roleId);
    if (role?.isSystem) {
      alert("System roles cannot be deleted.");
      return;
    }
    if (confirm("Are you sure you want to delete this custom access role? This action cannot be undone.")) {
      setRoles(roles.filter((item) => item.id !== roleId));
      setSelectedRowIds(selectedRowIds.filter((id) => id !== roleId));
      setActiveMenuRowId(null);
    }
  };

  const handleBulkDelete = () => {
    const customSelected = roles.filter((role) => selectedRowIds.includes(role.id) && !role.isSystem);
    if (customSelected.length === 0) {
      alert("No deletable custom roles selected (system roles cannot be deleted).");
      return;
    }
    if (confirm(`Are you sure you want to delete the ${customSelected.length} custom roles?`)) {
      const customIds = customSelected.map((role) => role.id);
      setRoles(roles.filter((role) => !customIds.includes(role.id)));
      setSelectedRowIds([]);
    }
  };

  const handlePermissionChange = (module: PermissionModule, permission: keyof Permission, value: boolean) => {
    setFormPermissions((current) => ({ ...current, [module]: { ...current[module], [permission]: value } }));
  };

  const handleSelectAllPermissions = (module: PermissionModule) => {
    const allSelected = Object.values(formPermissions[module]).every(Boolean);
    setFormPermissions((current) => ({ ...current, [module]: { create: !allSelected, read: !allSelected, update: !allSelected, delete: !allSelected } }));
  };

  const handleExport = () => alert(`Success: Exported ${filteredRoles.length} custom role setups to Excel.`);
  const handlePrint = () => alert(`Success: Exported ${filteredRoles.length} custom role setups to PDF.`);

  const toggleColumn = (key: ColumnKey) => {
    setVisibleColumns((current) => {
      if (current[key] && Object.values(current).filter(Boolean).length === 1) return current;
      return { ...current, [key]: !current[key] };
    });
  };

  const toggleSelected = (roleId: string, checked: boolean) => {
    setSelectedRowIds((current) => (checked ? Array.from(new Set([...current, roleId])) : current.filter((id) => id !== roleId)));
  };

  const roleActions = (role: Role) => (
    <div className="relative inline-block text-left">
      <button type="button" title="Actions" onClick={() => setActiveMenuRowId(activeMenuRowId === role.id ? null : role.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900">
        <MoreVertical className="h-4 w-4" />
      </button>
      {activeMenuRowId === role.id ? (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setActiveMenuRowId(null)} />
          <div className="absolute right-0 top-9 z-40 w-48 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
            <button type="button" onClick={() => handleEditRole(role)} className="flex h-9 w-full items-center gap-2 px-3 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900">
              <Edit className="h-4 w-4 text-neutral-500" />
              Edit Permissions
            </button>
            {!role.isSystem ? (
              <button type="button" onClick={() => handleDeleteRole(role.id)} className="flex h-9 w-full items-center gap-2 border-t border-neutral-100 px-3 text-sm text-red-600 hover:bg-red-50 dark:border-neutral-800 dark:text-red-400 dark:hover:bg-red-950/20">
                <Trash2 className="h-4 w-4" />
                Delete Profile
              </button>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );

  const renderPagination = () => (
    <div className="flex flex-col gap-3 border-t border-neutral-200 bg-white px-4 py-3 text-sm dark:border-neutral-800 dark:bg-neutral-950 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-neutral-500">Showing {filteredRoles.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredRoles.length)} of {filteredRoles.length}</p>
      <div className="flex items-center gap-2">
        <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950">Previous</button>
        <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
        <button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950">Next</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-full bg-neutral-50 px-6 py-5 text-[14px] text-neutral-900 dark:bg-neutral-950 dark:text-white">
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="mb-1 text-xs font-medium text-neutral-500">Administration <span className="mx-1 text-neutral-300">/</span> Role Management</div>
          <h1 className="text-2xl font-semibold leading-8 tracking-normal text-neutral-950 dark:text-white">Role & Permissions</h1>
          <p className="mt-1 max-w-2xl text-sm leading-5 text-neutral-500 dark:text-neutral-400">Configure access control profiles, assign module permissions, and view assigned users.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
          {isSearchOpen ? (
            <div className="flex h-10 min-w-[360px] items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950">
              <Search className="h-4 w-4 shrink-0" />
              <input autoFocus value={searchQuery} onChange={(event) => { setSearchQuery(event.target.value); setCurrentPage(1); }} placeholder="Search roles by name or description..." className="h-full flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white" />
              <button type="button" title="Filter By" onClick={openFilters} className="relative rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900"><Filter className="h-4 w-4" />{activeFilterCount ? <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">{activeFilterCount}</span> : null}</button>
              <button type="button" title="Close Search" onClick={() => setIsSearchOpen(false)} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900"><X className="h-4 w-4" /></button>
            </div>
          ) : (
            <HeaderIconButton title="Search" icon={Search} active={Boolean(searchQuery)} onClick={() => setIsSearchOpen(true)} />
          )}
          {viewMode === "table" ? (
            <div className="relative">
              <HeaderIconButton title="Customized columns" icon={Columns3} active={showColumnPanel || visibleColumnCount < tableColumns.length} onClick={() => setShowColumnPanel((value) => !value)} />
              {showColumnPanel ? <ColumnPanel visibleColumns={visibleColumns} onToggle={toggleColumn} onClose={() => setShowColumnPanel(false)} /> : null}
            </div>
          ) : null}
          <button type="button" onClick={handleAddRole} className="inline-flex h-10 items-center gap-2 rounded-lg border border-primary bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90"><Plus className="h-4 w-4" />Add New Role</button>
          <HeaderIconButton title="Summary" icon={BarChart3} active={showSummary} onClick={() => setShowSummary((value) => !value)} />
          <HeaderIconButton title="Refresh" icon={RefreshCw} onClick={() => alert("Role list refreshed successfully.")} />
          <div className="relative">
            <HeaderIconButton title="More options" icon={MoreVertical} active={showMoreMenu} onClick={() => setShowMoreMenu((value) => !value)} />
            {showMoreMenu ? (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowMoreMenu(false)} />
                <div className="absolute right-0 top-12 z-40 w-44 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
                  <button type="button" onClick={() => alert("Import workflow is not configured for this module.")} className="flex h-9 w-full items-center gap-2 px-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900"><Upload className="h-4 w-4 text-neutral-500" />Import</button>
                  <button type="button" onClick={handleExport} className="flex h-9 w-full items-center gap-2 px-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900"><Download className="h-4 w-4 text-neutral-500" />Export</button>
                  <button type="button" onClick={handlePrint} className="flex h-9 w-full items-center gap-2 px-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900"><Printer className="h-4 w-4 text-neutral-500" />Print</button>
                </div>
              </>
            ) : null}
          </div>
          <ViewModeSwitcher value={viewMode} onChange={setViewMode} />
        </div>
      </div>

      {showSummary ? (
        <div className="mb-5 grid gap-4 md:grid-cols-4">
          {[
            { label: "Total Profiles", value: roles.length, icon: Shield },
            { label: "System Roles", value: roles.filter((role) => role.isSystem).length, icon: CheckCircle },
            { label: "Custom Roles", value: roles.filter((role) => !role.isSystem).length, icon: Users },
            { label: "Active Profiles", value: roles.filter((role) => role.status === "Active").length, icon: BarChart3 },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
              <div className="mb-3 flex items-center justify-between"><span className="text-xs font-semibold uppercase text-neutral-500">{label}</span><span className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900"><Icon className="h-4 w-4" /></span></div>
              <p className="text-2xl font-semibold leading-none">{value}</p>
            </div>
          ))}
        </div>
      ) : null}

      {selectedRowIds.length ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950">
          <span className="text-sm font-medium">{selectedRowIds.length} selected</span>
          <div className="flex items-center gap-2"><button type="button" onClick={handleBulkDelete} className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 px-3 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300"><Trash2 className="h-4 w-4" />Delete Selected</button><button type="button" onClick={() => setSelectedRowIds([])} className="h-9 rounded-lg px-3 text-sm font-medium text-neutral-500 hover:bg-neutral-100">Clear</button></div>
        </div>
      ) : null}

      {filteredRoles.length === 0 ? (
        <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-950"><Shield className="mx-auto h-10 w-10 text-neutral-400" /><h3 className="mt-3 text-sm font-semibold">No Roles Found</h3><p className="mt-1 text-sm text-neutral-500">Adjust search or filters to find matching role profiles.</p></div>
      ) : (
        <>
          {viewMode === "table" ? (
            <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left">
                  <thead className="bg-neutral-50 dark:bg-neutral-900">
                    <tr className="border-b border-neutral-200 dark:border-neutral-800">
                      <th className="w-12 px-4 py-3"><input type="checkbox" checked={selectedOnPage} onChange={(event) => setSelectedRowIds(event.target.checked ? Array.from(new Set([...selectedRowIds, ...currentData.map((role) => role.id)])) : selectedRowIds.filter((id) => !currentData.map((role) => role.id).includes(id)))} className="h-4 w-4 rounded border-neutral-300 accent-primary" /></th>
                      {visibleColumns.name ? <th className="px-4 py-3 text-xs font-semibold uppercase text-neutral-500">Role Name</th> : null}
                      {visibleColumns.description ? <th className="px-4 py-3 text-xs font-semibold uppercase text-neutral-500">Description</th> : null}
                      {visibleColumns.userCount ? <th className="px-4 py-3 text-xs font-semibold uppercase text-neutral-500">Users Assigned</th> : null}
                      {visibleColumns.permissions ? <th className="px-4 py-3 text-xs font-semibold uppercase text-neutral-500">Permissions</th> : null}
                      {visibleColumns.status ? <th className="px-4 py-3 text-xs font-semibold uppercase text-neutral-500">Status</th> : null}
                      {visibleColumns.createdAt ? <th className="px-4 py-3 text-xs font-semibold uppercase text-neutral-500">Created</th> : null}
                      {visibleColumns.isSystem ? <th className="px-4 py-3 text-xs font-semibold uppercase text-neutral-500">Type</th> : null}
                      <th className="w-20 px-4 py-3 text-right text-xs font-semibold uppercase text-neutral-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {currentData.map((role) => (
                      <tr key={role.id} className={`h-14 hover:bg-neutral-50 dark:hover:bg-neutral-900 ${selectedRowIds.includes(role.id) ? "bg-primary/5" : ""}`}>
                        <td className="px-4 py-3"><input type="checkbox" checked={selectedRowIds.includes(role.id)} onChange={(event) => toggleSelected(role.id, event.target.checked)} className="h-4 w-4 rounded border-neutral-300 accent-primary" /></td>
                        {visibleColumns.name ? <td className="px-4 py-3"><button type="button" onClick={() => handleEditRole(role)} className="flex items-center gap-3 text-left"><RoleMark /><span><span className="block text-sm font-semibold text-primary hover:underline">{role.name}</span>{role.isSystem ? <span className="text-[10px] font-semibold uppercase text-neutral-400">System profile</span> : null}</span></button></td> : null}
                        {visibleColumns.description ? <td className="max-w-xs truncate px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{role.description}</td> : null}
                        {visibleColumns.userCount ? <td className="px-4 py-3"><span className="inline-flex h-6 items-center rounded-full border border-primary/20 bg-primary/5 px-2 text-xs font-medium text-primary">{role.userCount} {role.userCount === 1 ? "User" : "Users"}</span></td> : null}
                        {visibleColumns.permissions ? <td className="px-4 py-3"><PermissionBadge count={countPermissions(role.permissions)} /></td> : null}
                        {visibleColumns.status ? <td className="px-4 py-3"><StatusBadge status={role.status} /></td> : null}
                        {visibleColumns.createdAt ? <td className="px-4 py-3 font-mono text-sm text-neutral-600 dark:text-neutral-400">{formatDate(role.createdAt)}</td> : null}
                        {visibleColumns.isSystem ? <td className="px-4 py-3"><TypeBadge isSystem={role.isSystem} /></td> : null}
                        <td className="px-4 py-3 text-right">{roleActions(role)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {renderPagination()}
            </div>
          ) : null}

          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {currentData.map((role) => (
                <div key={role.id} onClick={() => handleEditRole(role)} className={`cursor-pointer rounded-lg border border-neutral-200 bg-white p-4 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 ${selectedRowIds.includes(role.id) ? "ring-2 ring-primary/20" : ""}`}>
                  <div className="mb-4 flex items-start justify-between gap-3"><div className="flex items-center gap-3"><input type="checkbox" checked={selectedRowIds.includes(role.id)} onClick={(event) => event.stopPropagation()} onChange={(event) => toggleSelected(role.id, event.target.checked)} className="h-4 w-4 rounded border-neutral-300 accent-primary" /><RoleMark /><div><h3 className="text-sm font-semibold">{role.name}</h3><p className="text-xs text-neutral-500">{role.description}</p></div></div><div onClick={(event) => event.stopPropagation()}>{roleActions(role)}</div></div>
                  <div className="grid gap-3 text-sm"><div className="flex justify-between"><span className="text-neutral-500">Status</span><StatusBadge status={role.status} /></div><div className="flex justify-between"><span className="text-neutral-500">Type</span><TypeBadge isSystem={role.isSystem} /></div><div className="flex justify-between"><span className="text-neutral-500">Users</span><span className="font-medium">{role.userCount}</span></div><div className="flex justify-between"><span className="text-neutral-500">Permissions</span><PermissionBadge count={countPermissions(role.permissions)} /></div></div>
                </div>
              ))}
              <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white md:col-span-2 xl:col-span-3 dark:border-neutral-800 dark:bg-neutral-950">{renderPagination()}</div>
            </div>
          ) : null}

          {viewMode === "list" ? (
            <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {currentData.map((role) => (
                  <div key={role.id} onClick={() => handleEditRole(role)} className={`flex cursor-pointer flex-col gap-3 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 md:flex-row md:items-center md:justify-between ${selectedRowIds.includes(role.id) ? "bg-primary/5" : ""}`}>
                    <div className="flex min-w-0 items-center gap-3"><input type="checkbox" checked={selectedRowIds.includes(role.id)} onClick={(event) => event.stopPropagation()} onChange={(event) => toggleSelected(role.id, event.target.checked)} className="h-4 w-4 rounded border-neutral-300 accent-primary" /><RoleMark /><div className="min-w-0"><h3 className="truncate text-sm font-semibold">{role.name}</h3><p className="truncate text-sm text-neutral-500">{role.description}</p></div></div>
                    <div className="flex flex-wrap items-center gap-4 md:justify-end"><TypeBadge isSystem={role.isSystem} /><StatusBadge status={role.status} /><PermissionBadge count={countPermissions(role.permissions)} /><span className="text-sm text-neutral-500">{role.userCount} users</span><div onClick={(event) => event.stopPropagation()}>{roleActions(role)}</div></div>
                  </div>
                ))}
              </div>
              {renderPagination()}
            </div>
          ) : null}
        </>
      )}

      {showFilterPanel ? <FilterPanel draftRows={draftRows} setDraftRows={setDraftRows} draftStatus={draftStatus} setDraftStatus={setDraftStatus} draftType={draftType} setDraftType={setDraftType} draftDateRange={draftDateRange} setDraftDateRange={setDraftDateRange} onClear={clearFilters} onCancel={() => setShowFilterPanel(false)} onApply={applyFilters} /> : null}

      {isDrawerOpen ? (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setIsDrawerOpen(false)} />
          <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[640px] flex-col border-l border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-950">
            <div className="flex items-start justify-between border-b border-neutral-100 p-5 dark:border-neutral-800">
              <div><h2 className="text-lg font-semibold">{drawerMode === "add" ? "Create Custom Role" : "Edit Role Settings"}</h2><p className="mt-1 text-sm text-neutral-500">{drawerMode === "add" ? "Establish a new access profile and define module access limits." : "Update credentials and access levels for this profile."}</p></div>
              <button type="button" onClick={() => setIsDrawerOpen(false)} className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              <div className="grid gap-4">
                <label className="grid gap-1.5"><span className="text-xs font-semibold uppercase text-neutral-500">Role Name *</span><input value={formName} onChange={(event) => setFormName(event.target.value)} disabled={selectedRole?.isSystem} placeholder="e.g. Finance Auditor" className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-primary disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950" /></label>
                <label className="grid gap-1.5"><span className="text-xs font-semibold uppercase text-neutral-500">Role Description</span><textarea value={formDescription} onChange={(event) => setFormDescription(event.target.value)} disabled={selectedRole?.isSystem} rows={3} placeholder="Summarize access targets and team roles..." className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950" /></label>
                <label className="grid gap-1.5"><span className="text-xs font-semibold uppercase text-neutral-500">Profile Status</span><select value={formStatus} onChange={(event) => setFormStatus(event.target.value as Role["status"])} disabled={selectedRole?.isSystem} className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-primary disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950"><option value="Active">Active</option><option value="Inactive">Inactive</option></select></label>
              </div>
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase text-neutral-500">Access Permissions Grid</h3>
                <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
                  <table className="w-full border-collapse">
                    <thead className="bg-neutral-50 dark:bg-neutral-900"><tr><th className="border-b border-neutral-200 p-3 text-left text-xs font-semibold dark:border-neutral-800">Module</th>{["C", "R", "U", "D", "All"].map((label) => <th key={label} className="w-14 border-b border-neutral-200 p-3 text-center text-xs font-semibold dark:border-neutral-800">{label}</th>)}</tr></thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      {modules.map((module) => (
                        <tr key={module.key} className="hover:bg-neutral-50 dark:hover:bg-neutral-900"><td className="p-3 text-xs font-semibold">{module.label}</td>{(["create", "read", "update", "delete"] as Array<keyof Permission>).map((permission) => <td key={permission} className="p-3 text-center"><input type="checkbox" checked={formPermissions[module.key][permission]} onChange={(event) => handlePermissionChange(module.key, permission, event.target.checked)} disabled={selectedRole?.isSystem} className="h-4 w-4 rounded border-neutral-300 accent-primary disabled:opacity-50" /></td>)}<td className="p-3 text-center"><button type="button" title="Toggle all for module" onClick={() => handleSelectAllPermissions(module.key)} disabled={selectedRole?.isSystem} className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-50 dark:hover:bg-neutral-900"><Check className="h-4 w-4" /></button></td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-neutral-100 p-5 dark:border-neutral-800">
              <button type="button" onClick={() => setIsDrawerOpen(false)} className="h-10 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">Cancel</button>
              <button type="button" onClick={handleSaveRole} disabled={selectedRole?.isSystem} className="h-10 rounded-lg border border-primary bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50">{drawerMode === "add" ? "Create Profile" : "Save Changes"}</button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
