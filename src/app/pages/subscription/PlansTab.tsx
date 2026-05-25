import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Plus, Edit, Copy, Archive, MoreVertical } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import Drawer from "../../components/Drawer";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";

const tabs = [
  { label: "Plans", path: "/dashboard/subscriptions/plans" },
  { label: "Features", path: "/dashboard/subscriptions/features" },
  { label: "Coupons", path: "/dashboard/subscriptions/coupons" },
];

interface Plan {
  id: string;
  name: string;
  code: string;
  billingCycle: string;
  price: number;
  maxClinics: number;
  maxProviders: number;
  maxPatients: number;
  aiLimit: number;
  status: "Active" | "Draft" | "Archived";
  createdDate: string;
}

const mockPlans: Plan[] = [
  {
    id: "1",
    name: "Starter Plan",
    code: "STARTER_MONTHLY",
    billingCycle: "Monthly",
    price: 49,
    maxClinics: 1,
    maxProviders: 3,
    maxPatients: 100,
    aiLimit: 50,
    status: "Active",
    createdDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Professional Plan",
    code: "PRO_MONTHLY",
    billingCycle: "Monthly",
    price: 149,
    maxClinics: 3,
    maxProviders: 10,
    maxPatients: 500,
    aiLimit: 200,
    status: "Active",
    createdDate: "2024-01-15",
  },
  {
    id: "3",
    name: "Enterprise Plan",
    code: "ENTERPRISE_MONTHLY",
    billingCycle: "Monthly",
    price: 499,
    maxClinics: 10,
    maxProviders: 50,
    maxPatients: 2000,
    aiLimit: 1000,
    status: "Active",
    createdDate: "2024-01-15",
  },
  {
    id: "4",
    name: "Starter Annual",
    code: "STARTER_YEARLY",
    billingCycle: "Yearly",
    price: 490,
    maxClinics: 1,
    maxProviders: 3,
    maxPatients: 100,
    aiLimit: 50,
    status: "Active",
    createdDate: "2024-01-15",
  },
];

export default function PlansTab() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    category: "Starter",
    publiclyVisible: true,
    billingCycle: "Monthly",
    basePrice: "",
    currency: "USD",
    setupFee: "",
    trialEnabled: false,
    trialDays: "",
    maxClinics: "",
    maxBranches: "",
    maxProviders: "",
    maxPatients: "",
    maxStorage: "",
    maxXrayUploads: "",
    maxAIRequests: "",
    insuranceBilling: false,
    stripeIntegration: true,
    paymentPlans: false,
    voiceToTextAI: false,
    clearinghouseIntegration: false,
    status: "Active",
    sortOrder: "",
  });

  const handleAddNew = () => {
    setEditingPlan(null);
    setFormData({
      name: "",
      code: "",
      description: "",
      category: "Starter",
      publiclyVisible: true,
      billingCycle: "Monthly",
      basePrice: "",
      currency: "USD",
      setupFee: "",
      trialEnabled: false,
      trialDays: "",
      maxClinics: "",
      maxBranches: "",
      maxProviders: "",
      maxPatients: "",
      maxStorage: "",
      maxXrayUploads: "",
      maxAIRequests: "",
      insuranceBilling: false,
      stripeIntegration: true,
      paymentPlans: false,
      voiceToTextAI: false,
      clearinghouseIntegration: false,
      status: "Active",
      sortOrder: "",
    });
    setIsDrawerOpen(true);
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      code: plan.code,
      description: "",
      category: "Professional",
      publiclyVisible: true,
      billingCycle: plan.billingCycle,
      basePrice: plan.price.toString(),
      currency: "USD",
      setupFee: "",
      trialEnabled: false,
      trialDays: "",
      maxClinics: plan.maxClinics.toString(),
      maxBranches: "",
      maxProviders: plan.maxProviders.toString(),
      maxPatients: plan.maxPatients.toString(),
      maxStorage: "",
      maxXrayUploads: "",
      maxAIRequests: plan.aiLimit.toString(),
      insuranceBilling: true,
      stripeIntegration: true,
      paymentPlans: true,
      voiceToTextAI: true,
      clearinghouseIntegration: false,
      status: plan.status,
      sortOrder: "",
    });
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    // Save logic here
    setIsDrawerOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <h1 className="text-2xl font-semibold text-foreground">Subscription Management</h1>
        <p className="text-muted-foreground mt-1">Manage plans, subscriptions, and billing</p>
      </div>

      {/* Tabs */}
      <div className="bg-card border-b border-border px-6 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`px-4 py-3 text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-card rounded-xl border border-border shadow-sm">
          {/* Table Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Subscription Plans</h2>
              <p className="text-sm text-muted-foreground mt-1">Manage your subscription tiers and pricing</p>
            </div>
            <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add New Plan
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Plan Name</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Billing Cycle</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Price</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Max Clinics</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Max Providers</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Max Patients</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">AI Limit</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Created Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockPlans.map((plan) => (
                  <tr key={plan.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{plan.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{plan.billingCycle}</td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">${plan.price}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{plan.maxClinics}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{plan.maxProviders}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{plan.maxPatients}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{plan.aiLimit}</td>
                    <td className="px-6 py-4">
                      <Badge
                        className={
                          plan.status === "Active"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : plan.status === "Draft"
                            ? "bg-orange-100 text-orange-700 border-orange-200"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        }
                      >
                        {plan.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{plan.createdDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(plan)}
                          className="hover:bg-muted"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-muted">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-muted">
                          <Archive className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Plan Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingPlan ? "Edit Plan" : "Add New Plan"}
      >
        <div className="space-y-8">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-foreground pb-2 border-b border-border">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="planName">Plan Name *</Label>
              <Input
                id="planName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Professional Plan"
                className="border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="planCode">Plan Code *</Label>
              <Input
                id="planCode"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., PRO_MONTHLY"
                className="border font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the plan..."
                className="border min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger className="border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Starter">Starter</SelectItem>
                  <SelectItem value="Pro">Professional</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between py-2">
              <Label htmlFor="publiclyVisible" className="cursor-pointer">Publicly Visible</Label>
              <Switch
                id="publiclyVisible"
                checked={formData.publiclyVisible}
                onCheckedChange={(checked) => setFormData({ ...formData, publiclyVisible: checked })}
              />
            </div>
          </div>

          {/* Section 2: Pricing */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-foreground pb-2 border-b border-border">Pricing</h3>
            
            <div className="space-y-2">
              <Label htmlFor="billingCycle">Billing Cycle</Label>
              <Select value={formData.billingCycle} onValueChange={(value) => setFormData({ ...formData, billingCycle: value })}>
                <SelectTrigger className="border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basePrice">Base Price *</Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  placeholder="149"
                  className="border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                  <SelectTrigger className="border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="setupFee">Setup Fee</Label>
              <Input
                id="setupFee"
                type="number"
                value={formData.setupFee}
                onChange={(e) => setFormData({ ...formData, setupFee: e.target.value })}
                placeholder="0"
                className="border"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <Label htmlFor="trialEnabled" className="cursor-pointer">Trial Enabled</Label>
              <Switch
                id="trialEnabled"
                checked={formData.trialEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, trialEnabled: checked })}
              />
            </div>

            {formData.trialEnabled && (
              <div className="space-y-2">
                <Label htmlFor="trialDays">Trial Days</Label>
                <Input
                  id="trialDays"
                  type="number"
                  value={formData.trialDays}
                  onChange={(e) => setFormData({ ...formData, trialDays: e.target.value })}
                  placeholder="14"
                  className="border"
                />
              </div>
            )}
          </div>

          {/* Section 3: Usage Limits */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-foreground pb-2 border-b border-border">Usage Limits</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxClinics">Max Clinics</Label>
                <Input
                  id="maxClinics"
                  type="number"
                  value={formData.maxClinics}
                  onChange={(e) => setFormData({ ...formData, maxClinics: e.target.value })}
                  placeholder="3"
                  className="border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxBranches">Max Branches</Label>
                <Input
                  id="maxBranches"
                  type="number"
                  value={formData.maxBranches}
                  onChange={(e) => setFormData({ ...formData, maxBranches: e.target.value })}
                  placeholder="5"
                  className="border"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxProviders">Max Providers</Label>
                <Input
                  id="maxProviders"
                  type="number"
                  value={formData.maxProviders}
                  onChange={(e) => setFormData({ ...formData, maxProviders: e.target.value })}
                  placeholder="10"
                  className="border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxPatients">Max Patients</Label>
                <Input
                  id="maxPatients"
                  type="number"
                  value={formData.maxPatients}
                  onChange={(e) => setFormData({ ...formData, maxPatients: e.target.value })}
                  placeholder="500"
                  className="border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxStorage">Max Storage (GB)</Label>
              <Input
                id="maxStorage"
                type="number"
                value={formData.maxStorage}
                onChange={(e) => setFormData({ ...formData, maxStorage: e.target.value })}
                placeholder="100"
                className="border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxXrayUploads">Max X-Ray Uploads per Month</Label>
              <Input
                id="maxXrayUploads"
                type="number"
                value={formData.maxXrayUploads}
                onChange={(e) => setFormData({ ...formData, maxXrayUploads: e.target.value })}
                placeholder="500"
                className="border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxAIRequests">Max AI Requests per Month</Label>
              <Input
                id="maxAIRequests"
                type="number"
                value={formData.maxAIRequests}
                onChange={(e) => setFormData({ ...formData, maxAIRequests: e.target.value })}
                placeholder="200"
                className="border"
              />
            </div>
          </div>

          {/* Section 4: Feature Toggles */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-foreground pb-2 border-b border-border">Feature Toggles</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <Label htmlFor="insuranceBilling" className="cursor-pointer">Insurance Billing Enabled</Label>
                <Switch
                  id="insuranceBilling"
                  checked={formData.insuranceBilling}
                  onCheckedChange={(checked) => setFormData({ ...formData, insuranceBilling: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <Label htmlFor="stripeIntegration" className="cursor-pointer">Stripe Integration Enabled</Label>
                <Switch
                  id="stripeIntegration"
                  checked={formData.stripeIntegration}
                  onCheckedChange={(checked) => setFormData({ ...formData, stripeIntegration: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <Label htmlFor="paymentPlans" className="cursor-pointer">Payment Plans Enabled</Label>
                <Switch
                  id="paymentPlans"
                  checked={formData.paymentPlans}
                  onCheckedChange={(checked) => setFormData({ ...formData, paymentPlans: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <Label htmlFor="voiceToTextAI" className="cursor-pointer">Voice-to-Text AI Enabled</Label>
                <Switch
                  id="voiceToTextAI"
                  checked={formData.voiceToTextAI}
                  onCheckedChange={(checked) => setFormData({ ...formData, voiceToTextAI: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <Label htmlFor="clearinghouseIntegration" className="cursor-pointer">Clearinghouse Integration Enabled</Label>
                <Switch
                  id="clearinghouseIntegration"
                  checked={formData.clearinghouseIntegration}
                  onCheckedChange={(checked) => setFormData({ ...formData, clearinghouseIntegration: checked })}
                />
              </div>
            </div>
          </div>

          {/* Section 5: System Controls */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-foreground pb-2 border-b border-border">System Controls</h3>
            
            <div className="space-y-2">
              <Label htmlFor="status">Plan Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input
                id="sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                placeholder="1"
                className="border"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90">
              Save Plan
            </Button>
            <Button onClick={() => setIsDrawerOpen(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}