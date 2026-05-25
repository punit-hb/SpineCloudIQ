import { createBrowserRouter, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyResetPasswordPage from "./pages/VerifyResetPasswordPage";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import UsersPage from "./pages/UsersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import SubscriptionManagementPage from "./pages/SubscriptionManagementPage";
import ReportsLayout from "./pages/reports/ReportsLayout";
import SubscriptionReportPage from "./pages/reports/SubscriptionReportPage";
import ClinicReportPage from "./pages/reports/ClinicReportPage";
import ClinicManagementPage from "./pages/ClinicManagementPage";
import ClinicDetailsPage from "./pages/ClinicDetailsPage";
import TransactionsPage from "./pages/TransactionsPage";
import RevenuePage from "./pages/RevenuePage";
import EmailManagementPage from "./pages/EmailManagementPage";
import EmailTemplateEditPage from "./pages/EmailTemplateEditPage";
import TicketManagementPage from "./pages/TicketManagementPage";
import RoleManagementPage from "./pages/RoleManagementPage";
import UserManagementPage from "./pages/UserManagementPage";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import UIKitPage from "./pages/hb-templates/UIKitPage";
import SamplePage from "./pages/hb-templates/SamplePage";

// 404 Not Found Component
function NotFound() {
  return <Navigate to="/dashboard" replace />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/forgot-password",
    Component: ForgotPasswordPage,
  },
  {
    path: "/forgot-password/verify-reset",
    Component: VerifyResetPasswordPage,
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: "revenue",
        Component: RevenuePage,
      },
      {
        path: "subscriptions",
        Component: SubscriptionManagementPage,
      },
      {
        path: "reports",
        Component: ReportsLayout,
        children: [
          { 
            index: true, 
            element: <Navigate to="/dashboard/reports/subscription" replace />
          },
          { path: "subscription", Component: SubscriptionReportPage },
          { path: "clinic", Component: ClinicReportPage },
          { 
            path: "*", 
            element: <Navigate to="/dashboard/reports/subscription" replace />
          },
        ],
      },
      {
        path: "clinics",
        Component: ClinicManagementPage,
      },
      {
        path: "clinics/:clinicId",
        Component: ClinicDetailsPage,
      },
      {
        path: "transactions",
        Component: TransactionsPage,
      },
      {
        path: "users",
        Component: UsersPage,
      },
      {
        path: "roles",
        Component: RoleManagementPage,
      },
      {
        path: "user-management",
        Component: UserManagementPage,
      },
      {
        path: "analytics",
        Component: AnalyticsPage,
      },
      {
        path: "settings",
        Component: SettingsPage,
      },
      {
        path: "emails",
        Component: EmailManagementPage,
      },
      {
        path: "emails/:templateId",
        Component: EmailTemplateEditPage,
      },
      {
        path: "tickets",
        Component: TicketManagementPage,
      },
      {
        path: "profile",
        Component: ProfilePage,
      },
      {
        path: "notifications",
        Component: NotificationsPage,
      },
      {
        path: "hb-templates",
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard/hb-templates/ui-kit" replace />,
          },
          {
            path: "ui-kit",
            Component: UIKitPage,
          },
          {
            path: "sample-page",
            Component: SamplePage,
          },
        ],
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);