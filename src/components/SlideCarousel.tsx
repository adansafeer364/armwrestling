'use client';

import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function SlideCarousel({
  children,
  activeColor,
}: {
  children: React.ReactNode;
  activeColor?: (i: number) => string;
}) {
  const slides = React.Children.toArray(children);
  const n = slides.length;

  const [i, setI] = useState(0);
  const touchX = useRef<number | null>(null);

  if (n === 0) return null;
  if (n === 1) return <>{slides[0]}</>;

  const go = (d: number) => {
    setI((p) => (p + d + n) % n);
  };

  const arrowClass =
    'grid place-items-center h-9 w-9 rounded-full bg-white/90 dark:bg-dark-card border border-gray-200 dark:border-gray-700 shadow text-light-text-main dark:text-dark-text-main hover:scale-105 active:scale-95 transition flex-shrink-0';

  return (
    <div>
      {/* Slides */}
      <div
        className="relative min-h-[350px] overflow-hidden"
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;

          const dx =
            e.changedTouches[0].clientX - touchX.current;

          if (Math.abs(dx) > 40) {
            go(dx < 0 ? 1 : -1);
          }

          touchX.current = null;
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`
              transition-opacity duration-300 ease-in-out
              ${index === i
                ? 'opacity-100 relative'
                : 'opacity-0 absolute inset-0 pointer-events-none'
              }
            `}
          >
            {slide}
          </div>
        ))}
      </div>


      {/* Controls */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 mt-5">

        {/* Previous */}
        <button
          onClick={() => go(-1)}
          aria-label="Previous"
          className={arrowClass}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>


        {/* Dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, d) => (
            <button
              key={d}
              onClick={() => setI(d)}
              aria-label={`Go to slide ${d + 1}`}
              style={
                d === i && activeColor
                  ? {
                    backgroundColor: activeColor(d),
                  }
                  : undefined
              }
              className={`
  h-2.5 rounded-full 
  transition-[width,background-color] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
  ${d === i
                  ? 'w-8 bg-brand-primary'
                  : 'w-2.5 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400'
                }
`}
            />
          ))}
        </div>


        {/* Next */}
        <button
          onClick={() => go(1)}
          aria-label="Next"
          className={arrowClass}
        >
          <ChevronRight className="h-5 w-5" />
        </button>

      </div>
    </div>
  );
}