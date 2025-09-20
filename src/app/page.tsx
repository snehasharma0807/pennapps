'use client';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Preview from '@/components/Preview';
import Footer from '@/components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Preview />
      <Footer />
    </div>
  );
}