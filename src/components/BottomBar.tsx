import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const technologies = [
  { name: "Frame Blox", icon: "O" },
  { name: "Supa Blox", icon: "O" },
  { name: "Hype Blox", icon: "||" },
  { name: "Hype Blox", icon: "||" },
  { name: "Ultra Blox", icon: ".." },
  { name: "Ship Blox", icon: "//" }
];

export function BottomBar() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.tech-item', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 1.5
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="border-t-2 border-foreground bg-background py-6 relative z-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-between items-center gap-8">
          {technologies.map((tech, i) => (
            <div key={i} className="tech-item flex items-center gap-3 font-display font-bold tracking-wide text-base">
              <span className="text-xl font-black">{tech.icon}</span>
              {tech.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
