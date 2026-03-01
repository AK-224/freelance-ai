import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  MoreHorizontal, 
  Plus, 
  FileText, 
  Download,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '../lib/utils';
import AIEstimator from '../components/AIEstimator';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';

const earningsData = [
  { name: 'Jan', amount: 1200 },
  { name: 'Feb', amount: 1900 },
  { name: 'Mar', amount: 1500 },
  { name: 'Apr', amount: 2200 },
  { name: 'May', amount: 2800 },
  { name: 'Jun', amount: 2400 },
  { name: 'Jul', amount: 3100 },
  { name: 'Aug', amount: 3800 },
  { name: 'Sep', amount: 3200 },
  { name: 'Oct', amount: 4100 },
];

const clientData = [
  { name: 'Client A', value: 35, color: '#00C9A7' },
  { name: 'Client B', value: 25, color: '#1A73E8' },
  { name: 'Client C', value: 20, color: '#8B949E' },
  { name: 'Others', value: 20, color: '#30363D' },
];

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState('October 2023');
  const { invoices, projects, expenses, addInvoice, currency, username, setUsername } = useData();

  const [isEarningsModalOpen, setIsEarningsModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(!username);
  const [tempUsername, setTempUsername] = useState('');

  const [earningsForm, setEarningsForm] = useState({ client: '', project: '', amount: '', date: new Date().toISOString().split('T')[0] });
  const [invoiceForm, setInvoiceForm] = useState({ client: '', project: '', amount: '', date: new Date().toISOString().split('T')[0] });

  const symbol = currency === 'INR' ? '₹' : '$';

  const totalEarnings = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
  const pendingPayments = invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.amount, 0);
  const pendingCount = invoices.filter(i => i.status === 'Pending').length;
  const activeProjectsCount = projects.filter(p => p.status === 'Active').length;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleAddEarnings = (e: React.FormEvent) => {
    e.preventDefault();
    addInvoice({
      client: earningsForm.client,
      project: earningsForm.project,
      amount: parseFloat(earningsForm.amount),
      date: earningsForm.date,
      status: 'Paid'
    });
    setIsEarningsModalOpen(false);
    setEarningsForm({ client: '', project: '', amount: '', date: new Date().toISOString().split('T')[0] });
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    addInvoice({
      client: invoiceForm.client,
      project: invoiceForm.project,
      amount: parseFloat(invoiceForm.amount),
      date: invoiceForm.date,
      status: 'Pending'
    });
    setIsInvoiceModalOpen(false);
    setInvoiceForm({ client: '', project: '', amount: '', date: new Date().toISOString().split('T')[0] });
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUsername.trim()) {
      setUsername(tempUsername.trim());
      setIsUsernameModalOpen(false);
    }
  };

  const recentActivity = [...invoices].reverse().slice(0, 5).map(i => ({
    id: i.id,
    project: i.project,
    date: i.date,
    status: i.status,
    client: i.client,
    amount: `${symbol}${i.amount.toFixed(2)}`
  }));

  const activeProjectsList = projects.filter(p => p.status === 'Active').map((p, i) => ({
    id: p.id,
    name: p.name,
    progress: p.progress,
    color: ['bg-accent-teal', 'bg-accent-blue', 'bg-purple-500'][i % 3]
  }));

  return (
    <div className="space-y-6">
      <Modal isOpen={isUsernameModalOpen} onClose={() => {}} title="Welcome to Freelance AI">
        <form onSubmit={handleUsernameSubmit} className="space-y-4">
          <p className="text-sm text-text-secondary">Please enter your name to personalize your dashboard.</p>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Your Name</label>
            <input 
              required 
              type="text" 
              value={tempUsername} 
              onChange={e => setTempUsername(e.target.value)} 
              className="w-full bg-bg-primary border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal/50" 
              placeholder="e.g. Alex"
            />
          </div>
          <button type="submit" className="w-full py-2 bg-accent-teal text-white rounded-lg font-semibold hover:bg-accent-teal/90 transition-colors mt-4">
            Continue
          </button>
        </form>
      </Modal>

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-text-primary">Welcome back, {username || 'Freelancer'}!</h2>
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-bg-card border border-border-color text-text-primary text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-accent-teal/50 focus:outline-none"
          >
            <option>October 2023</option>
            <option>September 2023</option>
            <option>August 2023</option>
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button onClick={() => setIsEarningsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-bg-card border border-border-color rounded-lg text-sm font-semibold text-text-primary hover:bg-bg-primary transition-colors">
            <Plus className="w-4 h-4" /> Add Earnings
          </button>
          <button onClick={() => setIsInvoiceModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-accent-teal text-white rounded-lg text-sm font-semibold hover:bg-accent-teal/90 transition-colors shadow-sm shadow-accent-teal/20">
            <FileText className="w-4 h-4" /> Create Invoice
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-bg-card border border-border-color rounded-lg text-sm font-semibold text-text-primary hover:bg-bg-primary transition-colors">
            <Download className="w-4 h-4" /> Export Data
          </button>
        </div>
      </div>

      {/* AI Estimator Hero Section */}
      <AIEstimator />

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-bg-card p-5 rounded-xl border border-border-color shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-text-secondary">Total Earnings</p>
            <MoreHorizontal className="w-5 h-5 text-text-secondary" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-text-primary">{symbol}{totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm font-medium text-accent-teal">
            <ArrowUpRight className="w-4 h-4" />
            <span>+12% this month</span>
          </div>
        </div>

        <div className="bg-bg-card p-5 rounded-xl border border-border-color shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-text-secondary">Pending Payments</p>
            <MoreHorizontal className="w-5 h-5 text-text-secondary" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-text-primary">{symbol}{pendingPayments.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          </div>
          <div className="mt-2 text-sm font-medium text-text-secondary">
            {pendingCount} invoices
          </div>
        </div>

        <div className="bg-bg-card p-5 rounded-xl border border-border-color shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-text-secondary">Active Projects</p>
            <MoreHorizontal className="w-5 h-5 text-text-secondary" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-text-primary">{activeProjectsCount}</h3>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm font-medium">
            <span className="px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue text-xs">+2 new</span>
            <span className="text-text-secondary">| {activeProjectsCount} active</span>
          </div>
        </div>

        <div className="bg-bg-card p-5 rounded-xl border border-border-color shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-text-secondary">Expenses</p>
            <MoreHorizontal className="w-5 h-5 text-text-secondary" />
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-text-primary">{symbol}{totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm font-medium text-red-500">
            <ArrowDownRight className="w-4 h-4" />
            <span>-5% this month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Overview Chart */}
        <div className="lg:col-span-2 bg-bg-card p-5 rounded-xl border border-border-color shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-text-primary">Earnings Overview</h3>
            <select className="bg-bg-primary border border-border-color text-text-secondary text-sm rounded-lg px-2 py-1 focus:outline-none">
              <option>2023</option>
              <option>2022</option>
            </select>
          </div>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C9A7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00C9A7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} tickFormatter={(value) => `${symbol}${value}`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                  itemStyle={{ color: 'var(--accent-teal)', fontWeight: 'bold' }}
                  formatter={(value: number) => [`${symbol}${value}`, 'Earnings']}
                />
                <Area type="monotone" dataKey="amount" stroke="#00C9A7" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Income Breakdown */}
        <div className="bg-bg-card p-5 rounded-xl border border-border-color shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-text-primary mb-6">Income Breakdown</h3>
          <div className="flex-1 min-h-[200px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={clientData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {clientData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                  formatter={(value: number) => [`${value}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-2xl font-bold text-text-primary">4</span>
              <span className="text-xs text-text-secondary">Clients</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {clientData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-text-primary">{item.name}</span>
                  <span className="text-xs text-text-secondary">{item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-bg-card rounded-xl border border-border-color shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border-color flex justify-between items-center">
            <h3 className="text-lg font-bold text-text-primary">Recent Activity</h3>
            <button className="text-sm font-medium text-accent-blue hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-primary/50 text-text-secondary text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 font-medium">Project</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {recentActivity.map((item) => (
                  <tr key={item.id} className="hover:bg-bg-primary/30 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-text-primary">{item.project}</td>
                    <td className="px-5 py-4 text-sm text-text-secondary">{item.date}</td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                        item.status === 'Paid' && "bg-emerald-500/10 text-emerald-500",
                        item.status === 'Pending' && "bg-yellow-500/10 text-yellow-500",
                        item.status === 'Overdue' && "bg-red-500/10 text-red-500"
                      )}>
                        {item.status === 'Paid' && <CheckCircle2 className="w-3 h-3" />}
                        {item.status === 'Pending' && <Clock className="w-3 h-3" />}
                        {item.status === 'Overdue' && <AlertCircle className="w-3 h-3" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-text-secondary">{item.client}</td>
                    <td className="px-5 py-4 text-sm font-bold text-text-primary text-right">{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Projects Panel */}
        <div className="bg-bg-card rounded-xl border border-border-color shadow-sm flex flex-col">
          <div className="p-5 border-b border-border-color flex justify-between items-center">
            <h3 className="text-lg font-bold text-text-primary">Active Projects</h3>
            <button className="text-sm font-medium text-accent-blue hover:underline">View All</button>
          </div>
          <div className="p-5 flex flex-col gap-5">
            {activeProjectsList.map((project) => (
              <div key={project.id} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-text-primary">{project.name}</span>
                  <span className="text-xs font-bold text-text-secondary">{project.progress}%</span>
                </div>
                <div className="w-full h-2 bg-bg-primary rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full", project.color)} 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={isEarningsModalOpen} onClose={() => setIsEarningsModalOpen(false)} title="Add Earnings">
        <form onSubmit={handleAddEarnings} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Client</label>
            <input required type="text" value={earningsForm.client} onChange={e => setEarningsForm({...earningsForm, client: e.target.value})} className="w-full bg-bg-primary border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Project</label>
            <input required type="text" value={earningsForm.project} onChange={e => setEarningsForm({...earningsForm, project: e.target.value})} className="w-full bg-bg-primary border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Amount ({symbol})</label>
            <input required type="number" step="0.01" value={earningsForm.amount} onChange={e => setEarningsForm({...earningsForm, amount: e.target.value})} className="w-full bg-bg-primary border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Date</label>
            <input required type="date" value={earningsForm.date} onChange={e => setEarningsForm({...earningsForm, date: e.target.value})} className="w-full bg-bg-primary border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal/50" />
          </div>
          <button type="submit" className="w-full py-2 bg-accent-teal text-white rounded-lg font-semibold hover:bg-accent-teal/90 transition-colors mt-4">
            Save Earnings
          </button>
        </form>
      </Modal>

      <Modal isOpen={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)} title="Create Invoice">
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Client</label>
            <input required type="text" value={invoiceForm.client} onChange={e => setInvoiceForm({...invoiceForm, client: e.target.value})} className="w-full bg-bg-primary border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Project</label>
            <input required type="text" value={invoiceForm.project} onChange={e => setInvoiceForm({...invoiceForm, project: e.target.value})} className="w-full bg-bg-primary border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Amount ({symbol})</label>
            <input required type="number" step="0.01" value={invoiceForm.amount} onChange={e => setInvoiceForm({...invoiceForm, amount: e.target.value})} className="w-full bg-bg-primary border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Date</label>
            <input required type="date" value={invoiceForm.date} onChange={e => setInvoiceForm({...invoiceForm, date: e.target.value})} className="w-full bg-bg-primary border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal/50" />
          </div>
          <button type="submit" className="w-full py-2 bg-accent-teal text-white rounded-lg font-semibold hover:bg-accent-teal/90 transition-colors mt-4">
            Create Invoice
          </button>
        </form>
      </Modal>
    </div>
  );
}
