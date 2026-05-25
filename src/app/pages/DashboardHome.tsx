import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building2,
  CreditCard,
  Activity,
  AlertCircle,
  Calendar,
  ArrowUpRight,
  Zap,
  RefreshCw,
  Bell,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

const revenueChartData = [
  { date: "Jan 15", revenue: 72000, subscriptions: 310 },
  { date: "Jan 22", revenue: 78000, subscriptions: 315 },
  { date: "Jan 29", revenue: 81000, subscriptions: 320 },
  { date: "Feb 5",  revenue: 85000, subscriptions: 325 },
  { date: "Feb 12", revenue: 89000, subscriptions: 330 },
  { date: "Feb 19", revenue: 95000, subscriptions: 338 },
  { date: "Feb 23", revenue: 87450, subscriptions: 342 },
];

const alertsData = [
  {
    id: 1,
    type: "warning",
    title: "Payment Failures",
    count: 12,
    message: "12 failed payments require your attention",
    colorClass: "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900",
    iconClass: "text-amber-600 dark:text-amber-400",
  },
  {
    id: 2,
    type: "urgent",
    title: "Critical Support Tickets",
    count: 7,
    message: "7 urgent support tickets are pending resolution",
    colorClass: "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900",
    iconClass: "text-red-600 dark:text-red-400",
  },
  {
    id: 3,
    type: "info",
    title: "Suspended Accounts",
    count: 3,
    message: "3 clinic accounts have been automatically suspended",
    colorClass: "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900",
    iconClass: "text-blue-600 dark:text-blue-400",
  },
];

const recentActivities = [
  { id: 1, clinic: "Spine Health Center",      action: "Upgraded to Professional plan",    time: "2 hours ago",  type: "upgrade" },
  { id: 2, clinic: "Back Care Clinic",          action: "New subscription created",          time: "3 hours ago",  type: "new" },
  { id: 3, clinic: "Wellness Spine Clinic",     action: "Payment received — $299",           time: "5 hours ago",  type: "payment" },
  { id: 4, clinic: "Advanced Chiropractic",     action: "Account reactivated",               time: "6 hours ago",  type: "reactivated" },
  { id: 5, clinic: "ProHealth Spine Center",    action: "Subscription auto-renewed",         time: "8 hours ago",  type: "renewal" },
];

const quickMetrics = [
  { label: "MRR",          value: "$87,450", subtext: "Monthly Recurring Revenue",  trend: "+4.2%", up: true },
  { label: "Churn Rate",   value: "2.3%",    subtext: "Last 30 days",               trend: "-0.4%", up: false },
  { label: "Avg. Revenue", value: "$256",    subtext: "Per clinic per month",        trend: "+1.8%", up: true },
];

const activityColors: Record<string, { bg: string; text: string }> = {
  upgrade:     { bg: "bg-purple-100 dark:bg-purple-950/30", text: "text-purple-600 dark:text-purple-400" },
  new:         { bg: "bg-blue-100 dark:bg-blue-950/30",    text: "text-blue-600 dark:text-blue-400" },
  payment:     { bg: "bg-emerald-100 dark:bg-emerald-950/30", text: "text-emerald-600 dark:text-emerald-400" },
  reactivated: { bg: "bg-amber-100 dark:bg-amber-950/30",  text: "text-amber-600 dark:text-amber-400" },
  renewal:     { bg: "bg-neutral-100 dark:bg-neutral-800", text: "text-neutral-600 dark:text-neutral-400" },
};

export default function DashboardHome() {
  const [dateRange, setDateRange] = useState<string>("last30");
  const [fromDate, setFromDate] = useState<string>("2026-01-24");
  const [toDate,   setToDate]   = useState<string>("2026-02-23");

  const handleQuickRange = (range: string) => {
    setDateRange(range);
    const today = new Date("2026-02-23");
    const to    = today.toISOString().split("T")[0];
    const from  = new Date(today);
    if (range === "last7")  from.setDate(today.getDate() - 7);
    else if (range === "last15") from.setDate(today.getDate() - 15);
    else from.setDate(today.getDate() - 30);
    setFromDate(from.toISOString().split("T")[0]);
    setToDate(to);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-1">
            <span>Home</span>
            <span>/</span>
            <span className="text-foreground font-medium">Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, Super Admin — here's a snapshot of the platform health today.
          </p>
        </div>
      </div>

      {/* ── Date Range Toolbar ──────────────────────────────────── */}
      <div className="bg-card border border-border rounded-lg px-4 py-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick pills */}
          <div className="flex items-center gap-1.5">
            {[
              { key: "last7",  label: "Last 7 days" },
              { key: "last15", label: "Last 15 days" },
              { key: "last30", label: "Last 30 days" },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => handleQuickRange(opt.key)}
                className={`px-3 h-8 text-xs font-semibold rounded-lg border-2 transition-colors ${
                  dateRange === opt.key
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-transparent bg-muted text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Custom range */}
          <div className="flex items-center gap-2 ml-auto">
            {[
              { label: "From", val: fromDate, setter: (v: string) => { setFromDate(v); setDateRange(""); } },
              { label: "To",   val: toDate,   setter: (v: string) => { setToDate(v);   setDateRange(""); } },
            ].map(({ label, val, setter }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground font-semibold">{label}</span>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={val}
                    onChange={(e) => setter(e.target.value)}
                    className="h-8 pl-7 pr-2 border border-input rounded-lg text-xs text-foreground bg-background focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue",        value: "$1,049,400", subtext: "Lifetime SaaS billing",    icon: DollarSign, color: "#10B981", badge: "+8.4%", up: true  },
          { label: "Active Subscriptions", value: "342",        subtext: "Across all clinic tiers",  icon: CreditCard, color: "#8B5CF6", badge: "+5",    up: true  },
          { label: "Platform Users",       value: "4,856",      subtext: "Provider + admin accounts", icon: Users,      color: "#F59E0B", badge: "+62",   up: true  },
          { label: "Active Clinics",       value: "128",        subtext: "Operational sites",         icon: Building2,  color: "#3B82F6", badge: "-2",    up: false },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card border border-border rounded-lg p-5 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between gap-3">
              <div className="flex items-start justify-between">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: stat.color + "15" }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  stat.up
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                    : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                }`}>
                  {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.badge}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground leading-none">{stat.value}</h3>
                <p className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Revenue Chart ────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-lg shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Revenue & Subscription Trend</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Monthly recurring revenue vs active subscriptions over the selected period</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="text-xs text-muted-foreground font-medium">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
              <span className="text-xs text-muted-foreground font-medium">Subscriptions</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueChartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="colorSubscriptions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#8B5CF6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--border))" tickLine={false} />
              <YAxis yAxisId="left"  tick={{ fontSize: 11 }} stroke="hsl(var(--border))" tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="hsl(var(--border))" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                formatter={(value: number, name: string) =>
                  name === "revenue" ? [`$${value.toLocaleString()}`, "Revenue"] : [value, "Subscriptions"]
                }
              />
              <Area yAxisId="left"  type="monotone" dataKey="revenue"       stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)"       dot={false} />
              <Area yAxisId="right" type="monotone" dataKey="subscriptions"  stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorSubscriptions)"  dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Bottom Row ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Activity ─ 2/3 col */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg shadow-xs overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Recent Activity</h2>
            <span className="text-xs text-muted-foreground font-medium">Last 24 hrs</span>
          </div>
          <div className="flex-1 divide-y divide-border">
            {recentActivities.map((activity) => {
              const ac = activityColors[activity.type] ?? activityColors.renewal;
              return (
                <div key={activity.id} className="flex items-start gap-3 px-6 py-4 hover:bg-muted/20 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${ac.bg}`}>
                    <Activity className={`w-4 h-4 ${ac.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{activity.clinic}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap mt-0.5">{activity.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right sidebar: Alerts + Quick Metrics */}
        <div className="space-y-6">

          {/* Alerts */}
          <div className="bg-card border border-border rounded-lg shadow-xs overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Alerts</h2>
            </div>
            <div className="p-4 space-y-3">
              {alertsData.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border flex items-start gap-2.5 ${alert.colorClass}`}>
                  <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${alert.iconClass}`} />
                  <div>
                    <p className="text-xs font-bold text-foreground">{alert.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="bg-card border border-border rounded-lg shadow-xs overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
              <Zap className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Quick Metrics</h2>
            </div>
            <div className="divide-y divide-border">
              {quickMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-xs font-bold text-foreground">{metric.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">{metric.subtext}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-foreground">{metric.value}</p>
                    <span className={`text-[10px] font-semibold ${metric.up ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                      {metric.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}