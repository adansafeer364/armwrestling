'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface BrandLogoProps {
  className?: string;
  compact?: boolean;
  animated?: boolean;
  showText?: boolean;
  kicker?: string;
  title?: string;
  subtitle?: string;
}

export default function BrandLogo({
  className = '',
  compact = false,
  animated = true,
  showText = false,
  kicker = 'Professional Armwrestling',
  title = 'Championship 2026',
  subtitle = 'Powered by prestige and precision',
}: BrandLogoProps) {
  const size = compact ? 48 : 72;

  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 20, scale: 0.96 } : false}
      animate={animated ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-center gap-3 sm:gap-4 ${className}`}
    >
      <motion.div
        animate={animated ? { y: [0, -6, 0], rotate: [0, 1, 0] } : undefined}
        transition={animated ? { duration: 4.2, repeat: Infinity, ease: 'easeInOut' } : undefined}
        className="relative shrink-0 rounded-full border border-orange-400/25 bg-gradient-to-br from-orange-500/20 via-amber-400/10 to-transparent p-1.5 shadow-[0_0_30px_rgba(249,115,22,0.18)]"
      >
        <Image
          src="/images/logo.jpg"
          alt="Armwrestling championship logo"
          width={size}
          height={size}
          priority
          className={`rounded-full object-cover ${compact ? 'h-10 w-10 sm:h-12 sm:w-12' : 'h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20'}`}
        />
      </motion.div>

      {showText && (
        <div className="flex flex-col">
          {kicker && (
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.35em] text-orange-400/90">
              {kicker}
            </span>
          )}
          {title && (
            <span className="text-sm sm:text-lg md:text-xl font-black uppercase tracking-[0.2em] text-white">
              {title}
            </span>
          )}
          {subtitle && (
            <span className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.25em] text-slate-300/80">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
