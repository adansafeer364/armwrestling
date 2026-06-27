'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Medal, Award, Star } from 'lucide-react';

const PRIZES = [
  { rank: '1st Place Overall', amount: 'Rs 50,000', desc: 'Titan Clash Ring + Golden Cup', icon: Medal, color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30' },
  { rank: '2nd Place Overall', amount: 'Rs 30,000', desc: 'Silver Plate Trophy', icon: Award, color: 'text-slate-400 bg-slate-400/10 border-slate-400/30' },
  { rank: '3rd Place Overall', amount: 'Rs 15,000', desc: 'Bronze Plate Trophy', icon: Star, color: 'text-amber-700 bg-amber-700/10 border-amber-700/30' }
];

export default function PrizePool() {
  return (
    <section id="prizes" className="py-24 bg-white dark:bg-dark-card border-y border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-brand-primary uppercase">
            Prize Distribution
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-light-text-main dark:text-dark-text-main uppercase tracking-tight">
            MASSIVE Rs 150,000 PURSE
          </h2>
          <p className="text-light-text-muted dark:text-dark-text-muted text-base sm:text-lg">
            Compete for the largest cash prize pool in professional armwrestling history.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Main Showcase (1st, 2nd, 3rd) */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            {PRIZES.map((prize, idx) => {
              const Icon = prize.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 rounded-2xl border bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800`}
                >
                  <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                    <div className={`p-4 rounded-xl border ${prize.color}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-light-text-muted dark:text-dark-text-muted uppercase tracking-wider">
                        {prize.rank}
                      </h4>
                      <p className="text-xs text-light-text-muted dark:text-dark-text-muted mt-0.5">
                        {prize.desc}
                      </p>
                    </div>
                  </div>
                  <span className="text-3xl sm:text-4xl font-black text-brand-primary">
                    {prize.amount}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Division Prize Cards */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="h-full p-8 rounded-3xl bg-gradient-to-br from-brand-secondary to-brand-primary text-white flex flex-col justify-between glow-red relative overflow-hidden"
            >
              {/* Background Glow Ring */}
              <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>

              <div className="space-y-6">
                <div className="p-3 w-fit rounded-xl bg-white/10 text-white">
                  <Coins className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-tight">
                    Division Bonuses
                  </h3>
                  <p className="text-sm text-white/90 mt-2 leading-relaxed">
                    Beyond overall podium finishes, individual weight class winners share in **Rs 55,000** of additional division rewards:
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between border-b border-white/20 pb-2 text-sm font-semibold">
                    <span>Division Champion (Pro)</span>
                    <span className="font-bold">Rs 5,000</span>
                  </div>
                  <div className="flex justify-between border-b border-white/20 pb-2 text-sm font-semibold">
                    <span>Division Runner-Up (Pro)</span>
                    <span className="font-bold">Rs 2,500</span>
                  </div>
                  <div className="flex justify-between pb-2 text-sm font-semibold">
                    <span>Best Rookie of the Year</span>
                    <span className="font-bold">Rs 1,500</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <a
                  href="#contact"
                  className="block w-full py-4 text-center rounded-full font-bold text-sm bg-white text-brand-secondary hover:bg-white/95 transition-all shadow-md"
                >
                  Join the Grid
                </a>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
