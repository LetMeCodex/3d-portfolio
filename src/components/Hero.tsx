import { useEffect, useRef } from 'react';
import { motion } from "motion/react";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { Logo } from './ui/Logo';
import { DishaNBCard } from './ui/DishaNBCard';
import { HandDrawnDoodle } from './ui/HandDrawnDoodle';
import { SleepingCat } from './ui/SleepingCat';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onOpenResume: (e: React.MouseEvent) => void;
}

export function Hero({ onOpenResume }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Reset scroll immediately on mount to prevent ScrollTrigger measuring at incorrect scroll positions
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    ScrollTrigger.clearScrollMemory();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo('.hero-title-line', 
        {
          y: "110%",
          opacity: 0,
          clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)"
        },
        {
          y: "0%",
          opacity: 1,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          duration: 1.5,
          stagger: 0.15,
          ease: 'power4.out'
        }
      )
      .from('.hero-character', {
          x: 100,
          opacity: 0,
          duration: 1.5,
          ease: 'power3.out'
        }, "-=1")
        .from('.hero-marquee', {
          opacity: 0,
          duration: 1
        }, "-=1")
        .from('.hero-doodle', {
          scale: 0,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'back.out(1.7)'
        }, "-=1");

      // Scroll Reveal for Page 2 Text
      const elements = gsap.utils.toArray<HTMLElement>('.reveal-text');
      elements.forEach((el) => {
        gsap.fromTo(el,
          { y: 40, opacity: 0 },
          {
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out'
          }
        );
      });

      // Transition Animation for Hero into IntroSection (Stacked Card Effect)
      const tlTransition = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "bottom bottom",
          pinSpacing: false,
          pin: true,
          scrub: true,
          onRefresh: () => {
            if (containerRef.current) {
              gsap.set(containerRef.current, {
                transformOrigin: "center " + (containerRef.current.offsetHeight - window.innerHeight / 2) + "px"
              });
            }
          }
        }
      });
      
      tlTransition.fromTo(
        containerRef.current,
        { y: 0, rotateX: 0, scale: 1, opacity: 1 },
        { y: 0, rotateX: 0, scale: 0.85, opacity: 0, duration: 1, ease: "none" }
      );

    }, containerRef);

    // Refresh layout heights and markers after the DOM settles
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full bg-[#F5F4F0] font-sans overflow-visible isolation-isolate"
    >
      {/* Brand Signature */}
      <div className="absolute top-0 left-[-50px] z-40">
        <Logo size="md" />
      </div>

      {/* ── PAGE 1 TEXT ── */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-between pt-[22vh] pb-[4vh] px-6 md:px-12 pointer-events-none">

        <div className="flex flex-col relative">
          <HandDrawnDoodle
            type="tornado"
            className="absolute -top-20 left-10 w-32 h-32 text-[#121212]/10 hero-doodle"
            color="#121212"
            delay={0.5}
          />

          <h1 className="hero-title-line relative text-[20vw] md:text-[15vw] font-black leading-[0.8] tracking-[-0.05em] text-[#89CFF0] uppercase m-0 p-0 pointer-events-auto w-fit">
            {/* The Sleeping Cat sitting on the A */}
            <div className="absolute top-[2%] right-[10%] md:top-[5%] md:right-[13%] z-20 scale-[0.7] md:scale-100">
              <SleepingCat />
            </div>
            DISHA
          </h1>
          <h1 className="hero-title-line text-[20vw] md:text-[15vw] font-black leading-[0.8] tracking-[-0.05em] text-[#E84855] uppercase m-0 p-0 relative">
            JAIN
            <HandDrawnDoodle
              type="swirl"
              className="absolute -right-20 -top-10 w-40 h-40 text-[#E84855]/20 hero-doodle"
              color="#E84855"
              delay={0.8}
            />
          </h1>
        </div>

        <div className="hero-title-line mt-12 md:mt-0 ml-0 md:ml-[15vw] max-w-[380px] pointer-events-auto relative">
          <p className="font-bold text-[16px] md:text-[20px] leading-[1.3] text-[#121212] uppercase">
            CRAFTING INTERACTIVE SPACES WHERE COMPLEX LOGIC MEETS INTUITIVE VISUAL SOUL.
          </p>
          <HandDrawnDoodle
            type="squiggle"
            className="absolute -bottom-8 left-0 w-full h-8 text-[#E84855]/40 hero-doodle"
            color="#E84855"
            delay={1}
          />
          <div className="w-5 h-5 rounded-full bg-[#E84855] mt-6 shadow-[0_0_15px_rgba(232,72,85,0.4)]" />
        </div>

        <div className="w-full overflow-hidden whitespace-nowrap hero-marquee flex text-[14px] md:text-[16px] font-black tracking-[0.2em] uppercase bg-[#E84855] text-white py-4 mt-auto transform -skew-y-1">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
            className="flex whitespace-nowrap"
          >
            {[
              "Brand Designer", "✦", "UI / UX Designer", "✦", "Visual Storyteller", "✦",
              "Creative Direction", "✦", "Identity Systems", "✦", "Interaction Design", "✦",
              "Typography Nerd", "✦", "Brand Designer", "✦", "UI / UX Designer", "✦"
            ].map((item, i) => (
              <span key={i} className={`mx-5 ${item === "✦" ? "opacity-50 text-[10px]" : ""}`}>{item}</span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── STICKY CHARACTER IMAGE (z-20) ── */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 mix-blend-darken">
        <div className="sticky top-0 w-full h-screen flex items-center justify-end pr-4 md:pr-[8%] lg:pr-[12%]">
          <div className="relative w-full md:w-[70%] lg:w-[60%] h-[80vh] md:h-[95vh] -mt-[25vh] hero-character">
            <img
              src="/disha-hero-cutout.webp"
              alt="Disha"
              className="w-full h-full object-contain object-center transform-gpu hero-character-inner scale-[1.3] lg:scale-[1.4]"
            />
          </div>
        </div>
      </div>

      {/* ── PAGE 2 TEXT ── */}
      <div className="relative z-30 w-full min-h-screen max-w-[1400px] mx-auto px-6 md:px-16 pt-[10vh] pb-[20vh] pointer-events-none text-[#121212]">

        <div className="reveal-text hidden lg:block absolute left-6 xl:left-12 top-[10vh] pointer-events-auto rotate-[-3deg] hover:rotate-0 transition-transform duration-500 ease-out">
          <DishaNBCard />
        </div>

        <div className="w-full md:w-[85%] lg:w-[75%] pointer-events-auto ml-auto text-right relative">
          <div className="reveal-text text-[32px] sm:text-[40px] md:text-[50px] lg:text-[60px] font-[800] leading-[1.05] tracking-[-0.04em]">
            Engineering, for me, is a way of exploring <span className="text-[#E84855] italic font-serif font-light relative">
              logic
              <HandDrawnDoodle
                type="sparkle"
                className="absolute -top-8 -left-8 w-12 h-12 text-[#FFD700]"
                color="#FFD700"
                delay={1.5}
              />
            </span> and translating it into pixel-perfect visual forms.
          </div>

          <div className="reveal-text mt-8 md:mt-10 text-[32px] sm:text-[40px] md:text-[50px] lg:text-[60px] font-[800] leading-[1.05] tracking-[-0.04em]">
            I enjoy building products that connect <span className="text-[#E84855] italic font-serif font-light relative inline-block">
              creative design
              <HandDrawnDoodle
                type="underline"
                className="absolute -bottom-2 left-0 w-full h-4 text-[#E84855]/30"
                color="#E84855"
                delay={1.8}
              />
            </span> with software architecture, seamless user experiences, and robust systems.
          </div>

          <div className="reveal-text mt-8 md:mt-10 text-[26px] sm:text-[32px] md:text-[40px] lg:text-[48px] font-[800] leading-[1.1] tracking-[-0.04em]">
            My process focuses on understanding the core mechanics of a system and experimenting with different technical approaches to execute it <span className="text-[#E84855] italic font-serif font-light relative inline-block">
              beautifully.
              <HandDrawnDoodle
                type="sparkle"
                className="absolute -bottom-6 -right-10 w-16 h-16 text-[#FFD700]"
                color="#FFD700"
                delay={2}
              />
            </span>
          </div>
        </div>

        <div className="reveal-text w-full flex justify-start mt-16 md:mt-24 pointer-events-auto relative">
          <HandDrawnDoodle
            type="arrow"
            className="absolute -top-20 left-40 w-24 h-24 text-[#121212] rotate-[140deg] hidden md:block"
            color="#121212"
            delay={2.2}
          />

          <button
            onClick={(e) => onOpenResume(e)}
            className="group relative flex items-center justify-center w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-full border-2 border-[#E84855]/30 overflow-hidden text-[#121212] transition-all duration-700 hover:scale-[1.02] bg-white/50 backdrop-blur-sm"
          >
            <span className="absolute inset-0 bg-[#E84855] scale-0 group-hover:scale-110 rounded-full transition-transform duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] origin-center z-0" />
            <div className="relative z-10 flex flex-col items-center gap-3 md:gap-4 group-hover:text-white transition-colors duration-500">
              <span className="font-sans text-[12px] md:text-[14px] font-black tracking-[0.2em] uppercase text-center leading-[1.6]">
                Let's Work<br />Together
              </span>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#121212] text-white flex items-center justify-center transition-colors duration-500 group-hover:bg-white group-hover:text-[#E84855]">
                <ArrowRight size={18} className="-rotate-45 group-hover:rotate-0 transition-transform duration-700 ease-[cubic-bezier(0.85,0,0.15,1)]" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>


  );
}
