'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Flame } from 'lucide-react';

// Men's weight classes — 5 kg steps from −55 kg up to −100 kg, then 100 kg+.
const STEPS = [55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
const CLASSES = [
  ...STEPS.map((kg, i) => ({
    name: `−${kg} kg`,
    range: i === 0 ? `Up to ${kg} kg` : `${STEPS[i - 1]}–${kg} kg`,
  })),
  { name: '100 kg+', range: 'Over 100 kg' },
];

export default function WeightCategories() {
  return (
    <section id="divisions" className="py-24 bg-light-bg dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-brand-primary uppercase">
            Official Classes
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-light-text-main dark:text-dark-text-main uppercase tracking-tight">
            WEIGHT CATEGORIES &amp; DIVISIONS
          </h2>
          <p className="text-light-text-muted dark:text-dark-text-muted text-base sm:text-lg">
            Men&apos;s divisions in 5 kg steps — every athlete competes against pullers of equal weight, on the left and right hand.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {CLASSES.map((cls, idx) => (
            <motion.div
              key={cls.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.04, duration: 0.35 }}
              className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-md flex flex-col justify-between hover:shadow-xl hover:border-brand-primary/40 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-brand-primary uppercase bg-brand-primary/10 px-2 py-1 rounded-md">
                    Men&apos;s
                  </span>
                  <Shield className="h-4 w-4 text-gray-300 dark:text-gray-700" />
                </div>
                <h3 className="text-2xl font-black text-light-text-main dark:text-dark-text-main">{cls.name}</h3>
                <p className="text-sm font-semibold text-light-text-muted dark:text-dark-text-muted">{cls.range}</p>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 mt-4 pt-3 flex items-center gap-1.5 text-[11px] font-bold text-brand-secondary uppercase">
                <Flame className="h-3.5 w-3.5" />
                <span>Left &amp; Right Hand</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
