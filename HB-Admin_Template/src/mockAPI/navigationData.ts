import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Clock,
  Plane,
  Palette,
  Layers,
  Calendar,
  Map,
} from "lucide-react";

export interface SubMenuItem {
  id: string;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: any;
  onClick?: () => void;
  active?: boolean;
  subItems?: SubMenuItem[];
}

export const getNavigationData = (
  currentPage: string = "directory",
  onNavigate: (pageId: string) => void = () => {},
): MenuItem[] => {
  return [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      onClick: () => onNavigate("dashboard"),
      active: currentPage === "dashboard",
    },
    {
      id: "site-map",
      label: "Site Map",
      icon: Map,
      onClick: () => onNavigate("site-map"),
      active: currentPage === "site-map",
    },
    {
      id: "hb-templates",
      label: "HB Templates",
      icon: Building2,
      subItems: [
        {
          id: "ui-kit",
          label: "UI Kit",
          onClick: () => onNavigate("ui-kit"),
          active: currentPage === "ui-kit",
        },
        {
          id: "sample-design",
          label: "Sample Page",
          onClick: () => onNavigate("sample-design"),
          active: currentPage === "sample-design",
        },
      ],
    },
    {
      id: "user-management-group",
      label: "User Management",
      icon: Users,
      subItems: [
        {
          id: "user-management",
          label: "Users",
          onClick: () => onNavigate("user-management"),
          active: currentPage === "user-management",
        },
        {
          id: "role-management",
          label: "Roles",
          onClick: () => onNavigate("role-management"),
          active: currentPage === "role-management",
        },
      ],
    },
    {
      id: "event-management-group",
      label: "Event Management",
      icon: Calendar,
      subItems: [
        {
          id: "event-management",
          label: "Events",
          onClick: () => onNavigate("event-management"),
          active: currentPage === "event-management",
        },
      ],
    },
    {
      id: "organisational-master",
      label: "Master Managment",
      icon: Layers,
      subItems: [
        {
          id: "country",
          label: "Country",
          onClick: () => onNavigate("country"),
          active: currentPage === "country",
        },
        {
          id: "state",
          label: "State",
          onClick: () => onNavigate("state"),
          active: currentPage === "state",
        },
        {
          id: "city",
          label: "City",
          onClick: () => onNavigate("city"),
          active: currentPage === "city",
        },
      ],
    },
    {
      id: "configurations-group",
      label: "Configurations",
      icon: Palette,
      subItems: [
        {
          id: "static-pages",
          label: "Static Pages",
          onClick: () => onNavigate("static-pages"),
          active: currentPage === "static-pages",
        },
        {
          id: "email-templates",
          label: "Email Templates",
          onClick: () => onNavigate("email-templates"),
          active: currentPage === "email-templates",
        },
        {
          id: "system-notifications",
          label: "System Notifications",
          onClick: () => onNavigate("system-notifications"),
          active: currentPage === "system-notifications",
        },
        {
          id: "system-settings",
          label: "System Settings",
          onClick: () => onNavigate("system-settings"),
          active: currentPage === "system-settings",
        },
      ],
    },
    {
      id: "logs-group",
      label: "Logs",
      icon: FileText,
      onClick: () => onNavigate("logs"),
      active: currentPage === "logs",
    },
  ];
};