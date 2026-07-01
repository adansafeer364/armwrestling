'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Tv, ShieldAlert, Award, HeartPulse, Sparkles, TrendingUp } from 'lucide-react';

const BENEFITS = [
  {
    icon: ShieldAlert,
    title: 'Certified Anti-Doping',
    desc: 'Fair play is guaranteed. Randomized anti-doping tests are administered by official agencies.'
  },
  {
    icon: Award,
    title: 'World Ranking Points',
    desc: 'Sanctioned under professional leagues, matches contribute directly to your global ranking score.'
  },
  {
    icon: HeartPulse,
    title: 'On-Site Medical Staff',
    desc: 'Your safety is our priority. Specialized sports physicians and physiotherapists are available on-standby.'
  },
  {
    icon: TrendingUp,
    title: 'Advanced Grip Tracking',
    desc: 'Utilizing modern cameras to analyze setup angles, slips, and micro-movements for post-match study.'
  },
  {
    icon: Sparkles,
    title: 'Elite VIP Experience',
    desc: 'Premium athlete lounges, free nutritionist meals, and customized sponsor jerseys for top seed entries.'
  }
];

export default function Benefits() {
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="benefits" className="py-24 bg-white dark:bg-dark-card border-y border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-brand-primary uppercase">
            Competitor Benefits
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-light-text-main dark:text-dark-text-main uppercase tracking-tight">
            WHY COMPETE AT TITAN CLASH?
          </h2>
          <p className="text-light-text-muted dark:text-dark-text-muted text-base sm:text-lg">
            We provide a world-class environment designed specifically for professional athletes.
          </p>
        </div>

        {/* Grid */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {BENEFITS.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="relative group p-8 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800/80 transition-all hover:border-brand-primary/50 dark:hover:border-brand-primary/50 overflow-hidden"
              >
                {/* Glowing hover line */}
                <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary group-hover:w-full transition-all duration-300"></div>

                <div className="flex flex-col space-y-4">
                  <div className="p-3 w-fit rounded-xl bg-brand-primary/10 text-brand-primary group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-light-text-main dark:text-dark-text-main">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-light-text-muted dark:text-dark-text-muted leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
