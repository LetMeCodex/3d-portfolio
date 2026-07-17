import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CloudDividerProps {
  bgColor?: string;
}

export function CloudDivider({ bgColor = '#F5F4F0' }: CloudDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs for individual cloud image layers and the mask group
  const cloud1Ref = useRef<SVGImageElement>(null);
  const cloud1MaskRef = useRef<SVGGElement>(null);
  const cloud2Ref = useRef<SVGImageElement>(null);
  const cloud3Ref = useRef<SVGImageElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom', // Start animating when the divider top enters the viewport bottom
          end: 'bottom bottom', // End when fully scrolled to the bottom
          scrub: true, // Snap to smooth scroll
        }
      });

      // Animate the cloud layers and the mask group together
      tl.fromTo(cloud1Ref.current, { y: -400 }, { y: 500, ease: 'power4.in' }, 0)
        .fromTo(cloud1MaskRef.current, { y: -400 }, { y: 500, ease: 'power4.in' }, 0)
        .fromTo(cloud2Ref.current, { y: -500 }, { y: 400, ease: 'power4.in' }, 0)
        .fromTo(cloud3Ref.current, { y: -450 }, { y: 450, ease: 'power4.in' }, 0);
    });

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute top-full left-0 w-full overflow-hidden pointer-events-none z-30 -translate-y-px select-none h-screen"
    >
      <svg
        className="w-full h-full block"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Mask that dynamically reveals the cream color block below/behind the clouds */}
          <mask id="cloud-mask">
            {/* The mask elements are flipped vertically to mask the top area */}
            <g transform="scale(1, -1) translate(0, -800)">
              {/* Wrap the rect and image in a group animated by GSAP so they move together */}
              <g ref={cloud1MaskRef}>
                {/* White background block */}
                <rect fill="#fff" width="100%" height="801" y="799" />
                {/* Cloud mask image */}
                <image 
                  href="https://assets.codepen.io/721952/cloud1Mask.jpg" 
                  width="1200" 
                  height="800"
                />
              </g>
            </g>
          </mask>
        </defs>

        {/* 
          Parallax Cloud Layers
          We wrap each layer in a group that is flipped Y (so curves point downwards into the sky).
          GSAP translates the image tags inside them relative to this flipped coordinate space.
        */}
        
        {/* Cloud 2 (Back layer) */}
        <g transform="scale(1, -1) translate(0, -800)">
          <image 
            ref={cloud2Ref}
            href="https://assets.codepen.io/721952/cloud2.png" 
            width="1200" 
            height="800"
          />
        </g>

        {/* Cloud 1 (Middle layer) */}
        <g transform="scale(1, -1) translate(0, -800)">
          <image 
            ref={cloud1Ref}
            href="https://assets.codepen.io/721952/cloud1.png" 
            width="1200" 
            height="800"
          />
        </g>

        {/* Cloud 3 (Front layer) */}
        <g transform="scale(1, -1) translate(0, -800)">
          <image 
            ref={cloud3Ref}
            href="https://assets.codepen.io/721952/cloud3.png" 
            width="1200" 
            height="800"
          />
        </g>

        {/* Opaque Cream block that gets revealed by the cloud mask */}
        <g mask="url(#cloud-mask)">
          <rect fill={bgColor} width="100%" height="100%" />
        </g>
      </svg>
    </div>
  );
}
