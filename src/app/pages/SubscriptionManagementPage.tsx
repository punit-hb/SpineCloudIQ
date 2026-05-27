import { Check, TrendingUp, Users, BarChart3 } from "lucide-react";
import { Badge } from "../components/ui/badge";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  activeSubscribers: number;
  features: string[];
  color: string;
  tier: "Starter" | "Pro" | "Enterprise";
}

const mockPlans: SubscriptionPlan[] = [
  {
    id: "PLAN001",
    name: "Basic",
    monthlyPrice: "$299",
    yearlyPrice: "$3,000",
    description: "Perfect for small clinics just getting started with digital health management.",
    activeSubscribers: 12,
    tier: "Starter",
    color: "#6366F1",
    features: [
      "Up to 5 users",
      "500 patient records",
      "Basic reporting",
      "Email support",
      "25 GB storage",
    ],
  },
  {
    id: "PLAN002",
    name: "Professional",
    monthlyPrice: "$599",
    yearlyPrice: "$6,000",
    description: "Ideal for growing practices with advanced workflows and analytics needs.",
    activeSubscribers: 34,
    tier: "Pro",
    color: "#10B981",
    features: [
      "Up to 25 users",
      "Unlimited patient records",
      "Advanced analytics",
      "Priority support",
      "50 GB storage",
      "Custom integrations",
    ],
  },
  {
    id: "PLAN003",
    name: "Enterprise",
    monthlyPrice: "$1,200",
    yearlyPrice: "$12,000",
    description: "Comprehensive solution for large healthcare organizations and multi-site operations.",
    activeSubscribers: 8,
    tier: "Enterprise",
    color: "#F59E0B",
    features: [
      "Unlimited users",
      "Unlimited patient records",
      "Custom reporting & analytics",
      "24/7 dedicated support",
      "100 GB storage",
      "API access",
      "White-label options",
      "Advanced security features",
    ],
  },
];

const tierBadge: Record<string, string> = {
  Starter:    "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900",
  Pro:        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900",
  Enterprise: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900",
};

export default function SubscriptionManagementPage() {
  const totalSubscribers = mockPlans.reduce((acc, p) => acc + p.activeSubscribers, 0);

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Subscription Plans</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Review available subscription tiers, pricing structure, included features, and active subscriber counts
        </p>
      </div>

      {/* Summary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border shadow-sm rounded-lg p-5 flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Active Clinics</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-bold text-foreground">{totalSubscribers}</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">Subscribed</span>
          </div>
        </div>
        <div className="bg-card border border-border shadow-sm rounded-lg p-5 flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Available Tier Plans</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-bold text-foreground">{mockPlans.length}</span>
            <span className="text-xs font-medium text-primary bg-primary/5 px-2 py-0.5 rounded-full">Active tiers</span>
          </div>
        </div>
        <div className="bg-card border border-border shadow-sm rounded-lg p-5 flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Top Tier</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-foreground">Professional</span>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full">34 clinics</span>
          </div>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mockPlans.map((plan) => (
          <div
            key={plan.id}
            className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
          >
            {/* Card top accent bar */}
            <div className="h-1 w-full" style={{ backgroundColor: plan.color }} />

            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                    <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${tierBadge[plan.tier]}`}>
                      {plan.tier}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{plan.description}</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="flex items-end gap-6 mt-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Monthly</p>
                  <p className="text-3xl font-extrabold text-foreground">{plan.monthlyPrice}</p>
                  <p className="text-[10px] text-muted-foreground">per month</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Annual</p>
                  <p className="text-xl font-bold text-foreground">{plan.yearlyPrice}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">Save ~17%</p>
                </div>
              </div>
            </div>

            {/* Subscriber stat */}
            <div className="px-6 py-3 bg-muted/30 flex items-center gap-2 border-b border-border">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-foreground">{plan.activeSubscribers} active clinics</span>
              <span className="ml-auto text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                {Math.round((plan.activeSubscribers / totalSubscribers) * 100)}% of total
              </span>
            </div>

            {/* Features list */}
            <div className="p-6 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Included Features</p>
              <ul className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground">
                    <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                      style={{ backgroundColor: plan.color + "20" }}>
                      <Check className="w-2.5 h-2.5" style={{ color: plan.color }} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
