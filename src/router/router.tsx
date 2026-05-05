import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import PageLoader from "../components/Shared/PageLoader";

// Layouts
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Guards
import PrivateRoute from "../routes/PrivateRoute";
import AdminRoute from "../routes/AdminRoute";
import RiderRoute from "../routes/RiderRoute";

// Lazy Loaded Pages
const Home = lazy(() => import("../pages/Home/Home/Home"));
const Coverage = lazy(() => import("../pages/Coverage/Coverage"));
const Login = lazy(() => import("../pages/Authentication/Login/Login"));
const Register = lazy(
  () => import("../pages/Authentication/Register/Register"),
);
const AddParcel = lazy(() => import("../pages/AddParcel/AddParcel"));
const Forbidden = lazy(() => import("../pages/Forbidden/Forbidden"));
const FAQPage = lazy(() => import("../pages/FAQPage/FAQPage"));

// Dashboard Components
const DashboardHome = lazy(
  () => import("../pages/Dashboard/DashboardHome/DashboardHome"),
);
const MyParcels = lazy(() => import("../pages/Dashboard/MyParcels/MyParcels"));
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

/**
 * A helper to wrap lazy components with a Suspense fallback
 */
const Loadable = (Component: any) => (props: any) => (
  <Suspense fallback={<PageLoader />}>
    <Component {...props} />
  </Suspense>
);

// Wrapped Loadable Components
const LazyHome = Loadable(Home);
const LazyCoverage = Loadable(Coverage);
const LazyLogin = Loadable(Login);
const LazyRegister = Loadable(Register);
const LazyAddParcel = Loadable(AddParcel);
const LazyForbidden = Loadable(Forbidden);
const LazyFAQPage = Loadable(FAQPage);
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

export const router = createBrowserRouter([
  // ─── Public & Basic User Routes ─────────────────────────────────────────────
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <LazyHome /> },
      {
        path: "coverage",
        element: <LazyCoverage />,
        loader: async () => {
          const [centersRes, statsRes] = await Promise.all([
            fetch(`${import.meta.env.VITE_API_URL}/landing/warehouses`),
            fetch(`${import.meta.env.VITE_API_URL}/landing/stats`)
          ]);
          const centers = await centersRes.json();
          const stats = await statsRes.json();
          return { centers: centers.data, stats: stats.data };
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
          const res = await fetch(`${import.meta.env.VITE_API_URL}/landing/warehouses`);
          const data = await res.json();
          return data.data;
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
          const res = await fetch(`${import.meta.env.VITE_API_URL}/landing/warehouses`);
          const data = await res.json();
          return data.data;
        },
      },
      { path: "forbidden", element: <LazyForbidden /> },
      { path: "faqs", element: <LazyFAQPage /> },
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
      { path: "payment/:id", element: <LazyPayment /> },
      { path: "paymentHistory", element: <LazyPaymentHistory /> },
      { path: "trackParcel", element: <LazyTrackParcel /> },
      { path: "updateProfile", element: <LazyUpdateProfile /> },
      { path: "feedback", element: <LazyFeedback /> },

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
    ],
  },
]);
