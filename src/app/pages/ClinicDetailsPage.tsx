import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { 
  Building2, 
  ArrowLeft, 
  Calendar, 
  CreditCard, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Users, 
  ArrowUp, 
  ArrowDown, 
  History,
  DollarSign,
  FileText,
  Mail,
  Phone,
  MapPin,
  User,
  Package
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";

interface Clinic {
  id: string;
  name: string;
  status: "active" | "suspended";
  planType: string;
  createdDate: string;
  email: string;
  phone: string;
  address: string;
  adminName: string;
  activityHistory: {
    type: "suspended" | "reactivated";
    date: string;
    reason?: string;
    actionBy: string;
  }[];
  usageMetrics: {
    activeUsers: number;
    totalPatients: number;
    appointmentsThisMonth: number;
    storageUsed: string;
    storageLimit: string;
  };
  subscriptionDetails: {
    startDate: string;
    endDate: string;
    billingCycle: string;
    nextBilling: string;
    amount: string;
  };
  revenueData: {
    totalRevenue: string;
    monthlyRevenue: string;
    lastPayment: string;
    lastPaymentDate: string;
    averageMonthlyRevenue: string;
    paymentHistory: {
      id: string;
      date: string;
      amount: string;
      status: string;
      method: string;
      invoice: string;
    }[];
  };
}

const mockClinics: Clinic[] = [
  {
    id: "CLN001",
    name: "HealthSpine Clinic",
    status: "active",
    planType: "Enterprise",
    createdDate: "2024-01-15",
    email: "admin@healthspine.com",
    phone: "+1 (555) 123-4567",
    address: "123 Medical Plaza, New York, NY 10001",
    adminName: "Dr. Sarah Johnson",
    activityHistory: [],
    usageMetrics: {
      activeUsers: 45,
      totalPatients: 2340,
      appointmentsThisMonth: 342,
      storageUsed: "45.2",
      storageLimit: "100",
    },
    subscriptionDetails: {
      startDate: "2024-01-15",
      endDate: "2025-01-15",
      billingCycle: "Annual",
      nextBilling: "2025-01-15",
      amount: "$12,000",
    },
    revenueData: {
      totalRevenue: "$12,000",
      monthlyRevenue: "$1,000",
      lastPayment: "$12,000",
      lastPaymentDate: "2024-01-15",
      averageMonthlyRevenue: "$1,000",
      paymentHistory: [
        { id: "PAY001", date: "2024-01-15", amount: "$12,000", status: "completed", method: "Credit Card", invoice: "INV-2024-001" },
      ],
    },
  },
  {
    id: "CLN002",
    name: "SpineCare Medical Center",
    status: "active",
    planType: "Professional",
    createdDate: "2024-02-20",
    email: "contact@spinecare.com",
    phone: "+1 (555) 234-5678",
    address: "456 Healthcare Ave, Los Angeles, CA 90001",
    adminName: "Dr. Michael Chen",
    activityHistory: [],
    usageMetrics: {
      activeUsers: 12,
      totalPatients: 450,
      appointmentsThisMonth: 67,
      storageUsed: "12.8",
      storageLimit: "50",
    },
    subscriptionDetails: {
      startDate: "2024-02-20",
      endDate: "2025-02-20",
      billingCycle: "Annual",
      nextBilling: "2025-02-20",
      amount: "$6,000",
    },
    revenueData: {
      totalRevenue: "$6,000",
      monthlyRevenue: "$500",
      lastPayment: "$6,000",
      lastPaymentDate: "2024-02-20",
      averageMonthlyRevenue: "$500",
      paymentHistory: [
        { id: "PAY002", date: "2024-02-20", amount: "$6,000", status: "completed", method: "Credit Card", invoice: "INV-2024-002" },
      ],
    },
  },
  {
    id: "CLN003",
    name: "Orthopedic Associates",
    status: "suspended",
    planType: "Basic",
    createdDate: "2023-11-10",
    email: "info@orthoassoc.com",
    phone: "+1 (555) 345-6789",
    address: "789 Wellness Blvd, Chicago, IL 60601",
    adminName: "Dr. Emily Roberts",
    activityHistory: [
      {
        type: "suspended",
        date: "2024-02-10",
        reason: "Non-payment of subscription fees for 2 consecutive months",
        actionBy: "Admin - John Smith",
      },
    ],
    usageMetrics: {
      activeUsers: 8,
      totalPatients: 890,
      appointmentsThisMonth: 0,
      storageUsed: "8.5",
      storageLimit: "25",
    },
    subscriptionDetails: {
      startDate: "2023-11-10",
      endDate: "2024-11-10",
      billingCycle: "Monthly",
      nextBilling: "N/A",
      amount: "$299",
    },
    revenueData: {
      totalRevenue: "$3,588",
      monthlyRevenue: "$0",
      lastPayment: "$299",
      lastPaymentDate: "2023-12-10",
      averageMonthlyRevenue: "$299",
      paymentHistory: [
        { id: "PAY012", date: "2023-12-10", amount: "$299", status: "completed", method: "Credit Card", invoice: "INV-2023-012" },
        { id: "PAY011", date: "2023-11-10", amount: "$299", status: "completed", method: "Credit Card", invoice: "INV-2023-011" },
      ],
    },
  },
  {
    id: "CLN004",
    name: "Advanced Spine Institute",
    status: "active",
    planType: "Professional",
    createdDate: "2023-08-05",
    email: "admin@advancedspine.com",
    phone: "+1 (555) 456-7890",
    address: "321 Medical Center Dr, Houston, TX 77001",
    adminName: "Dr. James Wilson",
    activityHistory: [
      {
        type: "suspended",
        date: "2023-12-15",
        reason: "Terms of Service violation - data breach investigation",
        actionBy: "Admin - Sarah Connor",
      },
      {
        type: "reactivated",
        date: "2024-01-20",
        actionBy: "Admin - Sarah Connor",
      },
      {
        type: "suspended",
        date: "2024-03-10",
        reason: "Payment processing issue with credit card",
        actionBy: "System - Auto-suspend",
      },
      {
        type: "reactivated",
        date: "2024-03-12",
        actionBy: "Admin - System Auto-reactivate",
      },
    ],
    usageMetrics: {
      activeUsers: 28,
      totalPatients: 1560,
      appointmentsThisMonth: 234,
      storageUsed: "34.7",
      storageLimit: "50",
    },
    subscriptionDetails: {
      startDate: "2023-08-05",
      endDate: "2024-08-05",
      billingCycle: "Annual",
      nextBilling: "2024-08-05",
      amount: "$6,000",
    },
    revenueData: {
      totalRevenue: "$6,000",
      monthlyRevenue: "$500",
      lastPayment: "$6,000",
      lastPaymentDate: "2023-08-05",
      averageMonthlyRevenue: "$500",
      paymentHistory: [
        { id: "PAY008", date: "2023-08-05", amount: "$6,000", status: "completed", method: "Bank Transfer", invoice: "INV-2023-008" },
      ],
    },
  },
];

export default function ClinicDetailsPage() {
  const { clinicId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState("");
  const [showReactivateDialog, setShowReactivateDialog] = useState(false);
  const [reactivateReason, setReactivateReason] = useState("");
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showDowngradeDialog, setShowDowngradeDialog] = useState(false);
  const [showExtendTrialDialog, setShowExtendTrialDialog] = useState(false);

  const clinic = mockClinics.find((c) => c.id === clinicId);

  if (!clinic) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Clinic Not Found</h2>
          <p className="text-sm text-muted-foreground mb-6">The clinic you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/dashboard/clinics")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Clinics
          </Button>
        </div>
      </div>
    );
  }

  const [selectedClinic, setSelectedClinic] = useState<Clinic>(clinic);

  const getStatusConfig = (status: string) => {
    const configs = {
      active: {
        badge: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
        icon: CheckCircle,
        iconColor: "text-emerald-600"
      },
      suspended: {
        badge: "bg-rose-500/10 text-rose-700 border-rose-200",
        icon: AlertCircle,
        iconColor: "text-rose-600"
      },
    };
    return configs[status as keyof typeof configs];
  };

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === "suspended") {
      setShowSuspendDialog(true);
    } else if (newStatus === "active" && selectedClinic) {
      setShowReactivateDialog(true);
    }
  };

  const handleReactivateConfirm = () => {
    if (selectedClinic && reactivateReason.trim()) {
      const newReactivation = {
        type: "reactivated" as const,
        date: new Date().toISOString(),
        reason: reactivateReason.trim(),
        actionBy: "Admin - Current User",
      };
      setSelectedClinic({
        ...selectedClinic,
        status: "active",
        activityHistory: [newReactivation, ...(selectedClinic.activityHistory || [])],
      });
      setShowReactivateDialog(false);
      setReactivateReason("");
    }
  };

  const handleSuspendConfirm = () => {
    if (selectedClinic && suspensionReason.trim()) {
      const newSuspension = {
        type: "suspended" as const,
        date: new Date().toISOString(),
        reason: suspensionReason.trim(),
        actionBy: "Admin - Current User",
      };
      setSelectedClinic({
        ...selectedClinic,
        status: "suspended",
        activityHistory: [newSuspension, ...(selectedClinic.activityHistory || [])],
      });
      setShowSuspendDialog(false);
      setSuspensionReason("");
    }
  };

  const statusConfig = getStatusConfig(selectedClinic.status);
  const StatusIcon = statusConfig.icon;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "subscription", label: "Subscription & Billing" },
    { id: "activity", label: "Activity & History" },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header Section */}
      <div className="bg-card border-b border-border px-6 py-5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard/clinics")}
          className="mb-4 h-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Clinics
        </Button>
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{selectedClinic.name}</h1>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-sm text-muted-foreground">{selectedClinic.id}</span>
                <Badge variant="outline" className={statusConfig.badge}>
                  {selectedClinic.status.charAt(0).toUpperCase() + selectedClinic.status.slice(1)}
                </Badge>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                  {selectedClinic.planType}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {selectedClinic.status === "suspended" ? (
              <Button onClick={() => handleStatusChange("active")} size="sm" className="h-9">
                <CheckCircle className="w-4 h-4 mr-2" />
                Reactivate
              </Button>
            ) : (
              <Button variant="outline" onClick={() => handleStatusChange("suspended")} size="sm" className="h-9">
                <AlertCircle className="w-4 h-4 mr-2" />
                Suspend
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-5 border-t border-border pt-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground mb-1">Member Since</p>
                <p className="text-lg font-semibold text-foreground">
                  {new Date(selectedClinic.createdDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>

              <div className="bg-card rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
                <p className="text-lg font-semibold text-foreground">{selectedClinic.revenueData.totalRevenue}</p>
              </div>

              <div className="bg-card rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground mb-1">Subscription Plan</p>
                <p className="text-lg font-semibold text-foreground">{selectedClinic.planType}</p>
              </div>
            </div>

            {/* Usage Metrics */}
            <div className="bg-card rounded-lg border border-border">
              <div className="border-b border-border px-5 py-4">
                <h3 className="text-base font-semibold text-foreground">Usage Metrics</h3>
              </div>
              
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Active Users</p>
                    <p className="text-2xl font-semibold text-foreground mb-1">{selectedClinic.usageMetrics.activeUsers}</p>
                    <p className="text-xs text-muted-foreground">Staff with system access</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Total Patients</p>
                    <p className="text-2xl font-semibold text-foreground mb-1">{selectedClinic.usageMetrics.totalPatients.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Patient records</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Appointments</p>
                    <p className="text-2xl font-semibold text-foreground mb-1">{selectedClinic.usageMetrics.appointmentsThisMonth}</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-card rounded-lg border border-border">
              <div className="border-b border-border px-5 py-4">
                <h3 className="text-base font-semibold text-foreground">Contact Information</h3>
              </div>
              
              <div className="p-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Email Address</p>
                    <p className="text-sm text-foreground">{selectedClinic.email}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Phone Number</p>
                    <p className="text-sm text-foreground">{selectedClinic.phone}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Admin Contact</p>
                    <p className="text-sm text-foreground">{selectedClinic.adminName}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Office Address</p>
                    <p className="text-sm text-foreground">{selectedClinic.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscription & Billing Tab */}
        {activeTab === "subscription" && (
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="bg-primary text-white rounded-lg p-6">
              <p className="text-white/80 text-sm mb-2">Current Subscription Plan</p>
              <h2 className="text-3xl font-bold mb-6">{selectedClinic.planType}</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-white/80 text-sm mb-1">Amount</p>
                  <p className="text-xl font-semibold">{selectedClinic.subscriptionDetails.amount}</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm mb-1">Billing Cycle</p>
                  <p className="text-xl font-semibold">{selectedClinic.subscriptionDetails.billingCycle}</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm mb-1">Next Billing</p>
                  <p className="text-xl font-semibold">{selectedClinic.subscriptionDetails.nextBilling}</p>
                </div>
              </div>
            </div>

            {/* Subscription Actions */}
            <div className="bg-card rounded-lg border border-border p-5">
              <h3 className="text-base font-semibold text-foreground mb-4">Subscription Actions</h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setShowUpgradeDialog(true)}
                  className="p-3 bg-card rounded-lg border border-border hover:border-primary transition-colors text-left"
                >
                  <p className="text-sm font-medium text-foreground">Upgrade Plan</p>
                  <p className="text-xs text-muted-foreground mt-1">Increase tier</p>
                </button>
                <button
                  onClick={() => setShowDowngradeDialog(true)}
                  className="p-3 bg-card rounded-lg border border-border hover:border-primary transition-colors text-left"
                >
                  <p className="text-sm font-medium text-foreground">Downgrade Plan</p>
                  <p className="text-xs text-muted-foreground mt-1">Decrease tier</p>
                </button>
                <button
                  onClick={() => setShowExtendTrialDialog(true)}
                  className="p-3 bg-card rounded-lg border border-border hover:border-primary transition-colors text-left"
                >
                  <p className="text-sm font-medium text-foreground">Extend Trial</p>
                  <p className="text-xs text-muted-foreground mt-1">Add more days</p>
                </button>
              </div>
            </div>

            {/* Revenue Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground mb-2">Total Revenue</p>
                <p className="text-2xl font-semibold text-foreground">{selectedClinic.revenueData.totalRevenue}</p>
                <p className="text-xs text-emerald-600 mt-1">Lifetime earnings</p>
              </div>
              <div className="bg-card rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground mb-2">Monthly Average</p>
                <p className="text-2xl font-semibold text-foreground">{selectedClinic.revenueData.averageMonthlyRevenue}</p>
                <p className="text-xs text-blue-600 mt-1">Per month</p>
              </div>
              <div className="bg-card rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground mb-2">Last Payment</p>
                <p className="text-2xl font-semibold text-foreground">{selectedClinic.revenueData.lastPayment}</p>
                <p className="text-xs text-purple-600 mt-1">
                  {selectedClinic.revenueData.lastPaymentDate === "N/A"
                    ? "No payments yet"
                    : new Date(selectedClinic.revenueData.lastPaymentDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-card rounded-lg border border-border">
              <div className="border-b border-border px-5 py-4">
                <h3 className="text-base font-semibold text-foreground">Payment History</h3>
              </div>
              {selectedClinic.revenueData.paymentHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Transaction</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Amount</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Method</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {selectedClinic.revenueData.paymentHistory.map((payment) => (
                        <tr key={payment.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-5 py-3">
                            <p className="text-sm font-medium text-foreground">{payment.id}</p>
                          </td>
                          <td className="px-5 py-3">
                            <p className="text-sm text-muted-foreground">{new Date(payment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                          </td>
                          <td className="px-5 py-3">
                            <p className="text-sm font-semibold text-foreground">{payment.amount}</p>
                          </td>
                          <td className="px-5 py-3">
                            <p className="text-sm text-muted-foreground">{payment.method}</p>
                          </td>
                          <td className="px-5 py-3">
                            <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200">
                              {payment.status}
                            </Badge>
                          </td>
                          <td className="px-5 py-3">
                            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 h-7">
                              {payment.invoice}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-sm text-muted-foreground">No payment history available</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Activity & History Tab */}
        {activeTab === "activity" && (
          <div className="space-y-6">
            {/* Activity History */}
            {selectedClinic.activityHistory && selectedClinic.activityHistory.length > 0 ? (
              <div className="bg-card rounded-lg border border-border">
                <div className="border-b border-border px-5 py-4">
                  <h3 className="text-base font-semibold text-foreground">Activity History</h3>
                </div>
                <div className="p-5">
                  <div className="space-y-4">
                    {selectedClinic.activityHistory.map((activity, index) => (
                      <div key={index} className="p-4 bg-muted/30 rounded-lg border border-border">
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-sm font-medium text-foreground">
                            {activity.type === "reactivated" ? "Reactivated" : "Suspended"}
                          </p>
                          <Badge variant="outline" className={activity.type === "reactivated" ? "bg-emerald-500/10 text-emerald-700 border-emerald-200" : "bg-rose-500/10 text-rose-700 border-rose-200"}>
                            {activity.type === "reactivated" ? "Active" : "Suspended"}
                          </Badge>
                        </div>
                        {activity.reason && (
                          <p className="text-sm text-muted-foreground mb-2">{activity.reason}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>By: {activity.actionBy}</span>
                          <span>•</span>
                          <span>{new Date(activity.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-lg border border-border p-12 text-center">
                <p className="text-sm text-muted-foreground">No activity history</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Suspend Dialog */}
      {showSuspendDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg border border-border p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Suspend Clinic</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Please provide a reason for suspending this clinic. This action will restrict access to their account.
            </p>
            <Input
              placeholder="Enter suspension reason..."
              value={suspensionReason}
              onChange={(e) => setSuspensionReason(e.target.value)}
              className="mb-4"
              style={{ border: "2px solid #D1D5DB" }}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowSuspendDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSuspendConfirm}
                disabled={!suspensionReason.trim()}
                className="bg-rose-600 hover:bg-rose-700"
              >
                Suspend Clinic
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reactivate Dialog */}
      {showReactivateDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg border border-border p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Reactivate Clinic</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Please provide a reason for reactivating this clinic.
            </p>
            <Input
              placeholder="Enter reactivation reason..."
              value={reactivateReason}
              onChange={(e) => setReactivateReason(e.target.value)}
              className="mb-4"
              style={{ border: "2px solid #D1D5DB" }}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowReactivateDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleReactivateConfirm}
                disabled={!reactivateReason.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Reactivate Clinic
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}