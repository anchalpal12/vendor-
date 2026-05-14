import { useContext, useState, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import { Check, X, FileText, ArrowLeft, Download, Eye } from 'lucide-react';
import clsx from 'clsx';

export default function POManagement() {
  const { user, pos, setPos, products } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('Pending');
  const [selectedPO, setSelectedPO] = useState(null);
  const [rejectRemarks, setRejectRemarks] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const vendorId = user?.vendorId;
  const myPOs = pos.filter(po => po.vendorId === vendorId);

  const filteredPOs = useMemo(() => {
    return myPOs.filter(po => po.status === activeTab);
  }, [myPOs, activeTab]);

  const tabs = ['Pending', 'Accepted', 'Rejected', 'Fulfilled'];

  const handleAccept = (id) => {
    setPos(pos.map(p => p.id === id ? { ...p, status: 'Accepted' } : p));
    setSelectedPO(null);
    setShowRejectInput(false);
  };

  const handleReject = (id) => {
    if (!rejectRemarks.trim()) return alert("Remarks are required to reject a PO.");
    setPos(pos.map(p => p.id === id ? { ...p, status: 'Rejected', remarks: rejectRemarks } : p));
    setSelectedPO(null);
    setShowRejectInput(false);
    setRejectRemarks('');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Accepted': return 'bg-blue-100 text-blue-800';
      case 'Fulfilled': return 'bg-emerald-100 text-emerald-800';
      case 'Pending': return 'bg-amber-100 text-amber-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  if (selectedPO) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => {setSelectedPO(null); setShowRejectInput(false);}} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-slate-900">Purchase Order {selectedPO.id}</h2>
            <span className={clsx("px-3 py-1 rounded-full text-xs font-bold", getStatusColor(selectedPO.status))}>
              {selectedPO.status}
            </span>
          </div>
          <button className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <Download className="w-4 h-4 mr-2" /> Download PDF
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-slate-200">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Order Date</h3>
                <p className="font-medium text-slate-900">{selectedPO.date}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Expected Delivery</h3>
                <p className="font-medium text-slate-900">{selectedPO.deliveryDate}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Payment Terms</h3>
                <p className="font-medium text-slate-900">{selectedPO.paymentTerms}</p>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-4">Line Items</h3>
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Item Description</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Quantity</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Unit Price</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedPO.lineItems ? selectedPO.lineItems.map((item, idx) => {
                    const product = products.find(p => p.id === item.productId);
                    return (
                      <tr key={idx}>
                        <td className="px-4 py-4 text-sm text-slate-900">
                          <div className="font-medium">{product?.name || 'Unknown Product'}</div>
                          <div className="text-slate-500 text-xs mt-0.5">SKU: {product?.sku || '-'}</div>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600 text-right">{item.quantity}</td>
                        <td className="px-4 py-4 text-sm text-slate-600 text-right">$\{(item.rate || 0).toFixed(2)}</td>
                        <td className="px-4 py-4 text-sm font-bold text-slate-900 text-right">$\{(item.quantity * (item.rate || 0)).toFixed(2)}</td>
                      </tr>
                    )
                  }) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-4 text-sm text-slate-500 text-center">No line items detailed (Mock Data Fallback). Total: $\{(selectedPO.total || 0).toFixed(2)}</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50">
                    <td colSpan="3" className="px-4 py-4 text-right text-sm font-bold text-slate-900">Grand Total</td>
                    <td className="px-4 py-4 text-right font-bold text-indigo-600 text-lg">$\{(selectedPO.total || 0).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {selectedPO.status === 'Pending' && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">Action Required</h4>
                  <p className="text-sm text-slate-600">Please review the terms and confirm if you can fulfill this order by {selectedPO.deliveryDate}.</p>
                </div>
                {!showRejectInput ? (
                  <div className="flex space-x-3 w-full md:w-auto">
                    <button onClick={() => setShowRejectInput(true)} className="flex-1 md:flex-none px-6 py-2.5 border border-red-200 text-red-600 bg-white hover:bg-red-50 rounded-lg font-medium transition-colors">
                      Reject Order
                    </button>
                    <button onClick={() => handleAccept(selectedPO.id)} className="flex-1 md:flex-none px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm">
                      Accept Order
                    </button>
                  </div>
                ) : (
                  <div className="w-full md:w-auto flex-1 md:max-w-md">
                    <textarea 
                      value={rejectRemarks}
                      onChange={(e) => setRejectRemarks(e.target.value)}
                      className="w-full px-3 py-2 border border-red-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm mb-3"
                      rows="2" placeholder="Reason for rejection (e.g., cannot meet delivery date)..." required
                    />
                    <div className="flex space-x-3 justify-end">
                      <button onClick={() => setShowRejectInput(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 font-medium rounded-md">Cancel</button>
                      <button onClick={() => handleReject(selectedPO.id)} disabled={!rejectRemarks.trim()} className="px-4 py-2 text-sm bg-red-600 disabled:bg-red-400 text-white rounded-md font-medium transition-colors">Confirm Rejection</button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {selectedPO.status === 'Rejected' && selectedPO.remarks && (
               <div className="bg-red-50 border border-red-100 p-4 rounded-lg">
                 <p className="text-sm font-bold text-red-800 mb-1">Rejection Reason:</p>
                 <p className="text-sm text-red-700">{selectedPO.remarks}</p>
               </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Purchase Orders</h2>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                activeTab === tab
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
              )}
            >
              {tab}
              <span className={clsx(
                "ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium",
                activeTab === tab ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-900"
              )}>
                {myPOs.filter(po => po.status === tab).length}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {filteredPOs.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <FileText className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No Orders Found</h3>
            <p className="text-slate-500">You don't have any {activeTab.toLowerCase()} purchase orders at the moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">PO Number</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Delivery By</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredPOs.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-indigo-600">{po.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{po.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{po.deliveryDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 text-right">$\{(po.total || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedPO(po)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors inline-flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1.5" />
                        View Details
                      </button>
                    </td>
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