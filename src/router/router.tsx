import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import Coverage from "../pages/Coverage/Coverage";
import PrivateRoute from "../routes/PrivateRoute";
import AddParcel from "../pages/AddParcel/AddParcel";
import DashboardLayout from "../layouts/DashboardLayout";
import MyParcels from "../pages/Dashboard/MyParcels/MyParcels";
import Payment from "../pages/Dashboard/Payment/Payment";
import PaymentHistory from "../pages/Dashboard/PaymentHistory/PaymentHistory";
import TrackParcel from "../pages/Dashboard/TrackParcel/TrackParcel";
import BeARider from "../pages/Dashboard/BeARider/BeARider";
import PendingRiders from "../pages/Dashboard/PendingRiders/PendingRiders";
import ApprovedRiders from "../pages/Dashboard/ApprovedRiders/ApprovedRiders";
import MakeAdmins from "../pages/Dashboard/MakeAdmin/MakeAdmins";
import Forbidden from "../pages/Forbidden/Forbidden";
import AdminRoute from "../routes/AdminRoute";
import FAQPage from "../pages/FAQPage/FAQPage";
import AssignRider from "../pages/Dashboard/AssignRider/AssignRider";
import RiderRoute from "../routes/RiderRoute";
import PendingDeliveries from "../pages/Dashboard/PendingDeliveries/PendingDeliveries";
import CompletedDeliveries from "../pages/Dashboard/CompletedDeliveries/CompletedDeliveries";
import MyEarnings from "../pages/Dashboard/MyEarnings/MyEarnings";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import UpdateProfile from "../pages/Dashboard/UpdateProfile/UpdateProfile";
import AllParcels from "../pages/Dashboard/AllParcels/AllParcels";
import FinancialSettings from "../pages/Dashboard/FinancialSettings/FinancialSettings";
import AdminChat from "../pages/Dashboard/AdminChat/AdminChat";
import Feedback from "../pages/Dashboard/Feedback/Feedback";
import AdminFeedback from "../pages/Dashboard/AdminFeedback/AdminFeedback";
import LandingPageManager from "../pages/Dashboard/LandingPageManager/LandingPageManager";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    children: [
      { index: true, element: <Home /> },
      {
        path: "coverage",
        element: <Coverage />,
        loader: () => fetch("warehouses.json"),
      },
      {
        path: "addParcel",
        element: (
          <PrivateRoute>
            <AddParcel></AddParcel>
          </PrivateRoute>
        ),
        loader: () => fetch("warehouses.json"),
      },
      {
        path: "beARider",
        element: (
          <PrivateRoute>
            <BeARider></BeARider>
          </PrivateRoute>
        ),
        loader: () => fetch("warehouses.json"),
      },
      {
        path: "forbidden",
        element: <Forbidden />,
      },
      {
        path: "faqs",
        element: <FAQPage />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      // common routes
      { path: "myParcels", element: <MyParcels /> },
      { path: "payment/:id", element: <Payment /> },
      { path: "paymentHistory", element: <PaymentHistory /> },
      { path: "trackParcel", element: <TrackParcel /> },
      { path: "updateProfile", element: <UpdateProfile /> },
      { path: "feedback", element: <Feedback /> },
      // rider routes
      {
        path: "pendingDeliveries",
        element: (
          <RiderRoute>
            <PendingDeliveries></PendingDeliveries>
          </RiderRoute>
        ),
      },
      {
        path: "completedDeliveries",
        element: (
          <RiderRoute>
            <CompletedDeliveries></CompletedDeliveries>
          </RiderRoute>
        ),
      },
      {
        path: "myEarnings",
        element: (
          <RiderRoute>
            <MyEarnings></MyEarnings>
          </RiderRoute>
        ),
      },
      // admin routes
      {
        path: "pendingRiders",
        element: (
          <AdminRoute>
            <PendingRiders></PendingRiders>
          </AdminRoute>
        ),
      },
      {
        path: "approvedRiders",
        element: (
          <AdminRoute>
            <ApprovedRiders></ApprovedRiders>
          </AdminRoute>
        ),
      },
      {
        path: "makeAdmins",
        element: (
          <AdminRoute>
            <MakeAdmins></MakeAdmins>
          </AdminRoute>
        ),
      },
      {
        path: "assignRider",
        element: (
          <AdminRoute>
            <AssignRider></AssignRider>
          </AdminRoute>
        ),
      },
      {
        path: "allParcels",
        element: (
          <AdminRoute>
            <AllParcels></AllParcels>
          </AdminRoute>
        ),
      },
      {
        path: "financialSettings",
        element: (
          <AdminRoute>
            <FinancialSettings />
          </AdminRoute>
        ),
      },
      {
        path: "messages",
        element: (
          <AdminRoute>
            <AdminChat />
          </AdminRoute>
        ),
      },
      {
        path: "adminFeedback",
        element: (
          <AdminRoute>
            <AdminFeedback />
          </AdminRoute>
        ),
      },
      {
        path: "landingPageManager",
        element: (
          <AdminRoute>
            <LandingPageManager />
          </AdminRoute>
        ),
      },
    ],
  },
]);
