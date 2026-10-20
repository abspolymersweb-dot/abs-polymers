'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  FileText,
  Edit3,
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
  AlertTriangle,
  Cpu
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
    { name: 'Inquiries', href: '/admin/inquiries', icon: Inbox },
    { name: 'Blogs & Articles', href: '/admin/blogs', icon: FileText },
    { name: 'CMS & Content', href: '/admin/cms', icon: Edit3 },
    { name: 'Machineries', href: '/admin/machineries', icon: Layers },
    { name: 'Granules', href: '/admin/granules', icon: Sparkles },
    { name: 'Services', href: '/admin/services', icon: Wrench },
    { name: 'SEO Engine', href: '/admin/seo', icon: Search },
    { name: 'Database Health', href: '/admin/db-health', icon: Activity },
    { name: 'Settings & Integrations', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-navy-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="relative h-8 w-28 bg-white/90 p-1 rounded">
            <Image
              src="/images/logo.png"
              alt="ABS Polymers"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xs font-bold text-brand-orange uppercase">Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800"
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
          {/* Logo container */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="relative h-10 w-36 bg-white/90 p-1.5 rounded-lg shadow-sm">
                <Image
                  src="/images/logo.png"
                  alt="ABS Polymers"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Environmental / State Banner in Sidebar */}
          <div className="px-4 py-2.5 bg-navy-900 border-b border-slate-800 flex items-center justify-between text-[11px]">
            <span className="flex items-center text-amber-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400 mr-1.5 animate-pulse"></span>
              Dev Repository Mode
            </span>
            <span className="text-slate-400">v1.0.0</span>
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
            className="flex items-center justify-between text-xs text-slate-300 hover:text-white p-2 rounded hover:bg-navy-850"
          >
            <span className="flex items-center">
              <ExternalLink className="w-3.5 h-3.5 mr-2 text-brand-orange" />
              Live Public Site
            </span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Open</span>
          </Link>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            <span className="truncate">Coimbatore Admin Desk</span>
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>
      </aside>

      {/* Main Administrative Canvas */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header bar */}
        <header className="bg-white border-b border-slate-200 py-3.5 px-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              ABS Polymers Administration
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold text-slate-700 capitalize">
              {pathname.replace('/admin', '').replace('/', '') || 'Overview'}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Database status chip */}
            <Link
              href="/admin/db-health"
              className="hidden sm:flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
              <span>DB: In-Memory / Dev Mode</span>
            </Link>

            {/* MCP Adapter chip */}
            <Link
              href="/admin/settings"
              className="hidden sm:flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 mr-1 text-blue-600" />
              <span>MCP: Ready (Local Adapter)</span>
            </Link>

            <div className="text-xs text-right">
              <div className="font-bold text-slate-800">Engineering Administrator</div>
              <div className="text-[10px] text-slate-500">Coimbatore Headquarters</div>
            </div>
          </div>
        </header>

        {/* Dynamic Admin View */}
        <main className="p-6 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}

