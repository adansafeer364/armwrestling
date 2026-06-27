'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GitCommit, GitBranch, RefreshCw, Trophy } from 'lucide-react';

const STEPS = [
  {
    title: '1. Weight Categories',
    icon: GitCommit,
    desc: 'Athletes are grouped into weight classes (−60, −70, −80, −90 kg) and by competing arm — left and right.'
  },
  {
    title: '2. Random Draw',
    icon: GitBranch,
    desc: 'Inside each category the athletes are shuffled and paired randomly, so every matchup is decided fairly on the day.'
  },
  {
    title: '3. Knockout Rounds',
    icon: RefreshCw,
    desc: 'Win your match and you advance; lose and you are out. After every round the remaining winners are re-paired.'
  },
  {
    title: '4. Category Champion',
    icon: Trophy,
    desc: 'The last athlete standing in each weight class is crowned the category champion.'
  }
];

export default function TournamentFormat() {
  return (
    <section className="py-24 bg-light-bg dark:bg-dark-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-brand-primary uppercase">
            Rules of Combat
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-light-text-main dark:text-dark-text-main uppercase tracking-tight">
            KNOCKOUT FORMAT
          </h2>
          <p className="text-light-text-muted dark:text-dark-text-muted text-base sm:text-lg">
            Fair random draws, weight-class divisions, and pure knockout pressure — win and advance, lose and you're out.
          </p>
        </div>

        {/* Process Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {/* Decorative connector line on desktop */}
          <div className="hidden lg:block absolute top-[44px] left-8 right-8 h-0.5 bg-gray-200 dark:bg-gray-800 -z-10"></div>

          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md"
              >
                <div className="h-16 w-16 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-6 border-4 border-light-bg dark:border-dark-bg shadow-sm">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-light-text-main dark:text-dark-text-main mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-light-text-muted dark:text-dark-text-muted leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
