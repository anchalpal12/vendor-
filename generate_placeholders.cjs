const fs = require('fs');
const path = require('path');

const files = {
  'src/pages/auth/Login.jsx': `export default function Login() { return <div className="p-8">Login</div>; }`,
  'src/pages/admin/AdminDashboard.jsx': `export default function AdminDashboard() { return <div className="p-8">AdminDashboard</div>; }`,
  'src/pages/admin/VendorOnboarding.jsx': `export default function VendorOnboarding() { return <div className="p-8">VendorOnboarding</div>; }`,
  'src/pages/admin/VendorManagement.jsx': `export default function VendorManagement() { return <div className="p-8">VendorManagement</div>; }`,
  'src/pages/admin/ProductCatalog.jsx': `export default function ProductCatalog() { return <div className="p-8">ProductCatalog</div>; }`,
  'src/pages/admin/PurchaseOrders.jsx': `export default function PurchaseOrders() { return <div className="p-8">PurchaseOrders</div>; }`,
  'src/pages/admin/Invoices.jsx': `export default function Invoices() { return <div className="p-8">Invoices</div>; }`,
  'src/pages/admin/Payments.jsx': `export default function Payments() { return <div className="p-8">Payments</div>; }`,
  'src/pages/admin/VendorPerformance.jsx': `export default function VendorPerformance() { return <div className="p-8">VendorPerformance</div>; }`,
  'src/pages/vendor/VendorRegistration.jsx': `export default function VendorRegistration() { return <div className="p-8">VendorRegistration</div>; }`,
  'src/pages/vendor/ApprovalStatus.jsx': `export default function ApprovalStatus() { return <div className="p-8">ApprovalStatus</div>; }`,
  'src/pages/vendor/VendorDashboard.jsx': `export default function VendorDashboard() { return <div className="p-8">VendorDashboard</div>; }`,
  'src/pages/vendor/POManagement.jsx': `export default function POManagement() { return <div className="p-8">POManagement</div>; }`,
  'src/pages/vendor/InvoiceSubmission.jsx': `export default function InvoiceSubmission() { return <div className="p-8">InvoiceSubmission</div>; }`,
  'src/pages/vendor/Shipments.jsx': `export default function Shipments() { return <div className="p-8">Shipments</div>; }`,
  'src/pages/vendor/VendorPayments.jsx': `export default function VendorPayments() { return <div className="p-8">VendorPayments</div>; }`,
  'src/pages/vendor/VendorBarcode.jsx': `export default function VendorBarcode() { return <div className="p-8">VendorBarcode</div>; }`,
  'src/components/layout/AdminLayout.jsx': `import { Outlet } from 'react-router-dom'; export default function AdminLayout() { return <div className="flex h-screen"><div className="w-64 bg-slate-900 text-white">Sidebar</div><div className="flex-1 flex flex-col"><div className="h-16 bg-white border-b">Header</div><div className="flex-1 overflow-auto"><Outlet /></div></div></div>; }`,
  'src/components/layout/VendorLayout.jsx': `import { Outlet } from 'react-router-dom'; export default function VendorLayout() { return <div className="flex h-screen flex-col"><div className="h-16 bg-slate-900 text-white">Header</div><div className="flex-1 overflow-auto bg-slate-50"><Outlet /></div></div>; }`
};

Object.entries(files).forEach(([filepath, content]) => {
  const fullpath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullpath), { recursive: true });
  fs.writeFileSync(fullpath, content);
});
console.log("Placeholders generated");
