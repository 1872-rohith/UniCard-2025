import React from 'react';
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History,
  TrendingDown,
  TrendingUp,
  Clock
} from 'lucide-react';
import { User, Transaction } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface StudentDashboardProps {
  user: User;
  transactions: Transaction[];
  onTopUp: (amount: number) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, transactions, onTopUp }) => {
  const recentTransactions = transactions.slice(0, 5);
  
  // Calculate spending by category for chart
  const spendingData = [
    { name: 'Canteen', amount: transactions.filter(t => t.category === 'canteen').reduce((a, b) => a + b.amount, 0) },
    { name: 'Print', amount: transactions.filter(t => t.category === 'print').reduce((a, b) => a + b.amount, 0) },
    { name: 'Library', amount: transactions.filter(t => t.category === 'library').reduce((a, b) => a + b.amount, 0) },
    { name: 'Events', amount: transactions.filter(t => t.category === 'event').reduce((a, b) => a + b.amount, 0) },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome & Wallet Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Digital Wallet Card */}
        <div className="md:col-span-1">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400 opacity-20 rounded-full -ml-12 -mb-12 blur-xl"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                   <p className="text-indigo-200 text-sm font-medium mb-1">Total Balance</p>
                   <h2 className="text-4xl font-bold tracking-tight">₹{user.balance.toFixed(2)}</h2>
                </div>
                <CreditCard className="text-indigo-200 opacity-80" size={32} />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-xs text-indigo-200 uppercase tracking-wider">
                  <span>Card Holder</span>
                  <span>Student ID</span>
                </div>
                <div className="flex justify-between font-medium tracking-wide">
                  <span>{user.name}</span>
                  <span>{user.studentId}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onTopUp(500)}
              className="mt-8 w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ArrowUpRight size={18} /> Quick Top-up ₹500
            </button>
          </div>
        </div>

        {/* Quick Stats & Actions */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
             <div>
               <p className="text-gray-500 font-medium mb-2">Monthly Spending</p>
               <h3 className="text-3xl font-bold text-gray-800">
                 ₹{transactions.filter(t => t.type === 'debit' && t.timestamp > Date.now() - 30*24*60*60*1000).reduce((acc, curr) => acc + curr.amount, 0)}
               </h3>
               <div className="flex items-center text-green-500 text-sm mt-2">
                 <TrendingDown size={16} className="mr-1" />
                 <span>12% less than last month</span>
               </div>
             </div>
             <div className="h-24 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={spendingData}>
                    <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
           </div>

           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
             <div className="space-y-4">
               {recentTransactions.length > 0 ? recentTransactions.map(t => (
                 <div key={t.id} className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                       t.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                     }`}>
                       {t.type === 'credit' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                     </div>
                     <div>
                       <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">{t.description}</p>
                       <p className="text-xs text-gray-500">{new Date(t.timestamp).toLocaleDateString()}</p>
                     </div>
                   </div>
                   <span className={`font-semibold text-sm ${t.type === 'credit' ? 'text-green-600' : 'text-gray-900'}`}>
                     {t.type === 'credit' ? '+' : '-'}₹{t.amount}
                   </span>
                 </div>
               )) : <p className="text-gray-400 text-sm">No recent transactions</p>}
             </div>
             <button className="w-full mt-4 text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center justify-center gap-1">
               View All History <History size={14} />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};
