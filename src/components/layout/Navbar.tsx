'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { COMPANY_INFO } from '@/data/company';

/* ─── Navigation types & data ────────────────────────────── */

interface DropdownItem {
  name: string;
  href: string;
  desc: string;
}

interface NavItem {
  name: string;
  href: string;
  dropdown?: DropdownItem[];
}

const NAV_LINKS: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  {
    name: 'Machineries',
    href: '/machineries',
    dropdown: [
      { name: 'All Machineries', href: '/machineries', desc: 'Complete industrial catalogue' },
      { name: 'Plastic Washing Plants', href: '/machineries/absw-plastic-washing-plant', desc: '10 FT compact design with water recycling' },
      { name: 'Crushers & Granulators', href: '/machineries/g-series-plastic-crusher-machine', desc: 'EN41 steel blades & 20–60 HP motors' },
      { name: 'Screw Conveyors', href: '/machineries/cr-series-screw-conveyor', desc: 'CR Series 5400 mm continuous feed' },
      { name: 'Transport Blowers', href: '/machineries/mtb-material-transport-blower', desc: 'MTB 2880 RPM pneumatic conveying' },
    ],
  },
  { name: 'Granules', href: '/granules' },
  { name: 'Solutions', href: '/services' },
  { name: 'Insights', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

/* ─── Framer-motion variants ─────────────────────────────── */

const mobileOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const mobilePanel: Variants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { type: 'spring', damping: 30, stiffness: 300 } },
  exit: { x: '100%', transition: { duration: 0.25 } },
};

const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.18, ease: 'easeOut' } },
  exit: { opacity: 0, y: 4, scale: 0.98, transition: { duration: 0.12 } },
};

/* ─── Component ──────────────────────────────────────────── */

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  /* Scroll listener — transparent → solid at 80 px */
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 80);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  /* Hide on admin */
  if (pathname.startsWith('/admin')) return null;

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/60'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* ── Logo ── */}
          <Link href="/" className="relative flex items-center group py-2 shrink-0">
            <div className="relative h-12 w-48 sm:h-14 sm:w-56 transition-transform duration-300 group-hover:scale-[1.02]">
              <Image
                src="/images/logo.png"
                alt="ABS Polymers — Plastic Recycling Machinery"
                fill
                priority
                className={`object-contain object-left transition-all duration-500 ${
                  scrolled ? '' : 'brightness-0 invert'
                }`}
              />
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              if (link.dropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <Link
                      href={link.href}
                      className={`group relative flex items-center px-3 py-2 text-[13.5px] font-semibold tracking-wide transition-colors duration-300 ${
                        scrolled
                          ? isActive(link.href)
                            ? 'text-navy-900'
                            : 'text-slate-700 hover:text-navy-900'
                          : isActive(link.href)
                            ? 'text-white'
                            : 'text-white/85 hover:text-white'
                      }`}
                    >
                      {link.name}
                      <ChevronDown
                        className={`ml-1 w-3.5 h-3.5 transition-transform duration-200 ${
                          dropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                      <span
                        className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full transition-transform duration-300 origin-left ${
                          scrolled ? 'bg-brand-orange' : 'bg-white'
                        } ${isActive(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                      />
                    </Link>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute top-full left-0 w-80 bg-white rounded-xl shadow-xl border border-slate-100 py-2 mt-2 z-50"
                        >
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="block px-4 py-2.5 hover:bg-slate-50 transition-colors group/item"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <div className="text-sm font-semibold text-slate-800 group-hover/item:text-brand-orange transition-colors">
                                {item.name}
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`group relative px-3 py-2 text-[13.5px] font-semibold tracking-wide transition-colors duration-300 ${
                    scrolled
                      ? isActive(link.href)
                        ? 'text-navy-900'
                        : 'text-slate-700 hover:text-navy-900'
                      : isActive(link.href)
                        ? 'text-white'
                        : 'text-white/85 hover:text-white'
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full transition-transform duration-300 origin-left ${
                      scrolled ? 'bg-brand-orange' : 'bg-white'
                    } ${isActive(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* ── Right Actions ── */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/contact?intent=quote"
              className="inline-flex items-center px-5 py-2.5 text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Request a Quote
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
          </div>

          {/* ── Mobile Controls ── */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/contact?intent=quote"
              className="px-3 py-1.5 text-xs font-bold text-white bg-brand-orange rounded-md"
            >
              Quote
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className={`p-2 rounded-md transition-colors ${
                scrolled
                  ? 'text-slate-700 hover:bg-slate-100'
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Full-Screen Overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              variants={mobileOverlay}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm z-40"
            />

            <motion.div
              key="panel"
              variants={mobilePanel}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <Link href="/" onClick={() => setMobileOpen(false)} className="relative h-10 w-40">
                  <Image
                    src="/images/logo.png"
                    alt="ABS Polymers"
                    fill
                    className="object-contain object-left"
                  />
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-md text-slate-500 hover:bg-slate-100"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <div key={link.name}>
                    <Link
                      href={link.href}
                      className={`block px-3 py-3 text-base font-semibold rounded-lg transition-colors ${
                        isActive(link.href)
                          ? 'text-brand-orange bg-orange-50'
                          : 'text-slate-800 hover:bg-slate-50 hover:text-brand-orange'
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.name}
                    </Link>
                    {link.dropdown && (
                      <div className="pl-6 space-y-0.5 mb-1 border-l-2 border-slate-100 ml-3">
                        {link.dropdown.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="block py-2 px-2 text-sm text-slate-600 hover:text-brand-orange transition-colors rounded"
                            onClick={() => setMobileOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 px-5 py-5 space-y-3 bg-slate-50">
                <Link
                  href="/contact?intent=quote"
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-lg shadow transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Request a Quote
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <a
                    href={`tel:${COMPANY_INFO.contact.phone}`}
                    className="flex items-center font-medium text-slate-700"
                  >
                    <Phone className="w-3.5 h-3.5 mr-1 text-brand-orange" />
                    {COMPANY_INFO.contact.phoneDisplay}
                  </a>
                  <a
                    href={`mailto:${COMPANY_INFO.contact.email}`}
                    className="flex items-center font-medium text-slate-700"
                  >
                    <Mail className="w-3.5 h-3.5 mr-1 text-brand-orange" />
                    Email Us
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
