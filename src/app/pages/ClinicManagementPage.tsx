import { type ComponentType, type FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowUpDown,
  BarChart3,
  Building2,
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
  ShieldAlert,
  Table2,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  FormField,
  FormFooter,
  FormInput,
  FormLabel,
  FormModal,
  FormSection,
  FormSelect,
  StatusSlider,
} from "../components/hb/common";
import { PrimaryButton, SecondaryButton } from "../components/hb/listing";

interface Clinic {
  id: string;
  name: string;
  status: "active" | "suspended" | "inactive";
  planType: string;
  createdDate: string;
  email: string;
  adminName: string;
}

type ViewMode = "grid" | "list" | "table";
type ColumnKey = keyof Clinic;

interface ColumnDefinition {
  key: ColumnKey;
  label: string;
}

const mockClinics: Clinic[] = [
  {
    id: "CLN001",
    name: "HealthSpine Clinic",
    status: "active",
    planType: "Enterprise",
    createdDate: "2024-01-15",
    email: "admin@healthspine.com",
    adminName: "Dr. Sarah Johnson",
  },
  {
    id: "CLN002",
    name: "SpineCare Medical Center",
    status: "active",
    planType: "Professional",
    createdDate: "2024-02-20",
    email: "contact@spinecare.com",
    adminName: "Dr. Michael Chen",
  },
  {
    id: "CLN003",
    name: "Orthopedic Associates",
    status: "suspended",
    planType: "Basic",
    createdDate: "2023-11-10",
    email: "info@orthoassoc.com",
    adminName: "Dr. Emily Roberts",
  },
  {
    id: "CLN004",
    name: "Advanced Spine Institute",
    status: "active",
    planType: "Professional",
    createdDate: "2023-08-05",
    email: "admin@advancedspine.com",
    adminName: "Dr. James Wilson",
  },
];

const columns: ColumnDefinition[] = [
  { key: "id", label: "Clinic ID" },
  { key: "name", label: "Clinic Name" },
  { key: "email", label: "Email Address" },
  { key: "status", label: "Status" },
  { key: "planType", label: "Plan Type" },
  { key: "createdDate", label: "Created Date" },
  { key: "adminName", label: "Admin Name" },
];

const statusOptions: Array<{ value: Clinic["status"]; label: string }> = [
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
  { value: "inactive", label: "Inactive" },
];

const planOptions = ["Basic", "Professional", "Enterprise"];
const ITEMS_PER_PAGE = 10;

function HeaderIconButton({
  label,
  icon: Icon,
  active = false,
  disabled = false,
  badge,
  onClick,
}: {
  label: string;
  icon: ComponentType<{ className?: string }>;
  active?: boolean;
  disabled?: boolean;
  badge?: number;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-lg border text-sm transition-colors ${
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-900"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <Icon className="h-4 w-4" />
      {badge ? (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-white">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function ViewModeSwitcher({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}) {
  const options: Array<{ value: ViewMode; label: string; icon: ComponentType<{ className?: string }> }> = [
    { value: "grid", label: "Grid View", icon: Grid3X3 },
    { value: "list", label: "List View", icon: List },
    { value: "table", label: "Table View", icon: Table2 },
  ];

  return (
    <div className="inline-flex h-10 items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-800 dark:bg-neutral-900">
      {options.map(({ value: optionValue, label, icon: Icon }) => (
        <button
          key={optionValue}
          type="button"
          title={label}
          aria-label={label}
          onClick={() => onChange(optionValue)}
          className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
            value === optionValue
              ? "border border-neutral-200 bg-white text-primary shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
              : "text-neutral-500 hover:bg-white/70 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-950"
          }`}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: Clinic["status"] }) {
  const config = {
    active: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300",
    suspended: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300",
    inactive: "border-neutral-200 bg-neutral-100 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300",
  }[status];
  const dot = {
    active: "bg-emerald-500",
    suspended: "bg-red-500",
    inactive: "bg-neutral-400",
  }[status];

  return (
    <span className={`inline-flex h-6 items-center gap-1.5 rounded-full border px-2 text-xs font-medium capitalize ${config}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  return (
    <span className="inline-flex h-6 items-center rounded-full border border-neutral-200 bg-neutral-50 px-2 text-xs font-medium text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
      {plan}
    </span>
  );
}

function ClinicMark({ name }: { name: string }) {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-xs font-semibold text-primary">
      {name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
        <Building2 className="h-5 w-5" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-neutral-900 dark:text-white">No clinics found</h3>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Adjust search or filters to find matching clinic records.</p>
    </div>
  );
}

function ColumnPanel({
  visibleColumns,
  onToggle,
  onClose,
}: {
  visibleColumns: Record<ColumnKey, boolean>;
  onToggle: (key: ColumnKey) => void;
  onClose: () => void;
}) {
  const activeCount = Object.values(visibleColumns).filter(Boolean).length;

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute right-0 top-12 z-40 w-64 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
        <div className="flex h-11 items-center justify-between border-b border-neutral-100 px-4 dark:border-neutral-800">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Columns</h3>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-900 dark:hover:text-neutral-200">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-2">
          {columns.map((column) => (
            <button
              key={column.key}
              type="button"
              onClick={() => onToggle(column.key)}
              className="flex h-9 w-full items-center gap-3 rounded-md px-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900"
            >
              <span className={`flex h-4 w-4 items-center justify-center rounded border ${visibleColumns[column.key] ? "border-primary bg-primary text-white" : "border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-950"}`}>
                {visibleColumns[column.key] ? <Check className="h-3 w-3" /> : null}
              </span>
              {column.label}
            </button>
          ))}
        </div>
        <div className="border-t border-neutral-100 px-4 py-3 text-xs font-medium text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
          {activeCount} of {columns.length} active
        </div>
      </div>
    </>
  );
}

function FilterPanel({
  draftRows,
  setDraftRows,
  draftStatus,
  setDraftStatus,
  draftPlan,
  setDraftPlan,
  draftDateRange,
  setDraftDateRange,
  onApply,
  onClear,
  onCancel,
}: {
  draftRows: string[];
  setDraftRows: (rows: string[]) => void;
  draftStatus: string;
  setDraftStatus: (value: string) => void;
  draftPlan: string;
  setDraftPlan: (value: string) => void;
  draftDateRange: { start: string; end: string };
  setDraftDateRange: (value: { start: string; end: string }) => void;
  onApply: () => void;
  onClear: () => void;
  onCancel: () => void;
}) {
  const labels: Record<string, string> = { status: "Status", plan: "Plan Type", date: "Created Date" };
  const remainingRows = ["status", "plan", "date"].filter((row) => !draftRows.includes(row));

  const renderWhat = (row: string) => {
    if (row === "status") {
      return (
        <select value={draftStatus} onChange={(event) => setDraftStatus(event.target.value)} className="h-10 flex-1 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-950 dark:text-white">
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }
    if (row === "plan") {
      return (
        <select value={draftPlan} onChange={(event) => setDraftPlan(event.target.value)} className="h-10 flex-1 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-950 dark:text-white">
          {planOptions.map((option) => (
            <option key={option} value={option.toLowerCase()}>
              {option}
            </option>
          ))}
        </select>
      );
    }
    return (
      <div className="grid flex-1 grid-cols-2 gap-2">
        <input type="date" value={draftDateRange.start} onChange={(event) => setDraftDateRange({ ...draftDateRange, start: event.target.value })} className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-950 dark:text-white" />
        <input type="date" value={draftDateRange.end} onChange={(event) => setDraftDateRange({ ...draftDateRange, end: event.target.value })} className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-950 dark:text-white" />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center bg-black/30 px-4 pt-28">
      <div className="w-full max-w-xl overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-950">
        <div className="flex h-12 items-center justify-between border-b border-neutral-100 px-4 dark:border-neutral-800">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Filter By</h2>
          <button type="button" onClick={onCancel} className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-900 dark:hover:text-neutral-200">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3 p-4">
          <div className="grid grid-cols-[150px_1fr_32px] gap-2 px-1 text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">
            <span>Where</span>
            <span>What</span>
            <span />
          </div>
          {draftRows.length === 0 ? (
            <div className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50 px-3 py-6 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
              No filters selected.
            </div>
          ) : (
            draftRows.map((row) => (
              <div key={row} className="grid grid-cols-[150px_1fr_32px] items-center gap-2">
                <div className="flex h-10 items-center rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm font-medium text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
                  {labels[row]}
                </div>
                {renderWhat(row)}
                <button type="button" onClick={() => setDraftRows(draftRows.filter((item) => item !== row))} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-900 dark:hover:text-neutral-200">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
          <div>
            <button
              type="button"
              disabled={remainingRows.length === 0}
              onClick={() => setDraftRows([...draftRows, remainingRows[0]])}
              className="inline-flex h-9 items-center gap-2 rounded-lg px-2 text-sm font-medium text-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
              Add Filter
            </button>
          </div>
        </div>
        <div className="flex h-14 items-center justify-end gap-2 border-t border-neutral-100 px-4 dark:border-neutral-800">
          <button type="button" onClick={onClear} className="h-9 rounded-lg px-3 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900">
            Clear All
          </button>
          <button type="button" onClick={onCancel} className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-900">
            Cancel
          </button>
          <button type="button" onClick={onApply} className="h-9 rounded-lg border border-primary bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ClinicManagementPage() {
  const navigate = useNavigate();
  const [clinics, setClinics] = useState<Clinic[]>(mockClinics);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showSummary, setShowSummary] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showColumnPanel, setShowColumnPanel] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [draftRows, setDraftRows] = useState<string[]>([]);
  const [draftStatus, setDraftStatus] = useState("active");
  const [draftPlan, setDraftPlan] = useState("professional");
  const [draftDateRange, setDraftDateRange] = useState({ start: "", end: "" });
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>({
    id: true,
    name: true,
    email: true,
    status: true,
    planType: true,
    createdDate: true,
    adminName: true,
  });
  const [sortField, setSortField] = useState<ColumnKey | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [clinicToDelete, setClinicToDelete] = useState<Clinic | null>(null);
  const [formName, setFormName] = useState("");
  const [formId, setFormId] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formAdminName, setFormAdminName] = useState("");
  const [formPlanType, setFormPlanType] = useState("Professional");
  const [formStatus, setFormStatus] = useState<Clinic["status"]>("active");

  useEffect(() => {
    if (viewMode !== "table") {
      setShowColumnPanel(false);
    }
  }, [viewMode]);

  const filteredClinics = useMemo(() => {
    return clinics.filter((clinic) => {
      const searchLower = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !searchLower ||
        clinic.name.toLowerCase().includes(searchLower) ||
        clinic.id.toLowerCase().includes(searchLower) ||
        clinic.email.toLowerCase().includes(searchLower) ||
        clinic.adminName.toLowerCase().includes(searchLower);
      const matchesStatus = statusFilter === "all" || clinic.status === statusFilter;
      const matchesPlan = planFilter === "all" || clinic.planType.toLowerCase() === planFilter;
      const matchesStartDate = !dateRange.start || new Date(clinic.createdDate) >= new Date(dateRange.start);
      const matchesEndDate = !dateRange.end || new Date(clinic.createdDate) <= new Date(dateRange.end);

      return matchesSearch && matchesStatus && matchesPlan && matchesStartDate && matchesEndDate;
    });
  }, [clinics, dateRange.end, dateRange.start, planFilter, searchQuery, statusFilter]);

  const sortedClinics = useMemo(() => {
    if (!sortField) return filteredClinics;
    return [...filteredClinics].sort((a, b) => {
      const first = a[sortField];
      const second = b[sortField];
      if (first < second) return sortDirection === "asc" ? -1 : 1;
      if (first > second) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredClinics, sortDirection, sortField]);

  const totalPages = Math.max(1, Math.ceil(sortedClinics.length / ITEMS_PER_PAGE));
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedClinics.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, sortedClinics]);

  const activeFilterCount = useMemo(() => {
    return (statusFilter !== "all" ? 1 : 0) + (planFilter !== "all" ? 1 : 0) + (dateRange.start || dateRange.end ? 1 : 0);
  }, [dateRange.end, dateRange.start, planFilter, statusFilter]);

  const visibleColumnCount = Object.values(visibleColumns).filter(Boolean).length;
  const selectedOnPage = currentData.length > 0 && currentData.every((clinic) => selectedRowIds.includes(clinic.id));
  const partialSelection = currentData.some((clinic) => selectedRowIds.includes(clinic.id)) && !selectedOnPage;
  const totalCount = clinics.length;
  const activeCount = clinics.filter((clinic) => clinic.status === "active").length;
  const suspendedCount = clinics.filter((clinic) => clinic.status === "suspended").length;
  const inactiveCount = clinics.filter((clinic) => clinic.status === "inactive").length;

  const openFilters = () => {
    const rows: string[] = [];
    if (statusFilter !== "all") rows.push("status");
    if (planFilter !== "all") rows.push("plan");
    if (dateRange.start || dateRange.end) rows.push("date");
    setDraftRows(rows);
    setDraftStatus(statusFilter === "all" ? "active" : statusFilter);
    setDraftPlan(planFilter === "all" ? "professional" : planFilter);
    setDraftDateRange({ ...dateRange });
    setShowFilterPanel(true);
  };

  const applyFilters = () => {
    setStatusFilter(draftRows.includes("status") ? draftStatus : "all");
    setPlanFilter(draftRows.includes("plan") ? draftPlan : "all");
    setDateRange(draftRows.includes("date") ? draftDateRange : { start: "", end: "" });
    setCurrentPage(1);
    setShowFilterPanel(false);
    toast.success("Filters applied successfully.");
  };

  const clearFilters = () => {
    setDraftRows([]);
    setDraftStatus("active");
    setDraftPlan("professional");
    setDraftDateRange({ start: "", end: "" });
    setStatusFilter("all");
    setPlanFilter("all");
    setDateRange({ start: "", end: "" });
    setCurrentPage(1);
    toast.success("Filters cleared successfully.");
  };

  const handleSort = (field: ColumnKey) => {
    if (sortField === field) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
      return;
    }
    setSortField(field);
    setSortDirection("asc");
  };

  const renderSortIcon = (field: ColumnKey) => {
    return <ArrowUpDown className={`h-3.5 w-3.5 ${sortField === field ? "text-primary" : "text-neutral-400"}`} />;
  };

  const handleSelectRow = (clinicId: string, checked: boolean) => {
    setSelectedRowIds((selected) => (checked ? Array.from(new Set([...selected, clinicId])) : selected.filter((id) => id !== clinicId)));
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedRowIds((selected) => {
      const pageIds = currentData.map((clinic) => clinic.id);
      return checked ? Array.from(new Set([...selected, ...pageIds])) : selected.filter((id) => !pageIds.includes(id));
    });
  };

  const handleExportExcel = () => {
    const dataToExport = selectedRowIds.length > 0 ? clinics.filter((clinic) => selectedRowIds.includes(clinic.id)) : filteredClinics;
    if (dataToExport.length === 0) {
      toast.error("No data matching current criteria to export.");
      return;
    }

    const activeColumns = columns.filter((column) => visibleColumns[column.key]);
    const csvRows = dataToExport.map((clinic) =>
      activeColumns
        .map((column) => {
          const value = clinic[column.key];
          return typeof value === "string" && value.includes(",") ? `"${value.replace(/"/g, '""')}"` : value;
        })
        .join(","),
    );
    const csvContent = `data:text/csv;charset=utf-8,${[activeColumns.map((column) => column.label).join(","), ...csvRows].join("\n")}`;
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `clinics_export_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowMoreMenu(false);
    toast.success(`Exported ${dataToExport.length} clinic rows.`);
  };

  const handleExportPdf = () => {
    const dataToExport = selectedRowIds.length > 0 ? clinics.filter((clinic) => selectedRowIds.includes(clinic.id)) : filteredClinics;
    if (dataToExport.length === 0) {
      toast.error("No data matching current criteria to print.");
      return;
    }
    const activeColumns = columns.filter((column) => visibleColumns[column.key]);
    const headerHtml = activeColumns.map((column) => `<th>${column.label}</th>`).join("");
    const rowsHtml = dataToExport
      .map((clinic) => `<tr>${activeColumns.map((column) => `<td>${clinic[column.key]}</td>`).join("")}</tr>`)
      .join("");
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Clinic Management Report</title>
          <style>
            body { font-family: Inter, Arial, sans-serif; padding: 24px; color: #111827; }
            h1 { font-size: 18px; margin: 0 0 4px; }
            p { margin: 0 0 18px; color: #6b7280; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; font-size: 12px; }
            th { background: #f9fafb; font-weight: 600; color: #374151; }
          </style>
        </head>
        <body>
          <h1>Clinic Management Report</h1>
          <p>Exported on ${new Date().toLocaleString()} | Total items: ${dataToExport.length}</p>
          <table><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
    setShowMoreMenu(false);
  };

  const handleAddClick = () => {
    setFormName("");
    setFormId(`CLN00${clinics.length + 1}`);
    setFormEmail("");
    setFormAdminName("");
    setFormPlanType("Professional");
    setFormStatus("active");
    setShowAddModal(true);
  };

  const handleAddClinicSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!formName.trim() || !formId.trim() || !formEmail.trim() || !formAdminName.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (clinics.some((clinic) => clinic.id.toUpperCase() === formId.toUpperCase())) {
      toast.error("A clinic with this ID already exists.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setClinics([
      ...clinics,
      {
        id: formId.toUpperCase(),
        name: formName,
        email: formEmail,
        adminName: formAdminName,
        planType: formPlanType,
        status: formStatus,
        createdDate: new Date().toISOString().split("T")[0],
      },
    ]);
    setShowAddModal(false);
    toast.success("Clinic onboarded successfully!");
  };

  const handleEditClick = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setFormName(clinic.name);
    setFormId(clinic.id);
    setFormEmail(clinic.email);
    setFormAdminName(clinic.adminName);
    setFormPlanType(clinic.planType);
    setFormStatus(clinic.status);
    setShowEditModal(true);
    setActiveMenuRowId(null);
  };

  const handleUpdateClinicSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedClinic) return;
    if (!formName.trim() || !formEmail.trim() || !formAdminName.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setClinics((records) =>
      records.map((clinic) =>
        clinic.id === selectedClinic.id
          ? { ...clinic, name: formName, email: formEmail, adminName: formAdminName, planType: formPlanType, status: formStatus }
          : clinic,
      ),
    );
    setSelectedClinic(null);
    setShowEditModal(false);
    toast.success("Clinic updated successfully!");
  };

  const handleDeleteClick = (clinic: Clinic) => {
    setClinicToDelete(clinic);
    setShowDeleteModal(true);
    setActiveMenuRowId(null);
  };

  const handleConfirmDelete = () => {
    if (!clinicToDelete) return;
    setClinics((records) => records.filter((clinic) => clinic.id !== clinicToDelete.id));
    setSelectedRowIds((selected) => selected.filter((id) => id !== clinicToDelete.id));
    setShowDeleteModal(false);
    setClinicToDelete(null);
    toast.success("Clinic deleted successfully.");
  };

  const handleUpdateStatus = (clinicId: string, newStatus: Clinic["status"]) => {
    setClinics((records) => records.map((clinic) => (clinic.id === clinicId ? { ...clinic, status: newStatus } : clinic)));
    setActiveMenuRowId(null);
    toast.success(`Clinic status updated to ${newStatus}.`);
  };

  const handleBulkStatus = (newStatus: Clinic["status"]) => {
    setClinics((records) => records.map((clinic) => (selectedRowIds.includes(clinic.id) ? { ...clinic, status: newStatus } : clinic)));
    setSelectedRowIds([]);
    toast.success(`Selected clinics updated to ${newStatus}.`);
  };

  const toggleColumn = (key: ColumnKey) => {
    setVisibleColumns((current) => {
      const enabledCount = Object.values(current).filter(Boolean).length;
      if (current[key] && enabledCount === 1) return current;
      return { ...current, [key]: !current[key] };
    });
  };

  const renderActionsMenu = (clinic: Clinic) => (
    <div className="relative inline-block text-left">
      <button type="button" title="Actions" onClick={() => setActiveMenuRowId(activeMenuRowId === clinic.id ? null : clinic.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white">
        <MoreVertical className="h-4 w-4" />
      </button>
      {activeMenuRowId === clinic.id ? (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setActiveMenuRowId(null)} />
          <div className="absolute right-0 top-9 z-40 w-48 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
            <button type="button" onClick={() => navigate(`/dashboard/clinics/${clinic.id}`)} className="flex h-9 w-full items-center gap-2 px-3 text-left text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900">
              <Building2 className="h-4 w-4 text-neutral-500" />
              View Details
            </button>
            <button type="button" onClick={() => handleEditClick(clinic)} className="flex h-9 w-full items-center gap-2 px-3 text-left text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900">
              <Edit className="h-4 w-4 text-neutral-500" />
              Edit Clinic
            </button>
            {clinic.status !== "active" ? (
              <button type="button" onClick={() => handleUpdateStatus(clinic.id, "active")} className="flex h-9 w-full items-center gap-2 px-3 text-left text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                Activate
              </button>
            ) : (
              <button type="button" onClick={() => handleUpdateStatus(clinic.id, "suspended")} className="flex h-9 w-full items-center gap-2 px-3 text-left text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900">
                <ShieldAlert className="h-4 w-4 text-red-600" />
                Suspend
              </button>
            )}
            {clinic.status !== "inactive" ? (
              <button type="button" onClick={() => handleUpdateStatus(clinic.id, "inactive")} className="flex h-9 w-full items-center gap-2 px-3 text-left text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900">
                <X className="h-4 w-4 text-neutral-500" />
                Mark Inactive
              </button>
            ) : null}
            <button type="button" onClick={() => handleDeleteClick(clinic)} className="flex h-9 w-full items-center gap-2 border-t border-neutral-100 px-3 text-left text-sm text-red-600 hover:bg-red-50 dark:border-neutral-800 dark:text-red-400 dark:hover:bg-red-950/20">
              <Trash2 className="h-4 w-4" />
              Delete Clinic
            </button>
          </div>
        </>
      ) : null}
    </div>
  );

  const renderPagination = () => (
    <div className="flex flex-col gap-3 border-t border-neutral-200 bg-white px-4 py-3 text-sm dark:border-neutral-800 dark:bg-neutral-950 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-neutral-500 dark:text-neutral-400">
        Showing {sortedClinics.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}-
        {Math.min(currentPage * ITEMS_PER_PAGE, sortedClinics.length)} of {sortedClinics.length}
      </p>
      <div className="flex items-center gap-2">
        <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200">
          Previous
        </button>
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
          Page {currentPage} of {totalPages}
        </span>
        <button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200">
          Next
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-full bg-neutral-50 px-6 py-5 text-[14px] text-neutral-900 dark:bg-neutral-950 dark:text-white">
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-2xl font-semibold leading-8 tracking-normal text-neutral-950 dark:text-white">Clinic Management</h1>
          <p className="mt-1 max-w-2xl text-sm leading-5 text-neutral-500 dark:text-neutral-400">
            Manage clinic organizations, subscription plans, and platform access status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
          {isSearchOpen ? (
            <div className="flex h-10 min-w-[360px] items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950">
              <Search className="h-4 w-4 shrink-0" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search clinics by name, ID, email, or admin..."
                className="h-full flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white"
              />
              <button type="button" title="Filter By" onClick={openFilters} className="relative rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-900 dark:hover:text-white">
                <Filter className="h-4 w-4" />
                {activeFilterCount > 0 ? <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">{activeFilterCount}</span> : null}
              </button>
              <button type="button" title="Close Search" onClick={() => setIsSearchOpen(false)} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-900 dark:hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <HeaderIconButton label="Search" icon={Search} active={Boolean(searchQuery)} onClick={() => setIsSearchOpen(true)} />
          )}

          {viewMode === "table" ? (
            <div className="relative">
              <HeaderIconButton label="Customized columns" icon={Columns3} active={showColumnPanel || visibleColumnCount < columns.length} onClick={() => setShowColumnPanel((value) => !value)} />
              {showColumnPanel ? <ColumnPanel visibleColumns={visibleColumns} onToggle={toggleColumn} onClose={() => setShowColumnPanel(false)} /> : null}
            </div>
          ) : null}

          <button type="button" onClick={handleAddClick} className="inline-flex h-10 items-center gap-2 rounded-lg border border-primary bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Add Clinic
          </button>
          <HeaderIconButton label="Summary" icon={BarChart3} active={showSummary} onClick={() => setShowSummary((value) => !value)} />
          <HeaderIconButton label="Refresh" icon={RefreshCw} onClick={() => toast.success("Clinic lists refreshed successfully.")} />
          <div className="relative">
            <HeaderIconButton label="More options" icon={MoreVertical} active={showMoreMenu} onClick={() => setShowMoreMenu((value) => !value)} />
            {showMoreMenu ? (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowMoreMenu(false)} />
                <div className="absolute right-0 top-12 z-40 w-44 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
                  <button type="button" onClick={() => toast.info("Import workflow is not configured for this module.")} className="flex h-9 w-full items-center gap-2 px-3 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900">
                    <Upload className="h-4 w-4 text-neutral-500" />
                    Import
                  </button>
                  <button type="button" onClick={handleExportExcel} className="flex h-9 w-full items-center gap-2 px-3 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900">
                    <Download className="h-4 w-4 text-neutral-500" />
                    Export
                  </button>
                  <button type="button" onClick={handleExportPdf} className="flex h-9 w-full items-center gap-2 px-3 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900">
                    <Printer className="h-4 w-4 text-neutral-500" />
                    Print
                  </button>
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
            { label: "Total Clinics", value: totalCount, icon: Building2 },
            { label: "Active", value: activeCount, icon: CheckCircle },
            { label: "Suspended", value: suspendedCount, icon: ShieldAlert },
            { label: "Inactive", value: inactiveCount, icon: X },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">{label}</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="text-2xl font-semibold leading-none text-neutral-950 dark:text-white">{value}</p>
            </div>
          ))}
        </div>
      ) : null}

      {selectedRowIds.length > 0 ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">{selectedRowIds.length} selected</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => handleBulkStatus("active")} className="inline-flex h-9 items-center gap-2 rounded-lg border border-neutral-200 px-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              Activate Selected
            </button>
            <button type="button" onClick={() => handleBulkStatus("suspended")} className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 px-3 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/20">
              <ShieldAlert className="h-4 w-4" />
              Suspend Selected
            </button>
            <button type="button" onClick={() => setSelectedRowIds([])} className="h-9 rounded-lg px-3 text-sm font-medium text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900">
              Clear
            </button>
          </div>
        </div>
      ) : null}

      {sortedClinics.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {viewMode === "table" ? (
            <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left">
                  <thead className="bg-neutral-50 dark:bg-neutral-900">
                    <tr className="border-b border-neutral-200 dark:border-neutral-800">
                      <th className="w-12 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedOnPage}
                          ref={(input) => {
                            if (input) input.indeterminate = partialSelection;
                          }}
                          onChange={(event) => handleSelectAll(event.target.checked)}
                          className="h-4 w-4 rounded border-neutral-300 accent-primary"
                        />
                      </th>
                      {columns.map((column) =>
                        visibleColumns[column.key] ? (
                          <th key={column.key} className="px-4 py-3 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                            <button type="button" onClick={() => handleSort(column.key)} className="inline-flex items-center gap-1.5">
                              {column.label}
                              {renderSortIcon(column.key)}
                            </button>
                          </th>
                        ) : null,
                      )}
                      <th className="w-20 px-4 py-3 text-right text-sm font-semibold text-neutral-500 dark:text-neutral-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {currentData.map((clinic) => (
                      <tr key={clinic.id} className={`h-14 hover:bg-neutral-50 dark:hover:bg-neutral-900 ${selectedRowIds.includes(clinic.id) ? "bg-primary/5" : ""}`}>
                        <td className="px-4 py-3">
                          <input type="checkbox" checked={selectedRowIds.includes(clinic.id)} onChange={(event) => handleSelectRow(clinic.id, event.target.checked)} className="h-4 w-4 rounded border-neutral-300 accent-primary" />
                        </td>
                        {visibleColumns.id ? <td className="px-4 py-3 font-mono text-sm font-medium text-neutral-900 dark:text-white">{clinic.id}</td> : null}
                        {visibleColumns.name ? (
                          <td className="px-4 py-3">
                            <button type="button" onClick={() => navigate(`/dashboard/clinics/${clinic.id}`)} className="flex items-center gap-3 text-left">
                              <ClinicMark name={clinic.name} />
                              <span className="text-sm font-semibold text-primary hover:underline">{clinic.name}</span>
                            </button>
                          </td>
                        ) : null}
                        {visibleColumns.email ? <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{clinic.email}</td> : null}
                        {visibleColumns.status ? <td className="px-4 py-3"><StatusBadge status={clinic.status} /></td> : null}
                        {visibleColumns.planType ? <td className="px-4 py-3"><PlanBadge plan={clinic.planType} /></td> : null}
                        {visibleColumns.createdDate ? <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{new Date(clinic.createdDate).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</td> : null}
                        {visibleColumns.adminName ? <td className="px-4 py-3 text-sm font-medium text-neutral-800 dark:text-neutral-200">{clinic.adminName}</td> : null}
                        <td className="px-4 py-3 text-right" onClick={(event) => event.stopPropagation()}>{renderActionsMenu(clinic)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {renderPagination()}
            </div>
          ) : null}

          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {currentData.map((clinic) => (
                <div key={clinic.id} onClick={() => navigate(`/dashboard/clinics/${clinic.id}`)} className={`flex min-h-[236px] cursor-pointer flex-col rounded-lg border border-neutral-200 bg-white p-4 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700 ${selectedRowIds.includes(clinic.id) ? "ring-2 ring-primary/20" : ""}`}>
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <ClinicMark name={clinic.name} />
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold text-neutral-950 dark:text-white">{clinic.name}</h3>
                        <p className="font-mono text-sm text-neutral-500 dark:text-neutral-400">{clinic.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2" onClick={(event) => event.stopPropagation()}><input type="checkbox" checked={selectedRowIds.includes(clinic.id)} onChange={(event) => handleSelectRow(clinic.id, event.target.checked)} className="h-4 w-4 rounded border-neutral-300 accent-primary" />{renderActionsMenu(clinic)}</div>
                  </div>
                  <div className="flex-1 grid gap-2.5 text-sm">
                    <div className="flex items-center justify-between gap-3"><span className="text-neutral-500 dark:text-neutral-400">Plan</span><PlanBadge plan={clinic.planType} /></div>
                    <div className="min-w-0"><span className="text-neutral-500 dark:text-neutral-400">Email</span><p className="truncate font-medium text-neutral-800 dark:text-neutral-200">{clinic.email}</p></div>
                    <div className="min-w-0"><span className="text-neutral-500 dark:text-neutral-400">Admin</span><p className="truncate font-medium text-neutral-800 dark:text-neutral-200">{clinic.adminName}</p></div>
                  </div>
                  <div className="mt-4 flex min-h-10 items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800"><span className="text-sm text-neutral-500 dark:text-neutral-400">Status</span><StatusBadge status={clinic.status} /></div>
                </div>
              ))}
              <div className="md:col-span-2 xl:col-span-4 overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">{renderPagination()}</div>
            </div>
          ) : null}

          {viewMode === "list" ? (
            <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {currentData.map((clinic) => (
                  <div key={clinic.id} onClick={() => navigate(`/dashboard/clinics/${clinic.id}`)} className={`flex cursor-pointer flex-col gap-3 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 md:flex-row md:items-center md:justify-between ${selectedRowIds.includes(clinic.id) ? "bg-primary/5" : ""}`}>
                    <div className="flex min-w-0 items-center gap-3">
                      <input type="checkbox" checked={selectedRowIds.includes(clinic.id)} onClick={(event) => event.stopPropagation()} onChange={(event) => handleSelectRow(clinic.id, event.target.checked)} className="h-4 w-4 rounded border-neutral-300 accent-primary" />
                      <ClinicMark name={clinic.name} />
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-neutral-950 dark:text-white">{clinic.name}</h3>
                        <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">{clinic.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 md:justify-end">
                      <span className="font-mono text-xs font-medium text-neutral-500 dark:text-neutral-400">{clinic.id}</span>
                      <StatusBadge status={clinic.status} />
                      <PlanBadge plan={clinic.planType} />
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">{clinic.adminName}</span>
                      <div onClick={(event) => event.stopPropagation()}>{renderActionsMenu(clinic)}</div>
                    </div>
                  </div>
                ))}
              </div>
              {renderPagination()}
            </div>
          ) : null}
        </>
      )}

      {showFilterPanel ? (
        <FilterPanel
          draftRows={draftRows}
          setDraftRows={setDraftRows}
          draftStatus={draftStatus}
          setDraftStatus={setDraftStatus}
          draftPlan={draftPlan}
          setDraftPlan={setDraftPlan}
          draftDateRange={draftDateRange}
          setDraftDateRange={setDraftDateRange}
          onApply={applyFilters}
          onClear={clearFilters}
          onCancel={() => setShowFilterPanel(false)}
        />
      ) : null}

      <FormModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Clinic" description="Onboard a new clinic organization to the SpineCloudIQ platform.">
        <form onSubmit={handleAddClinicSubmit} className="space-y-4">
          <FormSection title="Clinic Information">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField>
                <FormLabel required>Clinic Name</FormLabel>
                <FormInput type="text" placeholder="e.g. SpineCare Solutions" value={formName} onChange={(event) => setFormName(event.target.value)} required />
              </FormField>
              <FormField>
                <FormLabel required>Clinic ID</FormLabel>
                <FormInput type="text" placeholder="e.g. CLN005" value={formId} onChange={(event) => setFormId(event.target.value)} required />
              </FormField>
            </div>
            <div className="mt-4">
              <FormField>
                <FormLabel required>Email Address</FormLabel>
                <FormInput type="email" placeholder="contact@clinic.com" value={formEmail} onChange={(event) => setFormEmail(event.target.value)} required />
              </FormField>
            </div>
          </FormSection>
          <ClinicFormSettings formAdminName={formAdminName} setFormAdminName={setFormAdminName} formPlanType={formPlanType} setFormPlanType={setFormPlanType} formStatus={formStatus} setFormStatus={setFormStatus} />
          <FormFooter>
            <SecondaryButton onClick={() => setShowAddModal(false)} type="button">Cancel</SecondaryButton>
            <PrimaryButton type="submit">Onboard Clinic</PrimaryButton>
          </FormFooter>
        </form>
      </FormModal>

      <FormModal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setSelectedClinic(null); }} title="Edit Clinic Settings" description="Update account details and preferences for the selected organization.">
        <form onSubmit={handleUpdateClinicSubmit} className="space-y-4">
          <FormSection title="Clinic Information">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField>
                <FormLabel required>Clinic Name</FormLabel>
                <FormInput type="text" placeholder="e.g. SpineCare Solutions" value={formName} onChange={(event) => setFormName(event.target.value)} required />
              </FormField>
              <FormField>
                <FormLabel>Clinic ID</FormLabel>
                <FormInput type="text" value={formId} disabled className="cursor-not-allowed bg-neutral-100 dark:bg-neutral-900" />
              </FormField>
            </div>
            <div className="mt-4">
              <FormField>
                <FormLabel required>Email Address</FormLabel>
                <FormInput type="email" placeholder="contact@clinic.com" value={formEmail} onChange={(event) => setFormEmail(event.target.value)} required />
              </FormField>
            </div>
          </FormSection>
          <ClinicFormSettings formAdminName={formAdminName} setFormAdminName={setFormAdminName} formPlanType={formPlanType} setFormPlanType={setFormPlanType} formStatus={formStatus} setFormStatus={setFormStatus} />
          <FormFooter>
            <SecondaryButton onClick={() => { setShowEditModal(false); setSelectedClinic(null); }} type="button">Cancel</SecondaryButton>
            <PrimaryButton type="submit">Save Changes</PrimaryButton>
          </FormFooter>
        </form>
      </FormModal>

      <FormModal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setClinicToDelete(null); }} title="Delete Clinic Organization" description="This action is permanent and cannot be reversed.">
        <div className="space-y-4">
          <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="text-xs font-semibold uppercase">Warning</p>
              <p className="mt-1 text-xs">Deleting this clinic will revoke access for associated administrators, staff, and providers.</p>
            </div>
          </div>
          {clinicToDelete ? (
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900">
              <p className="font-semibold text-neutral-900 dark:text-white">{clinicToDelete.name}</p>
              <p className="mt-1 text-neutral-500 dark:text-neutral-400">{clinicToDelete.id} · {clinicToDelete.email}</p>
            </div>
          ) : null}
          <FormFooter>
            <SecondaryButton onClick={() => { setShowDeleteModal(false); setClinicToDelete(null); }} type="button">Cancel</SecondaryButton>
            <button type="button" onClick={handleConfirmDelete} className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-700 bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700">
              Delete Clinic
            </button>
          </FormFooter>
        </div>
      </FormModal>
    </div>
  );
}

function ClinicFormSettings({
  formAdminName,
  setFormAdminName,
  formPlanType,
  setFormPlanType,
  formStatus,
  setFormStatus,
}: {
  formAdminName: string;
  setFormAdminName: (value: string) => void;
  formPlanType: string;
  setFormPlanType: (value: string) => void;
  formStatus: Clinic["status"];
  setFormStatus: (value: Clinic["status"]) => void;
}) {
  return (
    <FormSection title="Account Settings">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField>
          <FormLabel required>Primary Admin</FormLabel>
          <FormInput type="text" placeholder="Dr. Full Name" value={formAdminName} onChange={(event) => setFormAdminName(event.target.value)} required />
        </FormField>
        <FormField>
          <FormLabel required>Subscription Plan</FormLabel>
          <FormSelect value={formPlanType} onChange={(event) => setFormPlanType(event.target.value)}>
            {planOptions.map((plan) => (
              <option key={plan} value={plan}>{plan}</option>
            ))}
          </FormSelect>
        </FormField>
      </div>
      <div className="mt-4">
        <FormField>
          <FormLabel required>Status</FormLabel>
          <StatusSlider
            value={formStatus}
            onChange={(value) => {
              if (value === "active" || value === "suspended" || value === "inactive") setFormStatus(value);
            }}
            options={[
              { value: "active", label: "Active", color: "bg-success-500" },
              { value: "suspended", label: "Suspended", color: "bg-error-500" },
              { value: "inactive", label: "Inactive", color: "bg-neutral-500" },
            ]}
          />
        </FormField>
      </div>
    </FormSection>
  );
}
