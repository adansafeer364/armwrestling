'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Tag } from 'lucide-react';

const EVENTS = {
  day1: [
    { time: '08:00 AM - 11:00 AM', title: 'Official Athlete Registration & Weigh-Ins', location: 'Grand Hall B', category: 'Registration' },
    { time: '12:00 PM - 12:30 PM', title: 'Rules Briefing & Press Conference', location: 'Main Arena Stage', category: 'Briefing' },
    { time: '01:00 PM - 05:00 PM', title: 'Preliminary Qualifying Rounds (Left & Right)', location: 'Tables 1 - 4', category: 'Qualifying' },
    { time: '06:00 PM - 08:00 PM', title: 'Undercard Supermatches', location: 'Center Arena Ring', category: 'Supermatches' }
  ],
  day2: [
    { time: '09:00 AM - 12:00 PM', title: 'Quarter-Finals & Semi-Finals (Left Hand)', location: 'Center Arena Ring', category: 'Tournament' },
    { time: '01:00 PM - 04:00 PM', title: 'Quarter-Finals & Semi-Finals (Right Hand)', location: 'Center Arena Ring', category: 'Tournament' },
    { time: '05:00 PM - 07:00 PM', title: 'Grand Finals & Title Belt Contenders', location: 'Main Stage Table', category: 'Championship' },
    { time: '07:30 PM - 09:00 PM', title: 'Closing Ceremonies & Prize Distribution', location: 'Main Arena Stage', category: 'Ceremony' }
  ]
};

export default function Schedule() {
  const [activeDay, setActiveDay] = useState<'day1' | 'day2'>('day1');

  return (
    <section id="schedule" className="py-24 bg-white dark:bg-dark-card border-y border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-brand-primary uppercase">
            Schedule of Events
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-light-text-main dark:text-dark-text-main uppercase tracking-tight">
            TOURNAMENT TIMELINE
          </h2>
          <p className="text-light-text-muted dark:text-dark-text-muted text-base sm:text-lg">
            Make sure you do not miss any major weigh-in, preliminary draw, or championship match.
          </p>
        </div>

        {/* Day Toggle Buttons */}
        <div className="flex justify-center space-x-4 mb-12">
          <button
            onClick={() => setActiveDay('day1')}
            className={`px-8 py-3.5 rounded-full font-bold text-sm transition-all border ${
              activeDay === 'day1'
                ? 'bg-brand-primary border-brand-primary text-white shadow-lg glow-primary'
                : 'bg-white dark:bg-dark-card border-gray-200 dark:border-gray-800 text-light-text-muted dark:text-dark-text-muted hover:border-brand-primary'
            }`}
          >
            Day 1 - Setup & Prelims
          </button>
          <button
            onClick={() => setActiveDay('day2')}
            className={`px-8 py-3.5 rounded-full font-bold text-sm transition-all border ${
              activeDay === 'day2'
                ? 'bg-brand-primary border-brand-primary text-white shadow-lg glow-primary'
                : 'bg-white dark:bg-dark-card border-gray-200 dark:border-gray-800 text-light-text-muted dark:text-dark-text-muted hover:border-brand-primary'
            }`}
          >
            Day 2 - Finals & Ceremony
          </button>
        </div>

        {/* Timeline list */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, x: activeDay === 'day1' ? -15 : 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeDay === 'day1' ? 15 : -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 relative before:absolute before:inset-y-0 before:left-4 sm:before:left-1/2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800"
            >
              {EVENTS[activeDay].map((event, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div key={idx} className={`relative flex flex-col sm:flex-row items-start sm:items-center ${isEven ? 'sm:flex-row-reverse' : ''}`}>
                    
                    {/* Time dot indicator */}
                    <div className="absolute left-4 sm:left-1/2 h-4 w-4 rounded-full bg-brand-primary border-4 border-white dark:border-dark-card transform -translate-x-[7px] sm:-translate-x-2 z-10"></div>
                    
                    {/* Content Card */}
                    <div className="w-full sm:w-[calc(50%-2rem)] ml-10 sm:ml-0">
                      <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800/80 shadow-sm hover:shadow-md transition-shadow">
                        
                        {/* Time & Badge */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <div className="flex items-center space-x-1 text-xs font-bold text-brand-primary">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{event.time}</span>
                          </div>
                          <span className="text-[10px] font-extrabold uppercase bg-gray-250 dark:bg-gray-800 px-2.5 py-0.5 rounded-md text-light-text-muted dark:text-dark-text-muted flex items-center gap-1">
                            <Tag className="h-2.5 w-2.5" />
                            {event.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-lg font-black text-light-text-main dark:text-dark-text-main leading-tight mb-2">
                          {event.title}
                        </h4>

                        {/* Venue */}
                        <div className="flex items-center space-x-1 text-xs font-semibold text-light-text-muted dark:text-dark-text-muted">
                          <MapPin className="h-3.5 w-3.5 opacity-80" />
                          <span>{event.location}</span>
                        </div>

                      </div>
                    </div>

                    {/* Spacer for empty side on desktop */}
                    <div className="hidden sm:block w-[calc(50%-2rem)]"></div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
