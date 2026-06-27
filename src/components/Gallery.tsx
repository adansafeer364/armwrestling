'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const IMAGES = [
  { src: '/images/gallery-1.png', alt: 'Championship Match Grip', title: 'Absolute Muscle Tension', desc: 'Competitors locking fingers on the table.' },
  { src: '/images/gallery-2.png', alt: 'Referee Setup Alignment', title: 'Fair Setup Control', desc: 'Referee aligning wrists before the start signal.' },
  { src: '/images/gallery-3.png', alt: 'Champion Screaming Victory', title: 'Roar of Victory', desc: 'Elite athlete celebrating a crucial pin.' }
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-24 bg-light-bg dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-brand-primary uppercase">
            Captured Moments
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-light-text-main dark:text-dark-text-main uppercase tracking-tight">
            CLASH PHOTO GALLERY
          </h2>
          <p className="text-light-text-muted dark:text-dark-text-muted text-base sm:text-lg">
            Glance at the raw emotion, focus, and strength displayed in previous matches.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {IMAGES.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              className="relative group rounded-2xl overflow-hidden shadow-lg aspect-4/3 bg-gray-900"
            >
              {/* Image element */}
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transform group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/90 via-brand-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-accent">
                  Titan Match
                </span>
                <h4 className="text-xl font-black uppercase mt-1">
                  {img.title}
                </h4>
                <p className="text-xs text-white/95 mt-1 font-medium leading-relaxed">
                  {img.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
