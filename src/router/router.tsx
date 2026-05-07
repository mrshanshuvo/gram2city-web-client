import { lazy } from "react";
import { createBrowserRouter } from "react-router";

// Layouts
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Guards
import PrivateRoute from "../routes/PrivateRoute";
import AdminRoute from "../routes/AdminRoute";
import RiderRoute from "../routes/RiderRoute";
import MerchantRoute from "../routes/MerchantRoute";
import { queryClient } from "../lib/queryClient";
import { fetchStats, fetchWarehouses } from "../features/landing/api";
import { queryKeys } from "../lib/queryKeys";

// Lazy Loaded Pages
const Home = lazy(() => import("../pages/Home/Home/Home"));
const Coverage = lazy(() => import("../pages/MapCoverage/Coverage"));
const Login = lazy(() => import("../pages/Authentication/Login/Login"));
const Register = lazy(
  () => import("../pages/Authentication/Register/Register"),
);
const AddParcel = lazy(() => import("../pages/AddParcel/AddParcel"));
const Forbidden = lazy(() => import("../pages/Forbidden/Forbidden"));
const FAQPage = lazy(() => import("../pages/FAQPage/FAQPage"));
const GlobalErrorPage = lazy(() => import("../pages/Error/GlobalErrorPage"));

// Dashboard Components
const DashboardHome = lazy(
  () => import("../pages/Dashboard/DashboardHome/DashboardHome"),
);
const MyParcels = lazy(() => import("../pages/Dashboard/MyParcels/MyParcels"));
const EditParcel = lazy(() => import("../pages/AddParcel/EditParcel"));
const ParcelDetails = lazy(
  () => import("../pages/Dashboard/ParcelDetails/ParcelDetails"),
);
const Payment = lazy(() => import("../pages/Dashboard/Payment/Payment"));
const PaymentHistory = lazy(
  () => import("../pages/Dashboard/PaymentHistory/PaymentHistory"),
);
const TrackParcel = lazy(
  () => import("../pages/Dashboard/TrackParcel/TrackParcel"),
);
const BeARider = lazy(() => import("../pages/Dashboard/BeARider/BeARider"));
const UpdateProfile = lazy(
  () => import("../pages/Dashboard/UpdateProfile/UpdateProfile"),
);
const Feedback = lazy(() => import("../pages/Dashboard/Feedback/Feedback"));

// Rider Pages
const PendingDeliveries = lazy(
  () => import("../pages/Dashboard/PendingDeliveries/PendingDeliveries"),
);
const CompletedDeliveries = lazy(
  () => import("../pages/Dashboard/CompletedDeliveries/CompletedDeliveries"),
);
const MyEarnings = lazy(
  () => import("../pages/Dashboard/MyEarnings/MyEarnings"),
);

// Admin Pages
const PendingRiders = lazy(
  () => import("../pages/Dashboard/PendingRiders/PendingRiders"),
);
const ApprovedRiders = lazy(
  () => import("../pages/Dashboard/ApprovedRiders/ApprovedRiders"),
);
const MakeAdmins = lazy(
  () => import("../pages/Dashboard/MakeAdmin/MakeAdmins"),
);
const AssignRider = lazy(
  () => import("../pages/Dashboard/AssignRider/AssignRider"),
);
const AllParcels = lazy(
  () => import("../pages/Dashboard/AllParcels/AllParcels"),
);
const FinancialSettings = lazy(
  () => import("../pages/Dashboard/FinancialSettings/FinancialSettings"),
);
const AdminChat = lazy(() => import("../pages/Dashboard/AdminChat/AdminChat"));
const AdminFeedback = lazy(
  () => import("../pages/Dashboard/AdminFeedback/AdminFeedback"),
);
const LandingPageManager = lazy(
  () => import("../pages/Dashboard/LandingPageManager/LandingPageManager"),
);
const ManageMerchants = lazy(
  () => import("../pages/Dashboard/ManageMerchants/ManageMerchants"),
);
const MerchantParcels = lazy(
  () => import("../pages/Dashboard/MerchantParcels/MerchantParcels"),
);
const AddressBook = lazy(
  () => import("../pages/Dashboard/AddressBook/AddressBook"),
);
const MerchantApplication = lazy(
  () => import("../pages/Dashboard/MerchantApplication/MerchantApplication"),
);

import { Loadable } from "./Loadable";

// Wrapped Loadable Components
const LazyHome = Loadable(Home);
const LazyCoverage = Loadable(Coverage);
const LazyLogin = Loadable(Login);
const LazyRegister = Loadable(Register);
const LazyAddParcel = Loadable(AddParcel);
const LazyForbidden = Loadable(Forbidden);
const LazyFAQPage = Loadable(FAQPage);
const LazyGlobalErrorPage = Loadable(GlobalErrorPage);
const LazyDashboardHome = Loadable(DashboardHome);
const LazyMyParcels = Loadable(MyParcels);
const LazyPayment = Loadable(Payment);
const LazyPaymentHistory = Loadable(PaymentHistory);
const LazyTrackParcel = Loadable(TrackParcel);
const LazyBeARider = Loadable(BeARider);
const LazyUpdateProfile = Loadable(UpdateProfile);
const LazyFeedback = Loadable(Feedback);
const LazyPendingDeliveries = Loadable(PendingDeliveries);
const LazyCompletedDeliveries = Loadable(CompletedDeliveries);
const LazyMyEarnings = Loadable(MyEarnings);
const LazyPendingRiders = Loadable(PendingRiders);
const LazyApprovedRiders = Loadable(ApprovedRiders);
const LazyMakeAdmins = Loadable(MakeAdmins);
const LazyAssignRider = Loadable(AssignRider);
const LazyAllParcels = Loadable(AllParcels);
const LazyFinancialSettings = Loadable(FinancialSettings);
const LazyAdminChat = Loadable(AdminChat);
const LazyAdminFeedback = Loadable(AdminFeedback);
const LazyLandingPageManager = Loadable(LandingPageManager);
const LazyManageMerchants = Loadable(ManageMerchants);
const LazyMerchantParcels = Loadable(MerchantParcels);
const LazyAddressBook = Loadable(AddressBook);
const LazyEditParcel = Loadable(EditParcel);
const LazyParcelDetails = Loadable(ParcelDetails);
const LazyMerchantApplication = Loadable(MerchantApplication);

export const router = createBrowserRouter([
  // ─── Public & Basic User Routes ─────────────────────────────────────────────
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <LazyGlobalErrorPage />,
    children: [
      { index: true, element: <LazyHome /> },
      {
        path: "coverage",
        element: <LazyCoverage />,
        loader: async () => {
          // Prefetch in parallel
          await Promise.all([
            queryClient.prefetchQuery({
              queryKey: queryKeys.landing.warehouses(),
              queryFn: fetchWarehouses,
            }),
            queryClient.prefetchQuery({
              queryKey: queryKeys.landing.stats(),
              queryFn: fetchStats,
            }),
          ]);
          return null;
        },
      },
      {
        path: "addParcel",
        element: (
          <PrivateRoute>
            <LazyAddParcel />
          </PrivateRoute>
        ),
        loader: async () => {
          await queryClient.prefetchQuery({
            queryKey: queryKeys.landing.warehouses(),
            queryFn: fetchWarehouses,
          });
          return null;
        },
      },
      {
        path: "beARider",
        element: (
          <PrivateRoute>
            <LazyBeARider />
          </PrivateRoute>
        ),
        loader: async () => {
          await queryClient.prefetchQuery({
            queryKey: queryKeys.landing.warehouses(),
            queryFn: fetchWarehouses,
          });
          return null;
        },
      },
      { path: "forbidden", element: <LazyForbidden /> },
      { path: "faqs", element: <LazyFAQPage /> },
      { path: "tracking/:id?", element: <LazyTrackParcel /> },
    ],
  },

  // ─── Authentication Routes ──────────────────────────────────────────────────
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LazyLogin /> },
      { path: "register", element: <LazyRegister /> },
    ],
  },

  // ─── Private Dashboard Routes ───────────────────────────────────────────────
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <LazyDashboardHome /> },

      // Common Auth-User Routes
      { path: "myParcels", element: <LazyMyParcels /> },
      { path: "editParcel/:id", element: <LazyEditParcel /> },
      { path: "parcels/:id", element: <LazyParcelDetails /> },
      { path: "payment/:id", element: <LazyPayment /> },
      { path: "paymentHistory", element: <LazyPaymentHistory /> },
      { path: "trackParcel", element: <LazyTrackParcel /> },
      { path: "updateProfile", element: <LazyUpdateProfile /> },
      { path: "/dashboard/addresses", element: <LazyAddressBook /> },
      { path: "feedback", element: <LazyFeedback /> },
      { path: "applyMerchant", element: <LazyMerchantApplication /> },

      // Rider-Specific Routes
      {
        path: "pendingDeliveries",
        element: (
          <RiderRoute>
            <LazyPendingDeliveries />
          </RiderRoute>
        ),
      },
      {
        path: "completedDeliveries",
        element: (
          <RiderRoute>
            <LazyCompletedDeliveries />
          </RiderRoute>
        ),
      },
      {
        path: "myEarnings",
        element: (
          <RiderRoute>
            <LazyMyEarnings />
          </RiderRoute>
        ),
      },
      // Merchant-Specific Routes
      {
        path: "merchantParcels",
        element: (
          <MerchantRoute>
            <LazyMerchantParcels />
          </MerchantRoute>
        ),
      },

      // Admin-Specific Routes
      {
        path: "pendingRiders",
        element: (
          <AdminRoute>
            <LazyPendingRiders />
          </AdminRoute>
        ),
      },
      {
        path: "approvedRiders",
        element: (
          <AdminRoute>
            <LazyApprovedRiders />
          </AdminRoute>
        ),
      },
      {
        path: "makeAdmins",
        element: (
          <AdminRoute>
            <LazyMakeAdmins />
          </AdminRoute>
        ),
      },
      {
        path: "assignRider",
        element: (
          <AdminRoute>
            <LazyAssignRider />
          </AdminRoute>
        ),
      },
      {
        path: "allParcels",
        element: (
          <AdminRoute>
            <LazyAllParcels />
          </AdminRoute>
        ),
      },
      {
        path: "financialSettings",
        element: (
          <AdminRoute>
            <LazyFinancialSettings />
          </AdminRoute>
        ),
      },
      {
        path: "messages",
        element: (
          <AdminRoute>
            <LazyAdminChat />
          </AdminRoute>
        ),
      },
      {
        path: "adminFeedback",
        element: (
          <AdminRoute>
            <LazyAdminFeedback />
          </AdminRoute>
        ),
      },
      {
        path: "landingPageManager",
        element: (
          <AdminRoute>
            <LazyLandingPageManager />
          </AdminRoute>
        ),
      },
      {
        path: "manage-merchants",
        element: (
          <AdminRoute>
            <LazyManageMerchants />
          </AdminRoute>
        ),
      },
    ],
  },
]);
