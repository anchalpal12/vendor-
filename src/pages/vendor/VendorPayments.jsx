import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { CheckCircle, Clock, AlertTriangle, CreditCard } from 'lucide-react';

export default function VendorPayments() {
  const { user, payments } = useContext(AppContext);
  const vendorId = user?.vendorId;
  const myPayments = payments.filter(p => p.vendorId === vendorId);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Released': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle className="w-3 h-3 mr-1"/> Paid</span>;
      case 'Pending': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><Clock className="w-3 h-3 mr-1"/> Pending</span>;
      case 'Overdue': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1"/> Overdue</span>;
      default: return null;
    }
  };

  const totalPaid = myPayments.filter(p => p.status === 'Released').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = myPayments.filter(p => p.status === 'Pending' || p.status === 'Overdue').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900">Payment Ledger</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100 flex items-center">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg mr-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-800 uppercase tracking-wider">Total Received</p>
            <p className="text-3xl font-bold text-emerald-900">${totalPaid.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
          </div>
        </div>
        <div className="bg-amber-50 rounded-xl p-6 border border-amber-100 flex items-center">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg mr-4">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-800 uppercase tracking-wider">Outstanding Balance</p>
            <p className="text-3xl font-bold text-amber-900">${totalPending.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {myPayments.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <CreditCard className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No Payment History</h3>
            <p className="text-slate-500">You don't have any payment records yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice Ref</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Received</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {myPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{payment.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-medium">{payment.invoiceId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 text-right">$\{(payment.amount || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{payment.dueDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(payment.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700">{payment.releaseDate || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}