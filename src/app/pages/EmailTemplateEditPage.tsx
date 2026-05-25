import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Save, Code, ChevronDown, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
  body: string;
  variables: string[];
  lastModified: string;
}

const mockEmailTemplates: EmailTemplate[] = [
  {
    id: "EMAIL001",
    name: "Welcome Email",
    subject: "Welcome to {{clinic_name}} - Get Started with SpineCloudIQ",
    description: "Sent to new clinic administrators when they first sign up",
    body: "Dear {{admin_name}},\n\nWelcome to SpineCloudIQ! We're thrilled to have {{clinic_name}} join our healthcare platform.\n\nYour account has been successfully created. Here are your next steps:\n\n1. Complete your clinic profile\n2. Invite your team members\n3. Configure your preferences\n\nYou can access your dashboard at: {{dashboard_url}}\n\nIf you have any questions, our support team is here to help at {{support_email}}.\n\nBest regards,\nThe SpineCloudIQ Team",
    variables: ["{{clinic_name}}", "{{admin_name}}", "{{dashboard_url}}", "{{support_email}}"],
    lastModified: "2024-02-15",
  },
  {
    id: "EMAIL002",
    name: "Subscription Renewal Reminder",
    subject: "Your {{plan_name}} subscription renews in {{days_until_renewal}} days",
    description: "Reminder sent before subscription renewal date",
    body: "Hello {{admin_name}},\n\nThis is a friendly reminder that your {{plan_name}} subscription for {{clinic_name}} will automatically renew on {{renewal_date}}.\n\nRenewal Amount: {{renewal_amount}}\nBilling Method: {{payment_method}}\n\nYou can review or update your subscription details in your account settings: {{billing_url}}\n\nThank you for choosing SpineCloudIQ!\n\nBest regards,\nThe SpineCloudIQ Team",
    variables: ["{{admin_name}}", "{{clinic_name}}", "{{plan_name}}", "{{days_until_renewal}}", "{{renewal_date}}", "{{renewal_amount}}", "{{payment_method}}", "{{billing_url}}"],
    lastModified: "2024-02-18",
  },
  {
    id: "EMAIL003",
    name: "Payment Failed",
    subject: "Action Required: Payment Failed for {{clinic_name}}",
    description: "Sent when a subscription payment fails",
    body: "Dear {{admin_name}},\n\nWe were unable to process your payment for {{clinic_name}}'s subscription.\n\nAmount Due: {{amount_due}}\nAttempt Date: {{attempt_date}}\n\nTo avoid service interruption, please update your payment method or retry the payment here: {{payment_url}}\n\nIf you believe this is an error or need assistance, contact our billing team at {{billing_support_email}}.\n\nThank you,\nThe SpineCloudIQ Team",
    variables: ["{{admin_name}}", "{{clinic_name}}", "{{amount_due}}", "{{attempt_date}}", "{{payment_url}}", "{{billing_support_email}}"],
    lastModified: "2024-02-10",
  },
  {
    id: "EMAIL004",
    name: "Trial Ending Soon",
    subject: "Your {{plan_name}} trial ends in {{days_remaining}} days",
    description: "Notification sent as trial period nears expiration",
    body: "Hi {{admin_name}},\n\nYour {{plan_name}} trial for {{clinic_name}} will end on {{trial_end_date}}.\n\nDon't lose access to:\n• {{feature_1}}\n• {{feature_2}}\n• {{feature_3}}\n\nUpgrade now to continue enjoying these features: {{upgrade_url}}\n\nNeed more time to decide? Contact us at {{sales_email}}\n\nBest regards,\nThe SpineCloudIQ Team",
    variables: ["{{admin_name}}", "{{clinic_name}}", "{{plan_name}}", "{{days_remaining}}", "{{trial_end_date}}", "{{feature_1}}", "{{feature_2}}", "{{feature_3}}", "{{upgrade_url}}", "{{sales_email}}"],
    lastModified: "2024-02-12",
  },
  {
    id: "EMAIL005",
    name: "Password Reset",
    subject: "Reset Your SpineCloudIQ Password",
    description: "Sent when a user requests a password reset",
    body: "Hello {{user_name}},\n\nWe received a request to reset your password for your SpineCloudIQ account.\n\nClick the link below to reset your password:\n{{reset_link}}\n\nThis link will expire in {{expiry_hours}} hours.\n\nIf you didn't request this password reset, please ignore this email or contact support if you have concerns.\n\nBest regards,\nThe SpineCloudIQ Team",
    variables: ["{{user_name}}", "{{reset_link}}", "{{expiry_hours}}"],
    lastModified: "2024-01-28",
  },
  {
    id: "EMAIL006",
    name: "New Team Member Invitation",
    subject: "You've been invited to join {{clinic_name}} on SpineCloudIQ",
    description: "Invitation sent to new team members",
    body: "Hello {{invitee_name}},\n\n{{inviter_name}} has invited you to join {{clinic_name}} on SpineCloudIQ as a {{role}}.\n\nSpineCloudIQ is a comprehensive healthcare management platform designed to streamline your clinical workflow.\n\nAccept your invitation and create your account here: {{invitation_link}}\n\nThis invitation will expire on {{expiry_date}}.\n\nWelcome aboard!\nThe SpineCloudIQ Team",
    variables: ["{{invitee_name}}", "{{inviter_name}}", "{{clinic_name}}", "{{role}}", "{{invitation_link}}", "{{expiry_date}}"],
    lastModified: "2024-02-05",
  },
  {
    id: "EMAIL007",
    name: "Subscription Upgrade Confirmation",
    subject: "Subscription Upgraded: Welcome to {{new_plan_name}}",
    description: "Confirmation sent after a successful plan upgrade",
    body: "Dear {{admin_name}},\n\nGreat news! {{clinic_name}}'s subscription has been successfully upgraded to {{new_plan_name}}.\n\nPrevious Plan: {{old_plan_name}}\nNew Plan: {{new_plan_name}}\nEffective Date: {{effective_date}}\nNew Monthly Rate: {{new_rate}}\n\nYou now have access to:\n{{new_features}}\n\nExplore your new features: {{dashboard_url}}\n\nThank you for growing with SpineCloudIQ!\n\nBest regards,\nThe SpineCloudIQ Team",
    variables: ["{{admin_name}}", "{{clinic_name}}", "{{new_plan_name}}", "{{old_plan_name}}", "{{effective_date}}", "{{new_rate}}", "{{new_features}}", "{{dashboard_url}}"],
    lastModified: "2024-02-14",
  },
  {
    id: "EMAIL008",
    name: "Monthly Usage Report",
    subject: "{{clinic_name}} - Monthly Usage Summary for {{month}}",
    description: "Monthly summary of platform usage and metrics",
    body: "Hello {{admin_name}},\n\nHere's your monthly usage summary for {{clinic_name}} for {{month}}:\n\nActive Users: {{active_users}}\nPatients Managed: {{total_patients}}\nStorage Used: {{storage_used}} / {{storage_limit}}\nAPI Calls: {{api_calls}}\n\nPlan: {{plan_name}}\nBilling Cycle: {{billing_cycle}}\nNext Billing Date: {{next_billing_date}}\n\nView detailed analytics: {{analytics_url}}\n\nThank you for using SpineCloudIQ!\n\nBest regards,\nThe SpineCloudIQ Team",
    variables: ["{{admin_name}}", "{{clinic_name}}", "{{month}}", "{{active_users}}", "{{total_patients}}", "{{storage_used}}", "{{storage_limit}}", "{{api_calls}}", "{{plan_name}}", "{{billing_cycle}}", "{{next_billing_date}}", "{{analytics_url}}"],
    lastModified: "2024-02-01",
  },
];

export default function EmailTemplateEditPage() {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const subjectInputRef = useRef<HTMLInputElement>(null);
  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [showVariableDropdown, setShowVariableDropdown] = useState<"subject" | "body" | null>(null);

  const template = mockEmailTemplates.find((t) => t.id === templateId);

  const [editedTemplate, setEditedTemplate] = useState<EmailTemplate | null>(template || null);

  if (!template || !editedTemplate) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-muted-foreground">Email template not found</p>
          <Button onClick={() => navigate("/dashboard/emails")} className="mt-4">
            Back to Email Management
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    // In a real app, this would make an API call to save the template
    console.log("Saving template:", editedTemplate);
    navigate("/dashboard/emails");
  };

  const insertVariable = (variable: string, field: "subject" | "body") => {
    if (field === "subject" && subjectInputRef.current) {
      const input = subjectInputRef.current;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const currentValue = editedTemplate.subject;
      const newValue = currentValue.substring(0, start) + variable + currentValue.substring(end);
      
      setEditedTemplate({ ...editedTemplate, subject: newValue });
      
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    } else if (field === "body" && bodyTextareaRef.current) {
      const textarea = bodyTextareaRef.current;
      const start = textarea.selectionStart || 0;
      const end = textarea.selectionEnd || 0;
      const currentValue = editedTemplate.body;
      const newValue = currentValue.substring(0, start) + variable + currentValue.substring(end);
      
      setEditedTemplate({ ...editedTemplate, body: newValue });
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    }
    
    setShowVariableDropdown(null);
  };

  return (
    <div className="-m-6">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard/emails")}
          className="mb-4 h-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-2" />
          Back
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{template.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm font-mono text-muted-foreground">{template.id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Template Info */}
          <div className="bg-card border border-border rounded-lg p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Template Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">Template ID</label>
                <div className="bg-muted/30 border border-border rounded-lg px-3 py-2.5">
                  <p className="text-sm font-mono text-muted-foreground">{template.id}</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">Last Modified</label>
                <div className="bg-muted/30 border border-border rounded-lg px-3 py-2.5">
                  <p className="text-sm text-muted-foreground">{template.lastModified}</p>
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-2">Description</label>
                <div className="bg-muted/30 border border-border rounded-lg px-3 py-2.5">
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Line */}
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">Email Subject Line</h2>
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVariableDropdown(showVariableDropdown === "subject" ? null : "subject")}
                  className="h-8 text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  Insert Variable
                  <ChevronDown className="w-3.5 h-3.5 ml-1.5" />
                </Button>
                
                {showVariableDropdown === "subject" && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
                    <div className="p-2.5 border-b border-border bg-muted/30">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Available Variables</p>
                    </div>
                    <div className="p-1.5">
                      {template.variables.map((variable) => (
                        <button
                          key={variable}
                          onClick={() => insertVariable(variable, "subject")}
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            <Code className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="font-mono text-sm text-foreground">
                              {variable}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Input
              ref={subjectInputRef}
              value={editedTemplate.subject}
              onChange={(e) => setEditedTemplate({ ...editedTemplate, subject: e.target.value })}
              className="h-9"
              placeholder="Enter email subject line..."
            />
          </div>

          {/* Email Body */}
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">Email Body</h2>
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVariableDropdown(showVariableDropdown === "body" ? null : "body")}
                  className="h-8 text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  Insert Variable
                  <ChevronDown className="w-3.5 h-3.5 ml-1.5" />
                </Button>
                
                {showVariableDropdown === "body" && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
                    <div className="p-2.5 border-b border-border bg-muted/30">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Available Variables</p>
                    </div>
                    <div className="p-1.5">
                      {template.variables.map((variable) => (
                        <button
                          key={variable}
                          onClick={() => insertVariable(variable, "body")}
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            <Code className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="font-mono text-sm text-foreground">
                              {variable}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Textarea
              ref={bodyTextareaRef}
              value={editedTemplate.body}
              onChange={(e) => setEditedTemplate({ ...editedTemplate, body: e.target.value })}
              rows={18}
              className="font-sans text-sm leading-relaxed resize-none"
              placeholder="Enter email body..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8 border-t border-border pt-6">
            <Button variant="outline" onClick={() => navigate("/dashboard/emails")}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}