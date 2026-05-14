import { useContext, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import { Users, FileText, Receipt, CreditCard, UserPlus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function AdminDashboard() {
  const { vendors, pos, invoices, payments } = useContext(AppContext);

  // Compute KPIs
  const totalVendors = vendors.length;
  const activePOs = pos.filter(po => po.status === 'Accepted' || po.status === 'Pending').length;
  const pendingInvoices = invoices.filter(inv => inv.status === 'Submitted').length;
  const paymentsReleased = payments.filter(pay => pay.status === 'Released').reduce((sum, pay) => sum + pay.amount, 0);
  const pendingOnboarding = vendors.filter(v => v.status === 'Pending').length;

  // Chart Data: PO Trend (Mock data for display based on pos length just to make it look active)
  const poTrendData = [
    { name: 'Week 1', pos: 4 },
    { name: 'Week 2', pos: 7 },
    { name: 'Week 3', pos: Math.max(3, pos.length - 2) },
    { name: 'Week 4', pos: pos.length },
  ];

  // Chart Data: Invoice Status
  const invoiceStats = useMemo(() => {
    const approved = invoices.filter(i => i.status === 'Approved').length;
    const pending = invoices.filter(i => i.status === 'Submitted' || i.status === 'Draft').length;
    const rejected = invoices.filter(i => i.status === 'Rejected').length;
    return [
      { name: 'Approved', value: approved, color: '#10b981' },
      { name: 'Pending', value: pending, color: '#f59e0b' },
      { name: 'Rejected', value: rejected, color: '#ef4444' },
    ];
  }, [invoices]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
        {pendingOnboarding > 0 && (
          <div className="flex items-center px-4 py-2 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
            <UserPlus className="w-5 h-5 mr-2" />
            <span className="font-semibold">{pendingOnboarding} Vendors</span>
            <span className="ml-1">awaiting onboarding</span>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Users className="w-8 h-8" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-500">Total Vendors</p>
            <p className="text-2xl font-bold text-slate-900">{totalVendors}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <FileText className="w-8 h-8" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-500">Active POs</p>
            <p className="text-2xl font-bold text-slate-900">{activePOs}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Receipt className="w-8 h-8" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-500">Pending Invoices</p>
            <p className="text-2xl font-bold text-slate-900">{pendingInvoices}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <CreditCard className="w-8 h-8" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-500">Payments Released</p>
            <p className="text-2xl font-bold text-slate-900">${paymentsReleased.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PO Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Purchase Order Trend (Monthly)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={poTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="pos" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Invoice Status Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Invoice Status Breakdown</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={invoiceStats}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {invoiceStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}