import { useContext, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Star, StarHalf, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import clsx from 'clsx';

export default function VendorPerformance() {
  const { vendors } = useContext(AppContext);

  // Get active vendors and sort by rating for top 5
  const activeVendors = vendors.filter(v => v.status === 'Active' || v.status === 'Inactive'); // Including inactive to see why they might be inactive
  const topVendors = useMemo(() => {
    return [...activeVendors].sort((a, b) => b.rating - a.rating).slice(0, 5);
  }, [activeVendors]);

  // Chart Data Preparation
  const chartData = topVendors.map(v => ({
    name: v.companyName.split(' ')[0], // Short name for axis
    OnTimeDelivery: v.onTimeDelivery,
    InvoiceAccuracy: v.invoiceAccuracy,
  }));

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarHalf key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-slate-300" />);
      }
    }
    return <div className="flex space-x-0.5">{stars}</div>;
  };

  const getTrendIcon = (value, threshold) => {
    if (value >= threshold + 5) return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    if (value <= threshold - 5) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Vendor Performance Dashboard</h2>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Top 5 Vendors Comparison</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} domain={[0, 100]} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`${value}%`, undefined]}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
              <Bar dataKey="OnTimeDelivery" name="On-Time Delivery %" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
              <Bar dataKey="InvoiceAccuracy" name="Invoice Accuracy %" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Vendor KPI Scorecards</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Vendor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Overall Rating</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">On-Time Delivery</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Invoice Accuracy</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Avg Response Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {activeVendors.length === 0 ? (
                 <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No active vendors to evaluate.</td></tr>
              ) : (
                activeVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{vendor.companyName}</div>
                      <div className="text-sm text-slate-500">{vendor.industry}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-slate-900">{vendor.rating.toFixed(1)}</span>
                        {renderStars(vendor.rating)}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="flex flex-col">
                           <span className="text-lg font-bold text-slate-900">{vendor.onTimeDelivery}%</span>
                           <span className="text-xs text-slate-500">Target: 95%</span>
                        </div>
                        {getTrendIcon(vendor.onTimeDelivery, 95)}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="flex flex-col">
                           <span className="text-lg font-bold text-slate-900">{vendor.invoiceAccuracy}%</span>
                           <span className="text-xs text-slate-500">Target: 98%</span>
                        </div>
                        {getTrendIcon(vendor.invoiceAccuracy, 98)}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-col">
                         <span className={clsx("text-lg font-bold", vendor.responseTime <= 2 ? "text-emerald-600" : vendor.responseTime <= 24 ? "text-slate-900" : "text-red-600")}>
                           {vendor.responseTime} hrs
                         </span>
                         <span className="text-xs text-slate-500">Target: &lt; 24 hrs</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}