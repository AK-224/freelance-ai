import { Bell, Search, Sun, Moon, Menu, DollarSign, IndianRupee } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function Topbar({ toggleTheme, isDarkMode, toggleSidebar }: { toggleTheme: () => void, isDarkMode: boolean, toggleSidebar: () => void }) {
  const location = useLocation();
  const pathName = location.pathname.split('/')[1] || 'Dashboard';
  const title = pathName.charAt(0).toUpperCase() + pathName.slice(1);
  const { currency, setCurrency } = useData();

  return (
    <header className="h-16 bg-bg-sidebar border-b border-border-color flex items-center justify-between px-4 md:px-6 lg:px-8 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 -ml-2 rounded-lg hover:bg-bg-primary text-text-secondary md:hidden">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-text-primary hidden sm:block">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-9 pr-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-teal/50 w-64 text-text-primary placeholder:text-text-secondary"
          />
        </div>
        
        <button 
          onClick={() => setCurrency(currency === 'USD' ? 'INR' : 'USD')} 
          className="p-2 rounded-lg hover:bg-bg-primary text-text-secondary transition-colors flex items-center gap-1" 
          aria-label="Toggle Currency"
        >
          {currency === 'USD' ? <DollarSign className="w-5 h-5" /> : <IndianRupee className="w-5 h-5" />}
        </button>

        <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-bg-primary text-text-secondary transition-colors" aria-label="Toggle Theme">
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        <button className="p-2 rounded-lg hover:bg-bg-primary text-text-secondary relative transition-colors" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-bg-sidebar"></span>
        </button>
      </div>
    </header>
  );
}
