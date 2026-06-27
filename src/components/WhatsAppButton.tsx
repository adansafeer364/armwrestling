'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

// Floating WhatsApp contact button for public/viewer pages.
// Set the organizer's number in .env.local:
//   NEXT_PUBLIC_WHATSAPP_NUMBER="923001234567"   (country code, no +, no spaces)
export default function WhatsAppButton() {
  const pathname = usePathname();

  // Hide on staff dashboards / auth pages — this is for public viewers only.
  if (/^\/(admin|referee|login|unauthorized)/.test(pathname || '')) return null;

  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567').replace(/[^0-9]/g, '');
  const text = encodeURIComponent('Assalam o Alaikum! I want to ask about the armwrestling competition.');
  const href = `https://wa.me/${number}?text=${text}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all px-4 py-3"
    >
      <svg viewBox="0 0 32 32" className="w-6 h-6 fill-current" aria-hidden="true">
        <path d="M16.001 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.6 4.46 1.73 6.4L3.2 28.8l6.57-1.72a12.7 12.7 0 0 0 6.23 1.6h.01c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.33-6.64-3.75-9.06A12.7 12.7 0 0 0 16 3.2zm0 23.3h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-3.9 1.02 1.04-3.8-.25-.4a10.5 10.5 0 0 1-1.62-5.62c0-5.86 4.77-10.63 10.64-10.63 2.84 0 5.5 1.11 7.51 3.12a10.55 10.55 0 0 1 3.11 7.52c0 5.86-4.77 10.62-10.63 10.62zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.89-1.78-2.21-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.72-.98-2.35-.26-.62-.52-.54-.71-.55l-.61-.01c-.21 0-.55.08-.84.4-.29.32-1.1 1.08-1.1 2.63 0 1.55 1.13 3.05 1.29 3.26.16.21 2.22 3.39 5.38 4.76.75.32 1.34.51 1.8.66.76.24 1.44.21 1.98.13.6-.09 1.89-.77 2.16-1.52.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37z" />
      </svg>
      <span className="font-semibold text-sm hidden sm:inline">WhatsApp</span>
    </a>
  );
}
