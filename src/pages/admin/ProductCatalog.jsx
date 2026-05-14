import { useContext, useState, useMemo, useRef } from 'react';
import { AppContext } from '../../context/AppContext';
import { Search, Filter, Plus, Edit2, Printer, X, Check } from 'lucide-react';
import Barcode from 'react-barcode';

export default function ProductCatalog() {
  const { products, setProducts, vendors } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '', sku: '', category: '', price: '', description: '', vendorId: ''
  });

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' ? true : p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({ name: '', sku: '', category: '', price: '', description: '', vendorId: vendors[0]?.id || '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...formData, id: editingProduct.id, price: parseFloat(formData.price) } : p));
    } else {
      const newId = `P${String(products.length + 1).padStart(3, '0')}`;
      setProducts([...products, { ...formData, id: newId, price: parseFloat(formData.price) }]);
    }
    setIsModalOpen(false);
  };

  const printBarcode = (sku) => {
    // In a real app, this would open a print window for the specific barcode
    alert(`Printing barcode for SKU: ${sku}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Product Catalog & Barcodes</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search products or SKU..."
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
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm appearance-none bg-white w-full sm:w-auto"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:gap-6 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
                  <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md mt-1 font-medium border border-slate-200">
                    {product.category}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-indigo-600">$\{(product.price || 0).toFixed(2)}</span>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-3 line-clamp-2">{product.description}</p>
              
              <div className="mt-6 flex justify-center bg-white p-2 rounded border border-slate-100">
                {/* Ensure Barcode receives a string and handles potential errors gently */}
                {product.sku ? (
                  <Barcode value={product.sku} width={1.5} height={50} fontSize={12} margin={0} background="#ffffff" />
                ) : (
                  <div className="h-[50px] flex items-center justify-center text-slate-400 text-sm">No SKU available</div>
                )}
              </div>
            </div>
            
            <div className="bg-slate-50 border-t border-slate-200 p-3 flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">Vendor ID: {product.vendorId}</span>
              <div className="flex space-x-2">
                <button 
                  onClick={() => printBarcode(product.sku)}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                  title="Print Barcode"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleOpenModal(product)}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                  title="Edit Product"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-slate-200 border-dashed">
            <p className="text-slate-500">No products found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl p-6">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-500"><X className="w-5 h-5"/></button>
             </div>
             
             <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">SKU (For Barcode)</label>
                    <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border uppercase" required placeholder="e.g. WID-123" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
                    <input type="number" step="0.01" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border" required list="categories-list" />
                    <datalist id="categories-list">
                      {categories.filter(c => c !== 'All').map(c => <option key={c} value={c} />)}
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Vendor</label>
                    <select value={formData.vendorId} onChange={e => setFormData({...formData, vendorId: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border bg-white" required>
                      {vendors.map(v => <option key={v.id} value={v.id}>{v.companyName} ({v.id})</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border" rows="3" required />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-md font-medium transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors shadow-sm flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    Save Product
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}