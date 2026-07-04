'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import BrandLogo from './BrandLogo';

interface SplashProps {
  /** Main line. You can change this text anytime. */
  text?: string;
  /** Small line above the main text. */
  kicker?: string;
  duration?: number; // ms before it auto-dismisses
  onDone?: () => void;
}

const SPARKS = 14;

export default function SplashScreen({
  text = 'Welcome to Arm Fights',
  kicker = '',
  duration = 3600,
  onDone,
}: SplashProps) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const tFade = setTimeout(() => setFading(true), Math.max(0, duration - 900));
    const tEnd = setTimeout(() => { setVisible(false); onDone?.(); }, duration);
    return () => { clearTimeout(tFade); clearTimeout(tEnd); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const dismiss = () => { setVisible(false); onDone?.(); };

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      onClick={dismiss}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden cursor-pointer"
      style={{ background: 'radial-gradient(ellipse at center, #0c1018 0%, #060709 70%, #030405 100%)' }}
    >
      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_center,_#f97316_0%,_transparent_60%)]" />

      {/* two light beams that rush in and clash in the centre */}
      <motion.div
        initial={{ x: '-55vw', opacity: 0, scaleX: 0.4 }}
        animate={{ x: '-1px', opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-[56%] sm:top-1/2 left-1/2 h-[3px] w-[42vw] -translate-y-1/2 origin-right  z-0"
        style={{ background: 'linear-gradient(90deg, transparent, #f97316 70%, #fff)' }}
      />
      <motion.div
        initial={{ x: '55vw', opacity: 0, scaleX: 0.4 }}
        animate={{ x: '1px', opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-[56%] sm:top-1/2 right-1/2 h-[3px] w-[42vw] -translate-y-1/2 origin-left  z-0"
        style={{ background: 'linear-gradient(270deg, transparent, #f97316 70%, #fff)' }}
      />

      {/* clash burst */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.6, 2.4], opacity: [0, 1, 0] }}
        transition={{ duration: 0.9, delay: 0.6, ease: 'easeOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,180,80,0.9) 0%, rgba(249,115,22,0.5) 35%, transparent 70%)' }}
      />

      {/* radial sparks */}
      {Array.from({ length: SPARKS }).map((_, i) => {
        const angle = (i / SPARKS) * Math.PI * 2;
        const dist = 160 + (i % 3) * 60;
        return (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, opacity: 0, scale: 1 }}
            animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: [0, 1, 0], scale: [1, 0.4] }}
            transition={{ duration: 0.85, delay: 0.62, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 h-1.5 w-1.5 rounded-full bg-amber-300"
            style={{ boxShadow: '0 0 8px 2px rgba(251,191,36,0.7)' }}
          />
        );
      })}

      {/* text */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 py-10 max-w-[92vw] select-none sm:px-8 sm:py-12 md:px-12 md:py-16" data-no-translate>
        <motion.div
          initial={{ opacity: 0, scale: 0.92, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex justify-center sm:mb-8 md:mb-10"
        >
          <BrandLogo animated={false} />
        </motion.div>

        <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-5">
          <motion.h1
            initial={{ opacity: 0, scale: 0.86, filter: 'blur(12px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="splash-title text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight leading-[1.04]"
          >
            {text}
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 1.6, ease: 'easeOut' }}
            className="mx-auto h-[2px] w-40 sm:w-44 md:w-48 bg-gradient-to-r from-transparent via-brand-primary to-transparent origin-center"
          />
        </div>
      </div>
    </motion.div>
  );
}
