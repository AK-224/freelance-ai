import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import { Trash2 } from 'lucide-react';

export default function Projects() {
  const { projects, addProject, deleteProject, currency } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', client: '', amount: '', date: new Date().toISOString().split('T')[0] });

  const symbol = currency === 'INR' ? '₹' : '$';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProject({
      name: form.name,
      client: form.client,
      amount: parseFloat(form.amount),
      date: form.date,
      status: 'Active',
      progress: 0
    });
    setIsModalOpen(false);
    setForm({ name: '', client: '', amount: '', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">Projects</h2>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-accent-teal text-white rounded-lg text-sm font-semibold hover:bg-accent-teal/90 transition-colors">
          New Project
        </button>
      </div>
      
      <div className="bg-bg-card rounded-xl border border-border-color overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-primary/50 text-text-secondary text-xs uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Progress</th>
                <th className="px-5 py-3 font-medium text-right">Amount</th>
                <th className="px-5 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {projects.map((item) => (
                <tr key={item.id} className="hover:bg-bg-primary/30 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-text-primary">{item.name}</td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{item.client}</td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{item.date}</td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{item.status}</td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{item.progress}%</td>
                  <td className="px-5 py-4 text-sm font-bold text-text-primary text-right">{symbol}{item.amount.toFixed(2)}</td>
                  <td className="px-5 py-4 text-center">
                    <button onClick={() => deleteProject(item.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete Project">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Project">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Project Name</label>
            <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-bg-primary border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Client</label>
            <input required type="text" value={form.client} onChange={e => setForm({...form, client: e.target.value})} className="w-full bg-bg-primary border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Amount ({symbol})</label>
            <input required type="number" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full bg-bg-primary border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Date</label>
            <input required type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full bg-bg-primary border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal/50" />
          </div>
          <button type="submit" className="w-full py-2 bg-accent-teal text-white rounded-lg font-semibold hover:bg-accent-teal/90 transition-colors mt-4">
            Create Project
          </button>
        </form>
      </Modal>
    </div>
  );
}
