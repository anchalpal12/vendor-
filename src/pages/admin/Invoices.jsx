import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Eye, Check, X, FileText, Download } from 'lucide-react';
import clsx from 'clsx';

export default function Invoices() {
  const { invoices, setInvoices, vendors, pos } = useContext(AppContext);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [rejectRemarks, setRejectRemarks] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  // Focus primarily on invoices needing review
  const pendingInvoices = invoices.filter(i => i.status === 'Submitted');
  const pastInvoices = invoices.filter(i => i.status !== 'Submitted' && i.status !== 'Draft');

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Submitted': return 'bg-amber-100 text-amber-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const handleApprove = (id) => {
    setInvoices(invoices.map(i => i.id === id ? { ...i, status: 'Approved' } : i));
    setSelectedInvoice(null);
    setShowRejectInput(false);
  };

  const handleReject = (id) => {
    if (!rejectRemarks.trim()) return alert("Remarks are mandatory for rejection.");
    setInvoices(invoices.map(i => i.id === id ? { ...i, status: 'Rejected', remarks: rejectRemarks } : i));
    setSelectedInvoice(null);
    setShowRejectInput(false);
    setRejectRemarks('');
  };

  const renderTable = (invoiceList, title) => (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-slate-900 mb-4">{title}</h3>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Invoice Ref</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Vendor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Linked PO</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoiceList.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-slate-500">No invoices found.</td></tr>
              ) : (
                invoiceList.map((inv) => {
                  const vendor = vendors.find(v => v.id === inv.vendorId);
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{inv.id}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{vendor?.companyName}</td>
                      <td className="px-6 py-4 text-sm text-indigo-600 hover:underline cursor-pointer">{inv.poId}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{inv.date}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">$\{(inv.amount || 0).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={clsx("px-2.5 py-0.5 rounded-full text-xs font-medium inline-block", getStatusColor(inv.status))}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setSelectedInvoice(inv)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-md transition-colors inline-flex">
                          <Eye className="w-4 h-4 mr-1" /> View
                        </button>
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Invoice Approval</h2>
      
      {renderTable(pendingInvoices, 'Pending Approval')}
      {renderTable(pastInvoices, 'Invoice History')}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl flex flex-col md:flex-row">
             
             {/* Left side: Document Preview Placeholder */}
             <div className="bg-slate-100 md:w-1/2 p-6 flex flex-col items-center justify-center border-r border-slate-200 min-h-[300px]">
                <FileText className="w-16 h-16 text-slate-400 mb-4" />
                <h3 className="text-lg font-bold text-slate-600 mb-2">Invoice Document</h3>
                <p className="text-sm text-slate-500 mb-6 text-center">In a real application, the uploaded PDF would be rendered here.</p>
                <button className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center">
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </button>
             </div>

             {/* Right side: Details & Actions */}
             <div className="p-6 md:w-1/2 flex flex-col h-full overflow-y-auto">
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <h2 className="text-2xl font-bold text-slate-900">{selectedInvoice.id}</h2>
                   <span className={clsx("px-2.5 py-0.5 rounded-full text-xs font-medium inline-block mt-2", getStatusColor(selectedInvoice.status))}>
                     {selectedInvoice.status}
                   </span>
                 </div>
                 <button onClick={() => { setSelectedInvoice(null); setShowRejectInput(false); }} className="p-1 text-slate-400 hover:text-slate-600">
                   <X className="w-6 h-6" />
                 </button>
               </div>

               <div className="space-y-4 mb-8 flex-1">
                 <div>
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vendor</label>
                   <p className="text-slate-900 font-medium">{vendors.find(v => v.id === selectedInvoice.vendorId)?.companyName}</p>
                 </div>
                 <div>
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Linked PO</label>
                   <p className="text-indigo-600 font-medium">{selectedInvoice.poId}</p>
                 </div>
                 <div className="flex justify-between">
                   <div>
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date</label>
                     <p className="text-slate-900">{selectedInvoice.date}</p>
                   </div>
                   <div className="text-right">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Amount</label>
                     <p className="text-xl font-bold text-slate-900">$\{(selectedInvoice.amount || 0).toFixed(2)}</p>
                   </div>
                 </div>
               </div>

               <div className="pt-6 border-t border-slate-200 mt-auto">
                 {selectedInvoice.status === 'Submitted' ? (
                   !showRejectInput ? (
                     <div className="flex space-x-3 w-full">
                       <button onClick={() => setShowRejectInput(true)} className="flex-1 py-2.5 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors flex items-center justify-center">
                         <X className="w-5 h-5 mr-1.5" /> Reject
                       </button>
                       <button onClick={() => handleApprove(selectedInvoice.id)} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center shadow-sm">
                         <Check className="w-5 h-5 mr-1.5" /> Approve
                       </button>
                     </div>
                   ) : (
                     <div className="space-y-3">
                       <label className="block text-sm font-medium text-red-800">Rejection Remarks *</label>
                       <textarea 
                         value={rejectRemarks}
                         onChange={(e) => setRejectRemarks(e.target.value)}
                         className="w-full px-3 py-2 border border-red-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                         rows="3" placeholder="Provide reason..." required
                       />
                       <div className="flex space-x-3">
                         <button onClick={() => setShowRejectInput(false)} className="flex-1 py-2 text-slate-600 hover:bg-slate-50 font-medium rounded-lg border border-slate-200">Cancel</button>
                         <button onClick={() => handleReject(selectedInvoice.id)} disabled={!rejectRemarks.trim()} className="flex-1 py-2 bg-red-600 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors">Confirm Reject</button>
                       </div>
                     </div>
                   )
                 ) : (
                   <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center text-sm text-slate-600">
                     This invoice was <strong>{selectedInvoice.status.toLowerCase()}</strong>.
                     {selectedInvoice.remarks && <p className="mt-2 text-red-600 text-left bg-white p-2 rounded border border-red-100">Remarks: {selectedInvoice.remarks}</p>}
                   </div>
                 )}
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}