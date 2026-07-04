'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../app/providers';
import { useI18n } from '../app/i18n';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import BrandLogo from './BrandLogo';

const NAV_LINKS = [
  { href: '#about', key: 'nav_about' },
  { href: '#divisions', key: 'nav_divisions' },
  { href: '#gallery', key: 'nav_gallery' },
  { href: '#faq', key: 'nav_faq' },
  { href: '#contact', key: 'nav_contact' }
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { t, lang, toggle } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-light-card dark:bg-dark-card border-b border-gray-200 dark:border-gray-800 ${
        scrolled ? 'shadow-lg' : 'shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center group">
            <BrandLogo compact className="group-hover:scale-[1.02] transition-transform duration-300" />
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-medium text-sm text-light-text-muted hover:text-brand-primary dark:text-dark-text-muted dark:hover:text-brand-primary transition-colors duration-250"
              >
                {t(link.key)}
              </a>
            ))}
          </div>

          {/* Actions (Language + Theme + CTA) */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={toggle} data-no-translate
              className="px-3 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-800 text-light-text-main dark:text-dark-text-main text-sm font-bold transition-all"
              aria-label="Switch language"
            >
              {lang === 'en' ? 'اردو' : 'EN'}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-800 text-light-text-main dark:text-dark-text-main transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <a
              href="/status"
              className="font-medium text-sm text-light-text-muted hover:text-brand-primary dark:text-dark-text-muted dark:hover:text-brand-primary transition-colors"
            >
              {t('check_status')}
            </a>
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={toggle} data-no-translate
              className="px-2.5 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-light-text-main dark:text-dark-text-main text-sm font-bold"
              aria-label="Switch language"
            >
              {lang === 'en' ? 'اردو' : 'EN'}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-light-text-main dark:text-dark-text-main"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-light-text-main dark:text-dark-text-main focus:outline-none"
              aria-label="Toggle Mobile Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-light-card dark:bg-dark-card border-b border-gray-200 dark:border-gray-800"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3.5 rounded-lg text-base font-semibold text-light-text-muted hover:text-brand-primary hover:bg-gray-50 dark:text-dark-text-muted dark:hover:text-brand-primary dark:hover:bg-gray-900 transition-all"
                >
                  {t(link.key)}
                </a>
              ))}
              <a
                href="/status"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3.5 rounded-lg text-base font-semibold text-light-text-muted hover:text-brand-primary hover:bg-gray-50 dark:text-dark-text-muted dark:hover:text-brand-primary dark:hover:bg-gray-900 transition-all"
              >
                {t('check_status')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
