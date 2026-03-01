import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import { cn } from '../lib/utils';
import { CheckCircle2, Clock, AlertCircle, Trash2 } from 'lucide-react';

export default function Invoices() {
  const { invoices, addInvoice, deleteInvoice, currency } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ client: '', project: '', amount: '', date: new Date().toISOString().split('T')[0], status: 'Pending' });

  const symbol = currency === 'INR' ? '₹' : '$';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInvoice({
      client: form.client,
      project: form.project,
      amount: parseFloat(form.amount),
      date: form.date,
      status: form.status
    });
    setIsModalOpen(false);
    setForm({ client: '', project: '', amount: '', date: new Date().toISOString().split('T')[0], status: 'Pending' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">Invoices</h2>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-accent-teal text-white rounded-lg text-sm font-semibold hover:bg-accent-teal/90 transition-colors">
          Create Invoice
        </button>
      </div>
      
      <div className="bg-bg-card rounded-xl border border-border-color overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-primary/50 text-text-secondary text-xs uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">Invoice ID</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Project</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Amount</th>
                <th className="px-5 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {invoices.map((item) => (
                <tr key={item.id} className="hover:bg-bg-primary/30 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-text-primary">INV-{item.id.slice(-4)}</td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{item.client}</td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{item.project}</td>
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
                  <td className="px-5 py-4 text-sm font-bold text-text-primary text-right">{symbol}{item.amount.toFixed(2)}</td>
                  <td className="px-5 py-4 text-center">
                    <button onClick={() => deleteInvoice(item.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete Invoice">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Invoice">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Client</label>
            <input required type="text" value={form.client} onChange={e => setForm({...form, client: e.target.value})} className="w-full bg-bg-primary border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Project</label>
            <input required type="text" value={form.project} onChange={e => setForm({...form, project: e.target.value})} className="w-full bg-bg-primary border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Amount ({symbol})</label>
            <input required type="number" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full bg-bg-primary border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Date</label>
            <input required type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full bg-bg-primary border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full bg-bg-primary border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal/50">
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          <button type="submit" className="w-full py-2 bg-accent-teal text-white rounded-lg font-semibold hover:bg-accent-teal/90 transition-colors mt-4">
            Create Invoice
          </button>
        </form>
      </Modal>
    </div>
  );
}
