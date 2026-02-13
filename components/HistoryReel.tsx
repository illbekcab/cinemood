
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CINEMA_ERAS = [
  {
    year: "1895",
    title: "The Birth of Light",
    description: "The Lumière brothers project the first moving pictures. Cinema is born as a spectacle of motion.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop"
  },
  {
    year: "1927",
    title: "The Sound of Talkies",
    description: "The Jazz Singer breaks the silence forever. A new dimension of storytelling emerges through synchronized sound.",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop"
  },
  {
    year: "1939",
    title: "Technicolor Dreams",
    description: "The Wizard of Oz and Gone with the Wind prove that the future of cinema is a vibrant, colorful world.",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop"
  },
  {
    year: "1960",
    title: "The New Wave",
    description: "French New Wave directors break all rules. Editing becomes rhythmic, and stories become personal and raw.",
    image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop"
  },
  {
    year: "1977",
    title: "The Blockbuster",
    description: "Star Wars transforms cinema into a cultural phenomenon. High-concept spectacles dominate the global box office.",
    image: "https://images.unsplash.com/photo-1598897349489-0aa2968b2747?q=80&w=2070&auto=format&fit=crop"
  },
  {
    year: "2024",
    title: "Digital Evolution",
    description: "AI and immersive tech redefine the boundaries. Cinema is no longer watched; it is experienced.",
    image: "https://images.unsplash.com/photo-1535016120720-40c646bebbbb?q=80&w=2070&auto=format&fit=crop"
  }
];

const Sprockets = () => (
  <div className="flex gap-4 px-4 py-2 bg-black border-y border-white/5">
    {Array.from({ length: 20 }).map((_, i) => (
      <div key={i} className="w-8 h-10 bg-[#0a0a0a] rounded-sm shrink-0 shadow-[inset_0_0_10px_rgba(255,255,255,0.05)] border border-white/10"></div>
    ))}
  </div>
);

export const HistoryReel: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reelWidth = reelRef.current!.scrollWidth;
      const amountToScroll = reelWidth - window.innerWidth;

      gsap.to(reelRef.current, {
        x: -amountToScroll,
        ease: "none",
        scrollTrigger: {
          trigger: triggerRef.current,
          pin: true,
          scrub: 0.5,
          start: "top top",
          end: () => `+=${amountToScroll}`,
          invalidateOnRefresh: true,
        },
      });

      // Rhythmic flicker effect to simulate projector light
      gsap.to(".film-cell", {
        filter: "brightness(1.1)",
        duration: 0.05,
        repeat: -1,
        yoyo: true,
        ease: "none",
        stagger: {
          amount: 0.2,
          from: "random"
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={triggerRef} className="relative overflow-hidden bg-[#020202] py-0">
      <div ref={sectionRef} className="h-screen flex items-center relative overflow-hidden">
        
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 pointer-events-none z-40 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="absolute inset-0 z-50 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,0.9)]"></div>

        {/* Content Reel - Continuous Strip */}
        <div ref={reelRef} className="flex h-full items-center pl-[10vw] pr-[10vw] will-change-transform bg-[#050505]">
          {CINEMA_ERAS.map((era, index) => (
            <div key={index} className="film-cell flex-shrink-0 w-[85vw] md:w-[60vw] h-[80vh] flex flex-col justify-between border-x border-white/10 bg-[#080808] group relative">
              
              {/* Top Perforations */}
              <Sprockets />

              {/* Main Frame Content */}
              <div className="flex-1 flex flex-col md:flex-row gap-12 p-8 md:p-16 items-center relative overflow-hidden">
                {/* Frame Numbering / Technical Markings */}
                <div className="absolute top-4 left-8 text-[10px] font-mono text-zinc-600 tracking-widest uppercase">
                  Safety Film | KODAK | {index + 10}A
                </div>
                <div className="absolute bottom-4 right-8 text-[10px] font-mono text-zinc-600 tracking-widest uppercase">
                  {era.year} | FPS 24 | SCENE {index + 1}
                </div>

                <div className="relative shrink-0 w-full md:w-1/2 aspect-video group-hover:shadow-[0_0_100px_rgba(255,255,255,0.05)] transition-shadow duration-700">
                  <span className="text-[15vw] font-serif font-black opacity-5 absolute -top-[5vw] -left-[4vw] pointer-events-none select-none italic z-0">
                    {era.year}
                  </span>
                  <div className="w-full h-full overflow-hidden rounded-sm border-2 border-zinc-900 relative">
                    <img 
                      src={era.image} 
                      alt={era.title} 
                      className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[2000ms] grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100" 
                    />
                    {/* Vignette within the frame */}
                    <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]"></div>
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl md:text-6xl font-serif mb-6 leading-none tracking-tighter glow-text opacity-70 group-hover:opacity-100 transition-opacity duration-700">
                    {era.title}
                  </h3>
                  <p className="text-zinc-500 text-base md:text-lg max-w-sm font-light leading-relaxed group-hover:text-zinc-300 transition-colors duration-700">
                    {era.description}
                  </p>
                  
                  {/* Progress bar line between frames */}
                  <div className="mt-12 h-[1px] w-0 group-hover:w-full bg-gradient-to-r from-white/20 to-transparent transition-all duration-1000"></div>
                </div>
              </div>

              {/* Bottom Perforations */}
              <Sprockets />
            </div>
          ))}

          {/* End of Reel Mark */}
          <div className="flex-shrink-0 w-[40vw] h-[80vh] flex flex-col justify-center items-center border-l border-white/10 bg-black">
            <div className="w-24 h-24 border-2 border-zinc-900 rounded-full flex items-center justify-center opacity-20">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <h4 className="mt-8 text-zinc-800 font-serif text-3xl uppercase tracking-[0.5em] italic">Leader</h4>
          </div>
        </div>

        {/* Vertical Reel Number Labels (Static Overlay) */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col gap-4 opacity-10 pointer-events-none z-50">
           {Array.from({ length: 5 }).map((_, i) => (
             <span key={i} className="text-xl font-mono">0{i+1}</span>
           ))}
        </div>
      </div>
    </div>
  );
};
