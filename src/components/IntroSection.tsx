import React, { useRef } from 'react';
import { VideoScrollHero } from './ui/video-scroll-hero';

export function IntroSection({ onOpenAbout }: { onOpenAbout?: (e: React.MouseEvent) => void }) {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section 
      id="about"
      ref={sectionRef}
      className="relative w-full bg-transparent z-30"
    >
      {/* Video & Story Reveal Section */}
      <VideoScrollHero startScale={0.4} />
    </section>
  );
}
