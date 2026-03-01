import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import { Trash2 } from 'lucide-react';

export default function Clients() {
  const { clients, addClient, deleteClient, currency } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', email: '' });

  const symbol = currency === 'INR' ? '₹' : '$';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClient({
      name: form.name,
      company: form.company,
      email: form.email,
      totalBilled: 0
    });
    setIsModalOpen(false);
    setForm({ name: '', company: '', email: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">Clients</h2>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-accent-teal text-white rounded-lg text-sm font-semibold hover:bg-accent-teal/90 transition-colors">
          Add Client
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(client => (
          <div key={client.id} className="bg-bg-card rounded-xl border border-border-color p-6 shadow-sm flex flex-col relative group">
            <button 
              onClick={() => deleteClient(client.id)} 
              className="absolute top-4 right-4 p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100" 
              title="Delete Client"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-accent-teal/10 text-accent-teal flex items-center justify-center font-bold text-xl">
                {client.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary">{client.name}</h3>
                <p className="text-sm text-text-secondary">{client.company}</p>
              </div>
            </div>
            <div className="space-y-2 mt-auto">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Email</span>
                <span className="text-text-primary font-medium">{client.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Total Billed</span>
                <span className="text-text-primary font-bold">{symbol}{client.totalBilled.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Client">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Name</label>
            <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-bg-primary border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Company</label>
            <input required type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="w-full bg-bg-primary border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
            <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-bg-primary border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-teal/50" />
          </div>
          <button type="submit" className="w-full py-2 bg-accent-teal text-white rounded-lg font-semibold hover:bg-accent-teal/90 transition-colors mt-4">
            Save Client
          </button>
        </form>
      </Modal>
    </div>
  );
}
