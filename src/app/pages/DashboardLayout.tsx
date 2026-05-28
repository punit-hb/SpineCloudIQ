import { Outlet, useNavigate, useLocation } from "react-router";
import { 
  CreditCard, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Bell,
  Check,
  ChevronDown,
  Receipt,
  DollarSign,
  Building2,
  Mail,
  Ticket,
  PanelLeftClose,
  PanelLeft,
  FileText,
  Shield,
  UserCog,
  User,
  LayoutDashboard,
  LayoutTemplate,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { useEffect, useState } from "react";
import spineCloudLogo from "../assets/spinecloudiq-logo.png";

type ThemeMode = "light" | "dark";

type ThemeTokens = {
  primary: string;
  primaryForeground: string;
  hover: string;
  active: string;
  surface: string;
  focus: string;
  outline: string;
  charts: [string, string, string, string, string];
};

type ThemeDefinition = {
  id: string;
  name: string;
  color: string;
  light: ThemeTokens;
  dark: ThemeTokens;
};

const THEME_STORAGE_KEY = "spinecloudiq-theme";
const MODE_STORAGE_KEY = "spinecloudiq-color-mode";

const themes: ThemeDefinition[] = [
  {
    id: "spine-blue",
    name: "Spine Blue",
    color: "#1766C2",
    light: {
      primary: "#1766C2",
      primaryForeground: "#ffffff",
      hover: "#155BAD",
      active: "#124E94",
      surface: "#EAF2FF",
      focus: "rgb(23 102 194 / 0.24)",
      outline: "#9CC3F0",
      charts: ["#1766C2", "#3B82F6", "#60A5FA", "#93C5FD", "#DBEAFE"],
    },
    dark: {
      primary: "#5FA8F5",
      primaryForeground: "#06182D",
      hover: "#7DB9F7",
      active: "#9BCAF9",
      surface: "rgb(95 168 245 / 0.14)",
      focus: "rgb(95 168 245 / 0.32)",
      outline: "#2F80C3",
      charts: ["#5FA8F5", "#2F80C3", "#93C5FD", "#1D4ED8", "#BFDBFE"],
    },
  },
  {
    id: "cloud-blue",
    name: "Cloud Blue",
    color: "#2F80C3",
    light: {
      primary: "#2F80C3",
      primaryForeground: "#ffffff",
      hover: "#2A73AF",
      active: "#24659B",
      surface: "#EAF4FB",
      focus: "rgb(47 128 195 / 0.24)",
      outline: "#9BC8E8",
      charts: ["#2F80C3", "#58A1D6", "#7DBBE5", "#AED7EF", "#DDEFF8"],
    },
    dark: {
      primary: "#6BB6EA",
      primaryForeground: "#062033",
      hover: "#86C6EF",
      active: "#A3D6F4",
      surface: "rgb(107 182 234 / 0.14)",
      focus: "rgb(107 182 234 / 0.32)",
      outline: "#2F80C3",
      charts: ["#6BB6EA", "#2F80C3", "#A3D6F4", "#1F5F91", "#DDEFF8"],
    },
  },
  {
    id: "spine-lime",
    name: "Spine Lime",
    color: "#9BBE3D",
    light: {
      primary: "#6F8F1F",
      primaryForeground: "#ffffff",
      hover: "#637F1B",
      active: "#567018",
      surface: "#F2F7E3",
      focus: "rgb(155 190 61 / 0.28)",
      outline: "#C6DA82",
      charts: ["#6F8F1F", "#9BBE3D", "#B8D56A", "#D5E8A6", "#EEF6D6"],
    },
    dark: {
      primary: "#B5D766",
      primaryForeground: "#182303",
      hover: "#C4E17E",
      active: "#D2E99A",
      surface: "rgb(181 215 102 / 0.14)",
      focus: "rgb(181 215 102 / 0.30)",
      outline: "#8EAD35",
      charts: ["#B5D766", "#9BBE3D", "#D2E99A", "#6F8F1F", "#EEF6D6"],
    },
  },
  {
    id: "emerald",
    name: "Emerald",
    color: "#10B981",
    light: {
      primary: "#059669",
      primaryForeground: "#ffffff",
      hover: "#047857",
      active: "#065F46",
      surface: "#ECFDF5",
      focus: "rgb(16 185 129 / 0.24)",
      outline: "#86EFAC",
      charts: ["#059669", "#10B981", "#34D399", "#6EE7B7", "#D1FAE5"],
    },
    dark: {
      primary: "#34D399",
      primaryForeground: "#032416",
      hover: "#6EE7B7",
      active: "#A7F3D0",
      surface: "rgb(52 211 153 / 0.14)",
      focus: "rgb(52 211 153 / 0.30)",
      outline: "#059669",
      charts: ["#34D399", "#10B981", "#6EE7B7", "#047857", "#D1FAE5"],
    },
  },
  {
    id: "violet",
    name: "Violet",
    color: "#8B5CF6",
    light: {
      primary: "#7C3AED",
      primaryForeground: "#ffffff",
      hover: "#6D28D9",
      active: "#5B21B6",
      surface: "#F3EFFF",
      focus: "rgb(139 92 246 / 0.24)",
      outline: "#C4B5FD",
      charts: ["#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE", "#EDE9FE"],
    },
    dark: {
      primary: "#A78BFA",
      primaryForeground: "#1E123D",
      hover: "#BCA7FB",
      active: "#CFC2FD",
      surface: "rgb(167 139 250 / 0.14)",
      focus: "rgb(167 139 250 / 0.30)",
      outline: "#7C3AED",
      charts: ["#A78BFA", "#8B5CF6", "#C4B5FD", "#6D28D9", "#EDE9FE"],
    },
  },
  {
    id: "amber",
    name: "Amber",
    color: "#F59E0B",
    light: {
      primary: "#B45309",
      primaryForeground: "#ffffff",
      hover: "#92400E",
      active: "#78350F",
      surface: "#FFF7E6",
      focus: "rgb(245 158 11 / 0.26)",
      outline: "#FCD34D",
      charts: ["#B45309", "#F59E0B", "#FBBF24", "#FCD34D", "#FEF3C7"],
    },
    dark: {
      primary: "#FBBF24",
      primaryForeground: "#271600",
      hover: "#FCD34D",
      active: "#FDE68A",
      surface: "rgb(251 191 36 / 0.14)",
      focus: "rgb(251 191 36 / 0.30)",
      outline: "#D97706",
      charts: ["#FBBF24", "#F59E0B", "#FCD34D", "#B45309", "#FEF3C7"],
    },
  },
];

const visibleThemes = themes.filter((theme) => theme.id !== "emerald");

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAppearance, setShowAppearance] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem(MODE_STORAGE_KEY) === "dark");
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) || "spine-blue");

  const applyTheme = (themeId: string, mode: ThemeMode = isDarkMode ? "dark" : "light") => {
    const nextTheme = themes.find((theme) => theme.id === themeId) || themes[0];
    const tokens = nextTheme[mode];
    setCurrentTheme(nextTheme.id);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme.id);
    document.documentElement.style.setProperty("--primary", tokens.primary);
    document.documentElement.style.setProperty("--primary-foreground", tokens.primaryForeground);
    document.documentElement.style.setProperty("--primary-hover", tokens.hover);
    document.documentElement.style.setProperty("--primary-active", tokens.active);
    document.documentElement.style.setProperty("--primary-surface", tokens.surface);
    document.documentElement.style.setProperty("--primary-focus", tokens.focus);
    document.documentElement.style.setProperty("--primary-outline", tokens.outline);
    document.documentElement.style.setProperty("--ring", tokens.primary);
    document.documentElement.style.setProperty("--chart-1", tokens.charts[0]);
    document.documentElement.style.setProperty("--chart-2", tokens.charts[1]);
    document.documentElement.style.setProperty("--chart-3", tokens.charts[2]);
    document.documentElement.style.setProperty("--chart-4", tokens.charts[3]);
    document.documentElement.style.setProperty("--chart-5", tokens.charts[4]);
    document.documentElement.style.setProperty("--sidebar-primary", tokens.primary);
    document.documentElement.style.setProperty("--sidebar-ring", tokens.primary);
  };

  useEffect(() => {
    applyTheme(currentTheme, isDarkMode ? "dark" : "light");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem(MODE_STORAGE_KEY, isDarkMode ? "dark" : "light");
    applyTheme(currentTheme, isDarkMode ? "dark" : "light");
  }, [isDarkMode, currentTheme]);

  useEffect(() => {
    const syncSidebarForViewport = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    syncSidebarForViewport();
    window.addEventListener("resize", syncSidebarForViewport);
    return () => window.removeEventListener("resize", syncSidebarForViewport);
  }, []);

  interface MenuItem {
    icon: any;
    label: string;
    path: string;
    subItems?: { label: string; path: string }[];
  }

  const menuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: CreditCard, label: "Subscription Management", path: "/dashboard/subscriptions" },
    { icon: Building2, label: "Clinic Management", path: "/dashboard/clinics" },
    { icon: Receipt, label: "Transactions", path: "/dashboard/transactions" },
    { icon: DollarSign, label: "Revenue", path: "/dashboard/revenue" },
    { icon: Shield, label: "Role Management", path: "/dashboard/roles" },
    { icon: UserCog, label: "User Management", path: "/dashboard/user-management" },
    { 
      icon: FileText, 
      label: "Reports", 
      path: "/dashboard/reports",
      subItems: [
        { label: "Subscription Report", path: "/dashboard/reports/subscription" },
        { label: "Clinic Report", path: "/dashboard/reports/clinic" },
      ]
    },
    { icon: Mail, label: "Email Management", path: "/dashboard/emails" },
    { icon: Ticket, label: "Support Tickets", path: "/dashboard/tickets" },
    {
      icon: LayoutTemplate,
      label: "HB Templates",
      path: "/dashboard/hb-templates",
      subItems: [
        { label: "UI Kit",      path: "/dashboard/hb-templates/ui-kit" },
        { label: "Sample Page", path: "/dashboard/hb-templates/sample-page" },
      ],
    },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const toggleSubmenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <div className="clinic-admin-shell flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'w-[64px]' : 'w-[256px]'}`}>
        {/* Logo */}
        <div className={`border-b border-neutral-200 dark:border-neutral-800 flex ${sidebarCollapsed ? 'h-[56px] items-center justify-center px-3' : 'h-[84px] flex-col justify-center px-3'}`}>
          {sidebarCollapsed ? (
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white">
              <img
                src={spineCloudLogo}
                alt="SpineCloud IQ"
                className="h-8 w-8 object-cover object-left"
              />
            </div>
          ) : (
            <div className="flex w-full min-w-0 flex-col items-start">
              <img
                src={spineCloudLogo}
                alt="SpineCloud IQ"
                className="h-14 w-full object-contain object-left"
              />
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className={`slim-scroll flex-1 space-y-1 overflow-y-auto ${sidebarCollapsed ? 'p-2' : 'p-2'}`}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const hasSubmenu = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedMenus.includes(item.label);
            
            return (
              <div key={item.path}>
                <button
                  onClick={() => {
                    if (hasSubmenu) {
                      if (sidebarCollapsed) {
                        setSidebarCollapsed(false);
                        toggleSubmenu(item.label);
                        navigate(item.subItems![0].path);
                      } else {
                        toggleSubmenu(item.label);
                        if (!isExpanded) {
                          navigate(item.subItems![0].path);
                        }
                      }
                    } else {
                      navigate(item.path);
                    }
                  }}
                  className={`w-full flex items-center rounded-lg transition-colors text-sm ${
                    sidebarCollapsed ? 'justify-center h-10 w-10 mx-auto' : 'gap-2.5 px-3 py-2'
                  } ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white"
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                    <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 truncate text-left text-sm font-medium leading-5">{item.label}</span>
                      {hasSubmenu && (
                        <ChevronDown 
                          className={`w-3 h-3 transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      )}
                    </>
                  )}
                </button>
                
                {hasSubmenu && isExpanded && !sidebarCollapsed && (
                  <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-border pl-3">
                    {item.subItems!.map((subItem) => {
                      const subActive = location.pathname === subItem.path;
                      return (
                        <button
                          key={subItem.path}
                          onClick={() => navigate(subItem.path)}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            subActive
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            subActive ? "bg-primary" : "bg-muted-foreground/50"
                          }`} />
                          {subItem.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className={`border-t border-neutral-200 dark:border-neutral-800 ${sidebarCollapsed ? 'p-2' : 'p-2'}`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center rounded-lg text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950 transition-colors dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white ${
              sidebarCollapsed ? 'justify-center h-10 w-10 mx-auto' : 'gap-2.5 px-3 py-2'
            }`}
            title={sidebarCollapsed ? "Logout" : undefined}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
            {!sidebarCollapsed && <span className="text-sm font-medium leading-5">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-[48px] bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="h-8 w-8 shrink-0"
            >
              {sidebarCollapsed ? (
                <PanelLeft className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-8 w-8"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full"></span>
              </Button>
              
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden">
                    <div className="p-3 border-b border-border flex items-center justify-between">
                      <span className="font-semibold text-sm">Notifications</span>
                      <button className="text-xs text-primary hover:underline font-medium">Read All</button>
                    </div>
                    <div className="slim-scroll max-h-64 overflow-y-auto">
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No new notifications
                      </div>
                    </div>
                    <div className="p-2 border-t border-border text-center bg-muted/30">
                      <button 
                        className="text-xs text-primary hover:underline font-medium w-full py-1"
                        onClick={() => {
                          setShowNotifications(false);
                          navigate("/dashboard/notifications");
                        }}
                      >
                        View More
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Appearance */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowAppearance(!showAppearance)}
                title="Appearance settings"
              >
                <Settings className="w-4 h-4" />
              </Button>

              {showAppearance && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowAppearance(false)} />
                  <div className="absolute right-0 top-full mt-2 w-72 overflow-hidden rounded-lg border border-neutral-200 bg-white text-neutral-950 shadow-lg z-20 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white">
                    <div className="px-3 py-2.5 border-b border-neutral-200 dark:border-neutral-800">
                      <div className="text-sm font-semibold text-neutral-950 dark:text-white">Appearance</div>
                    </div>

                    <div className="p-3 border-b border-neutral-200 dark:border-neutral-800">
                      <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2 dark:text-neutral-400">
                        Color Theme
                      </div>
                      <div className="space-y-0.5">
                        {visibleThemes.map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => applyTheme(theme.id)}
                            className={`w-full px-2 py-1.5 text-left rounded-lg transition-colors flex items-center gap-2.5 ${
                              isDarkMode ? "text-neutral-100 hover:bg-neutral-900" : "text-neutral-800 hover:bg-neutral-100"
                            }`}
                          >
                            <span
                              className="w-3 h-3 rounded-full flex-shrink-0 border border-black/10 dark:border-white/10"
                              style={{ backgroundColor: theme.color }}
                            />
                            <span className="flex-1 text-sm font-medium">{theme.name}</span>
                            {currentTheme === theme.id && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0 dark:text-primary" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2 dark:text-neutral-400">
                        Mode
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setIsDarkMode(false)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm border transition-colors ${
                            !isDarkMode
                              ? "bg-primary/10 border-primary/30 text-primary"
                              : "border-neutral-800 text-neutral-300 hover:bg-neutral-900"
                          }`}
                        >
                          <Sun className="w-3.5 h-3.5" />
                          Light
                        </button>
                        <button
                          onClick={() => setIsDarkMode(true)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm border transition-colors ${
                            isDarkMode
                              ? "bg-primary/10 border-primary/30 text-primary"
                              : "border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                          }`}
                        >
                          <Moon className="w-3.5 h-3.5" />
                          Dark
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                className="flex items-center gap-2.5 hover:bg-muted px-2.5 py-1.5 rounded-lg transition-all"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <Avatar className="w-7 h-7">
                  <AvatarFallback className="bg-primary text-white text-xs">SA</AvatarFallback>
                </Avatar>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-medium text-foreground">Super Admin</p>
                  <p className="text-xs text-muted-foreground">admin@spinecloudiq.com</p>
                </div>
                <ChevronDown className="w-3 h-3 text-muted-foreground hidden md:block" />
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowProfileDropdown(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-20 py-1">
                    <button
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        navigate("/dashboard/profile");
                      }}
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </button>
                    <div className="border-t border-border my-1" />
                    <button
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        handleLogout();
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="clinic-admin-content slim-scroll flex-1 overflow-y-auto overflow-x-hidden p-5 md:p-6">
          <Outlet />
        </main>
        <footer className="clinic-admin-footer h-8 shrink-0 border-t border-neutral-200 bg-white px-4 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
          <div className="flex h-full items-center justify-between">
            <span>© SpineCloudIQ</span>
            <a href="https://www.hiddenbrains.com" target="_blank" rel="noreferrer" className="font-medium text-neutral-600 hover:text-primary dark:text-neutral-300 dark:hover:text-primary">
              Designed and developed by HiddenBrains.com
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
