import { useContext, useState, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import { Search, Filter, Edit2, Shield, AlertCircle, FileText, Check } from 'lucide-react';
import clsx from 'clsx';

export default function VendorManagement() {
  const { vendors, setVendors } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Edit modal state
  const [editingVendor, setEditingVendor] = useState(null);

  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      const matchesSearch = v.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            v.contactName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' ? true : v.status === statusFilter;
      // Hide pending vendors from this view, they should be in Onboarding
      return matchesSearch && matchesStatus && v.status !== 'Pending';
    });
  }, [vendors, searchTerm, statusFilter]);

  const handleStatusChange = (id, newStatus) => {
    setVendors(vendors.map(v => v.id === id ? { ...v, status: newStatus } : v));
  };

  const handleSaveVendor = (e) => {
    e.preventDefault();
    setVendors(vendors.map(v => v.id === editingVendor.id ? editingVendor : v));
    setEditingVendor(null);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Inactive': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'Blacklisted': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Vendor Directory</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm w-full sm:w-64"
            />
          </div>
          
          {/* Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-slate-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm appearance-none bg-white w-full sm:w-auto"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Blacklisted">Blacklisted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Company Info</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{vendor.companyName}</div>
                    <div className="text-sm text-slate-500">ID: {vendor.id} | {vendor.industry}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{vendor.contactName}</div>
                    <div className="text-sm text-slate-500">{vendor.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-slate-900 mr-1">{vendor.rating.toFixed(1)}</span>
                      <span className="text-amber-400 text-sm">★</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={vendor.status}
                      onChange={(e) => handleStatusChange(vendor.id, e.target.value)}
                      className={clsx(
                        "text-xs font-semibold rounded-full px-2.5 py-1 focus:outline-none border",
                        getStatusColor(vendor.status)
                      )}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Blacklisted">Blacklisted</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingVendor({ ...vendor })}
                      className="text-slate-400 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-colors inline-flex items-center"
                      title="Edit Vendor"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingVendor && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl p-6">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Edit Vendor Profile</h3>
             </div>
             
             <form onSubmit={handleSaveVendor} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                    <input type="text" value={editingVendor.companyName} onChange={e => setEditingVendor({...editingVendor, companyName: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                    <input type="text" value={editingVendor.industry} onChange={e => setEditingVendor({...editingVendor, industry: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Contact Name</label>
                    <input type="text" value={editingVendor.contactName} onChange={e => setEditingVendor({...editingVendor, contactName: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input type="email" value={editingVendor.email} onChange={e => setEditingVendor({...editingVendor, email: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                    <input type="text" value={editingVendor.address} onChange={e => setEditingVendor({...editingVendor, address: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border" required />
                  </div>
                </div>

                {/* Mock Document Management */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Document Management</h4>
                  <div className="space-y-2">
                    {['GST_Certificate.pdf', 'PAN_Card.pdf', 'Bank_Statement.pdf'].map(doc => (
                      <div key={doc} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-indigo-500 mr-2" />
                          <span className="text-sm font-medium text-slate-700">{doc}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button type="button" className="text-xs text-indigo-600 font-medium hover:underline">Replace</button>
                          <button type="button" className="text-xs text-red-600 font-medium hover:underline">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                  <button type="button" onClick={() => setEditingVendor(null)} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-md font-medium transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors shadow-sm flex items-center">
                    <Check className="w-5 h-5 mr-2" />
                    Save Changes
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}