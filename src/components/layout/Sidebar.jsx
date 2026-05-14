import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, Package, FileText, Receipt, CreditCard, TrendingUp } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { path: '/admin/dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/onboarding', name: 'Vendor Onboarding', icon: UserPlus },
  { path: '/admin/vendors', name: 'Vendor Management', icon: Users },
  { path: '/admin/products', name: 'Product Catalog', icon: Package },
  { path: '/admin/purchase-orders', name: 'Purchase Orders', icon: FileText },
  { path: '/admin/invoices', name: 'Invoices', icon: Receipt },
  { path: '/admin/payments', name: 'Payments', icon: CreditCard },
  { path: '/admin/performance', name: 'Performance', icon: TrendingUp },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full">
      <div className="p-4 bg-slate-950 flex items-center justify-center h-16">
        <h1 className="text-white text-xl font-bold tracking-wider">PORTAL<span className="text-indigo-500">ADMIN</span></h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 space-y-1">
        <ul>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center px-6 py-3 transition-all duration-200 text-sm font-medium",
                      isActive 
                        ? "bg-indigo-600/10 text-indigo-400 border-l-4 border-indigo-500" 
                        : "hover:bg-slate-800 hover:text-white border-l-4 border-transparent"
                    )
                  }
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
