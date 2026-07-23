'use client';

import React, { useState, useEffect, useMemo } from 'react';
import SlideCarousel from './SlideCarousel';
import { createPalette } from '@/lib/palette';
import { useCompetitions, Competition } from './useCompetitions';

function timeParts(target: number, now: number) {
  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    over: diff <= 0,
  };
}

function TimerCard({ comp }: { comp: Competition }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    // This effect sets up the live-ticking "now" time for each card individually
    const id = setInterval(() => setNow(Date.now()), 1000);
    // Cleanup the interval when the component unmounts
    return () => clearInterval(id);
  }, []);

  const t = timeParts(new Date(comp.startDate).getTime(), now);
  const accent = createPalette(comp.title).start;
  const items = [
    { label: 'Days', value: t.days },
    { label: 'Hours', value: t.hours },
    { label: 'Minutes', value: t.minutes },
    { label: 'Seconds', value: t.seconds },
  ];
  return (
    <div className="relative overflow-hidden bg-white dark:bg-dark-card rounded-3xl p-5 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-800">
      {/* per-tournament colour accent */}
      <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: accent }} />

      <div className="text-center mb-5 sm:mb-6 px-6">
        <h3 className="text-xs sm:text-sm font-bold tracking-widest uppercase truncate" style={{ color: accent }}>
          {comp.title}
        </h3>
        <p className="text-base sm:text-2xl font-black text-light-text-main dark:text-dark-text-main mt-1">
          {t.over ? 'EVENT HAS STARTED' : 'STARTS IN'}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center justify-center py-4 sm:py-6 px-1 sm:px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl sm:rounded-2xl"
          >
            <span className="text-2xl sm:text-4xl md:text-5xl font-black tabular-nums leading-none" style={{ color: accent }}>
              {String(item.value).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold uppercase text-light-text-muted dark:text-dark-text-muted mt-1.5 sm:mt-2 tracking-wider">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CountdownTimer() {
  const { competitions: allCompetitions, isLoading } = useCompetitions();

  const comps = useMemo(() => allCompetitions.filter((c) => c.startDate), [allCompetitions]);

  // Show a placeholder or loading skeleton while fetching competitions
  if (isLoading) {
    return <div className="h-48" />; // Simple placeholder height
  }

  if (comps.length === 0) return null;

  return (
    <section className="relative z-20 -mt-10 sm:-mt-20 max-w-5xl mx-auto px-3 sm:px-6">
      <SlideCarousel activeColor={(i) => createPalette(comps[i].title).start}>
        {comps.map((c) => <TimerCard key={c._id} comp={c} />)}
      </SlideCarousel>
    </section>
  );
}
