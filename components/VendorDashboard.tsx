import React, { useState } from 'react';
import { 
  Wifi, 
  CreditCard, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';

interface VendorDashboardProps {
  onProcessPayment: (amount: number, studentId: string) => boolean;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({ onProcessPayment }) => {
  const [amount, setAmount] = useState('');
  const [studentId, setStudentId] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !studentId) return;

    setStatus('processing');
    
    // Simulate network delay
    setTimeout(() => {
      const success = onProcessPayment(parseFloat(amount), studentId);
      setStatus(success ? 'success' : 'error');
      
      if (success) {
        setTimeout(() => {
          setStatus('idle');
          setAmount('');
          setStudentId('');
        }, 2000);
      } else {
        setTimeout(() => setStatus('idle'), 2000);
      }
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
        <div className="bg-gray-900 p-6 text-white text-center relative">
          <div className="absolute top-6 left-6 flex gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150"></div>
          </div>
          <Wifi className="mx-auto mb-2 opacity-50" />
          <h2 className="text-xl font-mono tracking-widest">POS TERMINAL</h2>
          <p className="text-xs text-gray-400">UniCard Merchant ID: #88392</p>
        </div>

        <div className="p-8">
           {status === 'processing' ? (
             <div className="flex flex-col items-center justify-center h-64 space-y-4">
               <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-gray-500 font-medium animate-pulse">Connecting to Card...</p>
             </div>
           ) : status === 'success' ? (
             <div className="flex flex-col items-center justify-center h-64 space-y-4 animate-in fade-in zoom-in duration-300">
               <CheckCircle size={64} className="text-green-500" />
               <p className="text-xl font-bold text-gray-800">Transaction Approved</p>
               <p className="text-gray-500">Receipt sent to student.</p>
             </div>
           ) : status === 'error' ? (
             <div className="flex flex-col items-center justify-center h-64 space-y-4 animate-in fade-in zoom-in duration-300">
               <XCircle size={64} className="text-red-500" />
               <p className="text-xl font-bold text-gray-800">Transaction Failed</p>
               <p className="text-gray-500">Insufficient funds or invalid ID.</p>
             </div>
           ) : (
             <form onSubmit={handleSubmit} className="space-y-6">
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Sale Amount (INR)</label>
                 <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">₹</span>
                   <input 
                     type="number" 
                     value={amount}
                     onChange={(e) => setAmount(e.target.value)}
                     className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-2xl font-bold text-gray-800 transition-all placeholder-gray-300"
                     placeholder="0.00"
                     required
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Student ID (NFC Tag)</label>
                 <div className="relative">
                   <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                   <input 
                     type="text" 
                     value={studentId}
                     onChange={(e) => setStudentId(e.target.value)}
                     className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-800 transition-all placeholder-gray-300 font-mono"
                     placeholder="Tap Card or Enter ID"
                     required
                   />
                 </div>
               </div>

               <button 
                 type="submit"
                 className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
               >
                 Process Payment
               </button>
             </form>
           )}
        </div>
      </div>
    </div>
  );
};
