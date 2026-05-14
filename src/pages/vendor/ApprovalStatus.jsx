import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

export default function ApprovalStatus() {
  const { vendors } = useContext(AppContext);
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    const regId = localStorage.getItem('registrationId');
    if (!regId) {
      navigate('/login');
      return;
    }
    const foundVendor = vendors.find(v => v.id === regId);
    if (foundVendor) {
      setVendor(foundVendor);
    } else {
      navigate('/login');
    }
  }, [vendors, navigate]);

  if (!vendor) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-md w-full bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100 p-8 text-center">
        
        {vendor.status === 'Pending' && (
          <div className="space-y-6">
            <div className="mx-auto w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6">
              <Clock className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Application Under Review</h2>
            <p className="text-slate-600">
              Thank you for registering, <span className="font-semibold text-slate-900">{vendor.companyName}</span>. 
              Your application is currently being reviewed by our administrative team.
            </p>
            <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-500 border border-slate-100">
              Registration ID: <span className="font-mono font-medium text-slate-700">{vendor.id}</span>
            </div>
            <p className="text-sm text-slate-500 pt-4">You will receive an email once the review is complete.</p>
          </div>
        )}

        {vendor.status === 'Active' && (
          <div className="space-y-6">
            <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Application Approved!</h2>
            <p className="text-slate-600">
              Congratulations, <span className="font-semibold text-slate-900">{vendor.companyName}</span>! 
              Your vendor account has been approved and is now active.
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="mt-6 w-full flex justify-center items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium transition-colors shadow-sm"
            >
              Proceed to Login <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}

        {vendor.status === 'Rejected' && (
          <div className="space-y-6">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Application Rejected</h2>
            <p className="text-slate-600">
              We regret to inform you that your application for <span className="font-semibold text-slate-900">{vendor.companyName}</span> has been rejected.
            </p>
            {vendor.rejectRemarks && (
              <div className="bg-red-50 rounded-lg p-4 border border-red-100 text-left">
                <p className="text-sm font-bold text-red-800 mb-1">Reason for rejection:</p>
                <p className="text-sm text-red-700">{vendor.rejectRemarks}</p>
              </div>
            )}
            <button 
              onClick={() => { localStorage.removeItem('registrationId'); navigate('/vendor/register'); }}
              className="mt-6 w-full flex justify-center items-center px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors"
            >
              Submit New Application
            </button>
          </div>
        )}

        {/* Back to Login link */}
        <div className="mt-8 pt-6 border-t border-slate-100">
           <button onClick={() => navigate('/login')} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Return to Home</button>
        </div>
      </div>
    </div>
  );
}