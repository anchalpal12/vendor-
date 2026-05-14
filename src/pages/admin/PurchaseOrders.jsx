import { useContext, useState, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import { Plus, Trash2, Eye, CheckCircle, FileText, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';

export default function PurchaseOrders() {
  const { pos, setPos, vendors, products } = useContext(AppContext);
  const [view, setView] = useState('list'); // 'list' | 'create' | 'preview'
  const [selectedPO, setSelectedPO] = useState(null);

  // Form State
  const generatePONumber = () => `PO-${Math.floor(1000 + Math.random() * 9000)}`;
  const [formData, setFormData] = useState({
    id: generatePONumber(),
    vendorId: '',
    deliveryDate: '',
    paymentTerms: 'Net 30',
    lineItems: [{ productId: '', quantity: 1, rate: 0 }]
  });

  const handleAddLineItem = () => {
    setFormData({ ...formData, lineItems: [...formData.lineItems, { productId: '', quantity: 1, rate: 0 }] });
  };

  const handleRemoveLineItem = (index) => {
    const newItems = formData.lineItems.filter((_, i) => i !== index);
    setFormData({ ...formData, lineItems: newItems });
  };

  const handleLineItemChange = (index, field, value) => {
    const newItems = [...formData.lineItems];
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      newItems[index] = { ...newItems[index], productId: value, rate: product ? product.price : 0 };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setFormData({ ...formData, lineItems: newItems });
  };

  const calculateTotal = () => {
    return formData.lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    setView('preview');
  };

  const handleConfirmPO = () => {
    const newPO = {
      id: formData.id,
      vendorId: formData.vendorId,
      date: new Date().toISOString().split('T')[0],
      deliveryDate: formData.deliveryDate,
      status: 'Pending',
      total: calculateTotal(),
      paymentTerms: formData.paymentTerms,
      lineItems: formData.lineItems // Saving line items
    };
    setPos([newPO, ...pos]);
    setView('list');
    setFormData({
      id: generatePONumber(), vendorId: '', deliveryDate: '', paymentTerms: 'Net 30', lineItems: [{ productId: '', quantity: 1, rate: 0 }]
    });
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

  // View: List
  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">Purchase Orders</h2>
          <button 
            onClick={() => { setFormData({...formData, id: generatePONumber()}); setView('create'); }}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create PO
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">PO Number</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {pos.map((po) => {
                  const vendor = vendors.find(v => v.id === po.vendorId);
                  return (
                    <tr key={po.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-indigo-600">{po.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{vendor?.companyName || 'Unknown'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{po.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">$\{(po.total || 0).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", getStatusColor(po.status))}>
                          {po.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // View: Create
  if (view === 'create') {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <button onClick={() => setView('list')} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-slate-900">Create Purchase Order</h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <form onSubmit={handleCreateSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">PO Number</label>
                <input type="text" value={formData.id} disabled className="w-full border-slate-300 rounded-md shadow-sm bg-slate-50 px-3 py-2 border text-slate-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Vendor *</label>
                <select 
                  value={formData.vendorId} 
                  onChange={e => setFormData({...formData, vendorId: e.target.value})} 
                  className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border bg-white" required
                >
                  <option value="">-- Choose Vendor --</option>
                  {vendors.filter(v => v.status === 'Active').map(v => <option key={v.id} value={v.id}>{v.companyName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expected Delivery Date *</label>
                <input type="date" value={formData.deliveryDate} onChange={e => setFormData({...formData, deliveryDate: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Terms</label>
                <select value={formData.paymentTerms} onChange={e => setFormData({...formData, paymentTerms: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border bg-white">
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 60">Net 60</option>
                  <option value="Due on Receipt">Due on Receipt</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Line Items</h3>
              
              <div className="space-y-4">
                {formData.lineItems.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-4 items-end bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Product</label>
                      <select 
                        value={item.productId} 
                        onChange={(e) => handleLineItemChange(index, 'productId', e.target.value)}
                        className="w-full border-slate-300 rounded-md px-3 py-2 border bg-white text-sm" required
                      >
                        <option value="">-- Select --</option>
                        {products.filter(p => !formData.vendorId || p.vendorId === formData.vendorId).map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full sm:w-24">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Qty</label>
                      <input type="number" min="1" value={item.quantity} onChange={(e) => handleLineItemChange(index, 'quantity', parseInt(e.target.value) || 0)} className="w-full border-slate-300 rounded-md px-3 py-2 border text-sm" required />
                    </div>
                    <div className="w-full sm:w-32">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Rate ($)</label>
                      <input type="number" step="0.01" min="0" value={item.rate} onChange={(e) => handleLineItemChange(index, 'rate', parseFloat(e.target.value) || 0)} className="w-full border-slate-300 rounded-md px-3 py-2 border text-sm bg-white" required />
                    </div>
                    <div className="w-full sm:w-32">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Amount ($)</label>
                      <div className="px-3 py-2 bg-slate-200 rounded-md border border-slate-300 text-sm font-medium text-slate-700">
                        {((item.quantity || 0) * (item.rate || 0)).toFixed(2)}
                      </div>
                    </div>
                    {formData.lineItems.length > 1 && (
                      <button type="button" onClick={() => handleRemoveLineItem(index)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors h-[38px]">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <button type="button" onClick={handleAddLineItem} className="mt-4 flex items-center text-sm text-indigo-600 font-medium hover:text-indigo-800">
                <Plus className="w-4 h-4 mr-1" /> Add Row
              </button>
            </div>

            <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
              <div className="text-xl font-bold text-slate-900">
                Total: <span className="text-indigo-600">${calculateTotal().toFixed(2)}</span>
              </div>
              <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm">
                Preview Order
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // View: Preview
  if (view === 'preview') {
    const vendor = vendors.find(v => v.id === formData.vendorId);
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Review Purchase Order</h2>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
             <div>
               <h1 className="text-3xl font-bold text-indigo-600 mb-2">PURCHASE ORDER</h1>
               <p className="text-slate-500 font-medium">#{formData.id}</p>
             </div>
             <div className="text-right text-sm text-slate-600 space-y-1">
               <p><span className="font-medium text-slate-900">Date:</span> {new Date().toLocaleDateString()}</p>
               <p><span className="font-medium text-slate-900">Delivery Date:</span> {formData.deliveryDate}</p>
               <p><span className="font-medium text-slate-900">Payment Terms:</span> {formData.paymentTerms}</p>
             </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Vendor Details</h3>
            <p className="font-bold text-slate-900 text-lg">{vendor?.companyName}</p>
            <p className="text-slate-600">{vendor?.address}</p>
            <p className="text-slate-600">{vendor?.contactName} ({vendor?.email})</p>
          </div>

          <table className="min-w-full divide-y divide-slate-200 mb-8">
             <thead className="bg-slate-50">
               <tr>
                 <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Description</th>
                 <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Qty</th>
                 <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Rate</th>
                 <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Amount</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-200">
                {formData.lineItems.map((item, idx) => {
                  const product = products.find(p => p.id === item.productId);
                  return (
                    <tr key={idx}>
                      <td className="px-4 py-3 text-sm text-slate-900">{product ? `${product.name} (${product.sku})` : 'Item'}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 text-right">${item.rate.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 text-right">${(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  )
                })}
             </tbody>
             <tfoot>
               <tr>
                 <td colSpan="3" className="px-4 py-4 text-right font-bold text-slate-900">Total Amount</td>
                 <td className="px-4 py-4 text-right font-bold text-indigo-600 text-lg">${calculateTotal().toFixed(2)}</td>
               </tr>
             </tfoot>
          </table>

          <div className="flex justify-end space-x-4 pt-6">
            <button onClick={() => setView('create')} className="px-6 py-2 text-slate-600 border border-slate-300 hover:bg-slate-50 rounded-lg font-medium transition-colors">
              Edit Details
            </button>
            <button onClick={handleConfirmPO} className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors flex items-center shadow-sm">
              <CheckCircle className="w-5 h-5 mr-2" />
              Confirm & Submit PO
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null;
}