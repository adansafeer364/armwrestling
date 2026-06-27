'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight, Calendar, MapPin, Swords } from 'lucide-react';
import { formatPKR } from '@/lib/format';
import { useI18n } from '@/app/i18n';

interface Slide {
  _id: string;
  title: string;
  description?: string;
  bannerImage?: string;
  location: string;
  startDate: string;
  prizePool?: number;
}

export default function HeroCarousel() {
  const { t } = useI18n();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/competitions')
      .then((r) => r.json())
      .then((d) => setSlides(d.competitions || []))
      .catch(() => setSlides([]))
      .finally(() => setLoaded(true));
  }, []);

  const count = slides.length;
  const next = useCallback(() => setIndex((i) => (count ? (i + 1) % count : 0)), [count]);
  const prev = useCallback(() => setIndex((i) => (count ? (i - 1 + count) % count : 0)), [count]);

  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [count, next]);

  // Fallback when no competitions are open for registration.
  if (loaded && count === 0) {
    return (
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-dark-bg">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('/images/hero-bg.jpg')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/75 to-transparent" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-white uppercase">
            TITAN CLASH <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">2026</span>
          </h1>
          <p className="mt-4 text-gray-300 text-lg">{t('no_comps')}</p>
        </div>
      </section>
    );
  }

  const slide = slides[index];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-dark-bg">
      {/* Slides */}
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
            quality={70}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/80 to-dark-bg/40" />
        </div>
      ))}

      {/* Content for the active slide */}
      {slide && (
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
          <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full border border-brand-primary/30 bg-brand-primary/10 text-brand-primary text-xs sm:text-sm font-bold tracking-widest uppercase mb-6">
            <Swords className="h-4 w-4" />
            <span>{t('now_open')}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase max-w-4xl">
            {slide.title}
          </h1>

          {slide.description && (
            <p className="mt-4 max-w-2xl text-base sm:text-lg text-gray-300">{slide.description}</p>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-gray-200 text-sm">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-brand-primary" /> {slide.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-brand-primary" /> {new Date(slide.startDate).toLocaleDateString()}
            </span>
            {slide.prizePool ? (
              <span className="inline-flex items-center gap-1.5 text-green-400 font-semibold">
                {t('prize_pool')}: {formatPKR(slide.prizePool)}
              </span>
            ) : null}
          </div>

          <a
            href={`/register?tournament=${slide._id}`}
            className="mt-8 inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-full font-bold text-base bg-brand-primary hover:bg-brand-primary/90 text-white shadow-lg glow-primary transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span>{t('register_for_this')}</span>
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      )}

      {/* Controls */}
      {count > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
          >
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
