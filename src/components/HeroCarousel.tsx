"use client";

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Calendar, MapPin, Trophy, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import BrandLogo from './BrandLogo';
import { formatPKR } from '@/lib/format';
import { createPalette } from '@/infrastructure/palette';
import Link from 'next/link';

interface Slide {
  _id: string;
  title: string;
  description?: string;
  bannerImage?: string;
  location?: string;
  startDate?: string;
  prizePool?: number;
  weightCategory?: string;
  status?: string;
}

const DEFAULT_SLIDES: Slide[] = [
  {
    _id: 's1',
    title: 'Titan Clash 2026',
    description: 'Two pullers. One table. Absolute domination.',
    location: 'Mansehra Sports Arena',
    startDate: new Date().toISOString(),
    prizePool: 150000,
    weightCategory: 'Open Championship',
  },
];

export default function HeroCarousel({ slides: propSlides }: { slides?: Slide[] }) {
  const [slidesState, setSlidesState] = useState<Slide[]>(propSlides && propSlides.length ? propSlides : []);
  const slides = slidesState.length ? slidesState : DEFAULT_SLIDES;
  const count = slides.length;
  const [index, setIndex] = useState(0);




  useEffect(() => {
    const id = setInterval(() => setIndex((s) => (s + 1) % count), 8000);
    return () => clearInterval(id);
  }, [count]);

  useEffect(() => {
    if (propSlides && propSlides.length) {
      return;
    }

    fetch('/api/competitions')
      .then((r) => r.json())
      .then((d) => {
        const comps = d?.competitions || [];
        if (comps.length) {
          setSlidesState(comps);
        }
      })
      .catch(() => { });
  }, [propSlides]);

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  const slide = slides[index];

  if (!slide) {
    return null;
  }

  const palette = createPalette(slide.title);
  const slideStyle = {
    backgroundImage: `radial-gradient(circle at 15% 20%, rgba(255,255,255,0.22), transparent 22%), radial-gradient(circle at 85% 18%, rgba(255,255,255,0.17), transparent 18%), linear-gradient(135deg, ${palette.start} 0%, ${palette.mid} 48%, ${palette.end} 100%)`,
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#050816] pt-24 sm:pt-20 min-h-screen">
      {slides.map((s, i) => {
        const paletteForSlide = createPalette(s.title);
        const slideBg = {
          backgroundImage: `radial-gradient(circle at 15% 20%, rgba(255,255,255,0.22), transparent 22%), radial-gradient(circle at 85% 18%, rgba(255,255,255,0.17), transparent 18%), linear-gradient(135deg, ${paletteForSlide.start} 0%, ${paletteForSlide.mid} 48%, ${paletteForSlide.end} 100%)`,
        };

        return (
          <div
            key={s._id}
            className={`my-20 absolute inset-0 transition-all duration-700 ${i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <div className="absolute inset-0 overflow-hidden bg-black">
              {/* Per-tournament ambient glow */}
              <div className="absolute inset-0" style={{ background: `radial-gradient(circle at center, ${paletteForSlide.start} 0%, transparent 60%)`, opacity: 0.16 }} />

              {/* Cube 1 */}
              <div
                className="absolute left-[18%] top-[18%] w-64 h-64"
                style={{
                  clipPath:
                    "polygon(30% 0%,100% 25%,70% 100%,0% 75%)",
                  background:
                    "linear-gradient(135deg,#0f172a,#000 60%)",
                  boxShadow:
                    "20px 20px 60px rgba(0,0,0,.9)"
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      `linear-gradient(135deg,transparent 55%,${paletteForSlide.start} 100%)`,
                    opacity: .85,
                    filter: "blur(8px)"
                  }}
                />
              </div>

              {/* Cube 2 */}
              <div
                className="absolute right-[15%] top-[30%] w-72 h-72"
                style={{
                  clipPath:
                    "polygon(20% 0%,100% 20%,80% 100%,0% 80%)",
                  background:
                    "linear-gradient(135deg,#111827,#000)",
                  boxShadow:
                    "30px 30px 70px rgba(0,0,0,.95)"
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      `linear-gradient(140deg,transparent 55%,${paletteForSlide.glow} 100%)`,
                    opacity: .8,
                    filter: "blur(10px)"
                  }}
                />
              </div>

              {/* Cube 3 */}
              <div
                className="absolute left-[12%] bottom-[12%] w-80 h-80"
                style={{
                  clipPath:
                    "polygon(25% 0%,100% 22%,75% 100%,0% 80%)",
                  background:
                    "linear-gradient(135deg,#0b1120,#000)",
                  boxShadow:
                    "25px 25px 80px rgba(0,0,0,.95)"
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      `linear-gradient(140deg,transparent 55%,${paletteForSlide.start} 100%)`,
                    opacity: .75,
                    filter: "blur(8px)"
                  }}
                />
              </div>

              {/* Soft per-tournament bloom */}
              <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[180px]" style={{ backgroundColor: paletteForSlide.glow, opacity: 0.12 }} />
            </div>

            <div className="relative z-10 flex min-h-[calc(100svh-5rem)] items-center justify-center px-4 sm:px-6 lg:px-8">
              <div className="w-full max-w-6xl">
                <div className="flex justify-center mb-6 sm:mb-8">
                  <BrandLogo animated showText className="justify-center" />
                </div>

                <motion.div
                  className="mx-auto max-w-5xl rounded-3xl sm:rounded-[2rem] border border-white/20 bg-white/10 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8 lg:p-12"
                >
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
                      <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                      {s.weightCategory || 'Featured Tournament'}
                    </span>
                    {s.status && (
                      <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                        {s.status.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 sm:mt-6 text-center">
                    <h1 className="text-2xl font-black uppercase tracking-tight text-white sm:text-5xl sm:tracking-[0.14em] lg:text-7xl break-words">
                      {s.title}
                    </h1>
                    {s.description && <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-white/85 sm:text-lg">{s.description}</p>}
                  </div>

                  <div className="mt-5 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-white/90 sm:gap-4">
                    {s.location && (
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-2">
                        <MapPin className="h-4 w-4 text-cyan-200" />
                        {s.location}
                      </span>
                    )}
                    {s.startDate && (
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-2">
                        <Calendar className="h-4 w-4 text-cyan-200" />
                        {new Date(s.startDate).toLocaleDateString()}
                      </span>
                    )}
                    {s.prizePool ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-2 text-emerald-200">
                        <Trophy className="h-4 w-4" />
                        Prize: {formatPKR(s.prizePool)}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-6 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                    <Link
                      href={`/register?tournament=${s._id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-slate-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100"
                    >
                      <span>Register Now</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <div className="rounded-full border border-white/20 bg-black/20 px-4 py-3 text-sm font-semibold text-white/80">
                      {s.weightCategory ? `Compete in ${s.weightCategory}` : 'Full event experience'}
                    </div>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        );
      })}

      {count > 1 && (
        <>
          <button onClick={prev} aria-label="Previous" className="absolute left-4 top-3/5 z-20 -translate-y-1/2 md:rounded-full md:border md:border-white/20 md:bg-white/10 md:p-2 text-white backdrop-blur-sm transition hover:bg-white/20">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button onClick={next} aria-label="Next" className="absolute right-4 top-3/5 z-20 -translate-y-1/2 md:rounded-full md:border md:border-white/20 md:bg-white/10 md:p-2 text-white backdrop-blur-sm transition hover:bg-white/20">
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((s, i) => (
              <button
                key={s._id}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2.5 rounded-full transition-all ${i === index ? 'w-8 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#050816] to-transparent" />
    </section>
  );
}
