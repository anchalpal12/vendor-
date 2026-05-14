import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Truck, CheckCircle, Clock, Plus, Send } from 'lucide-react';
import clsx from 'clsx';

export default function Shipments() {
  const { user, pos, shipments, setShipments } = useContext(AppContext);
  const vendorId = user?.vendorId;
  const myShipments = shipments.filter(s => s.vendorId === vendorId);
  const myPOs = pos.filter(po => po.vendorId === vendorId && po.status === 'Accepted'); // Can only ship accepted POs

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    poId: '',
    trackingNumber: '',
    courier: '',
    dispatchDate: '',
    eta: ''
  });

  const handleMarkDelivered = (id) => {
    setShipments(shipments.map(s => s.id === id ? { ...s, status: 'Delivered' } : s));
  };

  const handleCreateShipment = (e) => {
    e.preventDefault();
    const newId = `SHP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newShipment = {
      id: newId,
      vendorId,
      status: 'In Transit',
      ...formData
    };
    setShipments([newShipment, ...shipments]);
    setIsModalOpen(false);
    setFormData({ poId: '', trackingNumber: '', courier: '', dispatchDate: '', eta: '' });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Shipment Handling</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Shipment
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tracking / ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Linked PO</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Courier</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Timeline</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {myShipments.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">No shipments found.</td></tr>
              ) : (
                myShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-indigo-600">{shipment.trackingNumber}</div>
                      <div className="text-xs text-slate-500">ID: {shipment.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{shipment.poId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{shipment.courier}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600"><span className="text-slate-400">Sent:</span> {shipment.dispatchDate}</div>
                      <div className="text-sm font-medium text-slate-900"><span className="text-slate-400 font-normal">ETA:</span> {shipment.eta}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {shipment.status === 'In Transit' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          <Truck className="w-3 h-3 mr-1" /> In Transit
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle className="w-3 h-3 mr-1" /> Delivered
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {shipment.status === 'In Transit' ? (
                         <button 
                           onClick={() => handleMarkDelivered(shipment.id)}
                           className="text-xs font-medium px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md transition-colors border border-emerald-200"
                         >
                           Mark Delivered
                         </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Completed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Shipment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Create Shipment</h3>
            </div>
            <form onSubmit={handleCreateShipment} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Select Purchase Order *</label>
                  <select 
                    value={formData.poId} 
                    onChange={e => setFormData({...formData, poId: e.target.value})} 
                    className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border bg-white" required
                  >
                    <option value="">-- Choose PO --</option>
                    {myPOs.map(po => <option key={po.id} value={po.id}>{po.id}</option>)}
                  </select>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Tracking Number *</label>
                   <input type="text" value={formData.trackingNumber} onChange={e => setFormData({...formData, trackingNumber: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border uppercase" required placeholder="TRK..." />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Courier *</label>
                   <input type="text" value={formData.courier} onChange={e => setFormData({...formData, courier: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border" required placeholder="FedEx, DHL..." />
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Dispatch Date *</label>
                   <input type="date" value={formData.dispatchDate} onChange={e => setFormData({...formData, dispatchDate: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border" required />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">ETA *</label>
                   <input type="date" value={formData.eta} onChange={e => setFormData({...formData, eta: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border" required />
                 </div>
               </div>

               <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100 mt-6">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium rounded-lg border border-slate-200">Cancel</button>
                 <button type="submit" disabled={!formData.poId} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center disabled:bg-indigo-300">
                   <Send className="w-4 h-4 mr-2" /> Submit Shipment
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}