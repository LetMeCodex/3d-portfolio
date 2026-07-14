import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SOUNDS = {
  CAP: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/cap-gun.mp3",
  HORN: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/horn.mp3",
  SAD: "https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3", 
};

const PRANK_MESSAGES = [
  "Prank You!! 😂 This Bee resembles Disha, why would you shoot her?",
  "Ouch! Just kidding, it's a prank! 😂",
  "Nice shot! But you can't kill a digital bee! 🐝✨",
  "Missed me! Wait, that's a flag... 😂",
  "Disha would be disappointed in your aim! 🍯✨",
  "BANG! Gotcha! No bees were harmed. 😂",
  "Stop it! 😂 I'm just a messenger!",
  "Are you still trying? It's a fake gun! 🔫🤡",
  "You're persistent! But I'm too cute to die. 🐝❤️",
];

export function BeeTraveler() {
  const containerRef = useRef<HTMLDivElement>(null);
  const msgTextRef = useRef<HTMLParagraphElement>(null);
  
  const shotCountRef = useRef(0);
  const isPrankedRef = useRef(false);
  const isDeadRef = useRef(false);

  const audioCapRef = useRef<HTMLAudioElement | null>(null);
  const audioHornRef = useRef<HTMLAudioElement | null>(null);
  const audioSadRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioCapRef.current = new Audio(SOUNDS.CAP);
    audioHornRef.current = new Audio(SOUNDS.HORN);
    audioSadRef.current = new Audio(SOUNDS.SAD);

    const ctx = gsap.context(() => {
      gsap.set("#bee-container", { 
        position: 'fixed',
        left: "20%", top: "25%",
        xPercent: -50, yPercent: -50,
        zIndex: 9999
      });
      
      gsap.set("#bee", { transformOrigin: "50% 50%", scaleX: -1 });
      gsap.set(".gun-flag", { scaleY: 0, transformOrigin: "top center" });
      gsap.set(".gun-post", { scaleX: 0, transformOrigin: "left center" });

      ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        onUpdate: self => {
          if (isDeadRef.current) return;
          const p = self.progress;
          const startX = 14; 
          const startY = 16;
          const x = startX + (Math.sin(p * Math.PI * 4) * 25) + (p * 40); 
          const y = startY + (p * 65) + (Math.cos(p * Math.PI * 3) * 10);
          
          gsap.to("#bee-container", {
            left: `${Math.max(10, Math.min(90, x))}%`,
            top: `${Math.max(10, Math.min(90, y))}%`,
            duration: 0.1,
            overwrite: "auto"
          });

          const isFlipped = self.direction === 1;
          gsap.to("#bee", { 
            rotation: Math.sin(p * Math.PI * 12) * 8 + (isFlipped ? 5 : -5), 
            scaleX: isFlipped ? -1 : 1,
            duration: 0.4
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleBeeClick = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (isPrankedRef.current || isDeadRef.current) return;

    shotCountRef.current += 1;
    isPrankedRef.current = true;
    
    if (shotCountRef.current < 10) {
      if (audioCapRef.current) { audioCapRef.current.currentTime = 0; audioCapRef.current.play().catch(() => {}); }
      if (audioHornRef.current) { audioHornRef.current.currentTime = 0; audioHornRef.current.play().catch(() => {}); }
      if (msgTextRef.current) msgTextRef.current.innerText = PRANK_MESSAGES[shotCountRef.current - 1];
      
      const tl = gsap.timeline();
      tl.to(".bee-bubble", { width: "220px", opacity: 1, duration: 0.3 })
        .to(".gun-post", { scaleX: 1, duration: 0.2 }, "-=0.2")
        .to(".gun-flag", { scaleY: 1, duration: 0.3, ease: "elastic.out(1, 0.3)" }, "-=0.1");

      gsap.delayedCall(2, () => {
        tl.reverse();
        gsap.delayedCall(0.5, () => {
          isPrankedRef.current = false;
          if (msgTextRef.current) msgTextRef.current.innerText = "Shoot Me?";
          gsap.set(".bee-bubble", { width: "auto" });
        });
      });
    } else {
      isDeadRef.current = true;
      if (audioSadRef.current) audioSadRef.current.play().catch(() => {});
      if (msgTextRef.current) msgTextRef.current.innerText = "Bye... 🥺💔";
      
      const tl = gsap.timeline();
      tl.to("#bee", { rotation: 180, scale: 0.7, duration: 0.5, ease: "back.out(2)" });
      tl.to("#bee-container", { 
        top: "120vh", 
        left: "+=15%", 
        rotation: 720, 
        duration: 3.5, 
        ease: "power1.in" 
      }, 0.3);

      tl.to(".bee-bubble", { opacity: 0, y: -50, duration: 1.5 }, 0.5);
      // Increased opacity for the dead state
      tl.to("#bee", { opacity: 0.6, filter: "grayscale(40%) contrast(1.2)", duration: 3 }, 1);

      tl.set("#bee-container", { position: "absolute", top: "calc(100% - 100px)", left: "50%" });
      tl.to("#bee", { opacity: 0.5, duration: 2 });
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-[9999]">
      <div 
        id="bee-container" 
        className="pointer-events-auto flex flex-col items-center cursor-crosshair group" 
        onClick={handleBeeClick}
        style={{ width: '250px', height: '150px', justifyContent: 'center' }}
      >
        <div className="bee-bubble mb-3 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-black/10 shadow-xl transition-all duration-300 opacity-80">
          <p ref={msgTextRef} className="text-[11px] font-bold uppercase tracking-wider text-[#1c2135] leading-tight text-center m-0">
            Shoot Me?
          </p>
        </div>
        
        <div className="relative pointer-events-none">
          <div className="absolute top-0 left-full ml-2 flex items-start origin-left z-20">
            <div className="gun-post w-[40px] h-[2px] bg-gray-800 rounded-full mt-2 shadow-sm" />
            <div className="gun-flag bg-red-600 px-3 py-1 border-2 border-white shadow-lg -ml-1 flex items-center justify-center">
              <span className="text-white font-black text-[14px] italic whitespace-nowrap">BANG!</span>
            </div>
          </div>

          <svg id="bee" className="overflow-visible w-[48px] h-[48px] transition-transform duration-500 group-hover:scale-110" viewBox="0 0 89 72">
            <g>
              <path d="M24.057,55.335c-7.948,5.428-11.332,14.306-7.56,19.829s13.273,5.6,21.22.172,11.332-14.306,7.56-19.829-13.273-5.6-21.22-.172" transform="translate(-11.365 -38.999)" fill="#f4bb01"/>
              <path d="M157.5,150.972c2.7-9.9-6.786-21.1-21.182-25.025s-28.253.919-30.95,10.816,6.786,21.1,21.182,25.025,28.253-.919,30.95-10.816" transform="translate(-79.734 -94.686)" fill="#f4bb01"/>
              <path d="M146.889,177.281s1.339-19.463,19.962-22.318" transform="translate(-111.637 -117.774)" fill="#f4bb01"/>
              <path d="M234.862,212.262s-6.479-13.1,4.49-21.97" transform="translate(-177.054 -144.624)" fill="#f4bb01"/>
              <path d="M190.35,61.76c-1.181,10.465,3.757,19.615,11.029,20.436s14.126-7,15.307-17.463S212.93,45.118,205.657,44.3s-14.126,7-15.307,17.463" transform="translate(-144.536 -33.621)" fill="#f4bb01"/>
              <path d="M216.247,95.353c-10.069,3.089-16.491,11.265-14.344,18.262s12.049,10.165,22.118,7.076,16.491-11.265,14.344-18.262-12.049-10.165-22.118-7.076" transform="translate(-153.134 -71.57)" fill="#f4bb01"/>
              <path d="M86.5,55.229a17.228,17.228,0,0,1-4.724-1.091,17.651,17.651,0,0,0-.645-6.232,23.879,23.879,0,0,0,4.336-4.227c3.459-4.4,4.6-9.332,3.2-13.876s-5.1-7.987-10.433-9.693a23.008,23.008,0,0,0-3.679-.842,23.054,23.054,0,0,0-1.586-3.7c-2.66-4.928-6.725-7.935-11.449-8.469s-9.357,1.492-13.049,5.7A27.053,27.053,0,0,1,42.4,26.543a33.332,33.332,0,0,0-4.365.8C39.7,22.664,39.288,18,36.885,14.477c-2.352-3.444-6.422-5.508-11.243-5.737-.9-2.254-3.321-6.9-8.276-8.331C13.03-.843,8.265.779,3.2,5.227a3.6,3.6,0,0,0,4.753,5.408c3-2.636,5.627-3.813,7.4-3.314A5.314,5.314,0,0,1,18.1,9.757a27.6,27.6,0,0,0-7.443,3.606A25.351,25.351,0,0,0,1.153,24.932C-.681,29.741-.314,34.575,2.158,38.195S9,43.915,14.146,43.956h.162a23.034,23.034,0,0,0,7.521-1.33c-.979,5.528.849,11.34,5.24,16.527a37.576,37.576,0,0,0,18.8,11.42,41.586,41.586,0,0,0,10.9,1.492,34.1,34.1,0,0,0,10.273-1.519c2.755-.572,8.829-3.2,19.9-14.04a.747.747,0,0,0-.444-1.278M60.718,14.253c2.515.284,4.653,2.2,6.085,5.034a30.848,30.848,0,0,0-4.746,1.054,28.717,28.717,0,0,0-11.038,6.209q-.644-.072-1.286-.122c1.5-7.293,6.234-12.709,10.985-12.176M8.1,34.134c-2.6-3.809.429-10.6,6.618-14.826a18.441,18.441,0,0,1,10.016-3.394h.1c1.618.013,4.563.371,6.1,2.623,2.6,3.809-.429,10.6-6.618,14.826s-13.616,4.58-16.218.771M32.527,54.457c-3.182-3.781-4.4-7.84-3.418-11.434s4.11-6.5,8.8-8.139a24.311,24.311,0,0,1,4.245-1.053,27.735,27.735,0,0,0,.769,4.52,26.315,26.315,0,0,0-7.884,9.432,33.191,33.191,0,0,0-2.515,6.673m19.819,5.728a25.528,25.528,0,0,0,.659,4.459,35.692,35.692,0,0,1-5.241-1.015,34.137,34.137,0,0,1-8.99-3.866l.068,0c.037-.492.779-9,7.059-14.556a18.408,18.408,0,0,0,1.752,2.272,15.776,15.776,0,0,0,5.823,4.426,20.908,20.908,0,0,0-1.13,8.275m21.949-4.846c-.983,3.608-4.11,6.5-8.8,8.139a24.708,24.708,0,0,1-5.013,1.161A15.724,15.724,0,0,1,60.5,53.767a26.421,26.421,0,0,0,2.691.138,29.952,29.952,0,0,0,8.746-1.343c.891-.273,1.76-.588,2.608-.933a9.679,9.679,0,0,1-.255,3.709m-4.464-9.66c-8.017,2.46-16.086.312-17.62-4.69-.92-3,.846-5.872,1.981-7.317a20.45,20.45,0,0,1,9.978-6.448A22.8,22.8,0,0,1,70.816,26.2c5.4,0,9.871,2.12,10.973,5.711.92,3-.846,5.872-1.981,7.317a20.455,20.455,0,0,1-9.978,6.448" fill="#291f00"/>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
