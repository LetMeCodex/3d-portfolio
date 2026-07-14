import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SpiralAnimation } from './elixr';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = 'hidden';

    // Cinematic timeline
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        onComplete();
      }
    });

    // We start with everything hidden
    tl.set(".flash-word", { opacity: 0, scale: 0.8, filter: "blur(10px)" });
    tl.set(".main-name-char", { y: "150%", opacity: 0, rotateX: -90 });
    tl.set(".dot-i", { y: "-80vh", opacity: 0, scale: 0.5, filter: "blur(10px)" });
    tl.set(".dot-shockwave", { scale: 0, opacity: 0 });

    // 1. Cinematic fading words
    const wordDuration = 0.8;
    const wordStay = 0.4;

    tl.to(".flash-word-1", { opacity: 1, scale: 1, filter: "blur(0px)", duration: wordDuration, ease: "power2.out" })
      .to(".flash-word-1", { opacity: 0, scale: 1.1, filter: "blur(10px)", duration: wordDuration, ease: "power2.in" }, `+=${wordStay}`)

      .to(".flash-word-2", { opacity: 1, scale: 1, filter: "blur(0px)", duration: wordDuration, ease: "power2.out" }, "-=0.2")
      .to(".flash-word-2", { opacity: 0, scale: 1.1, filter: "blur(10px)", duration: wordDuration, ease: "power2.in" }, `+=${wordStay}`)

      .to(".flash-word-3", { opacity: 1, scale: 1, filter: "blur(0px)", duration: wordDuration, ease: "power2.out" }, "-=0.2")
      .to(".flash-word-3", { opacity: 0, scale: 1.1, filter: "blur(10px)", duration: wordDuration, ease: "power2.in" }, `+=${wordStay}`)

    // 2. The main monolithic text letters organically flip up
    .to(".main-name-char", {
      y: "0%",
      opacity: 1,
      rotateX: 0,
      duration: 1.0,
      stagger: 0.08,
      ease: "expo.out"
    }, "-=0.1")

    .addLabel("dotDrop", "-=0.3")

    // The dot drops from high above on the 'ı'
    .to(".dot-i", {
      y: 0,
      opacity: 1,
      scaleX: 0.8,
      scaleY: 1.2,
      filter: "blur(0px)",
      duration: 0.6,
      ease: "power3.in"
    }, "dotDrop")
    // Squash on impact
    .to(".dot-i", {
      scaleY: 0.4,
      scaleX: 1.6,
      y: 8,
      duration: 0.1,
      ease: "power2.out"
    })
    // Bounce back up
    .to(".dot-i", {
      scaleY: 1.1,
      scaleX: 0.9,
      y: -120,
      duration: 0.4,
      ease: "power2.out"
    })
    // Second fall
    .to(".dot-i", {
      scaleY: 1,
      scaleX: 1,
      y: 0,
      duration: 0.35,
      ease: "power2.in"
    })
    // Small squash
    .to(".dot-i", {
      scaleY: 0.7,
      scaleX: 1.3,
      y: 4,
      duration: 0.1,
      ease: "power2.out"
    })
    .to(".dot-i", {
      scaleY: 1,
      scaleX: 1,
      y: 0,
      duration: 0.2,
      ease: "elastic.out(1.5, 0.4)"
    })

    // Cinematic shockwave emitted from the dot on final impact
    .fromTo(".dot-shockwave",
      { scale: 0.2, opacity: 1, borderWidth: "3px", borderColor: "rgba(255,255,255,1)" },
      {
        scale: 6,
        opacity: 0,
        borderWidth: "1px",
        duration: 1.0,
        ease: "expo.out"
      },
      "-=0.2"
    )

    .addLabel("zoomForward", "+=0.3")

    // 3. Setup the mask position before explosion
    .add(() => {
      const dot = document.querySelector('.dot-i');
      const wrapper = document.querySelector('.preloader-bg-wrapper') as HTMLElement;
      if (dot && wrapper) {
        const rect = dot.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        wrapper.style.setProperty('--cx', `${cx}px`);
        wrapper.style.setProperty('--cy', `${cy}px`);
      }
    }, "+=0.1")

    // 4. Hide all letters
    .to(".main-name-char", {
      scale: 0.8,
      opacity: 0,
      filter: "blur(4px)",
      duration: 0.4,
      stagger: { amount: 0.1, from: "center" },
      ease: "power2.inOut"
    })

    // 5. Epic dot expansion into the background mask
    .to(".dot-i", {
      scale: 15,
      opacity: 0,
      duration: 0.4,
      ease: "power4.in"
    }, "<0.1")
    .to(".preloader-bg-wrapper", {
      "--hole-size": Math.max(window.innerWidth, window.innerHeight) * 1.5 + "px",
      duration: 1.2,
      ease: "expo.inOut"
    }, "<")

    // Finally hide the preloader wrapper entirely
    .set(containerRef.current, { display: "none" });

    return () => {
      tl.kill();
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] overflow-hidden pointer-events-none"
    >
      {/* Spiral Animation Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none preloader-bg-wrapper" 
        style={{ 
          WebkitMaskImage: 'radial-gradient(circle at var(--cx, 50%) var(--cy, 50%), transparent var(--hole-size, 0px), black var(--hole-size, 0px))',
          maskImage: 'radial-gradient(circle at var(--cx, 50%) var(--cy, 50%), transparent var(--hole-size, 0px), black var(--hole-size, 0px))'
        }}
      >
        <SpiralAnimation />
      </div>

      <div className="absolute inset-0 flex items-center justify-center z-20" style={{ perspective: '1200px' }}>
        {/* Rapid flash sequence layers */}
        <div className="absolute text-white font-mono uppercase tracking-[0.5em] text-xs md:text-sm flash-word flash-word-1">.imagine</div>
        <div className="absolute text-white font-mono uppercase tracking-[0.5em] text-xs md:text-sm flash-word flash-word-2">.design</div>
        <div className="absolute text-white font-mono uppercase tracking-[0.5em] text-xs md:text-sm flash-word flash-word-3">.create</div>

        {/* Beautiful Sequential Text Reveal */}
        <div ref={textWrapperRef} className="flex flex-col items-center justify-center py-10">
          <div className="main-name flex items-baseline tracking-tight pr-2">
            <span
              className="main-name-char block font-display font-[300] text-7xl md:text-[9rem] lg:text-[13rem] tracking-tighter text-white pr-1 md:pr-2 leading-none"
              style={{ transformStyle: 'preserve-3d' }}
            >
              d
            </span>

            <span className="relative flex flex-col items-center justify-end pr-1 md:pr-2 leading-none h-full pt-[0.15em]">
              {/* The falling dot */}
              <span className="dot-i absolute -top-[5%] w-[8px] h-[8px] md:w-[14px] md:h-[14px] lg:w-[20px] lg:h-[20px] bg-white rounded-full z-10" />
              <span className="dot-shockwave absolute -top-[5%] w-[8px] h-[8px] md:w-[14px] md:h-[14px] lg:w-[20px] lg:h-[20px] border border-white rounded-full z-0 opacity-0" />

              {/* The dotless i: ı */}
              <span
                className="main-name-char block font-display font-[300] text-7xl md:text-[9rem] lg:text-[13rem] tracking-tighter text-white leading-none"
                style={{ transformStyle: 'preserve-3d' }}
              >
                ı
              </span>
            </span>

            <span
              className="main-name-char block font-display font-[300] text-7xl md:text-[9rem] lg:text-[13rem] tracking-tighter text-white pr-1 md:pr-2 leading-none"
              style={{ transformStyle: 'preserve-3d' }}
            >
              s
            </span>
            <span
              className="main-name-char block font-display font-[300] text-7xl md:text-[9rem] lg:text-[13rem] tracking-tighter text-white pr-1 md:pr-2 leading-none"
              style={{ transformStyle: 'preserve-3d' }}
            >
              h
            </span>
            <span
              className="main-name-char block font-display font-[300] text-7xl md:text-[9rem] lg:text-[13rem] tracking-tighter text-white leading-none"
              style={{ transformStyle: 'preserve-3d' }}
            >
              a
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
