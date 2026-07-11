import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProductPageLayout from "./layouts/ProductPageLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Main Pages
import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/Shop/Shop";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Checkout from "./pages/Checkout/Checkout";
import Wishlist from "./pages/Wishlist/Wishlist";
import Payment from "./pages/Payment/Payment";
import OrderSuccess from "./pages/OrderSuccess/OrderSuccess";
import ErrorPage from "./pages/ErrorPage/ErrorPage";

// Dashboard Pages
import AdminDashboard from "./pages/Dashboard/AdminDashboard/AdminDashboard";
import AdminProducts from "./pages/Dashboard/AdminProducts/AdminProducts";
import AdminAddProduct from "./pages/Dashboard/AdminAddProduct/AdminAddProduct";
import AdminOrders from "./pages/Dashboard/AdminOrders/AdminOrders";
import AdminCategories from "./pages/AdminCategories/AdminCategories";
import AdminManageUsers from "./pages/AdminManageUsers/AdminManageUsers";
import MyDashboard from "./pages/Dashboard/MyDashboard/MyDashboard";
import MyOrders from "./pages/Dashboard/MyOrders/MyOrders";
import AddressBook from "./pages/Dashboard/AddressBook/AddressBook";

const App = () => {
  return (
    <Routes>
      {/* Main Layout Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="payment" element={<Payment />} />
        <Route path="order-success" element={<OrderSuccess />} />
        <Route path="*" element={<ErrorPage />} />
      </Route>

      {/* Product Details Layout Route */}
      <Route path="/products/:id" element={<ProductPageLayout />} />

      {/* Dashboard Layout Routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="my-dashboard" element={<MyDashboard />} />
        <Route path="my-orders" element={<MyOrders />} />
        <Route path="address-book" element={<AddressBook />} />
        <Route path="admin-products" element={<AdminProducts />} />
        <Route path="admin-add-product" element={<AdminAddProduct />} />
        <Route path="admin-orders" element={<AdminOrders />} />
        <Route path="admin-categories" element={<AdminCategories />} />
        <Route path="admin-users" element={<AdminManageUsers />} />
      </Route>
    </Routes>
  );
};

export default App;
