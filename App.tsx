
import React, { useState, useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MoodInput } from './components/MoodInput';
import { MovieGallery } from './components/MovieGallery';
import { HistoryReel } from './components/HistoryReel';
import { ProjectionModal } from './components/ProjectionModal';
import { ProjectorTransition } from './components/ProjectorTransition';
import { FilmEffects } from './components/FilmEffects';
import { getRecommendations } from './services/api';
import { Movie, Recommendation } from './types';

gsap.registerPlugin(ScrollTrigger);

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [history, setHistory] = useState<Recommendation[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Section Transitions: Mechanical Shutter
    ScrollTrigger.create({
      trigger: ".history-section",
      start: "top bottom",
      end: "top center",
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set(".shutter-top", { height: `${p * 50}%` });
        gsap.set(".shutter-bottom", { height: `${p * 50}%` });
      },
      onLeave: () => {
        gsap.to([".shutter-top", ".shutter-bottom"], { height: 0, duration: 0.6, ease: "expo.inOut" });
      },
      onEnterBack: () => {
        gsap.to([".shutter-top", ".shutter-bottom"], { height: "50%", duration: 0.4, ease: "power2.inOut" });
      }
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  const handleSearch = async (mood: string) => {
    setIsLoading(true);
    try {
      const newRec = await getRecommendations(mood);

      setRecommendation(newRec);
      setHistory(prev => [newRec, ...prev]);

      setTimeout(() => {
        const projector = document.getElementById('projector-trigger');
        if (projector) {
          projector.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);

    } catch (error) {
      console.error("Discovery process failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <FilmEffects />

      {/* Header */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-10 py-8 flex justify-between items-center pointer-events-none">
        <div className="text-xl font-serif font-black tracking-tighter pointer-events-auto mix-blend-difference">CINÉMOOD</div>
        <div className="flex gap-12 pointer-events-auto">
          <button className="text-[9px] uppercase tracking-[0.4em] font-bold opacity-40 hover:opacity-100 transition-opacity">Archive</button>
          <button className="text-[9px] uppercase tracking-[0.4em] font-bold opacity-40 hover:opacity-100 transition-opacity">Manifesto</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
        <div className="relative z-10 text-center px-6">
          <div className="mb-8 opacity-20 uppercase tracking-[1.5em] text-[8px] font-bold">Atmosphere Detection Active</div>
          <h1 className="text-[14vw] md:text-[12vw] font-serif leading-[0.75] tracking-tighter mb-10 font-black">
            VISION<br />
            <span className="italic font-normal opacity-30">SEARCH</span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-500 text-lg md:text-xl font-light mb-16 tracking-wide leading-relaxed italic">
            Curating personal cinematic artifacts by observing the frequency of your emotion.
          </p>

          <MoodInput onSearch={handleSearch} isLoading={isLoading} />
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-10">
          <span className="text-[8px] uppercase tracking-[0.8em] font-bold">Explore Chronicles</span>
          <div className="w-[1px] h-20 bg-white"></div>
        </div>
      </section>

      {/* History Reel Section */}
      <div className="history-section relative z-20">
        <HistoryReel />
      </div>

      {/* Projector Transition */}
      <div id="projector-trigger" className="relative z-30">
        <ProjectorTransition />
      </div>

      {/* Recommendation Results */}
      <div id="results-gallery" className="relative z-10 min-h-screen">
        {recommendation ? (
          <MovieGallery
            movies={recommendation.movies}
            title={recommendation.mood.split(' ')[0].toUpperCase()}
            onMovieSelect={setSelectedMovie}
          />
        ) : (
          <div className="h-[80vh] flex items-center justify-center bg-zinc-950/20">
            <p className="text-zinc-900 font-serif text-3xl italic tracking-[0.5em] uppercase opacity-40">Observation pending...</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <ProjectionModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />

      {/* Footer */}
      <footer className="py-40 px-12 md:px-24 border-t border-white/5 bg-black relative z-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-32 items-end">
          <div>
            <h4 className="text-[9px] uppercase tracking-[0.8em] text-zinc-700 mb-16 font-bold">Past Chronicles</h4>
            <div className="space-y-10">
              {history.length > 0 ? history.slice(0, 4).map((h, i) => (
                <div key={i} className="group cursor-pointer flex items-baseline border-b border-white/5 pb-6">
                  <span className="text-zinc-800 font-mono mr-8 text-[10px]">FIX-{200 + i}</span>
                  <span className="text-3xl md:text-5xl hover:italic transition-all font-serif opacity-30 group-hover:opacity-100 group-hover:translate-x-4">"{h.mood}"</span>
                </div>
              )) : (
                <p className="text-zinc-900 font-serif italic uppercase tracking-[0.2em] text-sm">The vault is sealed.</p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-[12vw] font-serif font-black tracking-tighter leading-none opacity-[0.03] mb-12 pointer-events-none select-none">PROJECTOR</div>
            <p className="text-right text-zinc-700 max-w-sm mb-12 text-[10px] font-bold uppercase tracking-[0.4em] leading-loose">
              Artifacts of the Silver Screen. Curated for the modern observer. All rights reserved. 2024.
            </p>
            <div className="text-4xl font-serif font-black tracking-tighter italic hover:not-italic transition-all cursor-default">CinéMood.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
