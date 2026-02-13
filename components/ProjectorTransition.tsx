
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ProjectorTransition: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const irisRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(".projector-label", {
        opacity: 0,
        filter: "blur(20px)",
        duration: 0.3,
      })
      .to(lensRef.current, {
        scale: 25,
        duration: 1,
        ease: "power2.in",
      }, 0)
      .fromTo(irisRef.current, 
        { clipPath: "circle(0% at 50% 50%)" },
        { clipPath: "circle(150% at 50% 50%)", duration: 1.5, ease: "none" },
        0.4
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative h-screen w-full flex items-center justify-center bg-black overflow-hidden z-50"
    >
      <div className="projector-label absolute z-20 text-center pointer-events-none">
        <h2 className="text-white/20 font-serif text-[10px] tracking-[2em] uppercase mb-8">Synchronizing Frame</h2>
        <div className="text-6xl md:text-9xl font-serif italic text-white/5 tracking-tighter">THE REEL</div>
      </div>

      {/* Projector Lens Assembly */}
      <div 
        ref={lensRef}
        className="relative w-56 h-56 rounded-full border-[20px] border-zinc-900 bg-zinc-950 flex items-center justify-center shadow-[0_0_100px_rgba(255,255,255,0.02)]"
      >
        <div className="absolute inset-4 rounded-full border border-white/5"></div>
        <div className="w-4 h-4 bg-zinc-800 rounded-full shadow-inner"></div>
        
        {/* Pure White Light Source */}
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity"
             style={{ background: 'radial-gradient(circle at center, #fff 0%, transparent 70%)' }} />
      </div>

      {/* Iris Wipe Overlay */}
      <div 
        ref={irisRef}
        className="absolute inset-0 bg-zinc-900 pointer-events-none z-[60] mix-blend-overlay opacity-40"
      ></div>

      {/* Static Light Beam */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300vw] h-1 bg-white blur-[100px] rotate-[30deg]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300vw] h-1 bg-white blur-[100px] rotate-[-30deg]"></div>
      </div>
    </div>
  );
};
