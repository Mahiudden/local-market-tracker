import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import AllProducts from './components/AllProducts';
import Offers from './pages/Offers';
import ProductDetails from './pages/ProductDetails';
import Register from './pages/Register';
import Login from './pages/Login';
import ErrorPage from './components/ErrorPage';
import RoleRoute from './components/RoleRoute';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import VendorDashboard from './pages/Dashboard/VendorDashboard';
import UserDashboard from './pages/Dashboard/UserDashboard';
import PaymentSuccess from './pages/PaymentSuccess';
import BecomeVendor from './pages/BecomeVendor';
import BecomeAdmin from './pages/BecomeAdmin';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/product/:id" element={<PrivateRoute><ProductDetails /></PrivateRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/become-vendor" element={<RoleRoute allowedRoles={["user"]}><BecomeVendor /></RoleRoute>} />
        <Route path="/become-admin" element={<RoleRoute allowedRoles={["user"]}><BecomeAdmin /></RoleRoute>} />
        <Route path="/dashboard/admin" element={
          <RoleRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </RoleRoute>
        } />
        <Route path="/dashboard/vendor" element={
          <RoleRoute allowedRoles={["vendor"]}>
            <VendorDashboard />
          </RoleRoute>
        } />
        <Route path="/dashboard/user" element={
          <RoleRoute allowedRoles={["user"]}>
            <UserDashboard />
          </RoleRoute>
        } />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
