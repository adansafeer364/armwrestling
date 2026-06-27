'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Swords } from 'lucide-react';

export default function Hero() {
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-dark-bg">
      {/* Background Image with Dark Overlays */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/images/hero-bg.jpg')` }}
      />
      
      {/* Overlay Filters */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/75 to-transparent"></div>
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-dark-bg/50 to-dark-bg"></div>
      
      {/* Floating Sparkles effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-primary/10 via-transparent to-transparent"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center space-y-6"
        >
          {/* Subheading Badge */}
          <motion.div
            variants={itemVariants}
            className="flex items-center space-x-2 px-4 py-1.5 rounded-full border border-brand-primary/30 bg-brand-primary/10 text-brand-primary text-xs sm:text-sm font-bold tracking-widest uppercase"
          >
            <Swords className="h-4 w-4" />
            <span>The Ultimate Armwrestling Arena</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-white uppercase"
          >
            TITAN CLASH <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">2026</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={itemVariants}
            className="max-w-2xl text-base sm:text-xl text-gray-300 font-medium"
          >
            Two pullers. One table. Absolute domination. Join the world’s elite competitors competing for glory, rankings, and a massive prize pool.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4"
          >
            <a
              href="#contact"
              className="flex items-center justify-center space-x-2 px-8 py-4 rounded-full font-bold text-base bg-brand-primary hover:bg-brand-primary/90 text-white shadow-lg glow-primary transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span>Register to Pull</span>
              <ArrowRight className="h-5 w-5" />
            </a>
            
            <a
              href="#gallery"
              className="flex items-center justify-center space-x-2 px-8 py-4 rounded-full font-bold text-base bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-300"
            >
              <Play className="h-5 w-5 fill-white" />
              <span>Watch Promo</span>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Bottom Corner Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark-bg to-transparent"></div>
    </section>
  );
}
