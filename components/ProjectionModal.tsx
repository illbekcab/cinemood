
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Movie } from '../types';
import { getImageUrl } from '../services/tmdbService';

interface ProjectionModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export const ProjectionModal: React.FC<ProjectionModalProps> = ({ movie, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const lightRayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (movie) {
      const ctx = gsap.context(() => {
        // Entry animation
        gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
        gsap.fromTo(contentRef.current,
          { scale: 0.8, opacity: 0, y: 50 },
          { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "power4.out", delay: 0.2 }
        );

        // Flicker effect on the light ray
        gsap.to(lightRayRef.current, {
          opacity: 0.6,
          duration: 0.1,
          repeat: -1,
          yoyo: true,
          ease: "none",
          repeatRefresh: true
        });

        // Dust/Grain movement
        gsap.to(".dust-particle", {
          y: "random(-100, 100)",
          x: "random(-100, 100)",
          duration: "random(2, 4)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      });
      return () => ctx.revert();
    }
  }, [movie]);

  if (!movie) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl"
      onClick={onClose}
    >
      {/* Film Grain/Dust Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="dust-particle absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5
            }}
          />
        ))}
      </div>

      {/* Projector Light Ray */}
      <div
        ref={lightRayRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vw] h-screen pointer-events-none z-0 opacity-40"
        style={{
          background: 'conic-gradient(from 180deg at 50% 0%, transparent 160deg, rgba(255,255,255,0.1) 180deg, transparent 200deg)'
        }}
      />

      {/* The "Screen" */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-6xl w-full px-6 flex flex-col md:flex-row gap-12 items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative group shrink-0">
          <div className="absolute -inset-4 bg-white/5 blur-2xl rounded-xl"></div>
          <img
            src={getImageUrl(movie.poster_path, 'w780')}
            alt={movie.title}
            className="relative w-[300px] md:w-[450px] rounded-lg shadow-[0_0_50px_rgba(255,255,255,0.1)] border border-white/10"
          />
          {/* Projection flicker overlay */}
          <div className="absolute inset-0 bg-white/5 mix-blend-overlay animate-pulse pointer-events-none"></div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-5xl md:text-7xl font-serif mb-6 leading-tight glow-text">{movie.title}</h2>
          <div className="flex flex-wrap gap-4 mb-8 justify-center md:justify-start">
            <span className="px-3 py-1 border border-white/20 rounded-full text-xs uppercase tracking-widest font-bold">
              Released: {movie.release_date}
            </span>
            <span className="px-3 py-1 border border-white/20 rounded-full text-xs uppercase tracking-widest font-bold text-yellow-500">
              ★ {movie.vote_average.toFixed(1)}
            </span>
          </div>
          <p className="text-xl text-zinc-400 leading-relaxed font-light italic mb-12">
            "{movie.overview}"
          </p>
          <button
            onClick={onClose}
            className="px-12 py-4 border border-white hover:bg-white hover:text-black transition-all duration-500 uppercase tracking-[0.3em] text-sm font-bold"
          >
            Close Projection
          </button>
        </div>
      </div>
    </div>
  );
};
