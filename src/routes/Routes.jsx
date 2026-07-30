import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import AdminLogin from "../pages/AdminLogin/AdminLogin";
import Register from "../pages/Register/Register";
import ProductPageLayout from "../layouts/ProductPageLayout";
import ProductDescription from "../pages/DynamicProduct/ProductDescription/ProductDescription";
import ProductReviews from "../pages/DynamicProduct/ProductReviews/ProductReviews";
import Shop from "../pages/Shop/Shop/Shop";
import Wishlist from "../pages/Wishlist/Wishlist";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import CategoryGold from "../pages/CategoryGold/CategoryGold";
import MyDashboard from "../pages/Dashboard/MyDashboard/MyDashboard";
import MyOrders from "../pages/Dashboard/MyOrders/MyOrders";
import AddressBook from "../pages/Dashboard/AddressBook/AddressBook";
import AccountDetails from "../pages/Dashboard/AccountDetails/AccountDetails";
import Checkout from "../pages/Checkout/Checkout";
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
import AddReview from "../pages/Dashboard/AddReview/AddReview";
import AdminDashboard from "../pages/Dashboard/AdminDashboard/AdminDashboard";
import AdminRoute from "./AdminRoute/AdminRoute";
import AdminProducts from "../pages/Dashboard/AdminProducts/AdminProducts";
import AdminAddProduct from "../pages/Dashboard/AdminAddProduct/AdminAddProduct";
import AdminManageUsers from "../pages/AdminManageUsers/AdminManageUsers";
import AdminCategories from "../pages/AdminCategories/AdminCategories";
import AdminOrders from "../pages/Dashboard/AdminOrders/AdminOrders";
import AdminQuoteRequests from "../pages/Dashboard/AdminQuoteRequests/AdminQuoteRequests";
import AdminLiveRates from "../pages/Dashboard/AdminLiveRates/AdminLiveRates";
import About from "../pages/About/About";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },
      {
        path: "shop",
        element: (
          <PrivateRoute>
            <Shop />
          </PrivateRoute>
        ),
      },
      {
        path: "categories",
        element: (
          <PrivateRoute>
            <CategoryGold />
          </PrivateRoute>
        ),
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "admin-login",
        element: <AdminLogin />,
      },
      {
        path: "register",
        element: <Navigate to="/login" replace />,
      },
      {
        path: "about",
        element: (
          <PrivateRoute>
            <About />
          </PrivateRoute>
        ),
      },
      {
        path: "wishlist",
        element: (
          <Navigate to="/dashboard/wishlist" replace />
        ),
      },
      {
        path: "checkout",
        element: (
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        ),
      },
      {
        path: "order-success",
        element: (
          <PrivateRoute>
            <OrderSuccess />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="myDashboard" replace />,
      },
      {
        path: "myDashboard",
        element: <MyDashboard />,
      },
          {
            path: "myOrders",
            element: <MyOrders />,
          },
          {
            path: "myAddress",
            element: <AddressBook />,
          },
          {
            path: "addReview",
            element: <AddReview />,
          },
          {
            path: "accountDetails",
            element: <AccountDetails />,
          },
          {
            path: "wishlist",
            element: <Wishlist />,
          },
          {
            path: "adminDashboard",
            element: (
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            ),
          },
          {
            path: "adminCategories",
            element: (
              <AdminRoute>
                <AdminCategories />
              </AdminRoute>
            ),
          },
          {
            path: "adminProducts",
            element: (
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            ),
          },

          {
            path: "adminAddProducts",
            element: (
              <AdminRoute>
                <AdminAddProduct />
              </AdminRoute>
            ),
          },
          {
            path: "adminUsers",
            element: (
              <AdminRoute>
                <AdminManageUsers />
              </AdminRoute>
            ),
          },
          {
            path: "adminOrders",
            element: (
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            ),
          },
          {
            path: "adminQuoteRequests",
            element: (
              <AdminRoute>
                <AdminQuoteRequests />
              </AdminRoute>
            ),
          },
          {
            path: "adminLiveRates",
            element: (
              <AdminRoute>
                <AdminLiveRates />
              </AdminRoute>
            ),
          },
        ],
      },

      {
        path: "products/:id",
        element: (
          <PrivateRoute>
            <ProductPageLayout />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="description" replace />,
          },
          {
            path: "description",
            element: <ProductDescription />,
          },
          {
            path: "reviews",
            element: <ProductReviews />,
          },
        ],
      },
]);

export default router;
