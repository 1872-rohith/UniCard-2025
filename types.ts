export type Role = 'student' | 'admin' | 'vendor';

export interface User {
  id: string;
  name: string;
  role: Role;
  balance: number;
  studentId?: string;
  department?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'debit' | 'credit';
  category: 'canteen' | 'library' | 'print' | 'event' | 'topup';
  description: string;
  timestamp: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  description: string;
  fee: number;
  registered: boolean;
  isExternal?: boolean; // If fetched from AI
  sourceUrl?: string; // If fetched from AI
}

export interface SearchResult {
  text: string;
  sources: { uri: string; title: string }[];
}
