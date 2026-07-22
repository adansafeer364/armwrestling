'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import SlideCarousel from './SlideCarousel'; // Assuming SlideCarousel is in the same directory
import { createPalette } from '../lib/palette';

interface Venue {
  _id: string;
  title: string;
  location: string;
  mapAddress: string;
}

function MapCard({ v }: { v: Venue }) {
  const accent = createPalette(v.title).start;
  const q = encodeURIComponent(v.mapAddress);
  const embed = `https://maps.google.com/maps?q=${q}&z=15&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${q}`;

  return (
    <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-light-card dark:bg-dark-card shadow-lg flex flex-col">
      <div className="h-1.5 w-full" style={{ background: accent }} />
      <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-lg sm:text-xl font-bold text-light-text-main dark:text-dark-text-main truncate">{v.title}</h3>
        <p className="text-sm text-light-text-muted dark:text-dark-text-muted flex items-center gap-1.5 mt-1">
          <MapPin className="h-4 w-4 flex-shrink-0" style={{ color: accent }} />
          <span className="truncate">{v.location}</span>
        </p>
      </div>

      <iframe
        title={`Map — ${v.title}`}
        src={embed}
        className="w-full h-56 sm:h-72 border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />

      <div className="p-4 sm:p-5">
        <a
          href={directions}
          target="_blank"
          rel="noopener noreferrer"
          style={{ background: accent }}
          className="w-full inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-full font-bold text-sm text-white shadow-md hover:brightness-110 transition-all duration-300"
        >
          <Navigation className="h-4 w-4" />
          Get Directions on Google Maps
        </a>
      </div>
    </div>
  );
}

export default function VenueMaps() {
  const [venues, setVenues] = useState<Venue[]>([]);

  useEffect(() => {
    fetch('/api/competitions')
      .then((r) => r.json())
      .then((d) => setVenues((d.competitions || []).filter((c: Venue) => c.mapAddress && c.mapAddress.trim())))
      .catch(() => setVenues([]));
  }, []);

  if (venues.length === 0) return null; // only show when an admin has set a map location

  return (
    <section id="venue" className="py-16 sm:py-24 bg-light-bg dark:bg-dark-bg">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-3 sm:space-y-4">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-brand-primary uppercase">Find Us</span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-light-text-main dark:text-dark-text-main uppercase tracking-tight">
            Venue &amp; Location
          </h2>
          <p className="text-light-text-muted dark:text-dark-text-muted text-sm sm:text-lg">
            Where each competition takes place — tap the button to get directions.
          </p>
        </div>

        <SlideCarousel activeColor={(i) => createPalette(venues[i].title).start}>
          {venues.map((v) => (
            <MapCard key={v._id} v={v} />
          ))}
        </SlideCarousel>
      </div>
    </section>
  );
}
