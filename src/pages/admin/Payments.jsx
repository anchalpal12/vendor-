import { useContext, useState, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import { Search, Filter, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

export default function Payments() {
  const { payments, setPayments, vendors } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const vendor = vendors.find(v => v.id === p.vendorId);
      const matchesSearch = vendor?.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' ? true : p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [payments, searchTerm, statusFilter, vendors]);

  const handleReleasePayment = (id) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status: 'Released', releaseDate: new Date().toISOString().split('T')[0] } : p));
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Released': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle className="w-3 h-3 mr-1"/> Released</span>;
      case 'Pending': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><Clock className="w-3 h-3 mr-1"/> Pending</span>;
      case 'Overdue': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1"/> Overdue</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Payment Tracking</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search vendor or invoice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm w-full sm:w-64"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-slate-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm appearance-none bg-white w-full sm:w-auto"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Released">Released</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Vendor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Invoice Ref</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Due Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Release Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPayments.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-slate-500">No payment records found.</td></tr>
              ) : (
                filteredPayments.map((payment) => {
                  const vendor = vendors.find(v => v.id === payment.vendorId);
                  return (
                    <tr key={payment.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{vendor?.companyName}</td>
                      <td className="px-6 py-4 text-sm text-indigo-600">{payment.invoiceId}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">$\{(payment.amount || 0).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{payment.dueDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(payment.status)}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{payment.releaseDate || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        {(payment.status === 'Pending' || payment.status === 'Overdue') ? (
                          <button 
                            onClick={() => handleReleasePayment(payment.id)} 
                            className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium rounded transition-colors"
                          >
                            Release Funds
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">Processed</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}