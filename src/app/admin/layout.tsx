'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  FileText,
  LayoutTemplate,
  Layers,
  Sparkles,
  Wrench,
  Search,
  Activity,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Shield,
  Edit3
} from 'lucide-react';
import { COMPANY_INFO } from '@/data/company';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Pages & CMS', href: '/admin/pages', icon: LayoutTemplate },
    { name: 'Inquiries & CRM', href: '/admin/inquiries', icon: Inbox },
    { name: 'Machineries', href: '/admin/machineries', icon: Layers },
    { name: 'Granules', href: '/admin/granules', icon: Sparkles },
    { name: 'Services', href: '/admin/services', icon: Wrench },
    { name: 'Blogs & Articles', href: '/admin/blogs', icon: FileText },
    { name: 'SEO Engine', href: '/admin/seo', icon: Search },
    { name: 'Database Health', href: '/admin/db-health', icon: Activity },
    { name: 'Settings & Integrations', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-navy-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2">
          {/* Logo with transparent background & white filter */}
          <div className="relative h-8 w-32">
            <Image
              src="/images/logo.png"
              alt="ABS Polymers"
              fill
              className="object-contain object-left brightness-0 invert"
            />
          </div>
          <span className="text-[10px] font-bold text-brand-orange uppercase px-2 py-0.5 bg-brand-orange/15 rounded">
            Admin
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800"
          aria-label="Toggle navigation"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Left Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-navy-950 text-slate-300 flex flex-col justify-between border-r border-slate-800 transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo container with transparent background */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="relative h-10 w-44">
                <Image
                  src="/images/logo.png"
                  alt="ABS Polymers"
                  fill
                  priority
                  className="object-contain object-left brightness-0 invert"
                />
              </div>
            </Link>
          </div>

          {/* Environmental / State Banner in Sidebar */}
          <div className="px-4 py-2 bg-navy-900 border-b border-slate-800 flex items-center justify-between text-[11px]">
            <span className="flex items-center text-amber-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400 mr-1.5 animate-pulse"></span>
              Admin Workspace
            </span>
            <span className="text-slate-400 font-mono text-[10px]">v2.1</span>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-orange text-white shadow-md'
                      : 'text-slate-300 hover:bg-navy-900 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-3 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-navy-900 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-slate-300 hover:text-white p-2 rounded hover:bg-navy-850 transition-colors"
          >
            <span className="flex items-center">
              <ExternalLink className="w-3.5 h-3.5 mr-2 text-brand-orange" />
              Live Public Site
            </span>
            <span className="text-[10px] text-slate-500 font-mono">/</span>
          </Link>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Logged in as Admin</span>
            <span className="text-emerald-400 font-bold">Secure</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
