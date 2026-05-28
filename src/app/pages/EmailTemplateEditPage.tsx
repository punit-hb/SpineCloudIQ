import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bold,
  ChevronDown,
  Code,
  Eye,
  Heading2,
  Italic,
  List,
  Monitor,
  ListOrdered,
  Plus,
  Save,
  Smartphone,
  Underline,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

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
  const [category, setCategory] = useState("System");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

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

  const insertBodyToken = (before: string, after = "") => {
    if (!bodyTextareaRef.current) return;
    const textarea = bodyTextareaRef.current;
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const selected = editedTemplate.body.substring(start, end) || "Text";
    const nextBody = editedTemplate.body.substring(0, start) + before + selected + after + editedTemplate.body.substring(end);
    setEditedTemplate({ ...editedTemplate, body: nextBody });
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const sampleVariables: Record<string, string> = {
    "{{clinic_name}}": "SpineWorks Clinic",
    "{{admin_name}}": "Dr. Sarah Johnson",
    "{{dashboard_url}}": "https://app.spinecloudiq.com/dashboard",
    "{{support_email}}": "support@spinecloudiq.com",
    "{{plan_name}}": "Professional",
    "{{days_until_renewal}}": "7",
    "{{renewal_date}}": "Mar 15, 2025",
    "{{renewal_amount}}": "$299",
    "{{payment_method}}": "Visa ending 4242",
    "{{billing_url}}": "https://app.spinecloudiq.com/billing",
    "{{amount_due}}": "$299",
    "{{attempt_date}}": "Feb 23, 2025",
    "{{payment_url}}": "https://app.spinecloudiq.com/payments",
    "{{billing_support_email}}": "billing@spinecloudiq.com",
    "{{user_name}}": "Amanda Anderson",
    "{{reset_link}}": "https://app.spinecloudiq.com/reset-password",
    "{{expiry_hours}}": "24",
  };

  const previewSubject = useMemo(
    () => editedTemplate.subject.replace(/\{\{[^}]+\}\}/g, (match) => sampleVariables[match] || match.replace(/[{}]/g, "").replace(/_/g, " ")),
    [editedTemplate.subject],
  );

  const previewBody = useMemo(
    () => editedTemplate.body.replace(/\{\{[^}]+\}\}/g, (match) => sampleVariables[match] || match.replace(/[{}]/g, "").replace(/_/g, " ")),
    [editedTemplate.body],
  );

  const bodyParagraphs = previewBody.split(/\n{2,}/).filter(Boolean);

  const variableMenu = (field: "subject" | "body") =>
    showVariableDropdown === field ? (
      <div className="absolute right-0 top-full z-30 mt-2 max-h-80 w-72 overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
        <div className="border-b border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Available Variables</p>
        </div>
        <div className="p-2">
          {template.variables.map((variable) => (
            <button key={variable} onClick={() => insertVariable(variable, field)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-neutral-50 dark:hover:bg-neutral-900">
              <Code className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono text-sm text-neutral-800 dark:text-neutral-200">{variable}</span>
            </button>
          ))}
        </div>
      </div>
    ) : null;

  return (
    <div className="min-h-full bg-neutral-50 px-4 py-6 text-neutral-950 dark:bg-neutral-950 dark:text-white sm:px-6">
      <div className="mb-6 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate("/dashboard/emails")} className="h-10 w-10">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-[32px] font-semibold leading-10 tracking-normal">{editedTemplate.name}</h1>
                <span className="inline-flex h-7 items-center rounded-full border border-neutral-200 bg-neutral-50 px-2.5 font-mono text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">{template.id}</span>
              </div>
              <p className="max-w-3xl text-sm leading-5 text-neutral-600 dark:text-neutral-400">{editedTemplate.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/dashboard/emails")} className="h-10">Discard</Button>
            <Button onClick={handleSave} className="h-10">
              <Save className="h-4 w-4" />
              Save Layout
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,60%)_minmax(360px,40%)]">
        <section className="min-w-0 rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
          <div className="border-b border-neutral-200 p-6 dark:border-neutral-800">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Editor Workspace</h2>
                <p className="mt-1 text-[13px] text-neutral-500 dark:text-neutral-400">Customize template metadata, subject, variables, and body content.</p>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-neutral-500">
                <span>Category</span>
                <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200">
                  {["System", "Billing", "Account", "Support", "Usage"].map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6">
            <div>
              <h3 className="mb-4 text-xl font-semibold">Template Information</h3>
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[13px] font-medium text-neutral-700 dark:text-neutral-300">Template Name</span>
                  <Input value={editedTemplate.name} onChange={(event) => setEditedTemplate({ ...editedTemplate, name: event.target.value })} className="h-10 rounded-lg" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[13px] font-medium text-neutral-700 dark:text-neutral-300">Category</span>
                  <Input value={category} onChange={(event) => setCategory(event.target.value)} className="h-10 rounded-lg" />
                </label>
                <label className="block lg:col-span-2">
                  <span className="mb-2 block text-[13px] font-medium text-neutral-700 dark:text-neutral-300">Description</span>
                  <Textarea value={editedTemplate.description} onChange={(event) => setEditedTemplate({ ...editedTemplate, description: event.target.value })} rows={3} className="rounded-lg" />
                </label>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold">Subject Line</h3>
                <div className="relative">
                  <Button variant="outline" size="sm" onClick={() => setShowVariableDropdown(showVariableDropdown === "subject" ? null : "subject")} className="h-9">
                    <Plus className="h-3.5 w-3.5" />
                    Insert Variable
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                  {variableMenu("subject")}
                </div>
              </div>
              <Input ref={subjectInputRef} value={editedTemplate.subject} onChange={(event) => setEditedTemplate({ ...editedTemplate, subject: event.target.value })} className="h-11 rounded-lg" placeholder="Enter email subject line..." />
            </div>

            <div>
              <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Rich Text Editor</h3>
                  <p className="mt-1 text-[13px] text-neutral-500 dark:text-neutral-400">Use the toolbar and variable chips to structure message content.</p>
                </div>
                <div className="relative">
                  <Button variant="outline" size="sm" onClick={() => setShowVariableDropdown(showVariableDropdown === "body" ? null : "body")} className="h-9">
                    <Plus className="h-3.5 w-3.5" />
                    Insert Variable
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                  {variableMenu("body")}
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
                <div className="flex flex-wrap items-center gap-1 border-b border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-800 dark:bg-neutral-900">
                  {[
                    { icon: Heading2, label: "Heading", action: () => insertBodyToken("## ") },
                    { icon: Bold, label: "Bold", action: () => insertBodyToken("**", "**") },
                    { icon: Italic, label: "Italic", action: () => insertBodyToken("*", "*") },
                    { icon: Underline, label: "Underline", action: () => insertBodyToken("<u>", "</u>") },
                    { icon: AlignLeft, label: "Align left", action: () => insertBodyToken("") },
                    { icon: AlignCenter, label: "Align center", action: () => insertBodyToken("") },
                    { icon: AlignRight, label: "Align right", action: () => insertBodyToken("") },
                    { icon: List, label: "Bulleted list", action: () => insertBodyToken("- ") },
                    { icon: ListOrdered, label: "Numbered list", action: () => insertBodyToken("1. ") },
                  ].map(({ icon: Icon, label, action }) => (
                    <button key={label} type="button" title={label} onClick={action} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-600 hover:bg-white hover:text-primary dark:text-neutral-300 dark:hover:bg-neutral-950">
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
                <Textarea ref={bodyTextareaRef} value={editedTemplate.body} onChange={(event) => setEditedTemplate({ ...editedTemplate, body: event.target.value })} rows={16} className="min-h-[360px] resize-y rounded-none border-0 font-sans text-sm leading-6 focus-visible:ring-0" placeholder="Enter email body..." />
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold">Variable Chips</h3>
              <div className="flex flex-wrap gap-2">
                {template.variables.map((variable) => (
                  <button key={variable} type="button" onClick={() => insertVariable(variable, "body")} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 font-mono text-xs text-primary transition-colors hover:bg-primary/10">
                    <Code className="h-3.5 w-3.5" />
                    {variable}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="xl:sticky xl:top-5 xl:self-start">
          <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
            <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                <div>
                  <h2 className="text-xl font-semibold">Live Preview</h2>
                  <p className="text-[13px] text-neutral-500 dark:text-neutral-400">Email client rendering</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1 rounded-lg border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-800 dark:bg-neutral-900">
                <button type="button" onClick={() => setPreviewMode("desktop")} className={`flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-medium ${previewMode === "desktop" ? "bg-white text-primary shadow-sm dark:bg-neutral-950" : "text-neutral-500"}`}>
                  <Monitor className="h-3.5 w-3.5" />
                  Desktop
                </button>
                <button type="button" onClick={() => setPreviewMode("mobile")} className={`flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-medium ${previewMode === "mobile" ? "bg-white text-primary shadow-sm dark:bg-neutral-950" : "text-neutral-500"}`}>
                  <Smartphone className="h-3.5 w-3.5" />
                  Mobile
                </button>
              </div>
            </div>

            <div className="max-h-[calc(100vh-220px)] overflow-y-auto bg-neutral-100 p-4 dark:bg-neutral-900">
              <div className={`mx-auto overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all dark:border-neutral-800 dark:bg-neutral-950 ${previewMode === "mobile" ? "max-w-[360px]" : "max-w-[680px]"}`}>
                <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Subject line preview</p>
                  <p className="mt-1 text-sm font-semibold text-neutral-950 dark:text-white">{previewSubject}</p>
                </div>
                <div className="p-6">
                  <div className="mb-5 inline-flex h-9 items-center rounded-full border border-primary/30 bg-primary/5 px-3 text-sm font-semibold text-primary">SpineCloudIQ</div>
                  {bodyParagraphs.map((paragraph, index) => {
                    const clean = paragraph.replace(/^##\s*/, "");
                    if (paragraph.startsWith("## ")) {
                      return <h3 key={index} className="mb-3 text-2xl font-semibold leading-8 text-neutral-950 dark:text-white">{clean}</h3>;
                    }
                    return <p key={index} className="mb-4 whitespace-pre-line text-sm leading-6 text-neutral-700 dark:text-neutral-300">{clean}</p>;
                  })}
                </div>
                <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-4 text-center dark:border-neutral-800 dark:bg-neutral-900">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Delivered securely via SpineCloudIQ notification infrastructure.</p>
                  <p className="mt-1 text-xs text-neutral-400">Unsubscribe options available under profile setup.</p>
                </div>
              </div>
              <p className="mt-4 text-center text-xs italic text-neutral-500 dark:text-neutral-400">Changes render instantly to evaluate layout, hierarchy, and variable replacement.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
