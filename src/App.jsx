import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import AllProducts from './components/AllProducts';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/Dashboard/UserDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import VendorDashboard from './pages/Dashboard/VendorDashboard';
import BecomeAdmin from './pages/BecomeAdmin';
import BecomeVendor from './pages/BecomeVendor';
import Offers from './pages/Offers';
import PaymentSuccess from './pages/PaymentSuccess';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import RoleRoute from './components/RoleRoute';
import ErrorPage from './components/ErrorPage';
import './App.css';
import './theme.css'; // Theme CSS
import './index.css'; // Main CSS

function AppContent() {
  const { isDark } = useTheme();
  
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 light:from-blue-50 light:via-white light:to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500 ease-in-out">
        <Header />
        <main className="flex-1 max-w-full mx-auto container-responsive">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<AllProducts />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            
            <Route path="/dashboard/user" element={
              <PrivateRoute>
                <RoleRoute allowedRoles={['user']}>
                  <UserDashboard />
                </RoleRoute>
              </PrivateRoute>
            } />
            
            <Route path="/dashboard/admin" element={
              <PrivateRoute>
                <RoleRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </RoleRoute>
              </PrivateRoute>
            } />
            
            <Route path="/dashboard/vendor" element={
              <PrivateRoute>
                <RoleRoute allowedRoles={['vendor']}>
                  <VendorDashboard />
                </RoleRoute>
              </PrivateRoute>
            } />
            
            <Route path="/become-admin" element={
              <PrivateRoute>
                <RoleRoute allowedRoles={['user']}>
                  <BecomeAdmin />
                </RoleRoute>
              </PrivateRoute>
            } />
            
            <Route path="/become-vendor" element={
              <PrivateRoute>
                <RoleRoute allowedRoles={['user']}>
                  <BecomeVendor />
                </RoleRoute>
              </PrivateRoute>
            } />
            
            {/* Error Page */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={isDark ? 'dark' : 'light'}
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
