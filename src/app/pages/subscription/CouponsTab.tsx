import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Plus, Edit, Trash, Copy } from "lucide-react";
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

interface Coupon {
  id: string;
  code: string;
  discountType: "Percentage" | "Flat";
  value: number;
  applicablePlans: string;
  usageLimit: number;
  usageCount: number;
  expiryDate: string;
  status: "Active" | "Expired" | "Disabled";
}

const mockCoupons: Coupon[] = [
  {
    id: "1",
    code: "SAVE20",
    discountType: "Percentage",
    value: 20,
    applicablePlans: "All Plans",
    usageLimit: 100,
    usageCount: 34,
    expiryDate: "2024-12-31",
    status: "Active",
  },
  {
    id: "2",
    code: "FIRSTMONTH",
    discountType: "Percentage",
    value: 50,
    applicablePlans: "Starter, Professional",
    usageLimit: 50,
    usageCount: 48,
    expiryDate: "2024-06-30",
    status: "Active",
  },
  {
    id: "3",
    code: "WELCOME50",
    discountType: "Flat",
    value: 50,
    applicablePlans: "All Plans",
    usageLimit: 200,
    usageCount: 200,
    expiryDate: "2024-03-31",
    status: "Expired",
  },
];

export default function CouponsTab() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "Percentage",
    value: "",
    applicablePlans: "",
    usageLimit: "",
    expiryDate: "",
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
              <h2 className="text-lg font-semibold text-foreground">Discount Coupons</h2>
              <p className="text-sm text-muted-foreground mt-1">Create and manage promotional coupon codes</p>
            </div>
            <Button onClick={() => setIsDrawerOpen(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Coupon
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Coupon Code</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Discount Type</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Value</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Applicable Plans</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Usage</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Expiry Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockCoupons.map((coupon) => (
                  <tr key={coupon.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-medium text-foreground">{coupon.code}</span>
                        <button className="text-muted-foreground hover:text-foreground">
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline">{coupon.discountType}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {coupon.discountType === "Percentage" ? `${coupon.value}%` : `$${coupon.value}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{coupon.applicablePlans}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {coupon.usageCount}/{coupon.usageLimit}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{coupon.expiryDate}</td>
                    <td className="px-6 py-4">
                      <Badge
                        className={
                          coupon.status === "Active"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : coupon.status === "Expired"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        }
                      >
                        {coupon.status}
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

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="Add Coupon">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="couponCode">Coupon Code *</Label>
            <Input
              id="couponCode"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="e.g., SAVE20"
              className="border font-mono uppercase"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discountType">Discount Type</Label>
            <Select value={formData.discountType} onValueChange={(value) => setFormData({ ...formData, discountType: value })}>
              <SelectTrigger className="border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Percentage">Percentage (%)</SelectItem>
                <SelectItem value="Flat">Flat Amount ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Discount Value *</Label>
            <Input
              id="value"
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder={formData.discountType === "Percentage" ? "20" : "50"}
              className="border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicablePlans">Applicable Plans</Label>
            <Input
              id="applicablePlans"
              value={formData.applicablePlans}
              onChange={(e) => setFormData({ ...formData, applicablePlans: e.target.value })}
              placeholder="e.g., All Plans or Starter, Professional"
              className="border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="usageLimit">Usage Limit</Label>
            <Input
              id="usageLimit"
              type="number"
              value={formData.usageLimit}
              onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
              placeholder="100"
              className="border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button onClick={() => setIsDrawerOpen(false)} className="flex-1 bg-primary hover:bg-primary/90">
              Save Coupon
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