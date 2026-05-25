import { type ComponentType, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BarChart3,
  Building2,
  Check,
  Columns3,
  Download,
  Filter,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

interface Subscription {
  id: string;
  clinicName: string;
  ownerEmail: string;
  planName: string;
  billingCycle: "Monthly" | "Yearly";
  subscriptionStatus: "Active" | "Inactive";
  paymentStatus: "Paid" | "Failed" | "Grace Period";
  startDate: string;
  expirationDate: string;
  autoRenew: boolean;
  providersUsed: number;
  providersAllowed: number;
  branchesUsed: number;
  branchesAllowed: number;
  patientsCount: number;
  lastPaymentDate: string;
  mrrValue: number;
}

type SortField = keyof Subscription;
type SortOrder = "asc" | "desc" | null;
type ColumnKey =
  | "clinicName"
  | "ownerEmail"
  | "planName"
  | "billingCycle"
  | "subscriptionStatus"
  | "paymentStatus"
  | "startDate"
  | "expirationDate"
  | "autoRenew"
  | "providers"
  | "branches"
  | "patientsCount"
  | "lastPaymentDate"
  | "mrrValue";

const ITEMS_PER_PAGE = 10;

const mockSubscriptions: Subscription[] = [
  { id: "sub_001", clinicName: "SpineWorks Clinic", ownerEmail: "dr.smith@spineworks.com", planName: "Professional", billingCycle: "Monthly", subscriptionStatus: "Active", paymentStatus: "Paid", startDate: "2024-01-15", expirationDate: "2025-01-15", autoRenew: true, providersUsed: 8, providersAllowed: 10, branchesUsed: 2, branchesAllowed: 3, patientsCount: 450, lastPaymentDate: "2024-12-15", mrrValue: 299 },
  { id: "sub_002", clinicName: "HealthFirst Chiropractic", ownerEmail: "admin@healthfirst.com", planName: "Enterprise", billingCycle: "Yearly", subscriptionStatus: "Active", paymentStatus: "Paid", startDate: "2023-06-01", expirationDate: "2025-06-01", autoRenew: true, providersUsed: 25, providersAllowed: 50, branchesUsed: 5, branchesAllowed: 10, patientsCount: 1250, lastPaymentDate: "2024-06-01", mrrValue: 999 },
  { id: "sub_004", clinicName: "Peak Performance Therapy", ownerEmail: "info@peaktherapy.com", planName: "Professional", billingCycle: "Monthly", subscriptionStatus: "Inactive", paymentStatus: "Paid", startDate: "2024-03-10", expirationDate: "2025-03-10", autoRenew: false, providersUsed: 7, providersAllowed: 10, branchesUsed: 2, branchesAllowed: 3, patientsCount: 380, lastPaymentDate: "2025-02-10", mrrValue: 299 },
  { id: "sub_005", clinicName: "Wellness Spine Clinic", ownerEmail: "admin@wellnessspine.com", planName: "Basic", billingCycle: "Monthly", subscriptionStatus: "Inactive", paymentStatus: "Failed", startDate: "2024-08-20", expirationDate: "2025-02-20", autoRenew: true, providersUsed: 4, providersAllowed: 5, branchesUsed: 1, branchesAllowed: 1, patientsCount: 145, lastPaymentDate: "2025-01-20", mrrValue: 99 },
  { id: "sub_006", clinicName: "Advanced Spine Solutions", ownerEmail: "dr.johnson@advancedspine.com", planName: "Enterprise", billingCycle: "Yearly", subscriptionStatus: "Active", paymentStatus: "Paid", startDate: "2023-11-01", expirationDate: "2025-11-01", autoRenew: true, providersUsed: 35, providersAllowed: 50, branchesUsed: 8, branchesAllowed: 10, patientsCount: 2100, lastPaymentDate: "2024-11-01", mrrValue: 999 },
  { id: "sub_007", clinicName: "City Wellness Center", ownerEmail: "contact@citywellness.com", planName: "Professional", billingCycle: "Monthly", subscriptionStatus: "Active", paymentStatus: "Paid", startDate: "2024-05-15", expirationDate: "2025-05-15", autoRenew: true, providersUsed: 10, providersAllowed: 10, branchesUsed: 3, branchesAllowed: 3, patientsCount: 520, lastPaymentDate: "2025-01-15", mrrValue: 299 },
  { id: "sub_008", clinicName: "Coastal Spine Institute", ownerEmail: "admin@coastalspine.com", planName: "Enterprise", billingCycle: "Yearly", subscriptionStatus: "Active", paymentStatus: "Paid", startDate: "2023-09-01", expirationDate: "2025-09-01", autoRenew: true, providersUsed: 40, providersAllowed: 50, branchesUsed: 7, branchesAllowed: 10, patientsCount: 1890, lastPaymentDate: "2024-09-01", mrrValue: 999 },
  { id: "sub_010", clinicName: "Premier Spine Care", ownerEmail: "contact@premierspine.com", planName: "Professional", billingCycle: "Yearly", subscriptionStatus: "Active", paymentStatus: "Paid", startDate: "2024-04-01", expirationDate: "2025-04-01", autoRenew: true, providersUsed: 9, providersAllowed: 10, branchesUsed: 2, branchesAllowed: 3, patientsCount: 680, lastPaymentDate: "2024-04-01", mrrValue: 249 },
  { id: "sub_011", clinicName: "Harmony Health Center", ownerEmail: "admin@harmonyhealth.com", planName: "Basic", billingCycle: "Monthly", subscriptionStatus: "Inactive", paymentStatus: "Failed", startDate: "2024-10-01", expirationDate: "2025-01-20", autoRenew: false, providersUsed: 3, providersAllowed: 5, branchesUsed: 1, branchesAllowed: 1, patientsCount: 120, lastPaymentDate: "2024-12-01", mrrValue: 99 },
  { id: "sub_012", clinicName: "Valley Spine Wellness", ownerEmail: "info@valleyspine.com", planName: "Professional", billingCycle: "Monthly", subscriptionStatus: "Inactive", paymentStatus: "Paid", startDate: "2024-03-25", expirationDate: "2025-03-25", autoRenew: false, providersUsed: 6, providersAllowed: 10, branchesUsed: 2, branchesAllowed: 3, patientsCount: 340, lastPaymentDate: "2025-02-25", mrrValue: 299 },
];

const tableColumns: Array<{ key: ColumnKey; label: string; sort?: SortField }> = [
  { key: "clinicName", label: "Clinic Name", sort: "clinicName" },
  { key: "ownerEmail", label: "Owner Email", sort: "ownerEmail" },
  { key: "planName", label: "Plan", sort: "planName" },
  { key: "billingCycle", label: "Billing Cycle", sort: "billingCycle" },
  { key: "subscriptionStatus", label: "Sub Status", sort: "subscriptionStatus" },
  { key: "paymentStatus", label: "Payment", sort: "paymentStatus" },
  { key: "startDate", label: "Start Date", sort: "startDate" },
  { key: "expirationDate", label: "Expiration", sort: "expirationDate" },
  { key: "autoRenew", label: "Auto Renew", sort: "autoRenew" },
  { key: "providers", label: "Providers" },
  { key: "branches", label: "Branches" },
  { key: "patientsCount", label: "Patients", sort: "patientsCount" },
  { key: "lastPaymentDate", label: "Last Payment", sort: "lastPaymentDate" },
  { key: "mrrValue", label: "MRR", sort: "mrrValue" },
];

const formatDate = (value: string) => new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
const currency = (value: number) => `$${value.toLocaleString()}`;

function HeaderIconButton({ title, icon: Icon, active, badge, onClick }: { title: string; icon: ComponentType<{ className?: string }>; active?: boolean; badge?: number; onClick?: () => void }) {
  return (
    <button type="button" title={title} aria-label={title} onClick={onClick} className={`relative inline-flex h-10 w-10 items-center justify-center rounded-lg border text-neutral-600 transition-colors hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900 ${active ? "border-primary bg-primary/10 text-primary" : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"}`}>
      <Icon className="h-4 w-4" />
      {badge ? <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">{badge}</span> : null}
    </button>
  );
}

function DotBadge({ value }: { value: string }) {
  const color = value === "Active" || value === "Paid" || value === "Yes" ? "bg-emerald-500" : value === "Grace Period" ? "bg-amber-500" : "bg-red-500";
  return (
    <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2 text-xs font-medium text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
      <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
      {value}
    </span>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  return <span className="inline-flex h-6 items-center rounded-full border border-primary/20 bg-primary/5 px-2 text-xs font-medium text-primary">{plan}</span>;
}

function ClinicMark({ name }: { name: string }) {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-xs font-semibold text-primary">
      {name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
    </div>
  );
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
  drafts: { plan: string; subscription: string; payment: string; billing: string };
  setDrafts: (drafts: { plan: string; subscription: string; payment: string; billing: string }) => void;
  onClear: () => void;
  onCancel: () => void;
  onApply: () => void;
}) {
  const fields = ["plan", "subscription", "payment", "billing"];
  const labels: Record<string, string> = { plan: "Plan", subscription: "Subscription Status", payment: "Payment Status", billing: "Billing Cycle" };
  const options: Record<string, string[]> = {
    plan: ["Basic", "Professional", "Enterprise"],
    subscription: ["Active", "Inactive"],
    payment: ["Paid", "Failed", "Grace Period"],
    billing: ["Monthly", "Yearly"],
  };
  const remaining = fields.filter((field) => !draftRows.includes(field));
  return (
    <div className="absolute right-0 top-12 z-50 w-[640px] overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-950">
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

export default function SubscriptionReportPage() {
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
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("");
  const [filterBillingCycle, setFilterBillingCycle] = useState("");
  const [draftRows, setDraftRows] = useState<string[]>([]);
  const [drafts, setDrafts] = useState({ plan: "Professional", subscription: "Active", payment: "Paid", billing: "Monthly" });
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>({
    clinicName: true,
    ownerEmail: true,
    planName: true,
    billingCycle: true,
    subscriptionStatus: true,
    paymentStatus: true,
    startDate: true,
    expirationDate: true,
    autoRenew: true,
    providers: true,
    branches: true,
    patientsCount: true,
    lastPaymentDate: true,
    mrrValue: true,
  });

  const filteredAndSortedData = useMemo(() => {
    return mockSubscriptions
      .filter((sub) => {
        const search = searchQuery.trim().toLowerCase();
        const matchesSearch = !search || sub.clinicName.toLowerCase().includes(search) || sub.ownerEmail.toLowerCase().includes(search) || sub.planName.toLowerCase().includes(search) || sub.subscriptionStatus.toLowerCase().includes(search);
        const matchesPlan = !filterPlan || sub.planName === filterPlan;
        const matchesStatus = !filterStatus || sub.subscriptionStatus === filterStatus;
        const matchesPaymentStatus = !filterPaymentStatus || sub.paymentStatus === filterPaymentStatus;
        const matchesBillingCycle = !filterBillingCycle || sub.billingCycle === filterBillingCycle;
        return matchesSearch && matchesPlan && matchesStatus && matchesPaymentStatus && matchesBillingCycle;
      })
      .sort((a, b) => {
        if (!sortField || !sortOrder) return 0;
        const aValue = a[sortField];
        const bValue = b[sortField];
        if (typeof aValue === "string" && typeof bValue === "string") return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        if (typeof aValue === "number" && typeof bValue === "number") return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        if (typeof aValue === "boolean" && typeof bValue === "boolean") return sortOrder === "asc" ? Number(bValue) - Number(aValue) : Number(aValue) - Number(bValue);
        return 0;
      });
  }, [filterBillingCycle, filterPaymentStatus, filterPlan, filterStatus, searchQuery, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE));
  const currentData = filteredAndSortedData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const activeFilterCount = (filterPlan ? 1 : 0) + (filterStatus ? 1 : 0) + (filterPaymentStatus ? 1 : 0) + (filterBillingCycle ? 1 : 0);
  const selectedOnPage = currentData.length > 0 && currentData.every((item) => selectedRowIds.includes(item.id));
  const visibleColumnCount = Object.values(visibleColumns).filter(Boolean).length;
  const activeSubscriptions = mockSubscriptions.filter((item) => item.subscriptionStatus === "Active").length;
  const failedPayments = mockSubscriptions.filter((item) => item.paymentStatus === "Failed").length;
  const totalMrr = mockSubscriptions.reduce((sum, item) => sum + item.mrrValue, 0);

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
    if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400" />;
    if (sortOrder === "asc") return <ArrowUp className="h-3.5 w-3.5 text-primary" />;
    return <ArrowDown className="h-3.5 w-3.5 text-primary" />;
  };

  const openFilters = () => {
    const rows = [];
    if (filterPlan) rows.push("plan");
    if (filterStatus) rows.push("subscription");
    if (filterPaymentStatus) rows.push("payment");
    if (filterBillingCycle) rows.push("billing");
    setDraftRows(rows);
    setDrafts({
      plan: filterPlan || "Professional",
      subscription: filterStatus || "Active",
      payment: filterPaymentStatus || "Paid",
      billing: filterBillingCycle || "Monthly",
    });
    setShowFilterPanel(true);
  };

  const applyFilters = () => {
    setFilterPlan(draftRows.includes("plan") ? drafts.plan : "");
    setFilterStatus(draftRows.includes("subscription") ? drafts.subscription : "");
    setFilterPaymentStatus(draftRows.includes("payment") ? drafts.payment : "");
    setFilterBillingCycle(draftRows.includes("billing") ? drafts.billing : "");
    setCurrentPage(1);
    setShowFilterPanel(false);
  };

  const clearFilters = () => {
    setDraftRows([]);
    setFilterPlan("");
    setFilterStatus("");
    setFilterPaymentStatus("");
    setFilterBillingCycle("");
    setCurrentPage(1);
  };

  const handleExport = () => console.log("Exporting subscription data as excel for current view");

  const toggleColumn = (key: ColumnKey) => {
    setVisibleColumns((current) => {
      if (current[key] && Object.values(current).filter(Boolean).length === 1) return current;
      return { ...current, [key]: !current[key] };
    });
  };

  const toggleSelected = (id: string, checked: boolean) => {
    setSelectedRowIds((current) => (checked ? Array.from(new Set([...current, id])) : current.filter((item) => item !== id)));
  };

  const renderCell = (subscription: Subscription, key: ColumnKey) => {
    if (key === "clinicName") {
      return (
        <div className="flex items-center gap-3">
          <ClinicMark name={subscription.clinicName} />
          <span className="text-sm font-semibold text-neutral-950 dark:text-white">{subscription.clinicName}</span>
        </div>
      );
    }
    if (key === "ownerEmail") return <span className="text-sm text-neutral-600 dark:text-neutral-400">{subscription.ownerEmail}</span>;
    if (key === "planName") return <PlanBadge plan={subscription.planName} />;
    if (key === "billingCycle") return <span className="text-sm text-neutral-600 dark:text-neutral-400">{subscription.billingCycle}</span>;
    if (key === "subscriptionStatus") return <DotBadge value={subscription.subscriptionStatus} />;
    if (key === "paymentStatus") return <DotBadge value={subscription.paymentStatus} />;
    if (key === "startDate") return <span className="text-sm text-neutral-600 dark:text-neutral-400">{formatDate(subscription.startDate)}</span>;
    if (key === "expirationDate") return <span className="text-sm text-neutral-600 dark:text-neutral-400">{formatDate(subscription.expirationDate)}</span>;
    if (key === "autoRenew") return <DotBadge value={subscription.autoRenew ? "Yes" : "No"} />;
    if (key === "providers") return <span className="text-sm text-neutral-600 dark:text-neutral-400">{subscription.providersUsed} / {subscription.providersAllowed}</span>;
    if (key === "branches") return <span className="text-sm text-neutral-600 dark:text-neutral-400">{subscription.branchesUsed} / {subscription.branchesAllowed}</span>;
    if (key === "patientsCount") return <span className="text-sm font-medium">{subscription.patientsCount.toLocaleString()}</span>;
    if (key === "lastPaymentDate") return <span className="text-sm text-neutral-600 dark:text-neutral-400">{formatDate(subscription.lastPaymentDate)}</span>;
    return <span className="text-sm font-semibold">{currency(subscription.mrrValue)}</span>;
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
          <div className="mb-1 text-xs font-medium text-neutral-500">Reports <span className="mx-1 text-neutral-300">/</span> Subscription Report</div>
          <h1 className="text-2xl font-semibold leading-8 tracking-normal text-neutral-950 dark:text-white">Subscription Report</h1>
          <p className="mt-1 max-w-2xl text-sm leading-5 text-neutral-500 dark:text-neutral-400">Comprehensive view of subscription statuses, utilization, renewals, and recurring revenue.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
          {isSearchOpen ? (
            <div className="relative flex h-10 min-w-[360px] items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950">
              <Search className="h-4 w-4 shrink-0" />
              <input autoFocus value={searchQuery} onChange={(event) => { setSearchQuery(event.target.value); setCurrentPage(1); }} placeholder="Search by clinic name, owner, plan, or status..." className="h-full flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white" />
              <button type="button" title="Filter By" onClick={openFilters} className="relative rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900"><Filter className="h-4 w-4" />{activeFilterCount ? <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">{activeFilterCount}</span> : null}</button>
              <button type="button" title="Close Search" onClick={() => setIsSearchOpen(false)} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900"><X className="h-4 w-4" /></button>
              {showFilterPanel ? <FilterPanel draftRows={draftRows} setDraftRows={setDraftRows} drafts={drafts} setDrafts={setDrafts} onClear={clearFilters} onCancel={() => setShowFilterPanel(false)} onApply={applyFilters} /> : null}
            </div>
          ) : (
            <HeaderIconButton title="Search" icon={Search} active={Boolean(searchQuery)} onClick={() => setIsSearchOpen(true)} />
          )}
          <div className="relative">
            <HeaderIconButton title="Customized columns" icon={Columns3} active={showColumnPanel || visibleColumnCount < tableColumns.length} onClick={() => setShowColumnPanel((value) => !value)} />
            {showColumnPanel ? <ColumnPanel visibleColumns={visibleColumns} onToggle={toggleColumn} onClose={() => setShowColumnPanel(false)} /> : null}
          </div>
          <button type="button" onClick={handleExport} className="inline-flex h-10 items-center gap-2 rounded-lg border border-primary bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90"><Download className="h-4 w-4" />Export Report</button>
          <HeaderIconButton title="Summary" icon={BarChart3} active={showSummary} onClick={() => setShowSummary((value) => !value)} />
          <HeaderIconButton title="Refresh" icon={RefreshCw} onClick={() => console.log("Subscription report refreshed")} />
        </div>
      </div>

      {showSummary ? (
        <div className="mb-5 grid gap-4 md:grid-cols-4">
          {[
            { label: "Subscriptions", value: mockSubscriptions.length, icon: Building2 },
            { label: "Active", value: activeSubscriptions, icon: Check },
            { label: "Failed Payments", value: failedPayments, icon: X },
            { label: "MRR", value: currency(totalMrr), icon: BarChart3 },
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
        <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-950"><Building2 className="mx-auto h-10 w-10 text-neutral-400" /><h3 className="mt-3 text-sm font-semibold">No subscriptions found</h3><p className="mt-1 text-sm text-neutral-500">Adjust search or filters to find matching subscription records.</p></div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left">
              <thead className="bg-neutral-50 dark:bg-neutral-900">
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <th className="w-12 px-4 py-3"><input type="checkbox" checked={selectedOnPage} onChange={(event) => setSelectedRowIds(event.target.checked ? Array.from(new Set([...selectedRowIds, ...currentData.map((item) => item.id)])) : selectedRowIds.filter((id) => !currentData.map((item) => item.id).includes(id)))} className="h-4 w-4 rounded border-neutral-300 accent-primary" /></th>
                  {tableColumns.map((column) => visibleColumns[column.key] ? (
                    <th key={column.key} className="px-4 py-3 text-xs font-semibold uppercase text-neutral-500">
                      {column.sort ? <button type="button" onClick={() => handleSort(column.sort!)} className="inline-flex items-center gap-1.5 whitespace-nowrap">{column.label}{getSortIcon(column.sort)}</button> : column.label}
                    </th>
                  ) : null)}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {currentData.map((subscription) => (
                  <tr key={subscription.id} className={`h-14 hover:bg-neutral-50 dark:hover:bg-neutral-900 ${selectedRowIds.includes(subscription.id) ? "bg-primary/5" : ""}`}>
                    <td className="px-4 py-3"><input type="checkbox" checked={selectedRowIds.includes(subscription.id)} onChange={(event) => toggleSelected(subscription.id, event.target.checked)} className="h-4 w-4 rounded border-neutral-300 accent-primary" /></td>
                    {tableColumns.map((column) => visibleColumns[column.key] ? <td key={column.key} className="px-4 py-3 whitespace-nowrap">{renderCell(subscription, column.key)}</td> : null)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {renderPagination()}
        </div>
      )}

    </div>
  );
}
