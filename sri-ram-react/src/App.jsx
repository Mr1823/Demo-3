import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.jsx'

import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Wishlist from './pages/Wishlist.jsx'
import Checkout from './pages/Checkout.jsx'
import CheckoutShipping from './pages/CheckoutShipping.jsx'
import CheckoutPayment from './pages/CheckoutPayment.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'
import OrderSuccessAlt from './pages/OrderSuccessAlt.jsx'
import MyOrders from './pages/MyOrders.jsx'
import AddressBook from './pages/AddressBook.jsx'
import AboutContact from './pages/AboutContact.jsx'

// No shared Header/Footer shell on these — auth screens, 404, and admin have their own layout
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import NotFound from './pages/NotFound.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

const withShell = (Page) => (
  <MainLayout>
    <Page />
  </MainLayout>
)

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={withShell(Home)} />
        <Route path="/shop" element={withShell(Shop)} />
        <Route path="/product/:id" element={withShell(ProductDetail)} />
        <Route path="/wishlist" element={withShell(Wishlist)} />
        <Route path="/checkout" element={withShell(Checkout)} />
        <Route path="/checkout/shipping" element={withShell(CheckoutShipping)} />
        <Route path="/checkout/payment" element={withShell(CheckoutPayment)} />
        <Route path="/order-success" element={withShell(OrderSuccess)} />
        <Route path="/order-success-alt" element={withShell(OrderSuccessAlt)} />
        <Route path="/dashboard/orders" element={withShell(MyOrders)} />
        <Route path="/dashboard/address-book" element={withShell(AddressBook)} />
        <Route path="/about" element={withShell(AboutContact)} />

        {/* No shared shell — these screens are designed standalone */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
