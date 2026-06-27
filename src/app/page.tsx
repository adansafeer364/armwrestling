'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';
import IntroSplash from '../components/IntroSplash';
import HeroCarousel from '../components/HeroCarousel';
import TournamentBanner from '../components/TournamentBanner';
import CountdownTimer from '../components/CountdownTimer';

// Below-the-fold sections are code-split so the initial page payload is smaller
// and the hero renders/interactive sooner. They still server-render for SEO.
const About = dynamic(() => import('../components/About'));
const Benefits = dynamic(() => import('../components/Benefits'));
const WeightCategories = dynamic(() => import('../components/WeightCategories'));
const PrizePool = dynamic(() => import('../components/PrizePool'));
const TournamentFormat = dynamic(() => import('../components/TournamentFormat'));
const Schedule = dynamic(() => import('../components/Schedule'));
const Gallery = dynamic(() => import('../components/Gallery'));
const Sponsors = dynamic(() => import('../components/Sponsors'));
const Testimonials = dynamic(() => import('../components/Testimonials'));
const FAQ = dynamic(() => import('../components/FAQ'));
const VenueMaps = dynamic(() => import('../components/VenueMaps'));
const Contact = dynamic(() => import('../components/Contact'));
const Footer = dynamic(() => import('../components/Footer'));

export default function Home() {
  return (
    <div className="relative w-full min-h-screen bg-light-bg dark:bg-dark-bg text-light-text-main dark:text-dark-text-main transition-colors duration-300">
      {/* First-open welcome animation */}
      <IntroSplash />

      {/* Header / Navbar */}
      <Navbar />

      <main className="w-full">
        {/* Hero Carousel — competitions managed by admin */}
        <HeroCarousel />

        {/* Live Registration Info Banner */}
        <TournamentBanner />

        {/* Countdown Timer overlaying hero bottom */}
        <CountdownTimer />

        {/* About Event */}
        <About />

        {/* Benefits for Competitors */}
        <Benefits />

        {/* Weight Brackets & Divisions */}
        <WeightCategories />

        {/* Cash Prize Pool Distribution */}
        <PrizePool />

        {/* Tournament Format Rules */}
        <TournamentFormat />

        {/* Schedule of Events */}
        <Schedule />

        {/* Gallery */}
        <Gallery />

        {/* Event Partners / Sponsors */}
        <Sponsors />

        {/* Athlete Testimonials */}
        <Testimonials />

        {/* FAQ */}
        <FAQ />

        {/* Venue maps — one per tournament, set by admin */}
        <VenueMaps />

        {/* Contact and Registration form */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
