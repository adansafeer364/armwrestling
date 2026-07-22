'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, MapPin, Calendar } from 'lucide-react';

export default function TournamentBanner() {
  return (
    <div className="relative bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-primary text-white overflow-hidden py-3">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-sm font-semibold">
        {/* Dynamic Badge */}
        <div className="flex items-center space-x-2">
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex items-center justify-center h-6 w-6 rounded-full bg-white/20"
          >
            <Flame className="h-4 w-4 text-white" />
          </motion.span>
          <span className="tracking-wide">LIVE REGISTRATION OPEN: SECURE YOUR SLOT TODAY!</span>
        </div>

        {/* Tournament Info */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4 opacity-90" />
            <span>JULY 25-26, 2026</span>
          </div>
          <span className="hidden sm:inline opacity-60">|</span>
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4 opacity-90" />
            <span>METRO CONVENTION ARENA, LAS VEGAS</span>
          </div>
        </div>

        {/* Small CTA Link */}
        <a
          href="#contact"
          className="bg-white text-brand-secondary hover:bg-white/95 px-3 py-1 rounded-md text-xs font-bold transition-all shadow-sm"
        >
          Get Tickets
        </a>
      </div>
    </div>
  );
}
