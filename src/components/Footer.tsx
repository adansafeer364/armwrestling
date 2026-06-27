'use client';

import React, { useState } from 'react';
import { Trophy, Mail, Send, Check } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-gray-900">
          
          {/* Logo & Desc */}
          <div className="md:col-span-4 space-y-4">
            <a href="#" className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-brand-primary" />
              <span className="font-extrabold text-xl tracking-wider text-white">
                TITAN<span className="text-brand-primary">CLASH</span>
              </span>
            </a>
            <p className="text-sm text-gray-500 leading-relaxed">
              The premier professional armwrestling organization hosting world-class combat sports events. Built on fair play, absolute power, and technical mastery.
            </p>
          </div>

          {/* Links columns */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Event Details
            </h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li><a href="#about" className="hover:text-brand-primary transition-colors">About</a></li>
              <li><a href="#benefits" className="hover:text-brand-primary transition-colors">Benefits</a></li>
              <li><a href="#divisions" className="hover:text-brand-primary transition-colors">Weight Classes</a></li>
              <li><a href="#prizes" className="hover:text-brand-primary transition-colors">Prize Pool</a></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Schedule & Info
            </h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li><a href="#schedule" className="hover:text-brand-primary transition-colors">Schedule</a></li>
              <li><a href="#gallery" className="hover:text-brand-primary transition-colors">Gallery</a></li>
              <li><a href="#faq" className="hover:text-brand-primary transition-colors">FAQ</a></li>
              <li><a href="#contact" className="hover:text-brand-primary transition-colors">Register</a></li>
            </ul>
          </div>

          {/* Newsletter signup */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Subscribe to Updates
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Get notified immediately about bracket releases, ticket availability, and match schedule releases.
            </p>

            <form onSubmit={handleSubscribe} className="flex space-x-2 pt-2">
              <div className="relative w-full">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-800 bg-gray-900 text-sm focus:outline-none focus:border-brand-primary transition-all text-white placeholder-gray-600"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-3 rounded-xl bg-brand-primary text-white hover:bg-brand-primary/95 transition-all flex items-center justify-center shrink-0"
              >
                {subscribed ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
          </div>

        </div>

        {/* Footer bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600 gap-4">
          <p>© 2026 Titan Sports Association. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-brand-primary transition-colors">Rules & Regulations</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
