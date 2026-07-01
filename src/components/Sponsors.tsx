'use client';

import React from 'react';
import { motion } from 'framer-motion';

const SPONSORS = [
  { name: 'ROGUE FITNESS', tier: 'Title Partner' },
  { name: 'MONSTER ENERGY', tier: 'Official Energy Drink' },
  { name: 'UNDER ARMOUR', tier: 'Official Apparel' },
  { name: 'GYMSHARK', tier: 'Jersey Sponsor' },
  { name: 'GOLD\'S GYM', tier: 'Training Facility' },
  { name: 'GNC SUPPLEMENTS', tier: 'Nutrition Partner' }
];

export default function Sponsors() {
  return (
    <section className="py-16 bg-white dark:bg-dark-card border-y border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] font-extrabold tracking-widest text-brand-primary uppercase bg-brand-primary/10 px-3 py-1 rounded-md">
            Our Partners
          </span>
          <p className="text-sm font-semibold text-light-text-muted dark:text-dark-text-muted mt-3 uppercase tracking-wider">
            SUPPORTED BY THE BEST IN ATHLETICS
          </p>
        </div>

        {/* Sponsor Grid */}
        {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {SPONSORS.map((sponsor, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800/80 cursor-pointer shadow-sm hover:border-brand-primary/40 dark:hover:border-brand-primary/40 transition-all"
            >
              <span className="text-lg font-black tracking-tighter text-light-text-muted dark:text-dark-text-muted hover:text-brand-primary dark:hover:text-brand-primary transition-colors uppercase">
                {sponsor.name}
              </span>
              <span className="text-[9px] font-extrabold uppercase text-light-text-muted dark:text-dark-text-muted/60 mt-1">
                {sponsor.tier}
              </span>
            </motion.div>
          ))}
        </div> */}
        <span className="text-[25px] font-extrabold uppercase text-red-600 mt-1">
                no partners yet
              </span>

      </div>
    </section>
  );
}
