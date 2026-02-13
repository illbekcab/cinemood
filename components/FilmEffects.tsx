
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const FilmEffects: React.FC = () => {
  const lightLeakRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Global Flicker
    gsap.to(lightLeakRef.current, {
      opacity: 0.1,
      duration: 0.05,
      repeat: -1,
      yoyo: true,
      ease: "none"
    });

    // Random White Flashes on Scroll (Silver Nitrate style)
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (Math.random() > 0.98 && Math.abs(self.getVelocity()) > 500) {
          gsap.fromTo(".silver-flash", 
            { opacity: 0, scale: 0.9 }, 
            { 
              opacity: 0.2, 
              scale: 1.1, 
              duration: 0.1, 
              ease: "none", 
              yoyo: true, 
              repeat: 1 
            }
          );
        }
      }
    });
  }, []);

  return (
    <>
      {/* Mechanical Shutter Layers */}
      <div className="fixed inset-0 pointer-events-none z-[150] flex flex-col">
        <div className="shutter-top w-full h-0 bg-black border-b border-white/5"></div>
        <div className="shutter-bottom w-full h-0 bg-black mt-auto border-t border-white/5"></div>
      </div>

      {/* Silver Nitrate Flash Effect */}
      <div 
        ref={lightLeakRef}
        className="silver-flash fixed inset-0 pointer-events-none z-[160] opacity-0 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, transparent 60%)',
          filter: 'blur(100px)'
        }}
      />

      {/* Persistent Film Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[170] opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/p6.png')] contrast-150"></div>
      
      {/* Vignette */}
      <div className="fixed inset-0 pointer-events-none z-[180] shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]"></div>
    </>
  );
};
