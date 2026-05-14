import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck } from 'lucide-react';

export default function Login() {
  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    login('Admin');
    navigate('/admin/dashboard');
  };

  const handleVendorLogin = () => {
    login('Vendor', 'V001'); // Hardcoding to first vendor for demo
    navigate('/vendor/dashboard');
  };

  const handleRegister = () => {
    navigate('/vendor/register');
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
             <ShieldCheck className="w-10 h-10 text-white transform -rotate-3" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Vendor Portal
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Select your role to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          <div className="space-y-6">
            <button
              onClick={handleAdminLogin}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:-translate-y-0.5"
            >
              <ShieldCheck className="w-5 h-5 mr-2" />
              Sign in as Admin
            </button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-400 font-medium">External Partners</span>
              </div>
            </div>
            <button
              onClick={handleVendorLogin}
              className="w-full flex justify-center items-center py-3.5 px-4 border-2 border-slate-200 rounded-xl shadow-sm text-sm font-medium text-slate-700 bg-white hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200"
            >
              <User className="w-5 h-5 mr-2 text-slate-400" />
              Sign in as Vendor (Demo)
            </button>
          </div>
          
          <div className="mt-8 border-t border-slate-100 pt-6 text-center">
             <p className="text-sm text-slate-500">
               Interested in becoming a partner?{' '}
               <button onClick={handleRegister} className="text-indigo-600 font-semibold hover:text-indigo-500 transition-colors">
                 Apply Now
               </button>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}