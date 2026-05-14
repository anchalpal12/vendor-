import { useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { LogOut, Bell, User } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useContext(AppContext);

  // Generate breadcrumbs from path
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
      <div className="flex items-center text-sm text-slate-500 font-medium">
        {pathnames.map((name, index) => {
          const isLast = index === pathnames.length - 1;
          const formattedName = name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ');
          return (
            <div key={name} className="flex items-center">
              {index > 0 && <span className="mx-2 text-slate-300">/</span>}
              <span className={isLast ? 'text-slate-900 font-semibold' : ''}>
                {formattedName}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <User className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-slate-700 hidden sm:block">
            {user?.role === 'Admin' ? 'Admin User' : 'Vendor'}
          </span>
          <button 
            onClick={handleLogout}
            className="p-2 ml-2 text-slate-400 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
