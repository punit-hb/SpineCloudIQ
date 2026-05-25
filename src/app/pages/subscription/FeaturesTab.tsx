import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Plus, Edit, Trash } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import Drawer from "../../components/Drawer";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

const tabs = [
  { label: "Plans", path: "/dashboard/subscriptions/plans" },
  { label: "Features", path: "/dashboard/subscriptions/features" },
  { label: "Coupons", path: "/dashboard/subscriptions/coupons" },
];

interface Feature {
  id: string;
  name: string;
  key: string;
  category: string;
  type: string;
  status: string;
}

const mockFeatures: Feature[] = [
  { id: "1", name: "Insurance Billing", key: "insurance_billing", category: "Billing", type: "Toggle", status: "Active" },
  { id: "2", name: "Stripe Integration", key: "stripe_integration", category: "Payment", type: "Toggle", status: "Active" },
  { id: "3", name: "Payment Plans", key: "payment_plans", category: "Payment", type: "Toggle", status: "Active" },
  { id: "4", name: "Voice-to-Text AI", key: "voice_to_text_ai", category: "AI", type: "Toggle", status: "Active" },
  { id: "5", name: "AI Requests Limit", key: "ai_requests_limit", category: "AI", type: "Limit", status: "Active" },
  { id: "6", name: "Storage Limit", key: "storage_limit", category: "Storage", type: "Limit", status: "Active" },
  { id: "7", name: "X-Ray Analysis", key: "xray_analysis", category: "AI", type: "Add-on", status: "Active" },
];

export default function FeaturesTab() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    key: "",
    category: "Billing",
    type: "Toggle",
    defaultLimit: "",
    status: "Active",
  });

  return (
    <div className="h-full flex flex-col">
      <div className="bg-card border-b border-border px-6 py-4">
        <h1 className="text-2xl font-semibold text-foreground">Subscription Management</h1>
        <p className="text-muted-foreground mt-1">Manage plans, subscriptions, and billing</p>
      </div>

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

      <div className="flex-1 overflow-auto p-6">
        <div className="bg-card rounded-xl border border-border shadow-sm">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Master Features</h2>
              <p className="text-sm text-muted-foreground mt-1">Define and manage all available features</p>
            </div>
            <Button onClick={() => setIsDrawerOpen(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Feature
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Feature Name</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Type</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockFeatures.map((feature) => (
                  <tr key={feature.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{feature.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{feature.category}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline">{feature.type}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        {feature.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="hover:bg-muted">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-muted">
                          <Trash className="w-4 h-4" />
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

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Add Feature">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="featureName">Feature Name *</Label>
            <Input
              id="featureName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Insurance Billing"
              className="border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="featureKey">Feature Key *</Label>
            <Input
              id="featureKey"
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              placeholder="e.g., insurance_billing"
              className="border font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Billing">Billing</SelectItem>
                <SelectItem value="Payment">Payment</SelectItem>
                <SelectItem value="AI">AI</SelectItem>
                <SelectItem value="Storage">Storage</SelectItem>
                <SelectItem value="Integration">Integration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Feature Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger className="border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Toggle">Toggle</SelectItem>
                <SelectItem value="Limit">Limit</SelectItem>
                <SelectItem value="Add-on">Add-on</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type === "Limit" && (
            <div className="space-y-2">
              <Label htmlFor="defaultLimit">Default Limit</Label>
              <Input
                id="defaultLimit"
                type="number"
                value={formData.defaultLimit}
                onChange={(e) => setFormData({ ...formData, defaultLimit: e.target.value })}
                placeholder="100"
                className="border"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button onClick={() => setIsDrawerOpen(false)} className="flex-1 bg-primary hover:bg-primary/90">
              Save Feature
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