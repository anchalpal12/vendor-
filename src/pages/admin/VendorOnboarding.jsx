import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Check, X, Eye, Clock, FileText } from 'lucide-react';

export default function VendorOnboarding() {
  const { vendors, setVendors } = useContext(AppContext);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [rejectRemarks, setRejectRemarks] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const pendingVendors = vendors.filter(v => v.status === 'Pending');

  const handleApprove = (id) => {
    setVendors(vendors.map(v => v.id === id ? { ...v, status: 'Active' } : v));
    setSelectedVendor(null);
    setShowRejectInput(false);
  };

  const handleReject = (id) => {
    if (!rejectRemarks.trim()) return alert("Remarks are mandatory for rejection.");
    setVendors(vendors.map(v => v.id === id ? { ...v, status: 'Rejected', rejectRemarks } : v));
    setSelectedVendor(null);
    setShowRejectInput(false);
    setRejectRemarks('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Vendor Onboarding</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Company Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {pendingVendors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    No pending vendor registrations.
                  </td>
                </tr>
              ) : (
                pendingVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{vendor.companyName}</div>
                      <div className="text-sm text-slate-500">{vendor.industry}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{vendor.contactName}</div>
                      <div className="text-sm text-slate-500">{vendor.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-slate-500">
                        <Clock className="w-4 h-4 mr-1.5" />
                        {vendor.submittedDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedVendor(vendor)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors inline-flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1.5" />
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Drawer for Vendor Review */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-slate-900">Review Application: {selectedVendor.companyName}</h3>
              <button 
                onClick={() => { setSelectedVendor(null); setShowRejectInput(false); }}
                className="text-slate-400 hover:text-slate-500 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Company Details</h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm text-slate-500">Registration Number</dt>
                      <dd className="text-sm font-medium text-slate-900">{selectedVendor.registrationNumber}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-slate-500">Industry</dt>
                      <dd className="text-sm font-medium text-slate-900">{selectedVendor.industry}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-slate-500">Address</dt>
                      <dd className="text-sm font-medium text-slate-900">{selectedVendor.address}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Contact Information</h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm text-slate-500">Primary Contact</dt>
                      <dd className="text-sm font-medium text-slate-900">{selectedVendor.contactName} ({selectedVendor.designation})</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-slate-500">Email</dt>
                      <dd className="text-sm font-medium text-slate-900">{selectedVendor.email}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-slate-500">Phone</dt>
                      <dd className="text-sm font-medium text-slate-900">{selectedVendor.phone}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Uploaded Documents</h4>
                <div className="flex space-x-4">
                  {['GST_Certificate.pdf', 'PAN_Card.pdf', 'Bank_Statement.pdf'].map(doc => (
                    <div key={doc} className="flex items-center p-3 border border-slate-200 rounded-lg bg-slate-50 w-48">
                      <FileText className="w-6 h-6 text-indigo-500 mr-2 flex-shrink-0" />
                      <span className="text-xs font-medium text-slate-700 truncate">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-slate-200 pt-6">
                {!showRejectInput ? (
                  <div className="flex justify-end space-x-4">
                    <button 
                      onClick={() => setShowRejectInput(true)}
                      className="px-4 py-2 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-md font-medium transition-colors flex items-center"
                    >
                      <X className="w-5 h-5 mr-1.5" />
                      Reject
                    </button>
                    <button 
                      onClick={() => handleApprove(selectedVendor.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium transition-colors flex items-center shadow-sm"
                    >
                      <Check className="w-5 h-5 mr-1.5" />
                      Approve Vendor
                    </button>
                  </div>
                ) : (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-red-800 mb-1">Reason for Rejection *</label>
                      <textarea 
                        value={rejectRemarks}
                        onChange={(e) => setRejectRemarks(e.target.value)}
                        className="w-full px-3 py-2 border border-red-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        rows="3"
                        placeholder="Please provide details..."
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button 
                        onClick={() => setShowRejectInput(false)}
                        className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleReject(selectedVendor.id)}
                        disabled={!rejectRemarks.trim()}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-md font-medium transition-colors"
                      >
                        Confirm Rejection
                      </button>
                    </div>
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