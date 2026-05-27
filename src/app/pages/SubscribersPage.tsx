import { useMemo, useState } from "react";
import { ArrowUpDown, Eye, TrendingUp, TrendingDown, BarChart3, MoreVertical, X, Sparkles, UserPlus, AlertCircle, ShieldAlert } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { SearchBar } from "../components/ui/search-bar";
import { MoreOptions } from "../components/ui/more-options";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { FilterDropdown } from "../components/ui/filter-dropdown";

interface Subscription {
  id: string;
  clinicName: string;
  ownerEmail: string;
  planName: string;
  branchesUsed: number;
  branchesAllowed: number;
  providersUsed: number;
  providersAllowed: number;
  patientsUsed: number;
  patientsAllowed: number;
  aiUsage: string;
  startDate: string;
  expiryDate: string;
  paymentStatus: "Paid" | "Failed" | "Pending";
  subscriptionStatus: "Active" | "Inactive";
}

type SortField =
  | "clinicName"
  | "ownerEmail"
  | "planName"
  | "branchesAllowed"
  | "providersAllowed"
  | "patientsAllowed"
  | "aiUsage"
  | "paymentStatus"
  | "subscriptionStatus";

const mockSubscriptions: Subscription[] = [
  {
    id: "1",
    clinicName: "City Spine Clinic",
    ownerEmail: "admin@cityspine.com",
    planName: "Professional",
    branchesUsed: 2,
    branchesAllowed: 3,
    providersUsed: 8,
    providersAllowed: 10,
    patientsUsed: 423,
    patientsAllowed: 500,
    aiUsage: "156/200",
    startDate: "2024-01-15",
    expiryDate: "2025-01-15",
    paymentStatus: "Paid",
    subscriptionStatus: "Active",
  },
  {
    id: "2",
    clinicName: "Wellness Spine Center",
    ownerEmail: "contact@wellnessspine.com",
    planName: "Enterprise",
    branchesUsed: 5,
    branchesAllowed: 10,
    providersUsed: 25,
    providersAllowed: 50,
    patientsUsed: 1245,
    patientsAllowed: 2000,
    aiUsage: "678/1000",
    startDate: "2024-02-01",
    expiryDate: "2025-02-01",
    paymentStatus: "Paid",
    subscriptionStatus: "Active",
  },
  {
    id: "3",
    clinicName: "Quick Care Spine",
    ownerEmail: "info@quickcare.com",
    planName: "Starter",
    branchesUsed: 1,
    branchesAllowed: 1,
    providersUsed: 3,
    providersAllowed: 3,
    patientsUsed: 89,
    patientsAllowed: 100,
    aiUsage: "45/50",
    startDate: "2024-06-10",
    expiryDate: "2024-07-10",
    paymentStatus: "Failed",
    subscriptionStatus: "Active",
  },
  {
    id: "4",
    clinicName: "Metro Chiropractic",
    ownerEmail: "hello@metrochiro.com",
    planName: "Professional",
    branchesUsed: 1,
    branchesAllowed: 3,
    providersUsed: 4,
    providersAllowed: 10,
    patientsUsed: 156,
    patientsAllowed: 500,
    aiUsage: "89/200",
    startDate: "2024-05-20",
    expiryDate: "2024-06-20",
    paymentStatus: "Pending",
    subscriptionStatus: "Inactive",
  },
];

export default function SubscribersPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  
  const [showMetrics, setShowMetrics] = useState(true);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("clinicName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      sub.clinicName.toLowerCase().includes(searchLower) ||
      sub.ownerEmail.toLowerCase().includes(searchLower);

    const matchesPlan = !planFilter || sub.planName === planFilter;
    const matchesStatus = !statusFilter || sub.subscriptionStatus === statusFilter;

    return matchesSearch && matchesPlan && matchesStatus;
  });

  const sortedSubscriptions = useMemo(() => {
    const getSortValue = (subscription: Subscription, field: SortField) => {
      if (field === "aiUsage") return Number(subscription.aiUsage.split("/")[0]);
      return subscription[field];
    };

    return [...filteredSubscriptions].sort((first, second) => {
      const firstValue = getSortValue(first, sortField);
      const secondValue = getSortValue(second, sortField);
      const result =
        typeof firstValue === "number" && typeof secondValue === "number"
          ? firstValue - secondValue
          : String(firstValue).localeCompare(String(secondValue), undefined, { numeric: true, sensitivity: "base" });
      return sortDirection === "asc" ? result : -result;
    });
  }, [filteredSubscriptions, sortDirection, sortField]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
      return;
    }
    setSortField(field);
    setSortDirection("asc");
  };

  const getSortIcon = (field: SortField) => (
    <ArrowUpDown className={`h-3.5 w-3.5 ${sortField === field ? "text-primary" : "text-muted-foreground"}`} />
  );

  const activeFilterCount =
    (planFilter ? 1 : 0) + (statusFilter ? 1 : 0);

  const clearFilters = () => {
    setPlanFilter("");
    setStatusFilter("");
  };

  const handleExportExcel = () => {
    alert(`Success: Exported ${filteredSubscriptions.length} subscribers list to Excel.`);
  };

  const handleExportPdf = () => {
    alert(`Success: Exported ${filteredSubscriptions.length} subscribers list to PDF.`);
  };

  const handleSelectAllRows = (checked: boolean) => {
    if (checked) {
      setSelectedRowIds(sortedSubscriptions.map(s => s.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleSelectRow = (subId: string, checked: boolean) => {
    if (checked) {
      setSelectedRowIds([...selectedRowIds, subId]);
    } else {
      setSelectedRowIds(selectedRowIds.filter(id => id !== subId));
    }
  };

  const handleBulkSuspend = () => {
    if (confirm(`Are you sure you want to suspend the ${selectedRowIds.length} selected clinic accounts?`)) {
      setSubscriptions(subscriptions.map(s => selectedRowIds.includes(s.id) ? { ...s, subscriptionStatus: "Inactive" } : s));
      setSelectedRowIds([]);
    }
  };

  const handleViewDetails = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsDrawerOpen(true);
    setActiveMenuRowId(null);
  };

  const handleSuspendSingle = (subId: string) => {
    if (confirm("Are you sure you want to suspend this clinic's subscription?")) {
      setSubscriptions(subscriptions.map(s => s.id === subId ? { ...s, subscriptionStatus: "Inactive" } : s));
      setActiveMenuRowId(null);
    }
  };

  const calculateUsagePercentage = (used: number, allowed: number) => {
    return Math.round((used / allowed) * 100);
  };

  // Metrics
  const totalSubscribers = subscriptions.length;
  const activeCount = subscriptions.filter(s => s.subscriptionStatus === "Active").length;
  const suspendedCount = subscriptions.filter(s => s.subscriptionStatus === "Inactive").length;
  const failedPayments = subscriptions.filter(s => s.paymentStatus === "Failed").length;

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Clinic Subscribers</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Monitor active clinic subscription levels, license volumes, and resource quotas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowMetrics(!showMetrics)}
            className={`w-10 h-10 ${showMetrics ? "bg-accent text-accent-foreground border-primary-300" : ""}`}
            title="Toggle metrics panel"
          >
            <BarChart3 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* KPI dynamic metrics block */}
      {showMetrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="bg-card border border-border shadow-sm rounded-lg p-5 flex flex-col justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Subscribers</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold text-foreground">{totalSubscribers}</span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">Active Accounts</span>
            </div>
          </div>
          <div className="bg-card border border-border shadow-sm rounded-lg p-5 flex flex-col justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Subscriptions</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold text-foreground">{activeCount}</span>
              <span className="text-xs font-medium text-primary bg-primary/5 px-2 py-0.5 rounded-full">
                {Math.round((activeCount / (totalSubscribers || 1)) * 100)}% Operational
              </span>
            </div>
          </div>
          <div className="bg-card border border-border shadow-sm rounded-lg p-5 flex flex-col justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suspended Clinics</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">{suspendedCount}</span>
              <span className="text-xs font-medium text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">Restricted</span>
            </div>
          </div>
          <div className="bg-card border border-border shadow-sm rounded-lg p-5 flex flex-col justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Failed Settlements</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-bold text-red-600 dark:text-red-400">{failedPayments}</span>
              <span className="text-xs font-medium text-red-600 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-full">Requires attention</span>
            </div>
          </div>
        </div>
      )}

      {/* Page Toolbar */}
      <div className="bg-card border border-border rounded-lg p-4 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <SearchBar
              placeholder="Search by clinic name or owner email..."
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
              }}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <FilterDropdown activeCount={activeFilterCount} onClear={clearFilters}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-foreground block">Subscription Plan</Label>
                  <select
                    value={planFilter}
                    onChange={(e) => setPlanFilter(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">All Plans</option>
                    <option value="Starter">Starter</option>
                    <option value="Professional">Professional</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-foreground block">Subscription Status</Label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </FilterDropdown>

            <MoreOptions
              onExportExcel={handleExportExcel}
              onExportPdf={handleExportPdf}
            />
          </div>
        </div>

        {/* Filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border animate-in fade-in duration-150">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Filters:</span>
            {planFilter && (
              <span className="inline-flex items-center gap-1 bg-primary/5 text-primary border border-primary/20 rounded-full px-2.5 py-0.5 text-xs font-medium uppercase">
                Plan: {planFilter}
                <button onClick={() => setPlanFilter("")} className="hover:text-primary-700 font-bold ml-0.5">×</button>
              </span>
            )}
            {statusFilter && (
              <span className="inline-flex items-center gap-1 bg-primary/5 text-primary border border-primary/20 rounded-full px-2.5 py-0.5 text-xs font-medium uppercase">
                Status: {statusFilter === "Active" ? "Active" : "Inactive"}
                <button onClick={() => setStatusFilter("")} className="hover:text-primary-700 font-bold ml-0.5">×</button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-foreground font-semibold underline underline-offset-2 ml-1"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Table Container with sticky header */}
      <div className="flex-1 bg-card border border-border rounded-lg shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        <div className="overflow-x-auto flex-1 relative">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/80 border-b border-border sticky top-0 z-20 backdrop-blur-xs">
              <tr>
                <th className="w-12 py-3.5 px-4 text-center">
                  <Checkbox
                    checked={sortedSubscriptions.length > 0 && sortedSubscriptions.every(s => selectedRowIds.includes(s.id))}
                    onCheckedChange={handleSelectAllRows}
                    aria-label="Select all subscribers"
                  />
                </th>
                <th className="py-3.5 px-6 text-sm font-semibold text-foreground"><button type="button" onClick={() => handleSort("clinicName")} className="whitespace-nowrap" aria-label="Sort by Clinic Name">Clinic Name{getSortIcon("clinicName")}</button></th>
                <th className="py-3.5 px-6 text-sm font-semibold text-foreground"><button type="button" onClick={() => handleSort("ownerEmail")} className="whitespace-nowrap" aria-label="Sort by Owner Email">Owner Email{getSortIcon("ownerEmail")}</button></th>
                <th className="py-3.5 px-6 text-sm font-semibold text-foreground"><button type="button" onClick={() => handleSort("planName")} className="whitespace-nowrap" aria-label="Sort by Subscription Plan">Subscription Plan{getSortIcon("planName")}</button></th>
                <th className="py-3.5 px-6 text-sm font-semibold text-foreground"><button type="button" onClick={() => handleSort("branchesAllowed")} className="whitespace-nowrap" aria-label="Sort by Branch Limit">Branch Limit{getSortIcon("branchesAllowed")}</button></th>
                <th className="py-3.5 px-6 text-sm font-semibold text-foreground"><button type="button" onClick={() => handleSort("providersAllowed")} className="whitespace-nowrap" aria-label="Sort by Provider Limit">Provider Limit{getSortIcon("providersAllowed")}</button></th>
                <th className="py-3.5 px-6 text-sm font-semibold text-foreground"><button type="button" onClick={() => handleSort("patientsAllowed")} className="whitespace-nowrap" aria-label="Sort by Patient Limit">Patient Limit{getSortIcon("patientsAllowed")}</button></th>
                <th className="py-3.5 px-6 text-sm font-semibold text-foreground"><button type="button" onClick={() => handleSort("aiUsage")} className="whitespace-nowrap" aria-label="Sort by AI Volume">AI Volume{getSortIcon("aiUsage")}</button></th>
                <th className="py-3.5 px-6 text-sm font-semibold text-foreground"><button type="button" onClick={() => handleSort("paymentStatus")} className="whitespace-nowrap" aria-label="Sort by Payment">Payment{getSortIcon("paymentStatus")}</button></th>
                <th className="py-3.5 px-6 text-sm font-semibold text-foreground"><button type="button" onClick={() => handleSort("subscriptionStatus")} className="whitespace-nowrap" aria-label="Sort by Status">Status{getSortIcon("subscriptionStatus")}</button></th>
                <th className="w-20 py-3.5 px-4 text-center text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedSubscriptions.map((sub) => {
                const isRowSelected = selectedRowIds.includes(sub.id);
                return (
                  <tr
                    key={sub.id}
                    className={`hover:bg-muted/30 transition-colors ${isRowSelected ? "bg-primary/5 hover:bg-primary/10" : ""}`}
                  >
                    <td className="py-3.5 px-4 text-center">
                      <Checkbox
                        checked={isRowSelected}
                        onCheckedChange={(checked) => handleSelectRow(sub.id, !!checked)}
                        aria-label={`Select subscriber ${sub.clinicName}`}
                      />
                    </td>
                    <td className="px-6 py-3.5">
                      <button
                        onClick={() => handleViewDetails(sub)}
                        className="text-sm font-semibold text-primary hover:underline text-left block"
                      >
                        {sub.clinicName}
                      </button>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-neutral-600 dark:text-neutral-300 font-medium">
                      {sub.ownerEmail}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                        {sub.planName}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-sm font-medium font-mono text-foreground">
                      {sub.branchesUsed} / {sub.branchesAllowed}
                    </td>
                    <td className="px-6 py-3.5 text-sm font-medium font-mono text-foreground">
                      {sub.providersUsed} / {sub.providersAllowed}
                    </td>
                    <td className="px-6 py-3.5 text-sm font-medium font-mono text-foreground">
                      {sub.patientsUsed} / {sub.patientsAllowed}
                    </td>
                    <td className="px-6 py-3.5 text-sm font-medium font-mono text-foreground">
                      {sub.aiUsage}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge
                        variant="outline"
                        className={
                          sub.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900"
                            : sub.paymentStatus === "Failed"
                            ? "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/25 dark:text-red-400 dark:border-red-900"
                            : "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900"
                        }
                      >
                        {sub.paymentStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge
                        variant="outline"
                        className={
                          sub.subscriptionStatus === "Active"
                            ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900"
                            : "bg-red-100 text-red-700 border-red-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700"
                        }
                      >
                        {sub.subscriptionStatus === "Active" ? "Active" : "Suspended"}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-center relative">
                      <div className="inline-block text-left">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setActiveMenuRowId(activeMenuRowId === sub.id ? null : sub.id)}
                          className="h-8 w-8 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full flex items-center justify-center text-neutral-500 hover:text-foreground"
                          title="Actions"
                        >
                          <MoreVertical className="w-4.5 h-4.5" />
                        </Button>

                        {activeMenuRowId === sub.id && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setActiveMenuRowId(null)} />
                            <div className="absolute right-0 mt-1 w-44 bg-card border border-border rounded-lg shadow-md z-40 py-1 overflow-hidden">
                              <button
                                onClick={() => handleViewDetails(sub)}
                                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4 text-neutral-500" />
                                View Profile
                              </button>
                              {sub.subscriptionStatus === "Active" && (
                                <button
                                  onClick={() => handleSuspendSingle(sub.id)}
                                  className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/5 flex items-center gap-2 border-t border-border"
                                >
                                  <ShieldAlert className="w-4 h-4" />
                                  Suspend Account
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredSubscriptions.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-16 text-center text-sm text-muted-foreground">
                    <AlertCircle className="w-12 h-12 text-muted-foreground/45 mb-3 mx-auto" />
                    <p className="font-semibold text-foreground mb-1">No Subscribers Found</p>
                    <p className="text-xs">Adjust your search parameters or query filters to find subscriptions.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Bulk Action Toolbar */}
      {selectedRowIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900 dark:bg-neutral-950 text-white rounded-lg shadow-xl px-4 py-3 flex items-center gap-4 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 border border-neutral-800">
          <span className="text-xs font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/25">
            {selectedRowIds.length} Selected
          </span>
          <div className="h-4 w-px bg-neutral-800" />
          <div className="flex items-center gap-2">
            <Button
              onClick={handleBulkSuspend}
              className="bg-destructive/10 hover:bg-destructive/20 text-red-400 hover:text-red-300 border border-destructive/20 text-xs h-8 px-3 rounded-md flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
              Suspend Selected
            </Button>
            <Button
              variant="ghost"
              onClick={() => setSelectedRowIds([])}
              className="text-neutral-400 hover:text-white text-xs h-8 px-2"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Right Drawer showing Subscriber Details */}
      {isDrawerOpen && selectedSubscription && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 animate-in fade-in duration-200"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="fixed right-0 top-0 h-full w-[500px] bg-card border-l border-border z-50 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Subscription Status
                </h2>
                <p className="text-sm text-primary font-mono mt-1">
                  {selectedSubscription.clinicName}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDrawerOpen(false)}
                className="h-8 w-8 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full flex items-center justify-center"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Subscriber Details Card */}
              <div className="bg-muted/30 border border-border rounded-lg p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account Status</span>
                  <Badge
                    variant="outline"
                    className={
                      selectedSubscription.subscriptionStatus === "Active"
                        ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900"
                        : "bg-red-100 text-red-700 border-red-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700"
                    }
                  >
                    {selectedSubscription.subscriptionStatus === "Active" ? "Active" : "Suspended"}
                  </Badge>
                </div>
                <div className="h-px bg-border" />
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-semibold block mb-0.5">Owner Email</span>
                    <span className="font-semibold text-foreground">{selectedSubscription.ownerEmail}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-semibold block mb-0.5">Tier Plan</span>
                    <span className="font-semibold text-foreground">{selectedSubscription.planName} Tier</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-semibold block mb-0.5">Start Date</span>
                    <span className="font-semibold text-foreground font-mono">{selectedSubscription.startDate}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-semibold block mb-0.5">Expiry Date</span>
                    <span className="font-semibold text-foreground font-mono">{selectedSubscription.expiryDate}</span>
                  </div>
                </div>
              </div>

              {/* Resource Metrics & Progress Bars */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Resource Utilization</h3>
                <div className="space-y-4 border border-border rounded-lg p-4 bg-white dark:bg-neutral-950 shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <Label className="text-xs font-semibold text-foreground">Branch Allocations</Label>
                      <span className="text-xs font-mono font-bold text-foreground">
                        {selectedSubscription.branchesUsed} of {selectedSubscription.branchesAllowed}
                      </span>
                    </div>
                    <Progress
                      value={calculateUsagePercentage(selectedSubscription.branchesUsed, selectedSubscription.branchesAllowed)}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <Label className="text-xs font-semibold text-foreground">Provider User Accounts</Label>
                      <span className="text-xs font-mono font-bold text-foreground">
                        {selectedSubscription.providersUsed} of {selectedSubscription.providersAllowed}
                      </span>
                    </div>
                    <Progress
                      value={calculateUsagePercentage(selectedSubscription.providersUsed, selectedSubscription.providersAllowed)}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <Label className="text-xs font-semibold text-foreground">Registered Patients</Label>
                      <span className="text-xs font-mono font-bold text-foreground">
                        {selectedSubscription.patientsUsed} of {selectedSubscription.patientsAllowed}
                      </span>
                    </div>
                    <Progress
                      value={calculateUsagePercentage(selectedSubscription.patientsUsed, selectedSubscription.patientsAllowed)}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-foreground">AI Assist Credit Balance</Label>
                      <span className="text-xs font-mono font-bold text-foreground">{selectedSubscription.aiUsage} calls</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Preferences toggles */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Service Preferences</h3>
                <div className="border border-border rounded-lg p-4 space-y-3 bg-white dark:bg-neutral-950 shadow-xs">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoRenew" className="text-sm font-semibold cursor-pointer text-foreground">Automatic Renewal</Label>
                    <Switch id="autoRenew" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sendReminder" className="text-sm font-semibold cursor-pointer text-foreground">Send Quota Alerts</Label>
                    <Switch id="sendReminder" defaultChecked />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border p-6 flex items-center justify-end gap-3 bg-muted/10">
              <Button variant="outline" onClick={() => setIsDrawerOpen(false)} className="h-10">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  alert(`Upgrading subscription plan for ${selectedSubscription.clinicName}`);
                  setIsDrawerOpen(false);
                }}
                className="h-10 bg-primary hover:bg-primary/95 text-white font-medium shadow-sm"
              >
                Upgrade Tier Plan
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
