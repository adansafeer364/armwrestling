'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Devon \"No-Limits\" Harris',
    role: 'Super Heavyweight Champion',
    quote: 'The organization of Titan Clash is next level. From the quality of tables to referee standards, this is exactly the professional setup armwrestling needs.',
    rating: 5
  },
  {
    name: 'Sarah \"The Hook\" Kovac',
    role: 'Women\'s Lightweight Runner-Up',
    quote: 'The random draw kept everyone honest — no easy paths. I won four straight knockout rounds to take my weight class. Pure pressure, every pull mattered!',
    rating: 5
  },
  {
    name: 'Marcus \"Iron Claw\" Vance',
    role: 'Middleweight Pro Winner',
    quote: 'The prize payout was instant and the VIP athlete lounge made recovery between strenuous matches so much easier. Will definitely pull again in 2026!',
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-light-bg dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-brand-primary uppercase">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-light-text-main dark:text-dark-text-main uppercase tracking-tight">
            WHAT THE ATHLETES SAY
          </h2>
          <p className="text-light-text-muted dark:text-dark-text-muted text-base sm:text-lg">
            Hear from professional pullers who competed and conquered in our arena.
          </p>
        </div>

        {/* Testimonials List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {REVIEWS.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="p-8 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow relative overflow-hidden"
            >
              {/* Quote icon watermark */}
              <Quote className="absolute right-6 top-6 h-12 w-12 opacity-5 dark:opacity-[0.02] text-brand-primary" />

              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex space-x-1 text-brand-accent">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-brand-accent" />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-sm sm:text-base text-light-text-muted dark:text-dark-text-muted italic leading-relaxed">
                  "{review.quote}"
                </p>
              </div>

              {/* Author profile info */}
              <div className="border-t border-gray-100 dark:border-gray-800 mt-8 pt-4 flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-sm uppercase">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-light-text-main dark:text-dark-text-main">
                    {review.name}
                  </h4>
                  <p className="text-xs text-light-text-muted dark:text-dark-text-muted mt-0.5">
                    {review.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
