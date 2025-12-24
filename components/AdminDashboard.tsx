import React from 'react';
import { 
  Users, 
  Activity, 
  DollarSign, 
  Server,
  AlertTriangle
} from 'lucide-react';
import { Transaction } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';

interface AdminDashboardProps {
  transactions: Transaction[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ transactions }) => {
  const totalVolume = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const totalUsers = 1245; // Mock
  const activeToday = 843; // Mock

  // Prepare data for chart (simulate daily volume)
  const chartData = [
    { day: 'Mon', volume: 4000 },
    { day: 'Tue', volume: 3000 },
    { day: 'Wed', volume: 2000 },
    { day: 'Thu', volume: 2780 },
    { day: 'Fri', volume: 1890 },
    { day: 'Sat', volume: 2390 },
    { day: 'Sun', volume: 3490 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">System Overview</h1>
           <p className="text-gray-500">Real-time campus ecosystem metrics</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-100">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          System Operational
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Volume', value: `₹${totalVolume.toLocaleString()}`, icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Today', value: activeToday, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Server Load', value: '12%', icon: Server, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
              <stat.icon size={24} className={stat.color} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6">Transaction Volume (Last 7 Days)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Area type="monotone" dataKey="volume" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center justify-between">
            <span>System Alerts</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Last 24h</span>
          </h3>
          <div className="space-y-4">
             {[
               { msg: 'High load on Library server', time: '10:42 AM', type: 'warning' },
               { msg: 'Vendor V-04 POS offline', time: '09:15 AM', type: 'error' },
               { msg: 'New vendor registration pending', time: 'Yesterday', type: 'info' },
             ].map((alert, idx) => (
               <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                 <AlertTriangle size={18} className={`${
                   alert.type === 'error' ? 'text-red-500' : alert.type === 'warning' ? 'text-orange-500' : 'text-blue-500'
                 } mt-0.5`} />
                 <div className="flex-1">
                   <p className="text-sm font-medium text-gray-800">{alert.msg}</p>
                   <p className="text-xs text-gray-500">{alert.time}</p>
                 </div>
               </div>
             ))}
             
             <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100 text-indigo-800 text-sm">
               <p className="font-medium">Admin Note:</p>
               <p className="mt-1 opacity-80">Upcoming system maintenance scheduled for Sunday 2:00 AM - 4:00 AM.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
