'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  CreditCard,
  Trophy,
  Gavel,
  BarChart,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const role = session?.user?.role || '';
  const isAdmin = typeof role === 'string' && /admin/i.test(role);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Registrations & Payments', href: '/admin/registrations', icon: CreditCard },
    { name: 'Tournaments', href: '/admin/tournaments', icon: Trophy },
    { name: 'Referees', href: '/admin/referees', icon: Gavel },
    { name: 'Reports', href: '/admin/reports', icon: BarChart },
  ];

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold text-light-text-main dark:text-dark-text-main">Admin Panel</h1>
        <button className="lg:hidden text-light-text-muted dark:text-dark-text-muted" onClick={() => setOpen(false)} aria-label="Close menu">
          <X className="h-6 w-6" />
        </button>
      </div>
      <nav className="mt-4 space-y-1 flex-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center px-6 py-3 text-light-text-main dark:text-dark-text-main hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300 transition-colors"
            >
              <Icon className="h-5 w-5 mr-3 flex-shrink-0 text-light-text-muted dark:text-dark-text-muted" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <Link href="/api/auth/signout" className="flex items-center text-light-text-main dark:text-dark-text-main hover:text-red-600 transition-colors w-full">
          <LogOut className="h-5 w-5 mr-3 text-light-text-muted dark:text-dark-text-muted" />
          <span className="font-medium">Sign Out</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 bg-light-card dark:bg-dark-card shadow-lg flex-shrink-0">{SidebarContent}</aside>

      {/* Mobile drawer + overlay */}
      {open && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setOpen(false)} />}
      <aside
        className={`fixed inset-y-0 left-0 w-72 max-w-[80%] bg-light-card dark:bg-dark-card shadow-xl z-50 lg:hidden transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {SidebarContent}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-light-card dark:bg-dark-card shadow-sm flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0">
          <div className="flex items-center gap-3 min-w-0">
            <button className="lg:hidden text-light-text-main dark:text-dark-text-main flex-shrink-0" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </button>
            <div className="text-base sm:text-xl font-semibold text-light-text-main dark:text-dark-text-main truncate">
              Arm Wrestling Management
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link href="/live" className="px-3 py-1.5 rounded-full font-bold text-sm border border-red-500/60 text-red-500 hover:bg-red-500/10 transition-all">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block mr-2" />
                Watch Live
              </Link>
            )}

            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light-bg dark:bg-dark-bg p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
