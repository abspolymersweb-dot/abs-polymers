'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Phone, Mail, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import { COMPANY_INFO } from '@/data/company';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [machineryDropdownOpen, setMachineryDropdownOpen] = useState(false);
  const pathname = usePathname();

  // If in admin area, do not show the public navbar
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    {
      name: 'Our Machinery',
      href: '/machineries',
      dropdown: [
        { name: 'All Machineries', href: '/machineries', desc: 'Complete industrial catalogue' },
        { name: 'Plastic Washing Plants', href: '/machineries/absw-plastic-washing-plant', desc: '10 FT compact design with water recycling' },
        { name: 'Plastic Crushers & Granulators', href: '/machineries/g-series-plastic-crusher-machine', desc: 'EN41 steel blades & 20-60 HP motors' },
        { name: 'Screw Conveyors', href: '/machineries/cr-series-screw-conveyor', desc: 'CR Series 5400 mm continuous feed' },
        { name: 'Material Transport Blowers', href: '/machineries/mtb-material-transport-blower', desc: 'MTB 2880 RPM pneumatic conveying' },
      ]
    },
    { name: 'Granules', href: '/granules' },
    { name: 'Recycling Solutions', href: '/services' },
    { name: 'Blogs', href: '/blog' },
    { name: 'Contact Us', href: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top micro bar for global reach and contact */}
      <div className="hidden lg:block bg-navy-950 text-slate-300 text-xs py-1.5 px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
              Coimbatore, Tamil Nadu, India • Exporting to UAE & Worldwide
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300 font-medium">35+ Years Granules Expertise • 6+ Years Machinery Manufacturing</span>
          </div>
          <div className="flex items-center space-x-5">
            <a href={`tel:${COMPANY_INFO.contact.phone}`} className="flex items-center hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 mr-1 text-brand-orange" />
              {COMPANY_INFO.contact.phoneDisplay}
            </a>
            <a href={`mailto:${COMPANY_INFO.contact.salesEmail}`} className="flex items-center hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5 mr-1 text-brand-orange" />
              {COMPANY_INFO.contact.salesEmail}
            </a>
            <Link href="/admin" className="flex items-center text-slate-400 hover:text-white transition-colors bg-navy-850 px-2 py-0.5 rounded text-[11px]">
              <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" />
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Official Logo */}
          <Link href="/" className="flex items-center group py-2">
            <div className="relative h-12 w-48 sm:h-14 sm:w-56 transition-transform group-hover:scale-[1.02]">
              <Image
                src="/images/logo.png"
                alt="ABS Polymers - Plastic Recycling Machinery"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

              if (link.dropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setMachineryDropdownOpen(true)}
                    onMouseLeave={() => setMachineryDropdownOpen(false)}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                        isActive
                          ? 'text-[#04294a] bg-slate-100'
                          : 'text-slate-700 hover:text-[#04294a] hover:bg-slate-50'
                      }`}
                    >
                      {link.name}
                      <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${machineryDropdownOpen ? 'rotate-180' : ''}`} />
                    </Link>

                    {machineryDropdownOpen && (
                      <div className="absolute top-full left-0 w-80 bg-white rounded-xl shadow-xl border border-slate-100 py-2 mt-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="block px-4 py-2.5 hover:bg-slate-50 transition-colors group"
                            onClick={() => setMachineryDropdownOpen(false)}
                          >
                            <div className="text-sm font-semibold text-slate-800 group-hover:text-[#f37021]">
                              {item.name}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                    isActive
                      ? 'text-[#04294a] bg-slate-100'
                      : 'text-slate-700 hover:text-[#04294a] hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-md">
              <Globe className="w-3.5 h-3.5 mr-1 text-slate-500" />
              <span>EN</span>
            </div>

            <Link
              href="/contact?intent=quote"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-md shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <span>Request a Quote</span>
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center space-x-2">
            <Link
              href="/contact?intent=quote"
              className="px-3 py-1.5 text-xs font-bold text-white bg-brand-orange rounded-md"
            >
              Quote
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-2xl">
          <div className="py-2 border-b border-slate-100 mb-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">ABS Polymers Coimbatore</div>
            <div className="text-xs text-slate-600">Exporting to UAE & Serving Pan-India</div>
          </div>
          {navLinks.map((link) => (
            <div key={link.name}>
              <Link
                href={link.href}
                className="block px-3 py-2.5 text-base font-semibold text-slate-800 hover:bg-slate-50 hover:text-brand-orange rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
              {link.dropdown && (
                <div className="pl-6 space-y-1 my-1 border-l-2 border-slate-100">
                  {link.dropdown.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      className="block py-1.5 text-sm text-slate-600 hover:text-brand-orange"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <Link
              href="/contact?intent=quote"
              className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold text-white bg-brand-orange rounded-md shadow"
              onClick={() => setMobileMenuOpen(false)}
            >
              Request a Machinery Quote
            </Link>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <a href={`tel:${COMPANY_INFO.contact.phone}`} className="flex items-center text-slate-700 font-semibold">
                <Phone className="w-3.5 h-3.5 mr-1 text-brand-orange" />
                {COMPANY_INFO.contact.phoneDisplay}
              </a>
              <Link href="/admin" className="text-slate-500 hover:underline">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
