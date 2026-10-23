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
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  /* Scroll listener — transparent to solid on home; always solid on inner pages */
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 30);
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

  // Consistent Navy navbar across the entire website eliminates contrast bugs
  const navBackground = isHome
    ? scrolled
      ? 'bg-navy-950/95 backdrop-blur-md shadow-lg border-b border-slate-800/90'
      : 'bg-navy-950/60 backdrop-blur-xs border-b border-white/10'
    : 'bg-navy-950/98 backdrop-blur-md shadow-md border-b border-slate-800/90';

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${navBackground}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* ── Brand Logo — Approved Pure White on Dark Navy ── */}
          <Link href="/" className="relative flex items-center group py-2 shrink-0" aria-label="ABS Polymers Homepage">
            <div className="relative h-11 w-44 sm:h-12 sm:w-52 transition-transform duration-300 group-hover:scale-[1.02]">
              <Image
                src="/images/logo.png"
                alt="ABS Polymers — Plastic Recycling Machinery"
                fill
                priority
                className="object-contain object-left brightness-0 invert"
              />
            </div>
          </Link>

          {/* ── Desktop Navigation Links ── */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
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
                      className={`group relative flex items-center px-3.5 py-2 text-[14px] font-semibold tracking-wide transition-colors duration-200 ${
                        isActive(link.href)
                          ? 'text-brand-orange'
                          : 'text-slate-200 hover:text-white'
                      }`}
                    >
                      {link.name}
                      <ChevronDown
                        className={`ml-1 w-3.5 h-3.5 transition-transform duration-200 ${
                          dropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                      <span
                        className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full transition-transform duration-200 origin-left bg-brand-orange ${
                          isActive(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`}
                      />
                    </Link>

                    {/* Desktop Dropdown Menu */}
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute top-full left-0 w-84 bg-navy-900/98 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700/80 py-2 mt-2 z-50 overflow-hidden"
                        >
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="block px-4 py-3 hover:bg-navy-800/90 transition-colors group/item border-b border-slate-800/60 last:border-b-0"
                              onClick={() => setDropdownOpen(false)}
                            >
                              <div className="text-sm font-bold text-slate-100 group-hover/item:text-brand-orange transition-colors">
                                {item.name}
                              </div>
                              <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.desc}</div>
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
                  className={`group relative px-3.5 py-2 text-[14px] font-semibold tracking-wide transition-colors duration-200 ${
                    isActive(link.href)
                      ? 'text-brand-orange'
                      : 'text-slate-200 hover:text-white'
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full transition-transform duration-200 origin-left bg-brand-orange ${
                      isActive(link.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* ── Right Action CTA ── */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/contact?intent=quote"
              className="inline-flex items-center px-5 py-2.5 text-sm font-bold text-white bg-brand-orange hover:bg-orange-600 rounded-lg shadow-md hover:shadow-orange-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Request a Quote
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
          </div>

          {/* ── Mobile Controls (Hamburger & Quick CTA) ── */}
          <div className="flex lg:hidden items-center gap-2.5">
            <Link
              href="/contact?intent=quote"
              className="px-3 py-1.5 text-xs font-bold text-white bg-brand-orange rounded-md shadow-xs active:bg-orange-600"
            >
              Quote
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-navy-900 border border-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer Overlay & Panel ── */}
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
              className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm z-40"
              aria-hidden="true"
            />

            <motion.div
              key="panel"
              variants={mobilePanel}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-navy-950 border-l border-slate-800 z-50 flex flex-col shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Drawer"
            >
              {/* Header inside mobile drawer */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-navy-900/60">
                <Link href="/" onClick={() => setMobileOpen(false)} className="relative h-10 w-40">
                  <Image
                    src="/images/logo.png"
                    alt="ABS Polymers"
                    fill
                    className="object-contain object-left brightness-0 invert"
                  />
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-navy-900 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation items in drawer */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-1">
                {NAV_LINKS.map((link) => (
                  <div key={link.name} className="py-0.5">
                    <Link
                      href={link.href}
                      className={`block px-3.5 py-3 text-base font-semibold rounded-lg transition-colors min-h-[44px] flex items-center ${
                        isActive(link.href)
                          ? 'text-brand-orange bg-brand-orange/15 font-bold'
                          : 'text-slate-200 hover:bg-navy-900 hover:text-white'
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.name}
                    </Link>
                    {link.dropdown && (
                      <div className="pl-4 space-y-1 my-1 border-l border-slate-800 ml-4">
                        {link.dropdown.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="block py-2.5 px-3 text-sm text-slate-400 hover:text-brand-orange transition-colors rounded-lg min-h-[40px] flex items-center"
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

              {/* Bottom Actions in Drawer */}
              <div className="border-t border-slate-800 px-5 py-5 space-y-3.5 bg-navy-900/80">
                <Link
                  href="/contact?intent=quote"
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-white bg-brand-orange hover:bg-orange-600 rounded-lg shadow-md transition-colors min-h-[44px]"
                  onClick={() => setMobileOpen(false)}
                >
                  Request a Quote
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <div className="flex items-center justify-between text-xs pt-1">
                  <a
                    href={`tel:${COMPANY_INFO.contact.phone}`}
                    className="flex items-center font-medium text-slate-300 hover:text-white"
                  >
                    <Phone className="w-3.5 h-3.5 mr-1.5 text-brand-orange" />
                    {COMPANY_INFO.contact.phoneDisplay}
                  </a>
                  <a
                    href={`mailto:${COMPANY_INFO.contact.email}`}
                    className="flex items-center font-medium text-slate-300 hover:text-white"
                  >
                    <Mail className="w-3.5 h-3.5 mr-1.5 text-brand-orange" />
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
