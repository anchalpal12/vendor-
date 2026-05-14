import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from './context/AppContext';

import Login from './pages/auth/Login';
import AdminLayout from './components/layout/AdminLayout';
import VendorLayout from './components/layout/VendorLayout';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import VendorOnboarding from './pages/admin/VendorOnboarding';
import VendorManagement from './pages/admin/VendorManagement';
import ProductCatalog from './pages/admin/ProductCatalog';
import PurchaseOrders from './pages/admin/PurchaseOrders';
import Invoices from './pages/admin/Invoices';
import Payments from './pages/admin/Payments';
import VendorPerformance from './pages/admin/VendorPerformance';

// Vendor Pages
import VendorRegistration from './pages/vendor/VendorRegistration';
import ApprovalStatus from './pages/vendor/ApprovalStatus';
import VendorDashboard from './pages/vendor/VendorDashboard';
import POManagement from './pages/vendor/POManagement';
import InvoiceSubmission from './pages/vendor/InvoiceSubmission';
import Shipments from './pages/vendor/Shipments';
import VendorPayments from './pages/vendor/VendorPayments';
import VendorBarcode from './pages/vendor/VendorBarcode';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useContext(AppContext);
  if (!user || user.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* Vendor Registration/Status (Public/Semi-public) */}
        <Route path="/vendor/register" element={<VendorRegistration />} />
        <Route path="/vendor/status" element={<ApprovalStatus />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute requiredRole="Admin"><AdminLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="onboarding" element={<VendorOnboarding />} />
          <Route path="vendors" element={<VendorManagement />} />
          <Route path="products" element={<ProductCatalog />} />
          <Route path="purchase-orders" element={<PurchaseOrders />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="payments" element={<Payments />} />
          <Route path="performance" element={<VendorPerformance />} />
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        {/* Vendor Routes */}
        <Route path="/vendor" element={<ProtectedRoute requiredRole="Vendor"><VendorLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="purchase-orders" element={<POManagement />} />
          <Route path="invoices" element={<InvoiceSubmission />} />
          <Route path="shipments" element={<Shipments />} />
          <Route path="payments" element={<VendorPayments />} />
          <Route path="barcode" element={<VendorBarcode />} />
          <Route index element={<Navigate to="/vendor/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
