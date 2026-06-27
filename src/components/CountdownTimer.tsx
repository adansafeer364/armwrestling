'use client';

import React, { useState, useEffect } from 'react';

interface Comp {
  _id: string;
  title: string;
  startDate: string;
}

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

function TimerCard({ comp, now }: { comp: Comp; now: number }) {
  const t = timeParts(new Date(comp.startDate).getTime(), now);
  const items = [
    { label: 'Days', value: t.days },
    { label: 'Hours', value: t.hours },
    { label: 'Minutes', value: t.minutes },
    { label: 'Seconds', value: t.seconds },
  ];
  return (
    <div className="bg-white dark:bg-dark-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-800">
      <div className="text-center mb-6">
        <h3 className="text-xs sm:text-sm font-bold tracking-widest text-brand-primary uppercase">{comp.title}</h3>
        <p className="text-lg sm:text-2xl font-black text-light-text-main dark:text-dark-text-main mt-1">
          {t.over ? 'EVENT HAS STARTED' : 'STARTS IN'}
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {items.map((item) => (
          <div key={item.label} className="relative group">
            <div className="relative flex flex-col items-center justify-center py-6 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">
              <span className="text-4xl sm:text-5xl font-black text-brand-primary dark:text-white tabular-nums">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-xs font-semibold uppercase text-light-text-muted dark:text-dark-text-muted mt-2 tracking-wider">
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CountdownTimer() {
  const [comps, setComps] = useState<Comp[]>([]);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/competitions')
      .then((r) => r.json())
      .then((d) => setComps((d.competitions || []).filter((c: Comp) => c.startDate)))
      .catch(() => setComps([]));
  }, []);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null || comps.length === 0) return null; // nothing to count down to yet

  return (
    <section className="relative z-20 -mt-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
      {comps.map((c) => (
        <TimerCard key={c._id} comp={c} now={now} />
      ))}
    </section>
  );
}
