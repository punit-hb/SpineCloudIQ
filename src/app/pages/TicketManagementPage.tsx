import { type ComponentType, useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowUpDown, BarChart3, Check, CheckCircle, Columns3, Download, Edit, Filter, Mail, MoreVertical, Plus, Printer, RefreshCw, Search, Send, Upload, X } from "lucide-react";

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High" | "Critical";
  clinicName: string;
  clinicAdmin: string;
  clinicAdminEmail: string;
  category: string;
  createdAt: string;
  lastUpdated: string;
  hasReplied: boolean;
  replyContent?: string;
}

type ViewMode = "table";
type ColumnKey = "id" | "subject" | "clinicName" | "priority" | "status" | "lastUpdated";

const ITEMS_PER_PAGE = 10;

const mockTickets: Ticket[] = [
  { id: "TKT001", subject: "Unable to access patient records", description: "We are experiencing issues accessing patient records in the system. Multiple staff members are affected and this is impacting our daily operations. The error message says 'Connection timeout' when trying to load patient data.", status: "Open", priority: "Critical", clinicName: "HealthCare Plus Clinic", clinicAdmin: "Dr. Sarah Johnson", clinicAdminEmail: "sarah.johnson@healthcareplus.com", category: "Technical Issue", createdAt: "2024-02-20", lastUpdated: "2024-02-20", hasReplied: false },
  { id: "TKT002", subject: "Billing discrepancy in monthly invoice", description: "Our latest invoice shows charges that don't match our subscription plan. We were billed for 50 users but only have 35 active users in our system.", status: "In Progress", priority: "High", clinicName: "City Medical Center", clinicAdmin: "Michael Chen", clinicAdminEmail: "michael.chen@citymedical.com", category: "Billing", createdAt: "2024-02-19", lastUpdated: "2024-02-20", hasReplied: true, replyContent: "We are currently investigating the discrepancy with our billing provider." },
  { id: "TKT003", subject: "Request for additional user licenses", description: "We need to add 10 more user licenses to our current plan. Please provide pricing information and guidance on how to upgrade.", status: "Open", priority: "Medium", clinicName: "Wellness Spine Center", clinicAdmin: "Dr. Emily Rodriguez", clinicAdminEmail: "emily.rodriguez@wellnessspine.com", category: "Account", createdAt: "2024-02-19", lastUpdated: "2024-02-19", hasReplied: false },
  { id: "TKT004", subject: "Login issues after password reset", description: "Two of our staff members cannot log in after resetting their passwords. They receive an 'Invalid credentials' error even with the new passwords.", status: "Open", priority: "High", clinicName: "Advanced Chiropractic", clinicAdmin: "Dr. James Wilson", clinicAdminEmail: "james.wilson@advancedchiro.com", category: "Technical Issue", createdAt: "2024-02-18", lastUpdated: "2024-02-18", hasReplied: false },
  { id: "TKT005", subject: "Feature request: Export patient data", description: "We would like to request a feature to export patient data in CSV format for our internal reporting purposes.", status: "Resolved", priority: "Low", clinicName: "Premier Spine Institute", clinicAdmin: "Dr. Lisa Martinez", clinicAdminEmail: "lisa.martinez@premierspine.com", category: "Feature Request", createdAt: "2024-02-15", lastUpdated: "2024-02-18", hasReplied: true, replyContent: "This feature has now been deployed." },
  { id: "TKT006", subject: "System performance very slow", description: "The system has been running extremely slow for the past week. Page load times are significantly longer and it's affecting our productivity.", status: "In Progress", priority: "High", clinicName: "Coastal Health Clinic", clinicAdmin: "Dr. Robert Taylor", clinicAdminEmail: "robert.taylor@coastalhealth.com", category: "Technical Issue", createdAt: "2024-02-17", lastUpdated: "2024-02-19", hasReplied: true, replyContent: "Our engineers are optimizing the database load to address this." },
  { id: "TKT007", subject: "Question about data backup procedures", description: "Can you provide information about how frequently our data is backed up and what the disaster recovery process looks like?", status: "Closed", priority: "Low", clinicName: "Harmony Wellness Center", clinicAdmin: "Dr. Amanda Foster", clinicAdminEmail: "amanda.foster@harmonywellness.com", category: "General Inquiry", createdAt: "2024-02-10", lastUpdated: "2024-02-12", hasReplied: true, replyContent: "Data is backed up every 24 hours to multiple geographic regions." },
  { id: "TKT008", subject: "Cannot upload medical images", description: "We're unable to upload X-ray and MRI images to patient files. The upload fails with an error message.", status: "Open", priority: "Critical", clinicName: "Spinal Care Associates", clinicAdmin: "Dr. David Kim", clinicAdminEmail: "david.kim@spinalcare.com", category: "Technical Issue", createdAt: "2024-02-20", lastUpdated: "2024-02-20", hasReplied: false },
];

const tableColumns: Array<{ key: ColumnKey; label: string }> = [
  { key: "id", label: "Ticket ID" },
  { key: "subject", label: "Subject" },
  { key: "clinicName", label: "Clinic" },
  { key: "priority", label: "Priority" },
  { key: "status", label: "Status" },
  { key: "lastUpdated", label: "Last Updated" },
];

const formatDate = (value: string) => new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

function HeaderIconButton({ title, icon: Icon, active, badge, onClick }: { title: string; icon: ComponentType<{ className?: string }>; active?: boolean; badge?: number; onClick?: () => void }) {
  return <button type="button" title={title} aria-label={title} onClick={onClick} className={`relative inline-flex h-10 w-10 items-center justify-center rounded-lg border text-neutral-600 transition-colors hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900 ${active ? "border-primary bg-primary/10 text-primary" : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"}`}><Icon className="h-4 w-4" />{badge ? <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">{badge}</span> : null}</button>;
}

function TicketMark({ priority }: { priority: Ticket["priority"] }) {
  const color = priority === "Critical" ? "text-red-600 border-red-200 bg-red-50" : "text-primary border-primary/20 bg-primary/10";
  return <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${color}`}><Mail className="h-4 w-4" /></div>;
}

function DotBadge({ value, kind }: { value: string; kind: "status" | "priority" }) {
  const dot = kind === "priority"
    ? { Low: "bg-neutral-400", Medium: "bg-blue-500", High: "bg-orange-500", Critical: "bg-red-500" }[value] || "bg-neutral-400"
    : { Open: "bg-blue-500", "In Progress": "bg-amber-500", Resolved: "bg-emerald-500", Closed: "bg-neutral-400" }[value] || "bg-neutral-400";
  return <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2 text-xs font-medium text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"><span className={`h-1.5 w-1.5 rounded-full ${dot}`} />{value}</span>;
}

function ColumnPanel({ visibleColumns, onToggle, onClose }: { visibleColumns: Record<ColumnKey, boolean>; onToggle: (key: ColumnKey) => void; onClose: () => void }) {
  const activeCount = Object.values(visibleColumns).filter(Boolean).length;
  return <><div className="fixed inset-0 z-30" onClick={onClose} /><div className="absolute right-0 top-12 z-40 w-64 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-950"><div className="flex h-11 items-center justify-between border-b border-neutral-100 px-4 dark:border-neutral-800"><h3 className="text-sm font-semibold">Columns</h3><button type="button" onClick={onClose} className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"><X className="h-4 w-4" /></button></div><div className="p-2">{tableColumns.map((column) => <button key={column.key} type="button" onClick={() => onToggle(column.key)} className="flex h-9 w-full items-center gap-3 rounded-md px-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900"><span className={`flex h-4 w-4 items-center justify-center rounded border ${visibleColumns[column.key] ? "border-primary bg-primary text-white" : "border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-950"}`}>{visibleColumns[column.key] ? <Check className="h-3 w-3" /> : null}</span>{column.label}</button>)}</div><div className="border-t border-neutral-100 px-4 py-3 text-xs font-medium text-neutral-500 dark:border-neutral-800">{activeCount} of {tableColumns.length} active</div></div></>;
}

function FilterPanel({ draftRows, setDraftRows, drafts, setDrafts, onClear, onCancel, onApply }: { draftRows: string[]; setDraftRows: (rows: string[]) => void; drafts: { status: string; priority: string; start: string; end: string }; setDrafts: (drafts: { status: string; priority: string; start: string; end: string }) => void; onClear: () => void; onCancel: () => void; onApply: () => void }) {
  const fields = ["status", "priority", "created"];
  const labels: Record<string, string> = { status: "Ticket Status", priority: "Priority Level", created: "Created Date" };
  const remaining = fields.filter((field) => !draftRows.includes(field));
  const selectClass = "h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-950";
  const renderWhat = (row: string) => {
    if (row === "status") return <select value={drafts.status} onChange={(e) => setDrafts({ ...drafts, status: e.target.value })} className={selectClass}>{["Open", "In Progress", "Resolved", "Closed"].map((v) => <option key={v} value={v}>{v}</option>)}</select>;
    if (row === "priority") return <select value={drafts.priority} onChange={(e) => setDrafts({ ...drafts, priority: e.target.value })} className={selectClass}>{["Low", "Medium", "High", "Critical"].map((v) => <option key={v} value={v}>{v}</option>)}</select>;
    return <div className="grid grid-cols-2 gap-2"><input type="date" value={drafts.start} onChange={(e) => setDrafts({ ...drafts, start: e.target.value })} className={selectClass} /><input type="date" value={drafts.end} onChange={(e) => setDrafts({ ...drafts, end: e.target.value })} className={selectClass} /></div>;
  };
  return <div className="absolute right-0 top-12 z-50 w-[580px] overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-950"><div className="flex h-12 items-center justify-between border-b border-neutral-100 px-4 dark:border-neutral-800"><h2 className="text-sm font-semibold">Filter By</h2><button type="button" onClick={onCancel} className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"><X className="h-4 w-4" /></button></div><div className="space-y-3 p-4"><div className="grid grid-cols-[170px_1fr_32px] gap-2 px-1 text-xs font-semibold uppercase text-neutral-500"><span>Where</span><span>What</span><span /></div>{draftRows.length === 0 ? <div className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50 px-3 py-6 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">No filters selected.</div> : null}{draftRows.map((row) => <div key={row} className="grid grid-cols-[170px_1fr_32px] items-center gap-2"><div className="flex h-10 items-center rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm font-medium dark:border-neutral-800 dark:bg-neutral-900">{labels[row]}</div>{renderWhat(row)}<button type="button" onClick={() => setDraftRows(draftRows.filter((item) => item !== row))} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"><X className="h-4 w-4" /></button></div>)}<button type="button" disabled={remaining.length === 0} onClick={() => setDraftRows([...draftRows, remaining[0]])} className="inline-flex h-9 items-center gap-2 rounded-lg px-2 text-sm font-medium text-primary hover:bg-primary/10 disabled:opacity-40"><Plus className="h-4 w-4" />Add Filter</button></div><div className="flex h-14 items-center justify-end gap-2 border-t border-neutral-100 px-4 dark:border-neutral-800"><button type="button" onClick={onClear} className="h-9 rounded-lg px-3 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900">Clear All</button><button type="button" onClick={onCancel} className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium dark:border-neutral-800 dark:bg-neutral-950">Cancel</button><button type="button" onClick={onApply} className="h-9 rounded-lg border border-primary bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90">Apply</button></div></div>;
}

export default function TicketManagementPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [viewMode] = useState<ViewMode>("table");
  const [showSummary, setShowSummary] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showColumnPanel, setShowColumnPanel] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState({ start: "", end: "" });
  const [draftRows, setDraftRows] = useState<string[]>([]);
  const [drafts, setDrafts] = useState({ status: "Open", priority: "High", start: "", end: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reply, setReply] = useState("");
  const [editedStatus, setEditedStatus] = useState("");
  const [editedPriority, setEditedPriority] = useState("");
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>({ id: true, subject: true, clinicName: true, priority: true, status: true, lastUpdated: true });
  const [sortField, setSortField] = useState<ColumnKey>("lastUpdated");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => { if (viewMode !== "table") setShowColumnPanel(false); }, [viewMode]);

  const filteredTickets = useMemo(() => tickets.filter((ticket) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch = !query || ticket.subject.toLowerCase().includes(query) || ticket.clinicName.toLowerCase().includes(query) || ticket.id.toLowerCase().includes(query);
    const matchesStatus = !statusFilter || ticket.status === statusFilter;
    const matchesPriority = !priorityFilter || ticket.priority === priorityFilter;
    const matchesStart = !dateRangeFilter.start || new Date(ticket.createdAt) >= new Date(dateRangeFilter.start);
    const matchesEnd = !dateRangeFilter.end || new Date(ticket.createdAt) <= new Date(dateRangeFilter.end);
    return matchesSearch && matchesStatus && matchesPriority && matchesStart && matchesEnd;
  }), [dateRangeFilter.end, dateRangeFilter.start, priorityFilter, searchTerm, statusFilter, tickets]);

  const sortedTickets = useMemo(() => [...filteredTickets].sort((first, second) => {
    const result = String(first[sortField]).localeCompare(String(second[sortField]), undefined, { numeric: true, sensitivity: "base" });
    return sortDirection === "asc" ? result : -result;
  }), [filteredTickets, sortDirection, sortField]);

  const totalPages = Math.max(1, Math.ceil(sortedTickets.length / ITEMS_PER_PAGE));
  const currentData = sortedTickets.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const selectedOnPage = currentData.length > 0 && currentData.every((ticket) => selectedRowIds.includes(ticket.id));
  const activeFilterCount = (statusFilter ? 1 : 0) + (priorityFilter ? 1 : 0) + (dateRangeFilter.start || dateRangeFilter.end ? 1 : 0);
  const openCount = tickets.filter((t) => t.status === "Open").length;
  const progressCount = tickets.filter((t) => t.status === "In Progress").length;
  const criticalCount = tickets.filter((t) => t.priority === "Critical" && t.status !== "Closed" && t.status !== "Resolved").length;

  const clearFilters = () => { setDraftRows([]); setStatusFilter(""); setPriorityFilter(""); setDateRangeFilter({ start: "", end: "" }); setCurrentPage(1); };
  const openFilters = () => {
    const rows = [];
    if (statusFilter) rows.push("status");
    if (priorityFilter) rows.push("priority");
    if (dateRangeFilter.start || dateRangeFilter.end) rows.push("created");
    setDraftRows(rows);
    setDrafts({ status: statusFilter || "Open", priority: priorityFilter || "High", start: dateRangeFilter.start, end: dateRangeFilter.end });
    setShowFilterPanel(true);
  };
  const applyFilters = () => {
    setStatusFilter(draftRows.includes("status") ? drafts.status : "");
    setPriorityFilter(draftRows.includes("priority") ? drafts.priority : "");
    setDateRangeFilter(draftRows.includes("created") ? { start: drafts.start, end: drafts.end } : { start: "", end: "" });
    setCurrentPage(1);
    setShowFilterPanel(false);
  };
  const toggleColumn = (key: ColumnKey) => setVisibleColumns((current) => current[key] && Object.values(current).filter(Boolean).length === 1 ? current : { ...current, [key]: !current[key] });
  const handleSort = (field: ColumnKey) => {
    setCurrentPage(1);
    if (sortField === field) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
      return;
    }
    setSortField(field);
    setSortDirection("asc");
  };
  const getSortIcon = (field: ColumnKey) => <ArrowUpDown className={`h-3.5 w-3.5 ${sortField === field ? "text-primary" : "text-neutral-400"}`} />;
  const toggleSelected = (id: string, checked: boolean) => setSelectedRowIds((current) => checked ? Array.from(new Set([...current, id])) : current.filter((item) => item !== id));
  const handleExportExcel = () => alert(`Success: Exported ${filteredTickets.length} support requests to Excel.`);
  const handleExportPdf = () => alert(`Success: Exported ${filteredTickets.length} support requests to PDF.`);
  const handleBulkResolve = () => { setTickets((items) => items.map((t) => selectedRowIds.includes(t.id) ? { ...t, status: "Resolved", lastUpdated: new Date().toISOString().split("T")[0] } : t)); setSelectedRowIds([]); };
  const handleResolveSingle = (ticketId: string) => { setTickets((items) => items.map((t) => t.id === ticketId ? { ...t, status: "Resolved", lastUpdated: new Date().toISOString().split("T")[0] } : t)); setActiveMenuRowId(null); };
  const handleViewTicket = (ticket: Ticket) => { setSelectedTicket(ticket); setEditedStatus(ticket.status); setEditedPriority(ticket.priority); setReply(ticket.replyContent || ""); setDrawerOpen(true); setActiveMenuRowId(null); };
  const handleCloseDrawer = () => { setDrawerOpen(false); setSelectedTicket(null); setReply(""); };
  const handleSubmitReply = () => {
    if (!selectedTicket) return;
    setTickets((items) => items.map((t) => t.id === selectedTicket.id ? { ...t, status: editedStatus as Ticket["status"], priority: editedPriority as Ticket["priority"], hasReplied: true, replyContent: reply, lastUpdated: new Date().toISOString().split("T")[0] } : t));
    handleCloseDrawer();
  };

  const renderActions = (ticket: Ticket) => <div className="relative inline-block text-left"><button type="button" title="Actions" onClick={() => setActiveMenuRowId(activeMenuRowId === ticket.id ? null : ticket.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900"><MoreVertical className="h-4 w-4" /></button>{activeMenuRowId === ticket.id ? <><div className="fixed inset-0 z-30" onClick={() => setActiveMenuRowId(null)} /><div className="absolute right-0 top-9 z-40 w-48 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-950"><button type="button" onClick={() => handleViewTicket(ticket)} className="flex h-9 w-full items-center gap-2 px-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900"><Edit className="h-4 w-4 text-neutral-500" />View / Reply</button>{ticket.status !== "Resolved" ? <button type="button" onClick={() => handleResolveSingle(ticket.id)} className="flex h-9 w-full items-center gap-2 border-t border-neutral-100 px-3 text-sm text-emerald-600 hover:bg-emerald-50 dark:border-neutral-800 dark:hover:bg-emerald-950/20"><CheckCircle className="h-4 w-4" />Mark Resolved</button> : null}</div></> : null}</div>;

  const renderPagination = () => <div className="flex flex-col gap-3 border-t border-neutral-200 bg-white px-4 py-3 text-sm dark:border-neutral-800 dark:bg-neutral-950 sm:flex-row sm:items-center sm:justify-between"><p className="text-neutral-500">Showing {filteredTickets.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredTickets.length)} of {filteredTickets.length}</p><div className="flex items-center gap-2"><button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950">Previous</button><span className="text-sm font-medium">Page {currentPage} of {totalPages}</span><button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950">Next</button></div></div>;

  const renderCell = (ticket: Ticket, key: ColumnKey) => {
    if (key === "id") return <span className="font-mono text-sm font-semibold">{ticket.id}</span>;
    if (key === "subject") return <button type="button" onClick={() => handleViewTicket(ticket)} className="max-w-sm text-left"><span className="block truncate text-sm font-semibold text-primary hover:underline">{ticket.subject}</span><span className="text-xs text-neutral-500">Category: {ticket.category}</span></button>;
    if (key === "clinicName") return <div><p className="text-sm font-medium">{ticket.clinicName}</p><p className="text-xs text-neutral-500">{ticket.clinicAdmin}</p></div>;
    if (key === "priority") return <DotBadge value={ticket.priority} kind="priority" />;
    if (key === "status") return <DotBadge value={ticket.status} kind="status" />;
    return <span className="font-mono text-sm text-neutral-600 dark:text-neutral-400">{formatDate(ticket.lastUpdated)}</span>;
  };

  return <div className="min-h-full bg-neutral-50 px-6 py-5 text-[14px] text-neutral-900 dark:bg-neutral-950 dark:text-white">
    <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between"><div><h1 className="text-2xl font-semibold leading-8 text-neutral-950 dark:text-white">Support Tickets</h1><p className="mt-2 max-w-2xl text-sm leading-5 text-neutral-500 dark:text-neutral-400">Resolve incoming support requests, technical issues, and billing queries from clinic administrators.</p></div><div className="flex flex-wrap items-center gap-2 xl:justify-end">{isSearchOpen ? <div className="relative flex h-10 min-w-[360px] items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950"><Search className="h-4 w-4 shrink-0" /><input autoFocus value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} placeholder="Search by ticket ID, subject, or clinic name..." className="h-full flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white" /><button type="button" title="Filter By" onClick={openFilters} className="relative rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900"><Filter className="h-4 w-4" />{activeFilterCount ? <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">{activeFilterCount}</span> : null}</button><button type="button" title="Close Search" onClick={() => setIsSearchOpen(false)} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900"><X className="h-4 w-4" /></button>{showFilterPanel ? <FilterPanel draftRows={draftRows} setDraftRows={setDraftRows} drafts={drafts} setDrafts={setDrafts} onClear={clearFilters} onCancel={() => setShowFilterPanel(false)} onApply={applyFilters} /> : null}</div> : <HeaderIconButton title="Search" icon={Search} active={Boolean(searchTerm)} onClick={() => setIsSearchOpen(true)} />}<div className="relative"><HeaderIconButton title="Customized columns" icon={Columns3} active={showColumnPanel || Object.values(visibleColumns).filter(Boolean).length < tableColumns.length} onClick={() => setShowColumnPanel((value) => !value)} />{showColumnPanel ? <ColumnPanel visibleColumns={visibleColumns} onToggle={toggleColumn} onClose={() => setShowColumnPanel(false)} /> : null}</div><button type="button" onClick={handleExportExcel} className="inline-flex h-10 items-center gap-2 rounded-lg border border-primary bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90"><Download className="h-4 w-4" />Export Tickets</button><HeaderIconButton title="Summary" icon={BarChart3} active={showSummary} onClick={() => setShowSummary((value) => !value)} /><HeaderIconButton title="Refresh" icon={RefreshCw} onClick={() => setCurrentPage(1)} /><div className="relative"><HeaderIconButton title="More options" icon={MoreVertical} active={showMoreMenu} onClick={() => setShowMoreMenu((value) => !value)} />{showMoreMenu ? <><div className="fixed inset-0 z-30" onClick={() => setShowMoreMenu(false)} /><div className="absolute right-0 top-12 z-40 w-44 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-950"><button type="button" onClick={() => alert("Import tickets is not available for this mock listing.")} className="flex h-9 w-full items-center gap-2 px-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900"><Upload className="h-4 w-4 text-neutral-500" />Import</button><button type="button" onClick={handleExportExcel} className="flex h-9 w-full items-center gap-2 px-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900"><Download className="h-4 w-4 text-neutral-500" />Export</button><button type="button" onClick={() => window.print()} className="flex h-9 w-full items-center gap-2 px-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900"><Printer className="h-4 w-4 text-neutral-500" />Print</button></div></> : null}</div></div></div>

    {showSummary ? <div className="mb-5 grid gap-4 md:grid-cols-4">{[{ label: "Total Tickets", value: tickets.length, icon: Mail }, { label: "Open Tickets", value: openCount, icon: AlertCircle }, { label: "In Progress", value: progressCount, icon: Edit }, { label: "Critical Issues", value: criticalCount, icon: X }].map(({ label, value, icon: Icon }) => <div key={label} className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950"><div className="mb-3 flex items-center justify-between"><span className="text-xs font-semibold uppercase text-neutral-500">{label}</span><span className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900"><Icon className="h-4 w-4" /></span></div><p className="text-2xl font-semibold leading-none">{value}</p></div>)}</div> : null}
    {selectedRowIds.length ? <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950"><span className="text-sm font-medium">{selectedRowIds.length} selected</span><div className="flex items-center gap-2"><button type="button" onClick={handleBulkResolve} className="inline-flex h-9 items-center gap-2 rounded-lg border border-emerald-200 px-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-300"><CheckCircle className="h-4 w-4" />Resolve Selected</button><button type="button" onClick={() => setSelectedRowIds([])} className="h-9 rounded-lg px-3 text-sm font-medium text-neutral-500 hover:bg-neutral-100">Clear</button></div></div> : null}
    {filteredTickets.length === 0 ? <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-950"><AlertCircle className="mx-auto h-10 w-10 text-neutral-400" /><h3 className="mt-3 text-sm font-semibold">No Tickets Found</h3><p className="mt-1 text-sm text-neutral-500">Adjust search or filters to find matching support tickets.</p></div> : <>
{viewMode === "table" ? <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"><div className="overflow-x-auto"><table className="min-w-full border-collapse text-left"><thead className="bg-neutral-50 dark:bg-neutral-900"><tr className="border-b border-neutral-200 dark:border-neutral-800"><th className="w-12 px-4 py-3"><input type="checkbox" checked={selectedOnPage} onChange={(e) => setSelectedRowIds(e.target.checked ? Array.from(new Set([...selectedRowIds, ...currentData.map((t) => t.id)])) : selectedRowIds.filter((id) => !currentData.map((t) => t.id).includes(id)))} className="h-4 w-4 rounded border-neutral-300 accent-primary" /></th>{tableColumns.map((column) => visibleColumns[column.key] ? <th key={column.key} className="px-4 py-3 text-sm font-semibold text-neutral-500"><button type="button" onClick={() => handleSort(column.key)} className="whitespace-nowrap" aria-label={`Sort by ${column.label}`}>{column.label}{getSortIcon(column.key)}</button></th> : null)}<th className="w-20 px-4 py-3 text-right text-sm font-semibold text-neutral-500">Actions</th></tr></thead><tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">{currentData.map((ticket) => <tr key={ticket.id} className={`h-14 hover:bg-neutral-50 dark:hover:bg-neutral-900 ${selectedRowIds.includes(ticket.id) ? "bg-primary/5" : ""}`}><td className="px-4 py-3"><input type="checkbox" checked={selectedRowIds.includes(ticket.id)} onChange={(e) => toggleSelected(ticket.id, e.target.checked)} className="h-4 w-4 rounded border-neutral-300 accent-primary" /></td>{tableColumns.map((column) => visibleColumns[column.key] ? <td key={column.key} className="px-4 py-3 whitespace-nowrap">{renderCell(ticket, column.key)}</td> : null)}<td className="px-4 py-3 text-right">{renderActions(ticket)}</td></tr>)}</tbody></table></div>{renderPagination()}</div> : null}
    </>}
    {drawerOpen && selectedTicket ? <><div className="fixed inset-0 z-40 bg-black/40" onClick={handleCloseDrawer} /><div className="fixed right-0 top-0 z-50 flex h-full w-[600px] max-w-[calc(100vw-24px)] flex-col border-l border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950"><div className="flex items-start justify-between border-b border-neutral-100 p-5 dark:border-neutral-800"><div><h2 className="text-lg font-semibold">Support Ticket {selectedTicket.id}</h2><p className="mt-1 text-xs font-semibold uppercase text-neutral-500">Category: {selectedTicket.category}</p></div><button type="button" onClick={handleCloseDrawer} className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"><X className="h-5 w-5" /></button></div><div className="flex-1 space-y-5 overflow-y-auto p-5"><div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900"><h3 className="text-base font-semibold">{selectedTicket.subject}</h3><p className="mt-1 text-xs text-neutral-500">Opened on {formatDate(selectedTicket.createdAt)} by {selectedTicket.clinicAdmin} ({selectedTicket.clinicName})</p><div className="my-4 h-px bg-neutral-200 dark:bg-neutral-800" /><p className="text-sm leading-relaxed">{selectedTicket.description}</p></div><div className="grid grid-cols-2 gap-4"><label className="grid gap-1.5"><span className="text-xs font-semibold uppercase text-neutral-500">Update Status</span><select value={editedStatus} onChange={(e) => setEditedStatus(e.target.value)} className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-800 dark:bg-neutral-950">{["Open", "In Progress", "Resolved", "Closed"].map((v) => <option key={v} value={v}>{v}</option>)}</select></label><label className="grid gap-1.5"><span className="text-xs font-semibold uppercase text-neutral-500">Update Priority</span><select value={editedPriority} onChange={(e) => setEditedPriority(e.target.value)} className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-800 dark:bg-neutral-950">{["Low", "Medium", "High", "Critical"].map((v) => <option key={v} value={v}>{v}</option>)}</select></label></div><label className="grid gap-1.5"><span className="text-xs font-semibold uppercase text-neutral-500">Send Response to Clinic Administrator</span><textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={6} placeholder="Draft your reply to the administrator..." className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-950" /></label>{selectedTicket.hasReplied ? <div className="rounded-lg border border-primary/20 bg-primary/5 p-4"><h4 className="text-xs font-semibold uppercase text-primary">Last response sent</h4><p className="mt-1 text-sm italic">"{selectedTicket.replyContent}"</p></div> : null}</div><div className="flex items-center justify-end gap-3 border-t border-neutral-100 p-5 dark:border-neutral-800"><button type="button" onClick={handleCloseDrawer} className="h-10 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">Cancel</button><button type="button" onClick={handleSubmitReply} className="inline-flex h-10 items-center gap-2 rounded-lg border border-primary bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90"><Send className="h-4 w-4" />Submit Response</button></div></div></> : null}
  </div>;
}
