import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Bot, FileText, BarChart3 } from 'lucide-react';

const tabs = [
  { icon: LayoutDashboard, label: 'Home', path: '/dashboard' },
  { icon: Bot, label: 'Chatbots', path: '/dashboard/chatbots' },
  { icon: FileText, label: 'Docs', path: '/dashboard/documents' },
  { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
];

export default function BottomNav() {
  const location = useLocation();
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border/40"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-stretch h-14">
        {tabs.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path}
              className={`flex flex-col items-center justify-center flex-1 gap-0.5 transition-all ${active ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-primary/10' : ''}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}