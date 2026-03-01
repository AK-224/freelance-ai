import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  Folder, 
  Receipt, 
  CreditCard, 
  Users, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useData } from '../context/DataContext';

const navItems = [
  { name: 'Dashboard', icon: LayoutGrid, path: '/' },
  { name: 'Projects', icon: Folder, path: '/projects' },
  { name: 'Invoices', icon: Receipt, path: '/invoices' },
  { name: 'Expenses', icon: CreditCard, path: '/expenses' },
  { name: 'Clients', icon: Users, path: '/clients' },
  { name: 'Reports', icon: BarChart3, path: '/reports' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) {
  const location = useLocation();
  const { username } = useData();

  const getInitials = (name: string) => {
    if (!name) return 'F';
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <aside 
      className={cn(
        "bg-bg-sidebar border-r border-border-color flex flex-col transition-all duration-300 z-20",
        isOpen ? "w-64" : "w-16 hidden md:flex"
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-border-color">
        {isOpen && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-accent-teal flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="font-bold text-lg tracking-tight whitespace-nowrap text-text-primary">FREELANCE AI</span>
          </div>
        )}
        {!isOpen && (
           <div className="w-8 h-8 rounded-lg bg-accent-teal flex items-center justify-center shrink-0 mx-auto">
             <span className="text-white font-bold text-lg">F</span>
           </div>
        )}
      </div>

      <div className="flex-1 py-6 flex flex-col gap-1 px-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                isActive 
                  ? "bg-accent-teal/10 text-accent-teal font-semibold" 
                  : "text-text-secondary hover:bg-bg-primary hover:text-text-primary"
              )}
              title={!isOpen ? item.name : undefined}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-accent-teal" : "text-text-secondary group-hover:text-text-primary")} />
              {isOpen && <span className="whitespace-nowrap">{item.name}</span>}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border-color">
        <div className={cn("flex items-center gap-3", !isOpen && "justify-center")}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-teal to-accent-blue shrink-0 flex items-center justify-center text-white font-bold">
            {getInitials(username)}
          </div>
          {isOpen && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-text-primary truncate">{username || 'Freelancer'}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
