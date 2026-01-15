'use client';

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import About from './components/About';

import Contact from './components/Contact';
import Footer from './components/Footer';
import Background3DWrapper from './components/3d/Background3DWrapper';
import Loading3D from './components/3d/Loading3D';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Loading muncul setiap kali halaman dimuat
    // Jika ingin loading hanya muncul sekali, uncomment baris di bawah:
    // const hasLoadedBefore = typeof window !== 'undefined' && localStorage.getItem('hasLoaded');
    // if (hasLoadedBefore) {
    //   setIsLoading(false);
    //   setShowContent(true);
    // }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Uncomment untuk menyimpan status loading (hanya muncul sekali):
    // if (typeof window !== 'undefined') {
    //   localStorage.setItem('hasLoaded', 'true');
    // }
    // Small delay before showing content for smooth transition
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  };

  return (
    <main className="min-h-screen relative">
      {/* Loading Screen */}
      {isLoading && <Loading3D onComplete={handleLoadingComplete} />}
      
      {/* Main Content */}
      {showContent && (
        <>
          <Background3DWrapper />
          <div className="relative z-20">
            <Navbar />
            <Hero />
            <Services />
            <Portfolio />
            <About />

            <Contact />
            <Footer />
          </div>
        </>
      )}
    </main>
  );
}
