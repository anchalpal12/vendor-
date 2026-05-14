import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { LayoutDashboard, FileText, Receipt, Package, Truck, CreditCard, LogOut, Menu, X, User } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { path: '/vendor/dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/vendor/purchase-orders', name: 'POs', icon: FileText },
  { path: '/vendor/invoices', name: 'Invoices', icon: Receipt },
  { path: '/vendor/shipments', name: 'Shipments', icon: Truck },
  { path: '/vendor/payments', name: 'Payments', icon: CreditCard },
  { path: '/vendor/barcode', name: 'Barcodes', icon: Package },
];

export default function VendorLayout() {
  const { logout, user } = useContext(AppContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* Top Header & Nav */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold tracking-wider">VENDOR<span className="text-indigo-400">PORTAL</span></h1>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      clsx(
                        "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white"
                      )
                    }
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>

            {/* User & Logout (Desktop) */}
            <div className="hidden md:flex items-center space-x-4">
               <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-slate-300">{user?.vendorId || 'Vendor'}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-md"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-800 shadow-xl">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      clsx(
                        "flex items-center px-3 py-2 rounded-md text-base font-medium",
                        isActive ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white"
                      )
                    }
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </NavLink>
                );
              })}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-slate-700 hover:text-red-300"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}