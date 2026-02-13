
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Movie } from '../types';
import { getImageUrl } from '../services/tmdbService';

gsap.registerPlugin(ScrollTrigger);

interface MovieGalleryProps {
  movies: Movie[];
  title: string;
  onMovieSelect: (movie: Movie) => void;
}

export const MovieGallery: React.FC<MovieGalleryProps> = ({ movies, title, onMovieSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (movies.length === 0) return;

    const ctx = gsap.context(() => {
      const horizontalScrollLength = containerRef.current!.scrollWidth - window.innerWidth;

      gsap.to(containerRef.current, {
        x: -horizontalScrollLength,
        ease: "none",
        scrollTrigger: {
          trigger: triggerRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${horizontalScrollLength}`,
          invalidateOnRefresh: true,
        }
      });
    });

    return () => ctx.revert();
  }, [movies]);

  if (movies.length === 0) return null;

  return (
    <div ref={triggerRef} className="overflow-hidden bg-[#050505]">
      <div ref={sectionRef} className="h-screen flex items-center relative">
        <div className="absolute top-20 left-12 md:left-24 z-10 pointer-events-none">
          <h2 className="text-5xl md:text-8xl font-serif font-light leading-none opacity-20 uppercase tracking-tighter">
            {title}
          </h2>
        </div>
        
        <div 
          ref={containerRef} 
          className="flex gap-20 px-12 md:px-24 h-full items-center will-change-transform"
        >
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className="flex-shrink-0 w-[300px] md:w-[500px] group relative cursor-pointer"
              onClick={() => onMovieSelect(movie)}
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-2xl transition-all duration-700 group-hover:scale-[1.05] group-hover:-rotate-1">
                <img 
                  src={getImageUrl(movie.poster_path, 'w780')} 
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <div className="mb-4">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-1 block">Selected Scene</span>
                    <h3 className="text-3xl font-serif glow-text">{movie.title}</h3>
                  </div>
                  <p className="text-zinc-300 text-sm line-clamp-3 mb-6 font-light leading-relaxed">{movie.overview}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                      Rating: {movie.vote_average.toFixed(1)}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white group-hover:underline underline-offset-4">
                      Project Selection
                    </span>
                  </div>
                </div>
                
                {/* Film frame corner highlights */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          ))}
          
          {/* Spacer for ending */}
          <div className="flex-shrink-0 w-[400px] text-center">
            <h4 className="text-zinc-800 font-serif text-5xl uppercase italic select-none">End Reel</h4>
          </div>
        </div>
      </div>
    </div>
  );
};
