import { type ComponentType, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { AlertCircle, ArrowUpDown, BarChart3, Check, Code2, Columns3, Download, Edit2, FileText, Filter, Mail, MoreVertical, Plus, Printer, RefreshCw, Search, Upload, X } from "lucide-react";
import { CardFooter, CardHeader, CardMetaRow, EnterpriseAvatar, EntityCard, ViewModeSwitcher } from "../components/hb/listing";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
  body: string;
  variables: string[];
  lastModified: string;
}

type ViewMode = "grid" | "list" | "table";
type ColumnKey = "template" | "subject" | "variables" | "lastModified";

const ITEMS_PER_PAGE = 10;

const mockEmailTemplates: EmailTemplate[] = [
  { id: "EMAIL001", name: "Welcome Email", subject: "Welcome to {{clinic_name}} - Get Started with SpineCloudIQ", description: "Sent to new clinic administrators when they first sign up", body: "", variables: ["{{clinic_name}}", "{{admin_name}}", "{{dashboard_url}}", "{{support_email}}"], lastModified: "2024-02-15" },
  { id: "EMAIL002", name: "Subscription Renewal Reminder", subject: "Your {{plan_name}} subscription renews in {{days_until_renewal}} days", description: "Reminder sent before subscription renewal date", body: "", variables: ["{{admin_name}}", "{{clinic_name}}", "{{plan_name}}", "{{days_until_renewal}}", "{{renewal_date}}", "{{renewal_amount}}", "{{payment_method}}", "{{billing_url}}"], lastModified: "2024-02-18" },
  { id: "EMAIL003", name: "Payment Failed", subject: "Action Required: Payment Failed for {{clinic_name}}", description: "Sent when a subscription payment fails", body: "", variables: ["{{admin_name}}", "{{clinic_name}}", "{{amount_due}}", "{{attempt_date}}", "{{payment_url}}", "{{billing_support_email}}"], lastModified: "2024-02-10" },
  { id: "EMAIL004", name: "Trial Ending Soon", subject: "Your {{plan_name}} trial ends in {{days_remaining}} days", description: "Notification sent as trial period nears expiration", body: "", variables: ["{{admin_name}}", "{{clinic_name}}", "{{plan_name}}", "{{days_remaining}}", "{{trial_end_date}}", "{{feature_1}}", "{{feature_2}}", "{{feature_3}}", "{{upgrade_url}}", "{{sales_email}}"], lastModified: "2024-02-12" },
  { id: "EMAIL005", name: "Password Reset", subject: "Reset Your SpineCloudIQ Password", description: "Sent when a user requests a password reset", body: "", variables: ["{{user_name}}", "{{reset_link}}", "{{expiry_hours}}"], lastModified: "2024-01-28" },
  { id: "EMAIL006", name: "New Team Member Invitation", subject: "You've been invited to join {{clinic_name}} on SpineCloudIQ", description: "Invitation sent to new team members", body: "", variables: ["{{invitee_name}}", "{{inviter_name}}", "{{clinic_name}}", "{{role}}", "{{invitation_link}}", "{{expiry_date}}"], lastModified: "2024-02-05" },
  { id: "EMAIL007", name: "Subscription Upgrade Confirmation", subject: "Subscription Upgraded: Welcome to {{new_plan_name}}", description: "Confirmation sent after a successful plan upgrade", body: "", variables: ["{{admin_name}}", "{{clinic_name}}", "{{new_plan_name}}", "{{old_plan_name}}", "{{effective_date}}", "{{new_rate}}", "{{new_features}}", "{{dashboard_url}}"], lastModified: "2024-02-14" },
  { id: "EMAIL008", name: "Monthly Usage Report", subject: "{{clinic_name}} - Monthly Usage Summary for {{month}}", description: "Monthly summary of platform usage and metrics", body: "", variables: ["{{admin_name}}", "{{clinic_name}}", "{{month}}", "{{active_users}}", "{{total_patients}}", "{{storage_used}}", "{{storage_limit}}", "{{api_calls}}", "{{plan_name}}", "{{billing_cycle}}", "{{next_billing_date}}", "{{analytics_url}}"], lastModified: "2024-02-01" },
];

const tableColumns: Array<{ key: ColumnKey; label: string }> = [
  { key: "template", label: "Template" },
  { key: "subject", label: "Subject Line" },
  { key: "variables", label: "Variables" },
  { key: "lastModified", label: "Last Modified" },
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

function TemplateMark() {
  return <EnterpriseAvatar icon={Mail} className="text-primary" />;
}

function ColumnPanel({ visibleColumns, onToggle, onClose }: { visibleColumns: Record<ColumnKey, boolean>; onToggle: (key: ColumnKey) => void; onClose: () => void }) {
  const activeCount = Object.values(visibleColumns).filter(Boolean).length;
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute right-0 top-12 z-40 w-64 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
        <div className="flex h-11 items-center justify-between border-b border-neutral-100 px-4 dark:border-neutral-800"><h3 className="text-sm font-semibold">Columns</h3><button type="button" onClick={onClose} className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"><X className="h-4 w-4" /></button></div>
        <div className="p-2">{tableColumns.map((column) => <button key={column.key} type="button" onClick={() => onToggle(column.key)} className="flex h-9 w-full items-center gap-3 rounded-md px-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900"><span className={`flex h-4 w-4 items-center justify-center rounded border ${visibleColumns[column.key] ? "border-primary bg-primary text-white" : "border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-950"}`}>{visibleColumns[column.key] ? <Check className="h-3 w-3" /> : null}</span>{column.label}</button>)}</div>
        <div className="border-t border-neutral-100 px-4 py-3 text-xs font-medium text-neutral-500 dark:border-neutral-800">{activeCount} of {tableColumns.length} active</div>
      </div>
    </>
  );
}

function FilterPanel({ draftRows, setDraftRows, dateRange, setDateRange, onClear, onCancel, onApply }: { draftRows: string[]; setDraftRows: (rows: string[]) => void; dateRange: { start: string; end: string }; setDateRange: (range: { start: string; end: string }) => void; onClear: () => void; onCancel: () => void; onApply: () => void }) {
  return (
    <div className="absolute right-0 top-12 z-50 w-[560px] overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex h-12 items-center justify-between border-b border-neutral-100 px-4 dark:border-neutral-800"><h2 className="text-sm font-semibold">Filter By</h2><button type="button" onClick={onCancel} className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"><X className="h-4 w-4" /></button></div>
      <div className="space-y-3 p-4">
        <div className="grid grid-cols-[170px_1fr_32px] gap-2 px-1 text-xs font-semibold uppercase text-neutral-500"><span>Where</span><span>What</span><span /></div>
        {draftRows.length === 0 ? <div className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50 px-3 py-6 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">No filters selected.</div> : null}
        {draftRows.includes("modified") ? <div className="grid grid-cols-[170px_1fr_32px] items-center gap-2"><div className="flex h-10 items-center rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm font-medium dark:border-neutral-800 dark:bg-neutral-900">Last Modified</div><div className="grid grid-cols-2 gap-2"><input type="date" value={dateRange.start} onChange={(event) => setDateRange({ ...dateRange, start: event.target.value })} className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-950" /><input type="date" value={dateRange.end} onChange={(event) => setDateRange({ ...dateRange, end: event.target.value })} className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-950" /></div><button type="button" onClick={() => setDraftRows([])} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"><X className="h-4 w-4" /></button></div> : null}
        <button type="button" disabled={draftRows.includes("modified")} onClick={() => setDraftRows(["modified"])} className="inline-flex h-9 items-center gap-2 rounded-lg px-2 text-sm font-medium text-primary hover:bg-primary/10 disabled:opacity-40"><Plus className="h-4 w-4" />Add Filter</button>
      </div>
      <div className="flex h-14 items-center justify-end gap-2 border-t border-neutral-100 px-4 dark:border-neutral-800"><button type="button" onClick={onClear} className="h-9 rounded-lg px-3 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900">Clear All</button><button type="button" onClick={onCancel} className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium dark:border-neutral-800 dark:bg-neutral-950">Cancel</button><button type="button" onClick={onApply} className="h-9 rounded-lg border border-primary bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90">Apply</button></div>
    </div>
  );
}

export default function EmailManagementPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showSummary, setShowSummary] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showColumnPanel, setShowColumnPanel] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [draftRows, setDraftRows] = useState<string[]>([]);
  const [draftDateRange, setDraftDateRange] = useState({ start: "", end: "" });
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>({ template: true, subject: true, variables: true, lastModified: true });
  const [sortField, setSortField] = useState<ColumnKey>("lastModified");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    if (viewMode !== "table") setShowColumnPanel(false);
  }, [viewMode]);

  const filteredTemplates = useMemo(() => {
    return mockEmailTemplates.filter((template) => {
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch = !query || template.name.toLowerCase().includes(query) || template.description.toLowerCase().includes(query) || template.subject.toLowerCase().includes(query);
      const matchesStart = !dateRange.start || new Date(template.lastModified) >= new Date(dateRange.start);
      const matchesEnd = !dateRange.end || new Date(template.lastModified) <= new Date(dateRange.end);
      return matchesSearch && matchesStart && matchesEnd;
    });
  }, [dateRange.end, dateRange.start, searchTerm]);

  const sortedTemplates = useMemo(() => [...filteredTemplates].sort((first, second) => {
    const getValue = (template: EmailTemplate) => {
      if (sortField === "template") return template.name;
      if (sortField === "variables") return template.variables.length;
      return template[sortField];
    };
    const firstValue = getValue(first);
    const secondValue = getValue(second);
    const result = typeof firstValue === "number" && typeof secondValue === "number"
      ? firstValue - secondValue
      : String(firstValue).localeCompare(String(secondValue), undefined, { numeric: true, sensitivity: "base" });
    return sortDirection === "asc" ? result : -result;
  }), [filteredTemplates, sortDirection, sortField]);

  const totalPages = Math.max(1, Math.ceil(sortedTemplates.length / ITEMS_PER_PAGE));
  const currentData = sortedTemplates.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const selectedOnPage = currentData.length > 0 && currentData.every((item) => selectedRowIds.includes(item.id));
  const activeFilterCount = dateRange.start || dateRange.end ? 1 : 0;
  const totalVariables = mockEmailTemplates.reduce((acc, template) => acc + template.variables.length, 0);

  const openFilters = () => {
    setDraftRows(dateRange.start || dateRange.end ? ["modified"] : []);
    setDraftDateRange({ ...dateRange });
    setShowFilterPanel(true);
  };

  const clearFilters = () => {
    setDraftRows([]);
    setDraftDateRange({ start: "", end: "" });
    setDateRange({ start: "", end: "" });
    setCurrentPage(1);
  };

  const applyFilters = () => {
    setDateRange(draftRows.includes("modified") ? draftDateRange : { start: "", end: "" });
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
  const handleExportExcel = () => alert(`Exporting ${filteredTemplates.length} email templates to Excel.`);
  const handleExportPdf = () => alert(`Exporting ${filteredTemplates.length} email templates to PDF.`);

  const renderPagination = () => (
    <div className="flex flex-col gap-3 border-t border-neutral-200 bg-white px-4 py-3 text-sm dark:border-neutral-800 dark:bg-neutral-950 sm:flex-row sm:items-center sm:justify-between"><p className="text-neutral-500">Showing {filteredTemplates.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredTemplates.length)} of {filteredTemplates.length}</p><div className="flex items-center gap-2"><button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950">Previous</button><span className="text-sm font-medium">Page {currentPage} of {totalPages}</span><button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950">Next</button></div></div>
  );

  const renderActions = (template: EmailTemplate) => (
    <div className="relative inline-block text-left">
      <button type="button" onClick={(event) => { event.stopPropagation(); setActiveMenuRowId(activeMenuRowId === template.id ? null : template.id); }} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900" title="Actions"><MoreVertical className="h-4 w-4" /></button>
      {activeMenuRowId === template.id ? <><div className="fixed inset-0 z-30" onClick={() => setActiveMenuRowId(null)} /><div className="absolute right-0 top-9 z-40 w-44 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-950"><button type="button" onClick={(event) => { event.stopPropagation(); setActiveMenuRowId(null); navigate(`/dashboard/emails/${template.id}`); }} className="flex h-9 w-full items-center gap-2 px-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900"><Edit2 className="h-4 w-4 text-neutral-500" />Edit Template</button></div></> : null}
    </div>
  );

  return (
    <div className="min-h-full bg-neutral-50 px-6 py-5 text-[14px] text-neutral-900 dark:bg-neutral-950 dark:text-white">
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div><h1 className="text-2xl font-semibold leading-8 text-neutral-950 dark:text-white">Email Templates</h1><p className="mt-2 max-w-2xl text-sm leading-5 text-neutral-500 dark:text-neutral-400">Manage and customize platform-wide transactional email templates sent to clinic administrators.</p></div>
        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
          {isSearchOpen ? <div className="relative flex h-10 min-w-[360px] items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950"><Search className="h-4 w-4 shrink-0" /><input autoFocus value={searchTerm} onChange={(event) => { setSearchTerm(event.target.value); setCurrentPage(1); }} placeholder="Search by template name, subject, or description..." className="h-full flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white" /><button type="button" title="Filter By" onClick={openFilters} className="relative rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900"><Filter className="h-4 w-4" />{activeFilterCount ? <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">{activeFilterCount}</span> : null}</button><button type="button" title="Close Search" onClick={() => setIsSearchOpen(false)} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900"><X className="h-4 w-4" /></button>{showFilterPanel ? <FilterPanel draftRows={draftRows} setDraftRows={setDraftRows} dateRange={draftDateRange} setDateRange={setDraftDateRange} onClear={clearFilters} onCancel={() => setShowFilterPanel(false)} onApply={applyFilters} /> : null}</div> : <HeaderIconButton title="Search" icon={Search} active={Boolean(searchTerm)} onClick={() => setIsSearchOpen(true)} />}
          <ViewModeSwitcher value={viewMode} onChange={(mode) => { setViewMode(mode); setCurrentPage(1); }} />
          {viewMode === "table" ? <div className="relative"><HeaderIconButton title="Customized columns" icon={Columns3} active={showColumnPanel || Object.values(visibleColumns).filter(Boolean).length < tableColumns.length} onClick={() => setShowColumnPanel((value) => !value)} />{showColumnPanel ? <ColumnPanel visibleColumns={visibleColumns} onToggle={toggleColumn} onClose={() => setShowColumnPanel(false)} /> : null}</div> : null}
          <button type="button" onClick={handleExportExcel} className="inline-flex h-10 items-center gap-2 rounded-lg border border-primary bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90"><Download className="h-4 w-4" />Export Templates</button>
          <HeaderIconButton title="Summary" icon={BarChart3} active={showSummary} onClick={() => setShowSummary((value) => !value)} />
          <HeaderIconButton title="Refresh" icon={RefreshCw} onClick={() => setCurrentPage(1)} />
          <div className="relative"><HeaderIconButton title="More options" icon={MoreVertical} active={showMoreMenu} onClick={() => setShowMoreMenu((value) => !value)} />{showMoreMenu ? <><div className="fixed inset-0 z-30" onClick={() => setShowMoreMenu(false)} /><div className="absolute right-0 top-12 z-40 w-44 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-950"><button type="button" onClick={() => alert("Import templates is not available for this mock listing.")} className="flex h-9 w-full items-center gap-2 px-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900"><Upload className="h-4 w-4 text-neutral-500" />Import</button><button type="button" onClick={handleExportExcel} className="flex h-9 w-full items-center gap-2 px-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900"><FileText className="h-4 w-4 text-neutral-500" />Export</button><button type="button" onClick={() => window.print()} className="flex h-9 w-full items-center gap-2 px-3 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900"><Printer className="h-4 w-4 text-neutral-500" />Print</button></div></> : null}</div>
        </div>
      </div>

      {showSummary ? <div className="mb-5 grid gap-4 md:grid-cols-3">{[{ label: "Total Templates", value: mockEmailTemplates.length, icon: Mail }, { label: "Dynamic Variables", value: totalVariables, icon: Code2 }, { label: "Last Modified", value: "Feb 18", icon: BarChart3 }].map(({ label, value, icon: Icon }) => <div key={label} className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950"><div className="mb-3 flex items-center justify-between"><span className="text-xs font-semibold uppercase text-neutral-500">{label}</span><span className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900"><Icon className="h-4 w-4" /></span></div><p className="text-2xl font-semibold leading-none">{value}</p></div>)}</div> : null}

      {selectedRowIds.length ? <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950"><span className="text-sm font-medium">{selectedRowIds.length} selected</span><div className="flex items-center gap-2"><button type="button" onClick={handleExportExcel} className="inline-flex h-9 items-center gap-2 rounded-lg border border-neutral-200 px-3 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-800"><Download className="h-4 w-4" />Export Selected</button><button type="button" onClick={() => setSelectedRowIds([])} className="h-9 rounded-lg px-3 text-sm font-medium text-neutral-500 hover:bg-neutral-100">Clear</button></div></div> : null}

      {filteredTemplates.length === 0 ? <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-950"><AlertCircle className="mx-auto h-10 w-10 text-neutral-400" /><h3 className="mt-3 text-sm font-semibold">No Email Templates Found</h3><p className="mt-1 text-sm text-neutral-500">Adjust search or filters to find matching templates.</p></div> : (
        <>
          {viewMode === "grid" ? <><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{currentData.map((template) => <EntityCard key={template.id} selected={selectedRowIds.includes(template.id)} onClick={() => navigate(`/dashboard/emails/${template.id}`)}><CardHeader avatar={<TemplateMark />} title={template.name} subtitle={template.id} selected={selectedRowIds.includes(template.id)} onSelect={(checked) => toggleSelected(template.id, checked)} actions={renderActions(template)} /><div className="flex-1 space-y-2 text-sm"><CardMetaRow icon={FileText}>{template.subject}</CardMetaRow><CardMetaRow icon={Mail}>{template.description}</CardMetaRow><CardMetaRow icon={Code2}>{template.variables.length} variables</CardMetaRow></div><CardFooter><span className="text-xs text-neutral-500">{formatDate(template.lastModified)}</span></CardFooter></EntityCard>)}</div>{renderPagination()}</> : null}
          {viewMode === "list" ? <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"><div className="divide-y divide-neutral-100 dark:divide-neutral-800">{currentData.map((template) => <div key={template.id} onClick={() => navigate(`/dashboard/emails/${template.id}`)} className={`flex cursor-pointer flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between ${selectedRowIds.includes(template.id) ? "bg-primary/5" : ""}`}><div className="flex min-w-0 items-center gap-3"><input type="checkbox" checked={selectedRowIds.includes(template.id)} onClick={(event) => event.stopPropagation()} onChange={(event) => toggleSelected(template.id, event.target.checked)} className="h-4 w-4 rounded border-neutral-300 accent-primary" /><TemplateMark /><div className="min-w-0"><p className="truncate text-sm font-semibold text-primary">{template.name}</p><p className="truncate text-xs text-neutral-500">{template.subject}</p></div></div><div className="flex flex-wrap items-center gap-3 text-sm"><span className="inline-flex h-6 items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2 text-xs font-medium dark:border-neutral-800 dark:bg-neutral-900"><Code2 className="h-3 w-3" />{template.variables.length}</span><span className="text-xs text-neutral-500">{formatDate(template.lastModified)}</span>{renderActions(template)}</div></div>)}</div>{renderPagination()}</div> : null}
          {viewMode === "table" ? <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"><div className="overflow-x-auto"><table className="min-w-full border-collapse text-left"><thead className="bg-neutral-50 dark:bg-neutral-900"><tr className="border-b border-neutral-200 dark:border-neutral-800"><th className="w-12 px-4 py-3"><input type="checkbox" checked={selectedOnPage} onChange={(event) => setSelectedRowIds(event.target.checked ? Array.from(new Set([...selectedRowIds, ...currentData.map((item) => item.id)])) : selectedRowIds.filter((id) => !currentData.map((item) => item.id).includes(id)))} className="h-4 w-4 rounded border-neutral-300 accent-primary" /></th>{visibleColumns.template ? <th className="px-4 py-3 text-sm font-semibold text-neutral-500"><button type="button" onClick={() => handleSort("template")} className="whitespace-nowrap" aria-label="Sort by Template">Template{getSortIcon("template")}</button></th> : null}{visibleColumns.subject ? <th className="px-4 py-3 text-sm font-semibold text-neutral-500"><button type="button" onClick={() => handleSort("subject")} className="whitespace-nowrap" aria-label="Sort by Subject Line">Subject Line{getSortIcon("subject")}</button></th> : null}{visibleColumns.variables ? <th className="px-4 py-3 text-sm font-semibold text-neutral-500"><button type="button" onClick={() => handleSort("variables")} className="whitespace-nowrap" aria-label="Sort by Variables">Variables{getSortIcon("variables")}</button></th> : null}{visibleColumns.lastModified ? <th className="px-4 py-3 text-sm font-semibold text-neutral-500"><button type="button" onClick={() => handleSort("lastModified")} className="whitespace-nowrap" aria-label="Sort by Last Modified">Last Modified{getSortIcon("lastModified")}</button></th> : null}<th className="w-20 px-4 py-3 text-right text-sm font-semibold text-neutral-500">Actions</th></tr></thead><tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">{currentData.map((template) => <tr key={template.id} onClick={() => navigate(`/dashboard/emails/${template.id}`)} className={`h-14 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 ${selectedRowIds.includes(template.id) ? "bg-primary/5" : ""}`}><td className="px-4 py-3" onClick={(event) => event.stopPropagation()}><input type="checkbox" checked={selectedRowIds.includes(template.id)} onChange={(event) => toggleSelected(template.id, event.target.checked)} className="h-4 w-4 rounded border-neutral-300 accent-primary" /></td>{visibleColumns.template ? <td className="px-4 py-3"><div className="flex items-center gap-3"><TemplateMark /><span><span className="block text-sm font-semibold text-primary">{template.name}</span><span className="text-[10px] font-semibold uppercase text-neutral-400">{template.id}</span></span></div></td> : null}{visibleColumns.subject ? <td className="max-w-md px-4 py-3"><p className="truncate text-sm font-medium text-neutral-700 dark:text-neutral-300">{template.subject}</p><p className="truncate text-xs text-neutral-500">{template.description}</p></td> : null}{visibleColumns.variables ? <td className="px-4 py-3"><span className="inline-flex h-6 items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2 text-xs font-medium dark:border-neutral-800 dark:bg-neutral-900"><Code2 className="h-3 w-3" />{template.variables.length}</span></td> : null}{visibleColumns.lastModified ? <td className="px-4 py-3 font-mono text-sm text-neutral-600 dark:text-neutral-400">{formatDate(template.lastModified)}</td> : null}<td className="px-4 py-3 text-right">{renderActions(template)}</td></tr>)}</tbody></table></div>{renderPagination()}</div> : null}
        </>
      )}
    </div>
  );
}
