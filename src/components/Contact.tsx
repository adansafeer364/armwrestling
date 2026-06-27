'use client';

import React from 'react';
import { Phone, MapPin, MessageCircle, ArrowUp } from 'lucide-react';

const WHATSAPP = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923278625085').replace(/[^0-9]/g, '');

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-light-bg dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-brand-primary uppercase">Get in Touch</span>
          <h2 className="text-3xl sm:text-5xl font-black text-light-text-main dark:text-dark-text-main uppercase tracking-tight">
            CONTACT US
          </h2>
          <p className="text-light-text-muted dark:text-dark-text-muted text-base sm:text-lg">
            Questions about the event? Reach the organizing team. To take part, register through your competition at the top of this page.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Contact details */}
          <div className="p-8 rounded-3xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-lg space-y-6">
            <h3 className="text-2xl font-black text-light-text-main dark:text-dark-text-main uppercase">Organizing Office</h3>
            <div className="space-y-4">
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm font-semibold text-light-text-main dark:text-dark-text-main hover:text-brand-primary">
                <MessageCircle className="h-5 w-5 text-[#25D366] flex-shrink-0" />
                <span>WhatsApp: 0327 8625085</span>
              </a>
              <div className="flex items-center gap-3 text-sm font-semibold text-light-text-main dark:text-dark-text-main">
                <Phone className="h-5 w-5 text-brand-primary flex-shrink-0" />
                <span>Call: 0327 8625085</span>
              </div>
              <div className="flex items-start gap-3 text-sm font-semibold text-light-text-main dark:text-dark-text-main">
                <MapPin className="h-5 w-5 text-brand-primary mt-0.5 flex-shrink-0" />
                <span>Mansehra, Khyber Pakhtunkhwa, Pakistan</span>
              </div>
            </div>
          </div>

          {/* How to register CTA */}
          <div className="p-8 rounded-3xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 shadow-lg flex flex-col justify-center">
            <h3 className="text-2xl font-black text-light-text-main dark:text-dark-text-main uppercase">Want to compete?</h3>
            <p className="text-sm text-light-text-muted dark:text-dark-text-muted mt-3 leading-relaxed">
              Registration is done per competition. Scroll to the top, pick the competition that is open for
              registration, and tap <span className="font-bold text-brand-primary">Register for this Competition</span> to
              fill the entry form. You can also register over WhatsApp.
            </p>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm bg-brand-primary text-white shadow-md glow-primary hover:bg-brand-primary/90 transition-all"
            >
              <ArrowUp className="h-4 w-4" />
              Go to Competitions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
