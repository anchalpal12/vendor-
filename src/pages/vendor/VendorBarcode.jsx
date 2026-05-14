import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Printer, Download, Package } from 'lucide-react';
import Barcode from 'react-barcode';

export default function VendorBarcode() {
  const { user, products } = useContext(AppContext);
  const vendorId = user?.vendorId;
  const myProducts = products.filter(p => p.vendorId === vendorId);

  const printBarcode = (sku) => {
    // In a real app, this would trigger a print dialog specifically for the barcode
    alert(`Printing barcode for SKU: ${sku}`);
  };

  const downloadBarcode = (sku) => {
    // In a real app, this would download the barcode as an image
    alert(`Downloading barcode for SKU: ${sku}`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Product Barcodes</h2>
          <p className="text-slate-500 mt-1">Manage and print barcodes for your registered products.</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm w-fit"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print All
        </button>
      </div>

      {myProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center flex flex-col items-center">
          <Package className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-1">No Products Found</h3>
          <p className="text-slate-500">You don't have any products registered. Contact admin to add products.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {myProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col group">
              <div className="p-4 border-b border-slate-100 flex-1">
                <h3 className="font-bold text-slate-900 truncate" title={product.name}>{product.name}</h3>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{product.sku}</p>
                <div className="mt-6 flex justify-center bg-white p-3 rounded-lg border border-slate-200">
                  {product.sku ? (
                    <Barcode value={product.sku} width={1.5} height={60} fontSize={14} margin={0} background="#ffffff" />
                  ) : (
                    <div className="h-[60px] flex items-center justify-center text-slate-400 text-sm">No SKU available</div>
                  )}
                </div>
              </div>
              <div className="bg-slate-50 p-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-medium text-slate-500">{product.category}</span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => downloadBarcode(product.sku)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                    title="Download Barcode"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => printBarcode(product.sku)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                    title="Print Barcode"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}