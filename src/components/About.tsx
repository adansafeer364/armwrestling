'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Globe, ShieldCheck, Users } from 'lucide-react';

const STATS = [
  { icon: Trophy, label: 'Grand Prize Pool', value: 'Rs 15,000+' },
  { icon: Users, label: 'Elite Pullers', value: '400+' },
  { icon: ShieldCheck, label: 'Certified Referees', value: '5+' }
];

export default function About() {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  return (
    <section id="about" className="py-24 bg-light-bg dark:bg-dark-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <span className="text-xs sm:text-sm font-bold tracking-widest text-brand-primary uppercase">
                About The Event
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-light-text-main dark:text-dark-text-main uppercase tracking-tight">
                WHERE HEROES CLASH & LEGENDS ARE BORN
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-light-text-muted dark:text-dark-text-muted text-base sm:text-lg leading-relaxed"
            >
              Titan Clash 2026 is the pinnacle of professional armwrestling, bringing together the region's most elite pullers. Hosted in Mansehra, Khyber Pakhtunkhwa, the tournament features fair random-draw knockout brackets, professional referees, and an electric arena atmosphere.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-light-text-muted dark:text-dark-text-muted text-base sm:text-lg leading-relaxed"
            >
              Whether you are an aspiring open competitor or a veteran champion, this tournament offers a world-class platform to test your strength, endurance, and strategy. All matches will be broadcasted live internationally, featuring commentary from legendary giants of the sport.
            </motion.p>
          </div>

          {/* Right Cards Stats */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {STATS.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="p-8 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-lg flex flex-col items-center sm:items-start text-center sm:text-left space-y-4"
                >
                  <div className="p-3.5 rounded-2xl bg-brand-primary/10 text-brand-primary">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="text-3xl font-black text-light-text-main dark:text-dark-text-main">
                      {stat.value}
                    </h4>
                    <p className="text-sm font-semibold text-light-text-muted dark:text-dark-text-muted mt-1 uppercase tracking-wide">
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
