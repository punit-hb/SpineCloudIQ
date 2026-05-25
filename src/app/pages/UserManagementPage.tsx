import { type ComponentType, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  Check,
  ChevronDown,
  Download,
  Edit,
  FileSpreadsheet,
  FileText,
  Filter,
  Grid3X3,
  List,
  Mail,
  MoreVertical,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Shield,
  SlidersHorizontal,
  Table2,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: "Active" | "Pending" | "Inactive";
  lastLogin: string;
  createdAt: string;
  inviteSent: boolean;
}

type ViewMode = "grid" | "list" | "table";
type FilterField = "Role" | "Status" | "Last Login";

interface FilterDraft {
  fields: FilterField[];
  role: string;
  status: string;
  dateRange: { start: string; end: string };
}

interface ColumnConfig {
  key: "user" | "email" | "role" | "status" | "lastLogin" | "createdAt";
  label: string;
}

const mockUsers: UserData[] = [
  { id: "user_001", firstName: "John", lastName: "Smith", email: "john.smith@spinecloudiq.com", role: "Super Admin", status: "Active", lastLogin: "2025-02-23", createdAt: "2024-01-15", inviteSent: true },
  { id: "user_002", firstName: "Sarah", lastName: "Johnson", email: "sarah.johnson@spinecloudiq.com", role: "Clinic Admin", status: "Active", lastLogin: "2025-02-23", createdAt: "2024-02-20", inviteSent: true },
  { id: "user_003", firstName: "Michael", lastName: "Brown", email: "michael.brown@spinecloudiq.com", role: "Finance Manager", status: "Active", lastLogin: "2025-02-22", createdAt: "2024-03-10", inviteSent: true },
  { id: "user_004", firstName: "Emily", lastName: "Davis", email: "emily.davis@spinecloudiq.com", role: "Support Staff", status: "Pending", lastLogin: "", createdAt: "2025-02-20", inviteSent: true },
  { id: "user_005", firstName: "David", lastName: "Wilson", email: "david.wilson@spinecloudiq.com", role: "Viewer", status: "Active", lastLogin: "2025-02-23", createdAt: "2024-04-15", inviteSent: true },
  { id: "user_006", firstName: "Jessica", lastName: "Martinez", email: "jessica.martinez@spinecloudiq.com", role: "Clinic Admin", status: "Active", lastLogin: "2025-02-23", createdAt: "2024-05-22", inviteSent: true },
  { id: "user_007", firstName: "Robert", lastName: "Taylor", email: "robert.taylor@spinecloudiq.com", role: "Support Staff", status: "Active", lastLogin: "2025-02-23", createdAt: "2024-06-18", inviteSent: true },
  { id: "user_008", firstName: "Amanda", lastName: "Anderson", email: "amanda.anderson@spinecloudiq.com", role: "Finance Manager", status: "Inactive", lastLogin: "2025-01-15", createdAt: "2024-07-05", inviteSent: true },
];

const availableRoles = ["Super Admin", "Clinic Admin", "Finance Manager", "Support Staff", "Viewer"];
const filterFields: FilterField[] = ["Role", "Status", "Last Login"];
const ITEMS_PER_PAGE = 10;

const tableColumns: ColumnConfig[] = [
  { key: "user", label: "User" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
  { key: "lastLogin", label: "Last Login" },
  { key: "createdAt", label: "Created" },
];

const formatDate = (value: string) =>
  value
    ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    : "—";

const fullName = (user: UserData) => `${user.firstName} ${user.lastName}`;
const initials = (user: UserData) => `${user.firstName[0] || ""}${user.lastName[0] || ""}`;

function HeaderIconButton({
  icon: Icon,
  title,
  onClick,
  active = false,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-lg border bg-white text-neutral-600 transition-colors hover:border-primary/50 hover:bg-neutral-50 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 ${
        active ? "border-primary/50 text-primary" : "border-neutral-200 dark:border-neutral-800"
      }`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

function ViewModeSwitcher({ viewMode, onChange }: { viewMode: ViewMode; onChange: (mode: ViewMode) => void }) {
  const items: { id: ViewMode; icon: ComponentType<{ className?: string }>; title: string }[] = [
    { id: "grid", icon: Grid3X3, title: "Grid View" },
    { id: "list", icon: List, title: "List View" },
    { id: "table", icon: Table2, title: "Table View" },
  ];

  return (
    <div className="flex h-10 overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      {items.map(({ id, icon: Icon, title }) => (
        <button
          key={id}
          type="button"
          title={title}
          onClick={() => onChange(id)}
          className={`flex h-10 w-10 items-center justify-center transition-colors ${
            viewMode === id
              ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
              : "text-neutral-500 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900"
          }`}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: UserData["status"] }) {
  const dotClass = {
    Active: "bg-emerald-500",
    Pending: "bg-amber-500",
    Inactive: "bg-neutral-400",
  }[status];

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
      {status}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary">
      <Shield className="h-3 w-3" />
      {role}
    </span>
  );
}

function AvatarMark({ user }: { user: UserData }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
      {initials(user)}
    </div>
  );
}

function FilterPanel({
  isOpen,
  onClose,
  filterRole,
  filterStatus,
  dateRange,
  onApply,
  onClear,
}: {
  isOpen: boolean;
  onClose: () => void;
  filterRole: string;
  filterStatus: string;
  dateRange: { start: string; end: string };
  onApply: (draft: FilterDraft) => void;
  onClear: () => void;
}) {
  const [draft, setDraft] = useState<FilterDraft>({
    fields: ["Role", "Status", "Last Login"],
    role: filterRole,
    status: filterStatus,
    dateRange,
  });
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setDraft({ fields: ["Role", "Status", "Last Login"], role: filterRole, status: filterStatus, dateRange });
  }, [dateRange, filterRole, filterStatus, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const addFilter = () => {
    const next = filterFields.find((field) => !draft.fields.includes(field));
    if (next) setDraft((prev) => ({ ...prev, fields: [...prev.fields, next] }));
  };

  const removeFilter = (field: FilterField) => {
    setDraft((prev) => ({
      ...prev,
      fields: prev.fields.filter((item) => item !== field),
      role: field === "Role" ? "" : prev.role,
      status: field === "Status" ? "" : prev.status,
      dateRange: field === "Last Login" ? { start: "", end: "" } : prev.dateRange,
    }));
  };

  const renderWhat = (field: FilterField) => {
    if (field === "Role") {
      return (
        <select
          value={draft.role}
          onChange={(event) => setDraft((prev) => ({ ...prev, role: event.target.value }))}
          className="h-8 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
        >
          <option value="">All Roles</option>
          {availableRoles.map((role) => <option key={role} value={role}>{role}</option>)}
        </select>
      );
    }

    if (field === "Status") {
      return (
        <select
          value={draft.status}
          onChange={(event) => setDraft((prev) => ({ ...prev, status: event.target.value }))}
          className="h-8 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Inactive">Inactive</option>
        </select>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-2">
        <input
          type="date"
          value={draft.dateRange.start}
          onChange={(event) => setDraft((prev) => ({ ...prev, dateRange: { ...prev.dateRange, start: event.target.value } }))}
          className="h-8 min-w-0 rounded-lg border border-neutral-200 bg-white px-2 text-xs text-neutral-900 outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
        />
        <input
          type="date"
          value={draft.dateRange.end}
          onChange={(event) => setDraft((prev) => ({ ...prev, dateRange: { ...prev.dateRange, end: event.target.value } }))}
          className="h-8 min-w-0 rounded-lg border border-neutral-200 bg-white px-2 text-xs text-neutral-900 outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
        />
      </div>
    );
  };

  return (
    <div ref={panelRef} className="absolute right-0 top-full z-50 mt-2 w-[480px] rounded-lg border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Filter By</h3>
        <button type="button" onClick={onClose} className="flex h-6 w-6 items-center justify-center rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white" aria-label="Close filters">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="max-h-[500px] overflow-y-auto p-4">
        <div className="space-y-2">
          {draft.fields.map((field, index) => (
            <div key={field} className="flex items-start gap-2">
              <div className="w-[40%]">
                {index === 0 && <label className="mb-1 block text-xs text-neutral-500 dark:text-neutral-400">Where</label>}
                <div className={`flex h-8 items-center rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white ${index === 0 ? "" : "mt-[17px]"}`}>
                  {field}
                </div>
              </div>
              <div className="flex-1">
                {index === 0 && <label className="mb-1 block text-xs text-neutral-500 dark:text-neutral-400">What</label>}
                <div className={index === 0 ? "" : "mt-[17px]"}>{renderWhat(field)}</div>
              </div>
              <button type="button" title="Remove filter" onClick={() => removeFilter(field)} className="mt-[17px] flex h-6 w-6 shrink-0 items-center justify-center rounded text-neutral-400 hover:text-red-600">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addFilter} disabled={draft.fields.length === filterFields.length} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-sm text-primary hover:bg-primary/5 disabled:cursor-not-allowed disabled:text-neutral-400">
          <Filter className="h-4 w-4" />
          Add Filter
        </button>
      </div>
      <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/50">
        <button type="button" onClick={() => { onClear(); onClose(); }} className="h-8 rounded-lg px-3 text-xs text-neutral-600 hover:bg-white hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white">
          Clear All
        </button>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onClose} className="h-8 rounded-lg px-3 text-xs text-neutral-600 hover:bg-white hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white">
            Cancel
          </button>
          <button type="button" onClick={() => { onApply(draft); onClose(); }} className="h-8 rounded-lg bg-primary px-4 text-xs font-medium text-white hover:bg-primary/90">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function ColumnPanel({
  isOpen,
  onClose,
  columns,
  visibleColumns,
  onToggleColumn,
}: {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnConfig[];
  visibleColumns: Record<string, boolean>;
  onToggleColumn: (key: string) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={panelRef} className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 dark:border-neutral-900">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Columns</h3>
        </div>
        <button type="button" onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="max-h-[400px] overflow-y-auto p-2">
        {columns.map((column) => (
          <label key={column.key} className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${visibleColumns[column.key] ? "bg-primary/5 text-primary" : "text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900"}`}>
            <span className="relative flex items-center justify-center">
              <input type="checkbox" checked={visibleColumns[column.key]} onChange={() => onToggleColumn(column.key)} className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-neutral-300 transition-colors checked:border-primary checked:bg-primary dark:border-neutral-700" />
              <Check className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
            </span>
            <span className="text-sm font-medium">{column.label}</span>
            {visibleColumns[column.key] && <span className="ml-auto h-1 w-1 rounded-full bg-primary" />}
          </label>
        ))}
      </div>
      <div className="border-t border-neutral-100 bg-neutral-50 px-4 py-2 dark:border-neutral-900 dark:bg-neutral-900/50">
        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
          {Object.values(visibleColumns).filter(Boolean).length} of {columns.length} active
        </span>
      </div>
    </div>
  );
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"add" | "edit">("add");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showSummary, setShowSummary] = useState(true);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    Object.fromEntries(tableColumns.map((column) => [column.key, true]))
  );
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState("");
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewMode !== "table") setShowColumns(false);
  }, [viewMode]);

  useEffect(() => {
    if (!showMoreMenu) return;
    const handleClick = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) setShowMoreMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showMoreMenu]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query);
      const matchesRole = !filterRole || user.role === filterRole;
      const matchesStatus = !filterStatus || user.status === filterStatus;
      let matchesDate = true;
      if (user.lastLogin) {
        if (dateRange.start) matchesDate = matchesDate && new Date(user.lastLogin) >= new Date(dateRange.start);
        if (dateRange.end) matchesDate = matchesDate && new Date(user.lastLogin) <= new Date(dateRange.end);
      } else if (dateRange.start || dateRange.end) {
        matchesDate = false;
      }
      return matchesSearch && matchesRole && matchesStatus && matchesDate;
    });
  }, [dateRange.end, dateRange.start, filterRole, filterStatus, searchQuery, users]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
  const currentData = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const activeFilterCount = (filterRole ? 1 : 0) + (filterStatus ? 1 : 0) + (dateRange.start || dateRange.end ? 1 : 0);
  const totalCount = users.length;
  const activeCount = users.filter((user) => user.status === "Active").length;
  const pendingCount = users.filter((user) => user.status === "Pending").length;
  const inactiveCount = users.filter((user) => user.status === "Inactive").length;

  const clearFilters = () => {
    setFilterRole("");
    setFilterStatus("");
    setDateRange({ start: "", end: "" });
    setCurrentPage(1);
  };

  const applyFilters = (draft: FilterDraft) => {
    setFilterRole(draft.fields.includes("Role") ? draft.role : "");
    setFilterStatus(draft.fields.includes("Status") ? draft.status : "");
    setDateRange(draft.fields.includes("Last Login") ? draft.dateRange : { start: "", end: "" });
    setCurrentPage(1);
  };

  const handleExportExcel = () => {
    console.log(`Exporting users to Excel. Total rows: ${filteredUsers.length}. Selected: ${selectedRowIds.length || "all"}`);
    alert(`Success: Exported ${filteredUsers.length} rows to Excel file format.`);
  };

  const handleExportPdf = () => {
    console.log(`Exporting users to PDF. Total rows: ${filteredUsers.length}. Selected: ${selectedRowIds.length || "all"}`);
    alert(`Success: Exported ${filteredUsers.length} rows to PDF file format.`);
  };

  const handleAddUser = () => {
    setDrawerMode("add");
    setSelectedUser(null);
    setFormFirstName("");
    setFormLastName("");
    setFormEmail("");
    setFormRole("");
    setIsDrawerOpen(true);
  };

  const handleEditUser = (user: UserData) => {
    setDrawerMode("edit");
    setSelectedUser(user);
    setFormFirstName(user.firstName);
    setFormLastName(user.lastName);
    setFormEmail(user.email);
    setFormRole(user.role);
    setIsDrawerOpen(true);
    setActiveMenuRowId(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setSelectedRowIds((prev) => prev.filter((id) => id !== userId));
      setActiveMenuRowId(null);
    }
  };

  const handleSaveUser = () => {
    if (!formFirstName.trim() || !formLastName.trim() || !formEmail.trim() || !formRole) {
      alert("Please fill in all required fields");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail)) {
      alert("Please enter a valid email address");
      return;
    }
    if (drawerMode === "add") {
      const newUser: UserData = {
        id: `user_${Date.now()}`,
        firstName: formFirstName,
        lastName: formLastName,
        email: formEmail,
        role: formRole,
        status: "Pending",
        lastLogin: "",
        createdAt: new Date().toISOString().split("T")[0],
        inviteSent: true,
      };
      setUsers((prev) => [...prev, newUser]);
      alert(`User added successfully! An invite email has been sent to ${formEmail}`);
    } else if (selectedUser) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id
            ? { ...user, firstName: formFirstName, lastName: formLastName, email: formEmail, role: formRole }
            : user
        )
      );
    }
    setIsDrawerOpen(false);
  };

  const handleResendInvite = (user: UserData) => {
    alert(`Invite email resent to ${user.email}`);
    setActiveMenuRowId(null);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedRowIds(checked ? currentData.map((user) => user.id) : []);
  };

  const handleSelectRow = (userId: string, checked: boolean) => {
    setSelectedRowIds((prev) => (checked ? [...prev, userId] : prev.filter((id) => id !== userId)));
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete the ${selectedRowIds.length} selected users?`)) {
      setUsers((prev) => prev.filter((user) => !selectedRowIds.includes(user.id)));
      setSelectedRowIds([]);
    }
  };

  const handleBulkInvite = () => {
    const pendingSelected = currentData.filter((user) => selectedRowIds.includes(user.id) && user.status === "Pending");
    if (pendingSelected.length === 0) {
      alert("No pending users selected to resend invite.");
      return;
    }
    alert(`Resent invitations to ${pendingSelected.length} users successfully!`);
    setSelectedRowIds([]);
  };

  const toggleColumn = (key: string) => setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  const visibleColumnCount = tableColumns.filter((column) => visibleColumns[column.key]).length;

  const renderActions = (user: UserData) => (
    <div className="relative inline-block text-left" onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        onClick={() => setActiveMenuRowId(activeMenuRowId === user.id ? null : user.id)}
        className="flex h-7 w-7 items-center justify-center rounded text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
        title="Actions"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {activeMenuRowId === user.id && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setActiveMenuRowId(null)} />
          <div className="absolute right-0 top-full z-40 mt-1 w-48 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
            <button type="button" onClick={() => handleEditUser(user)} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900">
              <Edit className="h-4 w-4" />
              Edit Account
            </button>
            {user.status === "Pending" && (
              <button type="button" onClick={() => handleResendInvite(user)} className="flex w-full items-center gap-2 border-t border-neutral-200 px-4 py-2.5 text-left text-sm text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900">
                <Mail className="h-4 w-4" />
                Resend Invite
              </button>
            )}
            <button type="button" onClick={() => handleDeleteUser(user.id)} className="flex w-full items-center gap-2 border-t border-neutral-200 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:border-neutral-800 dark:text-red-400 dark:hover:bg-red-950/20">
              <Trash2 className="h-4 w-4" />
              Delete Account
            </button>
          </div>
        </>
      )}
    </div>
  );

  const emptyState = (
    <div className="rounded-lg border border-neutral-200 bg-white p-20 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
        <AlertCircle className="h-6 w-6 text-neutral-400" />
      </div>
      <h3 className="text-sm font-medium text-neutral-900 dark:text-white">No users found</h3>
      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Try adjusting your search query or filters.</p>
    </div>
  );

  const renderPagination = () => {
    if (filteredUsers.length === 0) return null;
    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const end = Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length);
    return (
      <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-4 text-sm dark:border-neutral-800">
        <div className="text-neutral-600 dark:text-neutral-400">Showing {start}-{end} of {filteredUsers.length}</div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage <= 1} className="h-8 rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900">
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button key={page} type="button" onClick={() => setCurrentPage(page)} className={`h-8 w-8 rounded-lg border text-sm ${page === currentPage ? "border-primary bg-primary text-white" : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900"}`}>
              {page}
            </button>
          ))}
          <button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage >= totalPages} className="h-8 rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900">
            Next
          </button>
        </div>
      </div>
    );
  };

  const userMeta = (user: UserData) => (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-600 dark:text-neutral-400">
      <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-neutral-400" />{user.email}</span>
      <span>{user.role}</span>
      <span>Created {formatDate(user.createdAt)}</span>
    </div>
  );

  return (
    <div className="bg-transparent text-[14px] dark:bg-neutral-950">
      <div className="max-w-full">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="mb-1 text-[32px] font-semibold leading-[40px] text-neutral-900 dark:text-white">User Management</h1>
            <nav className="mb-2 flex items-center gap-1 text-sm">
              <span className="text-neutral-500 dark:text-neutral-400">Administration</span>
              <ChevronDown className="h-3.5 w-3.5 -rotate-90 text-neutral-400" />
              <span className="font-medium text-neutral-900 dark:text-white">User Management</span>
            </nav>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Manage platform administrators, support representatives, and read-only viewers.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
            <div className="relative">
              {!searchExpanded ? (
                <HeaderIconButton icon={Search} title="Search" onClick={() => setSearchExpanded(true)} active={searchQuery !== ""} />
              ) : (
                <div className="flex h-10 min-w-[320px] items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                  <Search className="h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search users by name, email, or role..."
                    value={searchQuery}
                    onChange={(event) => { setSearchQuery(event.target.value); setCurrentPage(1); }}
                    className="min-w-0 flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white"
                  />
                  <button type="button" onClick={() => setShowFilters(true)} className="relative rounded p-1 text-neutral-600 hover:text-primary dark:text-neutral-400" title="Filter By">
                    <Filter className="h-4 w-4" />
                    {activeFilterCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">{activeFilterCount}</span>}
                  </button>
                  <button type="button" onClick={() => setSearchExpanded(false)} className="rounded p-1 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white" title="Close search">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <FilterPanel isOpen={showFilters} onClose={() => setShowFilters(false)} filterRole={filterRole} filterStatus={filterStatus} dateRange={dateRange} onApply={applyFilters} onClear={clearFilters} />
            </div>

            {viewMode === "table" && (
              <div className="relative">
                <HeaderIconButton icon={SlidersHorizontal} title="Customize Columns" onClick={() => setShowColumns((prev) => !prev)} active={showColumns} />
                <ColumnPanel isOpen={showColumns} onClose={() => setShowColumns(false)} columns={tableColumns} visibleColumns={visibleColumns} onToggleColumn={toggleColumn} />
              </div>
            )}

            <button type="button" onClick={handleAddUser} className="inline-flex h-10 items-center gap-2 rounded-lg border border-primary bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Add New User
            </button>
            <HeaderIconButton icon={BarChart3} title="Summary" onClick={() => setShowSummary((prev) => !prev)} active={showSummary} />
            <HeaderIconButton icon={RefreshCw} title="Refresh" onClick={() => setCurrentPage(1)} />

            <div className="relative" ref={moreRef}>
              <HeaderIconButton icon={MoreVertical} title="More options" onClick={() => setShowMoreMenu((prev) => !prev)} active={showMoreMenu} />
              {showMoreMenu && (
                <div className="absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
                  <button type="button" onClick={() => { alert("Import users is not available for this mock listing."); setShowMoreMenu(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900">
                    <Download className="h-3.5 w-3.5 rotate-180" />Import
                  </button>
                  <button type="button" onClick={() => { handleExportExcel(); setShowMoreMenu(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900">
                    <FileSpreadsheet className="h-3.5 w-3.5" />Export Excel
                  </button>
                  <button type="button" onClick={() => { handleExportPdf(); setShowMoreMenu(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900">
                    <FileText className="h-3.5 w-3.5" />Export PDF
                  </button>
                  <button type="button" onClick={() => { window.print(); setShowMoreMenu(false); }} className="flex w-full items-center gap-2 border-t border-neutral-200 px-3 py-2 text-left text-xs text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900">
                    <Printer className="h-3.5 w-3.5" />Print
                  </button>
                </div>
              )}
            </div>

            <ViewModeSwitcher viewMode={viewMode} onChange={setViewMode} />
          </div>
        </div>

        {showSummary && (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total Users", value: totalCount, helper: "Active growth" },
              { label: "Active Users", value: activeCount, helper: `${Math.round((activeCount / (totalCount || 1)) * 100)}% of total` },
              { label: "Pending Invites", value: pendingCount, helper: "Awaiting signup" },
              { label: "Inactive Users", value: inactiveCount, helper: "Access disabled" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                <p className="mb-1 text-xs text-neutral-500 dark:text-neutral-400">{item.label}</p>
                <div className="flex items-end justify-between gap-3">
                  <p className="text-2xl font-semibold text-neutral-900 dark:text-white">{item.value}</p>
                  <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">{item.helper}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === "grid" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {currentData.length > 0 ? currentData.map((user) => {
              const selected = selectedRowIds.includes(user.id);
              return (
                <div key={user.id} className={`rounded-lg border bg-white p-5 shadow-sm transition-colors dark:bg-neutral-950 ${selected ? "border-primary/50 bg-primary/5" : "border-neutral-200 dark:border-neutral-800"}`}>
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <AvatarMark user={user} />
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={selected} onChange={(event) => handleSelectRow(user.id, event.target.checked)} className="h-4 w-4 cursor-pointer rounded border-neutral-300 accent-primary" title="Select" />
                      {renderActions(user)}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-neutral-900 dark:text-white">{fullName(user)}</h3>
                    <p className="mt-1 truncate text-xs text-neutral-500 dark:text-neutral-400">{user.email}</p>
                  </div>
                  <div className="mt-4 space-y-2.5">
                    <div className="flex items-center justify-between gap-2"><span className="text-xs text-neutral-500">Role</span><RoleBadge role={user.role} /></div>
                    <div className="flex items-center justify-between gap-2"><span className="text-xs text-neutral-500">Status</span><StatusBadge status={user.status} /></div>
                    <div className="flex items-center justify-between gap-2"><span className="text-xs text-neutral-500">Last Login</span><span className="text-xs text-neutral-700 dark:text-neutral-300">{formatDate(user.lastLogin)}</span></div>
                  </div>
                </div>
              );
            }) : <div className="md:col-span-2 xl:col-span-4">{emptyState}</div>}
          </div>
        )}

        {viewMode === "list" && (
          <div className="space-y-3">
            {currentData.length > 0 ? currentData.map((user) => {
              const selected = selectedRowIds.includes(user.id);
              return (
                <div key={user.id} className={`rounded-lg border bg-white p-4 shadow-sm transition-colors hover:bg-neutral-50 dark:bg-neutral-950 dark:hover:bg-neutral-900/50 ${selected ? "border-primary/50" : "border-neutral-200 dark:border-neutral-800"}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <input type="checkbox" checked={selected} onChange={(event) => handleSelectRow(user.id, event.target.checked)} className="h-4 w-4 cursor-pointer rounded border-neutral-300 accent-primary" title="Select" />
                      <AvatarMark user={user} />
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span className="font-medium text-neutral-900 dark:text-white">{fullName(user)}</span>
                          <StatusBadge status={user.status} />
                          <span className="text-xs font-mono text-neutral-500">{user.id}</span>
                        </div>
                        {userMeta(user)}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">Last login {formatDate(user.lastLogin)}</span>
                      {renderActions(user)}
                    </div>
                  </div>
                </div>
              );
            }) : emptyState}
          </div>
        )}

        {viewMode === "table" && (
          <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
            <div className="max-h-[calc(100vh-320px)] overflow-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
                    <th className="sticky top-0 z-10 w-12 border-b border-neutral-200 bg-neutral-50 px-4 py-3.5 dark:border-neutral-800 dark:bg-neutral-900">
                      <Checkbox checked={currentData.length > 0 && currentData.every((user) => selectedRowIds.includes(user.id))} onCheckedChange={(checked) => handleSelectAll(Boolean(checked))} aria-label="Select all users" />
                    </th>
                    {tableColumns.map((column) => visibleColumns[column.key] ? (
                      <th key={column.key} className="sticky top-0 z-10 border-b border-neutral-200 bg-neutral-50 px-6 py-3.5 text-xs font-semibold tracking-normal text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
                        {column.label}
                      </th>
                    ) : null)}
                    <th className="sticky top-0 z-10 border-b border-neutral-200 bg-neutral-50 px-6 py-3.5 text-right text-xs font-semibold tracking-normal text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {currentData.length > 0 ? currentData.map((user) => {
                    const selected = selectedRowIds.includes(user.id);
                    return (
                      <tr key={user.id} className={`transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/50 ${selected ? "bg-primary/5" : ""}`}>
                        <td className="w-12 px-4 py-3.5">
                          <Checkbox checked={selected} onCheckedChange={(checked) => handleSelectRow(user.id, Boolean(checked))} aria-label={`Select user ${fullName(user)}`} />
                        </td>
                        {visibleColumns.user && (
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <AvatarMark user={user} />
                              <div>
                                <p className="text-sm font-medium text-neutral-900 dark:text-white">{fullName(user)}</p>
                                <p className="text-xs font-mono text-neutral-500">{user.id}</p>
                              </div>
                            </div>
                          </td>
                        )}
                        {visibleColumns.email && <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{user.email}</td>}
                        {visibleColumns.role && <td className="px-6 py-4"><RoleBadge role={user.role} /></td>}
                        {visibleColumns.status && <td className="px-6 py-4"><StatusBadge status={user.status} /></td>}
                        {visibleColumns.lastLogin && <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{formatDate(user.lastLogin)}</td>}
                        {visibleColumns.createdAt && <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{formatDate(user.createdAt)}</td>}
                        <td className="px-6 py-4 text-right">{renderActions(user)}</td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={visibleColumnCount + 2} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800"><Search className="h-6 w-6 text-neutral-400" /></div>
                          <h3 className="text-sm font-medium text-neutral-900 dark:text-white">No users found</h3>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">Try adjusting your search or filters.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {renderPagination()}
      </div>

      {selectedRowIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-white shadow-xl dark:bg-neutral-950">
          <span className="rounded border border-primary/25 bg-primary/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary">{selectedRowIds.length} Selected</span>
          <div className="h-4 w-px bg-neutral-800" />
          <Button onClick={handleBulkInvite} className="h-8 rounded-md border border-neutral-700 bg-neutral-800 px-3 text-xs text-white hover:bg-neutral-700"><Mail className="mr-1.5 h-3.5 w-3.5 text-primary" />Resend Invites</Button>
          <Button onClick={handleBulkDelete} className="h-8 rounded-md border border-red-500/20 bg-red-500/10 px-3 text-xs text-red-400 hover:bg-red-500/20 hover:text-red-300"><Trash2 className="mr-1.5 h-3.5 w-3.5" />Delete Selected</Button>
          <Button variant="ghost" onClick={() => setSelectedRowIds([])} className="h-8 px-2 text-xs text-neutral-400 hover:text-white">Clear</Button>
        </div>
      )}

      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setIsDrawerOpen(false)} />
          <div className="fixed right-0 top-0 z-50 flex h-full w-[500px] max-w-[calc(100vw-24px)] flex-col border-l border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950">
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5 dark:border-neutral-800">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">{drawerMode === "add" ? "Add New User" : "Edit User"}</h2>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{drawerMode === "add" ? "Invite a new platform admin or support rep" : "Modify details for this administrative user"}</p>
              </div>
              <button type="button" onClick={() => setIsDrawerOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800" aria-label="Close drawer"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">First Name *</Label>
                  <Input id="firstName" value={formFirstName} onChange={(event) => setFormFirstName(event.target.value)} placeholder="Enter first name" className="h-10 rounded-lg border-neutral-300 bg-white shadow-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-950" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Last Name *</Label>
                  <Input id="lastName" value={formLastName} onChange={(event) => setFormLastName(event.target.value)} placeholder="Enter last name" className="h-10 rounded-lg border-neutral-300 bg-white shadow-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-950" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Email Address *</Label>
                <Input id="email" type="email" value={formEmail} onChange={(event) => setFormEmail(event.target.value)} placeholder="name@spinecloudiq.com" className="h-10 rounded-lg border-neutral-300 bg-white shadow-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-950" />
                {drawerMode === "add" && <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">A secure authentication token will be emailed automatically.</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Access Role *</Label>
                <Select value={formRole} onValueChange={setFormRole}>
                  <SelectTrigger className="h-10 rounded-lg border border-neutral-300 bg-white shadow-none dark:border-neutral-700 dark:bg-neutral-950"><SelectValue placeholder="Select access level" /></SelectTrigger>
                  <SelectContent className="border border-neutral-200 shadow-md dark:border-neutral-800">
                    {availableRoles.map((role) => <SelectItem key={role} value={role} className="cursor-pointer px-3.5 py-2.5 text-sm font-medium text-neutral-800 hover:bg-primary/5 focus:bg-primary/5 dark:text-neutral-200">{role}</SelectItem>)}
                  </SelectContent>
                </Select>
                <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">Defines default viewing and mutation permissions across clinic nodes.</p>
              </div>
              {drawerMode === "add" && (
                <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h4 className="mb-1 text-sm font-semibold text-neutral-900 dark:text-white">Email Invitation</h4>
                    <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">Upon submission, an invitation email will be automatically sent to the user with setup instructions.</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-neutral-200 bg-neutral-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900/50">
              <Button variant="outline" onClick={() => setIsDrawerOpen(false)} className="h-10 rounded-lg">Cancel</Button>
              <Button onClick={handleSaveUser} className="h-10 rounded-lg bg-primary text-white shadow-none hover:bg-primary/90">{drawerMode === "add" ? "Send Invite" : "Save Changes"}</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
