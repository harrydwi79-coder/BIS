/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  Users, 
  LogOut, 
  Menu, 
  X,
  Search
} from 'lucide-react';
import { Button } from './ui/button';
import { UserProfile } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfile | null;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Layout({ children, user, onLogout, activeTab, setActiveTab }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'ATASAN', 'PEGAWAI'] },
    { id: 'buat', label: 'Buat Surat', icon: FileText, roles: ['ADMIN', 'ATASAN'] },
    { id: 'histori', label: 'Histori', icon: History, roles: ['ADMIN', 'ATASAN', 'PEGAWAI'] },
    { id: 'pegawai', label: 'Data Pegawai', icon: Users, roles: ['ADMIN'] },
  ];

  const filteredNavItems = navItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-60 bg-primary text-white flex-col sticky top-0 h-screen shadow-lg">
        <div className="p-6 pb-8">
          <div className="flex items-center gap-2 font-extrabold text-xl tracking-tighter uppercase">
            <FileText className="w-8 h-8 text-success" />
            <span>PTBSM</span>
          </div>
        </div>

        <nav className="flex-1 space-y-0">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 text-sm transition-all border-l-4 ${
                activeTab === item.id 
                  ? 'bg-white/10 border-success opacity-100 font-semibold' 
                  : 'border-transparent opacity-70 hover:opacity-100 hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-slate-400/30 flex items-center justify-center font-bold">
              {user?.displayName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.displayName}</p>
              <p className="text-[10px] opacity-60 uppercase tracking-wider">{user?.role}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10 p-0 h-auto"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mr-3" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-border p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-lg text-primary">
          <FileText className="w-6 h-6 text-success" />
          <span>PTBSM</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden fixed inset-0 top-[65px] bg-primary text-white z-40 p-0 flex flex-col"
        >
          <nav className="flex-1">
            {filteredNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-6 py-5 border-l-4 transition-all ${
                  activeTab === item.id 
                    ? 'bg-white/10 border-success font-semibold' 
                    : 'border-transparent opacity-70'
                }`}
              >
                <item.icon className="w-6 h-6" />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="p-6 border-t border-white/10">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white/70 py-6 h-auto"
              onClick={onLogout}
            >
              <LogOut className="w-6 h-6 mr-3" />
              Keluar
            </Button>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden md:flex h-[72px] bg-surface border-b border-border items-center justify-between px-8 sticky top-0 z-30">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Cari nomor surat atau nama pegawai..." 
              className="w-full bg-slate-100 border border-border rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-text-main">{user?.displayName}</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium">{user?.position}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
              {user?.displayName?.charAt(0)}
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );

}
