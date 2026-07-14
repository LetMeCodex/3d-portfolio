import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MinimalistHeroProps {
  logoText: string;
  navLinks: { label: string; href: string }[];
  mainText: string;
  readMoreLink: string;
  imageSrc: string;
  imageAlt: string;
  overlayText: {
    part1: string;
    part2: string;
  };
  socialLinks: { icon: LucideIcon; href: string }[];
  locationText: string;
  className?: string;
}

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    className="text-[10px] font-mono uppercase tracking-widest text-foreground/50 transition-colors hover:text-foreground"
  >
    {children}
  </a>
);

const SocialIcon = ({ href, icon: Icon }: { href: string; icon: LucideIcon }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-foreground/50 transition-colors hover:text-foreground">
    <Icon className="h-4 w-4" />
  </a>
);

export const MinimalistHero = ({
  logoText,
  navLinks,
  mainText,
  readMoreLink,
  imageSrc,
  imageAlt,
  overlayText,
  socialLinks,
  locationText,
  className,
}: MinimalistHeroProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'relative flex h-[100dvh] w-full flex-col items-center justify-between overflow-hidden bg-background text-foreground p-8 font-sans md:p-12',
        className
      )}
    >
      {/* Header */}
      <header className="z-30 flex w-full max-w-7xl items-center justify-between opacity-0"> {/* Hidden header since we have a global one but keeping structure for layout balance if needed, or we can just leave it invisible so it keeps the flex spacing */}
        <div className="text-xl font-bold tracking-wider">{logoText}</div>
      </header>

      {/* Main Content Area */}
      <div className="relative grid w-full max-w-7xl flex-grow grid-cols-1 items-center md:grid-cols-3">
        {/* Left Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="z-20 order-2 md:order-1 text-center md:text-left flex flex-col justify-center"
        >
          <p className="mx-auto max-w-[250px] font-mono text-[10px] uppercase tracking-widest leading-relaxed text-foreground/50 md:mx-0">{mainText}</p>
        </motion.div>

        {/* Center Image with Circle */}
        <div className="relative order-1 md:order-2 flex justify-center items-center h-full">
            <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0 }}
                className="absolute z-0 h-[300px] w-[300px] rounded-full bg-[#FF69B4]/10 border border-[#FF69B4]/15 shadow-[0_0_80px_rgba(255,105,180,0.15)] md:h-[450px] md:w-[450px]"
            ></motion.div>
            
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="relative z-10 w-48 md:w-64 h-[400px] md:h-[500px] overflow-hidden rounded-full shadow-[0_30px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(255,105,180,0.1)] border border-white/5"
            >
              {/* Internal glow overlay for seamless blending */}
              <div className="absolute inset-0 z-20 rounded-full shadow-[inset_0_0_50px_rgba(0,0,0,0.6)] pointer-events-none mix-blend-overlay border-[0.5px] border-white/10" />
              <div className="absolute inset-0 z-20 rounded-full shadow-[inset_0_0_20px_rgba(255,105,180,0.2)] pointer-events-none" />
              
              <img
                  src={imageSrc}
                  alt={imageAlt}
                  style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                  className="w-full h-full object-cover scale-[1.02] hover:scale-105 transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] saturate-[1.08] contrast-[1.05] brightness-[1.02] drop-shadow-lg"
                  onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = `https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop`;
                  }}
              />
            </motion.div>
        </div>

        {/* Right Text */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="z-20 order-3 flex flex-col items-center justify-center text-center md:items-start md:text-left md:pl-10"
        >
          <h1 className="text-5xl font-serif italic text-[#FF69B4] md:text-7xl lg:text-8xl leading-[0.9] tracking-tight drop-shadow-[0_0_15px_rgba(255,105,180,0.2)]">
            {overlayText.part1}
            <br />
            {overlayText.part2}
          </h1>
        </motion.div>
      </div>

      {/* Footer Elements */}
      <footer className="z-30 flex w-full max-w-7xl items-end justify-between pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center space-x-6"
        >
          {socialLinks.map((link, index) => (
            <SocialIcon key={index} href={link.href} icon={link.icon} />
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-[10px] font-mono tracking-widest uppercase text-foreground/50"
        >
          {locationText}
        </motion.div>
      </footer>
    </motion.div>
  );
};
