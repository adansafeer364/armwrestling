"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight, Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import BrandLogo from './BrandLogo';
import { formatPKR } from '@/lib/format';

interface Slide {
  _id: string;
  title: string;
  description?: string;
  bannerImage?: string;
  location?: string;
  startDate?: string;
  prizePool?: number;
}

const DEFAULT_SLIDES: Slide[] = [
  {
    _id: 's1',
    title: 'Titan Clash 2026',
    description: 'Two pullers. One table. Absolute domination.',
    bannerImage: '/images/hero-bg.jpg',
    location: 'Mansehra Sports Arena',
    startDate: new Date().toISOString(),
    prizePool: 150000,
  },
];

export default function HeroCarousel({ slides: propSlides }: { slides?: Slide[] }) {
  const [slidesState, setSlidesState] = useState<Slide[]>(propSlides && propSlides.length ? propSlides : []);
  const [loaded, setLoaded] = useState(false);
  const slides = slidesState.length ? slidesState : DEFAULT_SLIDES;
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [showSlideText, setShowSlideText] = useState(true);

  useEffect(() => {
    // show text when slide changes, then hide after 5s
    setShowSlideText(true);
    const t = setTimeout(() => setShowSlideText(false), 5000);
    return () => clearTimeout(t);
  }, [index]);

  useEffect(() => {
    // auto-advance every 8s
    const id = setInterval(() => setIndex((s) => (s + 1) % count), 8000);
    return () => clearInterval(id);
  }, [count]);

  useEffect(() => {
    // If no slides were provided via props, fetch competitions from API
    if (propSlides && propSlides.length) {
      setLoaded(true);
      return;
    }

    fetch('/api/competitions')
      .then((r) => r.json())
      .then((d) => {
        const comps = d?.competitions || [];
        if (comps && comps.length) setSlidesState(comps);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [propSlides]);

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  const slide = slides[index];
  const isBrochure = !!slide?.bannerImage && slide.bannerImage.toLowerCase().includes('brochure');

  return (
    <section className="relative w-full overflow-hidden bg-dark-bg pt-20 min-h-screen">
      {slides.map((s, i) => (
        <div
          key={s._id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <Image
            src={s.bannerImage || '/images/hero-bg.jpg'}
            alt={s.title}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-contain object-center sm:object-cover"
          />

          {/* overlay: lighten when brochure to keep text readable */}
          <div
            aria-hidden
            className={`absolute inset-0 ${isBrochure ? 'bg-black/18' : 'bg-gradient-to-t from-dark-bg via-dark-bg/45 to-dark-bg/18'}`}
          />

          <div className="relative z-10 flex items-center justify-center h-full px-4">
            <div className="max-w-4xl w-full text-center">
              <div className="flex justify-center mb-6">
                <BrandLogo animated showText className="justify-center" />
              </div>

              <div className="relative inline-block">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showSlideText ? 0.6 : 0 }}
                  transition={{ duration: 0.45 }}
                  className="absolute -inset-2 rounded-xl bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={showSlideText ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.45 }}
                  className="relative z-10 px-6 py-6 sm:px-8 sm:py-8 rounded-xl mx-auto text-center text-white"
                >
                  <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight uppercase">
                    {s.title}
                  </h1>

                  {s.description && <p className="mt-4 max-w-2xl text-base sm:text-lg mx-auto">{s.description}</p>}

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-4 font-black text-sm">
                    {s.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-brand-primary" /> {s.location}
                      </span>
                    )}
                    {s.startDate && (
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-brand-primary" /> {new Date(s.startDate).toLocaleDateString()}
                      </span>
                    )}
                    {s.prizePool ? (
                      <span className="inline-flex items-center gap-1.5 text-green-400 font-semibold">Prize: {formatPKR(s.prizePool)}</span>
                    ) : null}
                  </div>

                  {/* Register CTA removed from timed block so it stays visible */}
                </motion.div>
              </div>
            </div>
          </div>
          {/* Persistent Register CTA (always visible) */}
          <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-30">
            <a
              href={`/register?tournament=${s._id}`}
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-full font-bold text-base bg-brand-primary hover:bg-brand-primary/90 text-white shadow-lg transition-all duration-300"
            >
              <span>Register</span>
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      ))}

      {/* Controls */}
      {count > 1 && (
        <>
          <button onClick={prev} aria-label="Previous" className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button onClick={next} aria-label="Next" className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm">
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s._id}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2.5 rounded-full transition-all ${i === index ? 'w-8 bg-brand-primary' : 'w-2.5 bg-white/40 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark-bg to-transparent" />
    </section>
  );
}
