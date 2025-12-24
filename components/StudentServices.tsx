import React, { useState, useEffect } from 'react';
import { 
  Coffee, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Book, 
  AlertCircle, 
  Check,
  Search,
  ExternalLink,
  Calendar,
  MapPin,
  Upload,
  FileText,
  Sparkles,
  Printer
} from 'lucide-react';
import { MenuItem, EventItem, SearchResult, Transaction } from '../types';
import { getCampusInsights } from '../services/geminiService';

// --- Canteen Component ---
interface CanteenProps {
  balance: number;
  onPurchase: (amount: number, items: string) => void;
}

export const Canteen: React.FC<CanteenProps> = ({ balance, onPurchase }) => {
  const [cart, setCart] = useState<{item: MenuItem, qty: number}[]>([]);
  
  const menuItems: MenuItem[] = [
    { id: '1', name: 'Veg Sandwich', price: 80, category: 'Snacks', image: 'https://picsum.photos/200/200?random=1' },
    { id: '2', name: 'Chicken Wrap', price: 140, category: 'Main', image: 'https://picsum.photos/200/200?random=2' },
    { id: '3', name: 'Cold Coffee', price: 60, category: 'Beverages', image: 'https://picsum.photos/200/200?random=3' },
    { id: '4', name: 'Masala Dosa', price: 90, category: 'Main', image: 'https://picsum.photos/200/200?random=4' },
    { id: '5', name: 'Fruit Salad', price: 100, category: 'Healthy', image: 'https://picsum.photos/200/200?random=5' },
    { id: '6', name: 'Brownie', price: 70, category: 'Dessert', image: 'https://picsum.photos/200/200?random=6' },
  ];

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { item, qty: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.item.id !== itemId));
  };

  const total = cart.reduce((acc, curr) => acc + (curr.item.price * curr.qty), 0);

  const handleCheckout = () => {
    if (total > balance) {
      alert("Insufficient balance!");
      return;
    }
    const description = `Canteen: ${cart.map(c => `${c.qty}x ${c.item.name}`).join(', ')}`;
    onPurchase(total, description);
    setCart([]);
    alert("Order placed successfully!");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <Coffee className="mr-3 text-indigo-600" /> Campus Canteen
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100 flex flex-col">
              <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-lg mb-4" />
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{item.category}</span>
                </div>
                <span className="font-bold text-indigo-600">₹{item.price}</span>
              </div>
              <button 
                onClick={() => addToCart(item)}
                className="mt-auto w-full py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Plus size={16} /> Add
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-96 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-[calc(100vh-140px)] sticky top-4">
        <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <ShoppingCart size={20} /> Your Tray
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              <p>Your tray is empty</p>
              <p className="text-sm">Add some tasty food!</p>
            </div>
          ) : (
            cart.map(({ item, qty }) => (
              <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">₹{item.price} x {qty}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-700 text-sm">₹{item.price * qty}</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                    <Minus size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Total</span>
            <span className="text-2xl font-bold text-gray-900">₹{total}</span>
          </div>
          <button 
            disabled={cart.length === 0}
            onClick={handleCheckout}
            className={`w-full py-3 rounded-xl font-semibold shadow-md transition-all ${
              cart.length === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg'
            }`}
          >
            Pay & Order
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Library Component ---
export const Library: React.FC<{ balance: number, onPayFine: (amount: number) => void }> = ({ balance, onPayFine }) => {
  const [fines, setFines] = useState([
    { id: '1', book: 'Introduction to Algorithms', daysOverdue: 12, amount: 120 },
    { id: '2', book: 'Clean Code', daysOverdue: 3, amount: 30 },
  ]);

  const totalFines = fines.reduce((acc, curr) => acc + curr.amount, 0);

  const handlePayAll = () => {
    if (balance < totalFines) {
      alert("Insufficient balance for fines.");
      return;
    }
    onPayFine(totalFines);
    setFines([]);
    alert("All fines paid!");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Book className="mr-3 text-indigo-600" /> Library Services
        </h2>
        <div className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
          <span className="text-sm text-indigo-600 font-medium">Status: Active Member</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Currently Borrowed</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-gray-600">
              <Check size={16} className="text-green-500 mt-1" />
              <div>
                <p className="font-medium text-gray-900">React Design Patterns</p>
                <p className="text-xs">Due: 24th Oct 2024</p>
              </div>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-600">
              <Check size={16} className="text-green-500 mt-1" />
              <div>
                <p className="font-medium text-gray-900">System Design Interview</p>
                <p className="text-xs">Due: 28th Oct 2024</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
          <div className="flex justify-between items-start mb-4">
             <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
               <AlertCircle size={20} className="text-red-500" /> Outstanding Fines
             </h3>
             <span className="text-2xl font-bold text-red-600">₹{totalFines}</span>
          </div>
          
          {fines.length > 0 ? (
            <>
              <div className="space-y-3 mb-6">
                {fines.map(fine => (
                  <div key={fine.id} className="flex justify-between items-center text-sm p-2 bg-red-50 rounded">
                    <div>
                      <p className="font-medium text-gray-800">{fine.book}</p>
                      <p className="text-xs text-red-500">{fine.daysOverdue} days overdue</p>
                    </div>
                    <span className="font-semibold text-gray-700">₹{fine.amount}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={handlePayAll}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                Pay Outstanding Fines
              </button>
            </>
          ) : (
             <p className="text-green-600 text-sm flex items-center gap-2">
               <Check size={16} /> No outstanding fines. Good job!
             </p>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Events Component (With Gemini) ---
export const Events: React.FC<{ balance: number, onRegister: (amount: number, eventName: string) => void }> = ({ balance, onRegister }) => {
  const [localEvents, setLocalEvents] = useState<EventItem[]>([
    { id: '1', title: 'Tech Symposium 2024', date: 'Oct 25, 2024', description: 'Annual tech gathering.', fee: 250, registered: false },
    { id: '2', title: 'Campus Music Fest', date: 'Nov 05, 2024', description: 'Live bands and food stalls.', fee: 500, registered: false },
    { id: '3', title: 'AI Workshop', date: 'Oct 30, 2024', description: 'Hands-on session with Gemini.', fee: 0, registered: false },
  ]);

  const [aiEvents, setAiEvents] = useState<SearchResult | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleRegister = (id: string) => {
    const event = localEvents.find(e => e.id === id);
    if (!event) return;
    if (event.registered) return;

    if (event.fee > 0) {
      if (balance < event.fee) {
        alert("Insufficient balance");
        return;
      }
      onRegister(event.fee, `Event: ${event.title}`);
    }
    setLocalEvents(prev => prev.map(e => e.id === id ? { ...e, registered: true } : e));
    alert(`Registered for ${event.title}!`);
  };

  const fetchExternalEvents = async () => {
    setLoadingAi(true);
    const result = await getCampusInsights("What are the major upcoming educational and technology events for university students in India for late 2024? List 3-4 key events with dates.");
    setAiEvents(result);
    setLoadingAi(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Calendar className="mr-3 text-indigo-600" /> Campus Events
        </h2>
        <button 
          onClick={fetchExternalEvents}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-md hover:shadow-lg transition-all text-sm font-medium"
        >
          <Sparkles size={16} className="text-yellow-300" />
          {loadingAi ? 'AI is searching...' : 'Discover External Events via Gemini'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Local Events Column */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-semibold text-gray-700 text-lg mb-4">University Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {localEvents.map(event => (
              <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-2 bg-indigo-500"></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-900 text-lg">{event.title}</h4>
                    {event.fee === 0 ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Free</span>
                    ) : (
                       <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">₹{event.fee}</span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <Calendar size={14} className="mr-2" /> {event.date}
                  </div>
                  <p className="text-gray-600 text-sm mb-5">{event.description}</p>
                  
                  <button 
                    onClick={() => handleRegister(event.id)}
                    disabled={event.registered}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                      event.registered
                        ? 'bg-green-100 text-green-700 cursor-default'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {event.registered ? 'Registered' : 'Register Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI External Events Column */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-xl shadow-lg text-white p-6 h-full min-h-[400px]">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Search size={20} className="text-blue-300" /> 
              External Insights
            </h3>
            <p className="text-blue-200 text-xs mb-6">
              Powered by Google Search Grounding to keep you updated with the wider academic world.
            </p>

            {loadingAi ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-blue-200 text-sm animate-pulse">Scanning the web...</p>
              </div>
            ) : aiEvents ? (
              <div className="space-y-4 animate-fade-in">
                <div className="prose prose-invert prose-sm text-blue-50 max-h-[300px] overflow-y-auto custom-scrollbar">
                   {/* We assume text is simple enough, or we could use a markdown parser. For now simple whitespace handling */}
                   <p className="whitespace-pre-line text-sm leading-relaxed">{aiEvents.text}</p>
                </div>
                
                {aiEvents.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-blue-700/50">
                    <p className="text-xs text-blue-300 font-semibold mb-2">Sources:</p>
                    <ul className="space-y-2">
                      {aiEvents.sources.map((src, idx) => (
                         <li key={idx}>
                           <a href={src.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-blue-200 hover:text-white hover:underline truncate">
                             <ExternalLink size={12} />
                             {src.title}
                           </a>
                         </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center text-blue-300">
                <Sparkles size={32} className="mb-3 opacity-50" />
                <p className="text-sm">Tap the button above to find student hackathons, conferences, and news.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Print Component ---
export const Print: React.FC<{ balance: number, onPrint: (amount: number, pages: number) => void }> = ({ balance, onPrint }) => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState(1);
  const costPerPage = 5;
  const totalCost = pages * costPerPage;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handlePrint = () => {
    if (!file) return;
    if (balance < totalCost) {
      alert("Insufficient balance");
      return;
    }
    onPrint(totalCost, pages);
    alert("Document sent to printer queue!");
    setFile(null);
    setPages(1);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 flex items-center">
        <Printer className="mr-3 text-indigo-600" /> Cloud Print Service
      </h2>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center mb-8 bg-gray-50 hover:bg-gray-100 transition-colors">
          <Upload size={48} className="text-gray-400 mb-4" />
          {file ? (
            <div className="text-center">
              <p className="font-semibold text-gray-800 flex items-center justify-center gap-2">
                <FileText size={18} /> {file.name}
              </p>
              <p className="text-sm text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              <button onClick={() => setFile(null)} className="text-red-500 text-xs mt-2 hover:underline">Remove</button>
            </div>
          ) : (
            <div className="text-center">
              <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                Upload Document
                <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
              </label>
              <p className="text-xs text-gray-400 mt-3">PDF, DOCX up to 10MB</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
            <span className="text-gray-600 font-medium">Number of Pages</span>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setPages(p => Math.max(1, p - 1))}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              >
                <Minus size={14} />
              </button>
              <span className="font-bold w-8 text-center">{pages}</span>
              <button 
                onClick={() => setPages(p => p + 1)}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-lg">
            <span className="text-gray-600">Total Cost ({pages} x ₹{costPerPage})</span>
            <span className="font-bold text-gray-900">₹{totalCost}</span>
          </div>

          <button
            onClick={handlePrint}
            disabled={!file}
            className={`w-full py-3 rounded-xl font-bold text-white shadow-md transition-all ${
              !file 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
            }`}
          >
             Print Document
          </button>
        </div>
      </div>
    </div>
  );
};