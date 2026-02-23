import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Navbar from './components/layout/Navbar';
import Hero from './components/features/Hero';
import WhatIsAlgoStorm from './components/features/WhatIsAlgoStorm';
import MorphTransition from './components/features/MorphTransition';
import Season1Recap from './components/features/Season1Recap';
import TeamsPage from './pages/TeamsPage';
import Footer from './components/layout/Footer';
import Loader from './components/ui/Loader';

gsap.registerPlugin(ScrollTrigger);

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isTeamsPage = location.pathname === '/teams';

  useEffect(() => {
    const lenis = new Lenis();

    // Sync Lenis smooth scroll with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  // Hide loader after one full animation cycle
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <ScrollToTop />
      <Loader hidden={!loading} />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Hero loading={loading} />
              <MorphTransition>
                <WhatIsAlgoStorm />
              </MorphTransition>
              <Season1Recap />
            </>
          } />
          <Route path="/teams" element={<TeamsPage />} />
        </Routes>
      </main>
      {!isTeamsPage && <Footer />}
    </>
  );
}

export default App;
