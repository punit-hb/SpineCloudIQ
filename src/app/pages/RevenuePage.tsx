import { type ComponentType, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowUpDown,
  BarChart3,
  Calendar,
  Check,
  DollarSign,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  MoreVertical,
  Printer,
  RefreshCw,
  Search,
  SlidersHorizontal,
  TrendingUp,
  X,
} from "lucide-react";
import { CardFooter, CardHeader, CardMetaRow, CardStatusPill, EnterpriseAvatar, EntityCard, OutlinePill, ViewModeSwitcher } from "../components/hb/listing";
import { Checkbox } from "../components/ui/checkbox";

interface RevenueRecord {
  id: number;
  month: string;
  totalRevenue: string;
  subscriptions: number;
  newRevenue: string;
  churnRevenue: string;
  netGrowth: string;
  growthRate: string;
  rawRevenue: number;
  rawGrowth: number;
}

type ViewMode = "grid" | "list" | "table";
type FilterField = "Revenue Range" | "Net Growth Range";

interface FilterDraft {
  fields: FilterField[];
  revenueRange: { min: string; max: string };
  growthRange: { min: string; max: string };
}

interface ColumnConfig {
  key: keyof Pick<
    RevenueRecord,
    "month" | "totalRevenue" | "subscriptions" | "newRevenue" | "churnRevenue" | "netGrowth" | "growthRate"
  >;
  label: string;
  align?: "left" | "right";
}

const revenueData: RevenueRecord[] = [
  { id: 1, month: "February 2026", totalRevenue: "$87,450", subscriptions: 1247, newRevenue: "$12,350", churnRevenue: "$2,100", netGrowth: "$10,250", growthRate: "+8.3%", rawRevenue: 87450, rawGrowth: 10250 },
  { id: 2, month: "January 2026", totalRevenue: "$80,000", subscriptions: 1202, newRevenue: "$11,200", churnRevenue: "$2,450", netGrowth: "$8,750", growthRate: "+7.8%", rawRevenue: 80000, rawGrowth: 8750 },
  { id: 3, month: "December 2025", totalRevenue: "$75,000", subscriptions: 1178, newRevenue: "$10,800", churnRevenue: "$2,200", netGrowth: "$8,600", growthRate: "+6.9%", rawRevenue: 75000, rawGrowth: 8600 },
  { id: 4, month: "November 2025", totalRevenue: "$72,000", subscriptions: 1156, newRevenue: "$9,600", churnRevenue: "$1,900", netGrowth: "$7,700", growthRate: "+5.8%", rawRevenue: 72000, rawGrowth: 7700 },
  { id: 5, month: "October 2025", totalRevenue: "$68,000", subscriptions: 1134, newRevenue: "$8,900", churnRevenue: "$2,300", netGrowth: "$6,600", growthRate: "+4.2%", rawRevenue: 68000, rawGrowth: 6600 },
  { id: 6, month: "September 2025", totalRevenue: "$65,000", subscriptions: 1112, newRevenue: "$8,200", churnRevenue: "$2,100", netGrowth: "$6,100", growthRate: "+3.8%", rawRevenue: 65000, rawGrowth: 6100 },
];

const ITEMS_PER_PAGE = 10;
const filterFields: FilterField[] = ["Revenue Range", "Net Growth Range"];

const tableColumns: ColumnConfig[] = [
  { key: "month", label: "Month" },
  { key: "totalRevenue", label: "Total Revenue", align: "right" },
  { key: "subscriptions", label: "Subscriptions", align: "right" },
  { key: "newRevenue", label: "New Revenue", align: "right" },
  { key: "churnRevenue", label: "Churn Revenue", align: "right" },
  { key: "netGrowth", label: "Net Growth", align: "right" },
  { key: "growthRate", label: "Growth Rate" },
];

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

function GrowthBadge({ value }: { value: string }) {
  return <CardStatusPill tone="green">{value}</CardStatusPill>;
}

function RevenuePill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "positive" | "negative" }) {
  const className =
    tone === "positive"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-400"
      : tone === "negative"
        ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-400"
        : "border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300";

  return <OutlinePill className={className}>{children}</OutlinePill>;
}

function FilterPanel({
  isOpen,
  onClose,
  revenueRange,
  growthRange,
  onApply,
  onClear,
}: {
  isOpen: boolean;
  onClose: () => void;
  revenueRange: { min: string; max: string };
  growthRange: { min: string; max: string };
  onApply: (draft: FilterDraft) => void;
  onClear: () => void;
}) {
  const [draft, setDraft] = useState<FilterDraft>({
    fields: ["Revenue Range", "Net Growth Range"],
    revenueRange,
    growthRange,
  });
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setDraft({ fields: ["Revenue Range", "Net Growth Range"], revenueRange, growthRange });
  }, [growthRange, isOpen, revenueRange]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const addFilter = () => {
    const next = filterFields.find((field) => !draft.fields.includes(field));
    if (next) {
      setDraft((prev) => ({ ...prev, fields: [...prev.fields, next] }));
    }
  };

  const removeFilter = (field: FilterField) => {
    setDraft((prev) => ({
      ...prev,
      fields: prev.fields.filter((item) => item !== field),
      revenueRange: field === "Revenue Range" ? { min: "", max: "" } : prev.revenueRange,
      growthRange: field === "Net Growth Range" ? { min: "", max: "" } : prev.growthRange,
    }));
  };

  const renderRangeInputs = (field: FilterField) => {
    const range = field === "Revenue Range" ? draft.revenueRange : draft.growthRange;
    const updateRange = (next: { min: string; max: string }) => {
      if (field === "Revenue Range") {
        setDraft((prev) => ({ ...prev, revenueRange: next }));
      } else {
        setDraft((prev) => ({ ...prev, growthRange: next }));
      }
    };

    return (
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          placeholder="Min"
          value={range.min}
          onChange={(event) => updateRange({ ...range, min: event.target.value })}
          className="h-8 min-w-0 rounded-lg border border-neutral-200 bg-white px-2 text-xs text-neutral-900 outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
        />
        <input
          type="number"
          placeholder="Max"
          value={range.max}
          onChange={(event) => updateRange({ ...range, max: event.target.value })}
          className="h-8 min-w-0 rounded-lg border border-neutral-200 bg-white px-2 text-xs text-neutral-900 outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
        />
      </div>
    );
  };

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full z-50 mt-2 w-[480px] rounded-lg border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-950"
    >
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Filter By</h3>
        <button
          type="button"
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-white"
          aria-label="Close filters"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-[500px] overflow-y-auto p-4">
        <div className="space-y-2">
          {draft.fields.map((field, index) => (
            <div key={field} className="flex items-start gap-2">
              <div className="w-[40%]">
                {index === 0 && <label className="mb-1 block text-xs text-neutral-500 dark:text-neutral-400">Where</label>}
                <div
                  className={`flex h-8 items-center rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white ${
                    index === 0 ? "" : "mt-[17px]"
                  }`}
                >
                  {field}
                </div>
              </div>
              <div className="flex-1">
                {index === 0 && <label className="mb-1 block text-xs text-neutral-500 dark:text-neutral-400">What</label>}
                <div className={index === 0 ? "" : "mt-[17px]"}>{renderRangeInputs(field)}</div>
              </div>
              <button
                type="button"
                title="Remove filter"
                onClick={() => removeFilter(field)}
                className="mt-[17px] flex h-6 w-6 shrink-0 items-center justify-center rounded text-neutral-400 transition-colors hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addFilter}
          disabled={draft.fields.length === filterFields.length}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-sm text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:text-neutral-400"
        >
          <Filter className="h-4 w-4" />
          Add Filter
        </button>
      </div>

      <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/50">
        <button
          type="button"
          onClick={() => {
            onClear();
            onClose();
          }}
          className="h-8 rounded-lg px-3 text-xs text-neutral-600 transition-colors hover:bg-white hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
        >
          Clear All
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-8 rounded-lg px-3 text-xs text-neutral-600 transition-colors hover:bg-white hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            className="h-8 rounded-lg bg-primary px-4 text-xs font-medium text-white transition-colors hover:bg-primary/90"
          >
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
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-950"
    >
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
          <label
            key={column.key}
            className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
              visibleColumns[column.key]
                ? "bg-primary/5 text-primary"
                : "text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900"
            }`}
          >
            <span className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={visibleColumns[column.key]}
                onChange={() => onToggleColumn(column.key)}
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-neutral-300 transition-colors checked:border-primary checked:bg-primary dark:border-neutral-700"
              />
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

export default function RevenuePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [revenueRange, setRevenueRange] = useState({ min: "", max: "" });
  const [growthRange, setGrowthRange] = useState({ min: "", max: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [showSummary, setShowSummary] = useState(true);
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    Object.fromEntries(tableColumns.map((column) => [column.key, true]))
  );
  const [sortField, setSortField] = useState<ColumnConfig["key"]>("month");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const columnsRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewMode !== "table") {
      setShowColumns(false);
    }
  }, [viewMode]);

  useEffect(() => {
    if (!showMoreMenu) return;
    const handleClick = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showMoreMenu]);

  const filteredData = useMemo(() => {
    return revenueData.filter((item) => {
      const matchesSearch = item.month.toLowerCase().includes(searchQuery.toLowerCase());
      let matchesRevenue = true;
      let matchesGrowth = true;
      if (revenueRange.min) matchesRevenue = matchesRevenue && item.rawRevenue >= parseFloat(revenueRange.min);
      if (revenueRange.max) matchesRevenue = matchesRevenue && item.rawRevenue <= parseFloat(revenueRange.max);
      if (growthRange.min) matchesGrowth = matchesGrowth && item.rawGrowth >= parseFloat(growthRange.min);
      if (growthRange.max) matchesGrowth = matchesGrowth && item.rawGrowth <= parseFloat(growthRange.max);
      return matchesSearch && matchesRevenue && matchesGrowth;
    });
  }, [growthRange.max, growthRange.min, revenueRange.max, revenueRange.min, searchQuery]);

  const sortedData = useMemo(() => {
    const getSortValue = (item: RevenueRecord, field: ColumnConfig["key"]) => {
      if (field === "totalRevenue") return item.rawRevenue;
      if (field === "netGrowth") return item.rawGrowth;
      if (["newRevenue", "churnRevenue", "growthRate"].includes(field)) {
        return Number(String(item[field]).replace(/[$,%+]/g, ""));
      }
      if (field === "month") return new Date(item.month).getTime();
      return item[field];
    };

    return [...filteredData].sort((first, second) => {
      const firstValue = getSortValue(first, sortField);
      const secondValue = getSortValue(second, sortField);
      const result =
        typeof firstValue === "number" && typeof secondValue === "number"
          ? firstValue - secondValue
          : String(firstValue).localeCompare(String(secondValue), undefined, { numeric: true, sensitivity: "base" });
      return sortDirection === "asc" ? result : -result;
    });
  }, [filteredData, sortDirection, sortField]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / ITEMS_PER_PAGE));
  const currentData = sortedData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const activeFilterCount =
    (revenueRange.min || revenueRange.max ? 1 : 0) +
    (growthRange.min || growthRange.max ? 1 : 0);

  const clearFilters = () => {
    setRevenueRange({ min: "", max: "" });
    setGrowthRange({ min: "", max: "" });
    setCurrentPage(1);
  };

  const applyFilters = (draft: FilterDraft) => {
    setRevenueRange(draft.fields.includes("Revenue Range") ? draft.revenueRange : { min: "", max: "" });
    setGrowthRange(draft.fields.includes("Net Growth Range") ? draft.growthRange : { min: "", max: "" });
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedRowIds(checked ? currentData.map((item) => item.id) : []);
  };

  const handleSelectRow = (id: number, checked: boolean) => {
    setSelectedRowIds((prev) => (checked ? [...prev, id] : prev.filter((item) => item !== id)));
  };

  const handleExportExcel = () => alert(`Exporting ${filteredData.length} revenue records to Excel.`);
  const handleExportPdf = () => alert(`Exporting ${filteredData.length} revenue records to PDF.`);

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSort = (field: ColumnConfig["key"]) => {
    setCurrentPage(1);
    if (sortField === field) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
      return;
    }
    setSortField(field);
    setSortDirection("asc");
  };

  const getSortIcon = (field: ColumnConfig["key"]) => (
    <ArrowUpDown className={`h-3.5 w-3.5 ${sortField === field ? "text-primary" : "text-neutral-400"}`} />
  );

  const visibleColumnCount = tableColumns.filter((column) => visibleColumns[column.key]).length;

  const ytd = "$1,049,400";
  const mrr = "$87,450";
  const arpu = "$256";
  const avgChurn = "2.3%";

  const emptyState = (
    <div className="rounded-lg border border-neutral-200 bg-white p-20 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
        <AlertCircle className="h-6 w-6 text-neutral-400" />
      </div>
      <h3 className="text-sm font-medium text-neutral-900 dark:text-white">No revenue records found</h3>
      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Adjust your search or filter parameters.</p>
    </div>
  );

  const renderPagination = () => {
    if (filteredData.length === 0) return null;
    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const end = Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length);

    return (
      <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-4 text-sm dark:border-neutral-800">
        <div className="text-neutral-600 dark:text-neutral-400">
          Showing {start}-{end} of {filteredData.length}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage <= 1}
            className="h-8 rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-600 transition-colors hover:bg-neutral-50 disabled:opacity-40 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`h-8 w-8 rounded-lg border text-sm transition-colors ${
                page === currentPage
                  ? "border-primary bg-primary text-white"
                  : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage >= totalPages}
            className="h-8 rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-600 transition-colors hover:bg-neutral-50 disabled:opacity-40 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-transparent text-[14px] dark:bg-neutral-950">
      <div className="max-w-full">
        <div className="mb-6">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="mb-2 text-2xl font-semibold leading-8 text-neutral-900 dark:text-white">
                Revenue Analytics
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Track monthly recurring revenue, net growth, and churn metrics across all subscription tiers.
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
                      placeholder="Search by month..."
                      value={searchQuery}
                      onChange={(event) => {
                        setSearchQuery(event.target.value);
                        setCurrentPage(1);
                      }}
                      className="min-w-0 flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowFilters(true)}
                      className="relative rounded p-1 text-neutral-600 transition-colors hover:text-primary dark:text-neutral-400"
                      title="Filter By"
                    >
                      <Filter className="h-4 w-4" />
                      {activeFilterCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
                          {activeFilterCount}
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchExpanded(false)}
                      className="rounded p-1 text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                      title="Close search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <FilterPanel
                  isOpen={showFilters}
                  onClose={() => setShowFilters(false)}
                  revenueRange={revenueRange}
                  growthRange={growthRange}
                  onApply={applyFilters}
                  onClear={clearFilters}
                />
              </div>

              {viewMode === "table" && (
                <div className="relative" ref={columnsRef}>
                  <HeaderIconButton
                    icon={SlidersHorizontal}
                    title="Customize Columns"
                    onClick={() => setShowColumns((prev) => !prev)}
                    active={showColumns}
                  />
                  <ColumnPanel
                    isOpen={showColumns}
                    onClose={() => setShowColumns(false)}
                    columns={tableColumns}
                    visibleColumns={visibleColumns}
                    onToggleColumn={toggleColumn}
                  />
                </div>
              )}

              <ViewModeSwitcher value={viewMode} onChange={(mode) => { setViewMode(mode); setCurrentPage(1); }} />

              <button
                type="button"
                onClick={handleExportExcel}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-primary bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary/90"
              >
                <Download className="h-4 w-4" />
                Export Report
              </button>

              <HeaderIconButton icon={BarChart3} title="Summary" onClick={() => setShowSummary((prev) => !prev)} active={showSummary} />
              <HeaderIconButton icon={RefreshCw} title="Refresh" onClick={() => setCurrentPage(1)} />

              <div className="relative" ref={moreRef}>
                <HeaderIconButton icon={MoreVertical} title="More options" onClick={() => setShowMoreMenu((prev) => !prev)} active={showMoreMenu} />
                {showMoreMenu && (
                  <div className="absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
                    <button
                      type="button"
                      onClick={() => {
                        alert("Import revenue records is not available for this mock listing.");
                        setShowMoreMenu(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-neutral-700 transition-colors hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900"
                    >
                      <Download className="h-3.5 w-3.5 rotate-180" />
                      Import
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleExportExcel();
                        setShowMoreMenu(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-neutral-700 transition-colors hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5" />
                      Export Excel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleExportPdf();
                        setShowMoreMenu(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-neutral-700 transition-colors hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Export PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        window.print();
                        setShowMoreMenu(false);
                      }}
                      className="flex w-full items-center gap-2 border-t border-neutral-200 px-3 py-2 text-left text-xs text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Print
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {showSummary && (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total Revenue (YTD)", value: ytd, helper: "All time" },
              { label: "Monthly Recurring Revenue", value: mrr, helper: "+8.3% vs last month" },
              { label: "Avg. Revenue Per User", value: arpu, helper: "Per clinic" },
              { label: "Churn Rate", value: avgChurn, helper: "Last 30 days" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                <p className="mb-1 text-xs text-neutral-500 dark:text-neutral-400">{item.label}</p>
                <div className="flex items-end justify-between gap-3">
                  <p className="text-2xl font-semibold text-neutral-900 dark:text-white">{item.value}</p>
                  <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                    {item.helper}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === "grid" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {currentData.length > 0
              ? currentData.map((item) => {
                  const selected = selectedRowIds.includes(item.id);
                  return (
                    <EntityCard key={item.id} selected={selected}>
                      <CardHeader avatar={<EnterpriseAvatar icon={TrendingUp} className="text-primary" />} title={item.month} subtitle={`${item.subscriptions.toLocaleString()} subscriptions`} selected={selected} onSelect={(checked) => handleSelectRow(item.id, checked)} />
                      <div className="flex-1 space-y-2 text-sm">
                        <CardMetaRow icon={DollarSign}>{item.totalRevenue}</CardMetaRow>
                        <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 shrink-0 text-neutral-500" /><RevenuePill tone="positive">{item.newRevenue}</RevenuePill></div>
                        <div className="flex items-center gap-2"><DollarSign className="h-4 w-4 shrink-0 text-neutral-500" /><RevenuePill tone="negative">{item.churnRevenue}</RevenuePill></div>
                        <CardMetaRow icon={Calendar}>Net {item.netGrowth}</CardMetaRow>
                      </div>
                      <CardFooter><GrowthBadge value={item.growthRate} /></CardFooter>
                    </EntityCard>
                  );
                })
              : <div className="md:col-span-2 xl:col-span-4">{emptyState}</div>}
          </div>
        )}

        {viewMode === "list" && (
          <div className="space-y-3">
            {currentData.length > 0
              ? currentData.map((item) => {
                  const selected = selectedRowIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`rounded-lg border bg-white p-4 shadow-sm transition-colors hover:bg-neutral-50 dark:bg-neutral-950 dark:hover:bg-neutral-900/50 ${
                        selected ? "border-primary/50" : "border-neutral-200 dark:border-neutral-800"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 flex-1 items-center gap-4">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={(event) => handleSelectRow(item.id, event.target.checked)}
                            className="h-4 w-4 cursor-pointer rounded border-neutral-300 accent-primary"
                            title="Select"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                              <span className="font-medium text-neutral-900 dark:text-white">{item.month}</span>
                              <GrowthBadge value={item.growthRate} />
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                              <span>{item.subscriptions.toLocaleString()} subscriptions</span>
                              <span>Total {item.totalRevenue}</span>
                              <span>New {item.newRevenue}</span>
                              <span>Churn {item.churnRevenue}</span>
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-semibold text-neutral-900 dark:text-white">{item.netGrowth}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">Net growth</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              : emptyState}
          </div>
        )}

        {viewMode === "table" && (
          <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
            <div className="max-h-[calc(100vh-320px)] overflow-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
                    <th className="sticky top-0 z-10 w-12 border-b border-neutral-200 bg-neutral-50 px-4 py-3.5 dark:border-neutral-800 dark:bg-neutral-900">
                      <Checkbox
                        checked={currentData.length > 0 && currentData.every((item) => selectedRowIds.includes(item.id))}
                        onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                        aria-label="Select all revenue records"
                      />
                    </th>
                    {tableColumns.map((column) =>
                      visibleColumns[column.key] ? (
                        <th
                          key={column.key}
                          className={`sticky top-0 z-10 border-b border-neutral-200 bg-neutral-50 px-6 py-3.5 text-sm font-semibold tracking-normal text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 ${
                            column.align === "right" ? "text-right" : ""
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleSort(column.key)}
                            className={`whitespace-nowrap ${column.align === "right" ? "ml-auto" : ""}`}
                            aria-label={`Sort by ${column.label}`}
                          >
                            {column.label}
                            {getSortIcon(column.key)}
                          </button>
                        </th>
                      ) : null
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {currentData.length > 0 ? (
                    currentData.map((item) => {
                      const selected = selectedRowIds.includes(item.id);
                      return (
                        <tr
                          key={item.id}
                          className={`transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/50 ${selected ? "bg-primary/5" : ""}`}
                        >
                          <td className="w-12 px-4 py-3.5">
                            <Checkbox
                              checked={selected}
                              onCheckedChange={(checked) => handleSelectRow(item.id, Boolean(checked))}
                              aria-label={`Select revenue record ${item.month}`}
                            />
                          </td>
                          {visibleColumns.month && (
                            <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-white">{item.month}</td>
                          )}
                          {visibleColumns.totalRevenue && (
                            <td className="px-6 py-4 text-right text-sm font-semibold text-neutral-900 dark:text-white">{item.totalRevenue}</td>
                          )}
                          {visibleColumns.subscriptions && (
                            <td className="px-6 py-4 text-right text-sm text-neutral-600 dark:text-neutral-400">{item.subscriptions.toLocaleString()}</td>
                          )}
                          {visibleColumns.newRevenue && (
                            <td className="px-6 py-4 text-right">
                              <RevenuePill tone="positive">{item.newRevenue}</RevenuePill>
                            </td>
                          )}
                          {visibleColumns.churnRevenue && (
                            <td className="px-6 py-4 text-right">
                              <RevenuePill tone="negative">{item.churnRevenue}</RevenuePill>
                            </td>
                          )}
                          {visibleColumns.netGrowth && (
                            <td className="px-6 py-4 text-right text-sm font-semibold text-neutral-900 dark:text-white">{item.netGrowth}</td>
                          )}
                          {visibleColumns.growthRate && (
                            <td className="px-6 py-4">
                              <GrowthBadge value={item.growthRate} />
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={visibleColumnCount + 1} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                            <Search className="h-6 w-6 text-neutral-400" />
                          </div>
                          <h3 className="text-sm font-medium text-neutral-900 dark:text-white">No revenue records found</h3>
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
          <span className="rounded border border-primary/25 bg-primary/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary">
            {selectedRowIds.length} Selected
          </span>
          <div className="h-4 w-px bg-neutral-800" />
          <button
            type="button"
            onClick={handleExportExcel}
            className="flex h-8 items-center gap-1.5 rounded-md border border-neutral-700 bg-neutral-800 px-3 text-xs text-white hover:bg-neutral-700"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-primary" />
            Export Selected
          </button>
          <button type="button" onClick={() => setSelectedRowIds([])} className="h-8 px-2 text-xs text-neutral-400 hover:text-white">
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
