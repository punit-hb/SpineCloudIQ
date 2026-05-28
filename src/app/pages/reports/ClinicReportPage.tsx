import { type ComponentType, useMemo, useState } from "react";
import {
  ArrowUpDown,
  BarChart3,
  Building2,
  Check,
  Columns3,
  Download,
  Filter,
  Mail,
  Plus,
  RefreshCw,
  Search,
  Users,
  X,
} from "lucide-react";
import { CardFooter, CardHeader, CardMetaRow, CardStatusPill, EnterpriseAvatar, EntityCard, PlainMetaLabel, ViewModeSwitcher } from "../../components/hb/listing";

interface Clinic {
  id: string;
  clinicName: string;
  ownerEmail: string;
  plan: string;
  subscriptionStatus: "Active" | "Suspended" | "Inactive";
  expirationDate: string;
  branchCount: number;
  providersCount: number;
  totalUsers: number;
  patientsCount: number;
  appointmentsCount: number;
  activeProviders: number;
  createdDate: string;
  lastActivityDate: string;
}

type SortField = keyof Clinic;
type SortOrder = "asc" | "desc" | null;
type ViewMode = "grid" | "list" | "table";
type ColumnKey =
  | "clinicName"
  | "ownerEmail"
  | "plan"
  | "subscriptionStatus"
  | "expirationDate"
  | "branchCount"
  | "providersCount"
  | "totalUsers"
  | "patientsCount"
  | "appointmentsCount"
  | "activeProviders"
  | "createdDate"
  | "lastActivityDate";

const ITEMS_PER_PAGE = 10;

const mockClinics: Clinic[] = [
  { id: "clinic_001", clinicName: "SpineWorks Clinic", ownerEmail: "dr.smith@spineworks.com", plan: "Professional", subscriptionStatus: "Active", expirationDate: "2025-01-15", branchCount: 2, providersCount: 8, totalUsers: 15, patientsCount: 450, appointmentsCount: 187, activeProviders: 7, createdDate: "2024-01-15", lastActivityDate: "2025-02-22" },
  { id: "clinic_002", clinicName: "HealthFirst Chiropractic", ownerEmail: "admin@healthfirst.com", plan: "Enterprise", subscriptionStatus: "Active", expirationDate: "2025-06-01", branchCount: 5, providersCount: 25, totalUsers: 48, patientsCount: 1250, appointmentsCount: 542, activeProviders: 23, createdDate: "2023-06-01", lastActivityDate: "2025-02-23" },
  { id: "clinic_004", clinicName: "Peak Performance Therapy", ownerEmail: "info@peaktherapy.com", plan: "Professional", subscriptionStatus: "Active", expirationDate: "2025-03-10", branchCount: 2, providersCount: 7, totalUsers: 12, patientsCount: 380, appointmentsCount: 168, activeProviders: 6, createdDate: "2024-03-10", lastActivityDate: "2025-02-21" },
  { id: "clinic_005", clinicName: "Wellness Spine Clinic", ownerEmail: "admin@wellnessspine.com", plan: "Basic", subscriptionStatus: "Suspended", expirationDate: "2025-02-20", branchCount: 1, providersCount: 4, totalUsers: 6, patientsCount: 145, appointmentsCount: 12, activeProviders: 1, createdDate: "2024-08-20", lastActivityDate: "2025-02-10" },
  { id: "clinic_006", clinicName: "Advanced Spine Solutions", ownerEmail: "dr.johnson@advancedspine.com", plan: "Enterprise", subscriptionStatus: "Active", expirationDate: "2025-11-01", branchCount: 8, providersCount: 35, totalUsers: 67, patientsCount: 2100, appointmentsCount: 896, activeProviders: 32, createdDate: "2023-11-01", lastActivityDate: "2025-02-23" },
  { id: "clinic_007", clinicName: "City Wellness Center", ownerEmail: "contact@citywellness.com", plan: "Professional", subscriptionStatus: "Active", expirationDate: "2025-05-15", branchCount: 3, providersCount: 10, totalUsers: 18, patientsCount: 520, appointmentsCount: 215, activeProviders: 9, createdDate: "2024-05-15", lastActivityDate: "2025-02-22" },
  { id: "clinic_008", clinicName: "Coastal Spine Institute", ownerEmail: "admin@coastalspine.com", plan: "Enterprise", subscriptionStatus: "Active", expirationDate: "2025-09-01", branchCount: 7, providersCount: 40, totalUsers: 75, patientsCount: 1890, appointmentsCount: 782, activeProviders: 38, createdDate: "2023-09-01", lastActivityDate: "2025-02-23" },
  { id: "clinic_010", clinicName: "Premier Spine Care", ownerEmail: "contact@premierspine.com", plan: "Professional", subscriptionStatus: "Active", expirationDate: "2025-04-01", branchCount: 2, providersCount: 9, totalUsers: 16, patientsCount: 680, appointmentsCount: 294, activeProviders: 8, createdDate: "2024-04-01", lastActivityDate: "2025-02-23" },
  { id: "clinic_011", clinicName: "Harmony Health Center", ownerEmail: "admin@harmonyhealth.com", plan: "Basic", subscriptionStatus: "Inactive", expirationDate: "2025-01-20", branchCount: 1, providersCount: 3, totalUsers: 5, patientsCount: 120, appointmentsCount: 8, activeProviders: 0, createdDate: "2024-10-01", lastActivityDate: "2025-01-18" },
  { id: "clinic_012", clinicName: "Valley Spine Wellness", ownerEmail: "info@valleyspine.com", plan: "Professional", subscriptionStatus: "Active", expirationDate: "2025-03-25", branchCount: 2, providersCount: 6, totalUsers: 11, patientsCount: 340, appointmentsCount: 142, activeProviders: 5, createdDate: "2024-03-25", lastActivityDate: "2025-02-21" },
  { id: "clinic_013", clinicName: "Summit Chiropractic", ownerEmail: "contact@summitchiro.com", plan: "Enterprise", subscriptionStatus: "Active", expirationDate: "2025-08-15", branchCount: 6, providersCount: 28, totalUsers: 52, patientsCount: 1620, appointmentsCount: 687, activeProviders: 26, createdDate: "2023-08-15", lastActivityDate: "2025-02-23" },
];

const tableColumns: Array<{ key: ColumnKey; label: string; sort: SortField }> = [
  { key: "clinicName", label: "Clinic Name", sort: "clinicName" },
  { key: "ownerEmail", label: "Owner Email", sort: "ownerEmail" },
  { key: "plan", label: "Plan", sort: "plan" },
  { key: "subscriptionStatus", label: "Status", sort: "subscriptionStatus" },
  { key: "expirationDate", label: "Expiration", sort: "expirationDate" },
  { key: "branchCount", label: "Branches", sort: "branchCount" },
  { key: "providersCount", label: "Providers", sort: "providersCount" },
  { key: "totalUsers", label: "Total Users", sort: "totalUsers" },
  { key: "patientsCount", label: "Patients", sort: "patientsCount" },
  { key: "appointmentsCount", label: "Appointments", sort: "appointmentsCount" },
  { key: "activeProviders", label: "Active Providers", sort: "activeProviders" },
  { key: "createdDate", label: "Created", sort: "createdDate" },
  { key: "lastActivityDate", label: "Last Activity", sort: "lastActivityDate" },
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

function ClinicMark({ name }: { name: string }) {
  return (
    <EnterpriseAvatar className="text-primary">
      {name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
    </EnterpriseAvatar>
  );
}

function DotBadge({ value }: { value: string }) {
  const color = value === "Active" ? "bg-emerald-500" : value === "Suspended" ? "bg-amber-500" : "bg-red-500";
  const tone = value === "Active" ? "green" : value === "Suspended" ? "amber" : "gray";
  return <CardStatusPill tone={tone}>{value}</CardStatusPill>;
}

function PlanBadge({ plan }: { plan: string }) {
  return <PlainMetaLabel>{plan}</PlainMetaLabel>;
}

function ColumnPanel({ visibleColumns, onToggle, onClose }: { visibleColumns: Record<ColumnKey, boolean>; onToggle: (key: ColumnKey) => void; onClose: () => void }) {
  const activeCount = Object.values(visibleColumns).filter(Boolean).length;
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute right-0 top-12 z-40 w-72 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
        <div className="flex h-11 items-center justify-between border-b border-neutral-100 px-4 dark:border-neutral-800">
          <h3 className="text-sm font-semibold">Columns</h3>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"><X className="h-4 w-4" /></button>
        </div>
        <div className="max-h-[380px] overflow-y-auto p-2">
          {tableColumns.map((column) => (
            <button key={column.key} type="button" onClick={() => onToggle(column.key)} className="flex h-9 w-full items-center gap-3 rounded-md px-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900">
              <span className={`flex h-4 w-4 items-center justify-center rounded border ${visibleColumns[column.key] ? "border-primary bg-primary text-white" : "border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-950"}`}>
                {visibleColumns[column.key] ? <Check className="h-3 w-3" /> : null}
              </span>
              {column.label}
            </button>
          ))}
        </div>
        <div className="border-t border-neutral-100 px-4 py-3 text-xs font-medium text-neutral-500 dark:border-neutral-800">{activeCount} of {tableColumns.length} active</div>
      </div>
    </>
  );
}

function FilterPanel({
  draftRows,
  setDraftRows,
  drafts,
  setDrafts,
  onClear,
  onCancel,
  onApply,
}: {
  draftRows: string[];
  setDraftRows: (rows: string[]) => void;
  drafts: { plan: string; status: string };
  setDrafts: (drafts: { plan: string; status: string }) => void;
  onClear: () => void;
  onCancel: () => void;
  onApply: () => void;
}) {
  const fields = ["plan", "status"];
  const labels: Record<string, string> = { plan: "Plan", status: "Subscription Status" };
  const options: Record<string, string[]> = {
    plan: ["Basic", "Professional", "Enterprise"],
    status: ["Active", "Suspended", "Inactive"],
  };
  const remaining = fields.filter((field) => !draftRows.includes(field));

  return (
    <div className="absolute right-0 top-12 z-50 w-[560px] overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex h-12 items-center justify-between border-b border-neutral-100 px-4 dark:border-neutral-800">
        <h2 className="text-sm font-semibold">Filter By</h2>
        <button type="button" onClick={onCancel} className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"><X className="h-4 w-4" /></button>
      </div>
      <div className="space-y-3 p-4">
        <div className="grid grid-cols-[170px_1fr_32px] gap-2 px-1 text-xs font-semibold uppercase text-neutral-500"><span>Where</span><span>What</span><span /></div>
        {draftRows.length === 0 ? <div className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50 px-3 py-6 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">No filters selected.</div> : null}
        {draftRows.map((row) => (
          <div key={row} className="grid grid-cols-[170px_1fr_32px] items-center gap-2">
            <div className="flex h-10 items-center rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm font-medium dark:border-neutral-800 dark:bg-neutral-900">{labels[row]}</div>
            <select value={drafts[row as keyof typeof drafts]} onChange={(event) => setDrafts({ ...drafts, [row]: event.target.value })} className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-950">
              {options[row].map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            <button type="button" onClick={() => setDraftRows(draftRows.filter((item) => item !== row))} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"><X className="h-4 w-4" /></button>
          </div>
        ))}
        <button type="button" disabled={remaining.length === 0} onClick={() => setDraftRows([...draftRows, remaining[0]])} className="inline-flex h-9 items-center gap-2 rounded-lg px-2 text-sm font-medium text-primary hover:bg-primary/10 disabled:opacity-40"><Plus className="h-4 w-4" />Add Filter</button>
      </div>
      <div className="flex h-14 items-center justify-end gap-2 border-t border-neutral-100 px-4 dark:border-neutral-800">
        <button type="button" onClick={onClear} className="h-9 rounded-lg px-3 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900">Clear All</button>
        <button type="button" onClick={onCancel} className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium dark:border-neutral-800 dark:bg-neutral-950">Cancel</button>
        <button type="button" onClick={onApply} className="h-9 rounded-lg border border-primary bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90">Apply</button>
      </div>
    </div>
  );
}

export default function ClinicReportPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showSummary, setShowSummary] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showColumnPanel, setShowColumnPanel] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterPlan, setFilterPlan] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [draftRows, setDraftRows] = useState<string[]>([]);
  const [drafts, setDrafts] = useState({ plan: "Professional", status: "Active" });
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>({
    clinicName: true,
    ownerEmail: true,
    plan: true,
    subscriptionStatus: true,
    expirationDate: true,
    branchCount: true,
    providersCount: true,
    totalUsers: true,
    patientsCount: true,
    appointmentsCount: true,
    activeProviders: true,
    createdDate: true,
    lastActivityDate: true,
  });

  const filteredAndSortedData = useMemo(() => {
    return mockClinics
      .filter((clinic) => {
        const search = searchQuery.trim().toLowerCase();
        const matchesSearch = !search || clinic.clinicName.toLowerCase().includes(search) || clinic.ownerEmail.toLowerCase().includes(search) || clinic.plan.toLowerCase().includes(search) || clinic.subscriptionStatus.toLowerCase().includes(search);
        const matchesPlan = !filterPlan || clinic.plan === filterPlan;
        const matchesStatus = !filterStatus || clinic.subscriptionStatus === filterStatus;
        return matchesSearch && matchesPlan && matchesStatus;
      })
      .sort((a, b) => {
        if (!sortField || !sortOrder) return 0;
        const aValue = a[sortField];
        const bValue = b[sortField];
        if (typeof aValue === "string" && typeof bValue === "string") return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        if (typeof aValue === "number" && typeof bValue === "number") return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        return 0;
      });
  }, [filterPlan, filterStatus, searchQuery, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE));
  const currentData = filteredAndSortedData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const activeFilterCount = (filterPlan ? 1 : 0) + (filterStatus ? 1 : 0);
  const selectedOnPage = currentData.length > 0 && currentData.every((item) => selectedRowIds.includes(item.id));
  const visibleColumnCount = Object.values(visibleColumns).filter(Boolean).length;
  const activeClinics = mockClinics.filter((item) => item.subscriptionStatus === "Active").length;
  const totalPatients = mockClinics.reduce((sum, item) => sum + item.patientsCount, 0);
  const totalProviders = mockClinics.reduce((sum, item) => sum + item.providersCount, 0);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === "asc") setSortOrder("desc");
      else if (sortOrder === "desc") {
        setSortField(null);
        setSortOrder(null);
      } else setSortOrder("asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field: SortField) => {
    return <ArrowUpDown className={`h-3.5 w-3.5 ${sortField === field ? "text-primary" : "text-neutral-400"}`} />;
  };

  const openFilters = () => {
    const rows = [];
    if (filterPlan) rows.push("plan");
    if (filterStatus) rows.push("status");
    setDraftRows(rows);
    setDrafts({ plan: filterPlan || "Professional", status: filterStatus || "Active" });
    setShowFilterPanel(true);
  };

  const applyFilters = () => {
    setFilterPlan(draftRows.includes("plan") ? drafts.plan : "");
    setFilterStatus(draftRows.includes("status") ? drafts.status : "");
    setCurrentPage(1);
    setShowFilterPanel(false);
  };

  const clearFilters = () => {
    setDraftRows([]);
    setFilterPlan("");
    setFilterStatus("");
    setCurrentPage(1);
  };

  const handleExport = () => console.log("Exporting clinic report as excel for current view");

  const toggleColumn = (key: ColumnKey) => {
    setVisibleColumns((current) => {
      if (current[key] && Object.values(current).filter(Boolean).length === 1) return current;
      return { ...current, [key]: !current[key] };
    });
  };

  const toggleSelected = (id: string, checked: boolean) => {
    setSelectedRowIds((current) => (checked ? Array.from(new Set([...current, id])) : current.filter((item) => item !== id)));
  };

  const renderCell = (clinic: Clinic, key: ColumnKey) => {
    if (key === "clinicName") {
      return (
        <div className="flex items-center gap-3">
          <ClinicMark name={clinic.clinicName} />
          <span className="text-sm font-semibold text-neutral-950 dark:text-white">{clinic.clinicName}</span>
        </div>
      );
    }
    if (key === "ownerEmail") return <span className="text-sm text-neutral-600 dark:text-neutral-400">{clinic.ownerEmail}</span>;
    if (key === "plan") return <PlanBadge plan={clinic.plan} />;
    if (key === "subscriptionStatus") return <DotBadge value={clinic.subscriptionStatus} />;
    if (key === "expirationDate") return <span className="text-sm text-neutral-600 dark:text-neutral-400">{formatDate(clinic.expirationDate)}</span>;
    if (key === "createdDate") return <span className="text-sm text-neutral-600 dark:text-neutral-400">{formatDate(clinic.createdDate)}</span>;
    if (key === "lastActivityDate") return <span className="text-sm text-neutral-600 dark:text-neutral-400">{formatDate(clinic.lastActivityDate)}</span>;
    return <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{clinic[key].toLocaleString()}</span>;
  };

  const renderPagination = () => (
    <div className="flex flex-col gap-3 border-t border-neutral-200 bg-white px-4 py-3 text-sm dark:border-neutral-800 dark:bg-neutral-950 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-neutral-500">Showing {filteredAndSortedData.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedData.length)} of {filteredAndSortedData.length}</p>
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
          <div className="mb-1 text-xs font-medium text-neutral-500">Reports <span className="mx-1 text-neutral-300">/</span> Clinic Report</div>
          <h1 className="text-2xl font-semibold leading-8 tracking-normal text-neutral-950 dark:text-white">Clinic Report</h1>
          <p className="mt-1 max-w-2xl text-sm leading-5 text-neutral-500 dark:text-neutral-400">Operational summary of all clinics on the platform.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
          {isSearchOpen ? (
            <div className="relative flex h-10 min-w-[360px] items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950">
              <Search className="h-4 w-4 shrink-0" />
              <input autoFocus value={searchQuery} onChange={(event) => { setSearchQuery(event.target.value); setCurrentPage(1); }} placeholder="Search by clinic name, email, plan, or status..." className="h-full flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white" />
              <button type="button" title="Filter By" onClick={openFilters} className="relative rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900"><Filter className="h-4 w-4" />{activeFilterCount ? <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">{activeFilterCount}</span> : null}</button>
              <button type="button" title="Close Search" onClick={() => setIsSearchOpen(false)} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900"><X className="h-4 w-4" /></button>
              {showFilterPanel ? <FilterPanel draftRows={draftRows} setDraftRows={setDraftRows} drafts={drafts} setDrafts={setDrafts} onClear={clearFilters} onCancel={() => setShowFilterPanel(false)} onApply={applyFilters} /> : null}
            </div>
          ) : (
            <HeaderIconButton title="Search" icon={Search} active={Boolean(searchQuery)} onClick={() => setIsSearchOpen(true)} />
          )}
          <ViewModeSwitcher value={viewMode} onChange={(mode) => { setViewMode(mode); setCurrentPage(1); }} />
          {viewMode === "table" ? <div className="relative">
            <HeaderIconButton title="Customized columns" icon={Columns3} active={showColumnPanel || visibleColumnCount < tableColumns.length} onClick={() => setShowColumnPanel((value) => !value)} />
            {showColumnPanel ? <ColumnPanel visibleColumns={visibleColumns} onToggle={toggleColumn} onClose={() => setShowColumnPanel(false)} /> : null}
          </div> : null}
          <button type="button" onClick={handleExport} className="inline-flex h-10 items-center gap-2 rounded-lg border border-primary bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90"><Download className="h-4 w-4" />Export Report</button>
          <HeaderIconButton title="Summary" icon={BarChart3} active={showSummary} onClick={() => setShowSummary((value) => !value)} />
          <HeaderIconButton title="Refresh" icon={RefreshCw} onClick={() => console.log("Clinic report refreshed")} />
        </div>
      </div>

      {showSummary ? (
        <div className="mb-5 grid gap-4 md:grid-cols-4">
          {[
            { label: "Clinics", value: mockClinics.length, icon: Building2 },
            { label: "Active", value: activeClinics, icon: Check },
            { label: "Providers", value: totalProviders, icon: Users },
            { label: "Patients", value: totalPatients.toLocaleString(), icon: BarChart3 },
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
          <div className="flex items-center gap-2"><button type="button" onClick={handleExport} className="inline-flex h-9 items-center gap-2 rounded-lg border border-neutral-200 px-3 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-800"><Download className="h-4 w-4" />Export Selected</button><button type="button" onClick={() => setSelectedRowIds([])} className="h-9 rounded-lg px-3 text-sm font-medium text-neutral-500 hover:bg-neutral-100">Clear</button></div>
        </div>
      ) : null}

      {filteredAndSortedData.length === 0 ? (
        <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-950"><Building2 className="mx-auto h-10 w-10 text-neutral-400" /><h3 className="mt-3 text-sm font-semibold">No clinics found</h3><p className="mt-1 text-sm text-neutral-500">Adjust search or filters to find matching clinic records.</p></div>
      ) : (
        <>
        {viewMode === "grid" ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {currentData.map((clinic) => (
              <EntityCard key={clinic.id} selected={selectedRowIds.includes(clinic.id)}>
                <CardHeader avatar={<ClinicMark name={clinic.clinicName} />} title={clinic.clinicName} subtitle={clinic.id} selected={selectedRowIds.includes(clinic.id)} onSelect={(checked) => toggleSelected(clinic.id, checked)} />
                <div className="flex-1 space-y-2 text-sm">
                  <CardMetaRow icon={Mail}>{clinic.ownerEmail}</CardMetaRow>
                  <div className="flex items-center gap-2"><Building2 className="h-4 w-4 shrink-0 text-neutral-500" /><PlanBadge plan={clinic.plan} /></div>
                  <CardMetaRow icon={Building2}>{clinic.branchCount} branches</CardMetaRow>
                  <CardMetaRow icon={Users}>{clinic.providersCount} providers</CardMetaRow>
                </div>
                <CardFooter><DotBadge value={clinic.subscriptionStatus} /></CardFooter>
              </EntityCard>
            ))}
          </div>
        ) : null}
        {viewMode === "list" ? (
          <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">{currentData.map((clinic) => <div key={clinic.id} className={`flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between ${selectedRowIds.includes(clinic.id) ? "bg-primary/5" : ""}`}><div className="flex min-w-0 items-center gap-3"><input type="checkbox" checked={selectedRowIds.includes(clinic.id)} onChange={(event) => toggleSelected(clinic.id, event.target.checked)} className="h-4 w-4 rounded border-neutral-300 accent-primary" /><ClinicMark name={clinic.clinicName} /><div className="min-w-0"><p className="truncate text-sm font-semibold">{clinic.clinicName}</p><p className="truncate text-xs text-neutral-500">{clinic.ownerEmail}</p></div></div><div className="flex flex-wrap items-center gap-2 text-sm"><PlanBadge plan={clinic.plan} /><DotBadge value={clinic.subscriptionStatus} /><span className="text-neutral-500">{clinic.providersCount} providers</span><span className="text-neutral-500">{clinic.patientsCount.toLocaleString()} patients</span></div></div>)}</div>
            {renderPagination()}
          </div>
        ) : null}
        {viewMode === "table" ? (
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left">
              <thead className="bg-neutral-50 dark:bg-neutral-900">
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <th className="w-12 px-4 py-3"><input type="checkbox" checked={selectedOnPage} onChange={(event) => setSelectedRowIds(event.target.checked ? Array.from(new Set([...selectedRowIds, ...currentData.map((item) => item.id)])) : selectedRowIds.filter((id) => !currentData.map((item) => item.id).includes(id)))} className="h-4 w-4 rounded border-neutral-300 accent-primary" /></th>
                  {tableColumns.map((column) => visibleColumns[column.key] ? (
                    <th key={column.key} className="px-4 py-3 text-sm font-semibold text-neutral-500">
                      <button type="button" onClick={() => handleSort(column.sort)} className="inline-flex items-center gap-1.5 whitespace-nowrap">{column.label}{getSortIcon(column.sort)}</button>
                    </th>
                  ) : null)}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {currentData.map((clinic) => (
                  <tr key={clinic.id} className={`h-14 hover:bg-neutral-50 dark:hover:bg-neutral-900 ${selectedRowIds.includes(clinic.id) ? "bg-primary/5" : ""}`}>
                    <td className="px-4 py-3"><input type="checkbox" checked={selectedRowIds.includes(clinic.id)} onChange={(event) => toggleSelected(clinic.id, event.target.checked)} className="h-4 w-4 rounded border-neutral-300 accent-primary" /></td>
                    {tableColumns.map((column) => visibleColumns[column.key] ? <td key={column.key} className="px-4 py-3 whitespace-nowrap">{renderCell(clinic, column.key)}</td> : null)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {renderPagination()}
        </div>
        ) : null}
        {viewMode === "grid" ? renderPagination() : null}
        </>
      )}
    </div>
  );
}
