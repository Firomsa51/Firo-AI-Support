import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, LayoutDashboard, Bot, FileText, BarChart3, LogOut, Menu, ChevronLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '@/components/dashboard/BottomNav';
import DeleteAccountDialog from '@/components/dashboard/DeleteAccountDialog';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Bot, label: 'Chatbots', path: '/dashboard/chatbots' },
  { icon: FileText, label: 'Documents', path: '/dashboard/documents' },
  { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
];

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/dashboard/chatbots': 'Chatbots',
  '/dashboard/documents': 'Documents',
  '/dashboard/analytics': 'Analytics',
};

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleLogout = () => base44.auth.logout('/');
  const isChildRoute = location.pathname !== '/dashboard';
  const pageTitle = pageTitles[location.pathname] || 'Dashboard';

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-border/30">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-primary" />
          </div>
          <span className="font-heading font-bold text-sm">Firo AI Support</span>
        </Link>
      </div>
      <div className="p-3 flex-1">
        <div className="space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  active ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}>
                <item.icon className="w-4 h-4" />{item.label}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="p-3 border-t border-border/30 space-y-1">
        <DeleteAccountDialog />
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 w-full transition-all">
          <LogOut className="w-4 h-4" />Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}>
      <aside className="hidden lg:flex flex-col w-60 border-r border-border/30 bg-card/30 fixed inset-y-0 left-0"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-60 border-r border-border/30 bg-card z-50 flex flex-col lg:hidden"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 lg:ml-60 flex flex-col">
        <div className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-border/30 bg-background/90 backdrop-blur-sm sticky top-0 z-30">
          {isChildRoute ? (
            <button onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-5 h-5" /><span>Back</span>
            </button>
          ) : (
            <button onClick={() => setSidebarOpen(true)} className="text-foreground p-1">
              <Menu className="w-5 h-5" />
            </button>
          )}
          <span className="font-heading font-semibold text-sm absolute left-1/2 -translate-x-1/2">{pageTitle}</span>
          <div className="w-12" />
        </div>
        <div className="flex-1 p-4 pb-24 lg:p-8 lg:pb-8">
          <Outlet />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}