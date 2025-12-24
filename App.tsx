import React, { useState } from 'react';
import Layout from './components/Layout';
import { StudentDashboard } from './components/StudentDashboard';
import { Canteen, Library, Events, Print } from './components/StudentServices';
import { AdminDashboard } from './components/AdminDashboard';
import { VendorDashboard } from './components/VendorDashboard';
import { User, Role, Transaction } from './types';
import { UserCircle } from 'lucide-react';

// Mock initial data
const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Rahul Sharma', role: 'student', balance: 1250.00, studentId: 'CS2024001', department: 'Computer Science' },
  { id: 'a1', name: 'Campus Admin', role: 'admin', balance: 0 },
  { id: 'v1', name: 'Main Canteen POS', role: 'vendor', balance: 0 },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 't1', userId: 'u1', amount: 80, type: 'debit', category: 'canteen', description: 'Canteen: 1x Veg Sandwich', timestamp: Date.now() - 3600000 },
    { id: 't2', userId: 'u1', amount: 500, type: 'credit', category: 'topup', description: 'Wallet Top-up', timestamp: Date.now() - 86400000 },
  ]);

  const handleLogin = (role: Role) => {
    const user = INITIAL_USERS.find(u => u.role === role);
    if (user) {
      setCurrentUser({ ...user }); // Clone to avoid ref issues
      // Set default view based on role
      if (role === 'student') setCurrentView('dashboard');
      if (role === 'admin') setCurrentView('admin-dashboard');
      if (role === 'vendor') setCurrentView('vendor-dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const addTransaction = (amount: number, type: 'credit' | 'debit', category: any, description: string) => {
    if (!currentUser) return;

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      amount,
      type,
      category,
      description,
      timestamp: Date.now(),
    };

    setTransactions(prev => [newTransaction, ...prev]);

    setCurrentUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        balance: type === 'credit' ? prev.balance + amount : prev.balance - amount
      };
    });
  };

  // Vendor processes a payment for a student (simulated)
  const processVendorPayment = (amount: number, studentId: string) => {
    // In a real app, we'd look up the user by ID. Here we assume we are debiting the currently logged in student 'u1' for demo if ID matches or is generic
    // However, if we are logged in as Vendor, we can't easily modify 'u1' state if 'u1' isn't current.
    // To simulate properly in this local-state demo:
    // We will just verify if the amount is valid and return true.
    // In a real backend app, this would update the DB.
    
    // For demo visual feedback:
    if (amount > 0) return true;
    return false;
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-indigo-600 p-12 text-white flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-4">UniCard</h1>
            <p className="text-indigo-100 text-lg leading-relaxed">
              The unified smart ecosystem for your campus life. One card, limitless possibilities.
            </p>
          </div>
          <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Select Role to Login</h2>
            <div className="space-y-4">
              <button onClick={() => handleLogin('student')} className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <UserCircle size={20} />
                </div>
                <div className="ml-4 text-left">
                  <p className="font-bold text-gray-800">Student</p>
                  <p className="text-xs text-gray-500">Access Wallet & Services</p>
                </div>
              </button>
              
              <button onClick={() => handleLogin('admin')} className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <UserCircle size={20} />
                </div>
                <div className="ml-4 text-left">
                  <p className="font-bold text-gray-800">Administrator</p>
                  <p className="text-xs text-gray-500">System Overview</p>
                </div>
              </button>

              <button onClick={() => handleLogin('vendor')} className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <UserCircle size={20} />
                </div>
                <div className="ml-4 text-left">
                  <p className="font-bold text-gray-800">Service Vendor</p>
                  <p className="text-xs text-gray-500">POS Terminal</p>
                </div>
              </button>
            </div>
            <p className="mt-8 text-center text-xs text-gray-400">Demo Environment v1.0</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      user={currentUser} 
      onLogout={handleLogout} 
      currentView={currentView}
      onNavigate={setCurrentView}
    >
      {/* Student Views */}
      {currentUser.role === 'student' && (
        <>
          {currentView === 'dashboard' && <StudentDashboard user={currentUser} transactions={transactions} onTopUp={(amt) => addTransaction(amt, 'credit', 'topup', 'Wallet Top-up')} />}
          {currentView === 'wallet' && <StudentDashboard user={currentUser} transactions={transactions} onTopUp={(amt) => addTransaction(amt, 'credit', 'topup', 'Wallet Top-up')} />} {/* Reusing dashboard for wallet view for simplicity */}
          {currentView === 'canteen' && <Canteen balance={currentUser.balance} onPurchase={(amt, desc) => addTransaction(amt, 'debit', 'canteen', desc)} />}
          {currentView === 'library' && <Library balance={currentUser.balance} onPayFine={(amt) => addTransaction(amt, 'debit', 'library', 'Library Fine Payment')} />}
          {currentView === 'print' && <Print balance={currentUser.balance} onPrint={(amt, pages) => addTransaction(amt, 'debit', 'print', `Cloud Print: ${pages} pages`)} />}
          {currentView === 'events' && <Events balance={currentUser.balance} onRegister={(amt, evt) => addTransaction(amt, 'debit', 'event', evt)} />}
        </>
      )}

      {/* Admin Views */}
      {currentUser.role === 'admin' && (
        <AdminDashboard transactions={transactions} />
      )}

      {/* Vendor Views */}
      {currentUser.role === 'vendor' && (
        <VendorDashboard onProcessPayment={processVendorPayment} />
      )}
    </Layout>
  );
};

export default App;
