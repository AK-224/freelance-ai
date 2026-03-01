import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Project = { id: string; name: string; client: string; date: string; status: string; progress: number; amount: number };
export type Invoice = { id: string; client: string; date: string; amount: number; status: string; project: string };
export type Expense = { id: string; category: string; amount: number; date: string; description: string };
export type Client = { id: string; name: string; company: string; email: string; totalBilled: number };

interface DataContextType {
  projects: Project[];
  invoices: Invoice[];
  expenses: Expense[];
  clients: Client[];
  addProject: (project: Omit<Project, 'id'>) => void;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addClient: (client: Omit<Client, 'id'>) => void;
  deleteProject: (id: string) => void;
  deleteInvoice: (id: string) => void;
  deleteExpense: (id: string) => void;
  deleteClient: (id: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  username: string;
  setUsername: (username: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState('USD');
  const [username, setUsername] = useState(() => localStorage.getItem('freelance_username') || '');
  
  useEffect(() => {
    if (username) {
      localStorage.setItem('freelance_username', username);
    }
  }, [username]);

  const [projects, setProjects] = useState<Project[]>([
    { id: '1', name: 'UI Design', client: 'Acme Corp', date: 'Oct 26', status: 'Active', progress: 75, amount: 1200 },
    { id: '2', name: 'Mobile App', client: 'Stark Ind.', date: 'Oct 24', status: 'Active', progress: 60, amount: 3500 },
    { id: '3', name: 'Brand Identity', client: 'Globex', date: 'Oct 21', status: 'Active', progress: 30, amount: 2000 },
    { id: '4', name: 'Video Editing', client: 'Initech', date: 'Oct 18', status: 'Active', progress: 90, amount: 800 },
  ]);
  
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: '1', client: 'Acme Corp', date: 'Oct 26', amount: 1200, status: 'Paid', project: 'Web Redesign' },
    { id: '2', client: 'Stark Ind.', date: 'Oct 24', amount: 850, status: 'Pending', project: 'Promo Video Edit' },
    { id: '3', client: 'Globex', date: 'Oct 21', amount: 450, status: 'Paid', project: 'Social Media Assets' },
    { id: '4', client: 'Initech', date: 'Oct 18', amount: 320, status: 'Overdue', project: 'Podcast Audio Mix' },
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', category: 'Software', amount: 50, date: 'Oct 01', description: 'Adobe CC' },
    { id: '2', category: 'Hardware', amount: 930.50, date: 'Oct 15', description: 'New Monitor' },
  ]);

  const [clients, setClients] = useState<Client[]>([
    { id: '1', name: 'John Doe', company: 'Acme Corp', email: 'john@acme.com', totalBilled: 1200 },
    { id: '2', name: 'Tony Stark', company: 'Stark Ind.', email: 'tony@stark.com', totalBilled: 850 },
  ]);

  const addProject = (project: Omit<Project, 'id'>) => {
    setProjects([...projects, { ...project, id: Date.now().toString() }]);
  };

  const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
    setInvoices([...invoices, { ...invoice, id: Date.now().toString() }]);
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setExpenses([...expenses, { ...expense, id: Date.now().toString() }]);
  };

  const addClient = (client: Omit<Client, 'id'>) => {
    setClients([...clients, { ...client, id: Date.now().toString() }]);
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const deleteInvoice = (id: string) => {
    setInvoices(invoices.filter(i => i.id !== id));
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const deleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
  };

  return (
    <DataContext.Provider value={{ 
      projects, invoices, expenses, clients, 
      addProject, addInvoice, addExpense, addClient,
      deleteProject, deleteInvoice, deleteExpense, deleteClient,
      currency, setCurrency,
      username, setUsername
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
