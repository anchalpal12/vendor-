import { useContext, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { FileText, Receipt, Truck, CreditCard, Clock, CheckCircle, PlusCircle, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

export default function VendorDashboard() {
  const { user, pos, invoices, shipments, payments, vendors } = useContext(AppContext);
  const navigate = useNavigate();
  
  const vendorId = user?.vendorId;
  const vendorInfo = vendors.find(v => v.id === vendorId);

  // Filter data for current vendor
  const myPOs = useMemo(() => pos.filter(po => po.vendorId === vendorId), [pos, vendorId]);
  const myInvoices = useMemo(() => invoices.filter(inv => inv.vendorId === vendorId), [invoices, vendorId]);
  const myShipments = useMemo(() => shipments.filter(shp => shp.vendorId === vendorId), [shipments, vendorId]);
  const myPayments = useMemo(() => payments.filter(pay => pay.vendorId === vendorId), [payments, vendorId]);

  // KPIs
  const totalPOs = myPOs.length;
  const pendingInvoices = myInvoices.filter(i => i.status === 'Submitted').length;
  const shipmentsInTransit = myShipments.filter(s => s.status === 'In Transit').length;
  const paymentsDueAmount = myPayments.filter(p => p.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);

  // Mock Activity Feed
  const recentActivities = [
    { id: 1, type: 'po', message: 'New Purchase Order PO-1004 received', time: '2 hours ago', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-100' },
    { id: 2, type: 'payment', message: 'Payment of $500.00 released for INV-2004', time: '1 day ago', icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-100' },
    { id: 3, type: 'invoice', message: 'Invoice INV-2001 approved by Admin', time: '2 days ago', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-100' },
    { id: 4, type: 'shipment', message: 'Shipment TRK123456789 marked as Delivered', time: '4 days ago', icon: Truck, color: 'text-indigo-500', bg: 'bg-indigo-100' },
  ];

  if (!vendorInfo) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header & Welcome */}
      <div className="bg-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">Welcome back, {vendorInfo.companyName}</h2>
          <p className="text-indigo-200">Here is what's happening with your account today.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <button onClick={() => navigate('/vendor/invoices')} className="flex-shrink-0 flex items-center px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium transition-colors">
            <PlusCircle className="w-4 h-4 mr-2" /> Raise Invoice
          </button>
          <button onClick={() => navigate('/vendor/shipments')} className="flex-shrink-0 flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 font-medium transition-colors border border-indigo-400">
            <Truck className="w-4 h-4 mr-2" /> Update Shipment
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/vendor/purchase-orders')}>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><FileText className="w-8 h-8" /></div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-500">Total POs</p>
            <p className="text-2xl font-bold text-slate-900">{totalPOs}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/vendor/invoices')}>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><Receipt className="w-8 h-8" /></div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-500">Pending Invoices</p>
            <p className="text-2xl font-bold text-slate-900">{pendingInvoices}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/vendor/shipments')}>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><Truck className="w-8 h-8" /></div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-500">In Transit</p>
            <p className="text-2xl font-bold text-slate-900">{shipmentsInTransit}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/vendor/payments')}>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><CreditCard className="w-8 h-8" /></div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-500">Payments Due</p>
            <p className="text-2xl font-bold text-slate-900">$\{(paymentsDueAmount || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
          </div>
          <div className="p-6 flex-1">
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivities.map((activity, activityIdx) => {
                  const Icon = activity.icon;
                  return (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {activityIdx !== recentActivities.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={clsx("h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white", activity.bg)}>
                              <Icon className={clsx("w-4 h-4", activity.color)} aria-hidden="true" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-slate-600">{activity.message}</p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-slate-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1"/> {activity.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Links / Important Notice */}
        <div className="space-y-6">
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
             <h3 className="text-lg font-bold text-slate-900 mb-4">Action Center</h3>
             <div className="space-y-3">
               <button onClick={() => navigate('/vendor/purchase-orders')} className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group">
                 <div className="flex items-center text-slate-700 group-hover:text-indigo-700 font-medium">
                   <FileText className="w-5 h-5 mr-3 text-slate-400 group-hover:text-indigo-500" />
                   Review Pending POs
                 </div>
                 <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
               </button>
               <button onClick={() => navigate('/vendor/barcode')} className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group">
                 <div className="flex items-center text-slate-700 group-hover:text-indigo-700 font-medium">
                   <Receipt className="w-5 h-5 mr-3 text-slate-400 group-hover:text-indigo-500" />
                   Generate Barcodes
                 </div>
                 <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
               </button>
             </div>
           </div>

           <div className="bg-indigo-50 rounded-xl shadow-sm border border-indigo-100 p-6">
              <h3 className="text-sm font-bold text-indigo-800 uppercase tracking-wider mb-2">Performance Notice</h3>
              <p className="text-sm text-indigo-700 mb-4">Your On-Time Delivery score is currently 95%. Keep up the good work to maintain your Priority Vendor status.</p>
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline">View Scorecard</button>
           </div>
        </div>
      </div>
    </div>
  );
}