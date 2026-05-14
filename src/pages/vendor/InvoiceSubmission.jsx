import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Plus, Trash2, UploadCloud, CheckCircle, Send } from 'lucide-react';

export default function InvoiceSubmission() {
  const { user, pos, invoices, setInvoices } = useContext(AppContext);
  const vendorId = user?.vendorId;
  const myPOs = pos.filter(po => po.vendorId === vendorId && po.status === 'Accepted');

  const generateInvNumber = () => `INV-${Math.floor(1000 + Math.random() * 9000)}`;

  const [formData, setFormData] = useState({
    id: generateInvNumber(),
    poId: '',
    date: new Date().toISOString().split('T')[0],
    lineItems: [{ description: '', quantity: 1, rate: 0 }],
    documents: []
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePOChange = (e) => {
    const selectedPO = myPOs.find(p => p.id === e.target.value);
    if (selectedPO) {
      // Map PO line items to Invoice line items conceptually
      const defaultItems = selectedPO.lineItems ? selectedPO.lineItems.map(item => ({
        description: `Product ID: ${item.productId}`,
        quantity: item.quantity,
        rate: item.rate
      })) : [{ description: 'Order Total', quantity: 1, rate: selectedPO.total }];
      
      setFormData({
        ...formData,
        poId: e.target.value,
        lineItems: defaultItems
      });
    } else {
      setFormData({ ...formData, poId: '', lineItems: [{ description: '', quantity: 1, rate: 0 }] });
    }
  };

  const handleAddLineItem = () => {
    setFormData({ ...formData, lineItems: [...formData.lineItems, { description: '', quantity: 1, rate: 0 }] });
  };

  const handleRemoveLineItem = (index) => {
    const newItems = formData.lineItems.filter((_, i) => i !== index);
    setFormData({ ...formData, lineItems: newItems });
  };

  const handleLineItemChange = (index, field, value) => {
    const newItems = [...formData.lineItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, lineItems: newItems });
  };

  const calculateTotal = () => {
    return formData.lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, documents: [file] }); // Just mock single file for now
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.poId) return alert("Please select a PO.");
    
    const newInvoice = {
      id: formData.id,
      poId: formData.poId,
      vendorId: vendorId,
      date: formData.date,
      amount: calculateTotal(),
      status: 'Submitted'
    };
    
    setInvoices([newInvoice, ...invoices]);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <div className="mx-auto w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Invoice Submitted Successfully!</h2>
        <p className="text-lg text-slate-600 mb-8">
          Your invoice <span className="font-bold">{formData.id}</span> has been sent to the Admin for approval.
        </p>
        <button 
          onClick={() => { setIsSubmitted(false); setFormData({ id: generateInvNumber(), poId: '', date: new Date().toISOString().split('T')[0], lineItems: [{ description: '', quantity: 1, rate: 0 }], documents: [] }); }}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm"
        >
          Submit Another Invoice
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900">Submit Invoice</h2>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Purchase Order *</label>
              <select 
                value={formData.poId} 
                onChange={handlePOChange} 
                className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border bg-white" required
              >
                <option value="">-- Choose Approved PO --</option>
                {myPOs.map(po => <option key={po.id} value={po.id}>{po.id} - ${po.total.toFixed(2)}</option>)}
              </select>
              {myPOs.length === 0 && <p className="text-xs text-amber-600 mt-1">You have no accepted POs to invoice against.</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Invoice Number (Auto)</label>
              <input type="text" value={formData.id} disabled className="w-full border-slate-300 rounded-md shadow-sm bg-slate-50 px-3 py-2 border text-slate-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Invoice Date *</label>
              <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border" required />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Invoice Line Items</h3>
            <div className="space-y-4">
              {formData.lineItems.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-4 items-end bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                    <input type="text" value={item.description} onChange={(e) => handleLineItemChange(index, 'description', e.target.value)} className="w-full border-slate-300 rounded-md px-3 py-2 border text-sm" placeholder="e.g. Consulting Services" required />
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

          <div className="pt-6 border-t border-slate-200">
             <h3 className="text-lg font-bold text-slate-900 mb-4">Upload Invoice Document</h3>
             <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors relative cursor-pointer group w-full">
                <input type="file" accept=".pdf" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required />
                <UploadCloud className="mx-auto h-12 w-12 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                <p className="mt-2 text-sm text-slate-600 font-medium">Click or drag your PDF invoice here</p>
                {formData.documents.length > 0 && <p className="mt-2 text-sm font-bold text-emerald-600">{formData.documents[0].name}</p>}
             </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
            <div className="text-2xl font-bold text-slate-900">
              Total: <span className="text-indigo-600">${calculateTotal().toFixed(2)}</span>
            </div>
            <button type="submit" disabled={!formData.poId || myPOs.length === 0} className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 font-medium transition-colors flex items-center shadow-sm">
              <Send className="w-5 h-5 mr-2" />
              Submit Invoice
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}