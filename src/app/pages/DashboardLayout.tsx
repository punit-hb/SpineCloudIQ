import { Outlet, useNavigate, useLocation } from "react-router";
import { 
  CreditCard, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Bell,
  Check,
  Activity,
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

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAppearance, setShowAppearance] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("spine-blue");

  const themes = [
    { id: "spine-blue", name: "Spine Blue", color: "#1766C2" },
    { id: "emerald", name: "Emerald", color: "#10B981" },
    { id: "violet", name: "Violet", color: "#8B5CF6" },
    { id: "amber", name: "Amber", color: "#F59E0B" },
  ];

  const applyTheme = (themeId: string) => {
    const nextTheme = themes.find((theme) => theme.id === themeId) || themes[0];
    setCurrentTheme(nextTheme.id);
    document.documentElement.style.setProperty("--primary", nextTheme.color);
    document.documentElement.style.setProperty("--ring", nextTheme.color);
    document.documentElement.style.setProperty("--chart-1", nextTheme.color);
    document.documentElement.style.setProperty("--sidebar-primary", nextTheme.color);
  };

  useEffect(() => {
    applyTheme("spine-blue");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

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
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-card border-r border-border flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        {/* Logo */}
        <div className={`border-b border-border flex items-center ${sidebarCollapsed ? 'p-4 justify-center' : 'p-5 gap-2.5'}`}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-semibold text-foreground">SpineCloudIQ</h1>
              <p className="text-xs text-muted-foreground">Super Admin</p>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className={`flex-1 space-y-0.5 overflow-y-auto ${sidebarCollapsed ? 'p-2' : 'p-2.5'}`}>
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
                  className={`w-full flex items-center rounded-lg transition-all text-sm ${
                    sidebarCollapsed ? 'justify-center p-2.5' : 'gap-2.5 px-2.5 py-2'
                  } ${
                    active
                      ? "bg-primary text-white"
                      : "text-foreground hover:bg-muted"
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" strokeWidth={2} />
                  {!sidebarCollapsed && (
                    <>
                      <span className="font-medium flex-1 text-left text-xs">{item.label}</span>
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
                          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-all ${
                            subActive
                              ? "text-foreground font-semibold"
                              : "text-muted-foreground hover:text-foreground"
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
        <div className={`border-t border-border ${sidebarCollapsed ? 'p-2' : 'p-2.5'}`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center rounded-lg text-foreground hover:bg-muted transition-all text-sm ${
              sidebarCollapsed ? 'justify-center p-2.5' : 'gap-2.5 px-2.5 py-2'
            }`}
            title={sidebarCollapsed ? "Logout" : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" strokeWidth={2} />
            {!sidebarCollapsed && <span className="font-medium text-xs">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-12 bg-card border-b border-border px-4 flex items-center justify-between">
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
                    <div className="max-h-64 overflow-y-auto">
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
                  <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden">
                    <div className="px-3 py-2.5 border-b border-border">
                      <div className="text-sm font-semibold text-foreground">Appearance</div>
                    </div>

                    <div className="p-3 border-b border-border">
                      <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Color Theme
                      </div>
                      <div className="space-y-0.5">
                        {themes.map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => applyTheme(theme.id)}
                            className="w-full px-2 py-1.5 text-left hover:bg-muted rounded-lg transition-colors flex items-center gap-2.5"
                          >
                            <span
                              className="w-3 h-3 rounded-full flex-shrink-0 border border-black/10 dark:border-white/10"
                              style={{ backgroundColor: theme.color }}
                            />
                            <span className="flex-1 text-sm text-foreground">{theme.name}</span>
                            {currentTheme === theme.id && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Mode
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setIsDarkMode(false)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm border transition-colors ${
                            !isDarkMode
                              ? "bg-primary/10 border-primary/20 text-primary"
                              : "border-border text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          <Sun className="w-3.5 h-3.5" />
                          Light
                        </button>
                        <button
                          onClick={() => setIsDarkMode(true)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm border transition-colors ${
                            isDarkMode
                              ? "bg-primary/10 border-primary/20 text-primary"
                              : "border-border text-muted-foreground hover:bg-muted"
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
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
