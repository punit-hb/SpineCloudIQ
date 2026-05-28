import { type ComponentType, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowUpDown,
  BarChart3,
  Building2,
  Calendar,
  Check,
  CreditCard,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  MoreVertical,
  Printer,
  Receipt,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { CardFooter, CardHeader, CardMetaRow, CardStatusPill, EnterpriseAvatar, EntityCard, PlainMetaLabel, ViewModeSwitcher } from "../components/hb/listing";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";

interface Transaction {
  id: string;
  invoiceNumber: string;
  clinicName: string;
  planName: string;
  amount: number;
  paymentMethod: string;
  transactionDate: string;
  billingPeriod: string;
  status: "Success" | "Failed" | "Pending" | "Refunded";
}

type ViewMode = "grid" | "list" | "table";
type FilterField = "Status" | "Date Range" | "Amount Range";

interface FilterDraft {
  fields: FilterField[];
  status: string;
  dateRange: { start: string; end: string };
  amountRange: { min: string; max: string };
}

interface ColumnConfig {
  key: keyof Pick<
    Transaction,
    "invoiceNumber" | "clinicName" | "planName" | "amount" | "paymentMethod" | "transactionDate" | "status"
  >;
  label: string;
  align?: "left" | "right";
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001234",
    clinicName: "City Spine Clinic",
    planName: "Professional",
    amount: 149,
    paymentMethod: "Visa ****1234",
    transactionDate: "2024-01-15",
    billingPeriod: "Jan 15 - Feb 15, 2024",
    status: "Success",
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-001235",
    clinicName: "Wellness Spine Center",
    planName: "Enterprise",
    amount: 499,
    paymentMethod: "Mastercard ****5678",
    transactionDate: "2024-02-01",
    billingPeriod: "Feb 01 - Mar 01, 2024",
    status: "Success",
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-001236",
    clinicName: "Quick Care Spine",
    planName: "Basic",
    amount: 49,
    paymentMethod: "Visa ****9012",
    transactionDate: "2024-06-10",
    billingPeriod: "Jun 10 - Jul 10, 2024",
    status: "Failed",
  },
  {
    id: "4",
    invoiceNumber: "INV-2024-001237",
    clinicName: "Metro Chiropractic",
    planName: "Professional",
    amount: 149,
    paymentMethod: "Amex ****3456",
    transactionDate: "2024-05-20",
    billingPeriod: "May 20 - Jun 20, 2024",
    status: "Pending",
  },
  {
    id: "5",
    invoiceNumber: "INV-2024-001238",
    clinicName: "Prime Health Spine",
    planName: "Enterprise",
    amount: 4990,
    paymentMethod: "Visa ****7890",
    transactionDate: "2024-03-10",
    billingPeriod: "Mar 10, 2024 - Mar 10, 2025",
    status: "Success",
  },
  {
    id: "6",
    invoiceNumber: "INV-2024-001239",
    clinicName: "Coastal Chiropractic",
    planName: "Professional",
    amount: 149,
    paymentMethod: "Mastercard ****2345",
    transactionDate: "2024-04-05",
    billingPeriod: "Apr 05 - May 05, 2024",
    status: "Refunded",
  },
];

const ITEMS_PER_PAGE = 10;

const tableColumns: ColumnConfig[] = [
  { key: "invoiceNumber", label: "Invoice Number" },
  { key: "clinicName", label: "Clinic Name" },
  { key: "planName", label: "Plan Type" },
  { key: "amount", label: "Amount", align: "right" },
  { key: "paymentMethod", label: "Payment Method" },
  { key: "transactionDate", label: "Transaction Date" },
  { key: "status", label: "Status" },
];

const allFilterFields: FilterField[] = ["Status", "Date Range", "Amount Range"];

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const currency = (value: number) => `$${value.toLocaleString()}`;

function StatusBadge({ status }: { status: Transaction["status"] }) {
  const tone = status === "Success" ? "green" : status === "Failed" ? "red" : status === "Pending" ? "amber" : "blue";
  return <CardStatusPill tone={tone}>{status}</CardStatusPill>;
}

function PlanBadge({ planName }: { planName: string }) {
  return <PlainMetaLabel>{planName}</PlainMetaLabel>;
}

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
        active
          ? "border-primary/50 text-primary dark:text-primary"
          : "border-neutral-200 dark:border-neutral-800"
      }`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

function FilterPanel({
  isOpen,
  onClose,
  statusFilter,
  dateRange,
  amountRange,
  onApply,
  onClear,
}: {
  isOpen: boolean;
  onClose: () => void;
  statusFilter: string;
  dateRange: { start: string; end: string };
  amountRange: { min: string; max: string };
  onApply: (draft: FilterDraft) => void;
  onClear: () => void;
}) {
  const [draft, setDraft] = useState<FilterDraft>({
    fields: ["Status", "Date Range", "Amount Range"],
    status: statusFilter,
    dateRange,
    amountRange,
  });
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setDraft({
      fields: ["Status", "Date Range", "Amount Range"],
      status: statusFilter,
      dateRange,
      amountRange,
    });
  }, [amountRange, dateRange, isOpen, statusFilter]);

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
    const next = allFilterFields.find((field) => !draft.fields.includes(field));
    if (next) {
      setDraft((prev) => ({ ...prev, fields: [...prev.fields, next] }));
    }
  };

  const removeFilter = (field: FilterField) => {
    setDraft((prev) => ({
      ...prev,
      fields: prev.fields.filter((item) => item !== field),
      status: field === "Status" ? "all" : prev.status,
      dateRange: field === "Date Range" ? { start: "", end: "" } : prev.dateRange,
      amountRange: field === "Amount Range" ? { min: "", max: "" } : prev.amountRange,
    }));
  };

  const renderWhat = (field: FilterField) => {
    if (field === "Status") {
      return (
        <select
          value={draft.status}
          onChange={(event) => setDraft((prev) => ({ ...prev, status: event.target.value }))}
          className="h-8 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none transition-colors focus:border-primary dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
        >
          <option value="all">All Statuses</option>
          <option value="Success">Success</option>
          <option value="Failed">Failed</option>
          <option value="Pending">Pending</option>
          <option value="Refunded">Refunded</option>
        </select>
      );
    }

    if (field === "Date Range") {
      return (
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={draft.dateRange.start}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                dateRange: { ...prev.dateRange, start: event.target.value },
              }))
            }
            className="h-8 min-w-0 rounded-lg border border-neutral-200 bg-white px-2 text-xs text-neutral-900 outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
          />
          <input
            type="date"
            value={draft.dateRange.end}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                dateRange: { ...prev.dateRange, end: event.target.value },
              }))
            }
            className="h-8 min-w-0 rounded-lg border border-neutral-200 bg-white px-2 text-xs text-neutral-900 outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          placeholder="Min"
          value={draft.amountRange.min}
          onChange={(event) =>
            setDraft((prev) => ({
              ...prev,
              amountRange: { ...prev.amountRange, min: event.target.value },
            }))
          }
          className="h-8 min-w-0 rounded-lg border border-neutral-200 bg-white px-2 text-xs text-neutral-900 outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-950 dark:text-white"
        />
        <input
          type="number"
          placeholder="Max"
          value={draft.amountRange.max}
          onChange={(event) =>
            setDraft((prev) => ({
              ...prev,
              amountRange: { ...prev.amountRange, max: event.target.value },
            }))
          }
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
                <div className={index === 0 ? "" : "mt-[17px]"}>{renderWhat(field)}</div>
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
          disabled={draft.fields.length === allFilterFields.length}
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

export default function TransactionsPage() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [amountRange, setAmountRange] = useState({ min: "", max: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [showSummary, setShowSummary] = useState(true);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    Object.fromEntries(tableColumns.map((column) => [column.key, true]))
  );
  const [sortField, setSortField] = useState<ColumnConfig["key"]>("transactionDate");
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

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        transaction.invoiceNumber.toLowerCase().includes(searchLower) ||
        transaction.clinicName.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;

      let matchesDate = true;
      if (dateRange.start) {
        matchesDate = matchesDate && new Date(transaction.transactionDate) >= new Date(dateRange.start);
      }
      if (dateRange.end) {
        matchesDate = matchesDate && new Date(transaction.transactionDate) <= new Date(dateRange.end);
      }

      let matchesAmount = true;
      if (amountRange.min) {
        matchesAmount = matchesAmount && transaction.amount >= Number(amountRange.min);
      }
      if (amountRange.max) {
        matchesAmount = matchesAmount && transaction.amount <= Number(amountRange.max);
      }

      return matchesSearch && matchesStatus && matchesDate && matchesAmount;
    });
  }, [amountRange.max, amountRange.min, dateRange.end, dateRange.start, searchQuery, statusFilter, transactions]);

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((first, second) => {
      const firstValue = first[sortField];
      const secondValue = second[sortField];
      const result =
        typeof firstValue === "number" && typeof secondValue === "number"
          ? firstValue - secondValue
          : String(firstValue).localeCompare(String(secondValue), undefined, { numeric: true, sensitivity: "base" });
      return sortDirection === "asc" ? result : -result;
    });
  }, [filteredTransactions, sortDirection, sortField]);

  const totalPages = Math.max(1, Math.ceil(sortedTransactions.length / ITEMS_PER_PAGE));
  const currentData = sortedTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const activeFilterCount =
    (statusFilter !== "all" ? 1 : 0) +
    (dateRange.start || dateRange.end ? 1 : 0) +
    (amountRange.min || amountRange.max ? 1 : 0);

  const totalAmount = transactions.reduce((acc, transaction) => {
    return transaction.status === "Success" ? acc + transaction.amount : acc;
  }, 0);
  const successCount = transactions.filter((transaction) => transaction.status === "Success").length;
  const pendingCount = transactions.filter((transaction) => transaction.status === "Pending").length;
  const failedCount = transactions.filter((transaction) => transaction.status === "Failed").length;

  const clearFilters = () => {
    setStatusFilter("all");
    setDateRange({ start: "", end: "" });
    setAmountRange({ min: "", max: "" });
    setCurrentPage(1);
  };

  const applyFilters = (draft: FilterDraft) => {
    setStatusFilter(draft.fields.includes("Status") ? draft.status : "all");
    setDateRange(draft.fields.includes("Date Range") ? draft.dateRange : { start: "", end: "" });
    setAmountRange(draft.fields.includes("Amount Range") ? draft.amountRange : { min: "", max: "" });
    setCurrentPage(1);
  };

  const handleExportExcel = () => {
    alert(`Success: Exported ${filteredTransactions.length} transactions as Excel.`);
  };

  const handleExportPdf = () => {
    alert(`Success: Exported ${filteredTransactions.length} transactions as PDF.`);
  };

  const handleSelectAllRows = (checked: boolean) => {
    if (checked) {
      setSelectedRowIds(currentData.map((transaction) => transaction.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleSelectRow = (transactionId: string, checked: boolean) => {
    if (checked) {
      setSelectedRowIds((prev) => [...prev, transactionId]);
    } else {
      setSelectedRowIds((prev) => prev.filter((id) => id !== transactionId));
    }
  };

  const handleBulkDownload = () => {
    alert(`Downloading invoices for the ${selectedRowIds.length} selected transactions...`);
    setSelectedRowIds([]);
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDrawerOpen(true);
    setActiveMenuRowId(null);
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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

  const renderActions = (transaction: Transaction) => (
    <div className="relative inline-block text-left" onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        onClick={() => setActiveMenuRowId(activeMenuRowId === transaction.id ? null : transaction.id)}
        className="flex h-7 w-7 items-center justify-center rounded text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
        title="Actions"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {activeMenuRowId === transaction.id && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setActiveMenuRowId(null)} />
          <div className="absolute right-0 top-full z-40 mt-1 w-48 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
            <button
              type="button"
              onClick={() => handleViewDetails(transaction)}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900"
            >
              <Eye className="h-4 w-4" />
              View Receipt
            </button>
            <button
              type="button"
              onClick={() => {
                alert(`Downloading PDF for invoice ${transaction.invoiceNumber}`);
                setActiveMenuRowId(null);
              }}
              className="flex w-full items-center gap-2 border-t border-neutral-200 px-4 py-2.5 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderPagination = () => {
    if (filteredTransactions.length === 0) return null;
    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const end = Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length);

    return (
      <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-4 text-sm dark:border-neutral-800">
        <div className="text-neutral-600 dark:text-neutral-400">
          Showing {start}-{end} of {filteredTransactions.length}
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

  const emptyState = (
    <div className="rounded-lg border border-neutral-200 bg-white p-20 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
        <AlertCircle className="h-6 w-6 text-neutral-400" />
      </div>
      <h3 className="text-sm font-medium text-neutral-900 dark:text-white">No transactions found</h3>
      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
        Adjust your search terms, status filters, or amount limits to find invoices.
      </p>
    </div>
  );

  return (
    <div className="bg-transparent text-[14px] dark:bg-neutral-950">
      <div className="max-w-full">
        <div className="mb-6">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="mb-2 text-2xl font-semibold leading-8 text-neutral-900 dark:text-white">
                Transactions Log
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Review detailed financial records, download subscription invoices, and trace payment history.
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
                      placeholder="Search by invoice number or clinic name..."
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
                  statusFilter={statusFilter}
                  dateRange={dateRange}
                  amountRange={amountRange}
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

              <Button
                onClick={handleBulkDownload}
                disabled={selectedRowIds.length === 0}
                className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-white shadow-none hover:bg-primary/90 disabled:opacity-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Invoices
              </Button>

              <HeaderIconButton icon={BarChart3} title="Summary" onClick={() => setShowSummary((prev) => !prev)} active={showSummary} />
              <HeaderIconButton icon={RefreshCw} title="Refresh" onClick={() => setCurrentPage(1)} />

              <div className="relative" ref={moreRef}>
                <HeaderIconButton icon={MoreVertical} title="More options" onClick={() => setShowMoreMenu((prev) => !prev)} active={showMoreMenu} />
                {showMoreMenu && (
                  <div className="absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
                    <button
                      type="button"
                      onClick={() => {
                        alert("Import transactions is not available for this mock listing.");
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
              { label: "Total Revenue", value: currency(totalAmount), helper: "SaaS ARR" },
              { label: "Success Payments", value: successCount.toString(), helper: `${Math.round((successCount / (transactions.length || 1)) * 100)}% success` },
              { label: "Pending Traces", value: pendingCount.toString(), helper: "Awaiting settlement" },
              { label: "Failed Traces", value: failedCount.toString(), helper: "Retrying" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
              >
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
              ? currentData.map((transaction) => {
                  const selected = selectedRowIds.includes(transaction.id);
                  return (
                    <EntityCard key={transaction.id} selected={selected} onClick={() => handleViewDetails(transaction)}>
                      <CardHeader avatar={<EnterpriseAvatar icon={Receipt} className="text-primary" />} title={transaction.invoiceNumber} subtitle={transaction.clinicName} selected={selected} onSelect={(checked) => handleSelectRow(transaction.id, checked)} actions={renderActions(transaction)} />
                      <div className="flex-1 space-y-2 text-sm">
                        <CardMetaRow icon={Building2}>{transaction.clinicName}</CardMetaRow>
                        <div className="flex items-center gap-2"><CreditCard className="h-4 w-4 shrink-0 text-neutral-500" /><PlanBadge planName={transaction.planName} /></div>
                        <CardMetaRow icon={Calendar}>{formatDate(transaction.transactionDate)}</CardMetaRow>
                        <CardMetaRow icon={CreditCard}>{transaction.paymentMethod}</CardMetaRow>
                      </div>
                      <CardFooter className="justify-between">
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">{currency(transaction.amount)}</span>
                        <StatusBadge status={transaction.status} />
                      </CardFooter>
                    </EntityCard>
                  );
                })
              : <div className="md:col-span-2 xl:col-span-4">{emptyState}</div>}
          </div>
        )}

        {viewMode === "list" && (
          <div className="space-y-3">
            {currentData.length > 0
              ? currentData.map((transaction) => {
                  const selected = selectedRowIds.includes(transaction.id);
                  return (
                    <div
                      key={transaction.id}
                      onClick={() => handleViewDetails(transaction)}
                      className={`cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-colors hover:bg-neutral-50 dark:bg-neutral-950 dark:hover:bg-neutral-900/50 ${
                        selected ? "border-primary/50" : "border-neutral-200 dark:border-neutral-800"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 flex-1 items-center gap-4">
                          <div onClick={(event) => event.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={(event) => handleSelectRow(transaction.id, event.target.checked)}
                              className="h-4 w-4 cursor-pointer rounded border-neutral-300 accent-primary"
                              title="Select"
                            />
                          </div>
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-primary dark:bg-neutral-900">
                            <Receipt className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                              <span className="font-medium text-primary">{transaction.invoiceNumber}</span>
                              <StatusBadge status={transaction.status} />
                              <span className="text-xs text-neutral-400">/</span>
                              <span className="text-xs font-mono text-neutral-500">{transaction.id.padStart(4, "0")}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                              <span className="font-medium text-neutral-900 dark:text-white">{transaction.clinicName}</span>
                              <span>{transaction.planName}</span>
                              <span>{transaction.paymentMethod}</span>
                              <span>{formatDate(transaction.transactionDate)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-4" onClick={(event) => event.stopPropagation()}>
                          <span className="text-sm font-semibold text-neutral-900 dark:text-white">{currency(transaction.amount)}</span>
                          {renderActions(transaction)}
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
                        checked={currentData.length > 0 && currentData.every((transaction) => selectedRowIds.includes(transaction.id))}
                        onCheckedChange={(checked) => handleSelectAllRows(Boolean(checked))}
                        aria-label="Select all transactions"
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
                    <th className="sticky top-0 z-10 border-b border-neutral-200 bg-neutral-50 px-6 py-3.5 text-right text-sm font-semibold tracking-normal text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {currentData.length > 0 ? (
                    currentData.map((transaction) => {
                      const selected = selectedRowIds.includes(transaction.id);
                      return (
                        <tr
                          key={transaction.id}
                          onClick={() => handleViewDetails(transaction)}
                          className={`cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/50 ${
                            selected ? "bg-primary/5" : ""
                          }`}
                        >
                          <td className="w-12 px-4 py-3.5" onClick={(event) => event.stopPropagation()}>
                            <Checkbox
                              checked={selected}
                              onCheckedChange={(checked) => handleSelectRow(transaction.id, Boolean(checked))}
                              aria-label={`Select transaction ${transaction.invoiceNumber}`}
                            />
                          </td>
                          {visibleColumns.invoiceNumber && (
                            <td className="px-6 py-4 text-sm font-medium text-primary underline decoration-primary/30 underline-offset-4">
                              {transaction.invoiceNumber}
                            </td>
                          )}
                          {visibleColumns.clinicName && (
                            <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-white">
                              {transaction.clinicName}
                            </td>
                          )}
                          {visibleColumns.planName && (
                            <td className="px-6 py-4">
                              <PlanBadge planName={transaction.planName} />
                            </td>
                          )}
                          {visibleColumns.amount && (
                            <td className="px-6 py-4 text-right text-sm font-semibold text-neutral-900 dark:text-white">
                              {currency(transaction.amount)}
                            </td>
                          )}
                          {visibleColumns.paymentMethod && (
                            <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                              {transaction.paymentMethod}
                            </td>
                          )}
                          {visibleColumns.transactionDate && (
                            <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                              {formatDate(transaction.transactionDate)}
                            </td>
                          )}
                          {visibleColumns.status && (
                            <td className="px-6 py-4">
                              <StatusBadge status={transaction.status} />
                            </td>
                          )}
                          <td className="px-6 py-4 text-right">{renderActions(transaction)}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={visibleColumnCount + 2} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                            <Search className="h-6 w-6 text-neutral-400" />
                          </div>
                          <h3 className="text-sm font-medium text-neutral-900 dark:text-white">No transactions found</h3>
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
          <Button
            onClick={handleBulkDownload}
            className="h-8 rounded-md border border-neutral-700 bg-neutral-800 px-3 text-xs text-white hover:bg-neutral-700"
          >
            <Download className="mr-1.5 h-3.5 w-3.5 text-primary" />
            Download Invoices
          </Button>
          <Button variant="ghost" onClick={() => setSelectedRowIds([])} className="h-8 px-2 text-xs text-neutral-400 hover:text-white">
            Clear
          </Button>
        </div>
      )}

      {isDrawerOpen && selectedTransaction && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setIsDrawerOpen(false)} />
          <div className="fixed right-0 top-0 z-50 flex h-full w-[500px] max-w-[calc(100vw-24px)] flex-col border-l border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950">
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5 dark:border-neutral-800">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Invoice Details</h2>
                <p className="mt-1 font-mono text-sm text-primary">{selectedTransaction.invoiceNumber}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                aria-label="Close drawer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              <div className="space-y-4 rounded-lg border border-neutral-200 bg-neutral-50/50 p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Transaction Status
                  </span>
                  <StatusBadge status={selectedTransaction.status} />
                </div>
                <div className="h-px bg-neutral-200 dark:bg-neutral-800" />
                <div className="grid grid-cols-2 gap-x-2 gap-y-4 text-sm">
                  {[
                    ["Clinic Name", selectedTransaction.clinicName],
                    ["Billing Template", `${selectedTransaction.planName} Plan`],
                    ["Billing Period", selectedTransaction.billingPeriod],
                    ["Payment Method", selectedTransaction.paymentMethod],
                    ["Transaction Date", selectedTransaction.transactionDate],
                    ["Invoice Amount", currency(selectedTransaction.amount)],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <span className="mb-0.5 block text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">
                        {label}
                      </span>
                      <span className="font-semibold text-neutral-900 dark:text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h4 className="mb-1 text-sm font-semibold text-neutral-900 dark:text-white">Invoice Documentation</h4>
                  <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                    This receipt represents a valid transaction settlement for clinic server infrastructure hosting services.
                    Download the PDF invoice for accounting compliance.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-neutral-200 bg-neutral-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900/50">
              <Button variant="outline" onClick={() => setIsDrawerOpen(false)} className="h-10 rounded-lg">
                Close
              </Button>
              <Button
                onClick={() => {
                  alert(`Downloading PDF for ${selectedTransaction.invoiceNumber}`);
                  setIsDrawerOpen(false);
                }}
                className="h-10 rounded-lg bg-primary text-white shadow-none hover:bg-primary/90"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
